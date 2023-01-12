---
id: authenticate-service-url
title: Authenticate Service URL
description: |
  Authenticate Service URL is the externally accessible URL for the authenticate service.
keywords:
  - reference
  - Authenticate Service URL
pagination_prev: null
pagination_next: null
---

# Authenticate Service URL

- Environmental Variable: `AUTHENTICATE_SERVICE_URL`
- Config File Key: `authenticate_service_url`
- Kubernetes: [`authenticate.url`](/docs/deploying/k8s/reference#authenticate)
- Type: `URL`
- Required
- Example: `https://authenticate.corp.example.com`

Authenticate Service URL is the externally accessible URL for the authenticate service. In split service mode, this key is required by all services other than Databroker.
