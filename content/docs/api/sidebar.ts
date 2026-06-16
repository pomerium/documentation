import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "pomerium.config.ConfigService",
      link: {
        type: "doc",
        id: "docs/api/pomerium-api",
      },
      items: [
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-key-pair",
          label: "CreateKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-policy",
          label: "CreatePolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-route",
          label: "CreateRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-service-account",
          label: "CreateServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-key-pair",
          label: "DeleteKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-policy",
          label: "DeletePolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-route",
          label: "DeleteRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-service-account",
          label: "DeleteServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-key-pair",
          label: "GetKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-policy",
          label: "GetPolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-route",
          label: "GetRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-server-info",
          label: "GetServerInfo",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-service-account",
          label: "GetServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-settings",
          label: "GetSettings",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-available-log-fields",
          label: "ListAvailableLogFields",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-key-pairs",
          label: "ListKeyPairs",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-policies",
          label: "ListPolicies",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-routes",
          label: "ListRoutes",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-service-accounts",
          label: "ListServiceAccounts",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-settings",
          label: "ListSettings",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-key-pair",
          label: "UpdateKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-policy",
          label: "UpdatePolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-route",
          label: "UpdateRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-service-account",
          label: "UpdateServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-settings",
          label: "UpdateSettings",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "KeyPair",
      items: [
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-key-pair",
          label: "CreateKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-key-pair",
          label: "DeleteKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-key-pair",
          label: "GetKeyPair",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-key-pairs",
          label: "ListKeyPairs",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-key-pair",
          label: "UpdateKeyPair",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Policy",
      items: [
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-policy",
          label: "CreatePolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-policy",
          label: "DeletePolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-policy",
          label: "GetPolicy",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-policies",
          label: "ListPolicies",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-policy",
          label: "UpdatePolicy",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Route",
      items: [
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-route",
          label: "CreateRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-route",
          label: "DeleteRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-route",
          label: "GetRoute",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-routes",
          label: "ListRoutes",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-route",
          label: "UpdateRoute",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "ServiceAccount",
      items: [
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-create-service-account",
          label: "CreateServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-delete-service-account",
          label: "DeleteServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-service-account",
          label: "GetServiceAccount",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-service-accounts",
          label: "ListServiceAccounts",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-service-account",
          label: "UpdateServiceAccount",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Settings",
      items: [
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-get-settings",
          label: "GetSettings",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-list-settings",
          label: "ListSettings",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/api/pomerium-config-config-service-update-settings",
          label: "UpdateSettings",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
