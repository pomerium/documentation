---
id: identity-provider-client-id-per-route
title: Identity Provider Client ID (per route)
keywords:
  - reference
  - Identity Provider Client ID (per route)
pagination_prev: null
pagination_next: null
---

- `yaml`/`json` setting: `idp_client_id`
- Type: `string`
- Optional

When set, this overrides the value of [idp_client_id](/docs/reference/identity-provider-client-id) set globally for this route.

:::tip **Note**

Pomerium’s **Hosted Authenticate Service** provides a hosted **authenticate service URL** and a hosted **identity provider**.

If you use the hosted services, you don’t need to include identity provider settings in your configuration.

See [Identity Provider Configuration](/docs/identity-providers#hosted-identity-provider) for more information.

:::
