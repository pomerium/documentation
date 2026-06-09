import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Cockpit keeps its own host login (PAM/SSH) and does not consume a Pomerium
// identity, so this is an auth + upstream smoke test: Pomerium must gate the route,
// and after SSO Cockpit's own login page must be reachable through Pomerium. The
// host login itself is Cockpit's concern and is exercised manually.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("after SSO, Cockpit's own login page is reachable through Pomerium", async ({ page }) => {
  await login(page, BASE, alice);

  // Pomerium has authorized the request; Cockpit now serves its host login page.
  // It does not auto-sign-in the Pomerium identity, so we expect the login form,
  // not a dashboard.
  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "Cockpit should respond OK through Pomerium after SSO").toBeLessThan(400);

  await page.goto(BASE, { waitUntil: "networkidle" });
  await expect(page.locator("#login-user-input")).toBeVisible();
  await shot(page, "cockpit-login-screen");
});
