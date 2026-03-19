#!/usr/bin/env node

// cspell:ignore sitemapindex
import process from 'node:process';

const DEFAULT_CHECKS = [
  'robots',
  'rootSitemap',
  'glossarySitemap',
  'docsSitemap',
  'llms',
  'llmsFull',
];

const VALID_CHECKS = new Set([
  ...DEFAULT_CHECKS,
  'docsHostLlms',
  'docsHostLlmsFull',
]);

function parseArgs(argv) {
  const args = {
    baseUrl: 'https://www.pomerium.com',
    canonicalBaseUrl: null,
    docsHostUrl: 'https://docs.pomerium.com',
    checks: [...DEFAULT_CHECKS],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base-url') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --base-url');
      }
      args.baseUrl = value;
      i += 1;
      continue;
    }
    if (arg === '--docs-host-url') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --docs-host-url');
      }
      args.docsHostUrl = value;
      i += 1;
      continue;
    }
    if (arg === '--canonical-base-url') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --canonical-base-url');
      }
      args.canonicalBaseUrl = value;
      i += 1;
      continue;
    }
    if (arg === '--check') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --check');
      }
      const checks = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const invalid = checks.filter((item) => !VALID_CHECKS.has(item));
      if (invalid.length > 0) {
        throw new Error(`Unknown check(s): ${invalid.join(', ')}`);
      }
      args.checks = checks;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  args.baseUrl = args.baseUrl.replace(/\/+$/, '');
  args.canonicalBaseUrl = (args.canonicalBaseUrl || args.baseUrl).replace(
    /\/+$/,
    '',
  );
  args.docsHostUrl = args.docsHostUrl.replace(/\/+$/, '');
  return args;
}

function isRedirectStatus(status) {
  return [301, 302, 307, 308].includes(status);
}

function normalizeLocation(location, sourceUrl) {
  if (!location) return null;
  return new URL(location, sourceUrl).toString();
}

