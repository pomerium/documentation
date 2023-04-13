---
id: identity-provider-client-id
title: Identity Provider Client ID
description: |
  Client ID is the OAuth 2.0 Client Identifier retrieved from your identity provider.
keywords:
  - reference
  - Identity Provider Client ID
pagination_prev: null
pagination_next: null
---

# Identity Provider Client ID

- Environmental Variable: `IDP_CLIENT_ID`
- Config File Key: `idp_client_id`
- Kubernetes: see [`identityProvider.secret`](/docs/deploying/k8s/reference#identityprovider)
- Type: `string`
- Required

Client ID is the OAuth 2.0 Client Identifier retrieved from your identity provider. See your identity provider's documentation, and our [identity provider](/docs/identity-providers/) docs for details.

:::tip **Note**

Pomerium’s **Hosted Authenticate Service** provides a hosted **authenticate service URL** and a hosted **identity provider**.

If you use the hosted services, you don’t need to include identity provider settings in your configuration.

See [Identity Provider Configuration](/docs/identity-providers#hosted-identity-provider) for more information.

:::
