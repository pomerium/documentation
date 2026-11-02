import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Gitea: after the Pomerium SSO login, Gitea completes
// its OpenID Connect login against Pomerium's OIDC bridge and auto-provisions the
// SAME identity. The guide enables web UI sign-in only, so these checks verify the
// authenticated web session, not the API.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({
  page,
}) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the Pomerium identity into the Gitea web UI", async ({
  page,
}) => {
  await login(page, BASE, alice);

  // No click: LANDING_PAGE sends the signed-out visitor to /user/login, Gitea
  // skips its login page for the only OAuth source, and the bridge completes
  // without a prompt because the Pomerium session is active.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await expect(
    page.locator('a[href$="/user/logout"]').first(),
    "visiting Gitea should sign the user in without a click",
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /sign in with pomerium/i }),
    "Gitea should skip its login page for the only OAuth source",
  ).toHaveCount(0);

  // The account settings page is only served to an authenticated session and shows
  // the signed-in user's email; an unauthenticated request would be bounced to login.
  await page.goto(`${BASE}/user/settings/account`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/user\/settings\/account$/);
  await expect(
    page.getByText(alice.email, { exact: false }).first(),
    "Gitea should sign in the Pomerium identity via OIDC, not a local account",
  ).toBeVisible();

  // Capture the authenticated dashboard for the guide.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "gitea-dashboard");
});

test("Gitea sign-out also ends the Pomerium session", async ({ page }) => {
  await login(page, BASE, alice);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // Gitea's own sign-out redirects to the end_session_endpoint that Pomerium's
  // discovery document advertises (/.pomerium/sign_out).
  await page.goto(`${BASE}/user/logout`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  // Without a Pomerium session, Gitea is behind the IdP sign-in again.
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("gitea is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: gitea IS reachable and serving through Pomerium (after
  // SSO). This proves the service is up, so the direct-hit failure below is caused by
  // network topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/`, {
    ignoreHTTPSErrors: true,
  });
  expect(
    viaPomerium.ok(),
    "the route through Pomerium should work",
  ).toBeTruthy();

  // The guide keeps gitea off published ports: it sits on an internal-only
  // network shared with Pomerium alone. The test-runner is not on that network, so a direct hit at gitea:3000
  // (bypassing Pomerium) must fail at name resolution / connection, NOT with an HTTP
  // response. Asserting the specific error keeps a typo or a down service from
  // masquerading as isolation.
  let directError = "";
  try {
    await page.request.get("http://gitea:3000/", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "gitea must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN/i);
});