function extractLocs(xmlText) {
  return [...xmlText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function fetchCheck(url) {
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
    headers: {
      'user-agent': 'pomerium-discovery-smoke/1.0',
    },
  });

  const body = await response.text();
  return {
    url,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
  };
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

async function runCheck(name, args) {
  const {baseUrl, canonicalBaseUrl, docsHostUrl} = args;

  if (name === 'robots') {
    const result = await fetchCheck(`${baseUrl}/robots.txt`);
    ensure(result.status === 200, `expected 200, got ${result.status}`);
    ensure(
      (result.headers['content-type'] || '').includes('text/plain'),
      `expected text/plain content-type, got ${result.headers['content-type'] || 'missing'}`,
    );
    ensure(
      result.body.includes(`Sitemap: ${canonicalBaseUrl}/sitemap.xml`),
      'missing sitemap declaration in robots.txt',
    );
    return {name, ok: true, url: result.url};
  }

  if (name === 'rootSitemap') {
    const result = await fetchCheck(`${baseUrl}/sitemap.xml`);
    if (result.status === 200) {
      ensure(
        (result.headers['content-type'] || '').includes('xml'),
        `expected XML content-type, got ${result.headers['content-type'] || 'missing'}`,
      );
      ensure(
        result.body.includes('<urlset') ||
          result.body.includes('<sitemapindex'),
        'expected XML sitemap body',
      );
      return {name, ok: true, url: result.url, mode: 'xml'};
    }
    ensure(
      result.status && isRedirectStatus(result.status),
      `expected 200 or redirect, got ${result.status}`,
    );
    const location = normalizeLocation(result.headers.location, result.url);
    ensure(
      location === `${canonicalBaseUrl}/docs/sitemap.xml`,
      `expected redirect to ${canonicalBaseUrl}/docs/sitemap.xml, got ${location || 'missing'}`,
    );
    return {name, ok: true, url: result.url, mode: 'redirect'};
  }

  if (name === 'glossarySitemap') {
    const result = await fetchCheck(`${baseUrl}/pom_glossary-sitemap.xml`);
    ensure(
      result.status && isRedirectStatus(result.status),
      `expected redirect, got ${result.status}`,
    );
    const location = normalizeLocation(result.headers.location, result.url);
    ensure(
      location === `${canonicalBaseUrl}/docs/sitemap.xml`,
      `expected redirect to ${canonicalBaseUrl}/docs/sitemap.xml, got ${location || 'missing'}`,
    );
    return {name, ok: true, url: result.url};
  }

  if (name === 'docsSitemap') {
    const result = await fetchCheck(`${baseUrl}/docs/sitemap.xml`);
    ensure(result.status === 200, `expected 200, got ${result.status}`);
    ensure(
      (result.headers['content-type'] || '').includes('xml'),
      `expected XML content-type, got ${result.headers['content-type'] || 'missing'}`,
    );
    const locs = extractLocs(result.body);
    ensure(locs.length > 0, 'expected at least one sitemap URL');
    const nonDocs = locs.filter(
      (loc) => !loc.startsWith(`${canonicalBaseUrl}/docs`),
    );
    const rawExamples = locs.filter((loc) =>
      loc.startsWith(`${canonicalBaseUrl}/examples`),
    );
    const rootEntries = locs.filter(
      (loc) => loc.replace(/\/+$/, '') === canonicalBaseUrl,
    );
    ensure(
      nonDocs.length === 0,
      `found non-doc sitemap URLs: ${nonDocs.slice(0, 3).join(', ')}`,
    );
    ensure(
      rawExamples.length === 0,
      `found raw /examples URLs: ${rawExamples.slice(0, 3).join(', ')}`,
    );
    ensure(rootEntries.length === 0, 'found root / entry in docs sitemap');
    return {name, ok: true, url: result.url, totalUrls: locs.length};
  }

  if (name === 'llms') {
    const result = await fetchCheck(`${baseUrl}/llms.txt`);
    ensure(result.status === 200, `expected 200, got ${result.status}`);
    ensure(
      (result.headers['content-type'] || '').includes('text/plain'),
      `expected text/plain content-type, got ${result.headers['content-type'] || 'missing'}`,
    );
    ensure(
      result.body.includes('# Pomerium Documentation'),
      'expected llms.txt heading',
    );
    return {name, ok: true, url: result.url};
  }

  if (name === 'llmsFull') {
    const result = await fetchCheck(`${baseUrl}/llms-full.txt`);
    ensure(result.status === 200, `expected 200, got ${result.status}`);
    ensure(
      (result.headers['content-type'] || '').includes('text/plain'),
      `expected text/plain content-type, got ${result.headers['content-type'] || 'missing'}`,
    );
    ensure(
      result.body.includes('# Pomerium Documentation (Full)'),
      'expected llms-full.txt heading',
    );
    return {name, ok: true, url: result.url};
  }

  if (name === 'docsHostLlms') {
    const result = await fetchCheck(`${docsHostUrl}/llms.txt`);
    ensure(
      result.status && isRedirectStatus(result.status),
      `expected redirect, got ${result.status}`,
    );
    const location = normalizeLocation(result.headers.location, result.url);
    ensure(
      location === `${canonicalBaseUrl}/llms.txt`,
      `expected redirect to ${canonicalBaseUrl}/llms.txt, got ${location || 'missing'}`,
    );
    return {name, ok: true, url: result.url};
  }

  if (name === 'docsHostLlmsFull') {
    const result = await fetchCheck(`${docsHostUrl}/llms-full.txt`);
    ensure(
      result.status && isRedirectStatus(result.status),
      `expected redirect, got ${result.status}`,
    );
    const location = normalizeLocation(result.headers.location, result.url);
    ensure(
      location === `${canonicalBaseUrl}/llms-full.txt`,
      `expected redirect to ${canonicalBaseUrl}/llms-full.txt, got ${location || 'missing'}`,
    );
    return {name, ok: true, url: result.url};
  }

  throw new Error(`Unhandled check: ${name}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const results = [];

  for (const name of args.checks) {
    try {
      const result = await runCheck(name, args);
      results.push(result);
    } catch (error) {
      results.push({
        name,
        ok: false,
        error: error.message,
      });
    }
  }

  const ok = results.every((result) => result.ok);
  process.stdout.write(
    `${JSON.stringify(
      {
        ok,
        baseUrl: args.baseUrl,
        canonicalBaseUrl: args.canonicalBaseUrl,
        docsHostUrl: args.docsHostUrl,
        checks: results,
      },
      null,
      2,
    )}\n`,
  );

  if (!ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
