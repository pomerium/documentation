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

:::caution

This option is no longer supported, please see [Upgrade Guide](/docs/releases/upgrading#idp-directory-sync)

:::

- Environmental Variables: `IDP_REFRESH_DIRECTORY_INTERVAL` `IDP_REFRESH_DIRECTORY_TIMEOUT`
- Config File Key: `idp_refresh_directory_interval` `idp_refresh_directory_timeout`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Example: `IDP_REFRESH_DIRECTORY_INTERVAL=30m`
- Defaults: `IDP_REFRESH_DIRECTORY_INTERVAL=10m` `IDP_REFRESH_DIRECTORY_TIMEOUT=1m`

Refresh directory interval is the time that pomerium will sync your IDP directory, while refresh directory timeout is the maximum time allowed each run.

:::warning

Use it at your own risk, if you set a too low value, you may reach IDP API rate limit.

:::

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
