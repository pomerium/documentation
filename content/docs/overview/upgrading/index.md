---
title: Upgrading
description: >-
  This page contains the list of deprecations and important or breaking changes
  for Pomerium. Please read it carefully.
---

## Since 0.16.0

### New

#### Per Route OIDC Credentials

This release of Pomerium adds the ability to bind a route to unique OIDC credentials.  This allows Identity Provider administrators to view Pomerium protected applications individually rather than as a single shared application.

See [idp_client_id](/docs/reference/routes/identity-provider-client-id-per-route) and [idp_client_secret](/docs/reference/routes/identity-provider-client-secret-per-route) for configuration details.

#### Updated User Info Page

The `.pomerium` user info page has been redesigned to better structure data around user identity, group, and device information.

#### External Google Groups

Pomerium policy now supports group members from outside of your organization.

## Since 0.15.0

### New

#### Policy for Device Identity

This release of Pomerium adds the ability to set policy based on system registration via [WebAuthN](https://en.wikipedia.org/wiki/WebAuthn).

See [Device Identity](/docs/topics/device-identity) for more details.

#### HTTP PPL Criteria

`http_path` and `http_method` are now supported for matching HTTP requests in policies. See [Pomerium Policy Language](/docs/topics/ppl#criteria) for more details.

### Breaking

#### Self-signed fallback certificates

When selecting a TLS certificate for a listener, Pomerium attempts to locate one by iterating through the provided certs and searching for a SAN match. This applies to all listeners, including internal service URLs like `databroker_service_url` and public endpoints like `authenticate.example.com`.

Previously, when no match was found, Pomerium would select the "first" certificate in the list. However, the definition of "first" might change based on runtime configuration, so the certificate selection was non-deterministic.

Starting in v0.16, Pomerium will instead generate a self-signed certificate if it cannot locate an appropriate certificate from the provided configuration or system key/trust store. If you discover that you are receiving a self-signed certificate rather than a certificate from [`certificate`/`certificates`/`certificate_file`](/docs/reference/certificates) or the trust store, you have a mismatch between your service URL and the names covered in your certificates.

#### OIDC flow no longer sets default uri params

Previously, Pomerium would default to setting the uri param `access_type` to `offline` for all OpenID Connect based identity providers. However, using uri params to ensure offline access (e.g. `refresh_tokens` used to keep user's sessions alive) [is unique to Google](https://developers.google.com/identity/protocols/oauth2/web-server#offline). Those query params will now only be set for Google. Other OIDC based IdP's should continue to work using [OIDC's](https://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess) `offline_access` scope.

#### Removed options
The deprecated `headers` option has been removed. Use [`set_response_headers`](/docs/reference/set-response-headers) instead.

The `signing_key_algorithm` option has been removed and will now be inferred from `signing_key`.

#### Changed GitHub Team IDs
To improve performance, IdP directory synchronization for GitHub now uses the GraphQL API. This API returns the same information as the REST API, except that the GraphQL node IDs are different. Where we previously used the team integer ID from the REST API, we now use the team slug instead. Most policies should already use the team slug for group based rules, which should continue to work. However, if the integer ID is used it will no longer work. Update those policies to use the team slug instead.

#### CLI Source and Packaging Update
`pomerium-cli` has been factored out of the core repository and now resides at <https://github.com/pomerium/cli>. If you currently install the CLI tool from [Packages]overview/releases#packages-2) or [Homebrew]overview/releases#homebrew), no changes should be required to your process. However, users of docker images or direct github release downloads will need to update their references.

Please see the [updated install instructions]overview/releases#pomerium-cli) for additional details.


[authenticate internal service url]: /docs/reference/authenticate-service-url
[cache service docs]: /docs/reference/data-broker-service
[identity provider service account]: /docs/reference/identity-provider-service-account
[policy]: /docs/reference/policy/policy
[storage backend configuration here]: /docs/reference/data-broker-service
[storage backend types]: /docs/reference/data-broker-storage-type
