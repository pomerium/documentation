// Crawler-mode regression tests for plugins/robots-txt-plugin.js.
// Run: `yarn test:robots`.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');

const {
  resolveRobotsMode,
  applyRobotsTag,
} = require('../plugins/robots-txt-plugin');

const ENV_KEYS = [
  'POMERIUM_DOCS_ROBOTS_MODE',
  'HEAD',
  'BRANCH',
  'CONTEXT',
  'CI',
];

function withEnv(env, fn) {
  const saved = {};
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  Object.assign(process.env, env);
  try {
    return fn();
  } finally {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

test('production build of main is the only indexable build', () => {
  assert.equal(
    withEnv({CONTEXT: 'production', HEAD: 'main'}, resolveRobotsMode),
    'allow',
  );
});

test('numbered release-branch snapshot is noindex (even in production context)', () => {
  assert.equal(
    withEnv({CONTEXT: 'branch-deploy', HEAD: '0-32-0'}, resolveRobotsMode),
    'disallow',
  );
  assert.equal(
    withEnv({CONTEXT: 'production', HEAD: '0-32-0'}, resolveRobotsMode),
    'disallow',
  );
});

test('deploy previews are noindex', () => {
  assert.equal(
    withEnv(
      {CONTEXT: 'deploy-preview', HEAD: 'some-feature-branch'},
      resolveRobotsMode,
    ),
    'disallow',
  );
});

test('POMERIUM_DOCS_ROBOTS_MODE override wins', () => {
  assert.equal(
    withEnv(
      {
        POMERIUM_DOCS_ROBOTS_MODE: 'disallow',
        CONTEXT: 'production',
        HEAD: 'main',
      },
      resolveRobotsMode,
    ),
    'disallow',
  );
  assert.equal(
    withEnv(
      {
        POMERIUM_DOCS_ROBOTS_MODE: 'allow',
        CONTEXT: 'deploy-preview',
        HEAD: '0-32-0',
      },
      resolveRobotsMode,
    ),
    'allow',
  );
});

test('main as a branch deploy (not yet promoted) is noindex', () => {
  assert.equal(
    withEnv({CONTEXT: 'branch-deploy', HEAD: 'main'}, resolveRobotsMode),
    'disallow',
  );
});

test('BRANCH is honored when HEAD is unset', () => {
  assert.equal(
    withEnv({CONTEXT: 'production', BRANCH: 'main'}, resolveRobotsMode),
    'allow',
  );
  assert.equal(
    withEnv({CONTEXT: 'production', BRANCH: '0-32-0'}, resolveRobotsMode),
    'disallow',
  );
});

test('non-Netlify CI fails closed; Netlify (which also sets CI) is unaffected', () => {
  assert.equal(withEnv({CI: 'true'}, resolveRobotsMode), 'disallow');
  assert.equal(
    withEnv(
      {CI: 'true', CONTEXT: 'production', HEAD: 'main'},
      resolveRobotsMode,
    ),
    'allow',
  );
});

test('local build with no Netlify env allows (preview convenience)', () => {
  assert.equal(withEnv({}, resolveRobotsMode), 'allow');
});

test('_headers toggle preserves other rules (e.g. asset caching)', () => {
  const headers = fs.readFileSync(
    path.join(__dirname, '..', 'static', '_headers'),
    'utf8',
  );
  assert.match(headers, /X-Robots-Tag:\s*noindex/i);

  const allowed = applyRobotsTag(headers, 'allow');
  assert.match(allowed, /X-Robots-Tag:\s*all/i);
  assert.doesNotMatch(allowed, /X-Robots-Tag:\s*noindex/i);
  assert.match(allowed, /Cache-Control: public, max-age=31536000, immutable/);

  const disallowed = applyRobotsTag(allowed, 'disallow');
  assert.match(disallowed, /X-Robots-Tag:\s*noindex/i);
  assert.match(
    disallowed,
    /Cache-Control: public, max-age=31536000, immutable/,
  );
});

test('only the /* block is toggled, scoped overrides are left alone', () => {
  const headers = [
    '/api/*',
    '  X-Robots-Tag: noindex',
    '',
    '/*',
    '  X-Robots-Tag: noindex',
  ].join('\n');
  const allowed = applyRobotsTag(headers, 'allow');
  assert.match(allowed, /\/\*\n\s*X-Robots-Tag:\s*all/);
  assert.match(allowed, /\/api\/\*\n\s*X-Robots-Tag:\s*noindex/);
});
