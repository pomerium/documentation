---
# cSpell:ignore XPOST tsdb

title: Telemetry & Metrics in Pomerium
sidebar_label: Telemetry & Metrics
description: Learn how Pomerium collects and displays metrics in Pomerium Zero and Pomerium Enterprise.
lang: en-US
keywords:
  [pomerium, pomerium enterprise, telemetry, metrics, prometheus, pomerium zero]
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

Metrics in Pomerium provide observability and monitoring data from your Pomerium deployment. Use metrics to review traffic and its effects on your system.

Pomerium exposes standard Prometheus metrics related to its operation. Open-source users must [configure](/docs/reference/metrics) metrics collection and visualization manually.

Pomerium Zero and Pomerium Enterprise provide simplified, built-in metrics collection and visualizations.

## Metrics definitions

- **Traffic**: requests proxied by Pomerium to routes defined in a Pomerium deployment.
- **Route**: the location of an upstream service protected behind Pomerium. At a minimum, a route consists of a [From](/docs/reference/routes/from) URL and a [To](/docs/reference/routes/to) URL.

## How metrics work

Pomerium collects and aggregates traffic data from your Pomerium deployment. This data includes the:

- request size, duration, and rate
- number of authorized and denied requests
- response code distribution

You can view and filter this data in your traffic dashboard to gauge how much demand is placed on your server.

### Filter metrics

#### Time range and routes

Pomerium stores traffic metrics up to the last 30 days of usage. You can filter traffic by time range and routes.

The following time ranges are supported:

- Last 30 days
- Last 2 weeks
- Last 7 days
- Last 24 hours
- Last 12 hours
- Last 3 hours
- Last hour
- Last 15 minutes (Enterprise only)

When filtering by route, select:

- **All Routes** to review aggregated traffic metrics across all routes defined in your Pomerium deployment.
- an individual route to review aggregated traffic metrics for that route.

<Tabs>
<TabItem label="Zero" value="zero">

![Filtering metrics by time range routes in Pomerium Zero](./img/metrics/zero-filter-traffic.gif)

</TabItem>
<TabItem label="Enterprise" value="enterprise">

![Filtering metrics by time range routes in the Pomerium Enterprise console](./img/metrics/enterprise-filter-traffic.gif)

</TabItem>
</Tabs>

## Traffic dashboard

<Tabs>
<TabItem value="zero" label="Zero">

Pomerium Zero collects traffic metrics at the [cluster](/docs/internals/clusters) level, which includes active replicas. To review the traffic dashboard in Pomerium Zero:

1. In the left-hand sidebar, select **Reports**.
1. Select **Traffic**.

![Find traffic metrics in Pomerium Zero](./img/metrics/zero-find-metrics.gif)

</TabItem>
<TabItem value="enterprise" label="Enterprise">

When you access the Enterprise Console, you'll land on the traffic dashboard. Pomerium Enterprise organizes traffic metrics in your deployment with [namespaces](/docs/internals/namespacing).

Namespaces follow a hierarchical system. You can view traffic metrics for all namespaces, or a specific namespace, using the namespace dropdown menu. You can filter by:

- Global namespace, which encompasses all namespaces in your deployment.
- Parent namespace, which includes child namespaces (if any).
- Child namespace, which displays metrics only for that namespace.

![Selecting a namespace to view its traffic in the Enterprise Console](./img/metrics/enterprise-metrics-namespaces.gif)

:::enterprise

In Pomerium Enterprise, you must configure metrics before you can view them. Metrics are not enabled by default, and are not required to run Pomerium Enterprise. See the [Configure Metrics](/docs/deploy/enterprise/configure-metrics) guide to enable metrics in your Enterprise deployment.

:::

</TabItem>
</Tabs>

### Total and Authorized requests

<Tabs>
<TabItem value="zero" label="Zero">

The **Total requests** chart shows the total number of proxied requests. The **Authorized requests** chart shows the total number of requests Pomerium authorized and forwarded to an upstream service.

Both charts display the difference in requests between the selected and previous time ranges. ![Displaying the total and authorized requests in Pomerium Zero](./img/metrics/zero-total-and-authorized-requests.png)

The **Authorized Requests** pie chart displays the total number of authorized and denied requests. ![A pie chart showing the number of authorized and denied requests in Pomerium Zero](./img/metrics/zero-authorized-and-denied-chart.png)

</TabItem>
<TabItem value="enterprise" label="Enterprise">

The **Total requests** chart shows the total number of proxied requests. The **Authorized requests** chart shows the total number of requests Pomerium authorized and forwarded to an upstream service.

The **Healthy Endpoints** chart displays the number of healthy upstream endpoints, and roughly correlates with the number of routes defined in your deployment.

