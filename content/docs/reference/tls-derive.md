---
id: tls-derive
title: Auto TLS
description: |
  Auto TLS for Console and Core seamless connectivity.
keywords:
  - reference
pagination_prev: null
pagination_next: null
---

# Auto TLS

- Environmental Variable: `TLS_DERIVE`
- Config File Key: `tls_derive`
- Kubernetes: `--databroker-auto-tls` runtime parameter
- Type: `FQDN` (fully qualified domain name)
- Default: none

Auto TLS enables automatic TLS between Pomerium Core and Enterprise by deriving the certificate authority (CA) and server certificates from a `shared_secret`. Auto TLS secures HTTPS and gRPC/TLS endpoints connecting the Console to the Databroker and Proxy services so you don’t have to manually generate certificates (it’s still an option for users who demand it).

When set:

- a CA is derived from the `shared_secret` and is added to the list of system default CAs.
- An upstream route (`to`) server certificate signed by such a derived CA would be trusted.
- The Databroker gRPC server would use a server certificate with a provided domain name and signed by a derived CA.
