---
id: route-timeout
title: Route Timeout
keywords:
- reference
- Route Timeout
pagination_prev: null
pagination_next: null
---


# Route Timeout
- `yaml`/`json` setting: `timeout`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Optional
- Default: `30s`

Policy timeout establishes the per-route timeout value. Cannot exceed global timeout values.

