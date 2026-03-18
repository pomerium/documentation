#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";

const DEFAULT_BASE_URL = "http://127.0.0.1:3002";
const DEFAULT_OUT_DIR = "output/playwright/visual-qa";
const ROUTES_FILE = new URL("./visual-qa.routes.json", import.meta.url);
const GLOBAL_DATA_FILE = new URL(
  "../.docusaurus/globalData.json",
  import.meta.url,
);
const NAVIGATION_TIMEOUT_MS = 20_000;
const CHECK_TIMEOUT_MS = 10_000;
const SCREENSHOT_TIMEOUT_MS = 20_000;
const ROUTE_TIMEOUT_MS = 60_000;
// These recoverable React warnings are present on clean origin/main today.
// Keep them visible in the report without failing the whole sweep.
const KNOWN_CONSOLE_WARNINGS = [
  {
    path: "/docs/deploy/k8s/ingress",
    includes: "Docusaurus React Root onRecoverableError",
  },
  {
    path: "/docs/deploy/k8s/reference",
    includes: "Docusaurus React Root onRecoverableError",
  },
];

function usage() {
  return `Usage: npm run visual-qa -- [options]

Options:
  --base-url <url>       Base URL to test (default: ${DEFAULT_BASE_URL})
  --out-dir <dir>        Output directory (default: ${DEFAULT_OUT_DIR})
  --desktop-only         Skip the mobile viewport run
  --mobile-only          Skip the desktop viewport run
  --all-docs             Walk all current /docs routes from .docusaurus/globalData.json
  --skip-screenshots     Do not write screenshots
  --help                 Show this help
`;
}

function readValueArg(argv, index, flag) {
  const value = argv[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}\n\n${usage()}`);
  }

  return value;
}

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    outDir: DEFAULT_OUT_DIR,
    desktop: true,
    mobile: true,
    allDocs: false,
    skipScreenshots: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--base-url") {
      options.baseUrl = readValueArg(argv, i, arg);
      i += 1;
      continue;
    }

    if (arg === "--out-dir") {
      options.outDir = readValueArg(argv, i, arg);
      i += 1;
      continue;
    }

    if (arg === "--desktop-only") {
      options.mobile = false;
      continue;
    }

    if (arg === "--mobile-only") {
      options.desktop = false;
      continue;
    }

    if (arg === "--all-docs") {
      options.allDocs = true;
      continue;
    }

    if (arg === "--skip-screenshots") {
      options.skipScreenshots = true;
      continue;
    }

    if (arg === "--help") {
      console.log(usage());
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}\n\n${usage()}`);
  }

  if (!options.desktop && !options.mobile) {
    throw new Error(`At least one device mode must be enabled.\n\n${usage()}`);
  }

  return options;
}

async function pathExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readRoutes() {
  return JSON.parse(await fs.readFile(ROUTES_FILE, "utf8"));
}

