import { test, expect, Page } from "@playwright/test";
import { login, alice, bob, TestUser } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Open WebUI, Proxy headers tab: with
// WEBUI_AUTH_TRUSTED_EMAIL_HEADER set, Open WebUI trusts the email Pomerium forwards
// (X-Pomerium-Claim-Email), creates the account on first sight, and signs the user
// in from that header alone. Open WebUI's SPA signs in on its own, so Pomerium's SSO
// is the only prompt.
const BASE = process.env.POMERIUM_URL as string;

// Serial: Open WebUI makes the first account it creates an admin, so the order in
// which users first sign in matters.
test.describe.configure({ mode: "serial" });

// Seeded in _harness/keycloak/pomerium-e2e-users-0.json. Inside the route policy
// (company.com), and signs in after alice.
const charlie: TestUser = {
  email: "charlie@company.com",
  password: "password123",
  groups: ["engineering"],
  department: "engineering",
};

// Read the identity Open WebUI considers signed in. /api/v1/auths/ returns the
// current user for the browser's session, or 401 if there is no session.
async function whoami(page: Page, headers: Record<string, string> = {}) {
  // Per-request headers: page.setExtraHTTPHeaders doesn't apply to page.request.
  return page.request.get(`${BASE}/api/v1/auths/`, { headers });
}

// Pomerium SSO, then load the app and wait for Open WebUI's SPA to finish its
// trusted-header sign-in (POST /api/v1/auths/signin, no user input).
async function signIn(page: Page, user: TestUser) {
  await login(page, BASE, user);
  const signedIn = page.waitForResponse(
    (r) => r.url().includes("/api/v1/auths/signin") && r.status() === 200,
    { timeout: 30000 },
  );
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await signedIn;
}

// Dismiss Open WebUI's first-visit "What's New" dialog and sign-in toast, then open
// the user menu so the screenshot shows who is signed in.
async function showSignedInUser(page: Page) {
  const okay = page.getByRole("button", { name: "Okay, Let's Go!" });
  if (await okay.isVisible({ timeout: 5000 }).catch(() => false)) await okay.click();
  await expect(page.getByText("You're now logged in.")).toBeHidden({ timeout: 15000 });
  await page.locator("button:has(img[alt=\"Open User Profile Menu\"]):visible").first().click();
  await page.waitForTimeout(500);
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("the trusted header signs the user in and creates the Open WebUI account", async ({
  page,
}) => {
  await signIn(page, alice);

  const res = await whoami(page);
  expect(res.ok(), "Open WebUI should sign the user in from the trusted header").toBeTruthy();
  const user = await res.json();
  expect(user.email, "Open WebUI should sign in the Pomerium identity").toBe(alice.email);
  expect(user.role, "the first account Open WebUI creates is an admin").toBe("admin");

  // Open WebUI keeps a Socket.IO connection open, so the page never reaches
  // "networkidle". Wait for the message input instead.
  await expect(page.locator("#message-input-container")).toBeVisible({ timeout: 30000 });
  await showSignedInUser(page);
  await shot(page, "llm-proxy-headers");
});

test("later users are created in the pending role", async ({ page }) => {
  await signIn(page, charlie);
  const user = await (await whoami(page)).json();
  expect(user.email).toBe(charlie.email);
  expect(user.role, "users after the first wait for an admin to approve them").toBe("pending");
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Account Activation Pending")).toBeVisible({ timeout: 30000 });
});

test("a forged trusted-email header is replaced by Pomerium", async ({ page }) => {
  await signIn(page, alice);

  // A client that sends X-Pomerium-Claim-Email through Pomerium is still seen as its
  // real identity: Pomerium overwrites the header with the authenticated user's email.
  const res = await whoami(page, { "X-Pomerium-Claim-Email": "attacker@evil.com" });
  expect(res.ok(), "Open WebUI should still report the real identity").toBeTruthy();
  const user = await res.json();
  expect(user.email, "a forged header must not change the signed-in identity").toBe(
    alice.email,
  );

  // A fresh sign-in with the forged header also lands on the real identity.
  const signin = await page.request.post(`${BASE}/api/v1/auths/signin`, {
    headers: { "X-Pomerium-Claim-Email": "attacker@evil.com" },
    data: { email: "", password: "" },
  });
  expect(signin.ok()).toBeTruthy();
  expect((await signin.json()).email).toBe(alice.email);
});

test("streamed responses connect over a websocket through Pomerium", async ({ page }) => {
  // Open WebUI streams chat responses over Socket.IO at /ws/socket.io. Without
  // allow_websockets on the route, Pomerium rejects the upgrade.
  await signIn(page, alice);
  const result = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const ws = new WebSocket(`wss://${location.host}/ws/socket.io/?EIO=4&transport=websocket`);
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

test("Open WebUI sign-out also ends the Pomerium session", async ({ page }) => {
  await signIn(page, alice);

  // What Open WebUI's Sign Out menu item does: POST /api/v1/auths/signout, then
  // follow the redirect_url it returns, WEBUI_AUTH_SIGNOUT_REDIRECT_URL.
  const redirect = await page.evaluate(async () => {
    const res = await fetch("/api/v1/auths/signout", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    return (await res.json()).redirect_url as string;
  });
  expect(redirect).toBe(`${BASE}/.pomerium/sign_out`);
  await page.goto(redirect);
  await page.waitForURL(/\/\.pomerium\/signed_out/, { timeout: 15000 });

  // Without a Pomerium session, no trusted header is sent, so no one is signed in.
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("a user outside the policy is blocked before Open WebUI", async ({ page }) => {
  await login(page, BASE, bob);
  const res = await page.request.get(BASE);
  expect(res.status(), "Pomerium should deny a user outside the policy").toBe(403);
});

test("Open WebUI is not reachable except through Pomerium", async ({ page }) => {
  // If the runner could reach the upstream directly, it could set the trusted header
  // itself and sign in as anyone.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/health`);
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  let directError = "";
  try {
    await page.request.get("http://open-webui:8080/api/v1/auths/signin", {
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "Open WebUI must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN|Timeout/i);
});
