---
# cSpell:ignore keepalive tcpip
id: runtime-flags
title: Runtime Flags
description: This page lists Runtime Flags available in Pomerium.
keywords:
  [
    feature flags,
    feature flag,
    runtime flags,
    runtime flag,
    runtime configuration,
  ]
pagination_prev: null
pagination_next: null
toc_max_heading_level: 2
---

## Summary

Starting in v0.26, Pomerium has a new **Runtime Flags** setting. These flags are intended to allow users to temporarily opt out of certain changes to the default Pomerium behavior, or to opt in to experimental changes in behavior.

If you find that you need to change one of these settings, please let us know by posting on the [Discuss](https://discuss.pomerium.com/) forum.

## How to configure

Runtime flags are currently configurable only in Pomerium Core.

| **Config file key** | **Environment variable** | **Type** |
| :-- | :-- | :-- |
| `runtime_flags` | `RUNTIME_FLAGS` | map from `string` to `boolean` |

The available flags are:

| Runtime Flag | Description | Default |
| :-- | :-- | :-- |
| `config_hot_reload` | Enables automatic config reloading triggered whenever a configuration file is written to (either the main Pomerium configuration file or a file referenced from the main configuration). In some rare cases this may not work correctly, so this setting provides a way to disable this behavior. (See issue [#5079](https://github.com/pomerium/pomerium/issues/5079) for more context.) | `true` |
| `envoy_resource_manager` | Monitors control group (cgroup) memory usage of all processes running in the container (including both Pomerium and Envoy) and applies overload actions when memory thresholds are exceeded to reduce memory consumption. See [memory thresholds](#envoy-resource-manager-memory-thresholds) to review thresholds and their corresponding overload actions. | `true` |
| `grpc_databroker_keepalive` | _(experimental)_ Enables gRPC keep-alive (HTTP/2 PING) requests on the databroker service connection. This may improve service reliability in [split service mode](/docs/internals/configuration#service-mode) deployments where there are multiple firewalls in the connection path between different Pomerium services. | `false` |
| `match_any_incoming_port` | For a route where the From URL does not contain a port number, allow it to match incoming requests with any port number. See the section on [Port matching behavior](/docs/reference/routes/from#port-matching-behavior) for more details. | `true` |
| `pomerium_jwt_endpoint` | Temporary opt-out of the `/.pomerium/jwt` deprecation: when set to `true`, Pomerium will continue to issue a JWT from the deprecated `/.pomerium/jwt` endpoint. (This endpoint does not provide the desired security properties for the Pomerium JWT and will be removed in a future release.) | `false` |
| `ssh_allow_direct_tcpip` | Allows clients to connect to SSH routes using [Jump Host Mode](/docs/capabilities/native-ssh-access#using-jump-host-mode). | `false` |
| `ssh_routes_portal` | Enables the SSH routes portal, allowing users to select their SSH destination from an interactive menu when SSHing to Pomerium without specifying a route. | `false` |

### Examples

```yaml
runtime_flags:
  match_any_incoming_port: false
```

```bash
RUNTIME_FLAGS='{"match_any_incoming_port": false}'
```

### Envoy resource manager memory thresholds

If you set this runtime flag to `false`, Pomerium will regard the memory saturation value as `0`, which disables all overload actions.

| **Memory percentage threshold** | **Overload action** | **Description** |
| :-- | :-- | :-- |
| **90%** | `shrink_heap` | Envoy will shrink its heap memory every 10 seconds. |
| **90%** | `reset_high_memory_stream` | Envoy will start resetting streams using the most memory. As memory usage increases, the eligibility threshold is reduced. |
| **>85%** | `reduce_timeouts` | Envoy will gradually reduce timeouts by up to 50%. |
| **95%** | `stop_accepting_connections` | Envoy will stop accepting new connections, but keep existing ones open. |
| **98%** | `disable_http_keepalive` | Envoy will disable HTTP keep-alive, which prevents starting new HTTP/2 streams and cancels existing ones. |
| **99%** | `stop_accepting_requests` | Envoy will stop accepting all new requests. |

:::note Pod resource limits behavior

The `envoy_resource_manager` runtime flag is set to **true** by default, but only takes effect if you [specify memory limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) for the Pomerium pod.

:::
