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

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default. 

If you want to run Pomerium with a self-hosted authenticate service, you must include an [**identity provider**](/docs/identity-providers) and **authenticate service URL** in your configuration. 

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::