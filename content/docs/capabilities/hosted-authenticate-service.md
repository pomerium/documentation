---
id: hosted-authenticate-service
title: Hosted Authenticate Service
sidebar_label: Hosted Authenticate Service
keywords: [hosted authenticate service url, hosted identity provider]
description: Use Pomerium's Hosted Authenticate Service to set up and deploy Pomerium quickly. 
---

# Hosted Authenticate Service

Pomerium's **Hosted Authenticate Service** provides a **Hosted Authenticate Service URL** and a **Hosted Identity Provider** you can use in your Pomerium configuration as an alternative to self-hosting these services.

The Hosted Authenticate Service is available for both open-source Pomerium Core and Enterprise users. 

## Why use Hosted Authenticate Service

The Hosted Authenticate Service offers a quicker way for users to deploy and test Pomerium. 

### Zero configuration

Including the hosted authenticate URL in your configuration file authenticates your users against our hosted identity provider (IdP) solution (we use Cognito). 

This means you only need to include the hosted URL in your configuration file to use Pomerium's hosted services — no IdP settings required.

### Less time to deploy

Pomerium's hosted services solution removes the tedium of configuring your own IdP and authenticate service URL so you can deploy your Pomerium instance in less time. 

### Faster proof of concept

If you're testing Pomerium for the first time, run [Pomerium with Docker](/docs/quickstart) using our hosted services – you can run Pomerium Core in **under 5 minutes** with minimal setup.

Current Pomerium users who are interested in our [Enterprise Console](https://www.pomerium.com/enterprise-sales/) can test out the [Docker Enterprise Quickstart](/docs/releases/enterprise/install/quickstart) using hosted services as well. 

## How to use the Hosted Authenticate Service

The steps are simple:

1. Include the Hosted Authenticate Service URL in your configuration file
1. Remove your IdP settings
1. Set up a route and policy

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

This minimal configuration is all you need to connect to upstream services with Pomerium.

:::tip 

If you use the hosted URL and include your own IdP settings, Pomerium will override your IdP configuration and use the hosted IdP instead. 

:::

## Privacy considerations

Users that take advantage of our Hosted Authenticate Service should review the [Terms of Service agreement](https://www.pomerium.com/pomerium-zero-user-agreement/). 

Specifically, you should be aware that, by using our hosted services, you are aware and agree to Pomerium collecting the following data: 
- IP address
- OS version
- Internal domain name
- Session details (email, name, and domain)

We collect this information to better understand how our users interact with and use Pomerium's services. 






