import { Page } from "@playwright/test";

// The in-network Keycloak hostname. Login is "complete" once the browser leaves it.
export const KEYCLOAK_HOST = "keycloak.localhost.pomerium.io";

export interface TestUser {
  email: string;
  password: string;
  groups: string[];
  department: string;
}

// Seeded in _harness/keycloak/pomerium-e2e-users-0.json (passwords are uniform).
export const alice: TestUser = {
  email: "alice@company.com",
  password: "password123",
  groups: ["admins", "engineering"],
  department: "engineering",
};
export const bob: TestUser = {
  email: "bob@example.com",
  password: "password123",
  groups: ["contractors"],
  department: "sales",
};

// Drive the full interactive SSO login: hit a protected URL, get bounced through
// Pomerium to Keycloak, submit credentials, and wait for the redirect back.
// Host-agnostic so every guide reuses it regardless of its route host.
export async function login(
  page: Page,
  targetUrl: string,
  user: TestUser = alice,
): Promise<void> {
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForURL((url) => url.hostname === KEYCLOAK_HOST, { timeout: 30000 });

  await page.getByLabel(/username/i).fill(user.email);
  // Exact match avoids hitting the "Show password" toggle.
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: /sign in/i }).click();

  await page.waitForURL((url) => url.hostname !== KEYCLOAK_HOST, { timeout: 30000 });
}
