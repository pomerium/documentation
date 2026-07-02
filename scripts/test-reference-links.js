#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {createSlugger} = require('@docusaurus/utils');

const CONTENT_DOCS_DIR = path.resolve(__dirname, '../content/docs');
const REFERENCE_FILE = path.join(CONTENT_DOCS_DIR, 'reference/reference.json');

const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const EXPLICIT_HEADING_ID_PATTERN = /(?:^|\s)\\?\{#([A-Za-z0-9_-]+)\}\s*$/;
const FENCE_PATTERN = /^\s*(`{3,}|~{3,})/;

function fail(message) {
  console.error(`reference link check failed: ${message}`);
  process.exitCode = 1;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function splitReferencePath(referencePath) {
  const fragmentIndex = referencePath.indexOf('#');
  if (fragmentIndex === -1) {
    return {pathname: referencePath, fragment: null};
  }

  return {
    pathname: referencePath.slice(0, fragmentIndex),
    fragment: referencePath.slice(fragmentIndex + 1),
  };
}

function resolveReferencePath(referencePath) {
  const {pathname, fragment} = splitReferencePath(referencePath);
  const resolved = path.posix
    .normalize(`reference/${pathname}`)
    .replace(/^\/+/, '');

  return {resolved, fragment};
}

function targetCandidates(resolvedPath) {
  const docName = path.posix.basename(resolvedPath.replace(/\/+$/, ''));
  return [
    path.join(CONTENT_DOCS_DIR, `${resolvedPath}.mdx`),
    path.join(CONTENT_DOCS_DIR, `${resolvedPath}.md`),
    path.join(CONTENT_DOCS_DIR, resolvedPath, 'index.mdx'),
    path.join(CONTENT_DOCS_DIR, resolvedPath, 'index.md'),
    path.join(CONTENT_DOCS_DIR, resolvedPath, `${docName}.mdx`),
    path.join(CONTENT_DOCS_DIR, resolvedPath, `${docName}.md`),
  ];
}

function findTargetFile(resolvedPath) {
  return targetCandidates(resolvedPath).find((candidate) =>
    fs.existsSync(candidate),
  );
}

function stripHeadingMarkdown(heading) {
  return heading
    .replace(EXPLICIT_HEADING_ID_PATTERN, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[([^\]]*)]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim();
}

function collectHeadingAnchors(filePath) {
  const anchors = new Set();
  const slugger = createSlugger();
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  let fence = null;

  for (const line of lines) {
    const fenceMatch = line.match(FENCE_PATTERN);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === marker) {
        fence = null;
      } else if (!fence) {
        fence = marker;
      }
      continue;
    }

    if (fence) continue;

    const headingMatch = line.match(HEADING_PATTERN);
    if (!headingMatch) continue;

    const rawHeading = headingMatch[2];
    const explicitIdMatch = rawHeading.match(EXPLICIT_HEADING_ID_PATTERN);
    if (explicitIdMatch) {
      anchors.add(explicitIdMatch[1]);
      continue;
    }

    const headingText = stripHeadingMarkdown(rawHeading);
    if (headingText) {
      anchors.add(slugger.slug(headingText));
    }
  }

  return anchors;
}

function relativeFile(filePath) {
  return path.relative(process.cwd(), filePath);
}

let references;
try {
  references = JSON.parse(fs.readFileSync(REFERENCE_FILE, 'utf8'));
} catch (error) {
  fail(`could not load ${relativeFile(REFERENCE_FILE)}: ${error.message}`);
  process.exit(1);
}

const violations = [];
const idCounts = new Map();
let checked = 0;
let checkedAnchors = 0;

for (const entry of Object.values(references)) {
  if (!entry || typeof entry !== 'object' || !isNonEmptyString(entry.id)) {
    continue;
  }

  idCounts.set(entry.id, (idCounts.get(entry.id) || 0) + 1);
}

for (const [key, entry] of Object.entries(references)) {
  const missingFields = [];
  if (!entry || typeof entry !== 'object') {
    violations.push({key, error: 'entry must be an object'});
    continue;
  }
  if (!isNonEmptyString(entry.id)) missingFields.push('id');
  if (!isNonEmptyString(entry.title)) missingFields.push('title');
  if (!isNonEmptyString(entry.path)) missingFields.push('path');
  if (missingFields.length > 0) {
    violations.push({
      key,
      id: entry.id,
      title: entry.title,
      path: entry.path,
      error: `missing non-empty ${missingFields.join(', ')}`,
    });
  }
  if (isNonEmptyString(entry.id) && idCounts.get(entry.id) > 1) {
    violations.push({
      key,
      id: entry.id,
      title: entry.title,
      path: entry.path,
      error: 'duplicate entry id',
    });
  }
  if (missingFields.length > 0) continue;

  checked++;
  const {resolved, fragment} = resolveReferencePath(entry.path);
  const targetFile = findTargetFile(resolved);
  if (!targetFile) {
    violations.push({
      key,
      id: entry.id,
      title: entry.title,
      path: entry.path,
      resolved,
      error: 'target document does not exist',
      candidates: targetCandidates(resolved).map(relativeFile),
    });
    continue;
  }

  if (!fragment) continue;

  checkedAnchors++;
  const anchors = collectHeadingAnchors(targetFile);
  if (!anchors.has(fragment)) {
    violations.push({
      key,
      id: entry.id,
      title: entry.title,
      path: entry.path,
      resolved,
      fragment,
      file: relativeFile(targetFile),
      error: 'target anchor does not exist',
    });
  }
}

if (violations.length > 0) {
  fail(
    `found ${violations.length} violation(s):\n${JSON.stringify(
      violations,
      null,
      2,
    )}`,
  );
}

if (process.exitCode) process.exit();

console.log(
  `reference link check passed: ${checked} reference paths and ${checkedAnchors} anchors resolved locally`,
);
