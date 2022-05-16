---
id: proxy-log-level
title: Proxy Log Level
description: |
  Log level sets the logging level for the Pomerium Proxy service.
keywords:
- reference
- Proxy Log Level
pagination_prev: null
pagination_next: null
---


# Proxy Log Level
- Environmental Variable: `PROXY_LOG_LEVEL`
- Config File Key: `proxy_log_level`
- Type: `string`
- Options: `debug` `info` `warn` `error`
- Default: value of `log_level` or `debug` if both are unset

Proxy log level sets the logging level for the Pomerium Proxy service access logs. Only logs of the desired level and above will be logged.

