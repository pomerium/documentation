---
id: metrics-client-certificate-authority
title: Metrics Client Certificate Authority
keywords:
  - reference
  - Metrics Client Certificate Authority
pagination_prev: null
pagination_next: null
---

# Metrics Client Certificate Authority

- Environment Variable: `METRICS_CLIENT_CA` / `METRICS_CLIENT_CA_FILE`
- Config File Key: `metrics_client_ca` / `metrics_client_ca_file`
- Kubernetes: not supported
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string` or relative file location
- Optional

The Client Certificate Authority is the x509 _public-key_ used to validate [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) client certificates for the metrics endpoint. If not set, no client certificate will be required.
