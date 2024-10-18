---
id: hosted-authenticate-service
title: Hosted Authenticate Service
sidebar_label: Hosted Authenticate Service
keywords: [hosted authenticate service url, hosted identity provider]
description: Use Pomerium's Hosted Authenticate Service to set up and deploy Pomerium quickly.
---

# Hosted Authenticate Service

Pomerium's **Hosted Authenticate Service** provides a hosted alternative to the self-hosted authenticate service.

Introduced in Pomerium v0.22, the hosted authenticate service is available for open-source Pomerium, Pomerium Zero, and Pomerium Enterprise.

## How the hosted authenticate service works

Pomerium's hosted authenticate service includes a **Hosted Authenticate Service URL** and a **Hosted Identity Provider** that handle authentication and authorization using OAuth 2.0 and OIDC protocols.

Pomerium Zero, Core, and Enterprise configurations that do not include the self-hosted authenticate service URL or identity provider settings default to the hosted authenticate service settings. See [Configure the hosted authenticate service](#configure-the-hosted-authenticate-service) section for more information.

## Why use the hosted authenticate service

The hosted authenticate service offers a quicker way for users to deploy and test Pomerium.

### No configuration

The hosted authenticate service doesn't require an authenticate service URL or identity provider settings to use.

### Less time to deploy

Pomerium's hosted authenticate service removes the tedium of configuring your own identity provider (IdP) and authenticate service URL so you can deploy Pomerium in less time.

### Faster proof of concept

If you're testing Pomerium for the first time, run [Pomerium with Docker](/docs/core/quickstart) using our hosted authenticate service – you can run Pomerium Core in **under 5 minutes** with minimal setup.

:::enterprise

Pomerium users who are interested in [Pomerium Enterprise](https://www.pomerium.com/enterprise-sales/) can test out the [Docker Enterprise quickstart](/docs/enterprise/quickstart) using our hosted authenticate service as well.

:::

## Configure the hosted authenticate service

The hosted authenticate service requires no configuration to use.

Add the following route and policy to your configuration file:

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

This minimal configuration is all you need to connect to an upstream service with Pomerium's hosted services.

If you want, you can still include the hosted URL in your configuration:

```yaml title="pomerium-config.yaml"
authenticate_service_url: https://authenticate.pomerium.app

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

If you use the hosted URL and include your own IdP settings, Pomerium will override your IdP configuration and use the hosted IdP instead:

```yaml title="pomerium-config.yaml"
authenticate_service_url: https://authenticate.pomerium.app

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

## Limitations

**Limited sign-in options**

Currently, you can only authenticate with Google single-sign on or with email and password credentials.

**Session management**

The hosted authenticate service is separate from your Pomerium installation. This means you can't refresh session tokens, so users must re-authenticate after roughly one hour.

**Uptime commitment**

We make no commitments to uptime for our free hosted authenticate service.

## Privacy considerations

Users that take advantage of our hosted authenticate service should review the [Terms of Service agreement](https://www.pomerium.com/pomerium-zero-user-agreement/).

Specifically, you should be aware that by using our hosted services, you agree to Pomerium collecting the following data:

- IP address
- OS version
- Internal domain name
- Session details (email, name, and domain)

We collect this information to better understand how our users interact with and use Pomerium's services.
