---
id: identity-provider-scopes
title: Identity Provider Scopes
description: |
  Identity provider scopes correspond to access privilege scopes as defined in Section 33 of OAuth 20 RFC6749.
keywords:
  - reference
  - Identity Provider Scopes
pagination_prev: null
pagination_next: null
---

# Identity Provider Scopes

- Environmental Variable: `IDP_SCOPES`
- Config File Key: `idp_scopes`
- Kubernetes: see [`identityProvider.scopes`](/docs/deploying/k8s/reference#identityprovider)
- Type: list of `string`
- Default: `openid`,`profile`, `email`, `offline_access` (typically)
- Optional for built-in identity providers.

Identity provider scopes correspond to access privilege scopes as defined in Section 3.3 of OAuth 2.0 RFC6749\. The scopes associated with Access Tokens determine what resources will be available when they are used to access OAuth 2.0 protected endpoints.

:::warning

If you are using a built-in provider, you probably don't want to set customized scopes.

:::

:::warning

Some providers, like Amazon Cognito, _do not_ support the `offline_access` scope.

:::

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default. 

If you want to run Pomerium with a self-hosted authenticate service, include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration. 

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::