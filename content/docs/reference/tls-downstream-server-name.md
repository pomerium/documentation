---
id: tls-downstream-server-name
title: TLS Downstream Server Name
keywords:
  - reference
  - TLS Downstream Server Name
pagination_prev: null
pagination_next: null
---

# TLS Downstream Server Name

- Config File Key: `tls_downstream_server_name`
- Type: `string`
- Optional

TLS Downstream Server Name overrides the hostname specified in the `from` field. When a connection to Pomerium is made via TLS the `tls_downstream_server_name` will be used as the expected Server Name Indication, whereas the host part of the `from` field, will be expected to match the `Host` or `:authority` headers of the HTTP request.
