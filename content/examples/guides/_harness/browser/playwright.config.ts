import { defineConfig, devices } from "@playwright/test";

// Runs inside the harness network. POMERIUM_URL is the route under test;
// PW_TEST_DIR lets a guide point at its own assertion spec instead of the
// default identity check. ignoreHTTPSErrors covers the harness's self-signed CA,
// so the browser never needs the CA installed.
export default defineConfig({
  testDir: process.env.PW_TEST_DIR || "./tests",
  reporter: [["list"]],
  use: {
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  timeout: 60000,
  expect: { timeout: 15000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
