import { test, expect } from "@playwright/test";
import { login, alice, bob } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Open WebUI: with WEBUI_AUTH_TRUSTED_EMAIL_HEADER set,
// Open WebUI trusts the email Pomerium forwards (X-Pomerium-Claim-Email), provisions
// the account on first sight, and signs the user in from that header alone. The user
// never sees Open WebUI's own login form: Open WebUI's SPA establishes the session
// from the trusted header automatically, so Pomerium's SSO is the only prompt.
const BASE = process.env.POMERIUM_URL as string;

// Read the identity Open WebUI considers signed in. /api/v1/auths/ returns the
// current user for the browser's session, or 401 if there is no session.
async function whoami(page: import("@playwright/test").Page) {
  return page.request.get(`${BASE}/api/v1/auths/`, { ignoreHTTPSErrors: true });
}

// Load the app and wait for Open WebUI's SPA to finish its trusted-header signin
// (it issues POST /api/v1/auths/signin on its own, no user input), so the session
// cookie is set before we read identity. Deterministic instead of racing networkidle.
async function openSignedIn(page: import("@playwright/test").Page) {
  const signedIn = page.waitForResponse(
    (r) => r.url().includes("/api/v1/auths/signin") && r.status() === 200,
    { timeout: 30000 },
  );
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await signedIn;
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("trusted-header SSO signs the Pomerium identity into Open WebUI", async ({ page }) => {
  // Complete the Pomerium SSO login once. From here the browser carries the Pomerium
  // session, so Pomerium decorates every upstream request with X-Pomerium-Claim-Email.
  await login(page, BASE, alice);

  // Load the app the way a real user does: Open WebUI's SPA signs in from
  // X-Pomerium-Claim-Email on its own (no password, no form). We assert the OUTCOME
  // of that handshake, not a login the test performs: the session now belongs to alice.
  await openSignedIn(page);

  const res = await whoami(page);
  expect(res.ok(), "Open WebUI should have signed the user in from the trusted header").toBeTruthy();

  const user = await res.json();
  expect(user.email, "Open WebUI should sign in the Pomerium identity").toBe(alice.email);

  // Capture the signed-in Open WebUI UI for the guide.
  await shot(page, "llm");
});

test("Pomerium overwrites a spoofed trusted-email header", async ({ page }) => {
  await login(page, BASE, alice);
  await openSignedIn(page);

  // The trust model rests on Pomerium owning X-Pomerium-Claim-Email. A client that
  // forges that header THROUGH Pomerium must still be seen as its real identity:
  // Pomerium strips/overwrites inbound X-Pomerium-* headers with the authenticated
  // user before the request reaches Open WebUI, so the forged value never arrives.
  // This is exactly why network isolation (the next test) is required: Open WebUI
  // trusts the header, so the only thing standing between an attacker and a forged
  // identity is that Pomerium is the sole path that can set it.
  const res = await page.request.get(`${BASE}/api/v1/auths/`, {
    ignoreHTTPSErrors: true,
    headers: {
      "X-Pomerium-Claim-Email": "attacker@evil.com",
      "X-Pomerium-Claim-Groups": "engineering",
    },
  });
  expect(res.ok(), "Open WebUI should still report the real identity").toBeTruthy();

  const user = await res.json();
  expect(
    user.email,
    "a spoofed trusted-email header must not change the signed-in identity",
  ).toBe(alice.email);
});

test("the upstream is unreachable except through Pomerium", async ({ page }) => {
  // Network isolation is the other half of the trust boundary: Open WebUI is on an
  // internal-only network shared solely with Pomerium. The test-runner sits on the
  // default network, so a direct hit to open-webui:8080 must fail (DNS/connection
  // error) while the same flow THROUGH Pomerium works. If the runner could reach the
  // upstream directly, it could forge the trusted header and impersonate anyone.
  const direct = page.request.get("http://open-webui:8080/api/v1/auths/", {
    ignoreHTTPSErrors: true,
    timeout: 5000,
  });
  await expect(
    direct,
    "test-runner must NOT be able to reach Open WebUI directly (network isolation)",
  ).rejects.toThrow();

  // The same route through Pomerium works after SSO.
  await login(page, BASE, alice);
  await openSignedIn(page);
  const viaPomerium = await whoami(page);
  expect(viaPomerium.ok(), "the route through Pomerium must still work").toBeTruthy();
});

test("a policy-denied user is blocked by Pomerium before reaching Open WebUI", async ({ page }) => {
  // bob authenticates at the IdP but is a contractor, not in the engineering group the
  // route requires, so Pomerium must reject him with 403 before the upstream is hit.
  await login(page, BASE, bob);

  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "Pomerium should deny a user outside the allowed group").toBe(403);
});
