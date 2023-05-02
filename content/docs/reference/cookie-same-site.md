---
id: cookie-same-site
title: Cookie Same Site
description: |
  Sets the SameSite option for cookies written by Pomerium.
keywords:
  - reference
  - Cookie Same Site
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `COOKIE_SAME_SITE`
- Config File Key: `cookie_same_site`
- Type: `string`
- Options: `None`,`Lax`,`Strict`
- Optional
- Default: unset, which browsers treat as `Lax`

Sets the [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value) option for cookies.
