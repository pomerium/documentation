import { test, expect } from "@playwright/test";
import { login, alice, bob } from "../lib/authn";

// App-specific success for Open WebUI: with WEBUI_AUTH_TRUSTED_EMAIL_HEADER set,
// Open WebUI trusts the email Pomerium forwards (X-Pomerium-Claim-Email), provisions
// the account on first sight, and signs the user in without its own password prompt.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("trusted-header SSO signs the Pomerium identity into Open WebUI", async ({ page }) => {
  // Complete the Pomerium SSO login so subsequent requests carry the Pomerium
  // session and are decorated with X-Pomerium-Claim-Email on the way upstream.
  await login(page, BASE, alice);

  // Open WebUI provisions and signs in the trusted-header identity on POST /signin.
  // The body fields are required by the form schema but ignored in trusted-header
  // mode; Pomerium injects the header, so Open WebUI keys off the email it forwards.
  const signin = await page.request.post(`${BASE}/api/v1/auths/signin`, {
    ignoreHTTPSErrors: true,
    data: { email: "ignored@example.com", password: "ignored" },
  });
  expect(signin.ok(), "Open WebUI should accept the trusted-header sign-in").toBeTruthy();

  // The session endpoint now reflects the identity Pomerium forwarded.
  const res = await page.request.get(`${BASE}/api/v1/auths/`, { ignoreHTTPSErrors: true });
  expect(res.ok(), "Open WebUI session endpoint should be reachable after SSO").toBeTruthy();

  const user = await res.json();
  expect(user.email, "Open WebUI should sign in the Pomerium identity").toBe(alice.email);
});

test("a policy-denied user is blocked by Pomerium before reaching Open WebUI", async ({ page }) => {
  // bob authenticates at the IdP but is a contractor, not in the engineering group the
  // route requires, so Pomerium must reject him with 403 before the upstream is hit.
  await login(page, BASE, bob);

  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "Pomerium should deny a user outside the allowed group").toBe(403);
});
