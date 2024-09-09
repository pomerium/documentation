---
id: self-hosted-authenticate-service
title: Self-Hosted Authenticate Service
sidebar_label: Self-Hosted Authenticate Service
keywords: [self-hosted authenticate service url, self-hosted identity provider]
description: Use Pomerium's Self-Hosted Authenticate Service to deploy Pomerium with your own identity provider.
---

# Self-Hosted Authenticate Service

Pomerium's **Self-Hosted Authenticate Service** allows you to configure Pomerium with the identity provider of your choice.

The self-hosted authenticate service is available for open-source Pomerium, Pomerium Zero, and Pomerium Enterprise.

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

#### Why use an authenticate service URL?

In a typical OIDC authentication flow, the Relying Party (in this case, the upstream service) requires an OpenID (OP) client to authenticate users against an IdP (the OP client must be registered with the IdP).

Without the authenticate service URL setting, if you configured Pomerium to protect multiple upstream services, each service would require its own OP client.

The authenticate service URL allows you to configure a single URL that you can reuse to authenticate users across multiple Pomerium-managed routes. This way, you don't need to configure and maintain multiple OP clients to authenticate end users.

### Identity provider

Pomerium relies on an IdP to authenticate users. Pomerium can use any IdP that implements the OpenID Connect (OIDC) protocol.

The steps to configure your IdP will vary depending on the specific provider. See [**Identity Providers**](/docs/identity-providers) for a list of guides to configure commonly-used IdPs.

You will generally need to configure your IdP client to allow an OAuth redirect URL based on your chosen authenticate service URL, with the path `/oauth2/callback` appended to it.

For example, if your authenticate service URL is `https://authenticate.corp.example.com`, you should configure your identity provider to allow the redirect URI `https://authenticate.corp.example.com/oauth2/callback`.

:::tip

If you require a different callback path than `/oauth2/callback`, you can use the [Authenticate Callback Path](/docs/reference/authenticate-callback-path) setting to change the callback path.

:::

Once you have set up an IdP client, you will need to configure Pomerium with the IdP name, client ID and client secret, and possibly a URL assigned to your individual IdP client.

See the [Identity Provider Settings](/docs/reference/identity-provider-settings#identity-provider-client-id) reference page for details on how to configure these settings.
