import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Real end-to-end test for the GitLab front-door gate. Pomerium makes the access
// decision; GitLab keeps its own login on top. This drives the whole chain: an
// unauthenticated request is bounced to the IdP, an allowed user passes the gate,
// then signs in to GitLab itself as root, and GitLab's own API confirms the
// authenticated session reached GitLab through Pomerium.
//
// ROOT_PW is the throwaway root password for this sealed, ephemeral GitLab (set via
// initial_root_password in compose.validate.yaml). It is a test-fixture credential
// for a localhost-only container destroyed after the run, in the same spirit as the
// harness's committed alice/password123 and pomerium-e2e-secret.
const BASE = process.env.POMERIUM_URL as string;
const ROOT_PW = "qN7zR2mK9vX4tB6wL3sH8cY5";

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("allowed user passes the gate and signs in to GitLab as root", async ({ page }) => {
  await login(page, BASE, alice);

  // Past the Pomerium gate, GitLab serves its own sign-in page.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await expect(page.locator('input[name="user[login]"]')).toBeVisible();
  await shot(page, "gitlab-signin");

  // Sign in to GitLab itself as root. Submitting via Enter avoids depending on the
  // exact sign-in button markup.
  await page.fill('input[name="user[login]"]', "root");
  await page.fill('input[name="user[password]"]', ROOT_PW);
  await Promise.all([
    page.waitForURL((url) => !/sign_in/.test(url.toString()), { timeout: 30000 }),
    page.locator('input[name="user[password]"]').press("Enter"),
  ]);

  // GitLab's own API confirms the session is authenticated as root -- not merely
  // that a login page rendered. The request rides the same browser context, so it
  // carries both the Pomerium cookie (gate) and the GitLab session cookie (root).
  const res = await page.request.get(`${BASE}/api/v4/user`, { ignoreHTTPSErrors: true });
  expect(res.status(), "GitLab API should respond 200 for the root session").toBe(200);
  const body = await res.json();
  expect(body.username, "GitLab session should be authenticated as root").toBe("root");

  await shot(page, "gitlab-dashboard");
});
