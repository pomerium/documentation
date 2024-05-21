---
id: upstream-errors
title: Upstream Connection Errors
description: Troubleshoot upstream connection errors proxied by Pomerium.
keyword: [upstream connection, error, upstream connection error]
sidebar_label: Upstream Connection Errors
---

# Upstream connection errors

Upstream connection errors indicate that something is wrong with the upstream server, not Pomerium. Please refer to the list of errors below to learn more about a specific issue, and how you can resolve it.

:::note

Configuration errors in Pomerium itself can also cause upstream connection errors. In this case, you'd need to debug your Pomerium configuration to resolve the error.

:::

## No healthy upstream

The `no_healthy_upstream` error means that there is an issue with the upstream server that makes it unreachable from Pomerium. The error may be caused by or related to the upstream server's:

- Configuration or application code

  **Resolution**: Check that there are no errors in the server's configuration files or application code that prevent it from running as expected.

- Network or firewall settings

  **Resolution**: Check your network or firewall settings to make sure your server is reachable.

- DNS records

  **Resolution**: This error may be caused by unresolveable DNS records applied to the upstream server. Make sure the server's DNS records are pointing to the correct IP address.

- Failing health checks configured in Pomerium

  **Resolution**: If you've configured [Load Balancing Health Checks](/docs/reference/routes/load-balancing#health-checks) in Pomerium, the `no_healthy_upstream` could be the result of a failing health check from an upstream server. Please check the server's configuration for any errors.

## Upstream Max Stream Duration Reached

The `upstream_max_stream_duration_reached` error means that Pomerium cancelled the request because it exceeded the upstream server's maximum stream duration.

    **Resolution**: By default, Pomerium sets a 10-second timeout for all requests. If your requests are taking longer than expected, see the [Connections - Timeouts](/docs/internals/connection#timeouts) page to learn how timeouts work with upstream connections, and how to configure timeouts to avoid this error.

## Upstream Per Try Timeout

The `upstream_per_try_timeout` error means that the final attempt to connect to the upstream server timed out.

    **Resolution**: See the [Connections - Timeouts](/docs/internals/connection#timeouts) page to learn how timeouts work with upstream connections, and how to configure timeouts in Pomerium to avoid this error.

## Upstream Reset After Response Started

The `upstream_reset_after_response_started` error means that the upstream server reset the connection _after_ it began transmitting the response.

    **Resolution**: See the [Connections - Timeouts](/docs/internals/connection#timeouts) page to learn how timeouts work with upstream connections, and how to configure timeouts in Pomerium to avoid this error.

## Upstream Reset Before Response Started

The `upstream_reset_before_response_started` error means the upstream server reset the connection _before_ it began transmitting the response.

    **Resolution**: See the [Connections - Timeouts](/docs/internals/connection#timeouts) page to learn how timeouts work with upstream connections, and how to configure timeouts in Pomerium to avoid this error.

## Upstream Response Timeout

The `upstream_response_timeout` error means that the upstream server's response timed out.

    **Resolution**: See the [Connections - Timeouts](/docs/internals/connection#timeouts) page to learn how timeouts work with upstream connections, and how to configure timeouts in Pomerium to avoid this error.

## Via Upstream

The `via_upstream` error means that the upstream service set the response code.

    **Resolution**: To resolve this error, check the upstream service's application logs for more information about how the response status code is set.
