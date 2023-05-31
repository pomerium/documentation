---
id: data-broker-storage-connection-string
title: Data Broker Storage Connection String
keywords:
  - reference
  - Data Broker Storage Connection String
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `DATABROKER_STORAGE_CONNECTION_STRING`
- Config File Key: `databroker_storage_connection_string`
- Kubernetes: see [`storage`](/docs/deploy/k8s/reference#storage)
- Type: `string`
- **Required** when storage type is `postgres`
- Example: `"postgres://localhost:5432/pomerium"`

The connection string that the databroker service will use to connect to storage backend.

For `postgres`, the following URL types are supported:

- simple: `postgres://[username:password@]host:port/[db]`

:::tip

When using multiple hosts make sure to specify `target_session_attrs=read-write` so that the Databroker does not attempt to write to a read-only replica.

:::
