---
title: Configure
lang: en-US
keywords: [configuration, options, settings, pomerium, enterprise, reference]
---

The **Configure** section of the Pomerium Enterprise Console houses settings that affect the entirety of the Console environment, i.e. across all Namespaces. Adjust these settings with care.

## Settings

The **Settings** section holds global settings that affect how the Pomerium Enterprise Console runs, logs, and communicates. Values set here are applied globally, except for settings documented to override global options.

Some options may be unset by default. These settings use the values set in Pomerium Core, unless overridden in the console.

### Global

#### Debug

:::danger

Enabling the debug flag could result in sensitive information being logged!!!

:::

By default, JSON encoded logs are produced. Debug enables colored, human-readable logs to be streamed to [standard out](https://en.wikipedia.org/wiki/Standard_streams). In production, it is recommended to be set to `false`.

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

#### HTTP Redirect Address

If set, the HTTP Redirect Address specifies the host and port to redirect http to https traffic on. If unset, no redirect server is started.

#### DNS Lookup Family

The DNS IP address resolution policy. If not specified, the value defaults to `AUTO`.

#### Log Level

Log level sets the global logging level for pomerium. Only logs of the desired level and above will be logged.

#### Proxy Log Level

Proxy log level sets the logging level for the Pomerium Proxy service access logs. Only logs of the desired level and above will be logged.

### Cookies

#### HTTPS Only

If true, instructs browsers to only send user session cookies over HTTPS.

:::warning

Setting this to false may result in session cookies being sent in cleartext.

:::

#### Javascript Security

If true, prevents javascript in browsers from reading user session cookies.

:::warning

Setting this to false enables hostile javascript to steal session cookies and impersonate users.

:::

#### Expires

Sets the lifetime of session cookies. After this interval, users must reauthenticate.

### Timeouts

Timeouts set the global server timeouts. Timeouts can also be set for individual routes.

### GRPC

#### GRPC Server Max Connection Age

Set max connection age for GRPC servers. After this interval, servers ask clients to reconnect and perform any rediscovery for new/updated endpoints from DNS.

See <https://godoc.org/google.golang.org/grpc/keepalive#ServerParameters> (opens new window) for details

#### GRPC Server Max Connection Age Grace

Additive period with grpc_server_max_connection_age, after which servers will force connections to close.

See <https://godoc.org/google.golang.org/grpc/keepalive#ServerParameters> (opens new window) for details

### Tracing

Tracing tracks the progression of a single user request as it is handled by Pomerium.

Each unit of work is called a Span in a trace. Spans include metadata about the work, including the time spent in the step (latency), status, time events, attributes, links. You can use tracing to debug errors and latency issues in your applications, including in downstream connections.

#### Tracing Sample Rate

Percentage of requests to sample. Default is .01%.

Unlike the decimal value notion used for the `tracing_sample_rate` [key](/docs/reference/tracing#shared-tracing-settings) in open-source Pomerium, this value is a percentage, e.g. a value of `1` equates to 1%

### Authenticate

### Proxy

#### Certificate Authority

This defines a set of root certificate authorities that Pomerium uses when communicating with other TLS-protected services.

**Note**: Unlike route-specific certificate authority settings, this setting augments (rather than replaces) the system's trust store. But routes that specify a CA will ignore those provided here.

:::warning

Be sure to include the intermediary certificate.

:::

#### Default Upstream Timeout

Default Upstream Timeout is the default timeout applied to a proxied route when no `timeout` key is specified by the policy.

#### JWT Claim Headers

The JWT Claim Headers setting allows you to pass specific user session data to upstream applications as HTTP request headers. Note, unlike the header `x-pomerium-jwt-assertion` these values are not signed by the authorization service.

Additionally, this will add the claim to the `X-Pomerium-Jwt-Assertion` header provided by [`pass_identity_headers`](/docs/reference/routes/pass-identity-headers), if not already present.

Any claim in the pomerium session JWT can be placed into a corresponding header and the JWT payload for upstream consumption. This claim information is sourced from your Identity Provider (IdP) and Pomerium's own session metadata. The header will have the following format:

`X-Pomerium-Claim-{Name}` where `{Name}` is the name of the claim requested. Underscores will be replaced with dashes; e.g. `X-Pomerium-Claim-Given-Name`.

This option also supports a nested object to customize the header name. For example:

```yaml
jwt_claims_headers:
  X-Email: email
```

Will add an `X-Email` header with a value of the `email` claim.

Use this option if you previously relied on `x-pomerium-authenticated-user-{email|user-id|groups}`.

#### X-Forward-For HTTP Header

Do not append proxy IP address to `x-forwarded-for` HTTP header. See [Envoy](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers.html?highlight=skip_xff_append#x-forwarded-for) docs for more detail.

#### Response Headers

Set Response Headers allows you to set static values for the given response headers. These headers will take precedence over the global `set_response_headers`.

## Namespaces

A [Namespace][namespace-concept] is a collection of users, groups, routes, and policies that allows system administrators to organize, manage, and delegate permissions across their infrastructure.

- Policies can be optional or enforced on a Namespace.
  - Enforced policies are also enforced on child Namespaces, and optional policies are available to them as well.
- Users or groups can be granted permission to edit access to routes within a Namespace, allowing them self-serve access to the routes critical to their work.

:::tip When using an IdP without directory sync or when working with non-domain users, they will not show up in the look-ahead search. See [Non-Domain Users](/docs/enterprise/concepts#non-domain-users) for more information. :::

## External Data

This section lets [administrators](/docs/enterprise/concepts#admin) add and manage external data sources. Information from external data sources can be used to extend [policies](/docs/capabilities/policies).

### Add or Edit External Data Source

#### URL

The path to the external data. The supported formats are:

- JSON file containing an array of objects. each object **must** contain an `id` field.

  ```json title="example JSON"
  [
    {"id": "id4@example.com", "user.id": "user4"},
    {"id": "id5@example.com", "user.id": "user5"},
    {"id": "id6@example.com", "user.id": "user6"}
  ]
  ```

- CSV file, where the first row indicates the field names and subsequent rows are records. One of the fields **must** be an `id`.

  ```json title="example CSV"
  id,user.id
  id1@example.com,user1
  id2@example.com,user2
  id3@example.com,user3
  ```

- A tar or zip file containing files of one of the formats above. The file path within the tar file specifies the record type, if not defined in the configuration. For example, in an archive containing the following structure:

  ```bash
  example.com/geoip.csv
  devices/jamf.json
  devices/tanium.json
  ```

  The Pomerium Databroker would be updated with types `example.com/geoip`, `devices/jamf`, and `devices/tanium`.

  - Compressed versions are supported using `gz` format.

#### Record Type

Unless defined by the directory structure of a supplied archive file, the Record Type field defines how the records will be stored and accessed in the Databroker.

#### Foreign Key

This value is used to map an authorization evaluation to the corresponding record. The supported values are:

- `user.id` (Also the default if no value is provided),
- `user.email`,
- `request.ip`,
- `device.id`.

#### Headers

Headers defined here will be used when connecting to the external data source.

#### Allow Insecure TLS

If set, allows the import of external data from sources using untrusted TLS certificates.

#### Polling Min/Max Delay

Defines the minimum and maximum delay times between requests to the external data source. The job would be scheduled to run within `min delay` intervals. Note, if a job may not complete within the `min delay` period, it would be interrupted and restarted. If a job is interrupted by timeout or due to an error, it would be restarted with increasing intervals up to the `max delay` period.

#### Client TLS Key

For data sources using mTLS, you can select a [client certificate](/docs/enterprise/reference/manage#certificates) (added under **Manage** → **Certificates**) to provide to the data source.

See [External Data Sources](/docs/enterprise/external-data) for more information on this feature.

[route-concept]: /docs/concepts/routes
[route-reference]: /docs/concepts/routes
[namespace-concept]: /docs/concepts/namespacing
[namespace-reference]: /docs/concepts/namespacing
[service-accounts-concept]: /docs/concepts/service-accounts
[policy-reference]: /docs/concepts/policies
