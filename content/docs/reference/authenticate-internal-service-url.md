---
id: authenticate-internal-service-url
title: Authenticate Internal Service URL
keywords:
  - reference
  - Authenticate Internal Service URL
pagination_prev: null
pagination_next: null
---

# Authenticate Internal Service URL

- Environmental Variable: `AUTHENTICATE_INTERNAL_SERVICE_URL`
- Config File Key: `authenticate_internal_service_url`
- Type: `URL`
- Required
- Example: `https://authenticate.internal`

Authenticate Internal Service URL overrides `authenticate_service_url` when determining the TLS certificate and hostname for the authenticate service to listen with.
