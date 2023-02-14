---
id: cookie-secure
title: Secure Cookie
description: |
  If true, instructs browsers to only send user session cookies over HTTPS.
keywords:
  - reference
  - HTTPS only
pagination_prev: null
pagination_next: null
---

# Secure Cookie

- Environmental Variable: `COOKIE_SECURE`
- Config File Key: `cookie_secure`
- Kubernetes: [`cookie.secure`](/docs/deploying/k8s/reference#cookie)
- Type: `bool`
- Default: `true`

If true, instructs browsers to only send user session cookies over HTTPS.

:::warning

Setting this to false may result in session cookies being sent in clear text.

:::
