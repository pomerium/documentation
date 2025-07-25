# Listeners Reference

This document provides a comprehensive overview of all the network listeners that Pomerium configures in Envoy, along with their purposes and configuration details.

## Listener Types

Pomerium creates several types of listeners to handle different aspects of network traffic:

| Listener Name | Protocol | Purpose | Port | Configuration Option |
| --- | --- | --- | --- | --- |
| `http-ingress` | TCP/HTTP | Main HTTP listener for insecure connections | 80 (default) | [`address`](./address) with [`insecure_server: true`](./insecure-server) |
| `https-ingress` | TCP/HTTPS | Main HTTPS listener for secure connections | 443 (default) | [`address`](./address) |
| `quic-ingress` | UDP/QUIC | HTTP/3 listener using QUIC protocol | 443 (default) | [`address`](./address) with [`codec_type: http3`](./codec-type) |
| `grpc-ingress` | TCP/gRPC | Internal gRPC communication listener for incoming connections | random | [`grpc_addr`](./grpc) |
| `grpc-egress` | TCP/gRPC | Internal outbound gRPC connections | random | none |
| `envoy-admin` | TCP/HTTP | Envoy administration interface | varies | `envoy_admin_address` |
| `metrics-ingress` | TCP/HTTP(S) | Metrics and monitoring endpoint | 9902 (default) | [`metrics_addr`](./metrics) |
| `ssh` | TCP/SSH | SSH proxy connections | 22 (default) | `ssh_addr` |

## Detailed Descriptions

### Main Listeners

#### HTTP Ingress (`http-ingress`)

- **Purpose**: Handles insecure HTTP traffic when `insecure_server` is enabled. Handles autocert requests. Otherwise, redirects all requests to HTTPS.
- **Protocol**: TCP with HTTP connection manager

#### HTTPS Ingress (`https-ingress`)

- **Purpose**: Primary secure listener for HTTPS traffic
- **Protocol**: TCP with TLS termination

#### QUIC Ingress (`quic-ingress`)

- **Purpose**: HTTP/3 listener using QUIC protocol for enhanced performance
- **Protocol**: UDP with QUIC

### Service Listeners

#### gRPC Ingress (`grpc-ingress`)

- **Purpose**: Handles internal gRPC communication between Pomerium services
- **Protocol**: TCP with gRPC
- **Features**:
  - TLS termination (unless `grpc_insecure` is set)

#### gRPC Egress (`grpc-egress`)

- **Purpose**: Outbound connections for internal service communication
- **Protocol**: TCP with gRPC

### Administrative Listeners

#### Envoy Admin (`envoy-admin`)

- **Purpose**: Provides access to Envoy's administrative interface
- **Protocol**: TCP/HTTP

#### Metrics Ingress (`metrics-ingress`)

- **Purpose**: Exposes combined Pomerium and Envoy metrics in Prometheus format
- **Protocol**: TCP/HTTP

### Protocol-Specific Listeners

#### SSH (`ssh`)

- **Purpose**: Enables SSH proxy functionality through Pomerium
- **Protocol**: TCP with custom SSH codec

## Configuration Notes

- All TCP listeners support SO_REUSEPORT on Linux for improved performance
- Buffer limits are set to 32KB per connection for all listeners
- Listeners are conditionally created based on service configuration and enabled features
- The metrics listener uses a hash-based naming scheme to support multiple instances
- QUIC listeners require UDP port configuration and HTTP/3 codec type
- SSH listeners are only created when SSH proxy functionality is enabled

## Stat Prefixes

The stat prefix determines how metrics are reported for each listener:

- Used in Envoy's statistics and metrics collection
- Helps identify traffic patterns and performance for each listener type
- Forms the basis for monitoring and alerting configurations

See https://www.envoyproxy.io/docs/envoy/latest/configuration/listeners/stats#listener for details.
