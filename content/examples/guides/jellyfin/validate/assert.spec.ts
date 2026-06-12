import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Real end-to-end test for the Jellyfin front-door gate. Pomerium makes the access
// decision; Jellyfin keeps its own login on top. This drives the whole chain: an
// unauthenticated request is bounced to the IdP, an allowed user passes the gate and
// reaches a live Jellyfin, and Jellyfin itself answers behind the gate. Jellyfin's
// /System/Info/Public endpoint is unauthenticated at Jellyfin, so a 200 JSON there
// proves the gate opened AND the upstream is live -- not merely that a login rendered.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("allowed user passes the gate and reaches a live Jellyfin", async ({ page }) => {
  await login(page, BASE, alice);

  // Past the Pomerium gate, Jellyfin's own web client loads. Its public system-info
  // endpoint needs no Jellyfin auth, so a 200 JSON here is unambiguous proof the gate
  // opened and the upstream answered -- a redirect back to the IdP or a Pomerium error
  // page would not parse to this shape.
  const res = await page.request.get(`${BASE}/System/Info/Public`, {
    ignoreHTTPSErrors: true,
  });
  expect(
    res.status(),
    "Jellyfin /System/Info/Public should respond 200 through the open gate",
  ).toBe(200);
  const info = await res.json();
  // Shape check: the public system-info payload is what a live Jellyfin returns.
  // Different image versions vary which fields they expose, so accept any of the
  // stable identity fields rather than pinning one.
  expect(
    info.Version || info.Id || info.StartupWizardCompleted !== undefined,
    "Jellyfin should return its public system info (Version / Id / StartupWizardCompleted)",
  ).toBeTruthy();

  // Capture the Jellyfin page behind the gate for the guide.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "jellyfin-setup");
});

test("Jellyfin is not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: Jellyfin IS serving through Pomerium (after SSO). This
  // proves the service is up, so the direct-hit failure below is caused by network
  // topology, not a dead or typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/System/Info/Public`, {
    ignoreHTTPSErrors: true,
  });
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // The gate is the only trust boundary, so it must be real: Jellyfin sits on an
  // internal-only network shared with Pomerium alone. The test-runner is not on that
  // network, so a direct hit at jellyfin:8096 (bypassing Pomerium) must fail at name
  // resolution / connection, NOT with an HTTP response. Asserting the specific error
  // keeps a typo or a down service from masquerading as isolation.
  let directError = "";
  try {
    await page.request.get("http://jellyfin:8096/System/Info/Public", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "Jellyfin must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);
});
