---
id: use-proxy-protocol
title: Use Proxy Protocol
keywords:
  - reference
  - Use Proxy Protocol
pagination_prev: null
pagination_next: null
---

# Use Proxy Protocol

- Environment Variable: `USE_PROXY_PROTOCOL`
- Config File Key: `use_proxy_protocol`
- Type: `bool`
- Optional

Setting `use_proxy_protocol` will configure Pomerium to require the [HAProxy proxy protocol](https://www.haproxy.org/download/1.9/doc/proxy-protocol.txt) on incoming connections. Versions 1 and 2 of the protocol are supported.
