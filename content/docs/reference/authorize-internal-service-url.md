---
id: authorize-internal-service-url
title: Authorize Internal Service URL
keywords:
  - reference
  - Authorize Internal Service URL
pagination_prev: null
pagination_next: null
---

# Authorize Internal Service URL

- Environmental Variable: `AUTHORIZE_INTERNAL_SERVICE_URL`
- Config File Key: `authorize_internal_service_url`
- Kubernetes: not supported
- Type: `URL`
- Required; inferred in all-in-one mode to be localhost.
- Example: `https://pomerium-authorize-service.default.svc.cluster.local` or `https://localhost:5443`

Authorize Internal Service URL overrides `authorize_service_url` when determining the TLS certificate for the authorize service to listen with.
