import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Guacamole: after the Pomerium SSO login, Guacamole's
// header-auth extension must sign the SAME identity in from the forwarded
// X-Pomerium-Claim-Email header, landing the user on the Guacamole home screen
// (its REST API), not the built-in username/password login form.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("header auth signs the Pomerium identity into Guacamole", async ({ page }) => {
  await login(page, BASE, alice);

  // Guacamole issues an auth token only when a request already carries an
  // authenticated identity. Pomerium forwards X-Pomerium-Claim-Email on every
  // upstream request, so the header-auth extension mints a token for alice
  // without ever showing the Guacamole login form. The token response echoes
  // the authenticated username (the forwarded email).
  const res = await page.request.post(`${BASE}/api/tokens`, {
    ignoreHTTPSErrors: true,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: "",
  });
  expect(res.ok(), "Guacamole /api/tokens should authenticate via the forwarded header").toBeTruthy();

  const body = await res.json();
  expect(
    body.username,
    "Guacamole should sign in the Pomerium-forwarded identity",
  ).toBe(alice.email);
  expect(body.authToken, "Guacamole should return an auth token").toBeTruthy();
  // dataSource === "header" is what distinguishes header-auth from a form login;
  // a username match alone wouldn't prove the header drove authentication.
  expect(
    body.dataSource,
    "Guacamole should authenticate via the header extension",
  ).toBe("header");

  // Capture the Guacamole home screen, signed in as alice via the header, for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "guacamole-home");
});

test("Pomerium overwrites a spoofed identity header", async ({ page }) => {
  await login(page, BASE, alice);

  // The whole trust model rests on Pomerium owning the claim header: a client that
  // forges X-Pomerium-Claim-Email through Pomerium must be signed in as its real
  // identity, never the spoofed one. Pomerium overwrites the inbound header with
  // the authenticated user before the request reaches Guacamole.
  const res = await page.request.post(`${BASE}/api/tokens`, {
    ignoreHTTPSErrors: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Pomerium-Claim-Email": "attacker@evil.com",
    },
    data: "",
  });
  expect(res.ok(), "Guacamole should still authenticate the real identity").toBeTruthy();

  const body = await res.json();
  expect(
    body.username,
    "spoofed header must not change the authenticated identity",
  ).toBe(alice.email);
});

test("Guacamole is not reachable except through Pomerium", async ({ page }) => {
  // Network isolation is the other half of the trust model: guacamole sits on an
  // internal-only network shared with pomerium, so this runner cannot reach it
  // directly. If it could, anyone could forge X-Pomerium-Claim-Email straight at
  // Guacamole and bypass Pomerium entirely. The direct dial must fail while the
  // route through Pomerium keeps working.
  const direct = page.request.get("http://guacamole:8080/", {
    ignoreHTTPSErrors: true,
    timeout: 5000,
  });
  await expect(direct, "guacamole must be unreachable directly").rejects.toThrow();

  const viaPomerium = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(
    viaPomerium.ok(),
    "the route through Pomerium must still work",
  ).toBeTruthy();
});
