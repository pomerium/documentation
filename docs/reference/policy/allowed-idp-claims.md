---
id: allowed-idp-claims
title: Allowed IdP Claims
description: |
  Authorize users by matching claims attached to a user's identity token by their identity provider
keywords:
- reference
- Allowed IdP Claims
---


# Allowed IdP Claims
- `yaml`/`json` setting: `allowed_idp_claims`
- Type: map of `strings` lists
- Required

Allowed IdP Claims is a collection of whitelisted claim key-value pairs to authorize for a given route.

This is useful if your identity provider has extra information about a user that is not in the directory.  It can also be useful if you wish to use groups with the generic OIDC provider.

Example:

```yaml
  - from: http://from.example.com
    to: http://to.example.com
    allowed_idp_claims:
      family_name:
        - Doe
        - Smith
```

This policy would match users with the `family_name` claim containing `Smith` or `Doe`.

Claims are represented as a map of strings to a list of values:

```json
{
  "family_name": ["Doe"],
  "given_name": ["John"]
}
```

- Nested maps are flattened: `{ "a": { "b": ["c"] } }` becomes `{ "a.b": ["c"] }`
- Values are always a list: `{ "a": "b" }` becomes `{ "a": ["b"] }`

