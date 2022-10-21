---
id: signout-redirect-url
title: Signout Redirect URL
keywords:
- reference
- Signout Redirect URL
pagination_prev: null
pagination_next: null
---


# Signout Redirect URL
- Environmental Variable: `SIGNOUT_REDIRECT_URL`
- Config File Key: `signout_redirect_url`
- Type: `URL`
- Required
- Example: `https://signout-redirect-url.corp.example.com`

Signout redirect url is the url user will be redirected to after signing out.

You can overwrite this behavior by passing the query param `pomerium_redirect_uri` or post value `pomerium_redirect_uri`
to the `/.pomerium/sign_out/` endpoint.

