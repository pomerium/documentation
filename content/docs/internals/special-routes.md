---
title: Special Routes
lang: en-US
keywords:
  [
    pomerium,
    identity access proxy,
    special routes,
    authentication endpoints,
    api,
    user information,
    session management,
    device identity,
    webauthn,
    programmatic access,
    logout flow,
    jwt,
    health check,
    ping,
    healthz,
    well-known,
    jwks,
    oidc discovery,
    hpke,
  ]
description: Learn about Pomerium's reserved endpoints that handle authentication, session management, user information, health checks, and discovery.
sidebar_position: 5
---

# Special Routes

Pomerium handles several special URL paths internally for various functions including authentication flows, session management, user information retrieval, health checks, and service discovery.

Most authentication-related internal endpoints live under the reserved `/.pomerium` path prefix. Any request to a route ending in `/.pomerium/...` is intercepted by Pomerium's proxy service (not forwarded to upstream apps) and handled by these special endpoints.

Additionally, Pomerium exposes other special endpoints outside the `/.pomerium` path, primarily for health checking (`/ping`, `/healthz`) and service discovery (`/.well-known/...`). These are typically handled by the control plane HTTP server or directly by the proxy listener.

This page documents all such endpoints, their purpose, and usage.

Below is a summary of the special routes:

