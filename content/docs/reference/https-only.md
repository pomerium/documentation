---
id: https-only
title: HTTPS only
description: |
  If true, instructs browsers to only send user session cookies over HTTPS.
keywords:
- reference
- HTTPS only
pagination_prev: null
pagination_next: null
---


# HTTPS only
- Environmental Variable: `COOKIE_SECURE`
- Config File Key: `cookie_secure`
- Type: `bool`
- Default: `true`

If true, instructs browsers to only send user session cookies over HTTPS.

:::warning

Setting this to false may result in session cookies being sent in cleartext.

:::

