import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";

// Default assertion for guides whose upstream is pomerium/verify (it echoes the
// request it received at /json). Guides with a different upstream point
// PW_TEST_DIR at their own spec instead and reuse ../lib/authn.
const BASE = process.env.POMERIUM_URL as string;

test.use({ baseURL: BASE });

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("authenticated user reaches the upstream with identity headers", async ({ page }) => {
  await login(page, BASE, alice);

  const res = await page.request.get(`${BASE}/json`, { ignoreHTTPSErrors: true });
  expect(res.ok(), "verify /json should be reachable after login").toBeTruthy();

  const data = await res.json();
  const email = data.headers?.["X-Pomerium-Claim-Email"]?.[0];
  expect(email, "upstream should receive the email identity header").toBe(alice.email);
});

test("Pomerium user endpoint exposes the authenticated identity", async ({ page }) => {
  await login(page, BASE, alice);

  const res = await page.request.get(`${BASE}/.pomerium/user`, { ignoreHTTPSErrors: true });
  expect(res.ok(), "/.pomerium/user should return OK").toBeTruthy();

  const user = await res.json();
  expect(user.email).toBe(alice.email);
});
