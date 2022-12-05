---
id: address
title: Address
description: |
  Address specifies the host and port to serve HTTP requests from.
keywords:
  - reference
  - Address
pagination_prev: null
pagination_next: null
---

# Address

- Environmental Variable: `ADDRESS`
- Config File Key: `address`
- Type: `string`
- Example: `:443`, `:8443`
- Default: `:443`
- Required

Address specifies the host and port to serve HTTP requests from. If empty, `:443` is used. Note, in all-in-one deployments, gRPC traffic will be served on loopback on port `:5443`.
