# Special Routes

Pomerium's proxy service reserves the `/.pomerium` path for internal endpoints that facilitate authentication flows, session management, and user information retrieval. Any request to a route ending in `/.pomerium/...` is intercepted by Pomerium (not forwarded to upstream apps) and handled by these special endpoints. This page documents all such endpoints, their purpose, and usage for end-users and developers integrating with Pomerium.

Below is a summary of the special `/.pomerium` routes, including their HTTP methods, purpose, and whether an existing authenticated session is required:

| **Endpoint**                                | **Method(s)** | **Requires Auth?**            | **Purpose**                                                                                                                   |
| ------------------------------------------ | ------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`/.pomerium/`](#user-info-page)           | `GET`         | Yes (must be logged in)       | User info page (HTML) showing current identity, session details, and device identities.                                       |
| [`/.pomerium/user`](#user-data-endpoint)   | `GET`         | Yes (must be logged in)       | Return current user information in JSON format (plain claims data).                                                           |
| [`/.pomerium/jwt`](#jwt-retrieval-endpoint) | `GET`         | Yes (logged in; *deprecated*) | Return the Pomerium JWT (attestation token) for the current session. Disabled by default in newer versions.                   |
| [`/.pomerium/api/v1/login`](#programmatic-login-url-api) | `GET`         | No (initiates login)          | Generate a one-time **programmatic login** URL to start an OAuth2 login flow and obtain a Pomerium session token (JWT).       |
| [`/.pomerium/sign_out`](#single-sign-out-endpoint) | `GET`, `POST` | Yes (CSRF token required)     | Log the user out of Pomerium (and IdP session if applicable), clearing session cookies and redirecting to a post-logout page. |
| [`/.pomerium/webauthn`](#device-enrollment-endpoint) | `GET`, `POST` | Yes (must be logged in)       | Initiate or complete a **device enrollment** via WebAuthn for device identity verification.                                   |
| [`/.pomerium/device-enrolled`](#device-enrollment-callback) | `GET`         | Yes (must be logged in)       | Finalize device enrollment. Typically used by Pomerium to confirm a device was successfully registered.                       |

Below are details for each special route, including how and when to use them, what they return, and any relevant query parameters or considerations:

## User Info Page

The base `/.pomerium/` path displays an HTML page with information about the currently authenticated user's session. This page serves as a simple dashboard where users can verify their login identity and session details. Users can see their email address, name, and associated groups/roles, as well as manage device identity and sign out.

End-users can visit `https://<your-app>/.pomerium/` in their browser to self-inspect their session. If not yet authenticated, they'll be prompted to log in before seeing the info page.

If device identity is enabled, the page will list unique Device IDs associated with the user's session, allowing users to identify their device and share that ID with administrators if needed. Users can also remove devices from their account directly from this page.

## User Data Endpoint

The `/.pomerium/user` endpoint returns information about the currently signed-in user in plaintext JSON format. It provides the same claims that Pomerium asserts about the user (email, ID, name, groups) but in a direct JSON object format rather than a signed token.

This endpoint is particularly useful for single-page applications that need to fetch user identity data without parsing a JWT. A front-end application can simply call `fetch('/.pomerium/user')` to display the user's email or perform client-side logic based on group claims.

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "groups": ["engineering", "admins"]
}
```

## JWT Retrieval Endpoint

*Deprecated in newer versions*

The `/.pomerium/jwt` endpoint returns the attestation JWT for the current session - the signed token Pomerium uses to convey user identity to upstream services via the `X-Pomerium-Jwt-Assertion` header.

Historically, single-page applications used this to decode user info from a JWT, but in modern usage, the `/.pomerium/user` endpoint generally replaces this functionality.

In Pomerium v0.27.0 and later, this endpoint is disabled by default and will be removed in a future release, though it can be temporarily re-enabled with a runtime flag.

## Programmatic Login URL API

The `/.pomerium/api/v1/login` endpoint initiates a programmatic login flow by generating a one-time sign-in URL. It's designed for CLI tools, scripts, or other non-browser clients that need to obtain Pomerium credentials via OAuth login.

This approach is valuable when you need an access token for an automated client. The process works in three steps:
1. Your application calls this endpoint with a `pomerium_redirect_uri` parameter to get a sign-in URL
2. The user opens this URL in a browser, which triggers the authentication flow
3. After successful authentication, the browser redirects to your specified URI with a `pomerium_jwt` query parameter
4. Your application extracts this token for further use

Unlike other endpoints, this one doesn't require an existing session - it's specifically designed to initiate the login process.

**Example:**  
```bash
curl "https://<your-app>/.pomerium/api/v1/login?pomerium_redirect_uri=http://localhost:5000/callback"
```

## Single Sign-Out Endpoint

The `/.pomerium/sign_out` endpoint logs the user out of Pomerium and optionally out of the identity provider as well. It clears session cookies and redirects to a post-logout page.

This endpoint is typically invoked when a user clicks "Logout" in your application or when you need a programmatic sign-out. The logout process follows these steps:
1. Pomerium clears the user's session cookie
2. The request redirects to the authenticate service's sign-out endpoint
3. The user is sent to a configured post-logout page, which can be specified via the `pomerium_redirect_uri` parameter

This endpoint supports front-channel logout when integrated with identity providers that support it.

## Device Enrollment Endpoint

The `/.pomerium/webauthn` endpoint handles device enrollment and attestation via WebAuthn as part of Pomerium's device identity feature. It manages the challenge/response flow between the user's browser and Pomerium.

This process is typically initiated when a user clicks a "Register Device" button, which starts the WebAuthn flow. The endpoint works differently depending on the HTTP method:
- A `GET` request provides a WebAuthn challenge to the browser
- A `POST` request accepts the attestation response from the browser, verifying and enrolling the device

The endpoint requires an authenticated session with a valid CSRF token to function properly.

## Device Enrollment Callback

The `/.pomerium/device-enrolled` endpoint finalizes the device enrollment process. After successful WebAuthn registration via the `/.pomerium/webauthn` endpoint, this callback confirms the device has been properly enrolled.

Users don't typically access this endpoint directly. Instead, the browser is automatically redirected here upon successful device registration, where either a confirmation message is displayed or the user is redirected back to the original application route.

---

For further details on programmatic login flows, device enrollment, and session management, refer to the associated sections in Pomerium's documentation. This reference page is intended to consolidate all internal endpoints for easier troubleshooting and integration.

**References:**  
- [Programmatic Access Documentation](https://www.pomerium.com/docs/internals/programmatic-access)  
- [Pomerium Authentication & SSO](https://www.pomerium.com/docs/authentication-sso)  
- [Device Identity and WebAuthn Integration](https://www.pomerium.com/docs/internals/device-identity)

*Note: Some endpoints may be deprecated or disabled by default in newer Pomerium versions. Always refer to the upgrade notes for the latest changes.*