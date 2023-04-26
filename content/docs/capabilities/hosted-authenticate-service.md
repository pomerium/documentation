---
id: hosted-authenticate-service
title: Hosted Authenticate Service
sidebar_label: Hosted Authenticate Service
keywords: [hosted authenticate service url, hosted identity provider]
description: Use Pomerium's Hosted Authenticate Service to set up and deploy Pomerium quickly.
---

# Hosted Authenticate Service

Pomerium's **Hosted Authenticate Service** provides a hosted alternative to the Self-Hosted Authenticate Service.

The Hosted Authenticate Service is available in Pomerium v0.22.0 for both open-source Pomerium Core and Enterprise users.

## How the Hosted Authenticate Service works

Pomerium's hosted service includes a **Hosted Authenticate Service URL** and a **Hosted Identity Provider** that handle authentication and authorization using OAuth 2.0 and OIDC protocols.

Starting in **Pomerium v0.22.0**, both open-source Pomerium Core and Enterprise deployments will use our hosted services by default.

The Hosted Authenticate Service is optional. If you prefer to self-host these services, you still can. See the [Self-Hosted Authenticate service](/docs/capabilities/self-hosted-authenticate-service) page for more information.

## Why use Hosted Authenticate Service

The Hosted Authenticate Service offers a quicker way for users to deploy and test Pomerium.

### Zero configuration

The Hosted Authenticate Service requires no setup to use. That means you don't need to include the hosted authenticate service URL or IdP settings in your configuration.

### Less time to deploy

Pomerium's hosted services solution removes the tedium of configuring your own identity provider (IdP) and authenticate service URL so you can deploy Pomerium in less time.

### Faster proof of concept

If you're testing Pomerium for the first time, run [Pomerium with Docker](/docs/quickstart) using our hosted services – you can run Pomerium Core in **under 5 minutes** with minimal setup.

Current Pomerium users who are interested in our [Enterprise Console](https://www.pomerium.com/enterprise-sales/) can test out the [Docker Enterprise Quickstart](/docs/releases/enterprise/install/quickstart) using hosted services as well.

## Configure the Hosted Authenticate Service

The Hosted Authenticate Service requires zero configuration to use.

Add the following route and policy to your configuration file:

```yaml title=pomerium-config.yaml
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

```yaml title=pomerium-config.yaml
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

```yaml title=pomerium-config.yaml
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

## Privacy considerations

Users that take advantage of our Hosted Authenticate Service should review the [Terms of Service agreement](https://www.pomerium.com/pomerium-zero-user-agreement/).

Specifically, you should be aware that by using our hosted services, you agree to Pomerium collecting the following data:

- IP address
- OS version
- Internal domain name
- Session details (email, name, and domain)

We collect this information to better understand how our users interact with and use Pomerium's services.
