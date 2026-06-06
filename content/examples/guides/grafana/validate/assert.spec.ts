import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";

// App-specific success for Grafana: after the Pomerium SSO login, Grafana should
// auto-sign-in the same identity via the forwarded Pomerium JWT assertion.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("JWT SSO signs the authenticated user into Grafana", async ({ page }) => {
  await login(page, BASE, alice);

  // Grafana's own user API reflects the JWT-authenticated identity. Pomerium
  // attaches the signed assertion to every upstream request, so this call
  // authenticates to Grafana as alice.
  const res = await page.request.get(`${BASE}/api/user`, { ignoreHTTPSErrors: true });
  expect(res.ok(), "Grafana /api/user should be reachable after SSO").toBeTruthy();

  const user = await res.json();
  expect(user.email, "Grafana should sign in the Pomerium identity").toBe(alice.email);
});
