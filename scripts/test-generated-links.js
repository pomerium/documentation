#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ORIGIN = 'https://www.pomerium.com';
const BUILD_DIR = path.resolve('build');
const REDIRECTS_FILE = path.resolve('static/_redirects');

const MARKDOWN_LINK_PATTERN =
  /\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)|<((?:https?:\/\/|\/)[^>\s]+)>/g;

function fail(message) {
  console.error(`generated link check failed: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function sitePathToCandidates(sitePath) {
  const cleanPath = sitePath.replace(/^\/+/, '');
  const withoutTrailingSlash = cleanPath.replace(/\/+$/, '');

  return [
    path.join(BUILD_DIR, cleanPath),
    path.join(BUILD_DIR, withoutTrailingSlash),
    path.join(BUILD_DIR, `${withoutTrailingSlash}.html`),
    path.join(BUILD_DIR, withoutTrailingSlash, 'index.html'),
    path.join(BUILD_DIR, `${withoutTrailingSlash}.md`),
    path.join(BUILD_DIR, withoutTrailingSlash, 'index.md'),
  ];
}

function builtSitePathExists(sitePath) {
  return sitePathToCandidates(sitePath).some((candidate) =>
    fs.existsSync(candidate),
  );
}

function normalizeInternalUrl(rawUrl, parentSitePath = '/') {
  if (
    !rawUrl ||
    rawUrl.startsWith('#') ||
    rawUrl.startsWith('mailto:') ||
    rawUrl.startsWith('tel:')
  ) {
    return null;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl, `${SITE_ORIGIN}${parentSitePath}`);
  } catch {
    return null;
  }

  const isPomeriumDocsHost =
    parsedUrl.hostname === 'www.pomerium.com' ||
    parsedUrl.hostname === 'docs.pomerium.com';
  if (!isPomeriumDocsHost) {
    return null;
  }

  const isDocsSurface =
    parsedUrl.pathname === '/llms.txt' ||
    parsedUrl.pathname === '/llms-full.txt' ||
    parsedUrl.pathname === '/llms-index.txt' ||
    parsedUrl.pathname.startsWith('/docs');
  if (!isDocsSurface) return null;

  return parsedUrl.pathname;
}

function sitePathForBuildFile(filePath) {
  const relativePath = path.relative(BUILD_DIR, filePath).replace(/\\/g, '/');
  return `/${relativePath}`;
}

function checkRedirectDestinations() {
  const missing = [];
  const lines = fs.readFileSync(REDIRECTS_FILE, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const parts = trimmed.split(/\s+/);
    const destination = parts[1];
    if (!destination || !destination.startsWith('/')) return;
    // Splat redirects such as /enterprise/* -> /docs/deploy/enterprise/:splat
    // need a concrete source path to validate.
    if (destination.includes(':')) return;

    const [sitePath] = destination.split(/[?#]/);
    if (!builtSitePathExists(sitePath)) {
      missing.push({
        line: index + 1,
        source: parts[0],
        destination,
      });
    }
  });

  return missing;
}

function checkMarkdownLinks() {
  const markdownFiles = [
    path.join(BUILD_DIR, 'llms.txt'),
    path.join(BUILD_DIR, 'llms-full.txt'),
    path.join(BUILD_DIR, 'llms-index.txt'),
    ...walk(path.join(BUILD_DIR, 'docs')).filter((file) =>
      file.endsWith('.md'),
    ),
  ].filter((file) => fs.existsSync(file));

  const missing = [];
  let checked = 0;

  for (const markdownFile of markdownFiles) {
    const parentSitePath = sitePathForBuildFile(markdownFile);
    const content = fs.readFileSync(markdownFile, 'utf8');
    let match;

    while ((match = MARKDOWN_LINK_PATTERN.exec(content))) {
      const rawUrl = match[1] || match[2];
      const sitePath = normalizeInternalUrl(rawUrl, parentSitePath);
      if (!sitePath) continue;

      checked++;
      // Generated markdown links must point at concrete built artifacts. Do not
      // resolve redirect sources here; a .md sidecar URL should be fetchable.
      if (!builtSitePathExists(sitePath)) {
        missing.push({
          file: path.relative(process.cwd(), markdownFile),
          url: rawUrl,
          sitePath,
        });
      }
    }
  }

  return {checked, missing};
}

if (!fs.existsSync(BUILD_DIR)) {
  fail('build/ does not exist; run yarn build first');
  process.exit(1);
}

const missingRedirects = checkRedirectDestinations();
const {checked, missing: missingMarkdownLinks} = checkMarkdownLinks();

if (missingRedirects.length > 0) {
  fail(
    `missing redirect destinations:\n${JSON.stringify(
      missingRedirects,
      null,
      2,
    )}`,
  );
}

if (missingMarkdownLinks.length > 0) {
  fail(
    `missing generated markdown links:\n${JSON.stringify(
      missingMarkdownLinks,
      null,
      2,
    )}`,
  );
}

if (process.exitCode) process.exit();

console.log(
  `generated link check passed: ${checked} internal markdown links and static redirect destinations resolved locally`,
);
