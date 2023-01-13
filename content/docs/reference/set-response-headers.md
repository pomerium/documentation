---
id: set-response-headers
title: Set Response Headers
keywords:
  - reference
  - Set Response Headers
pagination_prev: null
pagination_next: null
---

# Set Response Headers

- Environmental Variable: `SET_RESPONSE_HEADERS`
- Config File Key: `set_response_headers`
- Kubernetes: set per [Ingress](/docs/deploying/k8s/ingress)
- Type: map of `strings` key value pairs
- Examples:

  - Comma Separated: `X-Content-Type-Options:nosniff,X-Frame-Options:SAMEORIGIN`
  - JSON: `'{"X-Test": "X-Value"}'`
  - YAML:

    ```yaml
    set_response_headers:
      X-Test: X-Value
    ```

- To disable: `disable:true`

- Default :

  ```headers
  X-Content-Type-Options : nosniff,
  X-Frame-Options:SAMEORIGIN,
  X-XSS-Protection:1; mode=block,
  Strict-Transport-Security:max-age=31536000; includeSubDomains; preload,
  ```

Set Response Headers specifies a mapping of [HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) to be added globally to all managed routes and pomerium's authenticate service.

By default, conservative [secure HTTP headers](https://www.owasp.org/index.php/OWASP_Secure_Headers_Project) are set:

- `max-age=31536000` instructs the browser to pin the certificate for a domain for a year. This helps prevent man-in-the-middle attacks, but can create issues when developing new environments with temporary certificates. See [Troubleshooting - HSTS](/docs/internals/troubleshooting#http-strict-transport-security-hsts) for more information.
- `includeSubDomains` applies these rules to subdomains, which is how individual routes are defined.
- `preload` instructs the browser to preload the certificate from an HSTS preload service if available. This means that the certificate can be loaded from an already-trusted secure connection, and the user never needs to connect to your domain without TLS.

![pomerium security headers](img/security-headers.png)

See [MDN Web Docs - Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) for more information.

:::tip

Several security-related headers are not set by default since doing so might break legacy sites. These include: `Cross-Origin Resource Policy`, `Cross-Origin Opener Policy` and `Cross-Origin Embedder Policy`. If possible users are encouraged to add these to `set_response_headers` or their downstream applications.

:::
