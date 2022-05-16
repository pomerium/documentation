---
id: idle-timeout
title: Idle Timeout
keywords:
- reference
- Idle Timeout
pagination_prev: null
pagination_next: null
---


# Idle Timeout
- `yaml`/`json` setting: `idle_timeout`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Optional
- Default: `5m`

If you are proxying long-lived requests that employ streaming calls such as websockets or gRPC,
set this to either a maximum value there may be no data exchange over a connection (recommended),
or set it to unlimited (`0s`). If `idle_timeout` is specified, and `timeout` is not
explicitly set, then `timeout` would be unlimited (`0s`). You still may specify maximum lifetime
of the connection using `timeout` value (i.e. to 1 day).

