---
id: data-broker-storage-connection-string
title: Data Broker Storage Connection String
keywords:
- reference
- Data Broker Storage Connection String
---


# Data Broker Storage Connection String
- Environmental Variable: `DATABROKER_STORAGE_CONNECTION_STRING`
- Config File Key: `databroker_storage_connection_string`
- Type: `string`
- **Required** when storage type is `redis`
- Example: `"redis://localhost:6379/0"`, `"rediss://localhost:6379/0"`

The connection string that the databroker service will use to connect to storage backend.

For `redis`, the following URL types are supported:

- simple: `redis://[username:password@]host:port/[db]`
- sentinel: `redis+sentinel://[:password@]host:port[,host2:port2,...]/[master_name[/db]][?param1=value1[&param2=value2&...]]`
- cluster: `redis+cluster://[username:password@]host:port[,host2:port2,...]/[?param1=value1[&param2=value=2&...]]`

You can also enable TLS with `rediss://`, `rediss+sentinel://` and `rediss+cluster://`.

