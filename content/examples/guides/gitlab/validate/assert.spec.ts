import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for GitLab: after the Pomerium SSO login, GitLab completes
// its OpenID Connect login against Pomerium's OIDC bridge, auto-provisions the same
// identity, and GitLab's own API confirms the session. GitLab's local login form is
// never shown.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the Pomerium identity into GitLab", async ({ page }) => {
  await login(page, BASE, alice);

  // auto_sign_in_with_provider sends GitLab's sign-in straight to Pomerium, which
  // already has a session, so GitLab finishes its login without a prompt.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await expect(page.locator('input[name="user[password]"]')).toHaveCount(0);

  // GitLab's own API confirms the session belongs to the Pomerium identity, not a
  // local account. The request rides the same browser context, so it carries both
  // the Pomerium cookie and the GitLab session cookie.
  const res = await page.request.get(`${BASE}/api/v4/user`, { ignoreHTTPSErrors: true });
  expect(res.status(), "GitLab API should respond 200 for the OIDC session").toBe(200);
  const body = await res.json();
  expect(body.email, "GitLab should sign in the Pomerium identity").toBe(alice.email);

  await shot(page, "gitlab-dashboard");
});
