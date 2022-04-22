---
id: javascript-security
title: Javascript Security
description: |
  If true, prevents javascript in browsers from reading user session cookies.
keywords:
- reference
- Javascript Security
---


# Javascript Security
- Environmental Variable: `COOKIE_HTTP_ONLY`
- Config File Key: `cookie_http_only`
- Type: `bool`
- Default: `true`

If true, prevents javascript in browsers from reading user session cookies.

:::warning

Setting this to false enables hostile javascript to steal session cookies and impersonate users.

:::

