import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Auth + upstream smoke test for the GitLab front-door gate. Pomerium does the
// access decision; GitLab keeps its own login on top, so this proves the gate and
// that an allowed user reaches GitLab. GitLab's root login / first-run setup is
// verified manually in the guide, not driven here.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("allowed user passes the gate and reaches GitLab", async ({ page }) => {
  await login(page, BASE, alice);

  // Through Pomerium the route now responds: GitLab serves its own sign-in page
  // behind the gate (Pomerium gated the request; GitLab handles its own session).
  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "GitLab should respond after the Pomerium gate").toBeLessThan(400);

  await page.goto(BASE, { waitUntil: "networkidle" });
  await expect(page.locator('input[name="user[login]"]')).toBeVisible();
  await shot(page, "gitlab-signin");
});
