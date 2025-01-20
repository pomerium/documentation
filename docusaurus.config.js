// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config();

const config = {
  title: 'Pomerium',
  tagline: 'Documentation',
  url: 'https://www.pomerium.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'pomerium',
  projectName: 'documentation',
  trailingSlash: false,

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  customFields: {
    xgridKey: process.env.XGRID_KEY,
  },

  scripts: [
    {
      src: './static/js/syft.js',
      async: false,
    },
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'content',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/pomerium/documentation/tree/main',
          admonitions: {
            keywords: [
              'note',
              'tip',
              'info',
              'caution',
              'danger',
              'enterprise',
            ],
            extendDefaults: true,
          },
          versions: {
            current: {
              label: 'v0.28 (latest)',
            },
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: [`${process.env.GA4}`, `${process.env.GA}`],
        },
        sitemap: {
          filename: 'docs/sitemap.xml',
          ignorePatterns: ['/docs/examples/**'],
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: 'https://console.pomerium.app/openapi.yaml',
            route: '/docs/api/',
          },
        ],
      },
    ],
  ],

  themeConfig: {
    image: 'docs/img/logo.svg',
    algolia: {
      appId: process.env.ALGOLIA_APPID,
      apiKey: process.env.ALGOLIA_APIKEY, // cSpell:ignore APIKEY
      indexName: process.env.INDEX_NAME,
      contextualSearch: false,
      searchPagePath: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Pomerium Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
        href: 'https://www.pomerium.com',
        target: '_self',
      },
      items: [
        {
          docId: 'docs',
          position: 'right',
          label: 'Documentation',
          to: '/docs/',
          activeBaseRegex: 'docs/(?!guides|reference|enterprise)',
        },
        {
          type: 'doc',
          docId: 'docs/reference',
          position: 'right',
          label: 'Reference',
          to: '/docs/reference/',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guides',
          position: 'right',
          label: 'Guides',
          to: '/docs/guides/',
        },
        {
          href: 'https://github.com/pomerium/pomerium ',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: 'https://0-28-0.docs.pomerium.com/docs',
              label: 'v0.28 (latest)',
            },
            {
              type: 'html',
              value: '<hr>',
            },
            {
              to: '/docs/versions',
              label: 'All Versions',
            },
          ],
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Documentation',
              to: 'https://www.pomerium.com/docs/',
            },
            {
              label: 'Community',
              to: 'https://discuss.pomerium.com/',
            },
            {
              label: 'Guides',
              to: 'https://www.pomerium.com/docs/guides',
            },
            {
              label: 'Comparisons',
              to: 'https://www.pomerium.com/comparisons/',
            },
            {
              label: 'Integrations',
              to: 'https://www.pomerium.com/integrations/',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Blog',
              to: 'https://www.pomerium.com/blog/',
            },
            {
              label: 'About',
              to: 'https://www.pomerium.com/about/',
            },
            {
              label: 'Press Kit',
              to: 'https://www.pomerium.com/press/',
            },
            {
              label: 'Careers',
              to: 'https://www.pomerium.com/careers/',
            },
          ],
        },
      ],
      logo: {
        alt: 'Pomerium Logo',
        src: 'img/logo.svg',
        href: 'https://www.pomerium.com',
        width: 161,
        height: 28,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Pomerium.`,
    },
    prism: {
      theme: lightCodeTheme(),
      darkTheme: darkCodeTheme(),
      additionalLanguages: [
        'actionscript',
        'log',
        'ini',
        'json',
        'nginx',
        'rego',
        'shell-session',
      ],
    },
    mermaid: {
      theme: {light: 'default', dark: 'default'},
    },
  },
  stylesheets: [
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/brands.min.css',
  ],
  plugins: [
    [
      require.resolve('docusaurus-gtm-plugin'),
      {
        id: process.env.GTM,
      },
    ],
    // async function customPlugin(context, opts) {
    //   return {
    //     name: 'custom-plugin',
    //     configureWebpack(config, isServer, utils, content) {
    //       return {
    //         plugins: [
    //           new webpack.DefinePlugin({
    //             // IMPORTANT: To fix debug library‘s bug
    //             // {}.DEBUG = namespaces; // SyntaxError: Unexpected token '.'
    //             'process.env.DEBUG': 'process.env.DEBUG',
    //           }),
    //         ],
    //       };
    //     },
    //   };
    // },
    [
      'docusaurus-pushfeedback',
      {
        project: 'esgee0kxds',
        buttonPosition: 'center-right',
        modalPosition: 'sidebar-right',
        buttonStyle: 'dark',
        modalTitle: 'Share your thoughts',
      },
    ],
  ],
};

// The prism-react-renderer themes do not define styles for the 'shell-session'
// token types, so define our own styles for these types here.
function lightCodeTheme() {
  return {
    ...require('prism-react-renderer').themes.github,
    styles: require('prism-react-renderer').themes.github.styles.concat([
      {types: ['shell-symbol'], style: {color: '#5d36c6'}},
      {types: ['command'], style: {color: '#1c1e21'}},
      {types: ['output'], style: {color: '#133369'}},
    ]),
  };
}

function darkCodeTheme() {
  return {
    ...require('prism-react-renderer').themes.dracula,
    styles: require('prism-react-renderer').themes.dracula.styles.concat([
      {types: ['shell-symbol'], style: {color: '#c0a9ff'}},
      {types: ['output'], style: {color: '#e4e4c4'}},
    ]),
  };
}

if (!process.env.ALGOLIA_APPID) {
  delete config.themeConfig.algolia;
}

if (!process.env.GA) {
  delete config.presets[0][1].googleAnalytics;
}

module.exports = config;
