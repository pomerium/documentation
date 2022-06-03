---
id: to
title: To
keywords:
- reference
- To
pagination_prev: null
pagination_next: null
---


# To
- `yaml`/`json` setting: `to`
- Type: `URL` or list of `URL`s (must contain a scheme and hostname) with an optional weight
- Schemes: `http`, `https`, `tcp`
- Optional
- Example: `http://verify` , `https://192.1.20.12:8080`, `http://neverssl.com`, `https://verify.pomerium.com/anything/`, `["http://a", "http://b"]`, `["http://a,10", "http://b,20"]`

`To` is the destination(s) of a proxied request. It can be an internal resource, or an external resource. Multiple upstream resources can be targeted by using a list instead of a single URL:

```yaml
- from: https://example.com
  to:
  - https://a.example.com
  - https://b.example.com
```

A load balancing weight may be associated with a particular upstream by appending `,[weight]` to the URL.  The exact behavior depends on your [`lb_policy`](/docs/reference/routes/load-balancing-policy) setting.  See [Load Balancing](/docs/topics/load-balancing) for example [configurations](/docs/topics/load-balancing#load-balancing-weight).

Must be `tcp` if `from` is `tcp+https`.

:::warning

Be careful with trailing slash.

With rule:

```yaml
- from: https://verify.corp.example.com
  to: https://verify.pomerium.com/anything
```

Requests to `https://verify.corp.example.com` will be forwarded to `https://verify.pomerium.com/anything`, while requests to `https://verify.corp.example.com/foo` will be forwarded to `https://verify.pomerium.com/anythingfoo`.To make the request forwarded to `https://httbin.org/anything/foo`, you can use double slashes in your request `https://httbin.corp.example.com//foo`.

While the rule:

```yaml
- from: https://verify.corp.example.com
  to: https://verify.pomerium.com/anything/
```

All requests to `https://verify.corp.example.com/*` will be forwarded to `https://verify.pomerium.com/anything/*`. That means accessing to `https://verify.corp.example.com` will be forwarded to `https://verify.pomerium.com/anything/`. That said, if your application does not handle trailing slash, the request will end up with 404 not found.

Either `redirect` or `to` must be set.

:::

