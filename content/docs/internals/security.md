---
# cSpell:ignore LGUI

title: Pomerium's Security Policy & Threat Model
sidebar_label: Security & Threat Model
lang: en-US
keywords:
  [pomerium, security, disclosure, vulnerabilities, cryptography, encryption]
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

This approach addresses a common shortcoming of external authorization-style solutions like OAuth2 Proxy, which may inadvertently expose authentication tokens to backend services, increasing the risk of token theft and misuse. By removing these cookies, Pomerium maintains a clear separation between its authentication layer and your application logic, enhancing overall security.

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

## Cryptography

Pomerium uses cryptography to secure data in transit, at rest, and to provide guarantees around confidentiality, authenticity, and integrity between its services and upstream servers it manages access for.

### Encryption in transit

Data in transit is protected by [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS). See our lab's [SSL Labs report](https://www.ssllabs.com/ssltest/analyze.html?d=authenticate.demo.pomerium.com&latest).

### Downstream TLS

For downstream TLS (connections from the user's client to Pomerium):

- The minimum accepted version of TLS is 1.2
- For TLS 1.2, the following cipher suites are offered, in this order:
  - ECDHE-ECDSA-AES256-GCM-SHA384
  - ECDHE-RSA-AES256-GCM-SHA384
  - ECDHE-ECDSA-AES128-GCM-SHA256
  - ECDHE-RSA-AES128-GCM-SHA256
  - ECDHE-ECDSA-CHACHA20-POLY1305
  - ECDHE-RSA-CHACHA20-POLY1305
- The following elliptic curves are offered, in this order:
  - X25519
  - NIST P-256

#### Upstream TLS

For upstream TLS (connections from Pomerium to the application or service):

- The minimum accepted version of TLS is 1.2
- For TLS 1.2, the following cipher suites are supported:
  - ECDHE-ECDSA-AES256-GCM-SHA384
  - ECDHE-RSA-AES256-GCM-SHA384
  - ECDHE-ECDSA-AES128-GCM-SHA256
  - ECDHE-RSA-AES128-GCM-SHA256
  - ECDHE-ECDSA-CHACHA20-POLY1305
  - ECDHE-RSA-CHACHA20-POLY1305
  - ECDHE-ECDSA-AES128-SHA
  - ECDHE-RSA-AES128-SHA
  - AES128-GCM-SHA256
  - AES128-SHA
  - ECDHE-ECDSA-AES256-SHA
  - ECDHE-RSA-AES256-SHA
  - AES256-GCM-SHA384
  - AES256-SHA
- The following elliptic curves are supported:
  - X25519
  - NIST P-256
  - NIST P-384
  - NIST P-521
- [HTTP Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) (HSTS) with a long duration is used by default
- [Mutually authenticated](https://en.wikipedia.org/wiki/Mutual_authentication) TLS is used when client side certificates are provided

#### Hosted Control Plane

Connections between Pomerium proxy and the hosted control plane are encrypted in transit using TLS 1.3.

For connections to the Pomerium Zero web console:

- The minimum accepted TLS version is 1.2
- TLS 1.3 is supported and preferred by the server
- For TLS 1.2, the following cipher suites are supported:
  - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
  - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
  - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
  - TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
  - TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
  ***

### Encryption at rest[](https://www.pomerium.com/docs/internals/cryptography#encryption-at-rest)

#### Hosted Services

Block storage is encrypted using the 256-bit [Advanced Encryption Standard](https://wikipedia.org/wiki/Advanced_Encryption_Standard) (AES-256), or better, with symmetric keys. The encryption is done using a [FIPS 140-2 validated](https://cloud.google.com/security/compliance/fips-140-2-validated?hl=en) module. Furthermore, encryption is used throughout the infrastructure used to host the service according to the practices described in the Google [default encryption guide](https://cloud.google.com/docs/security/encryption/default-encryption?hl=en#hardware).

For sensitive data, we employ field level encryption to securely store the values. These values are encrypted with AES-256-GCM using keys distinct from those used to encrypt the block storage.

#### Enterprise Console

Confidential data stored at rest is encrypted using the [authenticated encryption with associated data](https://en.wikipedia.org/wiki/Authenticated_encryption) construction [XChaCha20-Poly1305](https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction) with 196-bit nonces. Nonces are randomly generated for every encrypted object. When data is read, the authentication tag is checked for tampering.

Encryption of the underlying block storage is the responsibility of the customer to meet their requirements in their environment.
