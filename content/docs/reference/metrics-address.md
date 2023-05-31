---
id: metrics-address
title: Metrics Address
description: |
  Expose a prometheus format HTTP endpoint on the specified port.
keywords:
  - reference
  - Metrics Address
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `METRICS_ADDRESS`
- Config File Key: `metrics_address`
- Kubernetes: see [Metrics](/docs/deploy/k8s/install#metrics)
- Type: `string`
- Example: `:9090`, `127.0.0.1:9090`
- Default: `disabled`
- Optional

Expose a prometheus endpoint on the specified port.

:::warning

**Use with caution:** the endpoint can expose frontend and backend server names or addresses. Do not externally expose the metrics if this is sensitive information.

:::

## Pomerium Metrics Tracked

Each metric exposed by Pomerium has a `pomerium` prefix, which is omitted in the table below for brevity.

| Name | Type | Description |
| --- | --- | --- |
| build_info | Gauge | Pomerium build metadata by git revision, service, version and go version |
| config_checksum_int64 | Gauge | Currently loaded configuration checksum by service |
| config_last_reload_success | Gauge | Whether the last configuration reload succeeded by service |
| config_last_reload_success_timestamp | Gauge | The timestamp of the last successful configuration reload by service |
| grpc_client_request_duration_ms | Histogram | GRPC client request duration by service |
| grpc_client_request_size_bytes | Histogram | GRPC client request size by service |
| grpc_client_requests_total | Counter | Total GRPC client requests made by service |
| grpc_client_response_size_bytes | Histogram | GRPC client response size by service |
| grpc_server_request_duration_ms | Histogram | GRPC server request duration by service |
| grpc_server_request_size_bytes | Histogram | GRPC server request size by service |
| grpc_server_requests_total | Counter | Total GRPC server requests made by service |
| grpc_server_response_size_bytes | Histogram | GRPC server response size by service |
| http_client_request_duration_ms | Histogram | HTTP client request duration by service |
| http_client_request_size_bytes | Histogram | HTTP client request size by service |
| http_client_requests_total | Counter | Total HTTP client requests made by service |
| http_client_response_size_bytes | Histogram | HTTP client response size by service |
| http_server_request_duration_ms | Histogram | HTTP server request duration by service |
| http_server_request_size_bytes | Histogram | HTTP server request size by service |
| http_server_requests_total | Counter | Total HTTP server requests handled by service |
| http_server_response_size_bytes | Histogram | HTTP server response size by service |
| storage_operation_duration_ms | Histogram | Storage operation duration by operation, result, backend and service |

## Identity Manager

Identity manager metrics have `pomerium_identity_manager` prefix.

| Name | Type | Description |
| --- | --- | --- |
| last_refresh_timestamp | Gauge | Timestamp of last directory refresh operation. |
| session_refresh_error_timestamp | Gauge | Timestamp of last session refresh ended in an error. |
| session_refresh_errors | Counter | Session refresh error counter. |
| session_refresh_success | Counter | Session refresh success counter. |
| session_refresh_success_timestamp | Gauge | Timestamp of last successful session refresh. |
| user_group_refresh_error_timestamp | Gauge | Timestamp of last user group refresh ended in an error. |
| user_group_refresh_errors | Counter | User group refresh error counter. |
| user_group_refresh_success | Counter | User group refresh success counter. |
| user_group_refresh_success_timestamp | Gauge | Timestamp of last group successful user refresh. |
| user_refresh_error_timestamp | Gauge | Timestamp of last user refresh ended in an error. |
| user_refresh_errors | Counter | User refresh error counter. |
| user_refresh_success | Counter | User refresh success counter. |
| user_refresh_success_timestamp | Gauge | Timestamp of last successful user refresh. |

## Envoy Proxy Metrics

As of `v0.9`, Pomerium uses [envoy](https://www.envoyproxy.io/) for the data plane. As such, proxy related metrics are sourced from envoy, and use envoy's internal [stats data model](https://www.envoyproxy.io/docs/envoy/latest/operations/stats_overview). Please see Envoy's documentation for information about specific metrics.

All metrics coming from envoy will be labeled with `service="pomerium"` or `service="pomerium-proxy"`, depending if you're running all-in-one or distributed service mode and have `pomerium` prefix added to the standard envoy metric name.
