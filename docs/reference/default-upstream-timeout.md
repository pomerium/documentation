---
id: default-upstream-timeout
title: Default Upstream Timeout
description: |
  Default Upstream Timeout is the default timeout applied to a proxied route when no timeout key is specified by the policy.
keywords:
- reference
- Default Upstream Timeout
---


# Default Upstream Timeout
- Environmental Variable: `DEFAULT_UPSTREAM_TIMEOUT`
- Config File Key: `default_upstream_timeout`
- Type: [Duration](https://golang.org/pkg/time/#Duration) `string`
- Example: `10m`, `1h45m`
- Default: `30s`

Default Upstream Timeout is the default timeout applied to a proxied route when no `timeout` key is specified by the policy.

