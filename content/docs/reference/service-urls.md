---
title: Service URLs
id: service-urls
description: This page covers all of Pomerium's service URL settings, including authenticate and authorize external and internal service URLs.
keywords:
  - authenticate service url
  - authenticate internal service url
  - authenticate_service_url
  - authenticate_internal_service_url
  - authorize service url
  - authorize_service_url
  - authorize internal service url
  - authorize_internal_service_url
pagination_prev: null
pagination_next: null
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PomeriumAuthenticateServices from '@site/content/docs/admonitions/_pomerium-authenticate-services.mdx';

# Service URLs

## Authenticate Service URL

The **Authenticate Service URL** setting defines the externally accessible URL where Pomerium redirects end users (clients) to authenticate against an identity provider.

If you're running Pomerium in [split service mode](/docs/internals/configuration#all-in-one-vs-split-service-mode), each Pomerium Core service (except the Databroker service) requires the authenticate service URL in its configuration file, either as a config file key or environment variable. These services include the Proxy, Authenticate, and Authorize services.

:::info

<PomeriumAuthenticateServices />

:::

### How to configure

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `authenticate_service_url` | `AUTHENTICATE_SERVICE_URL` | `URL` | \***optional** |

\* Excluding the `authenticate_service_url` defaults to the Hosted Authenticated service. 

### Examples

```yaml
authenticate_service_url: https://authenticate.corp.example.com
```

```bash
AUTHENTICATE_SERVICE_URL=https://authenticate.corp.example.com
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`authenticate_service_url` is a bootstrap configuration setting and is not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

| **[Parameter name](/docs/k8s/reference#spec** | **Type** | **Usage**    |
| :-------------------------------------------- | :------- | :----------- |
| `authenticate.url`                            | `URL`    | \***optional** |

\* Excluding the `authenticate.url` defaults to the Hosted Authenticated service. 

### Examples

```yaml
authenticate:
  url: https://authenticate.corp.example.com
```

See the [Kubernetes - Global Configuration](/docs/k8s/configure) for more information.

</TabItem>
</Tabs>

## Authenticate Internal Service URL

The **Authenticate Internal Service URL** setting defines the internally accessible URL where Pomerium redirects end users (clients) to authenticate against an identity provider. 

When running in [split service mode](/docs/internals/configuration#all-in-one-vs-split-service-mode), each Pomerium Core service requires an authenticate service URL to communicate with other Pomerium services. In deployments where accessing an external URL is not possible (or not preferable), you can instead use the authenticate internal service URL.    

Each Pomerium Core service (except the Databroker service) requires the authenticate internal service URL in its configuration file, either as a config file key or environment variable. These services include the Proxy, Authenticate, and Authorize services.

If defined, the authenticate internal service URL overrides the [authenticate service URL](#authenticate-service-url). 

### How to configure

<Tabs>
<TabItem label="Core" value="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `authenticate_internal_service_url` | `AUTHENTICATE_INTERNAL_SERVICE_URL` | `URL` | \***optional** |

\* Excluding the `authenticate_internal_service_url` defaults to the Hosted Authenticated service.

### Examples

```yaml
authenticate_internal_service_url: https://authenticate.internal
```

```bash
AUTHENTICATE_INTERNAL_SERVICE_URL=https://authenticate.internal
```

</TabItem>
<TabItem label="Enterprise" value="Enterprise">

`authenticate_internal_service_url` is a bootstrap configuration setting and is not configurable in the Console.

</TabItem>
<TabItem label="Kubernetes" value="Kubernetes">

Kubernetes does not support `authenticate_internal_service_url`

</TabItem>
</Tabs>

## Authorize Service URL

The **Authorize Service URL** setting defines the location of Pomerium's internally accessible Authorize Service.

:::note

Unlike the Authenticate Service, the Authorize Service has no publicly accessible HTTP handlers, so this setting is purely for gRPC communication.

If your load balancer does not support gRPC pass-through, you must set this value to an **internally** routable location (`https://pomerium-authorize-service.default.svc.cluster.local`) instead of an **externally** routable one (`https://authorize.corp.example.com`).

:::

### How to configure

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `authorize_service_url` | `AUTHORIZE_SERVICE_URL` | `URL` | **required** (Inferred in all-in-one mode to be localhost) |
| `authorize_service_urls` | `AUTHORIZE_SERVICE_URLS` | `URL` | **required** (Inferred in all-in-one mode to be localhost) |

### Examples

You can specify multiple URLs as an array with `authorize_service_urls`:

```yaml
authorize_service_urls:
  - https://localhost:5443
  - https://authorize.corp.example.com
```

```bash
AUTHORIZE_SERVICE_URL=https://pomerium-authorize-service.default.svc.cluster.local
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`authorize_service_url/s` is a bootstrap configuration setting and is not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

The `authorize_service_url` is not customizable in all-in-one mode with the CRD

</TabItem>
</Tabs>

## Authorize Internal Service URL

The **Authorize Internal Service URL** setting is only required for [split-service mode](/docs/internals/configuration#all-in-one-vs-split-service-mode) deployments where Pomerium can’t access the public [**Authorize Service URL**](/docs/reference/authorize-service-url).

If defined, **Authorize Internal Service URL** overrides the [Authorize Service URL](#authorize-service-url).

### How to configure

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `authorize_internal_service_url` | `AUTHORIZE_INTERNAL_SERVICE_URL` | `URL` | **required** (Inferred in all-in-one mode to be localhost) |

### Examples

```yaml
authorize_internal_service_url: https://pomerium-authorize-service.default.svc.cluster.local
```

```bash
AUTHORIZE_INTERNAL_SERVICE_URL=https://localhost:5443
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`authorize_internal_service_url` is a bootstrap configuration setting and is not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

Kubernetes does not support `authorize_internal_service_url`

</TabItem>
</Tabs>
