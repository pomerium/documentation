---
id: tls-upstream-server-name
title: TLS Upstream Server Name
keywords:
- reference
- TLS Upstream Server Name
pagination_prev: null
pagination_next: null
---


# TLS Upstream Server Name
- Config File Key: `tls_upstream_server_name`
- Type: `string`
- Optional

TLS Upstream Server Name overrides the hostname specified in the `to` field. If set, this server name will be used to verify the certificate name. This is useful when the backend of your service is a TLS server with a valid certificate, but mismatched name.

