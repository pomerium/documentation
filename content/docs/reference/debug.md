---
id: debug
title: Debug
description: |
  Debug enables colored, human-readable logs to be streamed to standard out.
keywords:
  - reference
  - Debug
pagination_prev: null
pagination_next: null
---

- Environmental Variable: `POMERIUM_DEBUG`
- Config File Key: `pomerium_debug`
- Kubernetes: see [`--debug`](/docs/deploying/k8s/install#runtime-parameters)
- Type: `bool`
- Default: `false`

:::danger

Enabling the debug flag could result in sensitive information being logged!!!

:::

By default, JSON encoded logs are produced. Debug enables colored, human-readable logs to be streamed to [standard out](<https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)>>>>). In production, it is recommended to be set to `false`.

For example, if `true`

```log
10:37AM INF cmd/pomerium version=v0.0.1-dirty+ede4124
10:37AM INF proxy: new route from=verify.localhost.pomerium.io to=https://verify.pomerium.com
10:37AM INF proxy: new route from=ssl.localhost.pomerium.io to=http://neverssl.com
10:37AM INF proxy/authenticator: grpc connection OverrideCertificateName= addr=auth.localhost.pomerium.io:443
```

If `false`

```json
{"level":"info","version":"v0.0.1-dirty+ede4124","time":"2019-02-18T10:41:03-08:00","message":"cmd/pomerium"}
{"level":"info","from":"verify.localhost.pomerium.io","to":"https://verify.pomerium.com","time":"2019-02-18T10:41:03-08:00","message":"proxy: new route"}
{"level":"info","from":"ssl.localhost.pomerium.io","to":"http://neverssl.com","time":"2019-02-18T10:41:03-08:00","message":"proxy: new route"}
{"level":"info","OverrideCertificateName":"","addr":"auth.localhost.pomerium.io:443","time":"2019-02-18T10:41:03-08:00","message":"proxy/authenticator: grpc connection"}
```
