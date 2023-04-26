---
id: wildcard-from-routes
title: Wildcard From Routes
description: Creates a from route that supports any route prefixed with the wildcard character ("*"). 
keywords: [wildcard from routes]
pagination_prev: null
pagination_next: null
---

# Wildcard From Routes (Enterprise)

---

**YAML/JSON setting:** `from` <br/>
**Type:** `URL` <br/>
**Schemes:**
- `https`
- `tcp+https`  <br/>

**Kubernetes:** Not supported <br/>
**Optional**

**Examples:**
```yaml
routes:
  - from: https://*.example.com
  - to: https://example.com

# Or

routes:
  - from: tcp+https://*.example.com
  - to: tcp://*.example.com
```

---


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
```

:::tip **Note**

Wildcard From Routes (`*`) may take precedence over non-wildcard routes regardless of their ordering. (To be safe, specify the ordering by using Wildcard From Routes after non-wildcard routes.)

:::