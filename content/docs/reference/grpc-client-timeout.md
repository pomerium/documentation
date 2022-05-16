---
id: grpc-client-timeout
title: GRPC Client Timeout
keywords:
- reference
- GRPC Client Timeout
pagination_prev: null
pagination_next: null
---


# GRPC Client Timeout
- Environmental Variable: `GRPC_CLIENT_TIMEOUT`
- Config File Key: `grpc_client_timeout`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Default: `10s`

Maximum time before canceling an upstream gRPC request. During transient failures, the proxy will retry upstreams for this duration. You should leave this high enough to handle backend service restart and rediscovery so that client requests do not fail.

