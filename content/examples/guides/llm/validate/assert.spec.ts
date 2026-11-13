import { test, expect, Page } from "@playwright/test";
import { login, alice, bob, TestUser } from "../lib/authn";
import { shot } from "../lib/shot";

// App-specific success for Open WebUI, OIDC bridge tab: after the Pomerium SSO login,
// Open WebUI completes its own OIDC login against Pomerium's OIDC bridge as the same
// identity, with no Open WebUI login page. The login form is disabled, so the user
// never types an Open WebUI password.
const BASE = process.env.POMERIUM_URL as string;
const AUTHN = "https://authenticate.localhost.pomerium.io";
// The values the guide prints, with the local domain swapped in.
const CLIENT_ID = BASE;
const REDIRECT_URI = `${BASE}/oauth/oidc/callback`;

// Serial: Open WebUI makes the first account it creates an admin, so the order in
// which users first sign in matters.
test.describe.configure({ mode: "serial" });

// Seeded in _harness/keycloak/pomerium-e2e-users-0.json. Inside the route policy
// (company.com), and signs in after alice.
const charlie: TestUser = {
  email: "charlie@company.com",
  password: "password123",
  groups: ["engineering"],
  department: "engineering",
};

// Read the identity Open WebUI considers signed in. /api/v1/auths/ returns the
// current user for the browser's session, or 401 if there is no session.
async function whoami(page: Page) {
  return page.request.get(`${BASE}/api/v1/auths/`);
}

// Pomerium SSO, then Open WebUI's automatic OIDC login through the bridge. The SPA
// starts the OIDC login as soon as Pomerium returns the browser to Open WebUI, so
// record the authorization request from the start. Returns that request's URL.
async function signIn(page: Page, user: TestUser, firstUser = false) {
  const authRequests: string[] = [];
  const onRequest = (r: { url(): string }) => {
    if (r.url().startsWith(`${AUTHN}/oidc/auth`)) authRequests.push(r.url());
  };
  page.on("request", onRequest);
  await login(page, BASE, user);
  if (firstUser) {
    // Until Open WebUI has an account, it shows its first-run welcome screen
    // instead of starting the OIDC login on its own. The first user clicks
    // through it once.
    await page.getByRole("button", { name: "Get started" }).click();
    await page.getByRole("button", { name: "Continue with Pomerium" }).click();
  } else {
    await page.goto(`${BASE}/auth`, { waitUntil: "domcontentloaded" });
  }
  await expect
    .poll(async () => (await whoami(page)).status(), {
      message: "Open WebUI should sign in through the bridge without a click",
      timeout: 30000,
    })
    .toBe(200);
  page.off("request", onRequest);
  expect(authRequests.length, "Open WebUI should start the OIDC login itself").toBeGreaterThan(0);
  return new URL(authRequests[authRequests.length - 1]);
}

// Open WebUI keeps a Socket.IO connection open, so the page never reaches
// "networkidle". Wait for the message input instead.
async function appReady(page: Page) {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#message-input-container")).toBeVisible({ timeout: 30000 });
}

// Dismiss Open WebUI's first-visit "What's New" dialog and sign-in toast, then open
// the user menu so the screenshot shows who is signed in.
async function showSignedInUser(page: Page) {
  const okay = page.getByRole("button", { name: "Okay, Let's Go!" });
  if (await okay.isVisible({ timeout: 5000 }).catch(() => false)) await okay.click();
  await expect(page.getByText("You're now logged in.")).toBeHidden({ timeout: 15000 });
  await page.locator("button:has(img[alt=\"Open User Profile Menu\"]):visible").first().click();
  await page.waitForTimeout(500);
}

