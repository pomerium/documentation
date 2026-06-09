import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Universal access checks for any HTTP upstream behind Pomerium: the route must
// require authentication, and an allowed user must reach the app after login.
// Guides whose upstream consumes identity (JWT/headers) add their own assertion.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("authenticated user reaches the upstream", async ({ page }) => {
  await login(page, BASE, alice);

  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "upstream should respond OK after login").toBeLessThan(400);

  // Render the app in the page and capture it for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "app");
});
