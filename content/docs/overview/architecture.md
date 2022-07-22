---
title: Architecture
lang: en-US
keywords: [pomerium, architecture]
---

## Basic Architecture

Pomerium sits between end users and services requiring strong authentication. After verifying identity with your identity provider (IdP), Pomerium uses a configurable policy to decide how to route your user's request and if they are authorized to access the service.

![pomerium architecture diagram](./img/pomerium-system-context.svg)

## Databroker Storage

By default, Pomerium uses in-memory databroker storage. This is fine for testing, but any deployment should also include Postgres for databroker storage.

![pomerium architecture diagram](./img/pomerium-system-context-postgres.svg)

## Distributed Architecture

In addition to making data persist across restarts, a shared databroker storage allows Pomerium to scale horizontally:

![pomerium architecture diagram](./img/pomerium-system-context-distributed.svg)

Each instance of Pomerium can be deployed independently of the others, using various installation methods (system daemon, Docker, Kubernetes, etc), so long as they all:

 - Have access to the databroker
 - Have the same access to internal routes specified.

<details>
<summary>Component Level</summary>

:::caution
This section details the individual components that make up Pomerium. While you can choose to run and scale these components individually, we've found limited use cases where this is advantageous over distributed all-in-one mode.
:::

Pomerium is composed of 4 logical components:

- Proxy Service

  - All user traffic flows through the proxy
  - Verifies all requests with Authentication service
  - Directs users to Authentication service to establish session identity
  - Processes policy to determine external/internal route mappings

- Authentication Service

  - Handles authentication flow to your IdP as needed
  - Handles identity verification after initial Authentication
  - Establishes user session cookie
  - Stores user OIDC tokens in databroker service

- Authorization Service

  - Processes policy to determine permissions for each service
  - Handles authorization check for all user sessions
  - Directs Proxy service to initiate Authentication flow as required
  - Provides additional security related headers for upstream services to consume

- Data Broker Service

  - Retrieves identity provider related data such as group membership
  - Stores and refreshes identity provider access and refresh tokens
  - Provides streaming authoritative session and identity data to Authorize service
  - Stores session and identity data in persistent storage

In specific use cases, it may be benefitial to deploy each component [separately](/docs/reference/service-mode). This allows you to limit external attack surface, as well as scale and manage the services independently.

![pomerium architecture diagram](img/pomerium-container-context.svg)

</details>

## Authentication Flow

Pomerium's internal and external component interactions during full authentication from a fresh user are diagramed below.

After initial authentication to provide a session token, only the authorization check interactions occur.

![pomerium architecture diagram](img/pomerium-auth-flow.svg)
