---
id: prefix-rewrite
title: Prefix Rewrite
keywords:
  - reference
  - Prefix Rewrite
pagination_prev: null
pagination_next: null
---

# Prefix Rewrite

- `yaml`/`json` setting: `prefix_rewrite`
- Type: `string`
- Optional
- Example: `/subpath`

If set, indicates that during forwarding, the matched prefix (or path) should be swapped with this value. For example, given this policy:

```yaml
from: https://from.example.com
to: https://to.example.com
prefix: /admin
prefix_rewrite: /
```

A request to `https://from.example.com/admin` would be forwarded to `https://to.example.com/`.
