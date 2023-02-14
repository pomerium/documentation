---
id: grpc-client-dns-roundrobin
title: GRPC Client DNS RoundRobin
keywords:
  - reference
  - GRPC Client DNS RoundRobin
pagination_prev: null
pagination_next: null
---

# GRPC Client DNS RoundRobin

- Environmental Variable: `GRPC_CLIENT_DNS_ROUNDROBIN`
- Config File Key: `grpc_client_dns_roundrobin`
- Kubernetes: not supported
- Type: `bool`
- Default: `true`

Enable gRPC DNS based round robin load balancing. This method uses DNS to resolve endpoints and does client side load balancing of _all_ addresses returned by the DNS record. Do not disable unless you have a specific use case.
