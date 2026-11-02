import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for HedgeDoc: after the Pomerium SSO login, HedgeDoc completes
// its own OAuth2 login against Pomerium's OIDC bridge as the same identity, with no
// second prompt. Anonymous access and local accounts are off, so the bridge is the
// only way to sign in.
const BASE = process.env.POMERIUM_URL as string;

// HedgeDoc's /me endpoint reports the session's user, or status "forbidden" for a
// guest.
async function whoami(page: import("@playwright/test").Page) {
  const res = await page.request.get(`${BASE}/me`, { ignoreHTTPSErrors: true });
  return res.json();
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the Pomerium identity into HedgeDoc", async ({ page }) => {
  await login(page, BASE, alice);

  // Before HedgeDoc's login, the session is a guest.
  expect((await whoami(page)).status).not.toBe("ok");

  // Start HedgeDoc's OAuth2 login. Pomerium already has a session, so the bridge
  // redirects straight back to HedgeDoc's callback with no prompt.
  await page.goto(`${BASE}/auth/oauth2`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const me = await whoami(page);
  expect(me.status, "HedgeDoc should have signed the user in through the bridge").toBe("ok");

  // Capture the signed-in HedgeDoc UI for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "hedgedoc");
});

test("the collaborative editor opens its WebSocket through the route", async ({ page }) => {
  await login(page, BASE, alice);
  await page.goto(`${BASE}/auth/oauth2`, { waitUntil: "networkidle" });

  // allow_websockets lets HedgeDoc's editor open its live connection. Open a new
  // note and wait for the WebSocket to connect through Pomerium.
  const socket = page.waitForEvent("websocket", { timeout: 20000 });
  await page.goto(`${BASE}/new`, { waitUntil: "domcontentloaded" });
  const ws = await socket;
  expect(ws.url(), "editor WebSocket should run over the route host").toContain(
    new URL(BASE).host,
  );
});

test("the upstream is unreachable except through Pomerium", async ({ page }) => {
  // HedgeDoc is on an internal-only network shared with Pomerium. The test-runner sits
  // on the default network, so a direct hit to hedgedoc:3000 must fail.
  let directError = "";
  try {
    await page.request.get("http://hedgedoc:3000/", { ignoreHTTPSErrors: true, timeout: 5000 });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "direct dial to HedgeDoc should be refused, not routed (network isolation)",
  ).toMatch(/ENOTFOUND|getaddrinfo|EAI_AGAIN|ECONNREFUSED/i);
});
