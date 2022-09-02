---
id: remove-request-headers
title: Remove Request Headers
keywords:
  - reference
  - Remove Request Headers
pagination_prev: null
pagination_next: null
---

# Remove Request Headers

- Config File Key: `remove_request_headers`
- Type: array of `strings`
- Optional

Remove Request Headers allows you to remove given request headers. This can be useful if you want to prevent privacy information from being passed to downstream applications. For example:

```yaml
- from: https://verify.corp.example.com
  to: https://verify.pomerium.com
  policy:
    - allow:
        or:
          - email:
              is: user@example.com
  remove_request_headers:
    - X-Email
    - X-Username
```