For example, if a route's **To** definition includes [multiple upstream resources](/docs/reference/routes/to#target-multiple-upstream-resources), Pomerium includes these resources in the total sum of healthy endpoints. Pomerium excludes unhealthy endpoints from this total. See Load Balancing - [Active Health Checks](/docs/capabilities/routing#active-health-checks) and [Passive Health Checks](/docs/capabilities/routing#passive-health-checks) for more information.

![Viewing the total and authorized request charts in the Enterprise Console](./img/metrics/enterprise-total-requests.png)

The **Authorized Requests** pie chart displays the total number of authorized and denied requests.

![A pie chart showing the number of authorized and denied requests in Pomerium Enterprise](./img/metrics/enterprise-authorized-requests.png)

The **Healthy Upstream Endpoints** graph shows you the number of healthy endpoints over time. A dip in the graph denotes unhealthy endpoints.

![A graph displaying the number of healthy upstream endpoints in Pomerium Enterprise](./img/metrics/enterprise-healthy-upstream-endpoints-graph.png)

</TabItem>
</Tabs>

### Request durations

<Tabs>
<TabItem value="zero" label="Zero">

Request duration measures the amount of time it takes Pomerium to proxy a request in milliseconds (ms). Pomerium Zero provides two request duration charts:

The first chart organizes requests by duration ranges defined along the x-axis. Pomerium sums the total value of requests within each range and calculates the amount as a percentage value.

![A chart displaying request duration in Pomerium Zero](./img/metrics/zero-request-duration.png)

The second chart organizes requests by percentile ranges, date, and time.

![A chart displaying request duration in Pomerium Zero](./img/metrics/zero-request-duration-second-chart.png)

</TabItem>
<TabItem value="enterprise" label="Enterprise">

Request duration measures the amount of time it takes Pomerium to proxy a request in milliseconds (ms). Pomerium Enterprise provides two request duration charts:

The first chart organizes requests by duration ranges defined along the x-axis. Pomerium sums the total value of requests within each range and calculates the amount as a percentage value.

![A chart displaying request duration in Pomerium Enterprise](./img/metrics/enterprise-request-duration.png)

The second chart organizes requests by percentile ranges, date, and time. You can select a specific percentile range to view more granular data in that range:

![A chart displaying request duration with percentile ranges in Enterprise Console](./img/metrics/enterprise-percentile-ranges.gif)

</TabItem>
</Tabs>

### Requests rate and response codes

<Tabs>
<TabItem value="zero" label="Zero">

The **Requests per second** chart calculates the average amount of proxied requests per second over the span of an hour. Requests are organized by date and time, and categorized by the following response status codes:

- **200s** (200-299): successful responses
- **300s** (300-399): redirection messages
- **400s** (400-499): client error responses
- **500s** (500-599): server error responses

![A chart displaying requests per second in Pomerium Zero](./img/metrics/zero-requests-per-second.png)

</TabItem>
<TabItem value="enterprise" label="Enterprise">

The **Request Rate** chart calculates the average amount of proxied requests per second over the span of an hour.

![A chart displaying requests per second in Pomerium Enterprise](./img/metrics/enterprise-request-rate.png)

The **Response Codes** chart organizes requests by date and time, and categorizes them with the following response status codes:

- **HTTP 2xx** (200-299): successful responses
- **HTTP 3xx** (300-399): redirection messages
- **HTTP 4xx** (400-499): client error responses
- **HTTP 5xx** (500-599): server error responses

![A response codes chart in Pomerium Enterprise](./img/metrics/enterprise-response-status-codes.gif)

</TabItem>
</Tabs>

### Bytes sent and received, request size

<Tabs>
<TabItem value="zero" label="Zero">

The **Bytes sent** and **Bytes received** charts display the average amount of bytes sent and received over the span of an hour.

![A chart displaying bytes sent and received in Pomerium Zero](./img/metrics/zero-bytes-sent-received.png)

</TabItem>
<TabItem value="enterprise" label="Enterprise">

The **Request Size** chart organizes requests based on their request size measured in kilobytes (KB).

![A chart displaying response size in Pomerium Enterprise](./img/metrics/enterprise-request-size.png)

</TabItem>
</Tabs>

## Runtime dashboard

<Tabs>
<TabItem value="zero" label="Zero">

Runtime metrics are not supported in Pomerium Zero.

</TabItem>
<TabItem value="enterprise" label="Enterprise">

In the **Runtime** dashboard, you can monitor how many system resources Pomerium is consuming. Filter by date range, service, and instance.

![The Runtime Info page in Pomerium Enterprise](./img/metrics/reports-runtime-fullpage.png)

</TabItem>
</Tabs>

## Configuration Settings

This reference covers all of Pomerium's **Metrics Settings**:

