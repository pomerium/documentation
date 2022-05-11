// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Pomerium',
  tagline: 'Documentation',
  url: 'https://pomerium.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'pomerium',
  projectName: 'documentation',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/pomerium/documentation',
          remarkPlugins: [require('mdx-mermaid')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Pomerium Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: '/',
            //docId: 'docs',
            position: 'right',
            label: 'Documentation',
            //to: '/docs/'
          },
          {
            type: 'doc',
            docId: 'reference/readme',
            position: 'right',
            label: 'Reference',
            to: '/reference/'
          },
          {
            type: 'doc',
            docId: 'guides/readme',
            position: 'right',
            label: 'Guides',
            to: '/guides/'
          },
          {
            type: 'doc',
            docId: 'enterprise/about',
            position: 'right',
            label: 'Enterprise',
            to: '/enterprise/'
          },
          {
            href: 'https://github.com/pomerium/documentation',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Pomerium',
            items: [
              {
                label: 'Home',
                href: 'https://pomerium.com',
              },
              {
                label: 'Customer Stories',
                href: 'https://www.pomerium.com/customer-stories/',
              },
              {
                label: 'Pricing',
                href: 'https://www.pomerium.com/pricing/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discuss',
                href: 'https://discuss.pomerium.com/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/pomerium_io',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://www.pomerium.com/blog/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/pomerium/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Pomerium, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  stylesheets: [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
  ],
};

module.exports = config;
