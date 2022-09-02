---
id: codec-type
title: Codec Type
keywords:
  - reference
  - Codec Type
pagination_prev: null
pagination_next: null
---

# Codec Type

- Environment Variable: `CODEC_TYPE`
- Config File Key: `codec_type`
- Type: `string`
- Default: `auto` (`http1` in all-in-one mode)

Specifies the codec to use for downstream connections. Either `auto`, `http1` or `http2`.

When `auto` is specified the codec will be determined via TLS ALPN or protocol inference.

:::warning



With HTTP/2, browsers typically coalesce connections for the same IP address that use the same TLS certificate. For example, you may have `authenticate.localhost.pomerium.io` and `example.localhost.pomerium.io` using the same wildcard certificate (`*.localhost.pomerium.io`) and both pointing to `127.0.0.1`. Your browser sees this and re-uses the initial connection it makes to `example` for `authenticate`. But unfortunately the routes necessary to handle `authenticate` don't exist on `example` so the proxy cannot handle the request.

If this happens Pomerium will respond with a `421 Misdirected Request` status. Most browsers will attempt to make the request on a new HTTP/2 connection. However not all browsers implement this behavior (notably Safari), and users may end up seeing a blank page instead.

If you see this happen, there are several ways to mitigate the problem:

1. Don't re-use TLS certificates for shared IP domains.
2. Don't re-use IP addresses for shared TLS certificates.
3. Don't use HTTP/2.

More details on this problem are available in [Github Issue #2150](https://github.com/pomerium/pomerium/issues/2150).

:::
