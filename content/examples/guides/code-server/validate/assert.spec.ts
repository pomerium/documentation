import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for code-server: after the Pomerium SSO login the VS Code
// workbench must render, AND the editor's live WebSocket must actually connect
// through Pomerium. code-server checks the WS Origin against the Host and rejects
// the upgrade with 403 if they differ, so a frame round-trip (not just the upgrade
// request being issued) is what proves the route is wired correctly end to end.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("SSO grants access and the editor connects over a live WebSocket", async ({ page }) => {
  // Resolve only when the editor's WebSocket actually carries a frame. A rejected
  // upgrade (403) fires "websocket" but never exchanges frames, so requiring a frame
  // distinguishes a working editor from one stuck reconnecting.
  const wsConnected = new Promise<string>((resolve) => {
    page.on("websocket", (ws) => {
      ws.on("framereceived", () => resolve(ws.url()));
    });
  });

  await login(page, BASE, alice);

  // The workbench is the top-level VS Code UI container.
  await page.waitForSelector(".monaco-workbench", { timeout: 30000 });
  await expect(page.locator(".monaco-workbench")).toBeVisible();

  const wsUrl = await Promise.race([
    wsConnected,
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("editor WebSocket never exchanged a frame")), 30000),
    ),
  ]);
  expect(wsUrl, "editor WebSocket should go through the Pomerium route host").toContain(
    new URL(BASE).host,
  );

  // The editor surfaces a connection-failure dialog when the WebSocket drops; its
  // absence confirms the live session is healthy.
  await expect(
    page.getByText(/failed to connect to the server/i),
    "code-server should not show a WebSocket connection error",
  ).toHaveCount(0);

  // Capture the running editor for the guide.
  await shot(page, "code-server-editor");
});
