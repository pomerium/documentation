---
id: rewrite-response-headers
title: Rewrite Response Headers
keywords:
- reference
- Rewrite Response Headers
pagination_prev: null
pagination_next: null
---


# Rewrite Response Headers
- Config File Key: `rewrite_response_headers`
- Type: `object`
- Optional
- Example: `[{ "header": "Location", "prefix": "http://localhost:8000/two/", "value": "http://frontend/one/" }]`

Rewrite Response Headers allows you to modify response headers before they are returned to the client. The `header` field will match the HTTP header name, and `prefix` will be replaced with `value`. For example, if the downstream server returns a header:

```text
Location: http://localhost:8000/two/some/path/
```

And the policy has this config:

```yaml
rewrite_response_headers:
  - header: Location
    prefix: http://localhost:8000/two/
    value: http://frontend/one/
```

The browser would be redirected to: `http://frontend/one/some/path/`. This is similar to nginx's [`proxy_redirect` option](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_redirect), but can be used for any header.

