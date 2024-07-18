/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  documentation: [
    'docs/index',
    'docs/quickstart',
    {
      type: 'category',
      label: 'Courses',
      link: {type: 'doc', id: 'docs/courses'},
      items: [
        {
          type: 'doc',
          id: 'docs/courses/fundamentals/zero-build-routes',
        },
        {
          type: 'doc',
          id: 'docs/courses/fundamentals/zero-build-policies',
        },
        {
          type: 'doc',
          id: 'docs/courses/fundamentals/zero-single-sign-on',
        },
        {
          type: 'doc',
          id: 'docs/courses/fundamentals/zero-advanced-policies',
        },
        {
          type: 'doc',
          id: 'docs/courses/fundamentals/zero-advanced-routes',
        },
        {
          type: 'doc',
          id: 'docs/courses/fundamentals/zero-tcp-routes',
        },
      ],
    },
    {
      type: 'category',
      label: 'Pomerium Zero',
      link: {type: 'doc', id: 'docs/zero'},
      items: [{type: 'autogenerated', dirName: 'docs/zero'}],
    },
    {
      type: 'category',
      label: 'Pomerium Core',
      link: {type: 'doc', id: 'docs/core'},
      items: [
        'docs/core/quickstart',
        'docs/core/configuration',
        'docs/core/changelog',
        'docs/core/upgrading',
        'docs/core/from-source',
        'docs/core/binary',

      ]
      // items: [{type: 'autogenerated', dirName: 'docs/core'}],
    },
    {
      type: 'category',
      label: 'Pomerium Enterprise',
      link: {type: 'doc', id: 'docs/enterprise'},
      items: [
        'docs/enterprise/quickstart',
        'docs/enterprise/install',
        'docs/enterprise/configure',
        'docs/enterprise/changelog',
        'docs/enterprise/upgrading',
      ],
    },
    {
      type: 'category',
      label: 'Kubernetes',
      items: [{type: 'autogenerated', dirName: 'docs/k8s'}],
    },
    {
      type: 'category',
      label: 'Clients',
      items: [{type: 'autogenerated', dirName: 'docs/clients'}],
    },
    {
      type: 'category',
      label: 'Capabilities',
      items: [
        // zero
        {
          id: 'docs/capabilities/custom-domains',
          className: 'zero',
          type: 'doc',
          label: 'Custom Domains',
        },
        // core & open source
        //
        // Core concepts
        'docs/capabilities/authentication',
        'docs/capabilities/authorization',
        'docs/capabilities/ppl',
        'docs/capabilities/routing',
        // secondary capabilities
        {
          type: 'doc',
          label: 'Audit Logs',
          id: 'docs/capabilities/audit-logs',
        },
        'docs/capabilities/hosted-authenticate-service',
        'docs/capabilities/self-hosted-authenticate-service',
        'docs/capabilities/jwt-verification',
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
          id: 'docs/capabilities/impersonation',
          className: 'enterprise',
          type: 'doc',
          label: 'User Impersonation',
        },
        {
          id: 'docs/capabilities/directory-sync',
          className: 'enterprise',
          type: 'doc',
          label: 'Directory Sync',
        },
        {
          id: 'docs/capabilities/device-identity',
          className: 'enterprise',
          type: 'doc',
          label: 'Device Identity',
        },
        {
          id: 'docs/integrations',
          className: 'enterprise',
          type: 'doc',
          label: 'External Data Sources',
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
        {
          id: 'docs/capabilities/high-availability',
          className: 'enterprise',
          type: 'doc',
          label: 'High Availability',
        },
        {
          id: 'docs/capabilities/namespacing',
          className: 'enterprise',
          type: 'doc',
          label: 'Namespaces',
        },
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        {
          type: 'doc',
          id: 'docs/concepts/clusters',
          className: 'zero',
        },
        {
          type: 'doc',
          id: 'docs/concepts/access-control',
        },
        {
          type: 'doc',
          id: 'docs/concepts/device-identity',
        },
        {
          type: 'doc',
          id: 'docs/concepts/mutual-auth',
        },
        {
          type: 'doc',
          id: 'docs/concepts/zero-trust',
        },
      ],
    },
    {
      type: 'category',
      label: 'Internals',
      link: {type: 'doc', id: 'docs/internals/architecture'},
      items: [{type: 'autogenerated', dirName: 'docs/internals'}],
    },
    {
      type: 'category',
      label: 'Community',
      link: {type: 'doc', id: 'docs/community'},
      items: [{type: 'autogenerated', dirName: 'docs/community'}],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      link: {type: 'doc', id: 'docs/troubleshooting'},
      items: [
        {
          id: 'docs/troubleshooting/cluster-status',
          className: 'zero',
          type: 'doc',
        },
      ],
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
      items: [
        {
          type: 'category',
          label: 'Upstream Services',
          description:
            'Secure common services and applications behind Pomerium',
          items: [
            {
              type: 'doc',
              id: 'docs/guides/grafana',
            },
            {
              type: 'doc',
              id: 'docs/guides/code-server',
            },
            {
              type: 'doc',
              id: 'docs/guides/jenkins',
            },
            {
              type: 'doc',
              id: 'docs/guides/tooljet',
            },
            {
              type: 'doc',
              id: 'docs/guides/gitlab',
            },
            {
              type: 'doc',
              id: 'docs/guides/transmission',
            },
            {
              type: 'doc',
              id: 'docs/guides/hedgedoc',
            },
            {
              type: 'doc',
              id: 'docs/guides/tiddlywiki',
            },
            {
              type: 'doc',
              id: 'docs/guides/ad-guard',
            },
          ],
        },
        {
          type: 'category',
          label: 'Identity Providers',
          description:
            'Configure a custom Identity Provider for authentication',
          items: [
            {
              type: 'doc',
              id: 'docs/identity-providers/apple',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/auth0',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/azure',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/cognito',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/github',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/gitlab',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/google',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/oidc',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/okta',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/one-login',
            },
            {
              type: 'doc',
              id: 'docs/identity-providers/ping',
            },
          ],
        },
        {
          type: 'category',
          label: 'External Data Sources',
          description: 'Integrate external data sources with Pomerium',
          items: [
            {
              type: 'doc',
              id: 'docs/integrations/bamboohr',
              className: 'enterprise',
            },
            {
              type: 'doc',
              id: 'docs/integrations/geoip',
              className: 'enterprise',
            },
            {
              type: 'doc',
              id: 'docs/integrations/ip-ranges',
              className: 'enterprise',
            },
            {
              type: 'doc',
              id: 'docs/integrations/tor-exit-nodes',
              className: 'enterprise',
            },
            {
              type: 'doc',
              id: 'docs/integrations/vpn-providers',
              className: 'enterprise',
            },
            {
              type: 'doc',
              id: 'docs/integrations/zenefits',
              className: 'enterprise',
            },
            {
              type: 'doc',
              id: 'docs/guides/cloud-run',
            },
            {
              type: 'doc',
              id: 'docs/guides/argo',
            },
            {
              type: 'doc',
              id: 'docs/guides/cockpit',
            },
            {
              type: 'doc',
              id: 'docs/guides/helm',
            },
            {
              type: 'doc',
              id: 'docs/guides/istio',
            },
            {
              type: 'doc',
              id: 'docs/guides/synology',
            },
          ],
        },
        {
          type: 'category',
          label: 'Courses',
          description: 'Learn how Pomerium works with guided tutorials',
          items: [
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/get-started',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/build-routes',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/build-policies',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/jwt-verification',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/advanced-policies',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/advanced-routes',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/tcp-routes',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/self-hosted-pomerium',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/production-certificates',
            },
            {
              type: 'doc',
              id: 'docs/courses/fundamentals/conclusion',
            },
          ],
        },
        {
          type: 'category',
          label: 'Configure Pomerium',
          description: 'Configure Pomerium to work with your services',
          items: [
            {
              type: 'doc',
              id: 'docs/guides/jwt-verification',
            },
            {
              type: 'doc',
              id: 'docs/guides/cors',
            },
            {
              type: 'doc',
              id: 'docs/guides/certificates',
            },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
