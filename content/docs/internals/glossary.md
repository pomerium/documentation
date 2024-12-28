---
title: Glossary
lang: en-US
keywords:
  [
    pomerium,
    identity and access management,
    zero-trust,
    glossary,
    definitions,
    access control,
    beyondcorp,
    reverse proxy,
    identity provider,
  ]
description: A reference glossary of commonly used Pomerium terms, consolidated from documentation on glossary and identity & access management.
---

# Glossary

Below is a consolidated list of key networking, security, and identity & access management (IAM) terms used throughout Pomerium’s documentation. If you find unfamiliar terms not listed here, please let us know in our [Discuss support forum](https://discuss.pomerium.com/c/support/9) so we can add them.

## Access Token

A string that grants the holder certain permissions. Issued by an [Identity Provider (IdP)](#identity-provider-idp), often in the form of a [JWT](#json-web-token-jwt).

## Audit Logs

Records of activity in your environment. [Pomerium’s audit logs](/docs/capabilities/audit-logs) help track anomalies and revoke compromised access.

## Authentication (AuthN)

Confirms a user’s or device’s identity (i.e., Are you who you say you are?). Pomerium delegates authentication to external IdPs like Google or Okta, which issue a [JWT](#json-web-token-jwt).

## Authorization (AuthZ)

Determines if a user can access a specific resource (i.e., Do you have permission?). Pomerium compares JWT claims against [policies](#policy) defined in the [Pomerium Policy Language (PPL)](#pomerium-policy-language-ppl).

## Context-aware Proxy

A type of [Reverse Proxy](#reverse-proxy) that allows or denies access based on factors such as user identity, device state, or time of day. Pomerium acts as a context-aware proxy by validating a user’s [JWT](#json-web-token-jwt) and optional device signals.

## Custom Resource Definition (CRD)

A Kubernetes mechanism for extending its API with custom objects. For example, cert-manager uses CRDs to define certificate issuers.

## Device Identity

Confirms the security posture of a user’s device. Pomerium can check secure enclaves, certificates, or MDM signals to ensure only known, compliant devices can reach protected resources.

## East-west Traffic

Traffic that flows between services inside the same network, cluster, or private cloud. Contrasted with [North-south Traffic](#north-south-traffic).

## HTTP Strict Transport Security (HSTS)

A policy instructing clients (usually browsers) to only connect over TLS for a set duration, mitigating man-in-the-middle attacks. [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) is recommended only after fully configuring production certificates.

## Identity and Access Management (IAM)

A framework for verifying a user’s identity (AuthN) and managing permissions (AuthZ). Pomerium implements IAM by delegating authentication to IdPs and using policy-based rules for authorization.

## Identity Provider (IdP)

A service (e.g., Google, Okta) that stores user identities and issues tokens. Pomerium authenticates users via an IdP, which simplifies [Single Sign-On (SSO)](#single-sign-on-sso) across protected resources.

## JavaScript Object Notation (JSON)

A text-based data format that uses key-value pairs and arrays. Commonly used for configuration, logs, tokens, and more. See [Wikipedia](https://en.wikipedia.org/wiki/JSON).

## JSON Web Key Sets (JWKS)

A [JSON](#javascript-object-notation-json)-formatted set of cryptographic keys, usually provided by an IdP to validate [JWT](#json-web-token-jwt) signatures. Defined by [RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517).

## JSON Web Token (JWT)

A [JSON](#javascript-object-notation-json)-formatted token that encodes user claims, issued by an [IdP](#identity-provider-idp). Used by Pomerium to confirm identity and context for [Authorization](#authorization-authz).

## Least User Privilege

A principle of granting only the minimal set of privileges necessary for a user’s job function. If credentials are compromised, blast radius is limited.

## Mutual Authentication

Requires both client and server to authenticate each other. Reduces the risk of impersonation by attackers. See [Pomerium’s mutual auth docs](/docs/concepts/mutual-auth).

## Namespace

A segmentation mechanism with different meanings:

- **Pomerium Enterprise**: Namespaces provide isolation of [Routes](#route) and [Policies](#policy).
- **Kubernetes**: Namespaces isolate groups of resources within a cluster.

## Non-domain Users

Users who need access but aren’t part of your main IdP domain (e.g., contractors). You can create a special IdP group that includes them or manually add their unique ID in a [Namespace](#namespace) or [Policy](#policy). This approach applies the [Pomerium Policy Language (PPL)](#pomerium-policy-language-ppl) consistently for all users.

## North-south Traffic

Traffic flowing between external clients (end users) and services within a network, cluster, or cloud. Contrasted with [East-west Traffic](#east-west-traffic).

## OAuth 2.0

An authorization framework ([RFC 6749](https://www.rfc-editor.org/rfc/rfc6749)) that lets an application request access to user resources from a resource server without sharing credentials. Often paired with [OpenID Connect (OIDC)](#openid-connect-oidc).

## OpenID Connect (OIDC)

An identity layer on top of [OAuth 2.0](#oauth-20). The IdP issues an ID token containing user claims, which Pomerium uses to authenticate users.

## Perimeter

Typically your internal network boundary, guarded by firewalls. [Zero Trust](#zero-trust) assumes the perimeter may be compromised and protects every connection on a per-request basis.

## Policy

A set of conditions that determine if a user may access a given resource. In Pomerium, policies can incorporate user identity, groups, device posture, or time-based rules. Policies apply to [Routes](#route) or entire [Namespaces](#namespace).

## Pomerium Policy Language (PPL)

A declarative language for writing [Authorization](#authorization-authz) policies in Pomerium. Define role-based, attribute-based, or custom logic (e.g., location, time of day, vulnerability data). This centralizes and standardizes policy creation across all protected resources.

## Reverse Proxy

A server that sits between internal services and clients, forwarding traffic to the correct backend. Unlike a forward proxy (used by clients to reach external services), a reverse proxy is set up by the service owner. Pomerium’s reverse proxy enforces [Authentication](#authentication-authn) and [Authorization](#authorization-authz), and handles TLS termination.

## Route

A path mapping an external domain (e.g., `app.company.com`) to an internal service (e.g., `app.localdomain`). Pomerium secures routes with TLS, identity headers, rewrites, load balancing, etc.

## Secure Enclave

A physically separated component of a device that safely stores and performs cryptographic operations. Pomerium can use secure enclaves to validate [Device Identity](#device-identity) and ensure only trusted devices can access sensitive resources.

## Security Keys

Physical devices used for multi-factor authentication (e.g., YubiKey, Titan Security Key). They strengthen user authentication by requiring something you physically hold.

## Service Account

A non-human identity for machine-to-machine communication or automation. Often used for monitoring services or scripts. See [Service Accounts](/docs/capabilities/service-accounts).

## Single Sign-On (SSO)

A system where one login grants access to multiple services. Pomerium supports SSO by integrating with IdPs like Google or Okta.

## Stateless

Describes how Pomerium’s Proxy, Authenticate, and Authorize services rely on Databroker for persistence. They can be replaced or scaled horizontally without losing data.

## Trusted Execution Environment (TEE)

Hardware-based isolation for sensitive operations and key storage. Pomerium can verify device posture by checking TEE metrics during [Device Identity](#device-identity) checks.

## Upstream / Downstream

- **Upstream**: The protected backend services.
- **Downstream**: Clients or end users connecting to Pomerium from the internet.

## Users and Groups

User and group data fetched from your IdP. Pomerium caches this data to avoid rate limits and speed up policy enforcement. You can refer to these users and groups in [Policies](#policy) or [Namespaces](#namespace).

## Zero Trust

A security model that assumes any network or user can be compromised. It requires continuous verification of identity, device posture, and context. See our [Zero Trust Background](/docs/concepts/zero-trust).

## Zero-trust Access

In Pomerium, each request is re-validated based on user identity, device posture, and other context factors. This continuous re-checking protects resources even if the perimeter is compromised.
