---
id: identity-provider-client-secret
title: Identity Provider Client Secret
description: |
  Client Secret is the OAuth 2.0 Secret Identifier retrieved from your identity provider.
keywords:
  - reference
  - Identity Provider Client Secret
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `IDP_CLIENT_SECRET`
- Config File Key: `idp_client_secret`
- Kubernetes: see [`identityProvider.secret`](/docs/kubernetes/reference#identityprovider)
- Type: `string`
- Required (unless using [identity_provider_client_secret_file](./identity-provider-client-secret-file))

Client Secret is the OAuth 2.0 Secret Identifier retrieved from your identity provider. See your identity provider's documentation, and our [identity provider](/docs/identity-providers/) docs for details.
