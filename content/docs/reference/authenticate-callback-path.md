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
- Type: `string`
- Default: `/oauth2/callback`
- Optional

Authenticate callback path sets the path at which the authenticate service receives callback responses from your identity provider. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client.

This value is referred to as the `redirect_url` in the [OpenIDConnect][oidc rfc] and OAuth2 specs.

See also:

- [OAuth2 RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2)
- [OIDC Spec][oidc rfc]
- [Google - Setting Redirect URI](https://developers.google.com/identity/protocols/OpenIDConnect#setredirecturi)

