import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// HedgeDoc keeps its own accounts and does not consume a Pomerium identity header,
// so the guide's outcome is the gate plus the live editor: an unauthenticated
// request is bounced to the IdP, and an allowed user lands on HedgeDoc and can open
// the real-time editor (which needs the WebSocket the route allows).
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("an allowed user reaches HedgeDoc after SSO", async ({ page }) => {
  await login(page, BASE, alice);

  // The route serves HedgeDoc's own intro page, not a Pomerium bounce. Assert a
  // control unique to that page (not just the brand title, which HedgeDoc's own
  // login page also carries) so this proves the app itself rendered.
  const res = await page.goto(BASE, { waitUntil: "domcontentloaded" });
  expect(res!.status(), "HedgeDoc should respond OK after SSO").toBeLessThan(400);
  await expect(page.getByRole("link", { name: /new guest note/i })).toBeVisible();
  await shot(page, "hedgedoc");
});

test("the collaborative editor opens its WebSocket through the route", async ({ page }) => {
  await login(page, BASE, alice);

  // The headline of the guide: allow_websockets lets HedgeDoc's editor open its
  // live connection. Open a new note and wait for the editor's WebSocket to
  // connect through Pomerium. Without the route's WebSocket upgrade this times out.
  const socket = page.waitForEvent("websocket", { timeout: 20000 });
  await page.goto(`${BASE}/new`, { waitUntil: "domcontentloaded" });
  const ws = await socket;
  expect(ws.url(), "editor WebSocket should run over the route host").toContain(
    "hedgedoc.localhost.pomerium.io",
  );
});
