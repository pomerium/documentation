---
id: from
title: From
keywords:
  - reference
  - From
pagination_prev: null
pagination_next: null
---

# From

---

**YAML/JSON setting:** `from` <br/> **Type:** `URL` (must contain a scheme and hostname, must not contain a path) <br/> **Schemes:** `https`, `tcp+https` <br/> **Required** <br/>

**Example:**

```yaml
routes:
  - from: https://verify.corp.example.com
  - to: https://example.com

# Or

routes:
  - from: tcp+https://ssh.corp.example.com:22
  - to: tcp://example.com:22
```

---

`From` is the externally accessible URL for the proxied request.

Specifying `tcp+https` for the scheme enables [TCP proxying](/docs/capabilities/tcp/) support for the route. You may map more than one port through the same hostname by specifying a different `:port` in the URL.

## Wildcard From Routes

**Kubernetes:** Not supported <br/>

**Wildcard From Routes** supports the use of a wildcard asterisk (`*`) prefixed to the domain name portion of a `from` URL.

Defining a `from` route with `*` will point any matching routes to the defined [To route](/docs/reference/routes/to). This eliminates the need to define multiple near-identical routes in your configuration. ([Autocert](/docs/reference/autocert) will be disabled for hosts that use Wildcard From Routes.)

For example:

```yaml
# Before:
routes:
  - from: https://a.example.com
    to: https://example.com
  - from: https://b.example.com
    to: https://example.com
  - from: https://c.example.com
    to: https://example.com
  - from: https://d.example.com
    to: https://example.com
  - from: https://e.example.com
    to: https://example.com

# After
routes:
  - from: https://*.example.com
    to: https://example.com

# Or

routes:
  - from: tcp+https://*.example.com:22
    to: tcp://example.com:22
```

:::tip **Note**

Wildcard From Routes (`*`) may take precedence over non-wildcard routes regardless of their ordering. (To be safe, specify the ordering by using Wildcard From Routes after non-wildcard routes.)

:::

:::warning

Only secure schemes (`https` and `tcp+https`) are supported.

:::
