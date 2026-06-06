import { test, expect } from "@playwright/test";
import { login, alice } from "../lib/authn";
import { shot } from "../lib/shot";

// Auth + upstream smoke test for the OpenClaw gateway: the route must require SSO,
// and an allowed user must reach the gateway through Pomerium. OpenClaw consumes no
// Pomerium identity (it has no built-in user auth), so there is no identity claim to
// assert downstream; SSH administration and device pairing are verified manually.
const BASE = process.env.POMERIUM_URL as string;

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("authenticated user reaches the OpenClaw gateway through Pomerium", async ({ page }) => {
  await login(page, BASE, alice);

  const res = await page.request.get(BASE, { ignoreHTTPSErrors: true });
  expect(res.status(), "gateway should respond OK after SSO").toBeLessThan(400);

  // Capture the gateway as reached through Pomerium for the guide.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "openclaw-gateway");
});
