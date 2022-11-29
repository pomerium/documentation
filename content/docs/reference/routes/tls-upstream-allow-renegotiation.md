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

TLS Upstream Allow Renegotiation controls whether server-initiated TLS renegotiation is allowed for upstream servers.

:::warning

TLS renegotiation is considered insecure and shouldn’t be used unless absolutely necessary.

:::
