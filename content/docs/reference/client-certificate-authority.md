---
id: client-certificate-authority
title: Client Certificate Authority
keywords:
  - reference
  - Client Certificate Authority
pagination_prev: null
pagination_next: null
---

# Client Certificate Authority

- Environment Variable: `CLIENT_CA` / `CLIENT_CA_FILE`
- Config File Key: `client_ca` / `client_ca_file`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string` or relative file location
- Optional

The Client Certificate Authority is the x509 _public-key_ used to validate [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) client certificates. If not set, no client certificate will be required.
