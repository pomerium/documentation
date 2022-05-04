---
id: enable-google-cloud-serverless-authentication
title: Enable Google Cloud Serverless Authentication
keywords:
- reference
- Enable Google Cloud Serverless Authentication
---


# Enable Google Cloud Serverless Authentication
- Environmental Variable: `ENABLE_GOOGLE_CLOUD_SERVERLESS_AUTHENTICATION`
- Config File Key: `enable_google_cloud_serverless_authentication`
- Type: `bool`
- Default: `false`

Enable sending a signed [Authorization Header](https://cloud.google.com/run/docs/authenticating/service-to-service) to upstream GCP services.

Requires setting [Google Cloud Serverless Authentication Service Account](#google-cloud-serverless-authentication-service-account) or running Pomerium in an environment with a GCP service account present in default locations.