| **Endpoint** | **Method(s)** | **Requires Auth?** | **Purpose** |
| :-- | :-- | :-- | :-- |
| [`/.pomerium/`](#user-info-page) | `GET` | Yes (logged in) | User info page (HTML) showing current identity, session details, and device identities. |
| [`/.pomerium/user`](#user-data-endpoint) | `GET` | Yes (logged in) | Return current user information in JSON format (plain claims data). |
| [`/.pomerium/api/v1/login`](#programmatic-login-url-api) | `GET` | No (initiates login) | Generate a one-time **programmatic login** URL to start an OAuth2 login flow and obtain a Pomerium session token (JWT). |
| [`/.pomerium/sign_out`](#single-sign-out-endpoint) | `GET`, `POST` | Yes (CSRF token) | Log the user out of Pomerium (and IdP session if applicable), clearing session cookies and redirecting. |
| [`/.pomerium/webauthn`](#device-enrollment-endpoint) | `GET`, `POST` | Yes (logged in) | Initiate or complete a **device enrollment** via WebAuthn for device identity verification. |
| [`/.pomerium/device-enrolled`](#device-enrollment-callback) | `GET` | Yes (logged in) | Finalize device enrollment. Typically used by Pomerium to confirm a device was successfully registered. |
| [`/ping`](#health-check-endpoints) | `GET`, `HEAD` | No | Basic health check endpoint. Returns 200 OK. |
| [`/healthz`](#health-check-endpoints) | `GET`, `HEAD` | No | Basic health check endpoint. Returns 200 OK. |
| [`/.well-known/pomerium`](#oidc-discovery-endpoint) | `GET` | No | OIDC-like discovery document listing relevant Pomerium endpoints (JWKS URI, etc.). |
| [`/.well-known/pomerium/jwks.json`](#jwks-endpoint) | `GET` | No | Serves the JSON Web Key Set (JWKS) used to verify Pomerium-issued JWTs. |
| [`/.well-known/pomerium/hpke-public-key`](#hpke-public-key-endpoint) | `GET` | No | Serves the Hybrid Public Key Encryption (HPKE) public key used in the stateless authentication flow. |

Below are details for each special route:

### User Info Page

The base `/.pomerium/` path displays an HTML page with information about the currently authenticated user's session. This page serves as a simple dashboard where users can verify their login identity and session details. Users can see their email address, name, and associated groups/roles, as well as manage device identity and sign out.

End-users can visit `https://<your-app>/.pomerium/` in their browser to self-inspect their session. If not yet authenticated, they'll be prompted to log in before seeing the info page.

If device identity is enabled, the page will list unique Device IDs associated with the user's session, allowing users to identify their device and share that ID with administrators if needed. Users can also remove devices from their account directly from this page.

### User Data Endpoint

The `/.pomerium/user` endpoint returns information about the currently signed-in user in plaintext JSON format. It provides the same claims that Pomerium asserts about the user (email, ID, name, groups) but in a direct JSON object format rather than a signed token.

This endpoint is particularly useful for single-page applications that need to fetch user identity data without parsing a JWT. A front-end application can simply call `fetch('/.pomerium/user')` to display the user's email or perform client-side logic based on group claims. Note that this endpoint should only be used for UI customization - never rely on this frontend data for security decisions or permissions checks, which must always be enforced by your backend services.

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "groups": ["engineering", "admins"]
}
```

### Programmatic Login URL API

The `/.pomerium/api/v1/login` endpoint initiates a programmatic login flow by generating a one-time sign-in URL. It's designed for CLI tools, scripts, or other non-browser clients that need to obtain Pomerium credentials via OAuth login.

This approach is valuable when you need an access token for an automated client. The process works in three steps:

1.  Your application calls this endpoint with a `pomerium_redirect_uri` parameter to get a sign-in URL
2.  The user opens this URL in a browser, which triggers the authentication flow
3.  After successful authentication, the browser redirects to your specified URI with a `pomerium_jwt` query parameter
4.  Your application extracts this token for further use

Unlike other `/.pomerium` endpoints, this one doesn't require an existing session - it's specifically designed to initiate the login process.

**Example:**

```bash
curl "https://<your-app>/.pomerium/api/v1/login?pomerium_redirect_uri=http://localhost:5000/callback"
```

See the [Programmatic Access](/docs/internals/programmatic-access) page for more detailed information about implementing programmatic authentication flows.

### Single Sign-Out Endpoint

The `/.pomerium/sign_out` endpoint logs the user out of Pomerium and optionally out of the identity provider as well. It clears session cookies and redirects to a post-logout page.

This endpoint is typically invoked when a user clicks "Logout" in your application or when you need a programmatic sign-out. The logout process follows these steps:

1.  Pomerium clears the user's session cookie
2.  The request redirects to the authenticate service's sign-out endpoint
3.  The user is sent to a configured post-logout page, which can be specified via the `pomerium_redirect_uri` parameter

This endpoint supports front-channel logout when integrated with identity providers that support it.

### Device Enrollment Endpoint

The `/.pomerium/webauthn` endpoint handles device enrollment and attestation via WebAuthn as part of Pomerium's device identity feature. It manages the challenge/response flow between the user's browser and Pomerium.

This process is typically initiated when a user clicks a "Register Device" button, which starts the WebAuthn flow. The endpoint works differently depending on the HTTP method:

- A `GET` request provides a WebAuthn challenge to the browser
- A `POST` request accepts the attestation response from the browser, verifying and enrolling the device

The endpoint requires an authenticated session with a valid CSRF token to function properly.

### Device Enrollment Callback

The `/.pomerium/device-enrolled` endpoint finalizes the device enrollment process. After successful WebAuthn registration via the `/.pomerium/webauthn` endpoint, this callback confirms the device has been properly enrolled.

Users don't typically access this endpoint directly. Instead, the browser is automatically redirected here upon successful device registration, where either a confirmation message is displayed or the user is redirected back to the original application route.

### Health Check Endpoints

The `/ping` and `/healthz` endpoints provide simple health checks. They respond with a `200 OK` status code to `GET` or `HEAD` requests, indicating that the Pomerium instance handling the request is running.

These endpoints are typically used by:

- **Load Balancers:** To determine if a Pomerium instance is healthy and should receive traffic.
- **Orchestration Systems (e.g., Kubernetes):** For readiness and liveness probes to manage container lifecycles.
- **Monitoring Systems:** To perform basic availability checks.

They do not require authentication and return minimal content (`OK` for `GET`, nothing for `HEAD`). These endpoints are handled by Pomerium's control plane HTTP server.

### OIDC Discovery Endpoint

The `/.well-known/pomerium` endpoint serves a JSON document similar to an OpenID Connect Discovery document. It provides metadata about Pomerium's own endpoints, such as:

- `issuer`: The base URL of the Pomerium instance serving the request.
- `jwks_uri`: The URL to Pomerium's JWKS endpoint.
- `authentication_callback_endpoint`: The OAuth2 callback URL handled by the authenticate service.
- `frontchannel_logout_uri`: The URL used for front-channel logout flows.

This endpoint allows clients and upstream applications to dynamically discover necessary Pomerium URLs. It is handled by Pomerium's control plane HTTP server.

```json
{
  "issuer": "https://app.example.com/",
  "authentication_callback_endpoint": "https://authenticate.example.com/oauth2/callback",
  "frontchannel_logout_uri": "https://app.example.com/.pomerium/sign_out",
  "jwks_uri": "https://app.example.com/.well-known/pomerium/jwks.json"
}
```

### JWKS Endpoint

The `/.well-known/pomerium/jwks.json` endpoint serves Pomerium's JSON Web Key Set (JWKS). This contains the public key(s) corresponding to the private key(s) Pomerium uses to sign JWT assertions (like the one in the `X-Pomerium-Jwt-Assertion` header).

Upstream applications or other services can fetch these keys to verify the signature of JWTs issued by Pomerium, confirming their authenticity and the identity claims within them. The keys are typically rotated periodically, and clients should expect to refetch the JWKS accordingly, respecting standard HTTP caching headers (like `Cache-Control` and `ETag`) provided by the endpoint. This endpoint is handled by Pomerium's control plane HTTP server.

### HPKE Public Key Endpoint

The `/.well-known/pomerium/hpke-public-key` endpoint serves the public key used for Hybrid Public Key Encryption (HPKE). This endpoint is specifically relevant for Pomerium's **stateless authentication flow**.

In the stateless flow, the Pomerium proxy needs to securely transmit information (like the intended redirect URI) to the authenticate service. It does this by encrypting parameters using the authenticate service's HPKE public key fetched from this endpoint. The authenticate service can then decrypt these parameters using its corresponding private key.

This endpoint is handled by Pomerium's control plane HTTP server and is crucial for initiating the stateless authentication handshake securely.

## Related Concepts

Pomerium uses special internal routes for various functions. Understanding these is key to grasping the overall architecture.

- **Authentication Flow:** Learn how Pomerium integrates with your IdP for [SSO Authentication](/docs/capabilities/authentication).
- **Device Trust:** Pomerium can leverage [Device Identity](/docs/integrations/device-context/device-identity) for enhanced security postures.
- **User Information:** See how to access [user identity details](/docs/capabilities/getting-users-identity) passed upstream.
- **Configuration:** Some special routes behave differently depending on whether you [use stateless mode](/docs/internals/configuration#use-stateless-mode).

_Note: Some endpoints may be deprecated or disabled by default in newer Pomerium versions. Always refer to the upgrade notes for the latest changes._
