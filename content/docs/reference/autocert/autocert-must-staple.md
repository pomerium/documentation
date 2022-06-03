---
id: autocert-must-staple
title: Autocert Must-Staple
keywords:
- reference
- Autocert Must-Staple
pagination_prev: null
pagination_next: null
---


# Autocert Must-Staple
- Environmental Variable: `AUTOCERT_MUST_STAPLE`
- Config File Key: `autocert_must_staple`
- Type: `bool`
- Optional

If true, force autocert to request a certificate with the `status_request` extension (commonly called `Must-Staple`). This allows the TLS client (_id est_ the browser) to fail immediately if the TLS handshake doesn't include OCSP stapling information. This setting is only used when [Autocert](/docs/reference/autocert/autocert) is true.

:::tip

This setting will only take effect when you request or renew your certificates.

:::

For more details, please see [RFC7633](https://tools.ietf.org/html/rfc7633) .

