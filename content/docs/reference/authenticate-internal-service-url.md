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
- Kubernetes: not supported
- Type: `URL`
- Required
- Example: `https://authenticate.internal`

Authenticate Internal Service URL overrides `authenticate_service_url` when determining the TLS certificate and hostname for the authenticate service to listen with.

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, you must include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
