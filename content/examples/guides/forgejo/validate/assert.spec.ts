import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Forgejo: after the Pomerium SSO login, Forgejo completes
// its OpenID Connect login against Pomerium's OIDC bridge and auto-provisions the
// SAME identity. The guide enables web UI sign-in only, so these checks verify the
// authenticated web session, not the API.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the Pomerium identity into the Forgejo web UI", async ({
  page,
}) => {
  await login(page, BASE, alice);

  // Forgejo's login page offers the Pomerium OAuth button. Click it if it is shown
  // (the bridge completes without a prompt when the Pomerium session is active).
  await page.goto(`${BASE}/user/login`, { waitUntil: "domcontentloaded" });
  const signIn = page.getByRole("link", { name: /pomerium/i });
  if (await signIn.first().isVisible().catch(() => false)) {
    await signIn.first().click();
    await page.waitForLoadState("domcontentloaded");
  }

  // The account settings page is only served to an authenticated session and shows
  // the signed-in user's email; an unauthenticated request would be bounced to login.
  await page.goto(`${BASE}/user/settings/account`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/user\/settings\/account$/);
  await expect(
    page.getByText(alice.email, { exact: false }).first(),
    "Forgejo should sign in the Pomerium identity via OIDC, not a local account",
  ).toBeVisible();

  // Capture the authenticated dashboard for the guide.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "forgejo-dashboard");
});

test("forgejo is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: forgejo IS reachable and serving through Pomerium (after
  // SSO). This proves the service is up, so the direct-hit failure below is caused by
  // network topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/`, { ignoreHTTPSErrors: true });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // The guide keeps forgejo off published ports: it sits on an internal-only
  // network shared with Pomerium alone. The test-runner is not on that network, so a direct hit at forgejo:3000
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
