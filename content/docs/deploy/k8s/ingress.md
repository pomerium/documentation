---
# cSpell:ignore exampledomain ingressnamespace ingressname

title: Ingress Configuration
sidebar_label: Ingress
lang: en-US
keywords:
  [
    pomerium,
    identity access proxy,
    oidc,
    kubernetes,
    ingress,
    ingress controller,
    reverse proxy,
  ]
pagination_next: null
---

If you've tested Pomerium using the [all-in-one binary](/docs/deploy/core), you're probably familiar with configuring routes in Pomerium's [`config.yaml`](/docs/deploy/core#configuration-file). When using the Pomerium Ingress Controller, each route is defined as an Ingress resource in the Kubernetes API.

## Ingress

The Pomerium Ingress Controller will monitor Ingress resources in the cluster.

- By default, Ingress resources in all namespaces are watched.
- Only resources with a matching `spec.ingressClassName` would be served.
- TLS (HTTPS) is required.

<details>
<summary>Example <code>Ingress</code></summary>
<div>

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: google-dns
    external-dns.alpha.kubernetes.io/hostname: httpbin.localhost.pomerium.io
    ingress.pomerium.io/allow_any_authenticated_user: 'true'
    ingress.pomerium.io/pass_identity_headers: 'true'
  name: httpbin
  namespace: httpbin
spec:
  ingressClassName: pomerium
  rules:
    - host: httpbin.localhost.pomerium.io
      http:
        paths:
          - backend:
              service:
                name: httpbin
                port:
                  name: http
            path: /
            pathType: Prefix
  tls:
    - hosts:
        - httpbin.ingress.localhost.pomerium.io
      secretName: httpbin-localhost-pomerium-io
```

</div>
</details>

### Ingress Class

The default installation adds `pomerium` [IngressClass](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-class) to your cluster. In order for Pomerium to service your Ingress objects, please set `spec.ingressClassName` to `pomerium`.

It is also possible to [set Pomerium to be a default ingress controller](/docs/deploy/k8s/install#set-pomerium-as-default-ingressclass) cluster-wide.

### Annotations

Most configuration keys in non-Kubernetes deployments can be specified as annotation in an Ingress Resource definition. The format is `ingress.pomerium.io/${OPTION_NAME}`.

:::note

Kubernetes object annotations are a **string map** and `Ingress` annotation value has to be a YAML string in quote marks. Pomerium would parse the value of the annotation string to decode the desired format.

<details>
  <summary>Representing JSON objects</summary>
  <div>

Some parameters are objects. Use single quote marks to escape their string representation.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    ingress.pomerium.io/policy: '[{"allow":{"and":[{"email":{"is":"user@yourdomain.com"}}]}}]'
```

Longer single-line JSON strings may be hard to read. You may opt using multi-line YAML strings instead:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: name
  annotations:
    ingress.pomerium.io/policy: |
      - allow:
          or:
            - domain:
                is: pomerium.com
