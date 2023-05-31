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
- Kubernetes: see [`identityProvider.provider`](/docs/deploy/k8s/reference#identityprovider)
- Type: `string`
- Required
- Options: `auth0` `azure` `google` `okta` `onelogin` or `oidc`

Provider is the short-hand name of a built-in OpenID Connect (oidc) identity provider to be used for authentication. To use a generic provider, set to `oidc`.

See [identity provider](/docs/identity-providers/) for details.

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