- [Metrics Address](#metrics-address)
- [Metrics Basic Authentication](#metrics-basic-authentication)
- [Metrics Certificate](#metrics-certificate)
- [Metrics Client Certificate Authority](#metrics-client-certificate-authority)

### Metrics Address {#metrics-address}

**Metrics Address** exposes a Prometheus endpoint on the specified port.

:::warning

**Use with caution:** the endpoint can expose frontend and backend server names or addresses. Do not externally expose the metrics if this is sensitive information.

:::

#### How to configure {#how-to-configure-metrics-address}

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** | **Default** |
| :-- | :-- | :-- | :-- | :-- |
| `metrics_address` | `METRICS_ADDRESS` | `string` | **optional** | `disabled` |

##### Examples {#examples-metrics-address}

```yaml
metrics_address: :9090
```

```bash
METRICS_ADDRESS: 127.0.0.1:9090
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`metrics_address` is a bootstrap configuration setting and is not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

See Kubernetes [Metrics](/docs/deploy/k8s/install#metrics)

</TabItem>
</Tabs>

#### Pomerium Metrics Tracked

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

#### Identity Manager

Identity manager metrics have a `pomerium_identity_manager` prefix.

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

#### Envoy Proxy Metrics

As of `v0.9`, Pomerium uses [Envoy](https://www.envoyproxy.io/) for the data plane. As such, proxy related metrics are sourced from Envoy, and use Envoy's internal [stats data model](https://www.envoyproxy.io/docs/envoy/latest/operations/stats_overview). Please see Envoy's documentation for information about specific metrics.

All metrics coming from Envoy will be labeled with `service="pomerium"` or `service="pomerium-proxy"`, depending if you're running all-in-one or distributed service mode and have `pomerium` prefix added to the standard envoy metric name.

See [Configuration & Settings](/docs/internals/configuration#all-in-one-vs-split-service-mode) for more information configuration environments.

### Metrics Basic Authentication {#metrics-basic-authentication}

**Metrics Basic Authentication** requires [Basic HTTP Authentication](https://tools.ietf.org/html/rfc7617) to access the metrics endpoint.

To support this in Prometheus, consult the `basic_auth` option in the [`scrape_config`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) documentation.

#### How to configure {#how-to-configure-metrics-basic-authentication}

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `metrics_basic_authentication` | `METRICS_BASIC_AUTHENTICATION` | `string` ([base64 encoded](https://en.wikipedia.org/wiki/Base64)) | **optional** |

##### Examples {#examples-metrics-basic-authentication}

```yaml
# for username: x and password: y
metrics_basic_authentication: eDp5
```

```bash
# for username: x and password: y
METRICS_BASIC_AUTHENTICATION=eDp5
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`metrics_basic_authentication` is a bootstrap configuration setting and is not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

Kubernetes does not support `metrics_basic_authentication`

</TabItem>
</Tabs>

### Metrics Certificate {#metrics-certificate}

**Metrics Certificate** uses a certificate to secure the metrics endpoint.

A Certificate is an X.509 _public-key_ and _private-key_ pair.

:::tip **Note:**

All certificates supplied to Pomerium must be in **PEM** format.

:::

#### How to configure {#how-to-configure-metrics-certificate}

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `metrics_certificate` and `metrics_certificate_key` | `METRICS_CERTIFICATE` and `METRICS_CERTIFICATE_KEY` | `string` | **optional** |
| `metrics_certificate_file` and `metrics_certificate_key_file` | `METRICS_CERTIFICATE_FILE` and `METRICS_CERTIFICATE_KEY_FILE` | `string` | **optional** |

##### Examples {#examples-metrics-certificate}

```yaml
metrics_certificate: base64-encoded-string
metrics_certificate_key: base64-encoded-string
```

```bash
METRICS_CERTIFICATE_FILE=/relative/file/location
METRICS_CERTIFICATE_FILE_KEY=/relative/file/location
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

**Metrics Certificate** settings are bootstrap configuration settings and are not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

Kubernetes does not support **Metrics Certificate**

</TabItem>
</Tabs>

### Metrics Client Certificate Authority {#metrics-client-certificate-authority}

**Metrics Client Certificate Authority** is the X.509 _public-key_ used to validate [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) client certificates for the metrics endpoint. If not set, no client certificate will be required.

#### How to configure {#how-to-configure-metrics-client-certificate-authority}

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `metrics_client_ca` and `metrics_client_ca_file` | `METRICS_CLIENT_CA` and `METRICS_CLIENT_CA_FILE` | `string` | **optional** |

##### Examples {#examples-metrics-client-certificate-authority}

```yaml
metrics_client_ca: base64-encoded-string
```

```bash
METRICS_CLIENT_CA_FILE=/relative/file/location
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`metrics_client_ca` and `metrics_client_ca_file` are bootstrap configuration settings and are not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

Kubernetes does not support **Metrics Client Certificate Authority**

</TabItem>
</Tabs>
