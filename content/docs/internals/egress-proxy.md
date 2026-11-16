---
title: 'Egress Proxy'
sidebar_label: 'Egress Proxy'
description: 'Send Pomerium outbound traffic through an HTTP egress proxy with HTTP_PROXY, HTTPS_PROXY and NO_PROXY, and switch proxies without restarting Pomerium.'
keywords:
  [
    pomerium,
    egress proxy,
    forward proxy,
    http_proxy,
    https_proxy,
    no_proxy,
    kubernetes,
    endpointslice,
  ]
lang: en-US
---

# Egress Proxy

If your network only allows outbound traffic through an HTTP proxy, point Pomerium at it with the standard `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables. Pomerium Core, Pomerium Zero and the Pomerium Ingress Controller all read these variables. No Pomerium setting is needed.

This page covers:

- which Pomerium traffic uses the proxy
- the variable format
- how to switch to a different proxy without restarting Pomerium

## Which traffic uses the proxy

| Traffic | Uses the proxy |
| --- | --- |
| Calls to your identity provider: discovery, signing keys, code exchange at sign-in, token refresh | Yes |
| Calls to the Pomerium-hosted authenticate service (`authenticate.pomerium.app`) | Yes |
| gRPC between Pomerium services on non-loopback addresses, such as a separate databroker | Yes, through `HTTPS_PROXY` |
| Ingress Controller calls to the Kubernetes API server | Yes |
| Requests from Pomerium to route upstreams (the `to` URLs) | No. Envoy sends these and doesn't read the variables |
| Users' browser traffic | No |
| Connections to `localhost` and loopback addresses | No |

`NO_PROXY` can exclude any destination marked **Yes**. Exclude the internal addresses Pomerium talks to, such as a separate databroker or the Kubernetes API server, unless your proxy can reach them.

## Variable format

```shell
HTTP_PROXY=http://proxy.example.com:3128
HTTPS_PROXY=http://proxy.example.com:3128
NO_PROXY=localhost,.example.internal,10.0.0.0/8
```

- **`HTTPS_PROXY`** is used for `https://` destinations. Pomerium opens a `CONNECT` tunnel through the proxy, so TLS runs end to end with the destination.
- **`HTTP_PROXY`** is used for `http://` destinations. `HTTPS_PROXY` never falls back to it, so set both.
- **The proxy URL** has the form `[scheme://][user:password@]host[:port]`. The scheme can be `http`, `https` (TLS to the proxy itself) or `socks5`. Without a scheme, `http` is assumed.
- **The proxy host** can be a hostname or an IP address. Write IPv6 addresses in brackets: `http://[2001:db8::10]:3128`.
- **Uppercase names** take precedence over lowercase ones (`https_proxy`, `no_proxy`).
- **Pomerium reads the variables once, at startup.** Changing them requires a restart. To switch proxies without a restart, change what the proxy hostname points to instead (see below).
- **An invalid proxy URL is ignored silently,** and traffic then goes out directly.

`NO_PROXY` is a comma-separated list of destinations that bypass the proxy:

| Entry                             | Matches                                 |
| --------------------------------- | --------------------------------------- |
| `example.com`                     | `example.com` and all of its subdomains |
| `.example.com` or `*.example.com` | subdomains of `example.com` only        |
| `example.com:8443`                | that host on that port only             |
| `10.0.0.0/8`, `fd00::/8`          | destination IP addresses in the range   |
| `192.0.2.10`, `[2001:db8::1]:443` | that IP address, optionally on one port |
| `*`                               | every destination; disables the proxy   |

`NO_PROXY` applies to the destination of each request, never to the proxy's own address. IP and CIDR entries only match destinations given as IP addresses, never hostnames that resolve to those addresses.

## Switch proxies without restarting Pomerium

Pomerium resolves the proxy hostname each time it opens a new connection to the proxy. If the proxy variables use a hostname, you can switch to a different proxy by changing what that hostname points to.

### In Kubernetes

Put the proxy behind a Service with no selector, and manage its EndpointSlice yourself. The Service name never changes, and you switch proxies by editing the EndpointSlice.

**1. Create a Service and an EndpointSlice for the proxy**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: egress-proxy
  namespace: pomerium
spec:
  ports:
    - name: proxy
      port: 3128 # port Pomerium connects to
---
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: egress-proxy-1
  namespace: pomerium
  labels:
    kubernetes.io/service-name: egress-proxy # links the slice to the Service
    endpointslice.kubernetes.io/managed-by: manual # tells Kubernetes not to manage it