async function readAllDocsRoutes() {
  if (!(await pathExists(GLOBAL_DATA_FILE))) {
    throw new Error(
      `Missing ${GLOBAL_DATA_FILE.pathname}. Run 'npm run build' before '--all-docs'.`,
    );
  }

  const globalData = JSON.parse(await fs.readFile(GLOBAL_DATA_FILE, "utf8"));
  const docsPlugin = globalData["docusaurus-plugin-content-docs"];
  const currentVersion = docsPlugin?.default?.versions?.find(
    (version) => version.name === "current",
  );

  if (!currentVersion) {
    throw new Error(
      "Could not find current docs version in .docusaurus/globalData.json",
    );
  }

  const docsRoutes = currentVersion.docs
    .map((doc) => ({
      name: doc.id.replaceAll("/", "-"),
      path:
        doc.path.endsWith("/") && doc.path !== "/"
          ? doc.path.slice(0, -1)
          : doc.path,
      checks: ["doc-content"],
    }))
    .filter((route) => route.path.startsWith("/docs"));

  return [
    {
      name: "homepage",
      path: "/",
      checks: ["footer", "main-content"],
    },
    ...docsRoutes,
  ];
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function sanitizeName(name) {
  return name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function createDevices(options) {
  const devices = [];

  if (options.desktop) {
    devices.push({
      name: "desktop",
      viewport: { width: 1440, height: 1200 },
    });
  }

  if (options.mobile) {
    devices.push({
      name: "mobile",
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
  }

  return devices;
}

async function selectorExists(page, selector) {
  return Boolean(await page.$(selector));
}

async function runChecks(page, checks) {
  const results = {};

  for (const check of checks) {
    switch (check) {
      case "footer":
        results.footer = await selectorExists(page, "footer");
        break;
      case "main-content":
        results.mainContent = await selectorExists(page, "main, article");
        break;
      case "doc-content":
        results.docContent = await selectorExists(
          page,
          "main article, article",
        );
        break;
      case "no-doc-content":
        results.noDocContent = !(await selectorExists(
          page,
          "main article, article",
        ));
        break;
      case "admonition":
        results.admonition =
          (await page.$$eval(".theme-admonition", (nodes) => nodes.length)) > 0;
        break;
      case "tabs":
        results.tabs =
          (await page.$$eval('[role="tab"]', (nodes) => nodes.length)) > 0;
        break;
      case "code-block":
        results.codeBlock =
          (await page.$$eval("pre code", (nodes) => nodes.length)) > 0;
        break;
      case "details":
        results.details =
          (await page.$$eval("details", (nodes) => nodes.length)) > 0;
        break;
      case "reference-table":
        results.referenceTable = await selectorExists(
          page,
          '[role="grid"], table',
        );
        break;
      case "images":
        results.images =
          (await page.$$eval("img", (nodes) => nodes.length)) > 0;
        break;
      case "versions-page":
        results.versionsPage =
          (await page.$$eval(
            'a[href*=".docs.pomerium.com"], a[href*="/docs/versions"]',
            (nodes) => nodes.length,
          )) > 0;
        break;
      case "not-found":
        results.notFound = await page.$eval("body", (node) => {
          const text = node.innerText;
          return text.includes("Page Not Found") || text.includes("404");
        });
        break;
      default:
        results[check] = "unknown-check";
        break;
    }
  }

  return results;
}

function isIgnorableHttpError(entry, routePath) {
  if (entry.url.includes("/static/js/syft.js")) {
    return true;
  }

  if (routePath === "/does-not-exist" && entry.status === 404) {
    return true;
  }

  return false;
}

function isIgnorableConsoleError(message) {
  return (
    message.includes("MUI X: Missing license key") ||
    message.includes("net::ERR_CONNECTION_REFUSED") ||
    message.includes(
      "Failed to load resource: the server responded with a status of 404",
    )
  );
}

function isKnownConsoleWarning(routePath, message) {
  return KNOWN_CONSOLE_WARNINGS.some(
    (warning) =>
      warning.path === routePath && message.includes(warning.includes),
  );
}

async function exerciseInteractiveBits(page, checks) {
  if (checks.includes("tabs")) {
    const tabs = await page.$$('[role="tab"]');
    for (const tab of tabs.slice(0, 3)) {
      await tab.click().catch(() => {});
      await sleep(150);
    }
  }

  if (checks.includes("details")) {
    const summary = await page.$("details summary");
    if (summary) {
      await summary.click().catch(() => {});
      await sleep(150);
    }
  }
}

async function captureRoute(browser, route, device, options) {
  return withTimeout(
    (async () => {
      const page = await browser.newPage();
      const result = {
        name: route.name,
        path: route.path,
        device: device.name,
        url: new URL(route.path, options.baseUrl).toString(),
        consoleErrors: [],
        consoleWarnings: [],
        pageErrors: [],
        httpErrors: [],
        checks: {},
        screenshot: "",
        status: "pass",
      };

      try {
        page.on("pageerror", (error) => {
          result.pageErrors.push(String(error.message || error));
        });

        page.on("console", (message) => {
          if (message.type() === "error") {
            const text = message.text();
            if (!isIgnorableConsoleError(text)) {
              if (isKnownConsoleWarning(route.path, text)) {
                result.consoleWarnings.push(text);
              } else {
                result.consoleErrors.push(text);
              }
            }
          }
        });

        page.on("response", (response) => {
          if (response.status() >= 400) {
            const entry = {
              status: response.status(),
              url: response.url(),
            };
            if (!isIgnorableHttpError(entry, route.path)) {
              result.httpErrors.push(entry);
            }
          }
        });

        await page.setViewport(device.viewport);
        if (device.userAgent) {
          await page.setUserAgent(device.userAgent);
        }

        await page.goto(result.url, {
          waitUntil: "domcontentloaded",
          timeout: NAVIGATION_TIMEOUT_MS,
        });
        await page
          .waitForSelector("main, article", {
            timeout: NAVIGATION_TIMEOUT_MS,
          })
          .catch(() => {});
        await sleep(250);
        await withTimeout(
          exerciseInteractiveBits(page, route.checks),
          CHECK_TIMEOUT_MS,
          `interactive checks for ${route.path} (${device.name})`,
        );
        result.checks = await withTimeout(
          runChecks(page, route.checks),
          CHECK_TIMEOUT_MS,
          `content checks for ${route.path} (${device.name})`,
        );

        const failedChecks = Object.values(result.checks).some(
          (value) => value !== true,
        );
        if (
          failedChecks ||
          result.consoleErrors.length > 0 ||
          result.pageErrors.length > 0 ||
          result.httpErrors.length > 0
        ) {
          result.status = "fail";
        }

        const screenshotDir = path.resolve(options.outDir, "screenshots");
        if (!options.skipScreenshots) {
          await ensureDir(screenshotDir);
          const screenshotPath = path.join(
            screenshotDir,
            `${sanitizeName(route.name)}-${device.name}.png`,
          );
          await withTimeout(
            page.screenshot({ path: screenshotPath, fullPage: true }),
            SCREENSHOT_TIMEOUT_MS,
            `screenshot for ${route.path} (${device.name})`,
          );
          result.screenshot = screenshotPath;
        }

        return result;
      } finally {
        await page.close().catch(() => {});
      }
    })(),
    ROUTE_TIMEOUT_MS,
    `route ${route.path} (${device.name})`,
  );
}

async function assertServerAvailable(baseUrl) {
  let response;
  try {
    response = await fetch(baseUrl);
  } catch (error) {
    throw new Error(
      `Could not reach ${baseUrl}. Start a local docs server before running visual-qa.\n${String(error.message || error)}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Base URL ${baseUrl} responded with ${response.status}. Expected a healthy docs server.`,
    );
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await assertServerAvailable(options.baseUrl);
  const routes = options.allDocs
    ? await readAllDocsRoutes()
    : await readRoutes();
  const devices = createDevices(options);

  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  try {
    console.error(
      `visual-qa: checking ${routes.length} routes across ${devices.length} device mode(s)`,
    );
    for (const route of routes) {
      for (const device of devices) {
        console.error(`visual-qa: ${device.name} ${route.path}`);
        try {
          results.push(await captureRoute(browser, route, device, options));
        } catch (error) {
          results.push({
            name: route.name,
            path: route.path,
            device: device.name,
            url: new URL(route.path, options.baseUrl).toString(),
            consoleErrors: [],
            pageErrors: [String(error.message || error)],
            httpErrors: [],
            checks: {},
            screenshot: "",
            status: "fail",
          });
        }
      }
    }
  } finally {
    await browser.close();
  }

  const failures = results.filter((result) => result.status === "fail");
  const report = {
    baseUrl: options.baseUrl,
    total: results.length,
    failures: failures.length,
    warnings: results.filter((result) => result.consoleWarnings?.length > 0)
      .length,
    results,
  };

  await ensureDir(path.resolve(options.outDir));
  const reportPath = path.resolve(options.outDir, "report.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(
    JSON.stringify(
      {
        report: reportPath,
        total: report.total,
        failures: report.failures,
        warnings: report.warnings,
      },
      null,
      2,
    ),
  );
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
