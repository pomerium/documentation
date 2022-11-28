---
id: autocert-ca
title: Autocert CA
description: |
  Autocert CA is the directory URL of the ACME CA to use when requesting certificates.
keywords:
  - reference
  - Autocert CA
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `AUTOCERT_CA`
- Config File Key: `autocert_ca`
- Type: `string` containing the directory URL of an ACME CA (e.g. `https://acme.zerossl.com/v2/DV90` for ZeroSSL)
- Optional

Autocert CA is the directory URL of the ACME CA to use when requesting certificates.

:::tip

This will overrule the "Autocert Use Staging" setting if set.

:::
