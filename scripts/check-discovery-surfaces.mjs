#!/usr/bin/env node

const DEFAULT_WWW_BASE_URL = "https://www.pomerium.com";
const DEFAULT_DOCS_BASE_URL = "https://docs.pomerium.com";
const FETCH_TIMEOUT_MS = 15_000;

function parseArgs(argv) {
  const options = {
    wwwBaseUrl: DEFAULT_WWW_BASE_URL,
    docsBaseUrl: DEFAULT_DOCS_BASE_URL,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--www-base-url") {
      if (!argv[index + 1]) {
        throw new Error("--www-base-url requires a value.");
      }
      options.wwwBaseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--docs-base-url") {
      if (!argv[index + 1]) {
        throw new Error("--docs-base-url requires a value.");
      }
      options.docsBaseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.wwwBaseUrl || !options.docsBaseUrl) {
    throw new Error("Both --www-base-url and --docs-base-url require values.");
  }

  return options;
}

function printUsage() {
  console.log(`Usage: node scripts/check-discovery-surfaces.mjs [options]

Options:
  --www-base-url <url>   Base URL for the primary docs host
  --docs-base-url <url>  Base URL for docs.pomerium.com redirects
  -h, --help             Show this help message
`);
}

function buildUrl(baseUrl, pathname) {
  return new URL(pathname, ensureTrailingSlash(baseUrl)).toString();
}

function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

async function fetchCheck({ name, url, expectedStatus, expectedLocation }) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": "pomerium-docs-discovery-smoke-check/1.0",
      },
    });

    const actualLocation = response.headers.get("location");
    const actualContentType = response.headers.get("content-type") || "";
    const passed =
      response.status === expectedStatus &&
      (expectedLocation ? actualLocation === expectedLocation : true);

    return {
      name,
      url,
      expectedStatus,
      actualStatus: response.status,
      expectedLocation: expectedLocation || null,
      actualLocation: actualLocation || null,
      contentType: actualContentType,
      passed,
      error: null,
    };
  } catch (error) {
    return {
      name,
      url,
      expectedStatus,
      actualStatus: null,
      expectedLocation: expectedLocation || null,
      actualLocation: null,
      contentType: "",
      passed: false,
      error: error.message,
    };
  }
}

function buildChecks({ wwwBaseUrl, docsBaseUrl }) {
  return [
    {
      name: "www llms.txt",
      url: buildUrl(wwwBaseUrl, "/llms.txt"),
      expectedStatus: 200,
    },
    {
      name: "www llms-full.txt",
      url: buildUrl(wwwBaseUrl, "/llms-full.txt"),
      expectedStatus: 200,
    },
    {
      name: "www sitemap.xml",
      url: buildUrl(wwwBaseUrl, "/sitemap.xml"),
      expectedStatus: 200,
    },
    {
      name: "www docs sitemap",
      url: buildUrl(wwwBaseUrl, "/docs/sitemap.xml"),
      expectedStatus: 200,
    },
    {
      name: "www robots.txt",
      url: buildUrl(wwwBaseUrl, "/robots.txt"),
      expectedStatus: 200,
    },
    {
      name: "docs llms redirect",
      url: buildUrl(docsBaseUrl, "/llms.txt"),
      expectedStatus: 301,
      expectedLocation: buildUrl(wwwBaseUrl, "/llms.txt"),
    },
    {
      name: "docs llms-full redirect",
      url: buildUrl(docsBaseUrl, "/llms-full.txt"),
      expectedStatus: 301,
      expectedLocation: buildUrl(wwwBaseUrl, "/llms-full.txt"),
    },
  ];
}

function printSummary(results) {
  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    console.log(
      `${status} ${result.name}: expected ${result.expectedStatus}, got ${result.actualStatus} (${result.url})`,
    );

    if (result.expectedLocation || result.actualLocation) {
      console.log(
        `  location: expected ${result.expectedLocation ?? "none"}, got ${result.actualLocation ?? "none"}`,
      );
    }

    if (result.error) {
      console.log(`  error: ${result.error}`);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const checks = buildChecks(options);
  const results = [];

  for (const check of checks) {
    results.push(await fetchCheck(check));
  }

  printSummary(results);

  const failedChecks = results.filter((result) => !result.passed);
  if (failedChecks.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
