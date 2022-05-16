---
id: insecure-server
title: Insecure Server
description: |
  Turning on insecure server mode will result in pomerium starting, and operating without any protocol encryption in transit.
keywords:
- reference
- Insecure Server
pagination_prev: null
pagination_next: null
---


# Insecure Server
- Environmental Variable: `INSECURE_SERVER`
- Config File Key: `insecure_server`
- Type: `bool`
- Required if certificates unset

Turning on insecure server mode will result in pomerium starting, and operating without any protocol encryption in transit.

This setting can be useful in a situation where you have Pomerium behind a TLS terminating ingress or proxy. However, even in that case, it is highly recommended to use TLS to protect the confidentiality and integrity of service communication even behind the ingress using self-signed certificates or an internal CA. Please see our helm-chart for an example of just that.

:::warning

Pomerium should _never_ be exposed to the internet without TLS encryption.

:::

