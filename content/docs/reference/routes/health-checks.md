---
id: health-checks
title: Health Checks
keywords:
- reference
- Health Checks
pagination_prev: null
pagination_next: null
---


# Health Checks
- Config File Key: `health_checks`
- Type: `array of objects`
- Optional

When defined, will issue periodic health check requests to upstream servers. When health checks are defined, unhealthy upstream servers would not serve traffic.
See also `outlier_detection` for automatic upstream server health detection.
In presence of multiple upstream servers, it is recommended to set up either `health_checks` or `outlier_detection` or both.

See [Envoy documentation](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/health_checking) for a list of [supported parameters](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/core/v3/health_check.proto#envoy-v3-api-msg-config-core-v3-healthcheck).

Only one of `http_health_check`, `tcp_health_check`, or `grpc_health_check` may be configured per health_check object definition.

- [TCP](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/core/v3/health_check.proto#envoy-v3-api-msg-config-core-v3-healthcheck-tcphealthcheck)
- [HTTP](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/core/v3/health_check.proto#envoy-v3-api-msg-config-core-v3-healthcheck-httphealthcheck)
- [GRPC](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/core/v3/health_check.proto#envoy-v3-api-msg-config-core-v3-healthcheck-grpchealthcheck)

See [Load Balancing](/docs/concepts/load-balancing) for example [configurations](/docs/concepts/load-balancing#active-health-checks).

