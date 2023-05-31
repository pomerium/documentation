---
title: Deploying to Production
description: This article covers production deployment requirements and concerns
keywords:
  [
    pomerium,
    identity access proxy,
    production,
    deployment,
    scale,
    scaling,
    horizontal,
  ]
sidebar_label: To Production
sidebar_position: 10
---

# Deploying to Production

This page covers the topic of running Pomerium in a production configuration.

Before deploying Pomerium to Production, you should have already tested Pomerium in one or more demo environments and confirmed:

- A working connection to your [IdP](/docs/internals/glossary#identity-provider).
- Working test routes to your upstream services, including [JWT verification] where applicable.
- For Pomerium Enterprise, a working demo of the Pomerium Enterprise Console, with confirmed access for your [Admins and Managers][rbac].

## SSL/TLS Certificates

Pomerium utilizes TLS end to end, so the placement, certificate authorities and covered subjects are critical to align correctly.

In a typical deployment, a minimum of two certs are required:

- A wildcard certificate which covers the external `from` names, the Proxy service's external name and the Authenticate service's external name
  - Must be trusted by user browsers or clients
  - Must cover subject names from the user perspective
- A certificate which covers the Authorize service's name
  - Must be trusted by the Proxy
  - Must cover the subject name from the Proxy's perspective

If you have L7 load balancing in front of the Proxy/Authenticate:

- Your wildcard certificate should live on the load balancer
- Your Authenticate and Proxy services will need a certificate accepted by the load balancer
- Your load balancer can be configured to verify the identity of the Authenticate and Proxy certificates

If you have TLS enabled applications behind the proxy:

- you may provide a client certificate for the Proxy service to connect to downstream services with and verify
- the Proxy may be configured to verify the name and certificate authority of downstream services with either the standard Root CA bundle or a custom CA

[jwt verification]: /docs/concepts/mutual-auth.md#jwt-verification-application-based-mutual-authentication
[rbac]: /docs/capabilities/namespacing.mdx#rbac-for-enterprise-console-users

## Securing Pomerium

Pomerium is a tool for securing your infrastructure while adhering to the principles of [Zero Trust](/docs/concepts/zero-trust#zero-trust). But that doesn't mean that your stack is "secure" right out of the box. Additionally, security is a battle of give and take; more security often comes at the cost of more complexity, both for the administrator and the end-user. What layers of security you choose to apply (and how you configure them) is highly dependent on your use case.

While we can't tell you what tools and technologies are right for you, we've compiled a list of all the security-related documentation we have, organized to help you discover what path to take.

### Background and Concepts

If you're just getting started, we suggest reviewing the following pages:

- [Background](/docs/concepts/zero-trust) - A quick primer on the failures of legacy models of "perimeter security" and an introduction to the concept of Zero Trust.
- [Architecture](/docs/internals/architecture) - Learn how Pomerium is broken down into component services. How you choose to deploy Pomerium will set the stage for the kind of security practices that apply to your stack.
- [Mutual Authentication: A Component of Zero Trust](/docs/concepts/mutual-auth) - Zero Trust's core principle could be said as "trust nothing without first (and continuously) verifying it". Mutual authentication is a big part of bringing that principle to bear. This page explains the concept and how it's achieved across several different layers of the network stack.
- [Glossary](/docs/internals/glossary) - Keep this page handy for when you run into new or unfamiliar terminology.

### TLS Certificates

The long-time standard for server identity verification, the use of TLS certificates has exploded ever since [Let's Encrypt](https://letsencrypt.org/) made it possible for anyone to get a trusted certificate for free.

- The [Certificates](/docs/concepts/certificates) topic page covers several basic methods for generating trusted or testing certificates.
- Our article on [Installing Pomerium Using Helm](/docs/guides/helm) touches [briefly](/docs/guides/helm#install-and-configure-cert-manager) on using [cert-manager](https://cert-manager.io/docs/) to manage certificates in Kubernetes environments. We also wrote a guide for their docs site covering integration of the [Pomerium Ingress](https://cert-manager.io/docs/tutorials/acme/pomerium-ingress/) Controller with cert-manager.
- The [Upstream mTLS With Pomerium](/docs/capabilities/mtls-services) guide demonstrates mTLS between Pomerium and upstream services.
- Depending on your environment's needs, you may choose to verify some of all of your end users with [Client-Side mTLS](/docs/concepts/mutual-auth.md).

### User Identity and Context

Part of Pomerium's strength comes from the ability to pass user identity and context to your upstream service. This enables repeated verification of authorization throughout a system.

- [Getting the user's identity](/docs/capabilities/getting-users-identity) details the JWT Pomerium creates to identify the user in any given request.
- [Original User Context](/docs/capabilities/original-request-context) explains how to pass along the user context when upstream services communicate with each other to complete a request.
- Many applications support native JWT verification. See [Enable jWT Authentication in Grafana](/docs/guides/grafana#enable-jwt-authentication-in-grafana) for an example. For those that don't, you can perform [JWT Verification](/docs/guides/jwt-verification) with a sidecar.

### Device Identity

Often overlooked or confused with multi-factor authentication (MFA), device identity (and posture) is one of the most important and under-utilized aspects of a strong zero trust security model.

- [Device Identity](/docs/concepts/device-identity) provides background on the concept, and points the reader on how to configure policies that use device identity, and enroll devices in both open-source and Enterprise environments.

### Service Mesh

If you've read through all the docs linked above, first of all _wow_. That's a lot to absorb, kudos to you. But if you got this far and you're overwhelmed thinking about how to manage mutual authentication, user context verification, etc, between all your various applications, then you're primed and ready for a **service mesh**. A service mesh is a software component that acts as an infrastructure layer to facilitate the communication (and authentication) between services.

- Our [Istio](/docs/guides/istio) guide covers integration between Pomerium and Istio, the most common service mesh.
