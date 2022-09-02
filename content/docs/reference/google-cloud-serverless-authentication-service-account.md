---
id: google-cloud-serverless-authentication-service-account
title: Google Cloud Serverless Authentication Service Account
keywords:
  - reference
  - Google Cloud Serverless Authentication Service Account
pagination_prev: null
pagination_next: null
---

# Google Cloud Serverless Authentication Service Account

- Environmental Variable: `GOOGLE_CLOUD_SERVERLESS_AUTHENTICATION_SERVICE_ACCOUNT`
- Config File Key: `google_cloud_serverless_authentication_service_account`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string`
- Optional

Manually specify the service account credentials to support GCP's [Authorization Header](https://cloud.google.com/run/docs/authenticating/service-to-service) format.

If unspecified:

- If [Identity Provider Name](/docs/reference/identity-provider-name) is set to `google`, will default to [Identity Provider Service Account](/docs/reference/identity-provider-service-account)
- Otherwise, will default to ambient credentials in the default locations searched by the Google SDK. This includes GCE metadata server tokens.
