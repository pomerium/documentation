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

- `yaml`/`json` setting: `from`
- Type: `URL` (must contain a scheme and hostname, must not contain a path)
- Schemes: `https`, `tcp+https`
- Required
- Example: `https://verify.corp.example.com`, `tcp+https://ssh.corp.example.com:22`

`From` is the externally accessible URL for the proxied request.

Specifying `tcp+https` for the scheme enables [TCP proxying](/docs/tcp/) support for the route. You may map more than one port through the same hostname by specifying a different `:port` in the URL.

:::warning

Only secure schemes (`https` and `tcp+https`) are supported.

:::
