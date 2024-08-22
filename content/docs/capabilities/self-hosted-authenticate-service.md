---
id: self-hosted-authenticate-service
title: Self-Hosted Authenticate Service
sidebar_label: Self-Hosted Authenticate Service
keywords: [self-hosted authenticate service url, self-hosted identity provider]
description: Use Pomerium's Self-Hosted Authenticate Service to set up and deploy Pomerium with your own hosted settings.
---

# Self-Hosted Authenticate Service

Pomerium's **Self-Hosted Authenticate Service** allows you to configure your own authenticate service URL and identity provider.

The self-hosted authenticate service is available in Pomerium Zero, open-source Pomerium Core, and Pomerium Enterprise.

## How the self-hosted authenticate service works

Self-hosting your Pomerium instance requires you to configure an [authenticate service URL](/docs/reference/service-urls#authenticate-service-url) and an OIDC-compliant [identity provider](/docs/identity-providers) (IdP).

### Authenticate service URL

The authenticate service URL is an external URL that defines where Pomerium redirects users to authenticate against an identity provider. The configured identity provider requires the same authenticate service URL as its [redirect URI](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest), with the `/oauth2/callback` path appended to the URL.

For example, if your authenticate service URL is `https://authenticate.corp.example.com`,

The identity provider's redirect URI would be `https://authenticate.corp.example.com/oauth2/callback`.

You can use Pomerium's localhost URL for testing, which is hardcoded to point to `127.0.0.1`:

```yaml
authenticate_service_url: https://authenticate.localhost.pomerium.io
```

:::tip

If you require a different callback path than `/oauth2/callback`, use the [Authenticate Callback Path](/docs/reference/authenticate-callback-path) setting to define a custom callback path.

:::

### Identity provider

Pomerium's Authenticate Service requires an IdP to authenticate users. Pomerium can support any IdP that incorporates the OAuth 2.0 and OIDC protocols in the authentication flow. 

Although the steps to configure an IdP to integrate with Pomerium vary depending on the provider (see [identity providers](/docs/identity-providers) for vendor-specific guides), the Pomerium configuration always requires some (or all) of the following IdP-related settings:

- Identity Provider Client ID
- Identity Provider Client Secret
- Identity Provider Name
- Identity Provider URL

See [Identity Provider Settings](/docs/reference/identity-provider-settings#identity-provider-client-id) for more information.

## Configure the self-hosted authenticate service

To configure Pomerium to use the self-hosted authenticate service:

1. Add your authenticate service URL 
    ```yaml title="pomerium-config.yaml"
    authenticate_service_url: https://authenticate.localhost.pomerium.io
    ```
1. Include your IdP settings
    ```yaml title="pomerium-config.yaml"
    idp_provider: <idp>
    idp_client_id: <client_id>
    idp_client_secret: <client_secret>
    ```
1. Build a route and policy
    ```yaml title="pomerium-config.yaml"
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

```yaml title="pomerium-config.yaml"
authenticate_service_url: https://authenticate.localhost.pomerium.io

idp_provider: github
idp_client_id: <client_id>
idp_client_secret: <client_secret>

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
