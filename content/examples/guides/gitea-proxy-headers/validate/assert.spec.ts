import { test, expect } from "@playwright/test";
import { login, alice, bob } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Gitea: after the Pomerium SSO login, Gitea's
// reverse-proxy authentication signs in (and auto-provisions) the SAME identity
// from the forwarded X-Pomerium-* headers. The guide enables web UI sign-in only,
// so these checks verify the authenticated web session, not the API.
const BASE = process.env.POMERIUM_URL as string;
test.describe.configure({ mode: "serial" });

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("reverse-proxy auth signs the Pomerium identity into the Gitea web UI", async ({
  page,
}) => {
  await login(page, BASE, alice);

  // Pomerium injects the identity headers on every upstream request. Gitea reads
  // them, auto-provisions the account on first visit, and signs the user in. The
  // account settings page is only served to an authenticated session.
  await page.goto(`${BASE}/user/settings/account`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/user\/settings\/account$/);
  await expect(
    page.getByText(alice.email, { exact: false }).first(),
    "Gitea should sign in the Pomerium-forwarded identity, not a local account",
  ).toBeVisible();

  // Capture the dashboard and the auto-provisioned profile for the guide. These
  // land in img/gitea/ (validate/img-dir.txt), next to the OIDC bridge images.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "gitea-proxy-headers-dashboard");
  await page.goto(`${BASE}/user/settings`, { waitUntil: "domcontentloaded" });
  const username = await page.locator('input[name="name"]').inputValue();
  expect(username, "the username should come from the sub claim").not.toBe("");
  await page.goto(`${BASE}/${username}`, { waitUntil: "networkidle" });
  await shot(page, "gitea-proxy-headers-profile");
});

test("Gitea sees its public host, so it doesn't warn about ROOT_URL", async ({ page }) => {
  // Gitea builds window.config.appUrl from the request's Host header and warns
  // administrators when it doesn't match the page URL. preserve_host_header on
  // the route passes the public host; without it Gitea sees http://gitea:3000.
  await login(page, BASE, alice);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const appUrl = await page.evaluate(() => (window as any).config?.appUrl as string);
  expect(appUrl, "Gitea should detect the public URL, not gitea:3000").toBe(`${BASE}/`);
});

test("the first header-provisioned account is not an administrator", async ({ page }) => {
  // Unlike OIDC sign-in, Gitea's reverse-proxy auto-registration skips the
  // "first user becomes admin" step, so the guide promotes the account from the
  // CLI. Guard that behavior so the guide's step stays necessary and correct.
  await login(page, BASE, alice);
  const admin = await page.request.get(`${BASE}/-/admin`, { maxRedirects: 0 });
  expect(admin.status(), "the first account should not reach Site Administration").not.toBe(200);
});

test("Pomerium overwrites a spoofed identity header", async ({ page }) => {
  await login(page, BASE, alice);
  // A client that forges X-Pomerium-* through Pomerium must still be signed in as
  // its real identity. Pomerium overwrites the inbound headers with the
  // authenticated user before the request reaches Gitea.
  await page.setExtraHTTPHeaders({
    "X-Pomerium-Sub": "attacker",
    "X-Pomerium-Claim-Email": "attacker@evil.com",
    "X-Pomerium-Claim-Name": "Attacker",
  });
  await page.goto(`${BASE}/user/settings/account`, { waitUntil: "domcontentloaded" });
  await expect(
    page.getByText(alice.email, { exact: false }).first(),
    "a spoofed header must not change the authenticated identity",
  ).toBeVisible();
  await expect(page.getByText("attacker@evil.com", { exact: false })).toHaveCount(0);
});

test("Gitea sign-out also ends the Pomerium session", async ({ page }) => {
  await login(page, BASE, alice);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // REVERSE_PROXY_LOGOUT_REDIRECT sends the browser to Pomerium's sign-out
  // endpoint after Gitea ends its own session. The link sits in a closed
  // dropdown, so dispatch the click directly.
  await page
    .locator('[data-url$="/user/logout"], a[href$="/user/logout"]')
    .first()
    .dispatchEvent("click");
  // Gitea's /user/logout sends the browser to the route's /.pomerium/sign_out,
  // which signs the request and ends the session without a confirmation page.
  await page.waitForURL(/\/\.pomerium\/signed_out/, { timeout: 15000 });
  await expect(page.locator("body")).toContainText(/logged out/i);

  // Without a Pomerium session, Gitea is behind the IdP sign-in again.
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("a user outside the policy is blocked before Gitea", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.getByLabel(/username/i).fill(bob.email);
  await page.getByLabel("Password", { exact: true }).fill(bob.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.locator("body")).toContainText(/403|Forbidden/);
});

test("gitea is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: gitea IS reachable through Pomerium after SSO, so the
  // direct-hit failure below is caused by network topology, not a dead endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/`, { ignoreHTTPSErrors: true });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // Network isolation is the only trust boundary for header auth: a direct hit at
  // gitea:3000 must fail at name resolution / connection, not with an HTTP response.
  let directError = "";
  try {
    await page.request.get("http://gitea:3000/", { ignoreHTTPSErrors: true, timeout: 5000 });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "gitea must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN/i);
});
