---
id: load-balancing-policy-config
title: Load Balancing Policy Config
keywords:
  - reference
  - Load Balancing Policy Config
pagination_prev: null
pagination_next: null
---

# Load Balancing Policy Config

- Config File Key: `least_request_lb_config`, `ring_hash_lb_config`, `maglev_lb_config`
- Type: `object`
- Optional

When [`lb_policy`](/docs/reference/routes/load-balancing-policy) is configured, you may further customize policy settings for `LEAST_REQUEST`, `RING_HASH`, AND `MAGLEV` using one of the following options.

- [`least_request_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-msg-config-cluster-v3-cluster-leastrequestlbconfig)
- [`ring_hash_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#config-cluster-v3-cluster-ringhashlbconfig)
- [`maglev_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-msg-config-cluster-v3-cluster-maglevlbconfig)

See [Load Balancing](@site/content/docs/capabilities/load-balancing.md) for example [configurations](@site/content/docs/capabilities/load-balancing.md#load-balancing-method)
