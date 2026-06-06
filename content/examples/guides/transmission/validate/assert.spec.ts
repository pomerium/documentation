import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Transmission consumes no Pomerium identity, so this is an auth + upstream smoke
// test: Pomerium gates the route (unauthenticated requests bounce to the IdP), and
// after SSO the Transmission web UI and RPC endpoint are reachable through Pomerium.
// Transmission's own RPC authentication is separate and not exercised here.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("after SSO the Transmission web UI and RPC are reachable through Pomerium", async ({ page }) => {
  await login(page, BASE, alice);

  // The web UI loads over TLS through Pomerium and lands on Transmission's own page.
  const ui = await page.request.get(`${BASE}/transmission/web/`, { ignoreHTTPSErrors: true });
  expect(ui.status(), "Transmission web UI should respond OK after login").toBeLessThan(400);
  expect(await ui.text(), "response should be the Transmission web UI").toContain("Transmission");

  // The RPC endpoint is reachable. Without an X-Transmission-Session-Id it returns
  // 409 carrying that header (the daemon demanding a CSRF token) — proof the request
  // reached Transmission rather than being blocked by Pomerium, which never emits 409.
  const rpc = await page.request.post(`${BASE}/transmission/rpc`, { ignoreHTTPSErrors: true });
  expect(rpc.status(), "Transmission RPC should reach the daemon after login").toBe(409);
  expect(
    rpc.headers()["x-transmission-session-id"],
    "409 should come from Transmission (carries its session-id header)",
  ).toBeTruthy();

  // Capture the web UI reached through Pomerium for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "transmission");
});
