const fs = require("fs");
const path = require("path");
const { remark } = require("remark");
const remarkParse = require("remark-parse").default;
const remarkStringify = require("remark-stringify").default;
const remarkMdx = require("remark-mdx").default;
const visit = require("unist-util-visit").visit;

/**
 * Pre-clean Docusaurus MDX files before remark parsing.
 * - Removes all :::admonition blocks (keeps the content inside)
 * - Removes <Tabs>...</Tabs> and <TabItem ...>...</TabItem> blocks (keeps content inside)
 * - Strips any remaining standalone ::: lines
 */
function preCleanDocusaurusMDX(raw) {
  // Remove YAML frontmatter at the very top (--- ... ---)
  raw = raw.replace(/^---[\s\S]*?---\s*(\n|$)/, "");

  // Remove all Docusaurus import lines
  raw = raw.replace(/^\s*import\s.*from\s+['"][^'"]+['"];?\s*$/gm, "");

  // Remove <Tabs>, </Tabs>, <TabItem ...>, </TabItem>
  raw = raw.replace(/<\/?Tabs[^>]*>/g, "");
  raw = raw.replace(/<\/?TabItem[^>]*>/g, "");

  // Remove all Docusaurus admonition blocks (with all contents)
  raw = raw.replace(
    /^:::(info|note|caution|tip|danger|important|success|failure|admonition)[^\n]*\n([\s\S]*?)^:::\s*$/gm,
    "",
  );

  // Remove any "orphan" closing or opening :::
  raw = raw.replace(/^:::\s*$/gm, "");

  // Optionally strip extra blank lines
  raw = raw.replace(/^\s*\n/gm, "");

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
          node.type !== "yaml" && // Remove frontmatter
          node.type !== "mdxjsEsm" && // Remove import/export
          node.type !== "mdxJsxFlowElement" &&
          node.type !== "mdxJsxTextElement",
      );
      // Remove images
      visit(tree, (node, index, parent) => {
        if (node.type === "image" && parent && typeof index === "number") {
          parent.children.splice(index, 1);
        }
      });
    })
    .use(remarkStringify, {
      fences: true,
      bullet: "-",
      rule: "-",
      listItemIndent: "one",
      // Important! Do not stringify YAML nodes (just in case)
      // This setting may not exist, but keeping for emphasis.
    });

  const result = await processor.process(rawContent);

  // Optionally trim excessive blank lines
  return result.value.replace(/\n{3,}/g, "\n\n");
}

/**
 * Filter routes to only include documentation routes
 */
function filterDocumentationRoutes(routes) {
  return routes.filter((route) => {
    return (
      route.path.startsWith("/docs/") &&
      route.path !== "/docs/" &&
      !route.path.includes("/api/") &&
      !route.path.includes("/_") &&
      route.component !== "@theme/NotFound/Content"
    );
  });
}

/**
 * Scan the content directory for documentation files
 */
