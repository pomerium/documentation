import { test, expect } from "@playwright/test";
import { login, alice, bob } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Open WebUI: after the Pomerium SSO login, Open WebUI
// completes its own OIDC login against Pomerium's OIDC bridge as the same identity.
// The login form is disabled, so the user never types an Open WebUI password.
const BASE = process.env.POMERIUM_URL as string;

// Read the identity Open WebUI considers signed in. /api/v1/auths/ returns the
// current user for the browser's session, or 401 if there is no session.
async function whoami(page: import("@playwright/test").Page) {
  return page.request.get(`${BASE}/api/v1/auths/`, { ignoreHTTPSErrors: true });
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the Pomerium identity into Open WebUI", async ({ page }) => {
  await login(page, BASE, alice);

  // Start Open WebUI's OIDC login. Pomerium already has a session, so the bridge
  // redirects straight back to Open WebUI's callback with no prompt.
  await page.goto(`${BASE}/oauth/oidc/login`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const res = await whoami(page);
  expect(res.ok(), "Open WebUI should have signed the user in through the bridge").toBeTruthy();

  const user = await res.json();
  expect(user.email, "Open WebUI should sign in the Pomerium identity").toBe(alice.email);

  // Capture the signed-in Open WebUI UI for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "llm");
});

test("Open WebUI starts the OIDC login without a button click", async ({ page }) => {
  await login(page, BASE, alice);

  // With OAUTH_AUTO_REDIRECT=true, Open WebUI's /auth page sends the browser to the
  // bridge on its own, so loading it is enough to end up signed in.
  await page.goto(`${BASE}/auth`, { waitUntil: "domcontentloaded" });
  await expect
    .poll(async () => (await whoami(page)).status(), {
      message: "Open WebUI should sign in through the bridge without a click",
      timeout: 15000,
    })
    .toBe(200);
});

test("the upstream is unreachable except through Pomerium", async ({ page }) => {
  // Open WebUI is on an internal-only network shared solely with Pomerium. The
  // test-runner sits on the default network, so a direct hit to open-webui:8080 must
  // fail (DNS/connection error) while the same flow THROUGH Pomerium works.
  let directError = "";
  try {
    await page.request.get("http://open-webui:8080/api/v1/auths/", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "direct dial to Open WebUI should be refused, not routed (network isolation)",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);

  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/health`, { ignoreHTTPSErrors: true });
  expect(viaPomerium.ok(), "the route through Pomerium must still work").toBeTruthy();
});

test("a policy-denied user is blocked by Pomerium before reaching Open WebUI", async ({ page }) => {
  // bob authenticates at the IdP but is a contractor, not in the engineering group the
  // route requires, so Pomerium must reject him with 403 before the upstream is hit.
  await login(page, BASE, bob);

  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "Pomerium should deny a user outside the allowed group").toBe(403);
});
