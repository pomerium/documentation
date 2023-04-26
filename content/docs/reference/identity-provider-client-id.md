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

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
