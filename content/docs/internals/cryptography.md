---
# cSpell:ignore secp256r1

title: Cryptography
lang: en-US
keywords: [pomerium, security, disclosure, vulnerabilities]
---
## Summary[](https://www.pomerium.com/docs/internals/cryptography#summary)

Pomerium uses cryptography to secure data in transit, at rest, and to provide guarantees around confidentiality, authenticity, and integrity between its services and upstream servers it manages access for.

## Encryption in transit[](https://www.pomerium.com/docs/internals/cryptography#encryption-in-transit)

Data in transit is protected by Transport Layer Security ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)). See our lab's [SSL Labs report](https://www.ssllabs.com/ssltest/analyze.html?d=authenticate.demo.pomerium.com&latest) .

### Downstream TLS[](https://www.pomerium.com/docs/internals/cryptography#downstream-tls)

For downstream TLS (connections from the user's client to Pomerium)

- The minimum accepted version of TLS is 1.2.
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

### Upstream TLS[](https://www.pomerium.com/docs/internals/cryptography#upstream-tls)

For upstream TLS (connections from Pomerium to the application or service)

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
- [HTTP Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) (HSTS) with a long duration is used by default.
- [Mutually authenticated](https://en.wikipedia.org/wiki/Mutual_authentication) TLS is used when client side certificates are provided.

### Hosted Control Plane

Connections between Pomerium proxy and the hosted control plane are encrypted in transit using TLS 1.3.  

For connections to the Pomerium Zero web console:

- The minimum accepted TLS version is 1.2
- TLS 1.3 is supported and preferred by the server
- For TLS 1.2 the following cipher suites are supported
    - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
    - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
    - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
    - TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
    - TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
    
    ---
    

## Encryption at rest[](https://www.pomerium.com/docs/internals/cryptography#encryption-at-rest)

### Hosted Services

Block storage is encrypted using the 256-bit [Advanced Encryption Standard](https://wikipedia.org/wiki/Advanced_Encryption_Standard) (AES-256), or better, with symmetric keys. The encryption is done using a [FIPS 140-2 validated](https://cloud.google.com/security/compliance/fips-140-2-validated?hl=en) module. Furthermore, encryption is used throughout the infrastructure used to host the service according to the practices described in the Google [default encryption guide](https://cloud.google.com/docs/security/encryption/default-encryption?hl=en#hardware).

For sensitive data, we employ field level encryption to securely store the values.  These values are encrypted with AES-256-GCM using keys distinct from those used to encrypt the block storage. 

### Enterprise Console

Confidential data stored at rest is encrypted using the [authenticated encryption with associated data](https://en.wikipedia.org/wiki/Authenticated_encryption) construction [XChaCha20-Poly1305](https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction) with 196-bit nonces. Nonces are randomly generated for every encrypted object. When data is read, the authentication tag is checked for tampering.

Encryption of the underlying block storage is the responsibility of the customer to meet their requirements in their environment.