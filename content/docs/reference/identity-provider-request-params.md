---
id: identity-provider-request-params
title: Identity Provider Request Params
description: |
  Headers specifies a mapping of HTTP Header to be added to proxied  requests. Nota bene Downstream application headers will be overwritten by Pomerium's headers on conflict.
keywords:
  - reference
  - Identity Provider Request Params
pagination_prev: null
pagination_next: null
---

# Identity Provider Request Params

- Environmental Variable: `IDP_REQUEST_PARAMS`
- Config File Key: `idp_request_params`
- Kubernetes: see [`identityProvider.requestParams` and `identityProvider.requestParamsSecret`](/docs/deploying/k8s/reference#identityprovider)
- Type: map of `strings` key value pairs
- Optional

Request parameters to be added as part of a sign in request using OAuth2 code flow.

For more information see:

- [OIDC Request Parameters](https://openid.net/specs/openid-connect-basic-1_0.html#RequestParameters)
- [IANA OAuth Parameters](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml)
- [Microsoft Azure Request params](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code)
- [Google Authentication URI parameters](https://developers.google.com/identity/protocols/oauth2/openid-connect)
