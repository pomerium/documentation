---
id: autocert-trusted-certificate-authority
title: Autocert Trusted Certificate Authority
keywords:
- reference
- Autocert Trusted Certificate Authority
---


# Autocert Trusted Certificate Authority
- Environment Variable: `AUTOCERT_TRUSTED_CA` / `AUTOCERT_TRUSTED_CA_FILE`
- Config File Key: `autocert_trusted_ca` / `autocert_trusted_ca_file`
- Type: [base64 encoded] `string` or relative file location
- Optional

The Autocert Trusted Certificate Authority is the x509 CA (bundle) used when communicating with a CA supporting the ACME protocol. If not set, the system trusted roots will be used to verify TLS connections to the ACME CA.

