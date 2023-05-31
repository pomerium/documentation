---
id: authenticate-callback-path
title: Authenticate Callback Path
description: |
  The authenticate callback path is the path/url from the authenticate service that will receive the response from your identity provider.
keywords:
  - reference
  - Authenticate Callback Path
pagination_prev: null
pagination_next: null
---

# Authenticate Callback Path

- Environmental Variable: `AUTHENTICATE_CALLBACK_PATH`
- Config File Key: `authenticate_callback_path`
- [Kubernetes](/docs/deploy/k8s/configure): [`authenticate.callbackPath`](/docs/deploy/k8s/reference#authenticate)
- Type: `string`
- Default: `/oauth2/callback`
- Optional

Authenticate callback path sets the path at which the authenticate service receives callback responses from your identity provider. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client.

This value is referred to as the `redirect_url` in the [OpenIDConnect][oidc rfc] and OAuth2 specs.

See also:

- [OAuth2 RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2)
- [OIDC Spec][oidc rfc]
- [Google - Setting Redirect URI](https://developers.google.com/identity/protocols/OpenIDConnect#setredirecturi)

[oidc rfc]: https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, you must include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
