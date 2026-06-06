import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";

// App-specific success for Forgejo: after the Pomerium SSO login, Forgejo's
// reverse-proxy authentication must sign in (and auto-provision) the SAME identity
// from the forwarded X-Pomerium-* headers, landing the user on the authenticated
// dashboard / API as alice@company.com, not the login or register page.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("reverse-proxy auth signs the Pomerium identity into Forgejo", async ({ page }) => {
  await login(page, BASE, alice);

  // The browser session now carries Pomerium's cookie, so Pomerium injects the
  // identity headers on every upstream request. Forgejo's reverse-proxy auth reads
  // them, auto-provisions the account on first visit, and signs the user in.
  // Forgejo's own /api/v1/user reflects that authenticated identity; an
  // unauthenticated request would return 401 (or the login HTML), not this JSON.
  const res = await page.request.get(`${BASE}/api/v1/user`, { ignoreHTTPSErrors: true });
  expect(
    res.ok(),
    "Forgejo /api/v1/user should be reachable after SSO (auto-provisioned + signed in)",
  ).toBeTruthy();

  const user = await res.json();
  expect(
    user.email,
    "Forgejo should sign in the Pomerium-forwarded identity, not a local account",
  ).toBe(alice.email);
});

test("Pomerium overwrites a spoofed identity header", async ({ page }) => {
  await login(page, BASE, alice);

  // The whole trust model rests on Pomerium owning the identity header: a client
  // that forges X-Pomerium-Claim-Email (and the username header) through Pomerium
  // must still be signed in as its real identity, never the spoofed one. Pomerium
  // overwrites the inbound headers with the authenticated user before the request
  // reaches Forgejo.
  const res = await page.request.get(`${BASE}/api/v1/user`, {
    ignoreHTTPSErrors: true,
    headers: {
      "X-Pomerium-Sub": "attacker",
      "X-Pomerium-Claim-Email": "attacker@evil.com",
      "X-Pomerium-Claim-Name": "Attacker",
    },
  });
  expect(res.ok(), "Forgejo should still authenticate the real identity").toBeTruthy();

  const user = await res.json();
  expect(
    user.email,
    "a spoofed header must not change the authenticated identity",
  ).toBe(alice.email);
});
