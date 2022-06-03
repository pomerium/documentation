---
id: certificate-authority
title: Certificate Authority
description: |
  Certificate Authority is set when behind-the-ingress service communication uses self-signed certificates.
keywords:
- reference
- Certificate Authority
pagination_prev: null
pagination_next: null
---


# Certificate Authority
- Environmental Variable: `CERTIFICATE_AUTHORITY` or `CERTIFICATE_AUTHORITY_FILE`
- Config File Key: `certificate_authority` or `certificate_authority_file`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string` or relative file location
- Optional

This defines a set of root certificate authorities that Pomerium uses when communicating with other TLS-protected services.

**Note**: Unlike route-specific certificate authority settings, this setting augments (rather than replaces) the system's trust store. But routes that specify a CA will ignore those provided here.

:::warning

Be sure to include the intermediary certificate.

:::

