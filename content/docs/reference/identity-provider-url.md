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
- Type: `string`
- Required, depending on provider (Do not use with Google).

Provider URL is the base path to an identity provider's [OpenID connect discovery document](https://openid.net/specs/openid-connect-discovery-1_0.html). An example Azure URL would be `https://login.microsoftonline.com/common/v2.0` for [their discover document](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration).

"Base path" is defined as the section of the URL to the discovery document up to (but not including) `/.well-known/openid-configuration`.
