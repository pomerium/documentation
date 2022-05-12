---
id: tls-client-certificate
title: TLS Client Certificate
keywords:
- reference
- TLS Client Certificate
pagination_prev: null
pagination_next: null
---


# TLS Client Certificate
- Config File Key: `tls_client_cert` and `tls_client_key` or `tls_client_cert_file` and `tls_client_key_file`
- Type: [base64 encoded] `string` or relative file location
- Optional

If specified, Pomerium will present this client certificate to upstream services when requested to enforce [mutual authentication](https://en.wikipedia.org/wiki/Mutual_authentication) (mTLS).

For more details, see our [mTLS example repository](https://github.com/pomerium/pomerium/tree/main/examples/mutual-tls) and the [Upstream mTLS With Pomerium](/guides/upstream-mtls) guide.

