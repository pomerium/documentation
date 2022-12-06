/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  documentation: [
    'docs/index',
    'docs/quickstart',
    {
      type: 'category',
      label: 'Releases',
      link: {type: 'doc', id: 'docs/releases'},
      items: [{type: 'autogenerated', dirName: 'docs/releases'}],
    },
    {
      type: 'category',
      label: 'Deploying',
      link: {type: 'doc', id: 'docs/deploying'},
      items: [{type: 'autogenerated', dirName: 'docs/deploying'}],
    },
    {
      type: 'category',
      label: 'Capabilities',
      items: [
        // core & open source
        //
        // Core concepts
        'docs/capabilities/authentication',
        'docs/capabilities/authorization',
        'docs/capabilities/ppl',
        'docs/capabilities/routing',
        // 2ndary capabilities
        'docs/capabilities/audit-logs',
        'docs/capabilities/mtls-clients',
        'docs/capabilities/mtls-services',
        'docs/capabilities/getting-users-identity',
        'docs/capabilities/single-sign-out',
        'docs/capabilities/programmatic-access',
        'docs/capabilities/load-balancing',
        'docs/capabilities/kubernetes-access',
        {
          type: 'category',
          label: 'TCP over HTTP',
          link: {type: 'doc', id: 'docs/capabilities/tcp'},
          items: [{type: 'autogenerated', dirName: 'docs/capabilities/tcp'}],
        },

        // Enterprise
        {
          id: 'docs/capabilities/device-identity',
          className: 'enterprise',
          type: 'doc',
          label: 'Device Identity',
        },
        {
          id: 'docs/capabilities/enterprise-api',
          className: 'enterprise',
          type: 'doc',
          label: 'Management API',
        },
        {
          id: 'docs/capabilities/original-request-context',
          className: 'enterprise',
          type: 'doc',
          label: 'Original User Context',
        },
        {
          id: 'docs/capabilities/branding',
          className: 'enterprise',
          type: 'doc',
          label: 'Custom Branding / Errors',
        },
        {
          id: 'docs/capabilities/metrics',
          className: 'enterprise',
          type: 'doc',
          label: 'Metrics',
        },
        {
          id: 'docs/capabilities/reports',
          className: 'enterprise',
          type: 'doc',
          label: 'Reports',
        },
        {
          id: 'docs/capabilities/service-accounts',
          className: 'enterprise',
          type: 'doc',
          label: 'Service Accounts',
        },
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [{type: 'autogenerated', dirName: 'docs/concepts'}],
    },
    {
      type: 'category',
      label: 'Identity Providers',
      link: {
        type: 'doc',
        id: 'docs/identity-providers/index',
      },
      items: [
        'docs/identity-providers/auth0',
        'docs/identity-providers/azure',
        'docs/identity-providers/cognito',
        'docs/identity-providers/github',
        'docs/identity-providers/gitlab',
        'docs/identity-providers/google',
        'docs/identity-providers/okta',
        'docs/identity-providers/one-login',
        'docs/identity-providers/ping',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      link: {type: 'doc', id: 'docs/integrations'},
      items: [{type: 'autogenerated', dirName: 'docs/integrations'}],
    },
    {
      type: 'category',
      label: 'Community',
      link: {type: 'doc', id: 'docs/community'},
      items: [{type: 'autogenerated', dirName: 'docs/community'}],
    },
  ],

  reference: [
    {
      type: 'category',
      label: 'Reference',
      link: {
        type: 'doc',
        id: 'docs/reference',
      },
      items: [{type: 'autogenerated', dirName: 'docs/reference'}],
    },
  ],
  guides: [
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
        title: 'Pomerium Guides',
        description:
          'Step by step guides for common apps, services, platforms, and use-cases with Pomerium!',
        keywords: ['guides'],
      },
      items: [{type: 'autogenerated', dirName: 'docs/guides'}],
    },
  ],
};

module.exports = sidebars;
