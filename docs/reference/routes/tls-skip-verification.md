---
id: tls-skip-verification
title: TLS Skip Verification
keywords:
- reference
- TLS Skip Verification
---


# TLS Skip Verification
- Config File Key: `tls_skip_verify`
- Type: `bool`
- Default: `false`

TLS Skip Verification controls whether the Pomerium Proxy Service verifies the upstream server's certificate chain and host name. If enabled, Pomerium accepts any certificate presented by the upstream server and any host name in that certificate. In this mode, TLS is susceptible to man-in-the-middle attacks. This should be used only for testing.

