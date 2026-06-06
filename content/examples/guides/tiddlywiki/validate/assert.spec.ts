import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";

// App-specific success for TiddlyWiki: Pomerium forwards the authenticated email in an
// unsigned header, and TiddlyWiki's authenticated-user-header trusts it as the logged-in
// user. TiddlyWiki's /status endpoint reflects that identity.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("header auth signs the authenticated user into TiddlyWiki", async ({ page }) => {
  await login(page, BASE, alice);

  // /status reflects the username TiddlyWiki derived from the forwarded header. After
  // SSO, Pomerium attaches the email to every upstream request, so TiddlyWiki sees a
  // named (non-anonymous) user rather than an anonymous visitor.
  const res = await page.request.get(`${BASE}/status`, { ignoreHTTPSErrors: true });
  expect(res.ok(), "TiddlyWiki /status should be reachable after SSO").toBeTruthy();

  const status = await res.json();
  expect(status.username, "TiddlyWiki should adopt the Pomerium identity").toBe(alice.email);
  expect(status.anonymous, "TiddlyWiki should not treat the user as anonymous").toBe(false);
});
