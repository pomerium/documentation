// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  title: "Pomerium",
  tagline: "Documentation",
  url: "https://pomerium.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "pomerium",
  projectName: "documentation",

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
      },
    ],
  ],

  themeConfig: {
    image: 'docs/img/logo.svg',
    algolia: {
      appId: process.env.ALGOALIA_APPID,
      apiKey: process.env.ALGOLIA_APIKEY,
      indexName: process.env.INDEX_NAME,
    },
    navbar: {
      title: "",
      logo: {
        alt: "Pomerium Logo",
        src: "img/logo.svg",
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
          docId: "docs/reference/readme",
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
      additionalLanguages: ["actionscript", "log", "ini", "nginx"],
    },
  },
  stylesheets: [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/brands.min.css",
  ],
};

if (!process.env.ALGOALIA_APPID) {
  delete config.themeConfig.algolia;
}

module.exports = config;
