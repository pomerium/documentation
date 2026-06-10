const fs = require('fs');
const path = require('path');

const ALLOW_TEMPLATE_PATH = path.join(
  __dirname,
  '..',
  'templates',
  'robots-allow.txt',
);

// Only the production build of `main` (www.pomerium.com/docs/) is indexable;
// previews, branch deploys, and numbered snapshots stay noindex.
const CANONICAL_BRANCH = 'main';

function resolveBranch() {
  return process.env.HEAD || process.env.BRANCH || '';
}

function resolveRobotsMode() {
  const forcedMode = process.env.POMERIUM_DOCS_ROBOTS_MODE;
  if (forcedMode === 'allow' || forcedMode === 'disallow') {
    return forcedMode;
  }

  const branch = resolveBranch();
  const context = process.env.CONTEXT || '';

  if (context === 'production' && branch === CANONICAL_BRANCH) {
    return 'allow';
  }

  if (context || branch) {
    return 'disallow';
  }

  // Non-Netlify CI (GitHub Actions sets CI=true, no Netlify CONTEXT): fail closed.
  if (process.env.CI) {
    return 'disallow';
  }

  // Local build with no CI/Netlify env: allow, for previewing robots.txt.
  return 'allow';
}

function buildDisallowRobots(branch, context) {
  const details = [];
  if (branch) details.push(`branch=${branch}`);
  if (context) details.push(`context=${context}`);

  return [
    '# Non-canonical docs build. Block crawlers by default.',
    details.length > 0
      ? `# ${details.join(' ')}`
      : '# Branch/context unavailable.',
    '# Only the production build of `main` ships the allow template.',
    'User-agent: *',
    'Disallow: /',
    '',
  ].join('\n');
}

// Toggle X-Robots-Tag in the global `/*` block without disturbing other
// rules (the /assets/* cache header, scoped per-path overrides).
function applyRobotsTag(existing, mode) {
  const directive = `  X-Robots-Tag: ${mode === 'allow' ? 'all' : 'noindex'}`;
  const lines = (existing || '').split('\n');
  const start = lines.findIndex((line) => line.trim() === '/*');
  if (start === -1) {
    const block = `/*\n${directive}\n`;
    return existing ? `${block}\n${existing}` : block;
  }
  // The /* block runs until the next non-blank, non-indented line.
  let end = start + 1;
  while (end < lines.length && (lines[end] === '' || /^\s/.test(lines[end]))) {
    end += 1;
  }
  const block = lines.slice(start, end);
  const tagIdx = block.findIndex((line) => /X-Robots-Tag:/i.test(line));
  if (tagIdx === -1) block.splice(1, 0, directive);
  else block[tagIdx] = directive;
  return [...lines.slice(0, start), ...block, ...lines.slice(end)].join('\n');
}

async function readAllowTemplate() {
  return fs.promises.readFile(ALLOW_TEMPLATE_PATH, 'utf8');
}

async function writeRobotsTxt(outDir, mode, branch, context) {
  const robotsPath = path.join(outDir, 'robots.txt');
  const contents =
    mode === 'allow'
      ? await readAllowTemplate()
      : buildDisallowRobots(branch, context);
  await fs.promises.writeFile(robotsPath, contents, 'utf8');
}

async function writeHeaders(outDir, mode) {
  const headersPath = path.join(outDir, '_headers');
  let existing = '';
  try {
    existing = await fs.promises.readFile(headersPath, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  await fs.promises.writeFile(
    headersPath,
    applyRobotsTag(existing, mode),
    'utf8',
  );
}

async function pluginRobotsTxt(_context, _options) {
  return {
    name: 'robots-txt-plugin',

    async postBuild({outDir}) {
      const mode = resolveRobotsMode();
      const branch = resolveBranch();
      const context = process.env.CONTEXT || '';

      await writeRobotsTxt(outDir, mode, branch, context);
      await writeHeaders(outDir, mode);

      console.log(
        `robots-txt-plugin: mode=${mode} (branch=${branch || '-'}, context=${context || '-'})`,
      );
    },
  };
}

module.exports = pluginRobotsTxt;
// For test/robots-mode.test.js.
module.exports.resolveRobotsMode = resolveRobotsMode;
module.exports.applyRobotsTag = applyRobotsTag;