async function scanDocumentationFiles(contentDir) {
  const files = [];

  async function scanDirectory(dir, basePath = "") {
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          // Skip certain directories
          if (
            entry.name.startsWith(".") ||
            entry.name === "img" ||
            entry.name === "assets"
          ) {
            continue;
          }
          await scanDirectory(fullPath, relativePath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) &&
          !entry.name.startsWith("_")
        ) {
          // Create a route-like object from the file
          const urlPath =
            "/docs/" +
            relativePath.replace(/\.(mdx?|md)$/, "").replace(/\\/g, "/");

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
    const content = await fs.promises.readFile(filePath, "utf8");
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
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join(" ");
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
    "Getting Started": [],
    "Core Concepts": [],
    Deployment: [],
    "Configuration and Reference": [],
    "Advanced Capabilities": [],
    "Integrations and Guides": [],
    "API and Internals": [],
    Examples: [],
    Training: [],
    Other: [],
  };

  routes.forEach((route) => {
    const pathParts = route.path.split("/").filter(Boolean);

    if (pathParts.length < 2) return; // Skip root docs page

    const section = pathParts[1]; // First part after /docs/
    const subsection = pathParts[2]; // Second part if exists

    // Skip index files at the top level
    if (pathParts.length === 2 && (section === "index" || section === "docs")) {
      return;
    }

    // Categorize based on path structure
    if (section === "get-started") {
      categories["Getting Started"].push(route);
    } else if (section === "deploy") {
      categories["Deployment"].push(route);
    } else if (section === "capabilities") {
      // Split capabilities into core and advanced
      if (isCoreConcept(subsection)) {
        categories["Core Concepts"].push(route);
      } else {
        categories["Advanced Capabilities"].push(route);
      }
    } else if (section === "reference") {
      categories["Configuration and Reference"].push(route);
    } else if (section === "integrations" || section === "guides") {
      categories["Integrations and Guides"].push(route);
    } else if (section === "internals") {
      categories["API and Internals"].push(route);
    } else if (section === "examples") {
      categories["Examples"].push(route);
    } else if (section === "courses") {
      categories["Training"].push(route);
    } else {
      categories["Other"].push(route);
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
    "authentication",
    "authorization",
    "routing",
    "routes-portal",
  ];
  return coreConcepts.includes(subsection);
}

function getAbsoluteSiteUrl(context, sitePath) {
  const siteOrigin = context.siteConfig.url;
  const basePath = context.siteConfig.baseUrl || "/";
  return new URL(path.posix.join(basePath, sitePath), siteOrigin).toString();
}

const LLM_AGENT_INSTRUCTIONS = [
  "Cite only current www.pomerium.com docs and markdown sidecars. Do not cite docs.pomerium.com or archive hosts.",
  "For new users, start with Pomerium Zero unless the question explicitly asks for self-hosted Core or Enterprise.",
  "Prefer current PPL and reference pages for configuration questions. Use current route keys and policy syntax from the docs.",
  "For group-based authorization questions, check the relevant IdP guide plus directory sync and JWT groups filter docs when groups are missing or too large.",
  "For MCP questions, prefer the current MCP capability pages and reference docs over older guides or blog posts.",
];

const CURATED_ROUTE_PATTERNS = [
  /^\/docs\/get-started\/quickstart$/,
  /^\/docs\/get-started\/fundamentals\/core\/(advanced-policies|advanced-routes|jwt-verification|self-hosted-pomerium|tcp-routes)$/,
  /^\/docs\/get-started\/fundamentals\/zero\/(zero-advanced-policies|zero-advanced-routes|zero-build-policies|zero-build-routes|zero-single-sign-on|zero-tcp-routes)$/,
  /^\/docs\/deploy\/(core|enterprise\/quickstart|k8s\/quickstart|clients\/clients)$/,
  /^\/docs\/capabilities\/(authentication|authorization|routing|native-ssh-access|kubernetes-access|service-accounts|mcp|non-http)$/,
  /^\/docs\/capabilities\/mcp\/(protect-mcp-server|limit-mcp-tools|delegate-mcp-to-llm|mcp-upstream-oauth|reference)$/,
  /^\/docs\/internals\/ppl$/,
  /^\/docs\/integrations\/user-standing\/directory-sync$/,
  /^\/docs\/integrations\/user-identity\/(google|okta|auth0|azure|keycloak)$/,
  /^\/docs\/reference\/(jwt-groups-filter|google-cloud-serverless-authentication-service-account|identity-provider-settings|authorize-log-fields)$/,
  /^\/docs\/reference\/routes\/(enable-google-cloud-serverless-authentication|jwt-groups-filter|public-access|allow-any-authenticated-user)$/,
  /^\/docs\/guides\/(jenkins|grafana|code-server|local-mcp|zero-ssh|llm)$/,
];

function matchesCuratedRoute(routePath) {
  return CURATED_ROUTE_PATTERNS.some((pattern) => pattern.test(routePath));
}

function filterCuratedRoutes(routes) {
  return routes.filter((route) => matchesCuratedRoute(route.path));
}

function generateInstructionsBlock() {
  return `## Instructions for LLM Agents

${LLM_AGENT_INSTRUCTIONS.map((instruction) => `- ${instruction}`).join("\n")}

`;
}

function normalizeRouteMarkdownPath(routePath) {
  if (typeof routePath !== "string") return "";

  const normalizedRoutePath = routePath
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  if (!normalizedRoutePath) return "";

  const pathParts = normalizedRoutePath.split("/").filter(Boolean);
  if (path.isAbsolute(normalizedRoutePath) || pathParts.includes(".."))
    return "";

  return normalizedRoutePath;
}

function buildMarkdownUrl(route, context) {
  const routePath = normalizeRouteMarkdownPath(route.path);
  if (!routePath) return "";

  return getAbsoluteSiteUrl(context, `${routePath}/index.md`);
}

function buildRouteMarkdownOutputPath(routePath) {
  const normalizedRoutePath = normalizeRouteMarkdownPath(routePath);
  return normalizedRoutePath ? `${normalizedRoutePath}/index.md` : "";
}

function resolveRouteMarkdownOutputFile(outDir, routePath) {
  const outputPath = buildRouteMarkdownOutputPath(routePath);
  if (!outputPath) return "";

  const resolvedOutputPath = path.resolve(outDir, outputPath);
  const relativeOutputPath = path.relative(outDir, resolvedOutputPath);

  if (
    !relativeOutputPath ||
    relativeOutputPath.startsWith("..") ||
    path.isAbsolute(relativeOutputPath)
  ) {
    return "";
  }

  return resolvedOutputPath;
}

function shouldSkipMarkdownCopy(srcFile) {
  const skipPatterns = [
    "_template.mdx",
    /^_/, // files/folders starting with "_",
  ];

  return skipPatterns.some((pat) =>
    typeof pat === "string"
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
 * Generate the llms.txt file content
 */
function generateLlmsTxtContent(routesByCategory, context, options = {}) {
  const {
    title: documentTitle = "Pomerium Documentation",
    intro = "This file contains information about Pomerium's public documentation to help LLMs understand and reference our documentation.",
    includeInstructions = false,
    footer = "This documentation is publicly available and approved for LLM training and reference.",
  } = options;

  let content = `# ${documentTitle}

${intro}

Pomerium is an identity and context-aware access proxy that provides secure access to applications and services.

`;

  if (includeInstructions) {
    content += generateInstructionsBlock();
  }

  Object.entries(routesByCategory).forEach(([categoryName, routes]) => {
    content += `## ${categoryName}\n\n`;

    const sortedRoutes = sortRoutes(routes);

    sortedRoutes.forEach((route) => {
      const routeTitle = getRouteTitle(route);
      const description = getRouteDescription(route);
      const mdUrl = buildMarkdownUrl(route, context);

      if (description && mdUrl) {
        content += `- [${routeTitle}](${mdUrl}): ${description}\n`;
      } else if (mdUrl) {
        content += `- [${routeTitle}](${mdUrl})\n`;
      } else if (description) {
        content += `- ${routeTitle}: ${description}\n`;
      } else {
        content += `- ${routeTitle}\n`;
      }
    });

    content += "\n";
  });

  content += `${footer}\n`;

  return content;
}

/**
 * Sort routes within a category for better organization
 */
function sortRoutes(routes) {
  return routes.sort((a, b) => {
    // Custom sorting logic - prioritize important pages first
    const priorityOrder = [
      "quickstart",
      "fundamentals",
      "index",
      "core",
      "authentication",
      "authorization",
      "routing",
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
  const pathParts = route.path.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];

  return lastPart
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
      "⚠️  Could not auto-detect categories from sidebars, falling back to manual categorization",
    );
    return groupRoutesByCategory(routes);
  }
}

/**
 * Load and parse sidebars configuration
 */
async function loadSidebarsConfig(siteDir) {
  try {
    const sidebarsPath = path.join(siteDir, "sidebars.js");
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
    if (typeof item === "string") {
      // Direct doc reference
      const docPath = `/docs/${item.replace(/^docs\//, "")}`;
      if (parentCategory) {
        mapping[docPath] = parentCategory;
      }
    } else if (item.type === "category") {
      // Category with nested items
      const categoryName = item.label;

      if (item.items) {
        processSidebarItems(item.items, mapping, categoryName);
      }

      // Also map the category link if it exists
      if (item.link?.id) {
        const linkPath = `/docs/${item.link.id.replace(/^docs\//, "")}`;
        mapping[linkPath] = categoryName;
      }
    } else if (item.type === "doc") {
      // Direct doc with custom label
      const docPath = `/docs/${item.id.replace(/^docs\//, "")}`;
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
  const pathParts = route.path.split("/").filter(Boolean);
  for (let i = pathParts.length; i >= 2; i--) {
    const partialPath = "/" + pathParts.slice(0, i).join("/");
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
    "Get Started": "Getting Started",
    Deploy: "Deployment",
    Capabilities: "Advanced Capabilities",
    Internals: "API and Internals",
    Integrations: "Integrations and Guides",
    Reference: "Configuration and Reference",
    Guides: "Integrations and Guides",
  };

  return normalizationMap[categoryName] || categoryName;
}

/**
 * Get category from path structure (fallback method)
 */
function getCategoryFromPath(routePath) {
  const pathParts = routePath.split("/").filter(Boolean);

  if (pathParts.length < 2) return "Other";

  const section = pathParts[1];
  const subsection = pathParts[2];

  const pathMapping = {
    "get-started": "Getting Started",
    deploy: "Deployment",
    capabilities: isCoreConcept(subsection)
      ? "Core Concepts"
      : "Advanced Capabilities",
    reference: "Configuration and Reference",
    integrations: "Integrations and Guides",
    guides: "Integrations and Guides",
    internals: "API and Internals",
    examples: "Examples",
    courses: "Training",
  };

  return pathMapping[section] || "Other";
}

/**
 * Sort categories in logical order
 */
function sortCategories(categories) {
  const preferredOrder = [
    "Getting Started",
    "Core Concepts",
    "Deployment",
    "Configuration and Reference",
    "Advanced Capabilities",
    "Integrations and Guides",
    "API and Internals",
    "Examples",
    "Training",
    "Other",
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
    name: "llms-txt-plugin",

    async postBuild({ outDir, routes, ...buildContext }) {
      try {
        // Use Docusaurus routes data instead of manual file scanning
        const docRoutes = filterDocumentationRoutes(routes);

        // If routes are not properly populated, fallback to file scanning
        let finalRoutes = docRoutes;
        if (docRoutes.length < 10) {
          console.log(
            "⚠️  Routes seem incomplete, falling back to file scanning...",
          );
          const contentDir = path.join(context.siteDir, "content", "docs");
          finalRoutes = await scanDocumentationFiles(contentDir);
        }

        // Auto-detect categories from sidebars and route structure
        const routesByCategory = await groupRoutesByCategoryAuto(
          finalRoutes,
          context,
        );
        const curatedRoutes = filterCuratedRoutes(finalRoutes);
        if (curatedRoutes.length === 0) {
          console.warn(
            "⚠️  No curated llms.txt routes matched the current route set.",
          );
        }
        validateRouteMarkdownCollisions(finalRoutes);
        const curatedRoutesByCategory = await groupRoutesByCategoryAuto(
          curatedRoutes,
          context,
        );

        // Generate the llms.txt content
        const llmsTxtContent = generateLlmsTxtContent(
          curatedRoutesByCategory,
          context,
          {
            intro: `This file contains curated public documentation entry points to help LLM agents quickly find current Pomerium guidance. For the exhaustive current docs index, see ${getAbsoluteSiteUrl(context, "llms-full.txt")}.`,
            includeInstructions: true,
          },
        );
        const llmsFullTxtContent = generateLlmsTxtContent(
          routesByCategory,
          context,
          {
            title: "Pomerium Documentation (Full)",
            intro:
              "This file contains the exhaustive current public documentation index for Pomerium's docs site.",
            includeInstructions: true,
          },
        );

        // Write the llms.txt file to the build output
        const llmsTxtPath = path.join(outDir, "llms.txt");
        await fs.promises.writeFile(llmsTxtPath, llmsTxtContent, "utf8");
        const llmsFullTxtPath = path.join(outDir, "llms-full.txt");
        await fs.promises.writeFile(
          llmsFullTxtPath,
          llmsFullTxtContent,
          "utf8",
        );

        // Copy and CLEAN referenced markdown files to the build output (as .md)
        const docsRoot = path.join(context.siteDir, "content", "docs");
        let copied = 0,
          errors = 0;
        for (const route of finalRoutes) {
          let srcFile = route.filePath;
          if (!srcFile) continue;

          if (shouldSkipMarkdownCopy(srcFile)) {
            continue; // Skip this file silently
          }

          // Always copy as .md
          let destRel = path.relative(docsRoot, srcFile).replace(/\\/g, "/");
          destRel = destRel.replace(/\.(mdx|md)$/, ".md");
          if (destRel.startsWith("..")) {
            destRel = path.basename(srcFile).replace(/\.(mdx|md)$/, ".md");
          }
          // Keep legacy /content/docs markdown copies for compatibility while
          // llms consumers and infra transition to route-mirrored .md URLs.
          const contentDestFile = path.join(outDir, "content", "docs", destRel);
          const routeDestFile = resolveRouteMarkdownOutputFile(
            outDir,
            route.path,
          );
          // Ensure directory exists
          await fs.promises.mkdir(path.dirname(contentDestFile), {
            recursive: true,
          });
          // Read, clean, and write file
          try {
            const rawContent = await fs.promises.readFile(srcFile, "utf8");
            const preCleanedContent = preCleanDocusaurusMDX(rawContent);
            let cleanedContent;
            try {
              cleanedContent = await cleanMarkdownForLLM(preCleanedContent);
            } catch (err) {
              console.warn(
                `Warning: Could not fully process ${srcFile}, writing pre-cleaned version instead:`,
                err.message,
              );
              cleanedContent = preCleanedContent;
              errors++;
            }
            await fs.promises.writeFile(
              contentDestFile,
              cleanedContent,
              "utf8",
            );
            if (routeDestFile) {
              await fs.promises.mkdir(path.dirname(routeDestFile), {
                recursive: true,
              });
              await fs.promises.writeFile(
                routeDestFile,
                cleanedContent,
                "utf8",
              );
            } else {
              console.warn(
                `Warning: Could not resolve route markdown path for ${route.path}, skipping route-mirrored copy.`,
              );
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

        console.log(
          `✅ Generated llms.txt (${curatedRoutes.length} curated pages) and llms-full.txt (${finalRoutes.length} documentation pages). Copied and cleaned ${copied} markdown sources. ${errors ? `(${errors} errors)` : ""}`,
        );
      } catch (error) {
        console.error("❌ Error generating llms.txt:", error);
        throw error;
      }
    },
  };
}

module.exports = pluginLlmsTxt;
