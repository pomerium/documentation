---
id: tls-custom-certificate-authority
title: TLS Custom Certificate Authority
keywords:
- reference
- TLS Custom Certificate Authority
pagination_prev: null
pagination_next: null
---


# TLS Custom Certificate Authority
- Config File Key: `tls_custom_ca` or `tls_custom_ca_file`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string` or relative file location
- Optional

TLS Custom Certificate Authority defines a set of root certificate authorities that the Pomerium Proxy Service uses when verifying upstream server certificates.

**Note**: This setting will replace (not append) the system's trust store for a given route.

