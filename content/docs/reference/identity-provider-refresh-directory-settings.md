---
id: identity-provider-refresh-directory-settings
title: Identity Provider Refresh Directory Settings
keywords:
  - reference
  - Identity Provider Refresh Directory Settings
pagination_prev: null
pagination_next: null
---

# Identity Provider Refresh Directory Settings

- Environmental Variables: `IDP_REFRESH_DIRECTORY_INTERVAL` `IDP_REFRESH_DIRECTORY_TIMEOUT`
- Config File Key: `idp_refresh_directory_interval` `idp_refresh_directory_timeout`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Example: `IDP_REFRESH_DIRECTORY_INTERVAL=30m`
- Defaults: `IDP_REFRESH_DIRECTORY_INTERVAL=10m` `IDP_REFRESH_DIRECTORY_TIMEOUT=1m`

Refresh directory interval is the time that pomerium will sync your IDP diretory, while refresh directory timeout is the maximum time allowed each run.

:::warning



Use it at your own risk, if you set a too low value, you may reach IDP API rate limit.

:::
