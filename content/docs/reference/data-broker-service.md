---
id: data-broker-service
title: Databroker Service
keywords:
  - reference
  - Databroker Service
description: Learn about databrokers with Pomerium and how to implement your own in-memory database used by the databroker service. 
pagination_prev: null
pagination_next: null
---

The **Databroker Service** stores user session data.

By default, the `databroker` service uses an in-memory databroker.

To create your own databroker, implement Pomerium's [databroker gRPC interface](https://github.com/pomerium/pomerium/blob/main/pkg/grpc/databroker/databroker.proto).

For an example implementation, the in-memory database used by the databroker service can be found here:

- [pkg/databroker/memory](https://github.com/pomerium/pomerium/tree/main/pkg/databroker/memory)
