#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import yaml from 'js-yaml';

const DOC_ROOTS = [
  {dir: 'content/docs', routePrefix: '/docs'},
  {dir: 'content/examples', routePrefix: '/examples'},
];

const SKIP_DIRS = new Set(['img', 'assets']);
const FILE_EXT_RE = /\.(md|mdx)$/i;
const FRONTMATTER_RE = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const H1_RE = /^#\s+(.+)$/m;
const GATE_KEYS = new Set([
  'missingTitle',
  'missingDescription',
  'frontmatterErrors',
  'llmsFileMissing',
  'llmsRelativeUrls',
  'llmsPartialUrls',
]);

function parseArgs(argv) {
  const args = {strict: false, llmsFile: null, gates: []};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--strict') {
      args.strict = true;
    } else if (arg === '--gate') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --gate');
      }
      args.gates.push(...value.split(',').map((gate) => gate.trim()).filter(Boolean));
      i += 1;
    } else if (arg === '--llms-file') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --llms-file');
      }
      args.llmsFile = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function normalizeText(value) {
  if (typeof value !== 'string') return null;
  // Collapse multiline YAML blocks for audit-only comparisons and counts.
  const trimmed = value.replace(/\s+/g, ' ').trim();
  return trimmed.length > 0 ? trimmed : null;
}

function extractFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return {};
  try {
    const parsed = yaml.load(match[1]);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {__frontmatterError: error.message};
  }
}

function routeForFile(filePath, routePrefix, rootDir) {
  let rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  rel = rel.replace(FILE_EXT_RE, '');
  if (rel.endsWith('/README')) rel = rel.slice(0, -'/README'.length);
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  if (rel === '') return routePrefix;
  return `${routePrefix}/${rel}`;
}

function shouldSkipAuditFile(entryName, routePrefix) {
  if (entryName.startsWith('_')) return true;
  if (routePrefix !== '/examples') return false;

  const sourceName = entryName.replace(FILE_EXT_RE, '');
  return sourceName !== 'README' && sourceName.includes('.');
}

function collectPages(root, routePrefix) {
  const pages = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
        if (entry.isSymbolicLink()) continue;
        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!FILE_EXT_RE.test(entry.name)) continue;
      if (shouldSkipAuditFile(entry.name, routePrefix)) continue;

      const raw = fs.readFileSync(fullPath, 'utf8');
      const frontmatter = extractFrontmatter(raw);
      const title = normalizeText(frontmatter.title) || normalizeText(raw.match(H1_RE)?.[1]);
      const description = normalizeText(frontmatter.description);

      pages.push({
        filePath: fullPath,
        route: routeForFile(fullPath, routePrefix, root),
        title,
        description,
        frontmatterError: frontmatter.__frontmatterError || null,
      });
    }
  }

  if (fs.existsSync(root)) walk(root);
  return pages;
}

function buildAuditSummary(pages, llmsFile) {
  const missingTitle = [];
  const missingDescription = [];
  const frontmatterErrors = [];
  const titles = new Map();

  for (const page of pages) {
    if (!page.title) missingTitle.push(page);
    if (!page.description) missingDescription.push(page);
    if (page.frontmatterError) frontmatterErrors.push(page);
    if (page.title) {
      const key = page.title.toLowerCase();
      const list = titles.get(key) || [];
      list.push(page);
      titles.set(key, list);
    }
  }

  const duplicateTitles = [...titles.values()]
    .filter((list) => list.length > 1)
    .map((list) => ({
      title: list[0].title,
      routes: list.map((page) => page.route),
    }));

  const llmsSummary = {
    file: llmsFile,
    missing: Boolean(llmsFile) && !fs.existsSync(llmsFile),
    relativeUrls: [],
    partialUrls: [],
    hasInstructionsSection: false,
  };

  if (llmsFile && fs.existsSync(llmsFile)) {
    const llmsText = fs.readFileSync(llmsFile, 'utf8');
    llmsSummary.hasInstructionsSection = llmsText.includes('## Instructions for LLM Agents');

    const matches = [...llmsText.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)];
    for (const match of matches) {
      const url = match[1];
      const isAbsolute = /^https?:\/\//.test(url) || url.startsWith('/');
      if (!isAbsolute) llmsSummary.relativeUrls.push(url);
      if (/(^|\/)_/.test(url)) llmsSummary.partialUrls.push(url);
    }
  }

  return {
    totals: {
      pages: pages.length,
      missingTitle: missingTitle.length,
      missingDescription: missingDescription.length,
      frontmatterErrors: frontmatterErrors.length,
      duplicateTitles: duplicateTitles.length,
      llmsFileMissing: llmsSummary.missing ? 1 : 0,
      llmsRelativeUrls: llmsSummary.relativeUrls.length,
      llmsPartialUrls: llmsSummary.partialUrls.length,
    },
    samples: {
      missingTitle: missingTitle.slice(0, 10).map((page) => page.filePath),
      missingDescription: missingDescription.slice(0, 10).map((page) => page.filePath),
      frontmatterErrors: frontmatterErrors.slice(0, 10).map((page) => ({
        filePath: page.filePath,
        error: page.frontmatterError,
      })),
      duplicateTitles: duplicateTitles.slice(0, 10),
      llmsRelativeUrls: llmsSummary.relativeUrls.slice(0, 10),
      llmsPartialUrls: llmsSummary.partialUrls.slice(0, 10),
    },
    llms: llmsSummary,
  };
}

function resolveGateKeys(args) {
  if (!args.strict) return [];
  if (args.gates.length === 0) return [...GATE_KEYS];

  const invalid = args.gates.filter((gate) => !GATE_KEYS.has(gate));
  if (invalid.length > 0) {
    throw new Error(`Unknown gate(s): ${invalid.join(', ')}`);
  }

  return args.gates;
}

function formatStrictFailure(activeGates, totals) {
  return activeGates
    .filter((gate) => (totals[gate] || 0) > 0)
    .map((gate) => `${gate}=${totals[gate]}`)
    .join(', ');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pages = DOC_ROOTS.flatMap(({dir, routePrefix}) => collectPages(dir, routePrefix));
  const summary = buildAuditSummary(pages, args.llmsFile);
  const activeGates = resolveGateKeys(args);

  if (activeGates.length > 0) {
    summary.gates = {
      active: activeGates,
    };
  }

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  if (activeGates.length === 0) return;

  const failures = activeGates.filter((gate) => (summary.totals[gate] || 0) > 0);
  if (failures.length === 0) return;

  process.stderr.write(`STRICT FAIL: ${formatStrictFailure(activeGates, summary.totals)}\n`);
  process.exitCode = 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
