import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Real end-to-end test for the Servarr suite behind a single Pomerium front door.
// Pomerium makes the access decision for every app; each *arr app keeps its own
// API key on top (it has no OIDC/JWT/header identity). This drives the whole
// chain: an unauthenticated request is bounced to the IdP; an allowed user passes
// the gate; behind the gate each app's status API answers 200 to its seeded key;
// and the apps are unreachable except through Pomerium (network isolation).
//
// SERVARRTESTKEY0123456789 is the shared, test-only API key seeded into each app's
// committed config (sonarr/radarr/prowlarr config.xml and sabnzbd.ini). It is a
// fixture credential for localhost-only containers destroyed after the run, in the
// same spirit as the harness's committed alice/password123 and pomerium-e2e-secret.
const BASE = process.env.POMERIUM_URL as string;
const API_KEY = "SERVARRTESTKEY0123456789";

const RADARR = BASE.replace("sonarr.", "radarr.");
const PROWLARR = BASE.replace("sonarr.", "prowlarr.");
const SABNZBD = BASE.replace("sonarr.", "sabnzbd.");
const KEYCLOAK_HOST = "keycloak.localhost.pomerium.io";

// After the first interactive sign-in, the authenticate + Keycloak sessions are
// warm, so reaching another app host completes single sign-on silently (no
// credential prompt). Navigate and wait to land back on the app host; if Pomerium
// briefly bounces through Keycloak, wait that out too.
async function reach(page: import("@playwright/test").Page, url: string): Promise<void> {
  const host = new URL(url).hostname;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForURL(
    (u) => u.hostname === host && u.hostname !== KEYCLOAK_HOST,
    { timeout: 30000 },
  );
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("an allowed user passes the gate and every app's API answers its seeded key", async ({
  page,
}) => {
  // Interactive sign-in once, through the Sonarr route. This proves the gate and
  // warms the SSO session reused for the other three apps.
  await login(page, BASE, alice);

  // Sonarr (TV). The status API only answers 200 to a request carrying the API key,
  // so a 200 here proves both that Pomerium let us through and that the seeded key
  // reached the app. The request rides the browser context, so it also carries the
  // Pomerium session cookie set by the login above.
  const sonarr = await page.request.get(
    `${BASE}/api/v3/system/status?apiKey=${API_KEY}`,
    { ignoreHTTPSErrors: true },
  );
  expect(sonarr.status(), "Sonarr status API should answer 200 to the seeded key").toBe(200);
  expect((await sonarr.json()).appName, "Sonarr should identify itself").toBe("Sonarr");

  // Radarr (Movies).
  await reach(page, RADARR);
  const radarr = await page.request.get(
    `${RADARR}/api/v3/system/status?apiKey=${API_KEY}`,
    { ignoreHTTPSErrors: true },
  );
  expect(radarr.status(), "Radarr status API should answer 200 to the seeded key").toBe(200);
  expect((await radarr.json()).appName, "Radarr should identify itself").toBe("Radarr");

  // Prowlarr (indexers). Prowlarr's API is versioned v1, unlike Sonarr/Radarr (v3).
  await reach(page, PROWLARR);
  const prowlarr = await page.request.get(
    `${PROWLARR}/api/v1/system/status?apiKey=${API_KEY}`,
    { ignoreHTTPSErrors: true },
  );
  expect(prowlarr.status(), "Prowlarr status API should answer 200 to the seeded key").toBe(200);
  expect((await prowlarr.json()).appName, "Prowlarr should identify itself").toBe("Prowlarr");

  // SABnzbd (usenet). Its `mode=version` is public, so assert on `mode=queue`,
  // which returns "API Key Required" without the key and the queue JSON with it.
  await reach(page, SABNZBD);
  const sab = await page.request.get(
    `${SABNZBD}/api?mode=queue&output=json&apikey=${API_KEY}`,
    { ignoreHTTPSErrors: true },
  );
  expect(sab.status(), "SABnzbd queue API should answer 200 to the seeded key").toBe(200);
  expect((await sab.json()).queue, "SABnzbd should return its queue object").toBeTruthy();

  // Capture a *arr UI rendered behind the Pomerium gate for the guide. Sonarr's
  // SPA polls its API continuously, so wait on the rendered chrome rather than
  // network idle (which never settles). The selector wait is best-effort so a
  // future UI markup change can't fail the gate assertion that already passed.
  await reach(page, BASE);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("header, nav, [class*='Page']", { timeout: 10000 }).catch(() => {});
  await shot(page, "servarr-sonarr");
});

test("each app's own API key gates its API, independent of the Pomerium session", async ({
  page,
}) => {
  // The guide's load-bearing claim is that signing in through Pomerium does NOT
  // authenticate you to an app's API: the API key is the app's own, separate
  // credential. Prove it. Even past the Pomerium gate (authenticated session in
  // this context), a request that omits the key must be rejected by the app itself.
  // Sonarr/Radarr/Prowlarr answer 401; SABnzbd answers 200 with an "API Key
  // Required" error body (its API never uses HTTP status for auth failures).
  await login(page, BASE, alice);

  const sonarr = await page.request.get(`${BASE}/api/v3/system/status`, {
    ignoreHTTPSErrors: true,
  });
  expect(sonarr.status(), "Sonarr must reject an API call with no key").toBe(401);

  await reach(page, RADARR);
  const radarr = await page.request.get(`${RADARR}/api/v3/system/status`, {
    ignoreHTTPSErrors: true,
  });
  expect(radarr.status(), "Radarr must reject an API call with no key").toBe(401);

  await reach(page, PROWLARR);
  const prowlarr = await page.request.get(`${PROWLARR}/api/v1/system/status`, {
    ignoreHTTPSErrors: true,
  });
  expect(prowlarr.status(), "Prowlarr must reject an API call with no key").toBe(401);

  await reach(page, SABNZBD);
  const sab = await page.request.get(`${SABNZBD}/api?mode=queue&output=json`, {
    ignoreHTTPSErrors: true,
  });
  const sabBody = await sab.text();
  expect(
    sabBody,
    "SABnzbd must reject an authenticated-but-keyless API call",
  ).toMatch(/API Key Required/i);
});

test("the *arr apps are not reachable except through Pomerium", async ({ page }) => {
  // Positive control first: Sonarr IS serving through Pomerium after SSO. This
  // proves the service is up, so the direct-hit failure below is caused by network
  // topology, not a dead/typo'd endpoint.
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(
    `${BASE}/api/v3/system/status?apiKey=${API_KEY}`,
    { ignoreHTTPSErrors: true },
  );
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  // Each app's only built-in auth is a static API key, so network isolation is the
  // real trust boundary and must be real: the apps sit on an internal-only network
  // shared with Pomerium alone. The test-runner is not on that network, so a direct
  // hit at sonarr:8989 (bypassing Pomerium) must fail at name resolution /
  // connection, NOT with an HTTP response. Asserting the specific error keeps a typo
  // or a down service from masquerading as isolation.
  let directError = "";
  try {
    await page.request.get("http://sonarr:8989/api/v3/system/status", {
      ignoreHTTPSErrors: true,
      timeout: 5000,
    });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "the apps must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);
});
