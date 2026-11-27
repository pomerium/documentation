// Regression tests for raw-loader inlining in plugins/llms-txt-plugin.js.
// Run: `npm run test:llms`.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {test} = require('node:test');

const {
  inlineRawLoaderCodeBlocks,
  preCleanDocusaurusMDX,
  cleanMarkdownForLLM,
} = require('../plugins/llms-txt-plugin');

async function withTempSite(files, fn) {
  const siteDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'llms-raw-loader-'),
  );
  try {
    for (const [relPath, content] of Object.entries(files)) {
      const fullPath = path.join(siteDir, relPath);
      await fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
      await fs.promises.writeFile(fullPath, content, 'utf8');
    }
    return await fn(siteDir);
  } finally {
    await fs.promises.rm(siteDir, {recursive: true, force: true});
  }
}

test('inlines root, @site, and relative raw-loader imports into fenced code blocks', async () => {
  await withTempSite(
    {
      'content/examples/config.yaml': '# root comment\nautocert: true\n',
      'content/examples/site.conf': 'server {\n  listen 8080;\n}\n',
      'content/docs/guides/local.html': '<script>signOut()</script>\n',
    },
    async (siteDir) => {
      const srcFile = path.join(siteDir, 'content/docs/guides/example.mdx');
      const raw = [
        "import CodeBlock from '@theme/CodeBlock';",
        "import Config from '!!raw-loader!/content/examples/config.yaml';",
        "import SiteConf from '!!raw-loader!@site/content/examples/site.conf';",
        "import LocalHtml from '!!raw-loader!./local.html';",
        '',
        '<CodeBlock language="yaml" title="config.yaml">',
        '  {Config}',
        '</CodeBlock>',
        '',
        '<CodeBlock language="nginx">',
        '  {SiteConf}',
        '</CodeBlock>',
        '',
        '<CodeBlock language="html" title="local.html">{LocalHtml}</CodeBlock>',
      ].join('\n');

      const inlined = await inlineRawLoaderCodeBlocks(raw, srcFile, siteDir);

      assert.match(
        inlined,
        /```yaml title="config\.yaml"\n# root comment\nautocert: true\n```/,
      );
      assert.match(inlined, /```nginx\nserver \{\n  listen 8080;\n\}\n```/);
      assert.match(
        inlined,
        /```html title="local\.html"\n<script>signOut\(\)<\/script>\n```/,
      );
    },
  );
});