```

  </div>
</details>

:::

The expandable list below contains the annotations available, which behave as described in our reference documentation (with links to the appropriate reference documentation).

<details>
<summary>Pomerium-Standard Annotations</summary>
<div>

- [`ingress.pomerium.io/allow_any_authenticated_user`]
- [`ingress.pomerium.io/allow_public_unauthenticated_access`]
- [`ingress.pomerium.io/allow_spdy`]
- [`ingress.pomerium.io/allow_websockets`]
- [`ingress.pomerium.io/cors_allow_preflight`]
- [`ingress.pomerium.io/host_path_regex_rewrite_pattern`]
- [`ingress.pomerium.io/host_path_regex_rewrite_substitution`]
- [`ingress.pomerium.io/host_rewrite`]
- [`ingress.pomerium.io/host_rewrite_header`]
- [`ingress.pomerium.io/idle_timeout`]
- [`ingress.pomerium.io/outlier_detection`]
- [`ingress.pomerium.io/pass_identity_headers`]
- [`ingress.pomerium.io/policy`]
- [`ingress.pomerium.io/prefix_rewrite`]
- [`ingress.pomerium.io/preserve_host_header`]
- [`ingress.pomerium.io/regex_rewrite_pattern`]
- [`ingress.pomerium.io/regex_rewrite_substitution`]
- [`ingress.pomerium.io/remove_request_headers`]
- [`ingress.pomerium.io/rewrite_response_headers`]
- [`ingress.pomerium.io/set_request_headers`]
- [`ingress.pomerium.io/set_response_headers`]
- [`ingress.pomerium.io/timeout`]
- [`ingress.pomerium.io/tls_server_name`]
- [`ingress.pomerium.io/tls_skip_verify`]

</div>
</details>

The remaining annotations are specific to or behave differently than they do when using Pomerium without the Ingress Controller:

| Annotation | Description |
| --- | --- |
| `ingress.pomerium.io/kubernetes_service_account_token_secret` | Name of a Kubernetes Secret containing a [Kubernetes Service Account Token](/docs/reference/routes/kubernetes-service-account-token) in a `token` key. |
| `ingress.pomerium.io/path_regex` | When set to `"true"` enables path regex matching. See the [Regular Expressions Path Matching](#regular-expressions-path-matching) section for more information. |
| `ingress.pomerium.io/secure_upstream` | When set to `"true"`, use `https` when connecting to the upstream endpoint. |
| `ingress.pomerium.io/set_request_headers_secret` | Name of Kubernetes Secret containing the contents of the request header to send upstream. When used, `ingress.pomerium.io/set_request_headers` should not contain overlapping keys. |
| `ingress.pomerium.io/set_response_headers_secret` | Name of Kubernetes Secret containing the contents of the response header to send downstream. When used, `ingress.pomerium.io/set_response_headers` should not contain overlapping keys. |
| `ingress.pomerium.io/service_proxy_upstream` | When set to `"true"` forces Pomerium to connect to upstream servers through the k8s service proxy, and not individual endpoints. <br/> This is useful when deploying Pomerium inside a service mesh. |
| `ingress.pomerium.io/tcp_upstream` | When set to `"true"`, defines the route as supporting a TCP tunnel. See the [example below](#tcp-endpoints) for more information. |
| `ingress.pomerium.io/tls_client_secret` | Name of Kubernetes `tls` Secret containing a [client certificate][tls_client_certificate] for connecting to the upstream. |
| `ingress.pomerium.io/tls_custom_ca_secret` | Name of Kubernetes `tls` Secret containing a custom [CA certificate][`tls_custom_ca_secret`] for the upstream. |
| `ingress.pomerium.io/tls_downstream_client_ca_secret` | Name of Kubernetes `tls` Secret containing a [Client CA][client-certificate-authority] for validating downstream clients. |
| `ingress.pomerium.io/policy` | [Pomerium Policy Language](/docs/capabilities/ppl) YAML or JSON block (as string) |
| `ingress.pomerium.io/allow_any_authenticated_user` | When set to `"true"`, allows access to any user that was successfully authenticated with your Identity Provider. |
| `ingress.pomerium.io/allow_public_unauthenticated_access` | When set to `"true"`, does not require authentication, grants public access |

### Access Policy Examples

The access policy is applied by adding `ingress.pomerium.io/policy` annotation, containing [Pomerium Policy Language](/docs/capabilities/ppl) YAML or JSON block (as string). Below are some (non-exhaustive) examples.

<table>
<thead>
<th>Annotation</th>
</thead>
<tbody>
<tr><td>

```yaml
ingress.pomerium.io/policy: |
  allow:
    and:
      - domain:
          is: pomerium.com
```

Users with matching email domains would be allowed.

</td></tr>
<tr><td>

```yaml
ingress.pomerium.io/policy: |
  allow:
  and:
    - user:
        is: user1@example.com
    - user:
        is: user2@example.com
```

Users with matching emails would be allowed.

</td></tr>
<tr><td>

```yaml
ingress.pomerium.io/policy: |
  allow:
    and:
      - claim/groups: admin
```

Users with matching claims passed by your Identity Provider would be allowed.

</td></tr>
<tr><td>

```yaml
ingress.pomerium.io/policy: |
  allow:
    and:
    - domain:
        is: example.com
    - claim/groups: admin
