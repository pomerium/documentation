---
id: shared-secret-file
title: Shared Secret File
description: |
  Shared Secret is the base64 encoded 256-bit key used to mutually authenticate requests between services.
keywords:
  - reference
  - Shared Secret File
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `SHARED_SECRET_FILE`
- Config File Key: `shared_secret_file`
- Type: `string`
- Required (unless using [shared_secret])

Shared Secret File is the location of a file containing the base64 encoded 256-bit key used to mutually authenticate requests between services. It's critical that secret keys are random, and stored safely. Use a key management system or `/dev/urandom` to generate a key. For example:

```sh
head -c32 /dev/urandom | base64
```

`shared_secret_file` points to a file containing the secret. This is useful when deploying in environments that provide secret management like [Docker Swarm](https://docs.docker.com/engine/swarm/secrets/). For example:

```yaml
shared_secret_file: '/run/secrets/POMERIUM_SHARED_SECRET'
```

:::tip If you adjust your shared secret and/or how it's accessed by Pomerium, you may create a [secret mismatch](/docs/internals/troubleshooting#redis-secret-mismatch). :::

[shared_secret]: ./shared-secret
