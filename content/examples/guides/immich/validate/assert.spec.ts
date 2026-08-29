import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Real end-to-end test for the Immich front-door gate. Pomerium makes the access
// decision; Immich keeps its own login on top. This drives the whole chain: an
// unauthenticated request is bounced to the IdP, an allowed user passes the gate,
// then Immich's own API confirms the request reached Immich through Pomerium, and
// the Immich web login renders behind the gate.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("allowed user passes the gate and reaches Immich", async ({ page }) => {
  await login(page, BASE, alice);

  // Immich's own API answers behind the gate. The request rides the same browser
  // context, so it carries the Pomerium cookie set by the SSO flow. A bare,
  // dependency-free liveness endpoint that returns {"res":"pong"} -- proving the
  // request reached Immich itself, not a Pomerium error page.
  const ping = await page.request.get(`${BASE}/api/server/ping`, { ignoreHTTPSErrors: true });
  expect(ping.status(), "Immich /api/server/ping should respond 200 behind the gate").toBe(200);
  const body = await ping.json();
  expect(body.res, "Immich should answer its liveness ping with pong").toBe("pong");

  // Past the Pomerium gate, Immich serves its own web app (the login / onboarding
  // screen on a fresh instance). Capture it for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "immich-login");
});

test("Immich is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: Immich IS serving through Pomerium after SSO. This
  // proves the service is up, so the direct-hit failure below is caused by
  // network topology, not a dead or typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/api/server/ping`, {
    ignoreHTTPSErrors: true,
  });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // The test-runner is not attached to immich-internal, so a direct hit at
  // immich-server:2283 must fail at name resolution / connection, not return
  // an HTTP response.
  let directError = "";
  try {
    await page.request.get("http://immich-server:2283/api/server/ping", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "Immich must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);
});
