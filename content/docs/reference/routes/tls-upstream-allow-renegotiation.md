---
id: tls-upstream-allow-renegotiation
title: TLS Upstream Allow Renegotiation
description: TLS Upstream Allow Renegotiation controls whether server-initiated TLS renegotiation is allowed for upstream servers.
keywords:
  - reference
  - TLS Upstream Allow Renegotiation
---

# TLS Upstream Allow Renegotiation

- Config File Key: `tls_upstream_allow_renegotiation`
- Type: `bool`
- Default: `false`

TLS Upstream Allow Renegotiation controls whether server-initiated TLS renegotiation is allowed for upstream servers. For more details, see Envoy's documentation on [`allow_renegotiation`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/transport_sockets/tls/v3/tls.proto).

:::warning

TLS renegotiation is considered insecure and shouldn’t be used unless absolutely necessary.

:::
