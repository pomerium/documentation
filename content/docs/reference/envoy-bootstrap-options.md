---
# cSpell:ignore freebind

id: envoy-bootstrap-options
title: Envoy Bootstrap Options
keywords:
  - reference
  - Envoy Bootstrap Options
pagination_prev: null
pagination_next: null
---

# Envoy Bootstrap Options

- Environment Variable: `ENVOY_ADMIN_ADDRESS`, `ENVOY_ADMIN_ACCESS_LOG_PATH`, `ENVOY_ADMIN_PROFILE_PATH`, `ENVOY_BIND_CONFIG_FREEBIND`, `ENVOY_BIND_CONFIG_SOURCE_ADDRESS`
- Config File Keys: `envoy_admin_address`, `envoy_admin_access_log_path`, `envoy_admin_profile_path`, `envoy_bind_config_freebind`, `envoy_bind_config_source_address`
- Type: `string`
- Optional

The `envoy_admin` keys customize Envoy's [bootstrap configuration](https://www.envoyproxy.io/docs/envoy/latest/operations/admin#operations-admin-interface). The `envoy_bind_config` keys modify the [ClusterManager](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/bootstrap/v3/bootstrap.proto.html#config-bootstrap-v3-clustermanager) configuration. These options cannot be modified at runtime.
