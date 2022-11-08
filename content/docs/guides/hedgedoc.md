
---
title: Securing Hedgedoc with Pomerium
sidebar_label: Hedgedoc
lang: en-US
keywords: [pomerium, identity access proxy, data, logging, graphing, Hedgedoc, authentication, authorization]
description: This guide covers how to use Pomerium to authenticate and authorize users of Hedgedoc.
---

# HedgeDoc

 Use Pomerium to secure access to HedgeDoc by providing identity and context. 

 ## What is HedgeDoc?

[HedgeDoc](https://hedgedoc.org/) is a collaborative, web-based Markdown editor that allows you to create notes, graphs, and diagrams in your browser. 

You can share a link to your document with other members of your organization so you can collaborate in real time.

 ## Integrate Pomerium with HedgeDoc
 
 HedgeDoc is open-source, self-hosted software that allows you to configure authentication and authorization with a [reverse proxy](https://docs.hedgedoc.org/guides/reverse-proxy/). 
 
 You can configure Pomerium so that it authenticates and authorizes users against an Identity Provider (IdP) before users can access HedgeDoc's services.

The flow looks like this: 

1. User requests to access the secured app
2. Pomerium proxy identifies user
3. Pomerium proxy checks if user is authorized to access routes defined in the authorization [`policy`](https://www.pomerium.com/docs/reference/routes/policy)
4. If authorized, Pomerium proxy authenticates user against IdP
5. After IdP establishes user's identity, Pomerium proxy checks permissions against the secured app
6. User can make authorized requests in the secured app

![Pomerium IAP flow](img/pom-auth-flow.png)

### Set up your environment
This guide uses Docker containers to create the minimal development environment required to run Pomerium with another service. Visit the [Pomerium using Docker](https://www.pomerium.com/docs/install/quickstart) quickstart for more information.

To complete this guide, you need: 
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- A running Pomerium instance
- A [preconfigured IdP](https://www.pomerium.com/docs/identity-providers)

> **Note:** This guide uses [GitHub](https://www.pomerium.com/docs/identity-providers/github) as the preconfigured IdP.

### Pomerium configuration

Your Pomerium configuration file must include a [Cookie Secret](https://www.pomerium.com/docs/reference/cookie-secret) and a [Secret Key](https://www.pomerium.com/docs/reference/signing-key). 

To create a Cookie Secret, run the following command in your terminal: 
```bash
head -c32 /dev/urandom | base64
```

To create a Secret Key, run the following command: 
```bash
cat ec_private.pem | base64
```

>**Note:** This guide assumes you've generated self-signed wildcard certificates. Check [Certificates](https://www.pomerium.com/docs/topics/certificates#self-signed-wildcard-certificate) for more information.

Place your `cookie_secret` and `secret_key` in your `config.yaml` file: 

```yaml
cookie_secret: <cookie secret>
signing_key: <signing key>
```

Lastly, you must enable your Pomerium proxy to enable [Websocket Connections](https://www.pomerium.com/docs/reference/routes/websocket-connections):

```yaml
allow_websockets: true
```

To see if Pomerium is configured correctly, run the following command in your terminal: 

```bash
docker-compose up
```

Navigate to `https://authenticate.localhost.pomerium.io`. Your Pomerium proxy will redirect you to your GitHub OAuth app, where you can authorize the OAuth app to access your GitHub account.

![GitHub IdP sign-in prompt](img/sign-in-gh.png)

Navigate to `https://authenticate.localhost.pomerium.io/.pomerium/` to see your User Details:

![Pomerium User Details](img/user-details.png)

Congratulations! You've successfully configured and run Pomerium.

### Secure HedgeDoc

In your `docker-compose.yaml` file, add the following code under your Pomerium services: 

```yaml
# verify:
#     image: pomerium/verify:latest
#     expose:
#       - 8000
---

database:
    image: postgres:13.4-alpine
    environment:
      - POSTGRES_USER=hedgedoc
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=hedgedoc
    volumes:
      - database:/var/lib/postgresql/data
    restart: always
  app:
    # Make sure to use the latest release from https://hedgedoc.org/latest-release
    image: quay.io/hedgedoc/hedgedoc:1.9.4
    environment:
      - CMD_DB_URL=postgres://hedgedoc:password@database:5432/hedgedoc
      - CMD_DOMAIN=localhost
      - CMD_URL_ADDPORT=true
      - CMD_EMAIL=true
      - CMD_ALLOW_EMAIL_REGISTER=true
      - CMD_SESSION_SECRET=<session secret>
    volumes:
      - uploads:/hedgedoc/public/uploads
    ports:
      - "3000:3000"
    restart: always
    depends_on:
      - database
volumes:
  database:
  uploads:
```
You must add a session secret. If you don't, HedgeDoc will randomly generate a secret, which will log out all users. 

To generate a session secret, run the following command in your terminal: 

```bash
pwgen -s 64 1
```

Now, run `docker-compose up`

Navigate to `http://localhost:3000` to access HedgeDoc:

![HedgeDoc service](../img/hedgedoc.png)

Great job! You've secured HedgeDoc using Pomerium's identity-aware proxy. 

#### Resources:
- [Pomerium documentation](https://www.pomerium.com/docs)
- [HedgeDoc documentation](https://docs.hedgedoc.org/)
- [Pomerium reference doc](https://www.pomerium.com/docs/reference)