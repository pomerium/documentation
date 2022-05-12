---
id: set-authorization-header
title: Set Authorization Header
keywords:
- reference
- Set Authorization Header
pagination_prev: null
pagination_next: null
---


# Set Authorization Header
- `yaml`/`json` setting: `set_authorization_header`
- Type: `string` (`pass_through`, `access_token` or `id_token`)
- Optional
- Default: `pass_through`

`set_authorization_header` allows you to send a user's identity token through as a bearer token in the Authorization header.

Use `access_token` to send the OAuth access token, `id_token` to send the OIDC ID token, or `pass_through` (the default) to leave the Authorization header unchanged
from the client when it's not used for Pomerium authentication.