test("unauthenticated request is redirected to the identity provider", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("OIDC bridge signs the user in and creates the Open WebUI account", async ({ page }) => {
  const auth = await signIn(page, alice, true);

  // Open WebUI sends the client ID, redirect URI, scope, and PKCE method the guide sets.
  expect(auth.searchParams.get("client_id")).toBe(CLIENT_ID);
  expect(auth.searchParams.get("redirect_uri")).toBe(REDIRECT_URI);
  expect(auth.searchParams.get("scope")).toBe("openid");
  expect(auth.searchParams.get("code_challenge_method")).toBe("S256");

  const user = await (await whoami(page)).json();
  expect(user.email, "Open WebUI should sign in the Pomerium identity").toBe(alice.email);
  expect(user.role, "the first account Open WebUI creates is an admin").toBe("admin");

  // Capture the signed-in Open WebUI UI for the guide.
  await appReady(page);
  await showSignedInUser(page);
  await shot(page, "llm");
});

test("later users are created in the pending role, with no click", async ({ page }) => {
  // Open WebUI has an account now, so OAUTH_AUTO_REDIRECT starts the OIDC login.
  await signIn(page, charlie);
  const user = await (await whoami(page)).json();
  expect(user.email).toBe(charlie.email);
  expect(user.role, "users after the first wait for an admin to approve them").toBe("pending");
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Account Activation Pending")).toBeVisible({ timeout: 30000 });
});

test("the bridge rejects a client ID or redirect URI that doesn't match the route", async ({
  page,
}) => {
  await login(page, BASE, alice);
  const params = (o: Record<string, string>) =>
    new URLSearchParams({
      response_type: "code",
      scope: "openid",
      code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
      code_challenge_method: "S256",
      state: "s",
      ...o,
    });

  const unknown = await page.request.get(
    `${AUTHN}/oidc/auth?${params({ client_id: "https://other.localhost.pomerium.io", redirect_uri: "https://other.localhost.pomerium.io/cb" })}`,
    { maxRedirects: 0 },
  );
  expect(unknown.status()).toBe(400);
  expect(await unknown.text()).toContain("unknown client_id");

  const mismatch = await page.request.get(
    `${AUTHN}/oidc/auth?${params({ client_id: CLIENT_ID, redirect_uri: "https://other.localhost.pomerium.io/oauth/oidc/callback" })}`,
    { maxRedirects: 0 },
  );
  expect(mismatch.status()).toBe(400);
  expect(await mismatch.text()).toContain("does not match client_id");
});

test("streamed responses connect over a websocket through Pomerium", async ({ page }) => {
  // Open WebUI streams chat responses over Socket.IO at /ws/socket.io. Without
  // allow_websockets on the route, Pomerium rejects the upgrade.
  await signIn(page, alice);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const result = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const ws = new WebSocket(`wss://${location.host}/ws/socket.io/?EIO=4&transport=websocket`);
        ws.onopen = () => {
          ws.close();
          resolve("open");
        };
        ws.onerror = () => resolve("error");
        setTimeout(() => resolve("timeout"), 10000);
      }),
  );
  expect(result, "the websocket upgrade should succeed").toBe("open");
});

test("the routes set the caching headers the guide describes", async ({ page }) => {
  await signIn(page, alice);
  const app = await page.request.get(`${BASE}/`);
  expect(app.headers()["cache-control"]).toBe("no-cache");

  const html = await app.text();
  const asset = html.match(/\/_app\/immutable\/[^"']+\.js/)?.[0];
  expect(asset, "the app page should load a content-hashed asset").toBeTruthy();
  const res = await page.request.get(`${BASE}${asset}`);
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["cache-control"]).toBe("private, max-age=31536000, immutable");
});

test("Open WebUI sign-out also ends the Pomerium session", async ({ page }) => {
  await signIn(page, alice);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });

  // What Open WebUI's Sign Out menu item does: POST /api/v1/auths/signout, then
  // follow the redirect_url it returns: OPENID_END_SESSION_ENDPOINT, the route's
  // /.pomerium/sign_out, which ends the session without a confirmation page.
  const redirect = await page.evaluate(async () => {
    const res = await fetch("/api/v1/auths/signout", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    return (await res.json()).redirect_url as string;
  });
  expect(redirect).toBe(`${BASE}/.pomerium/sign_out`);
  await page.goto(redirect);
  await page.waitForURL(/\/\.pomerium\/signed_out/, { timeout: 15000 });

  // Without a Pomerium session, Open WebUI can't sign the user back in.
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/keycloak\.localhost\.pomerium\.io/);
});

test("a user outside the policy is blocked before Open WebUI", async ({ page }) => {
  await login(page, BASE, bob);
  const res = await page.request.get(BASE);
  expect(res.status(), "Pomerium should deny a user outside the policy").toBe(403);
});

test("Open WebUI is not reachable except through Pomerium", async ({ page }) => {
  await login(page, BASE, alice);
  const viaPomerium = await page.request.get(`${BASE}/health`);
  expect(viaPomerium.ok(), "the route through Pomerium should work").toBeTruthy();

  let directError = "";
  try {
    await page.request.get("http://open-webui:8080/health", { timeout: 5000 });
  } catch (e) {
    directError = String(e);
  }
  expect(
    directError,
    "Open WebUI must be unreachable directly; the only path in is through Pomerium",
  ).toMatch(/ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN|Timeout/i);
});
