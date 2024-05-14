---
id: runtime-flags
title: Runtime Flags
description: This page lists Runtime Flags available in Pomerium.
keywords:
  [
    feature flags,
    feature flag,
    runtime flags,
    runtime flag,
    runtime configuration,
  ]
pagination_prev: null
pagination_next: null
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Runtime Flags

| Runtime Flag | Description | Type | Default |
| :-- | :-- | :-- | :-- |
| [Match Any Incoming Port](#match-any-incoming-port) | Matches incoming HTTP requests on any port for a From route that does not specify a port in the URL. | Boolean | `true` |

## Match Any Incoming Port

The **Match Any Incoming Port** runtime flag instructs Pomerium to match requests on any port for From routes that _do not_ specify a port in the route URL. If the port is specified in the route URL, Pomerium will only match requests on that exact port. This is the default route matching behavior.

If you disable this runtime flag, Pomerium will match incoming requests on port `443` by default unless you specify a port in the From URL.

:::info

See the [**From route**](/docs/reference/routes/from) reference page for more information about how to configure From routes.

:::

### How to Configure

<Tabs>
<TabItem value="core" label="Core">

| **Config file keys** | **Environment variables** | **Type** | **Default** |
| :-- | :-- | :-- | :-- |
| `match_any_incoming_port` | `MATCH_ANY_INCOMING_PORT` | `string` | `true` |

</TabItem>
<TabItem value="enterprise" label="Enterprise">

This is a bootstrap setting. It is not configurable in the Enterprise Console.

</TabItem>
<TabItem value="kubernetes" label="Kubernetes">

This runtime flag is currently not configurable in the Pomerium Ingress Controller.

</TabItem>
</Tabs>

#### Examples

With a From route that _does not_ specify an explicit port:

```yaml
from: https://example.com
```

Pomerium will match the From route with incoming requests on _any_ port:

```yaml
https://www.example.com

https://www.example.com:443

https://www.example.com:8443

https://www.example.com:18443
```

If you disable this runtime flag and _do not_ specify a port in the From URL, Pomerium will match the incoming request on port `:443`, the default listening port.

```yaml
https://www.example.com:443
```
