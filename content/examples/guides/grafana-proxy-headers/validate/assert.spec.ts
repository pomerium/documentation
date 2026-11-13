import { test, expect, Page } from "@playwright/test";
import { login, alice, bob, TestUser } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Grafana, Proxy headers tab: after the Pomerium SSO
// login, Grafana's JWT authentication verifies the X-Pomerium-Jwt-Assertion header
// Pomerium forwards on every request and signs in (and auto-provisions) the same
// identity. Grafana's local sign-in (login form and basic auth) is turned off.
const BASE = process.env.POMERIUM_URL as string;
test.describe.configure({ mode: "serial" });

// Seeded in _harness/keycloak/pomerium-e2e-users-0.json. Inside the route policy
// (company.com) but not in the guide's administrator list.
const charlie: TestUser = {
  email: "charlie@company.com",
  password: "password123",
  groups: ["engineering"],
  department: "engineering",
};

async function grafanaUser(page: Page, headers: Record<string, string> = {}) {
  // Per-request headers: page.setExtraHTTPHeaders doesn't apply to page.request.
  const res = await page.request.get(`${BASE}/api/user`, { headers });
  expect(res.ok(), "Grafana /api/user should succeed through Pomerium").toBeTruthy();
  return res.json();
}

async function orgRole(page: Page): Promise<string> {
  const res = await page.request.get(`${BASE}/api/user/orgs`);
  expect(res.ok()).toBeTruthy();
  const orgs = await res.json();
  return orgs[0]?.role;
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("the forwarded JWT signs the user in and creates the Grafana account", async ({
  page,
}) => {
  await login(page, BASE, alice);

  // No Grafana login page: the first page after the IdP is Grafana itself.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await expect(page).not.toHaveURL(/\/login/);

  const user = await grafanaUser(page);
  expect(user.email, "Grafana should sign in the Pomerium identity").toBe(alice.email);
  expect(user.login, "the username comes from the email claim").toBe(alice.email);
  expect(user.authLabels, "the account is managed by JWT auth").toContain("JWT");

  await page.goto(`${BASE}/profile`, { waitUntil: "networkidle" });
  await expect(page.getByText(/Synced via JWT/i).first()).toBeVisible();
  await shot(page, "grafana-proxy-headers-profile");
});

test("the role expression makes the listed user a Grafana server admin", async ({
  page,
}) => {
  await login(page, BASE, alice);
  const user = await grafanaUser(page);
  expect(user.isGrafanaAdmin, "GrafanaAdmin should set the server admin flag").toBe(true);
  expect(await orgRole(page), "GrafanaAdmin also makes the user an org Admin").toBe("Admin");
});

test("everyone else allowed by the policy is a Viewer", async ({ page }) => {
  await login(page, BASE, charlie);
  const user = await grafanaUser(page);
  expect(user.email).toBe(charlie.email);
  expect(user.isGrafanaAdmin).toBe(false);
  expect(await orgRole(page)).toBe("Viewer");
});

test("browser writes pass Grafana's CSRF check", async ({ page }) => {
  // Grafana rejects state-changing requests whose Origin doesn't match the Host
  // it sees, when a Grafana session cookie is present. Save a dashboard from the
  // page itself, so the browser sends its real Origin.
  await login(page, BASE, alice);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const status = await page.evaluate(async () => {
    const res = await fetch("/api/dashboards/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dashboard: { title: "CSRF check" }, overwrite: true }),
    });
    return res.status;
  });
  expect(status, "saving a dashboard from the browser should succeed").toBe(200);
});

test("a forged X-Pomerium-Jwt-Assertion header is replaced by Pomerium", async ({
  page,
}) => {
  await login(page, BASE, alice);
  // An unsigned token claiming another identity. Pomerium overwrites the header
  // with the signed assertion for the authenticated user.
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const forged = `${b64({ alg: "none", typ: "JWT" })}.${b64({
    sub: "attacker",
    email: "attacker@evil.com",
  })}.`;
  const user = await grafanaUser(page, { "X-Pomerium-Jwt-Assertion": forged });
  expect(user.email, "a forged header must not change the identity").toBe(alice.email);
});

test("basic auth through Pomerium doesn't reach the local admin account", async ({
  page,
}) => {
  await login(page, BASE, alice);
  const user = await grafanaUser(page, {
    Authorization: `Basic ${Buffer.from("admin:admin").toString("base64")}`,
  });
  expect(user.login, "the request should stay signed in as the JWT identity").toBe(
    alice.email,
  );
});

test("Grafana Live's websocket connects through Pomerium", async ({ page }) => {
  // Grafana Live streams dashboard updates over /api/live/ws. Without
  // allow_websockets on the route, Pomerium rejects the upgrade.
  await login(page, BASE, alice);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const result = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const ws = new WebSocket(`wss://${location.host}/api/live/ws`);
        ws.onopen = () => {
          ws.close();
          resolve("open");
        };
        ws.onerror = () => resolve("error");
        setTimeout(() => resolve("timeout"), 10000);
      }),
  );
  expect(result, "the websocket upgrade should succeed").toBe("open");
});

test("Grafana sign-out also ends the Pomerium session", async ({ page }) => {
  await login(page, BASE, alice);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // Grafana's /logout redirects to GF_AUTH_SIGNOUT_REDIRECT_URL, the route's
  // /.pomerium/sign_out, which ends the session without a confirmation page.
  await page.goto(`${BASE}/logout`);
  await page.waitForURL(/\/\.pomerium\/signed_out/, { timeout: 15000 });

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("a user outside the policy is blocked before Grafana", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.getByLabel(/username/i).fill(bob.email);
  await page.getByLabel("Password", { exact: true }).fill(bob.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.locator("body")).toContainText(/403|Forbidden/);
});

test("grafana is not reachable except through Pomerium", async ({ page }) => {
  // Positive control: Grafana answers through Pomerium.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/api/health`);
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  let directError = "";
  try {
    await page.request.get("http://grafana:3000/api/health", { timeout: 5000 });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "grafana must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN|Timeout/i);
});
