---
id: client-crl
title: Client CRL
keywords:
  - reference
  - Client CRL
pagination_prev: null
pagination_next: null
---

# Client CRL

- Environment Variable: `CLIENT_CRL` / `CLIENT_CRL_FILE`
- Config File Key: `client_crl` / `client_crl_file`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string` or relative file location
- Optional

The Client CRL is the [certificate revocation list](https://en.wikipedia.org/wiki/Certificate_revocation_list) (in PEM format) for client certificates. If not set, no CRL will be used.
