---
id: cookie-expire
title: Cookie Expiration
description: |
  Sets the lifetime of session cookies. After this interval, users must reauthenticate.
keywords: [cookie-expire]
pagination_prev: null
pagination_next: null
---

# Cookie Expiration

- Environmental Variable: `COOKIE_EXPIRE`
- Config File Key: `cookie_expire`
- Type: [Go Duration](https://golang.org/pkg/time/#Duration.String) `string`
- Default: `14h`

Sets the lifetime of session cookies. After this interval, users must reauthenticate.
