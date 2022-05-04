---
id: grpc-insecure
title: GRPC Insecure
description: |
  If set, GRPC Insecure disables transport security for communication between the proxy and authorize components.
keywords:
- reference
- GRPC Insecure
---


# GRPC Insecure
- Environmental Variable: `GRPC_INSECURE`
- Config File Key: `grpc_insecure`
- Type: `bool`

This setting disables transport security for gRPC communication. If running in all-in-one mode, defaults to true as communication will run over localhost's own socket.