addressType: IPv4 # IPv4 or IPv6, matching the proxy's address
ports:
  - name: proxy # must match the Service port name
    port: 3128 # real port of the proxy
endpoints:
  - addresses: ['192.0.2.10'] # current proxy address
```

Kubernetes uses an EndpointSlice only if its `addressType` matches the Service's IP family. By default, the Service gets the cluster's primary IP family. To use an IPv6 proxy in a cluster whose primary family is IPv4, set the family on the Service:

```yaml
spec:
  ipFamilyPolicy: SingleStack
  ipFamilies: [IPv6] # same as the EndpointSlice addressType
```

Create the Service and EndpointSlice before you point Pomerium at them. For the first few seconds after a Service is created, connections to it are refused, until kube-proxy has set up its rules.

**2. Point Pomerium at the Service name**

Set the variables on the Pomerium container. For the Ingress Controller, that's the `pomerium` container of its Deployment:

```yaml
env:
  - name: HTTP_PROXY
    value: http://egress-proxy.pomerium.svc.cluster.local:3128
  - name: HTTPS_PROXY
    value: http://egress-proxy.pomerium.svc.cluster.local:3128
  - name: NO_PROXY
    value: localhost,.svc.cluster.local,10.96.0.0/12 # replace 10.96.0.0/12 with your Service CIDR
```

The proxy's own `.svc.cluster.local` name doesn't need to be left out of `NO_PROXY`, because `NO_PROXY` applies only to destinations.

Add your cluster's Service CIDR to `NO_PROXY`, or at least the Kubernetes API server's address (`KUBERNETES_SERVICE_HOST`). The Ingress Controller reaches the API server by IP address, and `.svc.cluster.local` doesn't match an IP address. Without the CIDR, the controller's Kubernetes API traffic goes through the egress proxy, which then has to reach the API server's in-cluster address. A proxy outside the cluster often can't.

**3. Switch to a different proxy**

Update the address in the existing EndpointSlice:

```shell
kubectl -n pomerium patch endpointslice egress-proxy-1 --type=json \
  -p '[{"op":"replace","path":"/endpoints/0/addresses/0","value":"192.0.2.20"}]'
```

### What to expect when you switch

- **New connections switch within a second or two,** as soon as kube-proxy updates its forwarding rules. DNS isn't involved: the Service name keeps resolving to the same ClusterIP, so DNS caching and TTLs don't delay the switch.
- **Idle connections switch after about 90 seconds.** Open connections stay on the old proxy until they close. Pomerium closes idle connections, such as those to your identity provider, after about 90 seconds without use. The next request then goes through the new proxy.
- **Busy connections switch only when the old proxy closes them.** Connections that are never idle, such as the Ingress Controller's Kubernetes API watch when `NO_PROXY` doesn't exclude it, stay on the old proxy. To move all traffic at once, shut down or drain the old proxy after the switch, and Pomerium reconnects through the new one. A graceful proxy shutdown waits for open connections first. Squid, for example, waits up to 30 seconds by default (`shutdown_lifetime`).
- **Empty EndpointSlices refuse connections.** Change the existing EndpointSlice in place, as above, rather than deleting and recreating it.
- **Endpoints you add by hand aren't health-checked.** If the proxy goes down, traffic keeps going to it until you update the EndpointSlice.

### Alternatives in Kubernetes

- **An ExternalName Service** (`type: ExternalName`) works if the proxy already has a DNS name. It takes only DNS names, not IP addresses. Switching means updating that DNS record, and Pomerium follows the change after the record's TTL expires.
- **A headless Service** (`clusterIP: None`) with the same EndpointSlice also works. Switches take effect only after the cluster DNS TTL expires; CoreDNS uses 5 seconds by default. That TTL applies to the whole cluster and can't be set per Service. The ClusterIP Service above avoids this delay.

### Outside Kubernetes

Give the proxy a DNS name, use that name in the proxy variables, and update the DNS record to switch proxies. Pomerium doesn't cache DNS answers itself, but the record's TTL and any local resolver cache delay the switch. Open connections behave as described above.

## Check which proxy is in use

Many proxies, including Squid, log an HTTPS (`CONNECT`) request only when its connection closes. Pomerium keeps these connections open for reuse, so a request can be missing from the old proxy's log for a while, or appear there after the switch. To see what's going through a proxy right now, look at its list of open connections rather than its access log.
