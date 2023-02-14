---
id: metrics-certificate
title: Metrics Certificate
keywords:
  - reference
  - Metrics Certificate
pagination_prev: null
pagination_next: null
---

# Metrics Certificate

- Config File Key: `metrics_certificate` / `metrics_certificate_key`
- Config File Key: `metrics_certificate_file` / `metrics_certificate_key_file`
- Environmental Variable: `METRICS_CERTIFICATE` / `METRICS_CERTIFICATE_KEY`
- Environmental Variable: `METRICS_CERTIFICATE_FILE` / `METRICS_CERTIFICATE_KEY_FILE`
- Kubernetes: not supported
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string`
- Type: certificate relative file location `string`
- Optional

Certificates are the x509 _public-key_ and _private-key_ used to secure the metrics endpoint.
