import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

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

  // Capture the signed-in wiki for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "tiddlywiki");
});

test("Pomerium overwrites a spoofed identity header", async ({ page }) => {
  await login(page, BASE, alice);

  // The trust model rests on Pomerium owning the identity header: a client that forges
  // X-Pomerium-Claim-Email through Pomerium must still be signed in as its real identity,
  // never the spoofed one. Pomerium overwrites the inbound header with the authenticated
  // user before the request reaches TiddlyWiki, so /status still reports alice.
  await page.setExtraHTTPHeaders({
    "X-Pomerium-Claim-Email": "attacker@evil.com",
  });
  const res = await page.request.get(`${BASE}/status`, { ignoreHTTPSErrors: true });
  const status = await res.json();
  expect(
    status.username,
    "a spoofed header must not change the authenticated identity",
  ).toBe(alice.email);
  expect(
    status.username,
    "the spoofed identity must never appear",
  ).not.toBe("attacker@evil.com");
});

test("tiddlywiki is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: tiddlywiki IS reachable and serving through Pomerium (after
  // SSO). This proves the service is up, so the direct-hit failure below is caused by
  // network topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/status`, { ignoreHTTPSErrors: true });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // Network isolation is the only trust boundary for header auth, so it must be real:
  // tiddlywiki sits on an internal-only network shared with Pomerium alone. The
  // test-runner is not on that network, so a direct hit at tiddlywiki:8080 (bypassing
  // Pomerium) must fail at name resolution / connection, NOT with an HTTP response.
  // Asserting the specific error keeps a typo or a down service from masquerading as
  // isolation.
  let directError = "";
  try {
    await page.request.get("http://tiddlywiki:8080/status", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "tiddlywiki must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN|ETIMEDOUT|timeout/i);
});
