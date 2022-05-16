---
id: shared-secret
title: Shared Secret
description: |
  Shared Secret is the base64 encoded 256-bit key used to mutually authenticate requests between services.
keywords:
- reference
- Shared Secret
pagination_prev: null
pagination_next: null
---


# Shared Secret
- Environmental Variable: `SHARED_SECRET`
- Config File Key: `shared_secret`
- Type: [base64 encoded] `string`
- Required

Shared Secret is the base64 encoded 256-bit key used to mutually authenticate requests between services. It's critical that secret keys are random, and stored safely. Use a key management system or `/dev/urandom` to generate a key. For example:

```
head -c32 /dev/urandom | base64
```

