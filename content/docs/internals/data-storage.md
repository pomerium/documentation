---
# cSpell:ignore libpq userspec dbname paramspec hostspec setuser rediss

title: Persistence
description: This article describes Pomerium's data storage requirements and backends
---

# Persistence & Data storage

### Background

Pomerium keeps persistent state out of most components, but an identity-aware access proxy must maintain some data about every user's session. Historically, all user/session related data was stored in cookies, but this quickly became challenging.

- Cookie and header limits would impact large organizations and some IdPs
- SPAs would break when session cookies expired
- No central visibility or management of existing sessions
- Group membership was fixed from session creation
- Slow initial authentication flow to fetch user data

To address these limitations, the Pomerium `databroker` service runs a number of internal services responsible for maintaining data and state.

### Design

The `databroker` is responsible for providing a stateful storage layer. Services which require high performance maintain a streaming local cache of the contents of the `databroker`, while others may call `databroker` in real time. Only the `databroker` is expected to maintain authoritative state.

## Persistence

At this time, most data stored by Pomerium is externally sourced and recoverable at startup (eg, group membership). The notable exception is user sessions. If the data hosted by the `databroker` is lost, users will need to log in through their IdP again at next session expiration.

To prevent early session loss in production deployments, persistent storage backends are available for configuration in the `databroker`. Use of these is strongly encouraged, but smaller or non-production deployments can make use of an in-memory storage layer if external dependencies are not practical or justifiable.

## Backends

The **Databroker Service** stores user session data, and uses an in-memory databroker by default.

Pomerium encrypts record values only for the Redis storage backend (not for the in-memory or Postgres storage backends). When using the Postgres backend we recommend that users configure their own encryption at rest, for example by using full-disk encryption on the volume where Postgres data is stored.

:::tip

You can create your own databroker by implementing Pomerium's [**databroker gRPC interface**](https://github.com/pomerium/pomerium/blob/main/pkg/grpc/databroker/databroker.proto). For an example implementation, see the in-memory database used by the databroker service:

- [pkg/storage](https://github.com/pomerium/pomerium/tree/main/pkg/storage/inmemory)

:::

### In-Memory

- Data Broker Service HA: `no`
- Data Store HA: `no`
- Data Persistence: `no`

The default storage backend for `databroker` is memory based. This backend provides easy deployment semantics but is not persistent or highly available. Running more than one `databroker` instance configured for memory backed storage is not supported and will lead to non-deterministic behavior.

### Postgres

- Data Broker Service HA: `yes`
- Data Store HA: `yes`
- Data Persistence: `yes`

The Postgres based backend supports multiple `databroker` instances and persistence across restarts. We recommend a dedicated Postgres instance for Pomerium to provide the strongest security and performance guarantees.

Example configuration:

```yaml
databroker_storage_type: postgres
databroker_storage_connection_string: postgres://user:pass@dbhost.internal.mydomain.com/pomerium?sslmode=disable
```

The connection string for postgres follows the same conventions as [libpq](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING):

```text
postgresql://[userspec@][hostspec][/dbname][?paramspec]

where userspec is:

user[:password]

and hostspec is:

[host][:port][,...]

and paramspec is:

name=value[&...]
```

When using multiple hosts make sure to specify `target_session_attrs=read-write` so that the Databroker does not attempt to write to a read-only replica.

:::note 

Configuration options for each backend are detailed in the [**databroker configuration reference**](/docs/reference/databroker) page.

:::

## Troubleshooting

Most issues with the Databroker service are caused by a [`shared_secret`](/docs/reference/shared-secret) mismatch between services. See [Troubleshooting - Shared Secret Mismatch](/docs/reference/shared-secret) for details.
