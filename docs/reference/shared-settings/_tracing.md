---
id: tracing
title: Tracing
keywords:
- reference
- Tracing
---


# Tracing
Tracing tracks the progression of a single user request as it is handled by Pomerium.

Each unit of work is called a Span in a trace. Spans include metadata about the work, including the time spent in the step (latency), status, time events, attributes, links. You can use tracing to debug errors and latency issues in your applications, including in downstream connections.

#### Shared Tracing Settings

Config Key          | Description                                                                          | Required
:------------------ | :----------------------------------------------------------------------------------- | --------
tracing_provider    | The name of the tracing provider. (e.g. jaeger, zipkin)                              | ✅
tracing_sample_rate | Percentage of requests to sample in decimal notation. Default is `0.0001`, or .01%   | ❌

#### Datadog

Datadog is a real-time monitoring system that supports distributed tracing and monitoring.

Config Key              | Description                                                                  | Required
:---------------------- | :--------------------------------------------------------------------------- | --------
tracing_datadog_address | `host:port` address of the Datadog Trace Agent. Defaults to `localhost:8126` | ❌

#### Jaeger (partial)

**Warning** At this time, Jaeger protocol does not capture spans inside the Proxy service. Please use Zipkin protocol with Jaeger for full support.

[Jaeger](https://www.jaegertracing.io/) is a distributed tracing system released as open source by Uber Technologies. It is used for monitoring and troubleshooting microservices-based distributed systems, including:

- Distributed context propagation
- Distributed transaction monitoring
- Root cause analysis
- Service dependency analysis
- Performance / latency optimization

Config Key                        | Description                                 | Required
:-------------------------------- | :------------------------------------------ | --------
tracing_jaeger_collector_endpoint | Url to the Jaeger HTTP Thrift collector.    | ✅
tracing_jaeger_agent_endpoint     | Send spans to jaeger-agent at this address. | ✅

#### Zipkin

Zipkin is an open source distributed tracing system and protocol.

Many tracing backends support zipkin either directly or through intermediary agents, including Jaeger. For full tracing support, we recommend using the Zipkin tracing protocol.

Config Key              | Description                      | Required
:---------------------- | :------------------------------- | --------
tracing_zipkin_endpoint | Url to the Zipkin HTTP endpoint. | ✅

#### Example

![jaeger example trace](./img/jaeger.png)

