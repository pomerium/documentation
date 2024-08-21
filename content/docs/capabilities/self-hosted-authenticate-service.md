---
id: self-hosted-authenticate-service
title: Self-Hosted Authenticate Service
sidebar_label: Self-Hosted Authenticate Service
keywords: [self-hosted authenticate service url, self-hosted identity provider]
description: Use Pomerium's Self-Hosted Authenticate Service to set up and deploy Pomerium with your own hosted settings.
---

# Self-Hosted Authenticate Service

Pomerium's **Self-Hosted Authenticate Service** allows you to configure your own **Authenticate Service URL** and **Identity Provider**.

The Self-Hosted Authenticate Service is available for Pomerium Zero, open-source Pomerium Core, and Enterprise users.

## How the Self-Hosted Authenticate Service works

Self-hosting your Pomerium instance requires you to configure an [Authenticate Service URL](/docs/reference/service-urls#authenticate-service-url) and an OIDC-compliant [identity provider](/docs/identity-providers) (IdP).

### Authenticate service URL

The authenticate service URL defines where Pomerium redirects end users (clients) to authenticate against an identity provider. The configured identity provider must also use this URL as its [redirect URI](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest), and append the `/oauth2/callback` path to the URL. 

For example, if your authenticate service URL is `https://authenticate.corp.example.com`, the identity provider's redirect URI would be `https://authenticate.corp.example.com/oauth2/callback`.

:::tip 

If you require a different callback path than `/oauth2/callback`, use the [Authenticate Callback Path](/docs/reference/authenticate-callback-path) setting to define a custom callback path.

:::

You can use your own authenticate service URL or use Pomerium's localhost URL for testing, which is hardcoded to point to `127.0.0.1`:

```yaml
authenticate_service_url: https://authenticate.localhost.pomerium.io
```

### Identity provider

Pomerium's Authenticate Service requires an IdP to authenticate and authorize users. Pomerium supports all major IdP solutions and any IdP that uses OAuth 2.0 and OIDC protocols as well.

## Configure the Self-Hosted Authenticate Service

To configure Pomerium to use self-hosted services:

1. Add your authenticate service URL

```yaml pomerium-config.yaml
authenticate_service_url: https://authenticate.localhost.pomerium.io
```

1. Include your IdP settings

```yaml pomerium-config.yaml
idp_provider: google
idp_client_id: my_client_id
idp_client_secret: my_client_secret
```

1. Build a route and policy

```yaml pomerium-config.yaml
routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```

Your self-hosted configuration file might look like this:

```yaml pomerium-config.yaml
authenticate_service_url: https://authenticate.localhost.pomerium.io

idp_provider: google
idp_client_id: my_client_id
idp_client_secret: my_client_secret

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```

See the [Pomerium Core Docker quickstart](/docs/core/quickstart) for more examples.
