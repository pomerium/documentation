---
title: Service URL Settings
id: service-urls
description: This page covers all of Pomerium's service URL settings, including authenticate, authorize, and databroker external and internal service URLs.
keywords:
  - authenticate service url
  - authenticate_service_url
  - authenticate-service-url
  - authenticate internal service url
  - authenticate_internal_service_url
  - authenticate-internal-service-url
  - authorize service url
  - authorize_service_url
  - authorize-service-url
  - authorize internal service url
  - authorize_internal_service_url
  - authorize-internal-service-url
  - databroker service url
  - databroker_service_url
  - databroker-service-url
  - databroker internal service url
  - databroker_internal_service_url
  - databroker-internal-service-url
pagination_prev: null
pagination_next: null
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import PomeriumAuthenticateServices from '@site/content/docs/admonitions/\_pomerium-authenticate-services.mdx';

# Service URL Settings

Pomerium's service URL settings control how the different [Pomerium services](/docs/internals/architecture#component-level) communicate with each other.

The [authenticate service URL](#authenticate-service-url) setting also controls whether Pomerium will run its own authenticate service or use the [Hosted Authenticate Service](/docs/capabilities/hosted-authenticate-service).

The other service URL settings are needed only for split service deployments. When running in all-in-one mode (which is the recommended mode), these settings are not needed.

## Authenticate Service URL

The **Authenticate Service URL** setting defines the externally accessible URL where Pomerium redirects end users (clients) to authenticate against an identity provider.

If not set, Pomerium will use the [Hosted Authenticate Service](/docs/capabilities/hosted-authenticate-service).

If you prefer to use your own [identity provider](/docs/identity-providers), you'll need to set an authenticate service URL, and you will need this URL when configuring your identity provider client's OAuth callback URL.

If Pomerium is running in [split-service mode](/docs/internals/configuration#all-in-one-vs-split-service-mode), each Pomerium service requires the authenticate service URL in its configuration.

:::info

<PomeriumAuthenticateServices />

:::

### How to configure

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `authenticate_service_url` | `AUTHENTICATE_SERVICE_URL` | `URL` | **optional** |

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

| **[Parameter name](/docs/deploy/k8s/reference#spec** | **Type** | **Usage** |
| :-- | :-- | :-- |
| `authenticate.url` | `URL` | **optional** |

### Examples

```yaml
authenticate:
  url: https://authenticate.corp.example.com
```

See the [Kubernetes - Global Configuration](/docs/deploy/k8s/configure#authenticate-endpoint) for more information.

</TabItem>
</Tabs>

## Authenticate Internal Service URL

The **Authenticate Internal Service URL** setting is only required for split-service mode deployments where Pomerium can't access the public Authenticate Service URL.

If set, the Authenticate Internal Service URL will be used for communication between other Pomerium services and the authenticate service.

### How to configure

<Tabs>
<TabItem label="Core" value="Core">

| **Config file keys** | **Environment variables** | **Type** | **Usage** |
| :-- | :-- | :-- | :-- |
| `authenticate_internal_service_url` | `AUTHENTICATE_INTERNAL_SERVICE_URL` | `URL` | \***optional** |

\* Excluding the `authenticate_internal_service_url` defaults to the [hosted authenticated service](/docs/capabilities/hosted-authenticate-service) if `authenticate_service_url` isn't defined.

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

You can specify multiple URLs as an array with the `authorize_service_urls` key:

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

The **Authorize Internal Service URL** setting is only required for split-service mode deployments where Pomerium can't access the public Authorize Service URL.

If included, Authorize Internal Service URL will override Authorize Service URL.

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

## Databroker Service URL {#databroker-service-url}

The **Databroker Service URL** settings points to a databroker which is responsible for storing associated authorization context (for example, sessions, users, and user groups).

### How to configure {#databroker-service-url-how-to-configure}

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Default** |
| :-- | :-- | :-- | :-- |
| `databroker_service_url` | `DATABROKER_SERVICE_URL` | `URL` | `http://localhost:5443` (In [all-in-one mode](/docs/internals/configuration#all-in-one-vs-split-service-mode)) |
| `databroker_service_urls` | `DATABROKER_SERVICE_URLS` | `URL` | `http://localhost:5443` (In [all-in-one mode](/docs/internals/configuration#all-in-one-vs-split-service-mode)) |

#### Examples {#databroker-service-url-examples}

```yaml
databroker_service_urls:
  - http://databroker.corp.example1.com
  - https://databroker.corp.example2.com
```

```bash
DATABROKER_SERVICE_URL=https://databroker.corp.example.com
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`databroker_service_url` and `databroker_internal_service_urls` are bootstrap configuration settings and are not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

`databroker_service_url` is not customizable in Kubernetes for all-in-one mode deployments

</TabItem>
</Tabs>

## Databroker Internal Service URL {#databroker-internal-service-url}

The **Databroker Internal Service URL** overrides [`databroker_service_url`](/docs/reference/databroker) when determining the TLS certificate for the Databroker service to listen with.

### How to configure {#databroker-internal-service-url-how-to-configure}

<Tabs>
<TabItem value="Core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Default** |
| :-- | :-- | :-- | :-- |
| `databroker_internal_service_url` | `DATABROKER_INTERNAL_SERVICE_URL` | `URL` | `http://localhost:5443` (In all-in-one mode) |
| `databroker_internal_service_urls` | `DATABROKER_INTERNAL_SERVICE_URLS` | `URL` | `http://localhost:5443` (In all-in-one mode) |

#### Examples {#databroker-internal-service-url-examples}

```yaml
databroker_internal_service_urls:
  - http://localhost:5443
  - http://service_url.com
```

```bash
DATABROKER_INTERNAL_SERVICE_URL=http://localhost:5443
```

</TabItem>
<TabItem value="Enterprise" label="Enterprise">

`databroker_internal_service_url` and `databroker_internal_service_urls` are bootstrap configuration settings and are not configurable in the Console.

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

`databroker_internal_service_url` is not customizable in Kubernetes

</TabItem>
</Tabs>
