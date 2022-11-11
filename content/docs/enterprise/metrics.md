---
title: Configure Metrics
sidebar_label: Metrics
description: Use Prometheus as a metrics data store.
---

Pomerium Enterprise uses Prometheus as a metrics collection back-end. You can configure Pomerium and the Console to talk to an existing Prometheus server, or configure the embedded Prometheus backend. This guide assumes you're running both Pomerium and Pomerium Enterprise on localhost `127.0.0.1`.

:::tip
For production deployments, we suggest using a dedicated Prometheus instance.
:::

## Prepare Pomerium

1. In the Pomerium `pomerium-config.yaml`, define the [`metrics_address`](/docs/reference/metrics-address) key to a network interface and/or port. For example:

   ```yaml title="pomerium-config.yaml"
   metrics_address: 127.0.0.1:9091
   ```

   The example above has Pomerium providing metrics at port `9999` on an IP address reachable by the Pomerium Console service.

   If you're running Pomerium Enterprise in a distributed environment where the IP address is not known at the time of deployment, you can use the resolvable FQDN of the Pomerium host (`pomerium0.internal.mycompany.com`, for example), or override this key with the environment variable `METRICS_ADDRESS`. We do not recommend exposing this endpoint to public traffic as it can contain potentially sensitive information.

1. In the Pomerium Enterprise `pomerium-enterprise-config.yaml`, define the `metrics_address` key to a network interface and/or port. For example: 

   ```yaml title="config.yaml"
   metrics_addres: 127.0.0.1:9092
   ```

## External Prometheus

1. Add the listener to your Prometheus configuration, usually via `prometheus.yml`:

   ```yaml
   - job_name: 'Pomerium'
      scrape_interval: 30s
      scrape_timeout: 5s
      static_configs:
         - targets: ['127.0.0.1:9901']
   - job_name: 'Pomerium Enterprise'
      scrape_interval: 30s
      scrape_timeout: 5s
      static_configs:
         - targets: ['127.0.0.1:9902']

   ```

1. [Reload](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration) the Prometheus configuration:

   ```bash
   curl -i -XPOST path.to.prometheus:port/-/reload
   ```

1. In the Pomerium Enterprise `config.yaml` file, define the `prometheus_url` key to point to your Prometheus instance(s):

   ```yaml
   prometheus_url: http://192.168.122.50:9090
   ```

2. Restart the Pomerium and Pomerium Enterprise services. You should now see route traffic and External Data Source monitoring data in the Enterprise Console:

   ![Traffic Data in Pomerium Enterprise](img/console-route-traffic.png)
   ![External Data Source in Pomerium Enterprise](img/console-ext-datasource-monitoring.png)

## Embedded Prometheus

To take advantage of Prometheus embedded in Pomerium Enterprise, edit Pomerium Console's config file:

```yaml title="config.yaml"
prometheus_data_dir: /var/lib/pomerium-console/tsdb
```

The directory path can be any location that the `pomerium` system user can write to. The example above uses the default location created by the [OS packages](/docs/enterprise/install/quickstart).
