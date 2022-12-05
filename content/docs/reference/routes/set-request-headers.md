---
id: set-request-headers
title: Set Request Headers
keywords:
  - reference
  - Set Request Headers
  - set_request_headers
pagination_prev: null
pagination_next: null
---

- Config File Key: `set_request_headers`
- Type: map of `strings` key value pairs
- Optional

Set Request Headers allows you to set static values for given request headers. This can be useful if you want to pass along additional information to downstream applications as headers, or set authentication header to the request. For example:

```yaml
- from: https://verify.corp.example.com
  to: https://verify.pomerium.com
  policy:
    - allow:
        or:
          - email:
              is: user@example.com
  set_request_headers:
    # works auto-magically!
    # https://verify.corp.example.com/basic-auth/root/hunter42
    Authorization: Basic cm9vdDpodW50ZXI0Mg==
    X-Your-favorite-authenticating-Proxy: 'Pomerium'
```

:::warning

Neither `:-prefixed` pseudo-headers nor the `Host:` header may be modified via this mechanism. Those headers may instead be modified via mechanisms such as `prefix_rewrite`, `regex_rewrite`, and `host_rewrite`.

:::

To pass dynamic values from the user's OIDC claim to the upstream service, see [JWT Claim Headers](../jwt-claim-headers).
