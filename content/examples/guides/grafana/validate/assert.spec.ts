import { test, expect, Page } from "@playwright/test";
import { login, alice, bob, TestUser } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Grafana, OIDC bridge tab: after the Pomerium SSO login,
// Grafana completes its generic OAuth login against Pomerium's OIDC bridge as the
// same identity, with no Grafana login page. Grafana's local sign-in (login form
// and basic auth) is turned off.
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

// Pomerium SSO, then Grafana's auto-login through the bridge.
async function signIn(page: Page, user: TestUser) {
  await login(page, BASE, user);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await expect(page).not.toHaveURL(/\/login/);
}

async function grafanaUser(page: Page) {
  const res = await page.request.get(`${BASE}/api/user`);
  expect(res.ok(), "Grafana /api/user should succeed after the OIDC login").toBeTruthy();
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

test("OIDC bridge signs the user in and creates the Grafana account", async ({ page }) => {
  // With GF_AUTH_GENERIC_OAUTH_AUTO_LOGIN, Grafana's login page starts the OIDC
  // login on its own, and the bridge completes it without a prompt because the
  // Pomerium session is active.
  await signIn(page, alice);

  const user = await grafanaUser(page);
  expect(user.email, "Grafana should sign in the Pomerium identity").toBe(alice.email);
  expect(user.login, "the username comes from the email claim").toBe(alice.email);
  expect(user.authLabels, "the account is managed by the OAuth login").toContain(
    "Generic OAuth",
  );

  await page.goto(`${BASE}/profile`, { waitUntil: "networkidle" });
  await shot(page, "grafana-profile");
});

test("the role expression makes the listed user a Grafana server admin", async ({
  page,
}) => {
  await signIn(page, alice);
  const user = await grafanaUser(page);
  expect(user.isGrafanaAdmin, "GrafanaAdmin should set the server admin flag").toBe(true);
  expect(await orgRole(page), "GrafanaAdmin also makes the user an org Admin").toBe("Admin");
});

test("everyone else allowed by the policy is a Viewer", async ({ page }) => {
  await signIn(page, charlie);
  const user = await grafanaUser(page);
  expect(user.email).toBe(charlie.email);
  expect(user.isGrafanaAdmin).toBe(false);
  expect(await orgRole(page)).toBe("Viewer");
});

test("browser writes pass Grafana's CSRF check", async ({ page }) => {
  // The OAuth login gives the browser a Grafana session cookie, so Grafana checks
  // that each write's Origin matches the Host it sees. Save a dashboard from the
  // page itself, so the browser sends its real Origin.
  await signIn(page, alice);
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

test("basic auth through Pomerium doesn't reach the local admin account", async ({
  page,
}) => {
  await signIn(page, charlie);
  // Per-request headers: page.setExtraHTTPHeaders doesn't apply to page.request.
  const res = await page.request.get(`${BASE}/api/user`, {
    headers: { Authorization: `Basic ${Buffer.from("admin:admin").toString("base64")}` },
  });
  const body = res.ok() ? await res.json() : {};
  expect(body.login, "a Viewer must not become the local admin").not.toBe("admin");
});

test("Grafana Live's websocket connects through Pomerium", async ({ page }) => {
  // Grafana Live streams dashboard updates over /api/live/ws. Without
  // allow_websockets on the route, Pomerium rejects the upgrade.
  await signIn(page, alice);
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
  await signIn(page, alice);

  // Grafana's /logout redirects to GF_AUTH_SIGNOUT_REDIRECT_URL, the route's
  // /.pomerium/sign_out, which ends the session without a confirmation page.
  await page.goto(`${BASE}/logout`);
  await page.waitForURL(/\/\.pomerium\/signed_out/, { timeout: 15000 });

  // Without a Pomerium session, auto-login can't sign the user back in.
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
  await signIn(page, alice);
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
