---
# cSpell:ignore XPOST tsdb

title: Metrics in Pomerium
sidebar_label: Metrics
description: Learn how Pomerium collects and displays metrics in Pomerium Zero and Pomerium Enterprise.
lang: en-US
keywords: [pomerium, pomerium enterprise, telemetry, metrics, prometheus, pomerium zero]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Metrics in Pomerium provide observability and monitoring data from your Pomerium deployment. Use metrics to review traffic and its effects on your system.

Metrics are available only in Pomerium Zero and Pomerium Enterprise deployments. 

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

## Metrics in Pomerium Zero

Pomerium Zero collects traffic metrics at the [cluster](/docs/concepts/clusters) level, which includes active replicas. To review the traffic dashboard in Pomerium Zero:

1. In the left-hand sidebar, select **Reports**.
1. Select **Traffic**.

    ![Find traffic metrics in Pomerium Zero](./img/metrics/zero-find-traffic-dashboard.png)

### Total and Authorized requests

The **Total requests** chart shows the total number of proxied requests. The **Authorized requests** chart shows the total number of requests Pomerium authorized and forwarded to an upstream service.
  
Both charts display the difference in requests between the selected and previous time ranges.
    ![Displaying the total and authorized requests in Pomerium Zero](./img/metrics/zero-total-and-authorized-requests.png)

The **Authorized Requests** pie chart displays the total number of authorized and denied requests.
    ![A pie chart showing the number of authorized and denied requests in Pomerium Zero](./img/metrics/zero-authorized-and-denied-chart.png)

### Request durations

Request duration measures the amount of time it takes Pomerium to proxy a request in milliseconds. Pomerium Zero provides two request duration charts. 

The first chart organizes requests by duration ranges defined along the x-axis. Pomerium sums the total value of requests within each range and calculates the amount as a percentage value. 

![A chart displaying request duration in Pomerium Zero](./img/metrics/zero-request-duration.png)

The second chart organizes requests by percentile ranges, date, and time.

![A chart displaying request duration in Pomerium Zero](./img/metrics/zero-request-duration-second-chart.png)

### Requests per second

The **Requests per second** chart calculates the average amount of proxied requests per second over the span of an hour. Requests are organized by date and time, and categorized by the following response status codes:

- **200s** (200-299): successful responses  
- **300s** (300-399): redirection messages
- **400s** (400-499): client error responses
- **500s** (500-599): server error responses

![A chart displaying requests per second in Pomerium Zero](./img/metrics/zero-requests-per-second.png)

### Bytes sent and received

The **Bytes sent** and **Bytes received** charts display the average amount of bytes sent and received over the span of an hour.

![A chart displaying bytes sent and received in Pomerium Zero](./img/metrics/zero-bytes-sent-received.png)

## Metrics in Pomerium Enterprise

In Pomerium Enterprise, you must configure metrics before you can view them.  Metrics are not enabled by default, and are not required to run Pomerium Enterprise. See the **Configure Metrics** guide to learn how to enable metrics in your Enterprise deployment.

To learn more about what metrics are supported in Pomerium Enterprise, see the [Reports](/docs/capabilities/reports) capabilities page.