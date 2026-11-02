import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Jenkins: after the Pomerium SSO login, Jenkins must
// complete its OpenID Connect login against Pomerium's OIDC bridge and sign the same
// identity in.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the authenticated user into Jenkins", async ({ page }) => {
  await login(page, BASE, alice);

  // Jenkins' whoAmI API reflects the identity it authenticated the request as.
  // Jenkins starts its OpenID Connect login against Pomerium on the first request.
  const res = await page.request.get(`${BASE}/whoAmI/api/json`, {
    ignoreHTTPSErrors: true,
  });
  expect(res.ok(), "Jenkins whoAmI should be reachable after SSO").toBeTruthy();

  const who = await res.json();
  expect(
    who.authenticated,
    "Jenkins should treat the OIDC login as authenticated",
  ).toBeTruthy();
  expect(
    who.name,
    "Jenkins should sign in the Pomerium identity from the email claim",
  ).toBe(alice.email);

  // Capture the whoAmI page, which shows Jenkins signed in as the Pomerium
  // identity (Name / Authenticated: true), for the guide.
  await page.goto(`${BASE}/whoAmI/`, { waitUntil: "networkidle" });
  await shot(page, "jenkins-whoami");
});
