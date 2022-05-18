// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const dotenv = require("dotenv");

dotenv.config()

/** @type {import('@docusaurus/types').Config} */
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
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "content",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/pomerium/documentation",
          remarkPlugins: [require("mdx-mermaid")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
          },
          {
            type: "doc",
            docId: "docs/reference/readme",
            position: "right",
            label: "Reference",
            to: "/docs/reference/",
          },
          {
            type: "doc",
            docId: "docs/guides/readme",
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
                to: "https://www.pomerium.com/docs/guides/",
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
          {
            title: "Social",
            items: [
              {
                label: "LinkedIn",
                to: "https://www.linkedin.com/company/pomerium-inc",
              },
              {
                label: "Twitter",
                to: "https://twitter.com/pomerium_io",
              },
              {
                label: "Github",
                to: "https://github.com/pomerium",
              },
              {
                label: "Slack",
                to: "https://slack.pomerium.io/",
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
        copyright: `Copyright © ${new Date().getFullYear()} Pomerium. All Rights Reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  stylesheets: ["https://fonts.googleapis.com/icon?family=Material+Icons"],
};

module.exports = config;
