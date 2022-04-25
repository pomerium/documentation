---
id: identity-provider-service-account
title: Identity Provider Service Account
description: |
  Identity Provider Service Account is field used to configure any additional user account or access-token that may be required for querying additional user information during authentication.
keywords:
- reference
- Identity Provider Service Account
---


# Identity Provider Service Account
- Environmental Variable: `IDP_SERVICE_ACCOUNT`
- Config File Key: `idp_service_account`
- Type: `string`
- **Required** for group based policies (most configurations)

The identity provider service account setting is used to query associated identity information from your identity provider.  This is a provider specific value and is not required for all providers.  For example, when using Okta this value will be an Okta API key, and for an OIDC provider that provides groups as a claim, this value will be empty.

:::warning

If you plan to write authorization policies using groups, or any other data that exists in your identity provider's directory service, this setting is **mandatory**.

:::

