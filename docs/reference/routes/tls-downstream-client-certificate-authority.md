---
id: tls-downstream-client-certificate-authority
title: TLS Downstream Client Certificate Authority
keywords:
- reference
- TLS Downstream Client Certificate Authority
pagination_prev: null
pagination_next: null
---


# TLS Downstream Client Certificate Authority
- Config File Key: `tls_downstream_client_ca` or `tls_downstream_client_ca_file`
- Type: [base64 encoded] `string` or relative file location
- Optional

If specified, downstream clients (eg a user's browser) will be required to provide a valid client TLS
certificate. This overrides the global `client_ca` option for this route.

See [Client-Side mTLS With Pomerium](/guides/mtls) for more information.

