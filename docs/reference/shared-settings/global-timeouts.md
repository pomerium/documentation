---
id: global-timeouts
title: Global Timeouts
description: |
  Timeouts set the global server timeouts. Timeouts can also be set for individual routes.
keywords:
- reference
- Global Timeouts
---


# Global Timeouts
- Environmental Variables: `TIMEOUT_READ` `TIMEOUT_WRITE` `TIMEOUT_IDLE`
- Config File Key: `timeout_read` `timeout_write` `timeout_idle`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Example: `TIMEOUT_READ=30s`
- Defaults: `TIMEOUT_READ=30s` `TIMEOUT_WRITE=0` `TIMEOUT_IDLE=5m`

Timeouts set the global server timeouts. Timeouts can also be set for individual [routes](#routes).

- `idle_timeout`: The idle timeout is the time at which a downstream or upstream connection will be terminated if there are no active streams.
- `write_timeout`: The max stream duration is the maximum time that a stream’s lifetime will span. An HTTP request/response exchange fully consumes a single stream.
  Therefore, this value must be greater than read_timeout as it covers both request and response time.
- `read_timeout`: The amount of time for the entire request stream to be received from the client.

