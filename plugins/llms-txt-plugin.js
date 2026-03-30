const fs = require('fs');
const path = require('path');
const {remark} = require('remark');
const remarkParse = require('remark-parse').default;
const remarkStringify = require('remark-stringify').default;
const remarkMdx = require('remark-mdx').default;
const {visit, SKIP} = require('unist-util-visit');

/**
 * Pre-clean Docusaurus MDX files before remark parsing.
 * - Removes all :::admonition blocks (keeps the content inside)
 * - Removes <Tabs>...</Tabs> and <TabItem ...>...</TabItem> blocks (keeps content inside)
 * - Strips any remaining standalone ::: lines
 */
function preCleanDocusaurusMDX(raw) {
  // Remove YAML frontmatter at the very top (--- ... ---)
  raw = raw.replace(/^---[\s\S]*?---\s*(\n|$)/, '');

  // Remove all Docusaurus import lines
  raw = raw.replace(/^\s*import\s.*from\s+['"][^'"]+['"];?\s*$/gm, '');

  // Convert <TabItem> opening tags to bold labels, then strip remaining tags
  raw = raw.replace(
    /<TabItem[^>]*\blabel=["']([^"']+)["'][^>]*>/g,
    '\n**$1:**\n',
  );
  raw = raw.replace(/<\/?Tabs[^>]*>/g, '');
  raw = raw.replace(/<\/?TabItem[^>]*>/g, '');

  // Unwrap admonition blocks but keep their body text (handles indented blocks too)
  raw = raw.replace(
    /^[ \t]*:::(info|note|caution|tip|danger|important|success|failure|admonition|enterprise|warning)[^\n]*\n([\s\S]*?)^[ \t]*:::\s*$/gm,
    '$2',
  );

  // Remove any "orphan" closing ::: or unclosed opening :::type lines (indented or not)
  raw = raw.replace(/^[ \t]*:{3,}\s*$/gm, '');
  raw = raw.replace(/^[ \t]*:{3,}\s*:::\w[^\n]*$/gm, '');
  raw = raw.replace(/^[ \t]*:::\w[^\n]*$/gm, '');

  // Strip Docusaurus heading anchor IDs (e.g., {#host-rewrite}, {#config.databroker.build})
  raw = raw.replace(/ \{#[^}]+}/g, '');

  // Collapse 3+ blank lines to one; preserve single blank lines for paragraph breaks
  raw = raw.replace(/(\s*\n){3,}/g, '\n\n');

  return raw;
}

/**
 * Clean Markdown/MDX for LLM ingestion using remark AST
 * - Strips YAML frontmatter
 * - Strips import/export statements (MDX)
 * - Strips MDX JSX elements and self-closing components
 * - Removes images (optional: swap with alt text)
 * - Leaves code blocks and inline code untouched
 */
async function cleanMarkdownForLLM(rawContent) {
  const processor = remark()
    .use(remarkParse)
    .use(remarkMdx)
    .use(() => (tree) => {
      // Remove YAML frontmatter
      tree.children = tree.children.filter(
        (node) =>
          node.type !== 'yaml' && // Remove frontmatter
          node.type !== 'mdxjsEsm' && // Remove import/export
          node.type !== 'mdxJsxFlowElement' &&
          node.type !== 'mdxJsxTextElement',
      );
      // Replace images with alt text or remove if no alt
      visit(tree, (node, index, parent) => {
        if (node.type === 'image' && parent && typeof index === 'number') {
          if (node.alt) {
            parent.children.splice(index, 1, {
              type: 'text',
              value: `[${node.alt}]`,
            });
          } else {
            parent.children.splice(index, 1);
          }
          return [SKIP, index];
        }
      });
    })
    .use(remarkStringify, {
      fences: true,
      bullet: '-',
      rule: '-',
      listItemIndent: 'one',
      // Important! Do not stringify YAML nodes (just in case)
      // This setting may not exist, but keeping for emphasis.
    });

  const result = await processor.process(rawContent);

  let cleaned = result.value;
  // Collapse excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // Strip escaped Docusaurus heading anchor IDs (e.g., \{#host-rewrite}, \{#config.databroker.build})
  cleaned = cleaned.replace(/ \\{#[^}]+}/g, '');

  return cleaned;
}

/**
 * Filter routes to only include documentation routes
 */
function filterDocumentationRoutes(routes) {
  return routes.filter((route) => {
    return (
      route.path.startsWith('/docs/') &&
      route.path !== '/docs/' &&
      !route.path.includes('/api/') &&
      !route.path.includes('/_') &&
      route.component !== '@theme/NotFound/Content'
    );
  });
}

/**
 * Scan the content directory for documentation files
 */
async function scanDocumentationFiles(contentDir) {
  const files = [];

  async function scanDirectory(dir, basePath = '') {
    try {
      const entries = await fs.promises.readdir(dir, {withFileTypes: true});

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          // Skip certain directories
          if (
            entry.name.startsWith('.') ||
            entry.name === 'img' ||
            entry.name === 'assets'
          ) {
            continue;
          }
          await scanDirectory(fullPath, relativePath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) &&
          !entry.name.startsWith('_')
        ) {
          // Create a route-like object from the file
          const urlPath =
            '/docs/' +
            relativePath.replace(/\.(mdx?|md)$/, '').replace(/\\/g, '/');

          // Read file to get frontmatter metadata
          const metadata = await extractMetadata(fullPath);

          files.push({
            path: urlPath,
            filePath: fullPath,
            metadata: metadata,
          });
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dir}:`, error.message);
    }
  }

  await scanDirectory(contentDir);
  return files;
}

/**
 * Extract metadata from MDX/MD files
 */
async function extractMetadata(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const metadata = {};

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];

      // Simple YAML parsing for title and description
      const titleMatch = frontmatter.match(/^title:\s*['"]?(.*?)['"]?$/m);
      if (titleMatch) {
        metadata.title = titleMatch[1];
      }

      const descBlockMatch = frontmatter.match(
        /^description:\s*[|>][-+0-9]*\s*\n((?:[ \t]+.*(?:\n|$))*)/m,
      );
      if (descBlockMatch) {
        metadata.description = descBlockMatch[1]
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .join(' ');
      } else {
        const descMatch = frontmatter.match(
          /^description:\s*['"]?(.*?)['"]?$/m,
        );
        if (descMatch) {
          metadata.description = descMatch[1];
        }
      }
    }

    // If no title in frontmatter, try to extract from first H1
    if (!metadata.title) {
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        metadata.title = h1Match[1];
      }
    }

    return metadata;
  } catch (error) {
    console.warn(
      `Warning: Could not extract metadata from ${filePath}:`,
      error.message,
    );
    return {};
  }
}

/**
 * Group routes by documentation category based on URL path
 */
function groupRoutesByCategory(routes) {
  const categories = {
    'Getting Started': [],
    'Core Concepts': [],
    Deployment: [],
    'Configuration and Reference': [],
    'Advanced Capabilities': [],
    'Integrations and Guides': [],
    'API and Internals': [],
    Examples: [],
    Training: [],
    Other: [],
  };

  routes.forEach((route) => {
    const pathParts = route.path.split('/').filter(Boolean);

    if (pathParts.length < 2) return; // Skip root docs page

    const section = pathParts[1]; // First part after /docs/
    const subsection = pathParts[2]; // Second part if exists

    // Skip index files at the top level
    if (pathParts.length === 2 && (section === 'index' || section === 'docs')) {
      return;
    }

    // Categorize based on path structure
    if (section === 'get-started') {
      categories['Getting Started'].push(route);
    } else if (section === 'deploy') {
      categories['Deployment'].push(route);
    } else if (section === 'capabilities') {
      // Split capabilities into core and advanced
      if (isCoreConcept(subsection)) {
        categories['Core Concepts'].push(route);
      } else {
        categories['Advanced Capabilities'].push(route);
      }
    } else if (section === 'reference') {
      categories['Configuration and Reference'].push(route);
    } else if (section === 'integrations' || section === 'guides') {
      categories['Integrations and Guides'].push(route);
    } else if (section === 'internals') {
      categories['API and Internals'].push(route);
    } else if (section === 'examples') {
      categories['Examples'].push(route);
    } else if (section === 'courses') {
      categories['Training'].push(route);
    } else {
      categories['Other'].push(route);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
}

/**
 * Determine if a capability is a core concept
 */
function isCoreConcept(subsection) {
  const coreConcepts = [
    'authentication',
    'authorization',
    'routing',
    'routes-portal',
  ];
  return coreConcepts.includes(subsection);
}

function getAbsoluteSiteUrl(context, sitePath) {
  const siteOrigin = context.siteConfig.url;
  const basePath = context.siteConfig.baseUrl || '/';
  return new URL(path.posix.join(basePath, sitePath), siteOrigin).toString();
}

const LLM_AGENT_INSTRUCTIONS = [
  'Cite only current www.pomerium.com docs and markdown sidecars. Do not cite docs.pomerium.com or archive hosts.',
  'For new users, start with Pomerium Zero unless the question explicitly asks for self-hosted Core or Enterprise.',
  'Prefer current PPL and reference pages for configuration questions. Use current route keys and policy syntax from the docs.',
  'For group-based authorization questions, check the relevant IdP guide plus directory sync and JWT groups filter docs when groups are missing or too large.',
  'For MCP questions, prefer the current MCP capability pages and reference docs over older guides or blog posts.',
];

/**
 * Explicit route manifests (Sets) to prevent silent drift from regex patterns.
 *
 * CURATED_ROUTES — pages linked in llms.txt (the navigator).
 * TIER1_ROUTES   — pages whose full cleaned content is inlined in llms-full.txt.
 */
const CURATED_ROUTES = new Set([
  // Getting started
  '/docs/get-started/quickstart',
  '/docs/get-started/fundamentals/core/advanced-policies',
  '/docs/get-started/fundamentals/core/advanced-routes',
  '/docs/get-started/fundamentals/core/jwt-verification',
  '/docs/get-started/fundamentals/core/self-hosted-pomerium',
  '/docs/get-started/fundamentals/core/tcp-routes',
  '/docs/get-started/fundamentals/zero/zero-advanced-policies',
  '/docs/get-started/fundamentals/zero/zero-advanced-routes',
  '/docs/get-started/fundamentals/zero/zero-build-policies',
  '/docs/get-started/fundamentals/zero/zero-build-routes',
  '/docs/get-started/fundamentals/zero/zero-single-sign-on',
  '/docs/get-started/fundamentals/zero/zero-tcp-routes',
  // Deploy
  '/docs/deploy/core',
  '/docs/deploy/enterprise/quickstart',
  '/docs/deploy/enterprise/install',
  '/docs/deploy/k8s/quickstart',
  '/docs/deploy/k8s/ingress',
  '/docs/deploy/clients/clients',
  // Capabilities
  '/docs/capabilities/authentication',
  '/docs/capabilities/authorization',
  '/docs/capabilities/routing',
  '/docs/capabilities/native-ssh-access',
  '/docs/capabilities/kubernetes-access',
  '/docs/capabilities/service-accounts',
  '/docs/capabilities/non-http',
  '/docs/capabilities/getting-users-identity',
  // MCP
  '/docs/capabilities/mcp',
  '/docs/capabilities/mcp/protect-mcp-server',
  '/docs/capabilities/mcp/limit-mcp-tools',
  '/docs/capabilities/mcp/delegate-mcp-to-llm',
  '/docs/capabilities/mcp/mcp-upstream-oauth',
  '/docs/capabilities/mcp/reference',
  // Internals
  '/docs/internals/ppl',
  '/docs/internals/configuration',
  '/docs/internals/troubleshooting',
  // Reference (GSC high-traffic)
  '/docs/reference/metrics',
  // Integrations
  '/docs/integrations/user-standing/directory-sync',
  '/docs/integrations/user-identity/google',
  '/docs/integrations/user-identity/okta',
  '/docs/integrations/user-identity/auth0',
  '/docs/integrations/user-identity/azure',
  '/docs/integrations/user-identity/keycloak',
  // Reference
  '/docs/reference/jwt-groups-filter',
  '/docs/reference/google-cloud-serverless-authentication-service-account',
  '/docs/reference/identity-provider-settings',
  '/docs/reference/authorize-log-fields',
  '/docs/reference/routes/enable-google-cloud-serverless-authentication',
  '/docs/reference/routes/jwt-groups-filter',
  '/docs/reference/routes/public-access',
  '/docs/reference/routes/allow-any-authenticated-user',
  // Guides
  '/docs/guides/jenkins',
  '/docs/guides/grafana',
  '/docs/guides/code-server',
  '/docs/guides/local-mcp',
  '/docs/guides/zero-ssh',
  '/docs/guides/llm',
]);

const TIER1_ROUTES = new Set([
  // Getting started
  '/docs/index',
  '/docs/get-started/quickstart',
  // Core capabilities
  '/docs/capabilities/authentication',
  '/docs/capabilities/authorization',
  '/docs/capabilities/routing',
  '/docs/capabilities/kubernetes-access',
  '/docs/capabilities/native-ssh-access',
  '/docs/capabilities/non-http',
  '/docs/capabilities/service-accounts',
  // MCP (all current pages)
  '/docs/capabilities/mcp',
  '/docs/capabilities/mcp/protect-mcp-server',
  '/docs/capabilities/mcp/limit-mcp-tools',
  '/docs/capabilities/mcp/delegate-mcp-to-llm',
  '/docs/capabilities/mcp/mcp-upstream-oauth',
  '/docs/capabilities/mcp/reference',
  '/docs/capabilities/mcp/develop-mcp-app',
  '/docs/capabilities/mcp/tunnel-to-chatgpt',
  // Internals
  '/docs/internals/ppl',
  '/docs/internals/architecture',
  '/docs/internals/glossary',
  '/docs/internals/connection',
  '/docs/internals/configuration',
  '/docs/internals/troubleshooting',
  '/docs/internals/programmatic-access',
  // Capabilities (GSC high-traffic)
  '/docs/capabilities/getting-users-identity',
  // Deployment
  '/docs/deploy/core',
  // Reference — expanded bundle (common reverse proxy settings)
  '/docs/reference/routes/readme',
  '/docs/reference/routes/from',
  '/docs/reference/routes/to',
  '/docs/reference/routes/policy',
  '/docs/reference/routes/headers',
  '/docs/reference/routes/path-rewriting',
  '/docs/reference/routes/timeouts',
  '/docs/reference/routes/tls',
  '/docs/reference/routes/load-balancing',
  '/docs/reference/routes/load-balancing-policy-config',
  '/docs/reference/routes/public-access',
  '/docs/reference/routes/allow-any-authenticated-user',
  '/docs/reference/routes/pass-identity-headers',
  '/docs/reference/identity-provider-settings',
  '/docs/reference/service-urls',
  '/docs/reference/pass-identity-headers',
  '/docs/reference/jwt-claim-headers',
  '/docs/reference/jwt-groups-filter',
  '/docs/reference/routes/jwt-groups-filter',
  '/docs/reference/global-timeouts',
]);

/**
 * Ordered demotion list: if llms-full.txt exceeds the size budget, demote
 * these Tier 1 routes to link-only entries in this order.
 */
const TIER1_DEMOTION_ORDER = [
  '/docs/reference/routes/load-balancing-policy-config',
  '/docs/reference/routes/load-balancing',
  '/docs/reference/global-timeouts',
  '/docs/reference/routes/timeouts',
  '/docs/reference/routes/tls',
  '/docs/reference/routes/public-access',
  '/docs/reference/routes/allow-any-authenticated-user',
];

/** Hard size limit for llms-full.txt in characters (~100K tokens). */
const LLMS_FULL_SIZE_LIMIT = 400_000;

// Validate demotion list at module load
for (const p of TIER1_DEMOTION_ORDER) {
  if (!TIER1_ROUTES.has(p)) {
    throw new Error(`TIER1_DEMOTION_ORDER entry "${p}" is not in TIER1_ROUTES`);
  }
}

function isCuratedRoute(routePath) {
  return CURATED_ROUTES.has(routePath);
}

function isTier1Route(routePath) {
  return TIER1_ROUTES.has(routePath);
}

function filterCuratedRoutes(routes) {
  return routes.filter((route) => isCuratedRoute(route.path));
}

function normalizeRouteMarkdownPath(routePath) {
  if (typeof routePath !== 'string') return '';

  const normalizedRoutePath = routePath
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  if (!normalizedRoutePath) return '';

  const pathParts = normalizedRoutePath.split('/').filter(Boolean);
  if (path.isAbsolute(normalizedRoutePath) || pathParts.includes('..'))
    return '';

  return normalizedRoutePath;
}

function buildMarkdownUrl(route, context) {
  const routePath = normalizeRouteMarkdownPath(route.path);
  if (!routePath) return '';

  // Avoid double-index for routes that already end in /index (e.g., /docs/index)
  if (routePath.endsWith('/index')) {
    return getAbsoluteSiteUrl(context, `${routePath}.md`);
  }
  return getAbsoluteSiteUrl(context, `${routePath}/index.md`);
}

function buildRouteMarkdownOutputPath(routePath) {
  const normalizedRoutePath = normalizeRouteMarkdownPath(routePath);
  return normalizedRoutePath ? `${normalizedRoutePath}/index.md` : '';
}

function resolveRouteMarkdownOutputFile(outDir, routePath) {
  const outputPath = buildRouteMarkdownOutputPath(routePath);
  if (!outputPath) return '';

  const resolvedOutputPath = path.resolve(outDir, outputPath);
  const relativeOutputPath = path.relative(outDir, resolvedOutputPath);

  if (
    !relativeOutputPath ||
    relativeOutputPath.startsWith('..') ||
    path.isAbsolute(relativeOutputPath)
  ) {
    return '';
  }

  return resolvedOutputPath;
}

function shouldSkipMarkdownCopy(srcFile) {
  const skipPatterns = [
    '_template.mdx',
    /^_/, // files/folders starting with "_",
  ];

  return skipPatterns.some((pat) =>
    typeof pat === 'string'
      ? srcFile.includes(pat)
      : pat.test(path.basename(srcFile)),
  );
}

function validateRouteMarkdownCollisions(routes) {
  const routeOutputs = new Map();

  for (const route of routes) {
    if (!route.filePath || shouldSkipMarkdownCopy(route.filePath)) continue;

    const outputPath = buildRouteMarkdownOutputPath(route.path);
    if (!outputPath) continue;

    if (routeOutputs.has(outputPath)) {
      throw new Error(
        `Duplicate route markdown output path "${outputPath}" for "${route.path}" and "${routeOutputs.get(outputPath)}"`,
      );
    }

    routeOutputs.set(outputPath, route.path);
  }
}

/**
 * Build a single link-list entry for a route.
 */
function formatRouteLinkEntry(route, context) {
  const routeTitle = getRouteTitle(route);
  const description = getRouteDescription(route);
  const mdUrl = buildMarkdownUrl(route, context);

  if (description && mdUrl) {
    return `- [${routeTitle}](${mdUrl}): ${description}`;
  } else if (mdUrl) {
    return `- [${routeTitle}](${mdUrl})`;
  } else if (description) {
    return `- ${routeTitle}: ${description}`;
  }
  return `- ${routeTitle}`;
}

/**
 * Generate link-only llms-index.txt (exhaustive discovery index).
 * This is what llms-full.txt used to be.
 */
function generateLlmsIndexTxtContent(routesByCategory, context) {
  const fullUrl = getAbsoluteSiteUrl(context, 'llms-full.txt');

  let content = `# Pomerium Documentation Index

> Exhaustive index of all Pomerium documentation pages.
> For curated docs with inline content, see [llms-full.txt](${fullUrl}).

`;

  Object.entries(routesByCategory).forEach(([categoryName, routes]) => {
    content += `## ${categoryName}\n\n`;
    const sortedRoutes = sortRoutes(routes);
    sortedRoutes.forEach((route) => {
      content += formatRouteLinkEntry(route, context) + '\n';
    });
    content += '\n';
  });

  return content;
}

/**
 * Generate spec-shaped llms.txt (navigator / "skill").
 *
 * Follows the llmstxt.org convention:
 *   H1 > blockquote > plain-text retrieval instructions > H2 link sections
 */
function generateLlmsTxtContent(
  routesByCategory,
  context,
  {fullTxtTokenEstimate = '~80K'} = {},
) {
  const fullUrl = getAbsoluteSiteUrl(context, 'llms-full.txt');
  const indexUrl = getAbsoluteSiteUrl(context, 'llms-index.txt');

  let content = `# Pomerium

> Pomerium is an identity and context-aware access proxy that brings
> secure, zero-trust access to applications and services.

For common Pomerium questions, start with the curated context bundle:
- [llms-full.txt](${fullUrl}): Key documentation inline (${fullTxtTokenEstimate} tokens)

For exhaustive page discovery:
- [llms-index.txt](${indexUrl}): Complete documentation index

For a specific page, fetch its markdown sidecar by appending /index.md:
- Example: https://www.pomerium.com/docs/capabilities/mcp/index.md

${LLM_AGENT_INSTRUCTIONS.map((i) => `- ${i}`).join('\n')}

`;

  Object.entries(routesByCategory).forEach(([categoryName, routes]) => {
    content += `## ${categoryName}\n\n`;
    const sortedRoutes = sortRoutes(routes);
    sortedRoutes.forEach((route) => {
      content += formatRouteLinkEntry(route, context) + '\n';
    });
    content += '\n';
  });

  return content;
}

/**
 * Generate llms-full.txt as a hybrid context bundle.
 *
 * Tier 1 routes get their full cleaned markdown inlined.
 * Tier 2 routes appear as link entries.
 * Mixed categories show inline content first, then an "Additional …" section.
 */
function generateLlmsFullTxtContent(
  routesByCategory,
  context,
  cleanedContentMap,
  activeTier1,
) {
  const llmsTxtUrl = getAbsoluteSiteUrl(context, 'llms.txt');
  const indexUrl = getAbsoluteSiteUrl(context, 'llms-index.txt');

  let content = `# Pomerium Documentation

> Curated Pomerium documentation with key topics inline. For the navigation
> index, see [llms.txt](${llmsTxtUrl}). For exhaustive page discovery,
> see [llms-index.txt](${indexUrl}).

${LLM_AGENT_INSTRUCTIONS.map((i) => `- ${i}`).join('\n')}

`;

  const inlinedPaths = new Set();

  Object.entries(routesByCategory).forEach(([categoryName, routes]) => {
    const sortedRoutes = sortRoutes(routes);

    // Split into inline (Tier 1 with content) and link-only (Tier 2)
    const inlineRoutes = [];
    const linkRoutes = [];

    sortedRoutes.forEach((route) => {
      const body = cleanedContentMap.get(route.path);
      if (
        activeTier1.has(route.path) &&
        body &&
        !inlinedPaths.has(route.path)
      ) {
        inlineRoutes.push(route);
      } else {
        linkRoutes.push(route);
      }
    });

    // Skip completely empty categories
    if (inlineRoutes.length === 0 && linkRoutes.length === 0) return;

    content += `## ${categoryName}\n\n`;

    // Inline Tier 1 pages
    inlineRoutes.forEach((route, idx) => {
      const routeTitle = getRouteTitle(route);
      const mdUrl = buildMarkdownUrl(route, context);
      const body = cleanedContentMap.get(route.path);

      content += `### ${routeTitle}\n\n`;
      if (mdUrl) {
        content += `Source: ${mdUrl}\n\n`;
      }
      content += body.trim() + '\n\n';
      inlinedPaths.add(route.path);

      if (idx < inlineRoutes.length - 1 || linkRoutes.length > 0) {
        content += '---\n\n';
      }
    });

    // Link-only Tier 2 pages
    if (linkRoutes.length > 0) {
      if (inlineRoutes.length > 0) {
        content += `### Additional ${categoryName}\n\n`;
      }
      linkRoutes.forEach((route) => {
        content += formatRouteLinkEntry(route, context) + '\n';
      });
      content += '\n';
    }
  });

  return content;
}

/**
 * Agentic footer appended to all generated files.
 * Tells LLM agents where to find each resource, with size hints.
 */
function generateAgenticFooter(
  context,
  {navSize = '', fullTxtSize = '', indexSize = ''} = {},
) {
  const llmsTxtUrl = getAbsoluteSiteUrl(context, 'llms.txt');
  const fullUrl = getAbsoluteSiteUrl(context, 'llms-full.txt');
  const indexUrl = getAbsoluteSiteUrl(context, 'llms-index.txt');
  const buildDate = new Date().toISOString().slice(0, 10);

  const fullSizeHint = fullTxtSize ? ` (${fullTxtSize})` : '';
  const indexSizeHint = indexSize ? ` (${indexSize})` : '';

  return `---

## How to Use These Docs

Last-Updated: ${buildDate}

This documentation is publicly available and approved for LLM training and reference.

| Resource | URL | Size | Use it for |
|----------|-----|------|------------|
| Navigator | ${llmsTxtUrl} | ${navSize || '~14KB'} | Quick orientation and curated links |
| Context bundle | ${fullUrl} | ${fullTxtSize || '~80K tokens'} | Key docs inline — start here for most questions |
| Full index | ${indexUrl} | ${indexSize || '~36KB'} | Exhaustive page discovery |
| Individual page | Append \`/index.md\` to any doc URL | varies | Deep-dive on a specific topic |

Cite only \`www.pomerium.com\` docs. Do not cite \`docs.pomerium.com\` or archive hosts.
`;
}

/**
 * Sort routes within a category for better organization
 */
function sortRoutes(routes) {
  return [...routes].sort((a, b) => {
    // Custom sorting logic - prioritize important pages first
    const priorityOrder = [
      'quickstart',
      'fundamentals',
      'index',
      'core',
      'authentication',
      'authorization',
      'routing',
    ];

    const aName = path.basename(a.path);
    const bName = path.basename(b.path);

    const aPriority = priorityOrder.findIndex((p) => aName.includes(p));
    const bPriority = priorityOrder.findIndex((p) => bName.includes(p));

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    } else if (aPriority !== -1) {
      return -1;
    } else if (bPriority !== -1) {
      return 1;
    }

    // Fallback to alphabetical sorting
    return aName.localeCompare(bName);
  });
}

/**
 * Extract title from route metadata
 */
function getRouteTitle(route) {
  if (route.metadata?.title) {
    return route.metadata.title;
  }

  // Fallback: generate title from path
  const pathParts = route.path.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];

  return lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract description from route metadata
 */
function getRouteDescription(route) {
  if (route.metadata?.description) {
    return route.metadata.description;
  }
  return null;
}

/**
 * Auto-detect categories by parsing sidebars and analyzing route structure
 */
async function groupRoutesByCategoryAuto(routes, context) {
  try {
    // Try to load and parse sidebars configuration
    const sidebarsConfig = await loadSidebarsConfig(context.siteDir);
    const categoryMapping = extractCategoryMappingFromSidebars(sidebarsConfig);

    // Initialize categories with auto-detected ones from sidebars
    const categories = {};

    // Categorize routes using sidebar mapping + intelligent fallbacks
    routes.forEach((route) => {
      const category = determineCategoryForRoute(route, categoryMapping);

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(route);
    });

    // Sort categories in logical order
    return sortCategories(categories);
  } catch (error) {
    console.warn(
      '⚠️  Could not auto-detect categories from sidebars, falling back to manual categorization',
    );
    return groupRoutesByCategory(routes);
  }
}

/**
 * Load and parse sidebars configuration
 */
async function loadSidebarsConfig(siteDir) {
  try {
    const sidebarsPath = path.join(siteDir, 'sidebars.js');
    delete require.cache[require.resolve(sidebarsPath)];
    return require(sidebarsPath);
  } catch (error) {
    throw new Error(`Could not load sidebars.js: ${error.message}`);
  }
}

/**
 * Extract category mapping from sidebars configuration
 */
function extractCategoryMappingFromSidebars(sidebars) {
  const mapping = {};

  // Process each sidebar
  Object.entries(sidebars).forEach(([sidebarName, sidebarItems]) => {
    processSidebarItems(sidebarItems, mapping, null);
  });

  return mapping;
}

/**
 * Recursively process sidebar items to build category mapping
 */
function processSidebarItems(items, mapping, parentCategory) {
  items.forEach((item) => {
    if (typeof item === 'string') {
      // Direct doc reference
      const docPath = `/docs/${item.replace(/^docs\//, '')}`;
      if (parentCategory) {
        mapping[docPath] = parentCategory;
      }
    } else if (item.type === 'category') {
      // Category with nested items
      const categoryName = item.label;

      if (item.items) {
        processSidebarItems(item.items, mapping, categoryName);
      }

      // Also map the category link if it exists
      if (item.link?.id) {
        const linkPath = `/docs/${item.link.id.replace(/^docs\//, '')}`;
        mapping[linkPath] = categoryName;
      }
    } else if (item.type === 'doc') {
      // Direct doc with custom label
      const docPath = `/docs/${item.id.replace(/^docs\//, '')}`;
      if (parentCategory) {
        mapping[docPath] = parentCategory;
      }
    }
  });
}

/**
 * Determine the best category for a route
 */
function determineCategoryForRoute(route, categoryMapping) {
  // First check exact match in sidebar mapping
  if (categoryMapping[route.path]) {
    return normalizeCategory(categoryMapping[route.path]);
  }

  // Check for partial matches (for nested routes)
  const pathParts = route.path.split('/').filter(Boolean);
  for (let i = pathParts.length; i >= 2; i--) {
    const partialPath = '/' + pathParts.slice(0, i).join('/');
    if (categoryMapping[partialPath]) {
      return normalizeCategory(categoryMapping[partialPath]);
    }
  }

  // Fallback to path-based categorization
  return getCategoryFromPath(route.path);
}

/**
 * Normalize category names to match our preferred structure
 */
function normalizeCategory(categoryName) {
  const normalizationMap = {
    'Get Started': 'Getting Started',
    Deploy: 'Deployment',
    Capabilities: 'Advanced Capabilities',
    Internals: 'API and Internals',
    Integrations: 'Integrations and Guides',
    Reference: 'Configuration and Reference',
    Guides: 'Integrations and Guides',
  };

  return normalizationMap[categoryName] || categoryName;
}

/**
 * Get category from path structure (fallback method)
 */
function getCategoryFromPath(routePath) {
  const pathParts = routePath.split('/').filter(Boolean);

  if (pathParts.length < 2) return 'Other';

  const section = pathParts[1];
  const subsection = pathParts[2];

  const pathMapping = {
    'get-started': 'Getting Started',
    deploy: 'Deployment',
    capabilities: isCoreConcept(subsection)
      ? 'Core Concepts'
      : 'Advanced Capabilities',
    reference: 'Configuration and Reference',
    integrations: 'Integrations and Guides',
    guides: 'Integrations and Guides',
    internals: 'API and Internals',
    examples: 'Examples',
    courses: 'Training',
  };

  return pathMapping[section] || 'Other';
}

/**
 * Sort categories in logical order
 */
function sortCategories(categories) {
  const preferredOrder = [
    'Getting Started',
    'Core Concepts',
    'Deployment',
    'Configuration and Reference',
    'Advanced Capabilities',
    'Integrations and Guides',
    'API and Internals',
    'Examples',
    'Training',
    'Other',
  ];

  const sorted = {};

  // Add categories in preferred order
  preferredOrder.forEach((category) => {
    if (categories[category] && categories[category].length > 0) {
      sorted[category] = categories[category];
    }
  });

  // Add any remaining categories not in the preferred order
  Object.keys(categories).forEach((category) => {
    if (!sorted[category] && categories[category].length > 0) {
      sorted[category] = categories[category];
    }
  });

  return sorted;
}

/**
 * Main plugin
 */
async function pluginLlmsTxt(context, options) {
  return {
    name: 'llms-txt-plugin',

    async postBuild({outDir, routes, ...buildContext}) {
      try {
        // ── 1. Discover routes ──────────────────────────────────────
        const docRoutes = filterDocumentationRoutes(routes);

        let finalRoutes = docRoutes;
        if (docRoutes.length < 10) {
          console.log(
            '⚠️  Routes seem incomplete, falling back to file scanning...',
          );
          const contentDir = path.join(context.siteDir, 'content', 'docs');
          finalRoutes = await scanDocumentationFiles(contentDir);
        }

        validateRouteMarkdownCollisions(finalRoutes);

        // ── 2. Clean + copy markdown sidecars, collect Tier 1 content ─
        const docsRoot = path.join(context.siteDir, 'content', 'docs');
        const cleanedContentMap = new Map();
        let copied = 0,
          errors = 0;

        for (const route of finalRoutes) {
          const srcFile = route.filePath;
          if (!srcFile) continue;
          if (shouldSkipMarkdownCopy(srcFile)) continue;

          // Destination paths
          let destRel = path.relative(docsRoot, srcFile).replace(/\\/g, '/');
          destRel = destRel.replace(/\.(mdx|md)$/, '.md');
          if (destRel.startsWith('..')) {
            destRel = path.basename(srcFile).replace(/\.(mdx|md)$/, '.md');
          }
          const contentDestFile = path.join(outDir, 'content', 'docs', destRel);
          const routeDestFile = resolveRouteMarkdownOutputFile(
            outDir,
            route.path,
          );

          await fs.promises.mkdir(path.dirname(contentDestFile), {
            recursive: true,
          });

          try {
            const rawContent = await fs.promises.readFile(srcFile, 'utf8');
            const preCleanedContent = preCleanDocusaurusMDX(rawContent);
            let cleanedContent;
            try {
              cleanedContent = await cleanMarkdownForLLM(preCleanedContent);
            } catch (err) {
              console.warn(
                `Warning: Could not fully process ${srcFile}, writing pre-cleaned version instead:`,
                err.message,
              );
              // Apply post-processing that cleanMarkdownForLLM would have done
              cleanedContent = preCleanedContent
                .replace(/\n{3,}/g, '\n\n')
                .replace(/ \\{#[^}]+}/g, '');
              errors++;
            }

            // Write sidecar copies
            await fs.promises.writeFile(
              contentDestFile,
              cleanedContent,
              'utf8',
            );
            if (routeDestFile) {
              await fs.promises.mkdir(path.dirname(routeDestFile), {
                recursive: true,
              });
              await fs.promises.writeFile(
                routeDestFile,
                cleanedContent,
                'utf8',
              );
            } else {
              console.warn(
                `Warning: Could not resolve route markdown path for ${route.path}, skipping route-mirrored copy.`,
              );
            }

            // Collect cleaned content for Tier 1 routes
            if (isTier1Route(route.path) && cleanedContent.trim().length > 0) {
              cleanedContentMap.set(route.path, cleanedContent);
            }

            copied++;
          } catch (err) {
            console.warn(
              `Warning: Could not read or write ${srcFile}:`,
              err.message,
            );
            errors++;
          }
        }

        // ── 3. Categorize routes ────────────────────────────────────
        const routesByCategory = await groupRoutesByCategoryAuto(
          finalRoutes,
          context,
        );
        const curatedRoutes = filterCuratedRoutes(finalRoutes);
        if (curatedRoutes.length === 0) {
          console.warn(
            '⚠️  No curated llms.txt routes matched the current route set.',
          );
        }

        // Warn about stale manifest entries that no longer match any route
        const knownPaths = new Set(finalRoutes.map((r) => r.path));
        for (const manifest of [
          {name: 'CURATED_ROUTES', set: CURATED_ROUTES},
          {name: 'TIER1_ROUTES', set: TIER1_ROUTES},
        ]) {
          for (const p of manifest.set) {
            if (!knownPaths.has(p)) {
              console.warn(`⚠️  ${manifest.name} contains stale entry: ${p}`);
            }
          }
        }

        const curatedRoutesByCategory = await groupRoutesByCategoryAuto(
          curatedRoutes,
          context,
        );

        // ── 4. Generate llms-full.txt (hybrid context bundle) ───────
        // Start with the full Tier 1 set; demote if over budget.
        let activeTier1 = new Set(TIER1_ROUTES);

        let llmsFullTxtContent = generateLlmsFullTxtContent(
          routesByCategory,
          context,
          cleanedContentMap,
          activeTier1,
        );

        // Size guard: demote routes until under budget
        let demotions = 0;
        for (const demotePath of TIER1_DEMOTION_ORDER) {
          if (llmsFullTxtContent.length <= LLMS_FULL_SIZE_LIMIT) break;
          if (!cleanedContentMap.has(demotePath)) continue;
          activeTier1.delete(demotePath);
          llmsFullTxtContent = generateLlmsFullTxtContent(
            routesByCategory,
            context,
            cleanedContentMap,
            activeTier1,
          );
          demotions++;
          console.log(
            `  ⚠️  Demoted ${demotePath} to link-only (size guard: ${(llmsFullTxtContent.length / 1024).toFixed(0)}KB)`,
          );
        }

        if (llmsFullTxtContent.length > LLMS_FULL_SIZE_LIMIT) {
          console.warn(
            `⚠️  llms-full.txt still exceeds ${(LLMS_FULL_SIZE_LIMIT / 1024).toFixed(0)}KB after all demotions (${(llmsFullTxtContent.length / 1024).toFixed(0)}KB)`,
          );
        }

        // ── 5. Generate llms.txt (spec-shaped navigator) ────────────
        // Generated after llms-full.txt so we can report the real token count.
        const fullTxtTokenEstimate = `~${Math.round(llmsFullTxtContent.length / 4000)}K`;
        const llmsTxtContent = generateLlmsTxtContent(
          curatedRoutesByCategory,
          context,
          {fullTxtTokenEstimate},
        );

        // ── 6. Generate llms-index.txt (exhaustive link index) ──────
        const llmsIndexTxtContent = generateLlmsIndexTxtContent(
          routesByCategory,
          context,
        );

        // ── 7. Append dynamic footers with actual computed sizes ────
        const navSizeHint = `~${Math.round(llmsTxtContent.length / 1024)}KB`;
        const fullSizeHint = `~${Math.round(llmsFullTxtContent.length / 4000)}K tokens`;
        const indexSizeHint = `~${Math.round(llmsIndexTxtContent.length / 1024)}KB`;
        const footer = generateAgenticFooter(context, {
          navSize: navSizeHint,
          fullTxtSize: fullSizeHint,
          indexSize: indexSizeHint,
        });

        const finalLlmsTxt = llmsTxtContent + footer;
        const finalLlmsFullTxt = llmsFullTxtContent + footer;
        const finalLlmsIndexTxt = llmsIndexTxtContent + footer;

        await fs.promises.writeFile(
          path.join(outDir, 'llms-full.txt'),
          finalLlmsFullTxt,
          'utf8',
        );
        await fs.promises.writeFile(
          path.join(outDir, 'llms.txt'),
          finalLlmsTxt,
          'utf8',
        );
        await fs.promises.writeFile(
          path.join(outDir, 'llms-index.txt'),
          finalLlmsIndexTxt,
          'utf8',
        );

        // ── 8. Report ───────────────────────────────────────────────
        const fullSizeKB = (finalLlmsFullTxt.length / 1024).toFixed(0);
        const fullTokens = Math.round(finalLlmsFullTxt.length / 4);
        const inlineCount = [...activeTier1].filter((p) =>
          cleanedContentMap.has(p),
        ).length;
        const linkedCount = finalRoutes.length - inlineCount;

        console.log(
          `✅ Generated llms.txt (${curatedRoutes.length} curated), ` +
            `llms-full.txt (${fullSizeKB}KB ~${fullTokens} tokens, ${inlineCount} inline, ${linkedCount} linked` +
            `${demotions ? `, ${demotions} demoted` : ''}), ` +
            `llms-index.txt (${finalRoutes.length} pages). ` +
            `Cleaned ${copied} markdown sources.${errors ? ` (${errors} errors)` : ''}`,
        );
      } catch (error) {
        console.error('❌ Error generating llms.txt:', error);
        throw error;
      }
    },
  };
}

module.exports = pluginLlmsTxt;
