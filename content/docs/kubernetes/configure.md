---
# cSpell:ignore wcztn

title: Global Configuration
sidebar_label: Configuration
description: This article describes global configuration options.
---

Once Pomerium is installed into your cluster, you need to complete its global configuration to become fully operational.

Individual routes are configured via [Ingress](./ingress) objects.

## Configuration

While Pomerium distributions for bare-metal installations are configured via a config file and/or environment variables, Pomerium distribution for Kubernetes should be configured via [Pomerium CRD](./reference), that brings the following benefits:

- Supply sensitive parts of the configuration via Kubernetes `Secrets`.
- Seamless configuration updates.
- Configuration validation.
- Centralized place to observe events.
- `/status` endpoint posts `Ingress` status.

The default installation uses [Pomerium Settings CRD](./reference) named `global`. This is a cluster-wide resource. The below is a minimum configuration you need to set up.

```yaml
apiVersion: ingress.pomerium.io/v1
kind: Pomerium
metadata:
  name: global
spec:
  authenticate:
    url: https://authenticate.localhost.pomerium.io
  certificates:
    - pomerium/authenticate-localhost-pomerium-io-prod
  identityProvider:
    provider: google
    secret: pomerium/idp-google
  secrets: pomerium/bootstrap
```

### Bootstrap Secrets

Bootstrap secrets are provisioned via `secrets` property of the [CRD](/docs/kubernetes/ingress#tls-certificates). The default installation would run a one-off Job that would generate them and store into `bootstrap` Secret of the `pomerium` namespace.

### Identity Provider

Integration with your Identity Provider is configured using [`identityProvider`](/docs/identity-providers) parameter.

### Authenticate endpoint

Each Pomerium installation has a special route that unauthenticated users are redirected to that handles sign-in via your Identity Provider. It is configured via the [`authenticate`](/docs/kubernetes/reference#authenticate) parameter of the [CRD](./reference#authenticate).

The authenticate endpoint DNS address should resolve to an external IP address assigned by your Kubernetes Load Balancer to the `pomerium-proxy` service. If you use `external-dns`, that may be [done automatically](#external-dns).

:::note

You should not create a separate Ingress resource for the Authenticate URL.

However, you should provision a matching certificate, and supply it via [`certificates`](./reference#spec) section of the CRD.

:::

### Routes (Ingress)

See a [dedicated Ingress guide](./ingress) for details on how to configure Pomerium to serve Ingress.

### Supported configuration options

All Pomerium features are available in the Kubernetes deployment, except for `autocert`. Use [`cert-manager`](./ingress#cert-manager-integration) or other Kubernetes-native certificate solution instead.

See [Configuration Reference](./reference) for full description of all CRD configuration options.

## Status

Pomerium posts updates about its internal state to the [`/status` section of the `Pomerium CRD`](/docs/kubernetes/ingress#view-event-history).

```console
Name:         global
Namespace:
Labels:       app.kubernetes.io/name=pomerium
API Version:  ingress.pomerium.io/v1
Kind:         Pomerium
 ... some details omitted ...
Spec:
  Authenticate:
    URL:  https://authenticate.localhost.pomerium.io
  Certificates:
    pomerium/authenticate-localhost-pomerium-io-prod
  Identity Provider:
    Provider:  google
    Secret:    pomerium/idp-google
  Secrets:     pomerium/bootstrap
Status:
  Ingress:
    httpbin/httpbin:
      Observed At:          2022-11-18T03:04:23Z
      Observed Generation:  1
      Reconciled:           true
  Settings Status:
    Observed At:          2022-11-18T03:04:23Z
    Observed Generation:  4
    Reconciled:           true
Events:
  Type     Reason      Age   From                                 Message
  ----     ------      ----  ----                                 -------
  Normal   Updated     5s    bootstrap-pomerium-69fcccc487-wcztn  config updated
  Normal   Updated     2s    pomerium-crd                         config updated
  Normal   Updated     2s    pomerium-ingress                     httpbin/httpbin: config updated
```
