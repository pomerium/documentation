---
title: Identity Provider Configuration
sidebar_label: Identity Providers
description: This article describes how to connect Pomerium to third-party identity providers / single-sign-on services.
pagination_prev: null
pagination_next: null
---

Pomerium provides single-sign-on authentication and user identity details by integrating with your downstream Identity Provider (**IdP**) of choice. That authentication integration is achieved using OAuth2, and [OpenID Connect][openid connect] (**OIDC**). Where available, Pomerium also supports pulling additional data (like groups) using directory synchronization. An additional API token is required for directory sync.

The steps for integrating Pomerium with an IdP are specific to each provider, but they generally share the same base requirements:

- A **[Redirect URL](https://www.oauth.com/oauth2-servers/redirect-uris/)** pointing back to Pomerium. For example, `https://${authenticate_service_url}/oauth2/callback`.
  - The redirect URL will always be your [Authenticate Service URL](/docs/reference/authenticate-service-url), plus `/oauth2/callback`.
- A **[Client ID]** and **[Client Secret]**.
- An optional **[Service Account]** for additional IdP Data. This enables Pomerium administrators to write policies around groups.
  - Depending on the IdP, a service account may have its own client id and secret, or require an API token. Pomerium handles this by accepting values for `idp_service_account` as a base64-encoded json object with the correct key/value pairs for each IdP supported.

The subsequent pages in this section provide specific instructions for the IdPs Pomerium supports.

[client id]: /docs/reference/identity-provider-client-id
[client secret]: /docs/reference/identity-provider-client-secret
[environmental variables]: https://en.wikipedia.org/wiki/Environment_variable
[oauth2]: https://oauth.net/2/
[openid connect]: https://en.wikipedia.org/wiki/OpenID_Connect
[service account]: /docs/reference/identity-provider-service-account
