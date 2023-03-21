---
# cSpell:ignore kustomization ingressclass

title: Install
sidebar_label: Install
sidebar_position: 2
description: This article describes installation and customization of the Ingress Controller deployment.
---

Use Pomerium as a first-class secure-by-default Ingress Controller. The Pomerium Ingress Controller enables workflows more native to Kubernetes environments, such as Git-Ops style actions based on pull requests. Dynamically provision routes from Ingress resources and set policy based on annotations. By defining routes as Ingress resources you can independently create and remove them from Pomerium's configuration.

## System requirements

- Kubernetes v1.19.0 or higher, Linux nodes, `amd64` or `arm64` CPU.
- PostgreSQL 11 or higher.
- A certificate management solution, such as [cert-manager](https://cert-manager.io/).

## Deploy

```console
kubectl apply -k github.com/pomerium/ingress-controller/config/default\?ref=v0.20.0
```

The Pomerium Ingress Controller is now installed into your cluster.

:::note

You need complete [Global Configuration](./configure) for Pomerium to become fully operational, before you can [configure Ingress](./ingress).

:::

## Metrics

Pomerium provides a comprehensive set of Prometheus style metrics. Assuming you are running a [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) in your cluster, you may create the following resource to enable metrics collection.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: pomerium
  namespace: pomerium-master-postgres
spec:
  endpoints:
    - port: metrics
  selector:
    matchLabels:
      app.kubernetes.io/instance: pomerium
```

## Advanced

You may adjust your base installation with [`kustomize`](https://kustomize.io/), that is also accessible via the `kubectl apply -k`.

<details>
<summary>Base Installation Summary</summary>

The following resources are created:

1. `pomerium` namespace.
2. `pomerium` deployment.
3. `pomerium-proxy` `Service` of type `LoadBalancer`, provisioning an external IP address, that listens on `:80` and `:443` ports. All HTTP requests are upgraded to HTTP requests.
4. `pomerium-metrics` `Service` of type `ClusterIP`, accessible from within the cluster, exposing `/metrics` Prometheus-style metrics endpoint.
5. `pomerium-gen-secrets` one-time `Job` that generates an initial set of bootstrap secrets, and stores them into the `bootstrap` `Secret`.
6. [Pomerium CRD](./reference) definitions.
7. RBAC rules.

The default manifest may be rebuilt by running the below command in the [`pomerium/ingress-controller`](https://github.com/pomerium/ingress-controller/tree/main/config) repo.

```console
kustomize build config/default
```

</details>

### External-DNS

`external-dns` may be used to automatically update your DNS record for the `Ingress`. The below example adjusts the `pomerium-proxy` service that automatically serves your Authentication URL, so that it's external IP address is up to date in the DNS.

```yaml title="kustomization.yaml"
resources:
  - https://raw.githubusercontent.com/pomerium/ingress-controller/v0.20.0/deployment.yaml
patchesStrategicMerge:
  - patch-proxy-external-dns.yaml
```

```yaml title="patch-proxy-external-dns.yaml"
apiVersion: v1
kind: Service
metadata:
  name: pomerium-proxy
  namespace: pomerium
  annotations:
    external-dns.alpha.kubernetes.io/hostname: 'authenticate.localhost.pomerium.io'
```

### Multiple Replicas

By default, Pomerium deploys with a single replica. You may scale Pomerium instances if necessary by adjusting the default deployment.

:::caution

You must configure [storage persistence](/docs/internals/data-storage) in order to use more then 1 replica of Pomerium.

:::

```yaml title="kustomization.yaml"
resources:
  - https://raw.githubusercontent.com/pomerium/ingress-controller/v0.20.0/deployment.yaml
patchesStrategicMerge:
  - deployment.yaml
```

```yaml title="deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pomerium
  namespace: pomerium
spec:
  replicas: 2
```

### Set Pomerium as default `IngressClass`

An `IngressClass` may be designated as a [default controller](https://kubernetes.io/docs/concepts/services-networking/ingress/#default-ingress-class) for the cluster.

```yaml title="kustomization.yaml"
resources:
  - https://raw.githubusercontent.com/pomerium/ingress-controller/v0.20.0/deployment.yaml
patchesStrategicMerge:
  - patch-proxy-external-dns.yaml
```

```yaml title="patch-ingress-class.yaml"
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: pomerium
  annotations:
    ingressclass.kubernetes.io/is-default-class: 'true'
```

### Multiple controllers

In some cases, you may need to run multiple controllers, see this [community example](https://discuss.pomerium.com/t/kubernetes-ingress-multiple-idp/155/3).

## Runtime parameters

Some parameters are only set by default via command line arguments to the container.

:::caution

Normally, you would not need to adjust the container runtime parameters.

:::

- `debug`: enable debug logging.
- `server-addr`: the address HTTPS server would bind to, `:8443` by default.
- `http-redirect-addr`: the address HTTP to HTTPS redirect server would bind to, `:8080`.
- `metrics-bind-address`: `host:port` exposes Prometheus style metrics.
