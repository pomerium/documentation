import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Grafana: after the Pomerium SSO login, Grafana should
// complete its generic OAuth login against Pomerium's OIDC bridge as the same identity.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the authenticated user into Grafana", async ({ page }) => {
  await login(page, BASE, alice);

  // With GF_AUTH_GENERIC_OAUTH_AUTO_LOGIN, Grafana's login page starts the OIDC
  // login on its own, and the bridge completes it without a prompt because the
  // Pomerium session is active.
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await expect(page).not.toHaveURL(/\/login/);

  // Grafana's own user API reflects the OIDC-authenticated identity.
  const res = await page.request.get(`${BASE}/api/user`, { ignoreHTTPSErrors: true });
  expect(res.ok(), "Grafana /api/user should be reachable after OIDC sign-in").toBeTruthy();

  const user = await res.json();
  expect(user.email, "Grafana should sign in the Pomerium identity").toBe(alice.email);

  await page.goto(`${BASE}/profile`, { waitUntil: "networkidle" });
  await shot(page, "grafana-profile");
});
