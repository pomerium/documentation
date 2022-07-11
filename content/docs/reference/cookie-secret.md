---
id: cookie-secret
title: Cookie Secret
description: |
  Secret used to encrypt and sign session cookies.
keywords:
- reference
- Cookie Secret
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `COOKIE_SECRET`
- Config File Key: `cookie_secret`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string`
- Required for Proxy service

Secret used to encrypt and sign session cookies. You can generate a random key with `head -c32 /dev/urandom | base64`.
