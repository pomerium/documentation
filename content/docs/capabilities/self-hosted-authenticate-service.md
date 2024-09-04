---
id: self-hosted-authenticate-service
title: Self-Hosted Authenticate Service
sidebar_label: Self-Hosted Authenticate Service
keywords: [self-hosted authenticate service url, self-hosted identity provider]
description: Use Pomerium's Self-Hosted Authenticate Service to deploy Pomerium with your own identity provider.
---

# Self-Hosted Authenticate Service

Pomerium's **Self-Hosted Authenticate Service** allows you to configure Pomerium with the identity provider of your choice.

The self-hosted authenticate service is available for all versions of Pomerium (open-source, Pomerium Zero, and Pomerium Enterprise).

:::info

The _authenticate service_ is one of the [four logical services](/docs/internals/architecture#component-level) that make up Pomerium. The authenticate service is unique in that Pomerium can either run this service itself, or instead use the [Hosted Authenticate Service](/docs/capabilities/hosted-authenticate-service).

:::

## How the self-hosted authenticate service works

To configure the self-hosted authenticate service, you will need to set up:
- a URL for the authenticate service
- an identity provider (IdP)

### Authenticate service URL

The authenticate service URL is a public-facing URL that should resolve to your Pomerium instance. (If running in split service mode, this URL should resolve to the authenticate service.) Whenever a user is required to log in to access a route, Pomerium will redirect the user to the authenticate service using this URL.

This URL should not contain a path or query parameters. For example, `https://authenticate.corp.example.com`.

This URL must be different from any of the route URLs you use with Pomerium.

See the [Authenticate Service URL](/docs/reference/service-urls#authenticate-service-url) reference page for details on how to configure this setting.


### Identity provider

Pomerium relies on an identity provider (IdP) to authenticate users. Pomerium can use any IdP that implements the OpenID Connect (OIDC) protocol.

The steps to configure your IdP will vary depending on the specific provider. See [**Identity Providers**](/docs/identity-providers) for a list of guides to configure commonly-used IdPs.

You will generally need to configure your IdP client to allow an OAuth redirect URL based on your chosen authenticate service URL, with the path `/oauth2/callback` appended to it.

For example, if your authenticate service URL is `https://authenticate.corp.example.com`, you should configure your identity provider to allow the redirect URI `https://authenticate.corp.example.com/oauth2/callback`.

:::tip

If you require a different callback path than `/oauth2/callback`, you can use the [Authenticate Callback Path](/docs/reference/authenticate-callback-path) setting to change the callback path.

:::

Once you have set up an IdP client, you will need to configure Pomerium with the IdP name, client ID and client secret, and possibly a URL assigned to your individual IdP client.

See the [Identity Provider Settings](/docs/reference/identity-provider-settings#identity-provider-client-id) reference page for details on how to configure these settings.

## Example

To configure Pomerium to use the self-hosted authenticate service with GitHub authentication:

1. Add your authenticate service URL to your Pomerium configuration:
   ```yaml title="pomerium-config.yaml"
   authenticate_service_url: https://authenticate.localhost.pomerium.io
   ```
1. Register a new GitHub OAuth application by following the steps at [Create a GitHub OAuth 2.0 Application](/docs/identity-providers/github#create-a-github-oauth-20-application).
1. Configure Pomerium to use the GitHub OAuth application:
   ```yaml title="pomerium-config.yaml"
   idp_provider: github
   idp_client_id: <client_id>
   idp_client_secret: <client_secret>
   ```
1. Build a route and policy
   ```yaml title="pomerium-config.yaml"
   routes:
     - from: https://verify.localhost.pomerium.io
       to: https://verify.pomerium.com
       policy:
         - allow:
             or:
               - email:
                   is: user@example.com
       pass_identity_headers: true
   ```

Putting it all together:

```yaml title="pomerium-config.yaml"
authenticate_service_url: https://authenticate.localhost.pomerium.io

idp_provider: github
idp_client_id: <client_id>
idp_client_secret: <client_secret>

routes:
  - from: https://verify.localhost.pomerium.io
    to: https://verify.pomerium.com
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```
