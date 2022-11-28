---
id: http-redirect-address
title: HTTP Redirect Address
description: |
  If set, the HTTP Redirect Address specifies the host and port to redirect http to https traffic on.
keywords:
  - reference
  - HTTP Redirect Address
pagination_prev: null
pagination_next: null
---

# HTTP Redirect Address

- Environmental Variable: `HTTP_REDIRECT_ADDR`
- Config File Key: `http_redirect_addr`
- Type: `string`
- Example: `:80`, `:8080`
- Optional

If set, the HTTP Redirect Address specifies the host and port to redirect http to https traffic on. If unset, no redirect server is started.