test('inlined raw-loader code blocks survive preCleanDocusaurusMDX and cleanMarkdownForLLM', async () => {
  await withTempSite(
    {
      'content/examples/config.yaml':
        '# Keep this comment\nauthenticate_service_url: https://authenticate.example.com\n',
    },
    async (siteDir) => {
      const srcFile = path.join(siteDir, 'content/docs/guides/example.mdx');
      const raw = [
        '---',
        'title: Example',
        '---',
        "import CodeBlock from '@theme/CodeBlock';",
        "import Config from '!!raw-loader!/content/examples/config.yaml';",
        '',
        '# Example',
        '',
        'Create a `config.yaml` file:',
        '',
        '<CodeBlock language="yaml" title="config.yaml">',
        '  {Config}',
        '</CodeBlock>',
      ].join('\n');

      const inlined = await inlineRawLoaderCodeBlocks(raw, srcFile, siteDir);
      const preCleaned = preCleanDocusaurusMDX(inlined);
      const cleaned = await cleanMarkdownForLLM(preCleaned, {
        siteOrigin: 'https://www.pomerium.com',
        routePath: '/docs/guides/example',
      });

      assert.doesNotMatch(cleaned, /import Config/);
      assert.doesNotMatch(cleaned, /<CodeBlock/);
      assert.match(cleaned, /# Keep this comment/);
      assert.match(
        cleaned,
        /authenticate_service_url: https:\/\/authenticate\.example\.com/,
      );
    },
  );
});

test('uses a longer fence when imported content contains triple backticks', async () => {
  await withTempSite(
    {
      'content/examples/snippet.md': 'Before\n```bash\necho hi\n```\nAfter\n',
    },
    async (siteDir) => {
      const srcFile = path.join(siteDir, 'content/docs/guides/example.mdx');
      const raw = [
        "import Snippet from '!!raw-loader!/content/examples/snippet.md';",
        '<CodeBlock language="markdown">{Snippet}</CodeBlock>',
      ].join('\n');

      const inlined = await inlineRawLoaderCodeBlocks(raw, srcFile, siteDir);

      assert.match(
        inlined,
        /````markdown\nBefore\n```bash\necho hi\n```\nAfter\n````/,
      );
    },
  );
});

test('leaves missing files and unrelated CodeBlocks untouched without throwing', async () => {
  await withTempSite({}, async (siteDir) => {
    const srcFile = path.join(siteDir, 'content/docs/guides/example.mdx');
    const raw = [
      "import Missing from '!!raw-loader!/content/examples/does-not-exist.yaml';",
      '<CodeBlock language="yaml">{Missing}</CodeBlock>',
      '<CodeBlock language="yaml">{Unrelated}</CodeBlock>',
    ].join('\n');

    const inlined = await inlineRawLoaderCodeBlocks(raw, srcFile, siteDir);

    assert.equal(inlined, raw);
  });
});

test('inlines real guide raw-loader examples from the repository', async () => {
  const siteDir = path.resolve(__dirname, '..');
  const srcFile = path.join(siteDir, 'content/docs/guides/grafana.mdx');
  const raw = await fs.promises.readFile(srcFile, 'utf8');

  const inlined = await inlineRawLoaderCodeBlocks(raw, srcFile, siteDir);
  const cleaned = await cleanMarkdownForLLM(preCleanDocusaurusMDX(inlined), {
    siteOrigin: 'https://www.pomerium.com',
    routePath: '/docs/guides/grafana',
  });

  assert.doesNotMatch(cleaned, /<CodeBlock/);
  assert.match(cleaned, /pomerium\/pomerium/);
  assert.match(cleaned, /grafana/);
});

test('keeps imports inside raw-loaded code', async () => {
  const source = 'import x from "example";\nx();\n';
  await withTempSite({'example.js': source}, async (siteDir) => {
    const raw = [
      'import Example from "!!raw-loader!@site/example.js";',
      '',
      '<CodeBlock language="js">{Example}</CodeBlock>',
    ].join('\n');
    const inlined = await inlineRawLoaderCodeBlocks(
      raw,
      path.join(siteDir, 'page.mdx'),
      siteDir,
    );
    assert.ok(preCleanDocusaurusMDX(inlined).includes(source.trim()));
  });
});

test('preserves MDX-looking text inside raw-loaded code through the full pipeline', async () => {
  const source = [
    "import {thing} from './thing';",
    '<!-- keep this comment -->',
    ':::note',
    '## Heading {#keep-anchor}',
    ':::',
    '<Tabs><TabItem label="x">y</TabItem></Tabs>',
    '',
    '',
    '',
    'after blank lines',
  ].join('\n');
  await withTempSite({'example.mdx': `${source}\n`}, async (siteDir) => {
    const raw = [
      "import CodeBlock from '@theme/CodeBlock';",
      "import Example from '!!raw-loader!@site/example.mdx';",
      '',
      '# Page {#page-anchor}',
      '',
      '<!-- strip this page comment -->',
      '',
      ':::note',
      'Admonition body',
      ':::',
      '',
      '<CodeBlock language="mdx">{Example}</CodeBlock>',
    ].join('\n');
    const inlined = await inlineRawLoaderCodeBlocks(
      raw,
      path.join(siteDir, 'page.mdx'),
      siteDir,
    );
    const preCleaned = preCleanDocusaurusMDX(inlined);

    // Imported code is untouched.
    assert.ok(preCleaned.includes(`\`\`\`mdx\n${source}\n\`\`\``));
    // Page prose around it is still cleaned.
    assert.doesNotMatch(preCleaned, /import CodeBlock/);
    assert.doesNotMatch(preCleaned, /page-anchor/);
    assert.doesNotMatch(preCleaned, /strip this page comment/);
    assert.match(preCleaned, /Admonition body/);
    assert.doesNotMatch(preCleaned, /^:::note\nAdmonition/m);

    const cleaned = await cleanMarkdownForLLM(preCleaned, {
      siteOrigin: 'https://www.pomerium.com',
      routePath: '/docs/page',
    });
    assert.ok(cleaned.includes(source));
  });
});

test('protects hand-written fences, including tilde and indented fences', () => {
  const raw = [
    'Intro',
    '',
    '  ```js',
    "  import a from 'a';",
    '  ```',
    '',
    '~~~html',
    '<!-- keep -->',
    '~~~',
    '',
    "import Gone from 'gone';",
  ].join('\n');
  const out = preCleanDocusaurusMDX(raw);
  assert.ok(out.includes("  ```js\n  import a from 'a';\n  ```"));
  assert.ok(out.includes('~~~html\n<!-- keep -->\n~~~'));
  assert.doesNotMatch(out, /Gone/);
});
