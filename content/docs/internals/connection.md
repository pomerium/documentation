---
title: Connection Management
lang: en-US
sidebar_label: Connections
description:
keywords: [pomerium, architecture]
---

# Connection Lifecycle

Pomerium supports HTTP and TCP connection proxying, with uniform enforcement of [access policies] across the connections.

This document focuses on transport layer connection management in Pomerium and primarily on HTTP requests.

1. Downstream connection and TLS termination: A client (typically, a web browser) initiates a connection to Pomerium.
   - This connection could be HTTP/1.1 or HTTP/2. Pomerium currently does not support QUIC or HTTP/3 transports. Most modern browsers would choose HTTP/2 connections that provide significant performance benefits. In very rare cases you may need to force HTTP/1.1 using [`codec_type`] parameter.
   - Pomerium would present a server certificate to use based on the [`certificates`] provided.
   - Additionally, [mTLS] may be enabled for downstream connections to enforce client certificates.
   - Pomerium would only terminate TLS traffic that conforms to the following parameters, which is non configurable.
2. Request initiation: Once the transport layer connection is established, the downstream client sends an HTTP request. The proxy parses the request and matches it against its configuration to determine the upstream service to which it should forward the request.
3. Request authorization: before request is forwarded to the upstream, it is authorized according to the policies applied to the Pomerium route. Please see [request lifecycle] for details.
4. Upstream connection and request forwarding:

- [Load Balancing]: Pomerium uses its load balancing algorithms to select the best available upstream service instance to handle the request. It chooses from a list of healthy instances of a service, which is maintained by service discovery and health checking subsystems. The specific algorithm used for load balancing can be configured and can include options like Round Robin, Least Request, Random, etc.
- [Health Checks]: Health checks are crucial for maintaining the list of healthy service instances that the load balancer can choose from. Pomerium can be configured to regularly check the health of each upstream service instance, using methods like HTTP calls, TCP connections, or custom health checks. If a service instance fails the health check, it is marked as unhealthy and removed from the list of available instances for load balancing. This helps ensure that traffic is not sent to instances that are not capable of handling it.
- Connection & Request Forwarding: Once the load balancer has selected a healthy upstream service instance, Pomerium establishes a connection to this instance (if one does not already exist). The client's request is then forwarded to the selected service instance. Connection pooling is used to improve efficiency, where instead of creating a new connection for each request, Pomerium reuses existing connections where possible. This behavior can vary depending on whether the connection is HTTP/1.1 (where each connection can be reused but only handles one request at a time) or HTTP/2 (which supports multiple concurrent requests over a single connection).

5. Response forwarding: The upstream service processes the request and sends a response back to the Pomerium, which then forwards the response to the client.
6. Connection termination: Depending on the connection type and configuration, the connections between the client, Pomerium, and upstream service are either kept alive for future requests or terminated.

# Request Performance

Web apps, particularly modern single-page ones, often handle numerous requests simultaneously. These apps can gain significant advantage by using HTTP/2 transport from the downstream, through Pomerium, and up to the upstream application server.

Typically, HTTP/2 does require TLS. Therefore, enabling mutual TLS (mTLS) between Pomerium and the upstream applications isn't just a security boost. It also significantly enhances performance, providing a smoother and faster user experience.

# Timeouts

There are several timeouts applicable at different stages of this lifecycle:

- [Connection timeout]: This timeout applies when Envoy is trying to establish a connection to an upstream service. If the connection cannot be established within the set timeout, Envoy will return an error to the client. This includes TLS handshake. Defaults to 10s, cannot be configured.

- [Stream idle timeout]: This timeout applies to the period of inactivity in the communication between the downstream client and Pomerium, or Pomerium and the upstream service. If no requests are received within the set timeout, the connection is terminated. Configurable via [`timeout_idle`](/docs/reference/global-timeouts.mdx) global parameter, and may be disabled (but cannot exceed the global value) by specific route [`idle_timeout`](/docs/reference/routes/idle-timeout.md) value.

- [Request timeout]: This timeout applies to the total time a request can take, including connection establishment, request forwarding, processing at the upstream service, and response forwarding. If a complete response is not received within the set timeout, Pomerium will return an error to the client. Configurable via [`timeout_write`](/docs/reference/global-timeouts.mdx). You may need adjust this setting if i.e. handling a large uploads.

- [Route timeout]: This timeout applies to the time a request takes from Pomerium to the upstream service and back. It can be configured per-route via [`timeout`](/docs/reference/routes/route-timeout) and is included as part of the request timeout. Defaults to global [`default_upstream_timeout`](docs/reference/default-upstream-timeout.mdx) setting.

# Long Lived Connections

Most browser HTTP requests are relatively short. However, sometimes your upstream application may require a long-lived connection that may span hours or even days. An example of such connections are Websockets, gRPC streaming and proxied TCP connections.

From HTTP request management perspective, once such request is initiated, timeouts would apply, that eventually may terminate the long-lived request. For the [TCP routes], and HTTP routes marked for [`allow_websockets`](/docs/reference/routes/websocket-connections.md) the timeouts would be adjusted automatically

[access policies]: /docs/capabilities/ppl.mdx
[tcp]: /docs/capabilities/tcp.mdx
[request lifecycle]: /docs/internals/architecture.md#request-lifecycle
