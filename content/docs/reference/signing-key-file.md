---
id: signing-key-file
title: Signing Key File
description: |
  File path to a secret containing the signing key.
keywords:
  - reference
  - Signing Key File
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `SIGNING_KEY_FILE`
- Config File Key: `signing_key_file`
- Kubernetes: see [bootstrap `secrets`](/docs/deploying/k8s/reference#spec)
- Type: `string`
- Optional

Path to a file containing a [Signing Key](./signing-key), the private key used to sign a user's attestation JWT which can be consumed by upstream applications to pass along identifying user information like username, id, and groups.

See [Signing Key](./signing-key) for more information.

This is useful when deploying in environments that provide secret management like [Docker Swarm](https://docs.docker.com/engine/swarm/secrets/). For example:

```yaml
signing_key_file: '/run/secrets/POMERIUM_SIGNING_KEY'
```