```

Users with matching claims and matching domain passed by your Identity Provider would be allowed.

</td></tr>
</tbody>
</table>

### Deterministic Matching

If you have Ingresses with potentially overlapping host/path combinations, Pomerium maintains the following order that would match an incoming request:

1. Ascending by `host`.
2. Descending by `path`.
3. Descending by `regex`.
4. Descending by `prefix`.

This sorting order helps ensure that more restrictive routes for specific paths and regular expressions are applied correctly.

### Regular Expressions Path Matching

You can use a [re2 regular expression] to create an Ingress that matches multiple paths.

1. Set the `path_regex` annotation to `"true"`
1. Set `pathType` to `ImplementationSpecific`
1. Set `path` to an re2 expression matching the full path. It must include the `^/` prefix and `$` suffix. Any query strings should be removed.

:::tip

Check out [this example expression](https://regex101.com/r/IBVUKT/1/) at [regex101.com] for a more detailed explanation and example paths, both matching and not.

:::

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/issuer: example-issuer
    ingress.pomerium.io/policy: |
      allow:
        and:
        - domain:
            is: exampledomain.com
    ingress.pomerium.io/path_regex: 'true'
  name: example
spec:
  ingressClassName: pomerium
  rules:
    - host: example.localhost.pomerium.io
      http:
        paths:
          - backend:
              service:
                name: example
                port:
                  name: http
            path: ^/(admin|superuser)/.*$
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - example.localhost.pomerium.io
      secretName: example-tls
```

### Unsupported features

The following Ingress features are not supported:

