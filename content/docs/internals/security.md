---
# cSpell:ignore LGUI

title: Pomerium Security Policy
sidebar_label: Security Policy
lang: en-US
keywords: [pomerium, security, disclosure, vulnerabilities]
toc_max_heading_level: 2
---

## Security and threat model

As a context-aware access proxy, Pomerium's security model holds data confidentiality, integrity, accountability, authentication, authorization, and availability as the highest priority concerns. This page outlines Pomerium's security goals and threat model.

**Pomerium's threat model includes:**

### Validating authentication

Though not itself an identity provider, Pomerium incorporates a single sign-on flow with third-party providers to delegate authentication, and populate identity details for authorization decisions. Pomerium ensures that a request is backed by a valid user session from a trusted identity provider.

#### Authentication Cookie Handling

Pomerium automatically strips its authentication cookies (`_pomerium`) from requests before forwarding them to upstream services. This security feature:

- Prevents [credential replay attacks](https://owasp.org/www-community/attacks/Credential_Reuse_Attack)
- Ensures authentication tokens don't leak to backend services
- Requires no additional configuration

This process is handled by Pomerium's proxy and implemented in the [`clean-upstream.lua`](https://github.com/pomerium/pomerium/blob/main/config/envoyconfig/luascripts/clean-upstream.lua) script.

By removing these cookies, Pomerium maintains a clear separation between its authentication layer and your application logic, enhancing overall security. This approach addresses a common shortcoming of external authorization-style solutions like OAuth2 Proxy, which may inadvertently expose authentication tokens to backend services, increasing the risk of token theft and misuse.


### Enforcing authorization

Pomerium ensures that only authorized users can access services, or applications to which they are entitled access.

- For HTTP-based services, authorization will be made on a per-request basis.
- Otherwise, for TCP-based services, authorization will be made on a per-session basis.

### Protecting data in transit

All communication is encrypted and mutually authenticated when certificates are provided.

This applies to communication between:

- Pomerium and its services.
- Pomerium and upstream services and applications.
- Pomerium and downstream clients (for example, a user's browser or device).
- Pomerium and the databroker's storage system.

### Protecting data at rest

Sensitive data is encrypted. This applies to all data in the databroker, including:

- Session, user, and directory data; as well as any other identity or contextual data.
- Service secrets (TLS certificates or identity provider credentials).

### Ensuring availability

Pomerium aims to be fault tolerant, and horizontally scalable. Pomerium inherits [Envoy's availability threat model](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/security/threat_model#confidentiality-integrity-and-availability).

### Providing auditability and accountability

Pomerium provides logs with associated context for auditing purposes.

**Pomerium's threat model does not include:**

- Protecting against arbitrary control of a trusted third-party provider. For instance, if your identity provider is hacked, an attacker can impersonate a user in Pomerium.
- Protecting against memory analysis of a running Pomerium instance. If an attacker can attach a debugger to a running instance of Pomerium, they can inspect confidential data in flight.
- Protecting against arbitrary control of the storage backend. If an attacker controls your database, they can corrupt data.
- Protecting an upstream application's internal access control system.
- Protecting against physical access.

## Receiving security updates

The best way to receive security announcements is to subscribe to the [pomerium-announce](https://groups.google.com/g/pomerium-announce) mailing list. Any messages pertaining to a security issue will be prefixed with [security].

## Disclosure process

In general, Pomerium follows [Go's security policy](https://golang.org/security) and uses the following disclosure process:

1. Once the security report is received it is assigned a primary handler. This person coordinates the fix and release process.
2. The issue is confirmed and a list of affected software is determined.
3. Code is audited to find any potential similar problems.
4. Fixes are prepared for the most recent major releases and the head/main revision.
5. When the fixes are applied, announcements are sent to [pomerium-announce](https://groups.google.com/g/pomerium-announce).

This process can take some time. Every effort will be made to handle the bug in as timely a manner as possible, however it's important that we follow the process described above to ensure that disclosures are handled consistently.

## Reporting a security bug

Please notify us of any potential vulnerability discovered in Pomerium. We will work with you to resolve the issue promptly. Thank you for helping to keep Pomerium and our users safe! Though at this time we do not have a paid bug bounty program, we deeply appreciate any effort to discover and disclose security vulnerabilities responsibly.

All security bugs in Pomerium should be reported by email to security@pomerium.com. Your email will be acknowledged within 48 hours, and you'll receive a more detailed response to your email within 72 hours indicating the next steps in handling your report. This response policy applies only to Pomerium itself, not to our marketing or docs sites.

While researching, we'd like you to refrain from:

- Any form of Denial of Service (DoS).
- Spamming.
- Social engineering or phishing of Pomerium employees or contractors.
- Any attacks against Pomerium's physical property or data centers.

This page contains the most current version of our security guidelines, but we may revise them from time to time.
