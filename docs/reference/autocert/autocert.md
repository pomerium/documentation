---
id: autocert
title: Autocert
slug: /reference/autocert/autocert
description: |
  Turning on autocert allows Pomerium to automatically retrieve, manage, and renew public facing TLS certificates from Lets Encrypt.
keywords:
- reference
- Autocert
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `AUTOCERT`
- Config File Key: `autocert`
- Type: `bool`
- Optional

Turning on autocert allows Pomerium to automatically retrieve, manage, and renew public facing TLS certificates from [Let's Encrypt][letsencrypt] which includes managed routes and the authenticate service.  [Autocert Directory](#autocert-directory) must be used with Autocert must have a place to persist, and share certificate data between services. Note that autocert also provides [OCSP stapling](https://en.wikipedia.org/wiki/OCSP_stapling).

This setting can be useful in situations where you may not have Pomerium behind a TLS terminating ingress or proxy that is already handling your public certificates on your behalf.

:::warning

By using autocert, you agree to the [Let's Encrypt Subscriber Agreement](https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf). There are [_strict_ usage limits](https://letsencrypt.org/docs/rate-limits/) per domain you should be aware of. Consider testing with `autocert_use_staging` first.

:::

:::warning

Autocert requires that ports `80`/`443` be accessible from the internet in order to complete a [TLS-ALPN-01 challenge](https://letsencrypt.org/docs/challenge-types/#tls-alpn-01).

:::
