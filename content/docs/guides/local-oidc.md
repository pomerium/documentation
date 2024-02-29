---
# cSpell:ignore qlik identityprovider

title: Local OIDC Provider
lang: en-US
keywords: [pomerium, identity access proxy, oidc, identity provider, idp]
description: This guide covers how to use Pomerium with a local OIDC provider using [qlik/simple-oidc-provider].
---

You can use the same configuration examples below for other supported [identity providers](/docs/identity-providers).

## Configure

1. When using Docker-compose:

```yaml title="docker-compose.yaml"
version: '3'
services:
  pomerium:
    image: cr.pomerium.com/pomerium/pomerium:latest
    environment:
      # Generate new secret keys. e.g. `head -c32 /dev/urandom | base64`
      - COOKIE_SECRET=<redacted>
    volumes:
      # Mount your domain's certificates : https://www.pomerium.com/docs/reference/certificates
      - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/private-key.pem:ro
      - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      # Mount your config file : https://www.pomerium.com/docs/reference/

      - ./config.yaml:/pomerium/config.yaml
    ports:
      - 443:443
      - 5443:5443
      - 17946:7946
    depends_on:
      - identityprovider

  verify:
    image: cr.pomerium.com/pomerium/verify:latest
    expose:
      - 8000

  identityprovider:
    image: qlik/simple-oidc-provider
    environment:
      - CONFIG_FILE=/etc/identityprovider.json
      - USERS_FILE=/etc/identityprovider-users.json
    volumes:
      - ./identityprovider.json:/etc/identityprovider.json:ro
      - ./identityprovider-users.json:/etc/identityprovider-users.json:ro
    ports:
      - 9000:9000
```

You can generate certificates for `*.localhost.pomerium.io` using [this instruction](/docs/concepts/certificates#certificates-2)

1. Adjust the Pomerium configuration file:

```yaml title="config.yaml"
# See detailed configuration settings : https://www.pomerium.com/docs/reference/

authenticate_service_url: https://authenticate.localhost.pomerium.io

autocert: false

certificate_file: /pomerium/cert.pem
certificate_key_file: /pomerium/private-key.pem

idp_provider_url: http://identityprovider:9000
idp_provider: oidc
idp_client_id: foo
idp_client_secret: bar

# Generate 256 bit random keys  e.g. `head -c32 /dev/urandom | base64`
cookie_secret: <redacted>

# https://pomerium.io/reference/#routes
routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - domain:
                is: example.org
```

1. Create `identityprovider.json`:

```json title="identityprovider.json"
{
  "idp_name": "http://identityprovider:9000",
  "port": 9000,
  "client_config": [
    {
      "client_id": "foo",
      "client_secret": "bar",
      "redirect_uris": [
        "https://authenticate.localhost.pomerium.io/oauth2/callback"
      ]
    }
  ],
  "claim_mapping": {
    "openid": ["sub"],
    "email": ["email", "email_verified"],
    "profile": ["name", "nickname"]
  }
}
```

1. Create `identityprovider-users.json`

```json title="identityprovider-users.json"
[
  {
    "id": "SIMPLE_OIDC_USER_ALICE",
    "email": "alice@example.org",
    "email_verified": true,
    "name": "Alice Smith",
    "nickname": "al",
    "password": "abc",
    "groups": ["Everyone", "Engineering"]
  },
  {
    "id": "SIMPLE_OIDC_USER_BOB",
    "email": "bob@example.org",
    "email_verified": true,
    "name": "Bob Smith",
    "nickname": "bobby",
    "password": "abc",
    "groups": ["Everyone", "Sales"]
  }
]
```

## Run

1. Add following entry to `/etc/hosts`:

```title="/etc/hosts"
127.0.0.1 identityprovider
```

1. Start the services:

```shell
docker-compose up -d identityprovider
: wait identityprovider up
docker-compose up -d
```

Now upon accessing `https://verify.localhost.pomerium.io` you will be redirected to OIDC server for authentication.

[identity provider]: /docs/identity-providers
[qlik/simple-oidc-provider]: https://hub.docker.com/r/qlik/simple-oidc-provider/
