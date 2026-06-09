import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Forgejo: after the Pomerium SSO login, Forgejo's
// reverse-proxy authentication signs in (and auto-provisions) the SAME identity
// from the forwarded X-Pomerium-* headers. The guide enables web UI sign-in only,
// so these checks verify the authenticated web session, not the API.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("reverse-proxy auth signs the Pomerium identity into the Forgejo web UI", async ({
  page,
}) => {
  await login(page, BASE, alice);

  // The browser session now carries Pomerium's cookie, so Pomerium injects the
  // identity headers on every upstream request. Forgejo's reverse-proxy auth reads
  // them, auto-provisions the account on first visit, and signs the user in. The
  // account settings page is only served to an authenticated session and shows the
  // signed-in user's email; an unauthenticated request would be bounced to login.
  await page.goto(`${BASE}/user/settings/account`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/user\/settings\/account$/);
  await expect(
    page.getByText(alice.email, { exact: false }).first(),
    "Forgejo should sign in the Pomerium-forwarded identity, not a local account",
  ).toBeVisible();

  // Capture the authenticated dashboard for the guide.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "forgejo-dashboard");
});

test("Pomerium overwrites a spoofed identity header", async ({ page }) => {
  await login(page, BASE, alice);

  // The trust model rests on Pomerium owning the identity header: a client that
  // forges X-Pomerium-* through Pomerium must still be signed in as its real
  // identity, never the spoofed one. Pomerium overwrites the inbound headers with
  // the authenticated user before the request reaches Forgejo. The settings page
  // still renders alice, not the attacker.
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
  await expect(
    page.getByText("attacker@evil.com", { exact: false }),
    "the spoofed identity must never appear",
  ).toHaveCount(0);
});

test("forgejo is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: forgejo IS reachable and serving through Pomerium (after
  // SSO). This proves the service is up, so the direct-hit failure below is caused by
  // network topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/`, { ignoreHTTPSErrors: true });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // Network isolation is the only trust boundary for header reverse-proxy auth, so
  // it must be real: forgejo sits on an internal-only network shared with Pomerium
  // alone. The test-runner is not on that network, so a direct hit at forgejo:3000
  // (bypassing Pomerium) must fail at name resolution / connection, NOT with an HTTP
  // response. Asserting the specific error keeps a typo or a down service from
  // masquerading as isolation.
  let directError = "";
  try {
    await page.request.get("http://forgejo:3000/", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "forgejo must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN/i);
});