- [Default Backend](https://kubernetes.io/docs/concepts/services-networking/ingress/#default-backend)
- [Resource Backend](https://kubernetes.io/docs/concepts/services-networking/ingress/#resource-backend)

## Services

Each Ingress should be backed by a Service. Pomerium supports certain extensions while communicating to Kubernetes services, beyond plaintext HTTP interaction via Service Load Balancer.

### TCP Services

Pomerium is capable of creating secure connections to services like SSH, Databases, and more by creating a TCP tunnel to the service with a local client.

The example route below defines a route providing a tunneled TCP connection to an upstream service listening for non-web traffic. Pomerium provides [command line and GUI](/docs/capabilities/tcp/client#tcp-client-software) clients to interact with the TCP services.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tcp-example
  annotations:
    ingress.pomerium.io/tcp_upstream: 'true'
spec:
  ingressClassName: pomerium
  rules:
    - host: 'tcp.localhost.pomerium.io'
      http:
        paths:
          - pathType: ImplementationSpecific
            backend:
              service:
                name: tcp-service
                port:
                  name: app
```

The important points to note in this example:

- The annotation `ingress.pomerium.io/tcp_upstream:` is set to `"true"`,
- `spec.rules.[].http.paths.[].path` is omitted,
- `spec.rules.[].http.paths.[].pathType` is set to `ImplementationSpecific`,
- `spec.rules.[].host` and `spec.rules.[].paths.[].backend.service.port.name/number` together define the address used when connecting to the route using the [Pomerium Desktop or CLI clients](/docs/capabilities/tcp/client),
- You may apply standard access control annotations to define access restrictions to the service.

:::note

Unlike a standalone Pomerium configuration, you may not create multiple TCP routes using the same hostname with different ports. This limitation was made to avoid confusion, and because additional configuration parameters, such as the Ingress resource, do not allow passing port numbers in the `spec.rules.host` parameter.

:::

### Service Proxy

For performance reasons, by default, Pomerium routes traffic directly to the referenced Service's Endpoints, bypassing Kubernetes service proxy. If you would like to disable this behavior, i.e. you are deploying Pomerium inside a service mesh such as Istio, set the following annotation to the Ingress:

```yaml
ingress.pomerium.io/service_proxy_upstream: 'true'
```

### HAProxy Proxy Protocol

Setting **Use Proxy Protocol** will configure Pomerium to require the [HAProxy proxy protocol](https://www.haproxy.org/download/1.9/doc/proxy-protocol.txt) on incoming connections. Versions 1 and 2 of the protocol are supported.

| **Annotation name**  | **Type**  | **Usage**    | **Default** |
| :------------------- | :-------- | :----------- | :---------- |
| `use_proxy_protocol` | `boolean` | **optional** | `false`     |

To enforce **Use Proxy Protocol**, set the following annotation to the Ingress:

```yaml
ingress.pomerium.io/use_proxy_protocol: 'true'
```

### Load Balancing

Unless you disabled direct traffic to Endpoints, Pomerium would load balance the requests to the upstream endpoints. See the [Load Balancing](/docs/capabilities/load-balancing) guide for details, and use relevant Ingress annotations to fine tune load balancing and health checks.

```yaml
ingress.pomerium.io/lb_policy: 'lb_policy_option'
```

The `lb_policy` has the following options:

| **Load Balancer Policy options** |
| :-- |
| [`ROUND_ROBIN`](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers#weighted-round-robin) (each pod has an equal weight that cannot be customized) |
| [`RING_HASH`](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers#ring-hash) (may be further configured using [`ring_hash_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#config-cluster-v3-cluster-ringhashlbconfig) option) |
| [`LEAST_REQUEST`](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers#weighted-least-request) (may be further configured using [`least_request_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-msg-config-cluster-v3-cluster-leastrequestlbconfig)) |
| [`RANDOM`](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers#random) |
| [`MAGLEV`](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers#maglev) (may be further configured using [`maglev_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-msg-config-cluster-v3-cluster-maglevlbconfig) option) |

You can further configure `lb_policy` with the following OPTIONAL annotations:

| **Annotation name** | **Type** | **Usage** |
| :-- | :-- | :-- |
| [`least_request_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-msg-config-cluster-v3-cluster-leastrequestlbconfig) | `object` | **optional** |
| [`ring_hash_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#config-cluster-v3-cluster-ringhashlbconfig) | `object` | **optional** |
| [`maglev_lb_config`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-msg-config-cluster-v3-cluster-maglevlbconfig) | `object` | **optional** |

For example:

```yaml
ingress.pomerium.io/lb_policy: LEAST_REQUEST
ingress.pomerium.io/least_request_lb_config: '{"choice_count": 2}'
```

See [Envoy documentation](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-enum-config-cluster-v3-cluster-lbpolicy) for more details.

:::note

Kubernetes has its own concept of [readiness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes) for the endpoints. If a pod fails Readiness probe, its Endpoint is removed. Pomerium would detect this change and stop serving traffic to that upstream endpoint. You may use both Pomerium and Kubernetes health checks together.

:::

### Mutual TLS

The Ingress spec assumes that all communications to the upstream service is sent in plaintext. Pomerium supports mutual TLS communication with upstream endpoints.

Annotate your Ingress with

```yaml
ingress.pomerium.io/secure_upstream: 'true'
```

Additional TLS certificates may be supplied by creating a Kubernetes secret(s) in the same namespaces as the Ingress resource. Please note that we do not support file paths or embedded secret references.

- [`ingress.pomerium.io/tls_client_secret`](/docs/reference/routes/tls-client-certificate)
- [`ingress.pomerium.io/tls_custom_ca_secret`](/docs/reference/routes/tls-custom-certificate-authority)
- [`ingress.pomerium.io/tls_downstream_client_ca_secret`](#supported-annotations)

Please note that the referenced `tls_client_secret` must be a [TLS Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets). `tls_custom_ca_secret` and `tls_downstream_client_ca_secret` referenced Secrets must contain `ca.crt` key containing a .PEM encoded (base64-encoded DER format) public certificate.

### External Services

You may refer to external services by defining a [Service](https://kubernetes.io/docs/concepts/services-networking/service/) with `externalName`.

I.e. if you have `https://my-existing-service.corp.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external
spec:
  type: ExternalName
  externalName: 'my-existing-service.corp.com'
  ports:
    - protocol: TCP
      name: https
      port: 443
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: external
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod-http
    ingress.pomerium.io/secure_upstream: 'true'
    ingress.pomerium.io/policy: |
      - allow:
          and:
            - domain:
                is: pomerium.com
spec:
  ingressClassName: pomerium
  tls:
    - hosts:
        - 'external.localhost.pomerium.io'
      secretName: external-localhost-pomerium.io
  rules:
    - host: 'external.localhost.pomerium.io'
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: external
                port:
                  name: https
```

## TLS Certificates

Pomerium expects TLS (HTTPS) for all routes created from the `Ingress` objects.

HTTP requests would be automatically redirected to the HTTPS port.

Pomerium certificates may be supplied individually per-Ingress via `spec.tls`, defined globally in the CRD via [`certificates`](/docs/reference/certificates), or both.

### `spec.tls`

Pomerium load use certificates referenced by the `spec.tls` section of the `Ingress`. For more information, see the [TLS](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls) section of the Ingress API documentation.

### Global Certs

You may provide [`certificates`](/docs/reference/certificates) as part of the global Pomerium configuration. This may be useful if you i.e. have a wildcard certificate.

### cert-manager Integration

Pomerium Ingress Controller can use [cert-manager](https://cert-manager.io/) to automatically provision certificates. These may come from the [ingress-shim](https://cert-manager.io/docs/usage/ingress/) or explicitly configured [`Certificate` resources](https://cert-manager.io/docs/usage/certificate/).

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/issuer: example-issuer
    ingress.pomerium.io/policy: '[{"allow":{"and":[{"email":{"is":"user@exampledomain.com"}}]}}]'
  name: example
spec:
  ingressClassName: pomerium
  rules:
    - host: example.localhost.pomerium.io
      http:
        paths:
          - backend:
              service:
                name: example
                port:
                  name: http
            path: /
            pathType: Prefix
  tls:
    - hosts:
        - example.localhost.pomerium.io
      secretName: example-tls
```

To use [HTTP01 Challenges](https://cert-manager.io/docs/configuration/acme/http01/) with your [Issuer](https://cert-manager.io/docs/concepts/issuer/), configure the solver class to match the Ingress Controller. The Pomerium Ingress Controller will automatically configure policy to facilitate the HTTP01 challenge:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
      - http01:
          ingress:
            class: pomerium
```

## Metrics

Pomerium [exposes](/docs/deploy/k8s/install#metrics) a number of Prometheus style metrics that you may use to monitor your Ingress.

In order to filter out metrics for a particular Ingress, use `envoy_cluster_name` metric label, that has a `ingressnamespace-ingressname-host-domain-com` format.

See [Envoy Cluster Stats](https://www.envoyproxy.io/docs/envoy/latest/configuration/upstream/cluster_manager/cluster_stats) for details on individual metrics.

## Troubleshooting

### View Event History

Pomerium Ingress Controller will add **events** to the Ingress objects as it processes them, and updates the status section of [Pomerium CRD](./reference).

```bash
kubectl describe pomerium/global
```

```log
Name:         global
Namespace:
Labels:       <none>
Annotations:  <none>
API Version:  ingress.pomerium.io/v1
Kind:         Pomerium
Metadata:
  Creation Timestamp:  2022-07-14T21:43:08Z
  Generation:          5
  Resource Version:  1507973
  UID:               9c7e56ab-e74c-492c-945d-5db1cd6582b0
Spec:
  Authenticate:
    URL:  https://login.localhost.pomerium.io
  Certificates:
    pomerium/wildcard-localhost
  Identity Provider:
    Provider:  google
    Secret:    pomerium/idp
  Secrets:     pomerium/bootstrap
  Storage:
    Postgres:
      Secret:  pomerium/postgres
Status:
  Ingress:
    pomerium/httpbin:
      Observed At:          2022-07-29T13:01:37Z
      Observed Generation:  1
      Reconciled:           true
  Settings Status:
    Observed At:          2022-07-27T18:44:43Z
    Observed Generation:  5
    Reconciled:           true
Events:
  Type    Reason   Age   From              Message
  ----    ------   ----  ----              -------
  Normal  Updated  43m   pomerium-ingress  pomerium/httpbin: config updated
```

Additionally, events are posted to the individual `Ingress` objects.

```bash
kubectl describe ingress/my-ingress
```

```log
Events:
  Type    Reason   Age   From              Message
  ----    ------   ----  ----              -------
  Normal  Updated  18s   pomerium-ingress  updated pomerium configuration
```

If an error occurs, it may be reflected in the events:

```log
Events:
  Type     Reason       Age                 From              Message
  ----     ------       ----                ----              -------
  Normal   Updated      5m53s               pomerium-ingress  updated pomerium configuration
  Warning  UpdateError  3s                  pomerium-ingress  upsert routes: parsing ingress: annotations: applying policy annotations: parsing policy: invalid rules in policy: unsupported conditional "maybe", only and, or, not, nor and action are allowed
```

### Logs

```console
kubectl logs deployment/pomerium
```

Pomerium assigns a unique `request-id` that is also set in the response headers. Filter by `request-id` to see access and authorization logs for a particular request.

Pomerium produces an access log entry for each request. Filter by `"service":"envoy"`.

Pomerium performs authorization check for each and every request. Filter by `"service":"authorize"`. See [Authorization Log Keys](/docs/capabilities/audit-logs#authorization-log-keys).

### HSTS

If your domain has [HSTS] enabled and you visit an endpoint while Pomerium is using the self-signed bootstrap certificate or a LetsEncrypt staging certificate (before cert-manager has provisioned a production certificate), the untrusted certificate may be pinned in your browser and would need to be reset. See [this article](https://www.ssl2buy.com/wiki/how-to-clear-hsts-settings-on-chrome-firefox-and-ie-browsers) for more information.

## More Information

For more information on the Pomerium Ingress Controller or the Kubernetes concepts discussed, see:

- [Ingress (Kubernetes Docs)](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [Pomerium Kubernetes Ingress Controller (code repository)](https://github.com/pomerium/ingress-controller)

[`ingress.pomerium.io/allow_any_authenticated_user`]: /docs/reference/routes/allow-any-authenticated-user
[`ingress.pomerium.io/allow_public_unauthenticated_access`]: /docs/reference/routes/public-access
[`ingress.pomerium.io/allow_spdy`]: /docs/reference/routes/spdy
[`ingress.pomerium.io/allow_websockets`]: /docs/reference/routes/websocket-connections
[`ingress.pomerium.io/cors_allow_preflight`]: /docs/reference/routes/cors-preflight
[`ingress.pomerium.io/health_checks`]: /docs/reference/health-checks
[`ingress.pomerium.io/host_path_regex_rewrite_pattern`]: /docs/reference/routes/host-rewrite
[`ingress.pomerium.io/host_path_regex_rewrite_substitution`]: /docs/reference/routes/host-rewrite
[`ingress.pomerium.io/host_rewrite_header`]: /docs/reference/routes/host-rewrite
[`ingress.pomerium.io/host_rewrite`]: /docs/reference/routes/host-rewrite
[`ingress.pomerium.io/idle_timeout`]: /docs/reference/routes/idle-timeout
[`ingress.pomerium.io/lb_config`]: /docs/reference/load-balancing-policy-config
[`ingress.pomerium.io/outlier_detection`]: /docs/reference/routes/outlier-detection
[`ingress.pomerium.io/pass_identity_headers`]: /docs/reference/routes/pass-identity-headers
[`ingress.pomerium.io/policy`]: /docs/reference/routes/policy
[`ingress.pomerium.io/prefix_rewrite`]: /docs/reference/routes/prefix-rewrite
[`ingress.pomerium.io/preserve_host_header`]: /docs/reference/routes/host-rewrite
[`ingress.pomerium.io/regex_rewrite_pattern`]: /docs/reference/routes/regex-rewrite
[`ingress.pomerium.io/regex_rewrite_substitution`]: /docs/reference/routes/regex-rewrite
[`ingress.pomerium.io/remove_request_headers`]: /docs/reference/routes/remove-request-headers
[`ingress.pomerium.io/rewrite_response_headers`]: /docs/reference/routes/rewrite-response-headers
[`ingress.pomerium.io/set_request_headers`]: /docs/reference/routes/set-request-headers
[`ingress.pomerium.io/set_response_headers`]: /docs/reference/set-response-headers
[`ingress.pomerium.io/timeout`]: /docs/reference/routes/route-timeout
[`ingress.pomerium.io/tls_upstream_server_name`]: /docs/reference/routes/tls-upstream-server-name
[`ingress.pomerium.io/tls_downstream_server_name`]: /docs/reference/routes/tls-downstream-server-name
[`ingress.pomerium.io/tls_skip_verify`]: /docs/reference/routes/tls-skip-verification
[`tls_custom_ca_secret`]: /docs/reference/routes/tls-custom-certificate-authority
[client-certificate-authority]: /docs/reference/certificates
[hsts]: https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security
[re2 regular expression]: https://github.com/google/re2/wiki/Syntax
[regex101.com]: https://regex101.com
[tls_client_certificate]: /docs/reference/routes/tls-client-certificate
