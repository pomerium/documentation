---
id: identity-provider-url
title: Identity Provider URL
description: |
  Provider URL is the base path to an identity provider's OpenID connect discovery document.
keywords:
  - reference
  - Identity Provider URL
pagination_prev: null
pagination_next: null
---

# Identity Provider URL

- Environmental Variable: `IDP_PROVIDER_URL`
- Config File Key: `idp_provider_url`
- Kubernetes: see [`identityProvider.url`](/docs/deploying/k8s/reference#identityprovider)
- Type: `string`
- Required, depending on provider (Do not use with Google).

Provider URL is the base path to an identity provider's [OpenID connect discovery document](https://openid.net/specs/openid-connect-discovery-1_0.html). An example Azure URL would be `https://login.microsoftonline.com/common/v2.0` for [their discover document](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration).

"Base path" is defined as the section of the URL to the discovery document up to (but not including) `/.well-known/openid-configuration`.

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
