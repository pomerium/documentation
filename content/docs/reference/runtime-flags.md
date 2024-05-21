---
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
| `grpc_databroker_keepalive` | _(experimental)_ Enable gRPC keepalive (HTTP/2 PING) requests on the databroker service connection. This may improve service reliability in [split service mode](/docs/capabilities/high-availability#service-mode) deployments where there are multiple firewalls in the connection path between different Pomerium services. | `false` |
| `match_any_incoming_port` | For routes where the From URL does not contain a port number, allow it to match incoming requests with any port number. See the section on [Port matching behavior](/docs/reference/routes/from#port-matching-behavior) for more details. | `true` |
| `legacy_identity_manager` | The way Pomerium manages IdP session refresh has been newly rewritten in v0.26 for enhanced performance and reliability. When this flag is enabled, Pomerium will revert to the older implementation. | `false` |

### Examples

```yaml
runtime_flags:
  match_any_incoming_port: false
```

```bash
RUNTIME_FLAGS='{"match_any_incoming_port": false}'
```
