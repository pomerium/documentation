---
# cSpell:ignore hedgedoc addport privkey USESSL

title: Securing HedgeDoc with Pomerium
sidebar_label: HedgeDoc
lang: en-US
keywords: [pomerium, HedgeDoc, authentication, authorization]
description: Learn how to control access to your HedgeDoc web application behind Pomerium.
---

# HedgeDoc

In this guide, you'll learn how to run a HedgeDoc web application behind Pomerium. You'll also add an authorization policy that enables Pomerium to grant or deny access based on policy criteria.

## What is HedgeDoc?

[HedgeDoc](https://hedgedoc.org/) is a collaborative, web-based Markdown editor that allows you to create notes, graphs, and diagrams in your browser. You can share a link to your documents with other members of your organization so you can collaborate in real time.

## How to secure HedgeDoc with Pomerium

HedgeDoc is an open-source project that you can serve behind a [reverse proxy](https://docs.hedgedoc.org/guides/reverse-proxy/).

In this guide, you'll configure Pomerium to authenticate and authorize users. To do this, you'll add an authorization policy that grants or denies access based on the policy criteria.

### Before you start

To complete this guide, you need:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [mkcert](https://github.com/FiloSottile/mkcert#installation)

:::note

If you completed our [**Quickstart guide**](/docs/get-started/quickstart), you should have a working Pomerium project with the following YAML files:

- `config.yaml`
- `docker-compose.yaml`

If you haven't completed the Quickstart:

- Create a `config.yaml` file for your Pomerium configuration
- Create a `docker-compose.yaml` file for your Docker configuration

:::

### Set up Pomerium

Add the following configuration to `config.yaml`:

```yaml
authenticate_service_url: https://authenticate.pomerium.app

certificate_file: /pomerium/cert.pem
certificate_key_file: /pomerium/privkey.pem

routes:
  - from: https://hedgedoc.localhost.pomerium.io
    to: http://hedgedoc:3000
    allow_websockets: true
    policy:
      - allow:
          or:
            - email:
                # Replace with your email address
                is: user@example.com
```

#### Create a wildcard TLS certificate

HedgeDoc requires an encrypted TLS connection to add and manage users. For the purposes of this guide, you will use `mkcert` to generate local development certificates:

1. Install `mkcert` with these [instructions](https://github.com/FiloSottile/mkcert#installation)
1. Create a trusted **rootCA**:

```bash
mkcert -install
```

1. Create a wildcard certificate for `*.localhost.pomerium.io`:

```bash
mkcert '*.localhost.pomerium.io'
```

This creates two files in your working directory:

- `_wildcard.localhost.pomerium.io.pem`
- `_wildcard.localhost.pomerium.io-key.pem`

In the next section, you'll bind mount these certificates in a Docker Compose file.

### Set up HedgeDoc

In your `docker-compose.yaml` file, add the following services:

```yaml
services:
  pomerium:
    image: cr.pomerium.com/pomerium/pomerium:latest
    volumes:
      # Mount your certificates
      - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/privkey.pem:ro
      # Mount your config file: https://www.pomerium.com/docs/reference/
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
  database:
    image: postgres:13.4-alpine
    environment:
      - POSTGRES_USER=hedgedoc
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=hedgedoc
    volumes:
      - database:/var/lib/postgresql/data
    restart: always
  hedgedoc:
    # Make sure to use the latest release from https://hedgedoc.org/latest-release
    image: quay.io/hedgedoc/hedgedoc:1.9.9
    environment:
      - CMD_DB_URL=postgres://hedgedoc:password@database:5432/hedgedoc
      - CMD_DOMAIN=hedgedoc.localhost.pomerium.io
      - CMD_URL_ADDPORT=false
      - CMD_EMAIL=true
      - CMD_ALLOW_EMAIL_REGISTER=true
      # Replace cookie session secret
      - CMD_SESSION_SECRET=<replace_session_secret>
      - CMD_PROTOCOL_USESSL=true
    volumes:
      - uploads:/hedgedoc/public/uploads
    ports:
      - '3000:3000'
    restart: always
    depends_on:
      - database
volumes:
  database:
  uploads:
```

> See the [HedgeDoc - Configuration](https://docs.hedgedoc.org/configuration/#configuration) page for more information on configuration keys and environment variables.

#### Generate a session secret

HedgeDoc requires a session secret to sign session cookies. If you don't add a session secret, HedgeDoc generates a random one for you upon startup, which will end any active sessions and sign out your users.

Adding a session secret will allow you to resume a session even if you stop your Docker services.

To generate a secret, run:

```shell-session
$ head -c32 /dev/urandom | base64
  MPGHgArlo81ohUoMtDtv8qCBLJu0lwXDCPcrml0wF2Q=
```

Replace the value of `CMD_SESSION_SECRET` with the output:

```yaml
- CMD_SESSION_SECRET=MPGHgArlo81ohUoMtDtv8qCBLJu0lwXDCPcrml0wF2Q=
```

#### TLS in HedgeDoc

To configure HedgeDoc to use HTTPS:

- Set `CMD_PROTOCOL_USESSL` to `true`
- Set `CMD_ADDPORT` to `false`

## Run HedgeDoc and Pomerium

Run Docker Compose:

```bash
docker compose up
```

Navigate to `https://hedgedoc.localhost.pomerium.io/` to access HedgeDoc.

Pomerium will prompt you to authenticate:

![Signing in to Pomerium's identity provider](./img/hedgedoc/cognito-idp.png)

After successful authentication, Pomerium will redirect you to your HedgeDoc URL:

![The HedgeDoc homepage](./img/hedgedoc/hedgedoc-homepage.png)

## Add a user

1. Select **Sign In**
1. Enter an **E-Mail** and **Password**
1. Select **Register**

When you sign in, HedgeDoc will take you to your user dashboard:

![Secured HedgeDoc user dashboard page](./img/hedgedoc/user-dashboard.png)

If you check the connection, you'll notice it's secure. Now, you can write your first note and share it with users within your network:

![Adding a note in HedgeDoc](./img/hedgedoc/hedgedoc-note.png)
