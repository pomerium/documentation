---
id: data-broker-service
title: Data Broker Service
keywords:
  - reference
  - Data Broker Service
pagination_prev: null
pagination_next: null
---

The databroker service is used for storing user session data.

By default, the `databroker` service uses an in-memory databroker.

To create your own data broker, implement the following gRPC interface:

- [pkg/grpc/databroker/databroker.proto](https://github.com/pomerium/pomerium/blob/main/pkg/grpc/databroker/databroker.proto)

For an example implementation, the in-memory database used by the databroker service can be found here:

- [pkg/databroker/memory](https://github.com/pomerium/pomerium/tree/main/pkg/databroker/memory)
