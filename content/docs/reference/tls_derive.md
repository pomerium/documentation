---
id: log-level
title: Log Level
description: |
  Log level sets the global logging level for pomerium.
keywords:
  - reference
  - Log Level
pagination_prev: null
pagination_next: null
---

# Auto TLS

- Environmental Variable: `TLS_DERIVE`
- Config File Key: `tls_derive`
- Kubernetes: `--databroker-auto-tls` runtime parameter
- Type: `FQDN` (fully qualified domain name)
- Default: none

This option enables automatic TLS between Pomerium Core and Enterprise, to secure gRPC connectivity from Console to Databroker and from Proxy to Console HTTPS and gRPC/TLS endpoints, without the need to manually procure certificates (which is still an option for those users who demand it) by deriving CA and server certs from `shared_secret`.

When set:

- a certificate authority is derived from the `shared_secret` and is added to default CA.
- route upstream (`to`) server certificate signed by such a derived CA would be trusted.
- databroker gRPC server would use a server certificate with a provided domain name and signed by a derived CA.
