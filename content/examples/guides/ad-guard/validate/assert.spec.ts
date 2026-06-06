import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";

// App-specific success for AdGuard Home: AdGuard has no SSO and trusts a single
// HTTP basic-auth credential. Pomerium authenticates the user, then injects that
// credential (Authorization: Basic ...) on every upstream request, so AdGuard's
// control API auto-authenticates and never shows its own login prompt.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("injected basic auth reaches AdGuard's control API authenticated", async ({ page }) => {
  await login(page, BASE, alice);

  // AdGuard's control API requires HTTP basic auth and answers 401 without it.
  // Pomerium attaches the matching Authorization header to every upstream
  // request, so this call lands authenticated on the AdGuard dashboard API
  // (the status endpoint) rather than the login page.
  const res = await page.request.get(`${BASE}/control/status`, { ignoreHTTPSErrors: true });
  expect(
    res.ok(),
    "AdGuard /control/status should respond 200 via the injected basic-auth header",
  ).toBeTruthy();

  const status = await res.json();
  // Shape check: the status payload is what an authenticated AdGuard returns.
  // An unauthenticated 401 (or the install/login HTML) would not parse to this.
  expect(status.version, "AdGuard should return its server version").toBeTruthy();
  expect(
    status.running,
    "AdGuard should report a running, configured (past-install) server",
  ).toBe(true);
});

test("AdGuard rejects a direct request that skips Pomerium", async ({ page }) => {
  // The trust model rests on Pomerium being the only path to AdGuard: it owns the
  // injected basic-auth header. A request straight to adguard:3000 (on the same
  // Docker network, bypassing Pomerium) carries no credential, so AdGuard's own
  // basic auth must reject it. This is the flip side of the test above and proves
  // the direct-bypass warning in the guide's Security section.
  const res = await page.request.get("http://adguard:3000/control/status", {
    ignoreHTTPSErrors: true,
  });
  expect(
    res.status(),
    "AdGuard must reject an unauthenticated direct request (no injected header)",
  ).toBe(401);
});
