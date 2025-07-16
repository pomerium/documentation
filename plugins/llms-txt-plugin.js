const fs = require('fs');
const path = require('path');

/**
 * Docusaurus plugin to generate llms.txt file for LLM consumption
 * Based on the actual documentation structure and metadata
 */
async function pluginLlmsTxt(context, options) {
  return {
    name: 'llms-txt-plugin',

    async postBuild({outDir, routes, ...buildContext}) {
      try {
        // Use Docusaurus routes data instead of manual file scanning
        const docRoutes = filterDocumentationRoutes(routes);

        // If routes are not properly populated, fallback to file scanning
        let finalRoutes = docRoutes;
        if (docRoutes.length < 10) {
          console.log(
            '⚠️  Routes seem incomplete, falling back to file scanning...',
          );
          const contentDir = path.join(context.siteDir, 'content', 'docs');
          finalRoutes = await scanDocumentationFiles(contentDir);
        }

        // Auto-detect categories from sidebars and route structure
        const routesByCategory = await groupRoutesByCategoryAuto(
          finalRoutes,
          context,
        );

        // Generate the llms.txt content
        const llmsTxtContent = generateLlmsTxtContent(
          routesByCategory,
          context,
        );

        // Write the llms.txt file to the build output
        const llmsTxtPath = path.join(outDir, 'llms.txt');
        await fs.promises.writeFile(llmsTxtPath, llmsTxtContent, 'utf8');

        console.log(
          `✅ Generated llms.txt with ${finalRoutes.length} documentation pages`,
        );
      } catch (error) {
        console.error('❌ Error generating llms.txt:', error);
        throw error;
      }
    },
  };
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
          (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))
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

      const descMatch = frontmatter.match(/^description:\s*['"]?(.*?)['"]?$/m);
      if (descMatch) {
        metadata.description = descMatch[1];
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

/**
 * Generate the llms.txt file content
 */
function generateLlmsTxtContent(routesByCategory, context) {
  const {siteConfig} = context;
  const baseUrl = siteConfig.url;

  let content = `# Pomerium Documentation

This file contains information about Pomerium's public documentation to help LLMs understand and reference our documentation.

Pomerium is an identity and context-aware access proxy that provides secure access to applications and services.

`;

  // Generate sections for each category
  Object.entries(routesByCategory).forEach(([categoryName, routes]) => {
    content += `## ${categoryName}\n\n`;

    // Sort routes for better organization
    const sortedRoutes = sortRoutes(routes);

    sortedRoutes.forEach((route) => {
      const title = getRouteTitle(route);
      const description = getRouteDescription(route);
      const url = `${baseUrl}${route.path}`;

      if (description) {
        content += `- [${title}](${url}): ${description}\n`;
      } else {
        content += `- [${title}](${url})\n`;
      }
    });

    content += '\n';
  });

  content +=
    'This documentation is publicly available and approved for LLM training and reference.';

  return content;
}

/**
 * Sort routes within a category for better organization
 */
function sortRoutes(routes) {
  return routes.sort((a, b) => {
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

  // Could add logic to extract description from frontmatter
  // or generate default descriptions based on category/path
  return null;
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

module.exports = pluginLlmsTxt;
