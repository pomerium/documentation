/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  documentation: [
    'docs/index',
    {
      type: 'category',
      label: 'Get Started',
      link: {type: 'doc', id: 'docs/get-started/quickstart'},
      items: [
        {
          type: 'doc',
          id: 'docs/get-started/quickstart',
        },
        {
          type: 'category',
          label: 'Fundamentals Step-by-Step',
          // link: {type: 'doc', id: 'docs/get-started/fundamentals/zero'},
          items: [
            {
              type: 'autogenerated',
              dirName: 'docs/get-started/fundamentals',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Deploy',
      // link: {type: 'doc', id: 'docs/deploy/index'}, // optional parent doc
      items: [
        {
          type: 'autogenerated',
          dirName: 'docs/deploy', // directory to autogenerate from
        },
      ],
    },
    {
      type: 'category',
      label: 'Capabilities',
      items: [
        // Core Capabilities
        'docs/capabilities/authentication',
        'docs/capabilities/authorization',
        'docs/capabilities/getting-users-identity',
        'docs/capabilities/ppl',
        'docs/capabilities/routing',
        'docs/capabilities/custom-domains',
        // secondary capabilities
        {
          type: 'doc',
          label: 'Audit Logs',
          id: 'docs/capabilities/audit-logs',
        },
        'docs/capabilities/kubernetes-access',
        {
          type: 'category',
          label: 'Non-HTTP Protocols',
          link: {type: 'doc', id: 'docs/capabilities/non-http'},
          items: [
            {
              type: 'autogenerated',
              dirName: 'docs/capabilities/non-http',
            },
          ],
        },
        // Enterprise
        {
          id: 'docs/capabilities/branding',
          className: 'enterprise',
          type: 'doc',
        },
        {
          id: 'docs/capabilities/self-remediation',
          className: 'enterprise',
          type: 'doc',
        },
        {
          id: 'docs/capabilities/original-request-context',
          className: 'enterprise',
          type: 'doc',
          label: 'Original User Context',
        },
        {
          id: 'docs/capabilities/service-accounts',
          className: 'enterprise',
          type: 'doc',
          label: 'Service Accounts',
        },
        {
          id: 'docs/capabilities/impersonation',
          className: 'enterprise',
          type: 'doc',
          label: 'User Impersonation',
        },
      ],
    },

    {
      type: 'category',
      label: 'How Pomerium Works',
      link: {type: 'doc', id: 'docs/internals/architecture'},
      items: [{type: 'autogenerated', dirName: 'docs/internals'}],
    },
    {
      type: 'category',
      label: 'Integrations',
      link: {type: 'doc', id: 'docs/integrations'},
      description: 'Integrate external data sources with Pomerium',
      items: [{type: 'autogenerated', dirName: 'docs/integrations'}],
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
        slug: 'docs/guides',
      },
      items: [{type: 'autogenerated', dirName: 'docs/guides'}],
    },
  ],
};

module.exports = sidebars;
