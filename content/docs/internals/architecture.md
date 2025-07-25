---
title: Architecture
lang: en-US
description: Pomerium verifies identity with your IdP and uses a configurable policy to route requests and decide if a user is authorized to access the service.
keywords: [pomerium, architecture]
---

## System Level

Pomerium sits between end users and services requiring strong authentication. After verifying identity with your identity provider (IdP), Pomerium uses a configurable policy to decide how to route your user's request and if they are authorized to access the service. ([What's the difference between Authentication and Authorization?](https://www.pomerium.com/blog/authentication-v-authorization/))

![pomerium architecture diagram](./img/architecture/pomerium-system-context.svg)

## Component level

Pomerium is composed of four logical components:

### Proxy service

The Proxy service receives requests from the client and routes requests between the client, upstream services, and other Pomerium components.

The following steps outline how the Proxy service handles a request at a high level:

1. The client makes a request to access the target resource
1. The Proxy service receives the request and sends a gRPC call to the Authorization service, which evaluates policy
1. If the Authorization service doesn't see a session cookie, the Proxy service redirects the request to the Authentication service to verify the client's identity
1. After the Authentication service verifies the client's identity and saves a local session cookie, the Proxy service sends the session data to the Databroker service over a gRPC call
1. Before redirecting the client to the target resource, the Proxy service checks permissions with the Authorization service, then maps a route based on the internal and external routes defined in the route's policy

### Authentication service

The Authentication service is responsible for authenticating users against an Identity Provider (IdP) and establishing user sessions. By incorporating OAuth 2.0 and OIDC protocols into the authentication flow, the Authentication service provides single sign-on authentication that enables it to extract user identity details and session data necessary for managing Pomerium sessions.

At a high level, when the Authentication service first receives a request from the Proxy service, it:

1. Redirects the client to the IdP to sign in
1. Completes the authentication flow with the IdP and extracts relevant session data, such as device credentials, user ID, issuance and expiration times, OAuth tokens, and any OIDC claims (scopes) provided by the IdP
1. Saves session data to a local session cookie and redirects the client with session data encrypted in URL parameters to the Proxy service
1. Signs the user in after the session expires

### Authorization service

The Authorization service processes policies to determine what permissions the client has. Each request sent by the client must first go through an authorization check before the Proxy service proxies the request.

When the Authorization service receives a request from the Proxy service, the following actions take place:

1. The Authorization service first looks for a session cookie, which contains the client's JWT. If no session cookie is present, the Authorization service returns a redirect response, prompting the browser to authenticate through the Authentication service to establish session identity.
1. Once a session cookie is in place, the Proxy service makes a gRPC call to the Authorization service so it can determine permissions based on JWT claims and policy.
1. The Authorization service then constructs security headers based on JWT claims, which the Proxy service forwards to upstream applications.
1. With each subsequent request, the Authorization service employs on-demand caching to query the Databroker service for updates to session state.

### Databroker service

The Databroker service manages state in Pomerium. It is an essential component that stores [sessions](/docs/internals/sessions), user claims, tokens, devices, directory data, and other external data sources. When using Enterprise Console, Ingress Controller, or Zero, the Databroker also stores Pomerium configuration itself.

#### Design

The Databroker is modeled as a key-value store of "records". A record is defined as:

```protobuf
message Record {
  uint64 version = 1;
  string type = 2;
  string id = 3;
  google.protobuf.Any data = 4;
  google.protobuf.Timestamp modified_at = 5;
  google.protobuf.Timestamp deleted_at = 6;
}
```

The Databroker provides a gRPC interface for storing and retrieving records, along with these additional features:

- **Leases**: Ensures only one instance performs certain actions when multiple Pomerium instances are running (e.g., only one databroker refreshes user sessions)
- **Querying**: Supports efficient indexing including CIDR indexing for GeoIP data
- **Capacity Limits**: Number of records per type can be limited (e.g., event records limited to last 50 events)
- **Streaming**: Records can be streamed to clients via:
  - **Sync**: Stream record changes as they occur (including deletes)
  - **SyncLatest**: Stream the latest version of each record
- **Server Versioning**: RPC methods include server version to signal when clients need to reset their state

Clients utilize streaming endpoints to maintain cached, local copies of data, often bypassing the need for direct Databroker queries.

The Databroker's key responsibilities include:

- Once a client is authenticated, the Proxy server makes a gRPC call to the Databroker to persist session data and identity information
- The Authorization service queries the Databroker on-demand to keep the two services in sync
- It functions as an identity manager, refreshing user sessions against the IdP until a Pomerium session has expired

#### Storage Backends

The Databroker supports two [storage backends](/docs/internals/data-storage#backends):

**[In-Memory Storage Backend](/docs/internals/data-storage#in-memory)**

The in-memory backend stores all data in maps, linked-lists, bart tables, and b-trees depending on indexing needs. Key characteristics:

- Requires no configuration
- Provides high performance
- Supports only a single replica
- All state is lost on restart
- Each restart generates a new random server version

**[Postgres Storage Backend](/docs/internals/data-storage#postgresql)**

The Postgres backend stores all data in indexed SQL tables with operations implemented as SQL queries. Key features:

- Support for multiple replicas with read/write capabilities
- Persistence across restarts
- Change notification between replicas via LISTEN/NOTIFY functions
- Built-in support for advanced indexing (including CIDR for IP addresses)

For configuration details, see [Databroker Storage Settings](/docs/reference/databroker).

In production deployments, it is recommended that you deploy each component [separately](/docs/reference/service-mode). This allows you to limit external attack surface, as well as scale and manage the services independently.

In test deployments, all four components may run from a [single binary and configuration](/docs/internals/configuration#all-in-one-vs-split-service-mode).

![pomerium architecture diagram](./img/architecture/pomerium-container-context-stateless-authn.svg)

## High Availability

Pomerium supports minimum downtime high availability. When using the [Postgres storage backend](/docs/reference/databroker#databroker-storage-type), you can run multiple replicas of each Pomerium service (Authenticate, Authorize, Proxy, and Databroker) to provide redundancy and scale.

High availability configurations typically involve:

- Multiple replicas of each Pomerium service
- Load balancing across service instances
- Postgres database with replication for data persistence
- Geographic distribution for disaster recovery

### Multi-Cluster Deployment

A typical multi-cluster Pomerium deployment demonstrates the high availability architecture:

```mermaid
---
title: Pomerium Multi-Cluster Architecture
---
flowchart TD
  subgraph Pomerium Cluster B
    pomerium_authenticate_b@{ shape: procs, label: "Authenticate" }
    pomerium_authorize_b@{ shape: procs, label: "Authorize" }
    pomerium_databroker_b@{ shape: procs, label: "Databroker" }
    pomerium_proxy_b@{ shape: procs, label: "Proxy" }

    pomerium_proxy_b --> pomerium_authorize_b
    pomerium_proxy_b --> pomerium_databroker_b
    pomerium_authenticate_b --> pomerium_databroker_b
    pomerium_authorize_b --> pomerium_databroker_b
  end
  subgraph Pomerium Cluster A
    pomerium_authenticate_a@{ shape: procs, label: "Authenticate" }
    pomerium_authorize_a@{ shape: procs, label: "Authorize" }
    pomerium_databroker_a@{ shape: procs, label: "Databroker" }
    pomerium_proxy_a@{ shape: procs, label: "Proxy" }

    pomerium_proxy_a --> pomerium_authorize_a
    pomerium_proxy_a --> pomerium_databroker_a
    pomerium_authenticate_a --> pomerium_databroker_a
    pomerium_authorize_a --> pomerium_databroker_a
  end
  subgraph Postgres B
    postgres_master_b[(Master)] --> postgres_replica_b[(Replica)]
  end
  subgraph Postgres A
    postgres_master_a[(Master)] --> postgres_replica_a[(Replica)]
  end
  client[Client] --> load_balancer[Load Balancer]

  pomerium_databroker_a --> postgres_master_a
  pomerium_databroker_b --> postgres_master_b
  load_balancer --> pomerium_proxy_a
  load_balancer --> pomerium_authenticate_a
  load_balancer --> pomerium_proxy_b
  load_balancer --> pomerium_authenticate_b
```

This architecture shows:

- Multiple Pomerium clusters for redundancy
- Each cluster with its own Postgres instance
- Load balancer distributing traffic between clusters
- Independent scaling of each service component

## The lifecycle of a request

The diagram below shows how Pomerium's components communicate when authenticating a user.

After initial authentication to provide a session token, only the authorization check interactions occur.

![pomerium architecture diagram](./img/architecture/pomerium-request-flow.svg)

**Step 1:** Unauthenticated client

The client sends a request to access a secured application, which prompts the Proxy to send the request over a gRPC call to the Authorization service.

Because the client has not authenticated, the Authorization service can't locate the session ID in the Databroker service. It sends the client to the Authenticate service, which prompts the client to sign in to the IdP.

**Step 2:** Authenticating the client

After the client signs in, the IdP exchanges an authorization code with the Authentication service. The Authentication service uses the code to get OAuth tokens and [OIDC claims](https://openid.net/specs/openid-connect-basic-1_0.html) from the IdP.

The Authentication service redirects the request to the Proxy with the session data.

**Step 3:** Authorizing the request

The Proxy saves the session data locally and sends it to the Databroker service over a gRPC call. The Databroker persists the session data and manages the session, and the Authorization service queries the Databroker for session data by way of on-demand caching.

Now that the client is authenticated, the Proxy sends the request again to the Authorization service. The Authorization service can now locate the session in the Databroker.

The Authorization service factors in IdP scopes and policy to determine if the client can access the secured application. Assuming the client has sufficient permissions, the Authorization service authorizes the request, and the Proxy sends the client to the route defined in the policy.
