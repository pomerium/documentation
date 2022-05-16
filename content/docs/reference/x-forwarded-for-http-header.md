---
id: x-forwarded-for-http-header
title: X-Forwarded-For HTTP Header
description: |
  Do not append proxy IP address to [x-forwarded-for](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers.html?highlight=skip_xff_append#x-forwarded-for).
keywords:
- reference
- X-Forwarded-For HTTP Header
pagination_prev: null
pagination_next: null
---


# X-Forwarded-For HTTP Header
- Environmental Variable: `SKIP_XFF_APPEND`
- Config File Key: `skip_xff_append`
- Type: `bool`
- Default: `false`

Do not append proxy IP address to `x-forwarded-for` HTTP header. See [Envoy](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers.html?highlight=skip_xff_append#x-forwarded-for) docs for more detail.

