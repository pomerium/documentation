---
id: identity-provider-client-secret-file
title: Identity Provider Client Secret File
description: |
  File path containing the Client Secret, the OAuth 2.0 Secret Identifier retrieved from your identity provider.
keywords:
  - reference
  - Identity Provider Client Secret File
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `IDP_CLIENT_SECRET_FILE`
- Config File Key: `idp_client_secret_file`
- Kubernetes: see [`identityProvider.secret`](/docs/deploying/k8s/reference#identityprovider)
- Type: `string`
- Required (unless using [identity_provider_client_secret](./identity-provider-client-secret))

Client Secret is the OAuth 2.0 Secret Identifier retrieved from your identity provider. See your identity provider's documentation, and our [identity provider](/docs/identity-providers/) docs for details.

`identity_provider_client_secret_file` points to a file containing the secret. This is useful when deploying in environments that provide secret management like [Docker Swarm](https://docs.docker.com/engine/swarm/secrets/). For example:

```yaml
idp_client_secret_file: '/run/secrets/POMERIUM_CLIENT_SECRET'
```

:::tip **Note:**

Pomerium uses the [**Hosted Authenticate Service**](/docs/capabilities/hosted-authenticate-service) by default.

If you want to run Pomerium with a self-hosted authenticate service, include an [**identity provider**](/docs/identity-providers) and [**authenticate service URL**](/docs/reference/authenticate-service-url) in your configuration.

See [**Self-Hosted Authenticate Service**](/docs/capabilities/self-hosted-authenticate-service) for more information.

:::
