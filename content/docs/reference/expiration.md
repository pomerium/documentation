---
id: expiration
title: Expiration
description: |
  Sets the lifetime of session cookies. After this interval, users must reauthenticate.
keywords:
- reference
- Expiration
pagination_prev: null
pagination_next: null
---


# Expiration
- Environmental Variable: `COOKIE_EXPIRE`
- Config File Key: `cookie_expire`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Default: `14h`

Sets the lifetime of session cookies. After this interval, users must reauthenticate.

