const fs = require('fs');
const path = require('path');

const RELEASE_BRANCH_RE = /^\d+-\d+-\d+$/;
const ALLOW_TEMPLATE_PATH = path.join(
  __dirname,
  '..',
  'templates',
  'robots-allow.txt',
);

function resolveRobotsMode() {
  const forcedMode = process.env.POMERIUM_DOCS_ROBOTS_MODE;
  if (forcedMode === 'allow' || forcedMode === 'disallow') {
    return forcedMode;
  }

  const branch = process.env.HEAD || process.env.BRANCH || '';
  if (RELEASE_BRANCH_RE.test(branch)) {
    return 'allow';
  }

  const context = process.env.CONTEXT || '';
  if (context === 'deploy-preview' || context === 'branch-deploy') {
    return 'disallow';
  }

  if (branch) {
    // Production docs are expected to build from numbered release branches.
    // If that changes, set POMERIUM_DOCS_ROBOTS_MODE=allow explicitly.
    return 'disallow';
  }

  // Local/manual builds default to the checked-in allow template.
  return 'allow';
}

function buildDisallowRobots(branch, context) {
  const details = [];
  if (branch) details.push(`branch=${branch}`);
  if (context) details.push(`context=${context}`);

  return [
    '# Non-release docs build. Block crawlers by default.',
    details.length > 0
      ? `# ${details.join(' ')}`
      : '# Branch/context unavailable.',
    '# Stable release branches keep the checked-in allow template.',
    'User-agent: *',
    'Disallow: /',
    '',
  ].join('\n');
}

async function readAllowTemplate() {
  return fs.promises.readFile(ALLOW_TEMPLATE_PATH, 'utf8');
}

async function pluginRobotsTxt(_context, _options) {
  return {
    name: 'robots-txt-plugin',

    async postBuild({outDir}) {
      const mode = resolveRobotsMode();
      const branch = process.env.HEAD || process.env.BRANCH || '';
      const context = process.env.CONTEXT || '';

      const robotsPath = path.join(outDir, 'robots.txt');
      if (mode === 'allow') {
        await fs.promises.writeFile(
          robotsPath,
          await readAllowTemplate(),
          'utf8',
        );
        console.log(
          `✅ Wrote allow robots.txt template (${branch || 'no-branch'}${context ? `, ${context}` : ''})`,
        );
        return;
      }

      await fs.promises.writeFile(
        robotsPath,
        buildDisallowRobots(branch, context),
        'utf8',
      );
      console.log(
        `✅ Wrote disallow robots.txt (${branch || 'no-branch'}${context ? `, ${context}` : ''})`,
      );
    },
  };
}

module.exports = pluginRobotsTxt;
