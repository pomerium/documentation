// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  title: "Pomerium",
  tagline: "Documentation",
  url: "https://www.pomerium.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "pomerium",
  projectName: "documentation",
  trailingSlash: false,
  noIndex: true,

  customFields: {
    xgridKey: process.env.XGRID_KEY,
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "content",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/pomerium/documentation/tree/main",
          remarkPlugins: [require("mdx-mermaid")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        googleAnalytics: {
          trackingID: process.env.GA,
        },
        sitemap: {
          filename: "docs/sitemap.xml",
          ignorePatterns: ["/docs/examples/**"],
        },
      },
    ],
  ],

  themeConfig: {
    image: "docs/img/logo.svg",
    announcementBar: {
      id: 'old_version',
      content: 'You\'re viewing the <b>Pomerium v0.18</b> docs website. This documentation is outdated. To view the latest documentation, go to <a href="https://pomerium.com/docs">https://pomerium.com/docs</a>.',
      backgroundColor: '#fddda3',
      textColor: '#000000',
      isCloseable: false,
    },
    algolia: {
      appId: process.env.ALGOALIA_APPID,
      apiKey: process.env.ALGOLIA_APIKEY,
      indexName: process.env.INDEX_NAME,
      contextualSearch: false,
      searchPagePath: false,
    },
    navbar: {
      title: "",
      logo: {
        alt: "Pomerium Logo",
        src: "img/logo.svg",
        href: "https://www.pomerium.com",
        target: "_self",
      },
      items: [
        {
          //href: '/',
          docId: "docs",
          position: "right",
          label: "Documentation",
          to: "/docs/",
          activeBaseRegex: "docs/(?!guides|reference|enterprise)",
        },
        {
          type: "doc",
          docId: "docs/reference",
          position: "right",
          label: "Reference",
          to: "/docs/reference/",
        },
        {
          type: "docSidebar",
          sidebarId: "guides",
          position: "right",
          label: "Guides",
          to: "/docs/guides/",
        },
        {
          type: "doc",
          docId: "docs/enterprise/about",
          position: "right",
          label: "Enterprise",
          to: "/docs/enterprise/",
        },
        {
          href: "https://github.com/pomerium/documentation",
          label: "GitHub",
          position: "right",
        },
        {
          type: "dropdown",
          label: "v18",
          position: "right",
          items: [
            {
              label: "v17",
              href: "https://v17.docs.pomerium.com/docs",
            },
            {
              type: "doc",
              label: "Archived Versions",
              docId: "docs/versions",
            },
          ],
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Resources",
          items: [
            {
              label: "Documentation",
              to: "https://www.pomerium.com/docs/",
            },
            {
              label: "Community",
              to: "https://discuss.pomerium.com/",
            },
            {
              label: "Guides",
              to: "https://www.pomerium.com/docs/guides",
            },
            {
              label: "Comparisons",
              to: "https://www.pomerium.com/comparisons/",
            },
            {
              label: "Integrations",
              to: "https://www.pomerium.com/integrations/",
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "Blog",
              to: "https://www.pomerium.com/blog/",
            },
            {
              label: "About",
              to: "https://www.pomerium.com/about/",
            },
            {
              label: "Press Kit",
              to: "https://www.pomerium.com/press/",
            },
            {
              label: "Careers",
              to: "https://www.pomerium.com/careers/",
            },
          ],
        },
      ],
      logo: {
        alt: "Pomerium Logo",
        src: "img/logo.svg",
        href: "https://www.pomerium.com",
        width: 161,
        height: 28,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Pomerium.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["actionscript", "log", "ini", "nginx", "rego"],
    },
  },
  stylesheets: [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/brands.min.css",
  ],
  plugins: [
    [
      require.resolve("docusaurus-gtm-plugin"),
      {
        id: process.env.GTM,
      },
    ],
  ],
};

if (!process.env.ALGOALIA_APPID) {
  delete config.themeConfig.algolia;
}

if (!process.env.GA) {
  delete config.presets[0][1].googleAnalytics;
}

module.exports = config;
