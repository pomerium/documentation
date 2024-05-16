---
id: upstream-errors
title: Upstream Connection Errors
description: This page discusses upstream connection errors proxied by Pomerium.
keyword: [upstream connection, error, upstream connection error]
sidebar_label: Upstream Connection Errors
---

# Upstream connection errors

Upstream connection errors indicate that something is wrong with the upstream server, not Pomerium. Please refer to the list of errors below to learn more about a specific issue, and how you can resolve it.

## Error 503: No healthy upstream

The `no_healthy_upstream` error means that there is an issue with the upstream server that makes it unreachable from Pomerium. The error may be caused by or related to the upstream server's:

- Configuration or application code

**Resolution**: Check that there are no errors in the server's configuration files or application code that prevent it from running as expected.

- Network or firewall settings

**Resolution**: Check your network or firewall settings to make sure your server is reachable. 

- DNS records

**Resolution**: Make sure the server's DNS records are pointing to the correct IP address. 

## Upstream Max Stream Duration Reached

The `upstream_max_stream_duration_reached` error means that Pomerium destroyed the request because it exceeded the upstream server's maximum stream duration. 

**Resolution**: 

## Upstream Per Try Timeout

The `upstream_per_try_timeout` error means that the final upstream try timed out.

## Upstream Reset After Response Started

The `upstream_reset_after_response_started` error means that the upstream connection was reset after a response was started. This may include further details about the cause of the disconnect.


## Upstream Reset Before Response Started

The `upstream_reset_before_response_started` error means the upstream connection was reset before a response was started This may include further details about the cause of the disconnect.

## Upstream Response Timeout

The `upstream_response_timeout` error means that the upstream response timed out.

## Via Upstream

The `via_upstream` error means that the response code was set by the upstream.




