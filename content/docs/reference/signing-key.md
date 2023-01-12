---
id: signing-key
title: Signing Key
description: |
  Signing Key is one or more PEM-encoded private keys used to sign a user's attestation JWT which can be consumed by upstream applications to pass along identifying user information like username, id, and groups. If multiple keys are provided only the first will be used for signing.
keywords:
  - reference
  - Signing Key
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `SIGNING_KEY`
- Config File Key: `signing_key`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string`
- Optional

Signing Key is one or more PEM-encoded private keys used to sign a user's attestation JWT which can be consumed by upstream applications to pass along identifying user information like username, id, and groups. If multiple keys are provided only the first will be used for signing.

If set, the signing key's public key(s) can be retrieved by hitting Pomerium's well-known JWKS endpoint (`/.well-known/pomerium/jwks.json`), which lives on the authenticate service. Otherwise, the endpoint will return an empty keyset.

For example, assuming you have [generated an ES256 key](https://github.com/pomerium/pomerium/blob/main/scripts/generate_self_signed_signing_key.sh) with the following commands:

```bash
# Generates an P-256 (ES256) signing key
openssl ecparam  -genkey  -name prime256v1  -noout  -out ec_private.pem
# careful! this will output your private key in terminal
cat ec_private.pem | base64
```

You can access that signing key from Pomerium's well-known JWKS endpoint.

```bash
curl https://authenticate.int.example.com/.well-known/pomerium/jwks.json | jq
```

```json
{
  "keys": [
    {
      "use": "sig",
      "kty": "EC",
      "kid": "ccc5bc9d835ff3c8f7075ed4a7510159cf440fd7bf7b517b5caeb1fa419ee6a1",
      "crv": "P-256",
      "alg": "ES256",
      "x": "QCN7adG2AmIK3UdHJvVJkldsUc6XeBRz83Z4rXX8Va4",
      "y": "PI95b-ary66nrvA55TpaiWADq8b3O1CYIbvjqIHpXCY"
    }
  ]
}
```

If multiple keys are supplied in the PEM data, all of them will be published to the JWKS endpoint.

If no certificate is specified, one will be generated and the base64'd public key will be added to the logs. Note, however, that this key is unique to each service, ephemeral, and will not be accessible via the authenticate service's well-known JWKS endpoint.

### Key rotation

To implement key rotation, follow a 3-step process:

1. Generate a new key and add it to the existing PEM data.
2. Swap the order of the keys in the PEM data so that the new key is first and will be used for all subsequent signing.
3. Remove the old key from the list.

With sufficient time between the steps, this process should be resilient to caching of the JWKS endpoint by applications.
