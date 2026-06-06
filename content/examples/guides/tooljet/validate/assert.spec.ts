import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// ToolJet keeps its own accounts and RBAC, so Pomerium is a front-door gate, not a
// replacement for ToolJet's login. This is an auth + upstream smoke test: it proves
// Pomerium's gating (unauthenticated -> IdP; an authenticated user reaches ToolJet's
// own app), not ToolJet's workspace setup or RBAC, which the guide verifies manually.
const BASE = process.env.POMERIUM_URL as string;

// ToolJet's own server HTML carries <title>ToolJet</title>. The IdP login page and a
// Pomerium error page do not, so this structural marker (verified against the served
// bytes) distinguishes "reached ToolJet" from "stuck on a Pomerium/IdP page". We
// deliberately avoid the bare host name as a marker: it echoes in the IdP's
// redirect_uri and would match a login page.
const TOOLJET_HTML = /<title>ToolJet<\/title>/i;
const NOT_TOOLJET = /Sign in to Pomerium|kc-form|Pomerium Error/i;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("authenticated user reaches ToolJet's own app after SSO", async ({ page }) => {
  await login(page, BASE, alice);

  // After the Pomerium login the request returns to the route. ToolJet serves its
  // own SPA shell; the login/onboarding UI is rendered client-side, so we assert the
  // server HTML here and the mounted app below.
  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "ToolJet should respond 200 after SSO").toBe(200);

  const body = await res.text();
  expect(body, "response should be ToolJet's own app shell").toMatch(TOOLJET_HTML);
  expect(body, "response must not be a Pomerium/IdP page").not.toMatch(NOT_TOOLJET);

  // The browser should land and stay on the route host (ToolJet served through
  // Pomerium), not bounce back to Keycloak or off to an external site, and ToolJet's
  // SPA root should be served. These markers are state-independent: ToolJet serves
  // the same #app root whether a fresh install shows the setup screen or an existing
  // one shows the login screen, so the check does not depend on first-run state.
  await page.goto(BASE, { waitUntil: "load" });
  await expect(page).toHaveURL(/tooljet\.localhost\.pomerium\.io/);
  await expect(page.locator("#app")).toHaveCount(1);
  await shot(page, "tooljet");
});
