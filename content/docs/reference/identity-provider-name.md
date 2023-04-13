---
id: identity-provider-name
title: Identity Provider Name
description: |
  Provider is the short-hand name of a built-in OpenID Connect (oidc) identity provider to be used for authentication.
keywords:
  - reference
  - Identity Provider Name
pagination_prev: null
pagination_next: null
---

# Identity Provider Name

- Environmental Variable: `IDP_PROVIDER`
- Config File Key: `idp_provider`
- Kubernetes: see [`identityProvider.provider`](/docs/deploying/k8s/reference#identityprovider)
- Type: `string`
- Required
- Options: `auth0` `azure` `google` `okta` `onelogin` or `oidc`

Provider is the short-hand name of a built-in OpenID Connect (oidc) identity provider to be used for authentication. To use a generic provider,set to `oidc`.

See [identity provider](/docs/identity-providers/) for details.

:::tip **Note**

Pomerium’s **Hosted Authenticate Service** provides a hosted **authenticate service URL** and a hosted **identity provider**.

If you use the hosted services, you don’t need to include identity provider settings in your configuration.

See [Identity Provider Configuration](/docs/identity-providers#hosted-identity-provider) for more information.

:::
