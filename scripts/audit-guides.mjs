#!/usr/bin/env node
// Objective guide-audit linter for content/docs/guides/*.{md,mdx}.
//
// Two severities:
//   - ERROR: fails the build (exit 1). Accessibility checks: iframe title
//     attributes and image alt text (presence + length).
//   - WARN:  reported but never fails the build. Front-matter completeness and
//     the screenshot/image: pairing are surfaced without blocking CI; a later
//     change can promote front-matter completeness to ERROR.
//
// No new npm dependencies: js-yaml is already a devDependency, so we reuse it
// for front-matter parsing instead of hand-rolling a YAML parser.
import yaml from 'js-yaml';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const GUIDES_DIR = 'content/docs/guides';
const REQUIRED_FRONT_MATTER = [
  'title',
  'description',
  'sidebar_label',
  'lang',
  'keywords',
];
const MAX_ALT_LENGTH = 120;
const IMAGE_EXT_RE = /\.(png|gif|jpe?g|svg|webp)/i;

// Checks that block the build when violated.
const FAILING_CHECKS = new Set(['iframe-title', 'alt-text']);

function parseFrontMatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    const data = yaml.load(match[1]);
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

// Blank out fenced and inline code so example markup shown as code (for
// instance an ![](...) sample inside a ``` block) is never flagged. Replacing
// with spaces preserves offsets and keeps multi-line constructs intact.
function stripCode(source) {
  return source
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/~~~[\s\S]*?~~~/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
}

// Each finding: { file, check, severity, message }
const findings = [];
function add(file, check, message) {
  const severity = FAILING_CHECKS.has(check) ? 'ERROR' : 'WARN';
  findings.push({file, check, severity, message});
}

function auditFile(file, source) {
  const fm = parseFrontMatter(source);
  if (fm === null) {
    add(file, 'front-matter', 'missing front matter block');
  } else {
    for (const key of REQUIRED_FRONT_MATTER) {
      if (isEmpty(fm[key])) {
        add(file, 'front-matter', `front matter "${key}" is missing or empty`);
      }
    }
  }

  // Scan the prose with code spans/blocks blanked out so example markup in
  // fenced or inline code never trips the accessibility checks.
  const body = stripCode(source);

  // iframe title attribute. Matches both self-closing and paired iframes.
  for (const m of body.matchAll(
    /<iframe\b[^>]*?(?:\/?>|>[\s\S]*?<\/iframe>)/gi,
  )) {
    const title = m[0].match(/\btitle\s*=\s*["']([^"']*)["']/i);
    if (!title || title[1].trim() === '') {
      add(
        file,
        'iframe-title',
        'iframe is missing a non-empty title attribute',
      );
    }
  }

  // Markdown images: ![alt](url)
  for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)]*)\)/g)) {
    checkAlt(file, m[1]);
  }

  // HTML images: <img ... alt="...">
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    const alt = m[0].match(/\balt\s*=\s*["']([^"']*)["']/i);
    if (!alt) {
      add(file, 'alt-text', 'img tag is missing an alt attribute');
    } else {
      checkAlt(file, alt[1]);
    }
  }

  // WARN: references a screenshot but has no image: front matter.
  const hasImageFm = fm && !isEmpty(fm.image);
  const refsScreenshot =
    new RegExp(
      `!\\[[^\\]]*\\]\\([^)]*${IMAGE_EXT_RE.source}[^)]*\\)`,
      'i',
    ).test(body) || /\bimg\//.test(body);
  if (refsScreenshot && !hasImageFm) {
    add(
      file,
      'image-front-matter',
      'references a screenshot but has no image: front matter',
    );
  }
}

function checkAlt(file, alt) {
  if (alt.trim() === '') {
    add(file, 'alt-text', 'image has empty alt text');
  } else if (alt.length > MAX_ALT_LENGTH) {
    add(
      file,
      'alt-text',
      `alt text is ${alt.length} chars (max ${MAX_ALT_LENGTH}): "${alt}"`,
    );
  }
}

const files = readdirSync(GUIDES_DIR)
  .filter((f) => /\.(md|mdx)$/.test(f))
  .sort();

for (const name of files) {
  const path = join(GUIDES_DIR, name);
  auditFile(path, readFileSync(path, 'utf8'));
}

const errors = findings.filter((f) => f.severity === 'ERROR');
const warnings = findings.filter((f) => f.severity === 'WARN');

for (const f of findings) {
  console.log(`${f.severity} ${f.file}: ${f.message}`);
}

console.log(
  `\nguide-audit: scanned ${files.length} guides, ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`,
);

if (errors.length > 0) {
  console.error(
    `\nguide-audit failed: ${errors.length} blocking violation(s). ` +
      'Fix iframe titles and alt text above.',
  );
  process.exit(1);
}
