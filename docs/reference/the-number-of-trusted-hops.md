---
id: the-number-of-trusted-hops
title: The number of trusted hops
description: |
  The number of trusted reverse proxies in front of pomerium.
keywords:
- reference
- The number of trusted hops
---


# The number of trusted hops
- Environmental Variable: `XFF_NUM_TRUSTED_HOPS`
- Config File Key: `xff_num_trusted_hops`
- Type: `uint32`
- Default: `0`

The number of trusted reverse proxies in front of pomerium. This affects `x-forwarded-proto` header and [`x-envoy-external-address` header](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers#x-envoy-external-address), which reports tursted client address. [Envoy](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers.html?highlight=xff_num_trusted_hops#x-forwarded-for) docs for more detail.

