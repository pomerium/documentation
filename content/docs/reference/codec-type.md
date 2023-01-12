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
- Default: `auto`

Specifies the codec to use for downstream connections. Either `auto`, `http1` or `http2`.

When `auto` is specified the codec will be determined via TLS ALPN or protocol inference.
