import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Real end-to-end test for the Paperless-ngx front-door gate. Pomerium makes the
// access decision; Paperless-ngx keeps its own Django login on top. This drives the
// whole chain: an unauthenticated request is bounced to the IdP, an allowed user
// passes the gate, and Paperless-ngx then serves its own sign-in page (HTTP 200
// with the Paperless-ngx login markers) behind that gate. A final negative control
// proves the upstream is reachable only through Pomerium.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("allowed user passes the gate and reaches the Paperless-ngx login", async ({ page }) => {
  await login(page, BASE, alice);

  // Past the Pomerium gate, Paperless-ngx serves its own Django sign-in page.
  // preserve_host_header keeps Django's ALLOWED_HOSTS / CSRF checks satisfied, so a
  // 400 here would flag a host-header misconfiguration rather than a dead upstream.
  const res = await page.request.get(`${BASE}/accounts/login/`, { ignoreHTTPSErrors: true });
  expect(
    res.status(),
    "Paperless-ngx should serve its login page (200) behind the Pomerium gate",
  ).toBe(200);

  const body = await res.text();
  // Shape check: the Django sign-in page carries the Paperless-ngx brand and the
  // login/password form fields. A Pomerium error page or a Django 400 would not.
  expect(body, "response should be the Paperless-ngx sign-in page").toContain("Paperless-ngx");
  expect(body, "the sign-in page should render its login field").toContain('name="login"');
  expect(body, "the sign-in page should render its password field").toContain('name="password"');

  // Render the gated login page in the browser and capture it for the guide.
  await page.goto(`${BASE}/accounts/login/`, { waitUntil: "networkidle" });
  await expect(page.locator('input[name="login"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await shot(page, "paperless-login");
});

test("Paperless-ngx is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: Paperless IS serving through Pomerium (after SSO). This
  // proves the service is up, so the direct-hit failure below is caused by network
  // topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/accounts/login/`, {
    ignoreHTTPSErrors: true,
  });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // Paperless sits on an internal-only network shared with Pomerium alone. The
  // test-runner is not on that network, so a direct hit at paperless:8000
  // (bypassing Pomerium) must fail at name resolution / connection, NOT with an
  // HTTP response. Asserting the specific error keeps a typo or a down service from
  // masquerading as isolation.
  let directError = "";
  try {
    await page.request.get("http://paperless:8000/accounts/login/", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "Paperless must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);
});
