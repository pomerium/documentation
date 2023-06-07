---
title: Identity Provider Configuration
sidebar_label: Identity Providers
description: Connect Pomerium to third-party identity providers and single-sign-on services.
keywords:
  [
    authenticate service url,
    identity provider,
    hosted authenticate service,
    oidc,
    client id,
    client secret,
    redirect url,
  ]
pagination_prev: null
pagination_next: null
---

Pomerium provides authentication through your existing identity provider (**IdP**) and supports all major single sign-on (**SSO**) providers.

Pomerium uses the OAuth 2.0 and OIDC protocols to integrate with your IdP so you can configure any IdP solution that supports these protocols.

The steps to integrate your IdP with Pomerium vary depending on your provider, but all IdPs generally require the following settings:

- **[Redirect URI](https://www.oauth.com/oauth2-servers/redirect-uris/)**
- **[Client ID]**
- **[Client Secret]**

The **Redirect URI** should include your [Authenticate Service URL](/docs/reference/authenticate-service-url) with `/oauth2/callback` in the URL path.

For example, `https://{authenticate_service_url}.com/oauth2/callback`.

See the guides in this section for specific steps to integrate your IdP with Pomerium.

## Hosted identity provider

Pomerium’s [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) provides a **Hosted Authenticate Service URL** and a **Hosted Identity Provider**.

If you use the hosted services, you don’t need to include IdP settings or an authenticate service URL in your configuration.

See [Configure hosted services](/docs/capabilities/hosted-authenticate-service#configure-the-hosted-authenticate-service) for more information.

[client id]: /docs/reference/identity-provider-settings#identity-provider-client-id
[client secret]: /docs/reference/identity-provider-settings#identity-provider-client-secret
[environmental variables]: https://en.wikipedia.org/wiki/Environment_variable
[oauth2]: https://oauth.net/2/
[openid connect]: https://en.wikipedia.org/wiki/OpenID_Connect
