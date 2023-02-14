---
id: jwt-claim-headers
title: JWT Claim Headers
description: |
  The JWT Claim Headers setting allows you to pass specific user session data to upstream applications as HTTP request headers and additional JWT claims.
keywords:
  - reference
  - JWT Claim Headers
  - jwt_claim_headers
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `JWT_CLAIMS_HEADERS`
- Config File Key: `jwt_claims_headers`
- Kubernetes: see [`jwtClaimHeaders`](/docs/deploying/k8s/reference#spec)
- Type: slice of `string`
- Example: `email`, `groups`, `user`, `given_name`
- Optional

The JWT Claim Headers setting allows you to pass specific user session data to upstream applications as HTTP request headers. Note, unlike the header `x-pomerium-jwt-assertion` these values are not signed by the authorization service.

Additionally, this will add the claim to the `X-Pomerium-Jwt-Assertion` header provided by [`pass_identity_headers`](/docs/reference/routes/pass-identity-headers), if not already present.

Any claim in the pomerium session JWT can be placed into a corresponding header and the JWT payload for upstream consumption. This claim information is sourced from your Identity Provider (IdP) and Pomerium's own session metadata. The header will have the following format:

`X-Pomerium-Claim-{Name}` where `{Name}` is the name of the claim requested. Underscores will be replaced with dashes; e.g. `X-Pomerium-Claim-Given-Name`.

This option also supports a nested object to customize the header name. For example:

```yaml
jwt_claims_headers:
  X-Email: email
```

Will add an `X-Email` header with a value of the `email` claim.

Use this option if you previously relied on `x-pomerium-authenticated-user-{email|user-id|groups}`.

To pass static values as request headers to the upstream service, see [Set Request Headers](./routes/set-request-headers).
