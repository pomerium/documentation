---
id: pass-identity-headers
title: Pass Identity Headers
keywords:
  - reference
  - Pass Identity Headers
pagination_prev: null
pagination_next: null
---

# Pass Identity Headers

- `yaml`/`json` setting: `pass_identity_headers`
- Type: `bool`
- Optional
- Default: `false`

When enabled, this option will pass identity headers to upstream applications. These headers include:

- X-Pomerium-Jwt-Assertion
- X-Pomerium-Claim-\*
