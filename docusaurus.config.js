// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const githubCodeTheme = require('prism-react-renderer/themes/github');
const draculaCodeTheme = require('prism-react-renderer/themes/dracula');
const dotenv = require('dotenv');

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
              label: 'vNext (upcoming release)',
              badge: true,
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
    announcementBar: {
      id: 'kubecon-2024',
      content:
        'Meet the Pomerium Development Team at our KubeCon 2024 booth in Salt Lake City, Utah from November 12-15. <b><a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0YfkyTbr2fYMyJvdPf7vsQ2xLkc77t1eGPiwM2jRkl8hBLubeOWjgX3dcFHjU_M86cgYhBIV_u?gv=true" target="_blank">Book an appointment now!</a></b>',
      backgroundColor: '#7C3AED',
      textColor: '#FFFFFF',
      isCloseable: true,
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
          type: 'dropdown',
          position: 'right',
          label: 'APIs',
          items: [
            {
              docId: 'docs/api',
              label: 'Zero API',
              to: '/docs/api/',
            },
            {
              docId: 'docs/capabilities/enterprise-api',
              label: 'Enterprise API',
              to: 'docs/capabilities/enterprise-api',
            },
          ],
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
              to: 'https://0-27-0.docs.pomerium.com/docs',
              label: 'v0.27 (latest)',
            },
            {
              to: 'https://0-26-0.docs.pomerium.com/docs',
              label: 'v0.26',
            },
            {
              to: 'https://0-25-0.docs.pomerium.com/docs',
              label: 'v0.25',
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
    './docusaurus-plugins/src/webpackDebugFix.js',
  ],
};

// The prism-react-renderer themes do not define styles for the 'shell-session'
// token types, so define our own styles for these types here.
function lightCodeTheme() {
  return {
    ...githubCodeTheme,
    styles: githubCodeTheme.styles.concat([
      {types: ['shell-symbol'], style: {color: '#5d36c6'}},
      {types: ['command'], style: {color: '#1c1e21'}},
      {types: ['output'], style: {color: '#133369'}},
    ]),
  };
}
function darkCodeTheme() {
  return {
    ...draculaCodeTheme,
    styles: draculaCodeTheme.styles.concat([
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
