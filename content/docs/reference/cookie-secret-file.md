---
id: cookie-secret-file
title: Cookie Secret File
description: |
  File path to a secret used to encrypt and sign session cookies.
keywords:
  - reference
  - Cookie Secret File
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `COOKIE_SECRET_FILE`
- Config File Key: `cookie_secret_file`
- Kubernetes: see [secrets](/docs/kubernetes/reference#spec)
- Type: `string`
- Required for Proxy service

Path to file containing a secret used to encrypt and sign session cookies. You can generate a random key with `head -c32 /dev/urandom | base64`.

This is useful when deploying in environments that provide secret management like [Docker Swarm](https://docs.docker.com/engine/swarm/secrets/). For example:

```yaml
cookie_secret_file: '/run/secrets/POMERIUM_COOKIE_SECRET'
```
