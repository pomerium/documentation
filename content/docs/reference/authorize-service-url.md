---
id: authorize-service-url
title: Authorize Service URL
description: |
  Authorize Service URL is the location of the internally accessible Authorize service.
keywords:
- reference
- Authorize Service URL
pagination_prev: null
pagination_next: null
---


# Authorize Service URL
- Environmental Variable: `AUTHORIZE_SERVICE_URL or `AUTHORIZE_SERVICE_URLS`
- Config File Key: `authorize_service_url` or `authorize_service_urls`
- Type: `URL`
- Required; inferred in all-in-one mode to be localhost.
- Example: `https://pomerium-authorize-service.default.svc.cluster.local`, `https://localhost:5443`, `https://authorize.corp.example.com`

Authorize Service URL is the location of the internally accessible Authorize service. NOTE: Unlike authenticate, authorize has no publicly accessible http handlers so this setting is purely for gRPC communication.

Multiple URLs can be specified with `authorize_service_urls`.

If your load balancer does not support gRPC pass-through you'll need to set this value to an internally routable location (`https://pomerium-authorize-service.default.svc.cluster.local`) instead of an externally routable one (`https://authorize.corp.example.com`).

