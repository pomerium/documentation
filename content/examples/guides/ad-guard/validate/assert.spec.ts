import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for AdGuard Home: AdGuard has no SSO and trusts a single
// HTTP basic-auth credential. Pomerium authenticates the user, then injects that
// credential (Authorization: Basic ...) on every upstream request, so AdGuard's
// control API auto-authenticates and never shows its own login prompt.
const BASE = process.env.POMERIUM_URL as string;
// Same upstream, routed through Pomerium WITHOUT the injected credential.
const NOAUTH = BASE.replace("ad-guard.", "ad-guard-noauth.");

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("injected basic auth reaches AdGuard's control API authenticated as admin", async ({
  page,
}) => {
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

  // The control API only serves the profile to the credential it accepts, so a
  // 200 here confirms the injected credential authenticates as the admin user.
  const profile = await page.request.get(`${BASE}/control/profile`, {
    ignoreHTTPSErrors: true,
  });
  expect(
    profile.ok(),
    "AdGuard /control/profile should answer 200 to the injected admin credential",
  ).toBeTruthy();
  const me = await profile.json();
  expect(me.name, "the injected credential should authenticate as the admin user").toBe(
    "admin",
  );

  // Capture the authenticated dashboard for the guide.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "ad-guard-dashboard");
});

test("AdGuard rejects a request that skips Pomerium's injected credential", async ({
  page,
}) => {
  // The trust model rests on the injected basic-auth credential being what gates
  // access. A request to the same upstream through a Pomerium route that does NOT
  // inject the header arrives with no Authorization, so AdGuard's own basic auth
  // must reject it. AdGuard is no longer reachable directly from the test-runner
  // (it is on an internal-only network), so this no-injection route is how the
  // sealed test exercises the missing-credential path. This proves the guide's
  // warning that the injected secret is the only thing standing between a request
  // and admin access.
  await login(page, NOAUTH, alice);
  const res = await page.request.get(`${NOAUTH}/control/status`, { ignoreHTTPSErrors: true });
  expect(
    res.status(),
    "AdGuard must reject an authenticated user whose request carries no injected credential",
  ).toBe(401);
});

test("AdGuard is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: AdGuard IS serving through Pomerium (after SSO). This
  // proves the service is up, so the direct-hit failure below is caused by network
  // topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/control/status`, {
    ignoreHTTPSErrors: true,
  });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // Network isolation is the only trust boundary once a static credential is the
  // upstream's whole auth model, so it must be real: AdGuard sits on an
  // internal-only network shared with Pomerium alone. The test-runner is not on
  // that network, so a direct hit at adguard:3000 (bypassing Pomerium) must fail at
  // name resolution / connection, NOT with an HTTP response. Asserting the specific
  // error keeps a typo or a down service from masquerading as isolation.
  let directError = "";
  try {
    await page.request.get("http://adguard:3000/control/status", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  // AdGuard is on an internal-only network the runner is not attached to, so the
  // `adguard` alias does not resolve: the precise signal is a DNS-resolution /
  // connection failure, not a bare timeout (which could mask an unrelated hang).
  expect(
    directError,
    "AdGuard must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);
});
