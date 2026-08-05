---
# cSpell:ignore kustomization ingressclass

title: Installation
sidebar_label: Installation
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
kubectl apply -k github.com/pomerium/ingress-controller/config/default\?ref=0-33-0
```

The Pomerium Ingress Controller is now installed into your cluster.

:::note

You need complete [Global Configuration](./configure) for Pomerium to become fully operational, before you can [configure Ingress](./ingress).

:::

## Deployment variants

`config/default` is the standard install, but it is not the only one. Each path below is a complete kustomization you can apply directly in place of `config/default`, or reference as a base in your own `kustomization.yaml`.

| Path | Description |
| --- | --- |
| `config/default` | Controller and Pomerium core, CRDs, RBAC, and the bootstrap secrets job. The standard install. |
| `config/default-no-crd` | `default` without the CRD definitions, for when the CRDs are installed and owned separately — a dedicated Argo CD Application, Terraform, or a cluster admin — so the two do not compete over the schema. |
| `config/gateway-api` | `default` plus a `GatewayClass` and the `--experimental-gateway-api` flag. See [Gateway API](./gateway-api). |
| `config/clustered-databroker` | Replaces the `pomerium` `Deployment` with a `StatefulSet` and adds a `pomerium-headless` `Service`, so the built-in databroker can run clustered across replicas. |
| `config/clustered-databroker-no-crd` | The clustered databroker variant, without the CRD definitions. |
| `config/http3-eks` | `default` with the `pomerium-proxy` service configured for HTTP/3 on an AWS Network Load Balancer. |
| `config/http3-gke` | `default` with the `pomerium-proxy` service configured for HTTP/3 on a GKE regional external load balancer. |
| `config/ssh` | `default` with the SSH listener enabled on port `4022`. |

For example, to install the Gateway API variant:

```console
kubectl apply -k github.com/pomerium/ingress-controller/config/gateway-api\?ref=0-33-0
```

:::note

Always pin `?ref=` to a version branch such as `0-33-0` rather than `main`, so that your installs are reproducible and you upgrade deliberately.

:::

## Metrics

Pomerium provides a comprehensive set of Prometheus style metrics. Assuming you are running a [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) in your cluster, you may create the following resource to enable metrics collection.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: pomerium
  namespace: pomerium
spec:
  endpoints:
    - port: metrics
  selector:
    matchLabels:
      app.kubernetes.io/name: pomerium
```

## Advanced

You may adjust your base installation with [`kustomize`](https://kustomize.io/), that is also accessible via the `kubectl apply -k`.

<details>
<summary>Base Installation Summary</summary>

The following resources are created:

1. `pomerium` namespace.
2. `pomerium` deployment.
3. `pomerium-proxy` `Service` of type `LoadBalancer`, provisioning an external IP address, that listens on `:80` and `:443` ports. All HTTP requests are upgraded to HTTPS requests.
4. `pomerium-metrics` `Service` of type `ClusterIP`, accessible from within the cluster, exposing `/metrics` Prometheus-style metrics endpoint.
5. `pomerium-gen-secrets` one-time `Job` that generates an initial set of bootstrap secrets, and stores them into the `bootstrap` `Secret`.
6. `pomerium` `IngressClass`, with the `pomerium.io/ingress-controller` controller.
7. [Pomerium CRD](./reference) definitions.
8. RBAC rules.

You may render this set of resources to a flat manifest — to inspect it, to review it in a pull request, or to feed a pipeline that does not run `kustomize` itself — with [`kustomize`](https://kustomize.io/) directly against the [`pomerium/ingress-controller`](https://github.com/pomerium/ingress-controller/tree/main/config) repo:

```console
kustomize build github.com/pomerium/ingress-controller/config/default\?ref=0-33-0
```

</details>

### External-DNS

`external-dns` may be used to automatically update your DNS record for the `Ingress`. The below example adjusts the `pomerium-proxy` service that automatically serves your Authentication URL, so that it's external IP address is up to date in the DNS.

```yaml title="kustomization.yaml"
resources:
  - github.com/pomerium/ingress-controller/config/default?ref=0-33-0
patches:
  - path: patch-proxy-external-dns.yaml
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
  - github.com/pomerium/ingress-controller/config/default?ref=0-33-0
patches:
  - path: patch-replicas.yaml
```

```yaml title="patch-replicas.yaml"
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
  - github.com/pomerium/ingress-controller/config/default?ref=0-33-0
patches:
  - path: patch-ingress-class.yaml
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

### Expose Envoy Admin interface

Make sure to always restrict access to the envoy admin interface ingress.

```yaml title="kustomization.yaml"
resources:
  - github.com/pomerium/ingress-controller/config/default?ref=0-33-0
  - admin-service.yaml
  - admin-ingress.yaml
patches:
  - patch: |-
      - op: add
        path: /spec/template/spec/containers/0/args/-
        value: "--debug-admin-addr=localhost:9901"
    target:
      kind: Deployment
      name: pomerium
```

```yaml title="admin-service.yaml"
apiVersion: v1
kind: Service
metadata:
  name: envoy
spec:
  type: ExternalName
  externalName: 'localhost'
  ports:
    - protocol: TCP
      name: admin
      port: 9901
```

```yaml title="admin-ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: envoy
spec:
  ingressClassName: pomerium
  rules:
    - host: 'envoy.localhost.pomerium.io'
      http:
        paths:
          - pathType: Prefix
            path: /
            backend:
              service:
                name: envoy
                port:
                  name: admin
```

## Runtime parameters

Some parameters are only set by default via command line arguments to the container.

:::caution

Normally, you would not need to adjust the container runtime parameters.

:::

- `debug`: enable debug logging.
- `server-addr`: the address HTTPS server would bind to, `:8443` by default.
- `http-redirect-addr`: the address HTTP to HTTPS redirect server would bind to, `:8080`.
- `metrics-bind-address`: `host:port` exposes Prometheus style metrics.
- `debug-admin-addr`: `localhost:port` exposes Envoy admin interface.
