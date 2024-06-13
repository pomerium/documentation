---
# cSpell:ignore bwjk, Zwxb, NXBQH, Bbxt, Wxgvn, Mehb, PJRSZWSB, Jbsv, Kjvn, Rpmww

id: zero-api-guide
title: Get Started With the Pomerium Zero API
sidebar_label: API User Guide
description: This page shows you how to create a route and policy with the Pomerium Zero API.
---

# Get Started With the Pomerium Zero API

This guide walks you through creating your first route and policy with the Pomerium Zero API.

:::tip

Throughout this guide, you can refer to either the [**Zero API reference**](/docs/api) or the Zero API playground at `https://console.pomerium.app/openapi`.

:::

## 1. Authenticate

### Get API User Token

The Zero API requires authenticated access for both personal accounts and organizations. To send an authenticated request, first create an **API User** in the Zero Console:

1. In the **Account** menu, select **API Tokens**
1. Select **Add API User**
1. Name the API user and select **Create**
1. Copy the **API User Token** (keep it somewhere safe; you can't view it again)

### Get ID token

Now, exchange the API User Token for an ID token by sending a `POST` request to the `/token` endpoint. Make sure you replace `<API-USER-TOKEN>` with the one generated for you in the Zero Console:

```curl
curl --location 'https://console.pomerium.app/api/v0/token' \
--header 'Content-Type: application/json' \
--data '{
  "refreshToken": "<API-USER-TOKEN>"
}'
```

If your request was successful, you'll get a response with a temporary ID token:

```json showLineNumbers
{
  "expiresInSeconds": "3600",
  "idToken": "<ID-TOKEN>"
}
```

Copy the ID token and keep it somewhere safe. You won't be able to see it again, and you need it to make authenticated requests.

## 2. Create a policy

To create a policy, you need your organization ID and your namespace ID.

### Get organization ID

There are two types of organizations: **personal** and **professional**. When you create an account, you get a personal organization by default.

To get your personal organization ID, send a `GET` request to the `/organizations` endpoint:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations' \
--header 'Authorization: Bearer <ID-TOKEN>'
```

If your request was successful, you'll get a response with your organization ID and other related metadata:

```json showLineNumbers {4}
[
  {
    "createdAt": "2024-01-17T20:07:47.794672Z",
    "id": "bwjkRZwxbNXBQHHcJHphGSNBbxt",
    "joinedAt": "2024-05-29T20:27:27.336939Z",
    "name": "personal",
    "organizationType": "personal",
    "ownerUserId": "bMWxgvnRQfcRHjQvfMehbJhYFzB",
    "role": "admin",
    "updatedAt": "2024-01-17T20:07:47.794672Z"
  }
]
```

Copy your organization ID.

### Get cluster ID

To make changes to a cluster's configuration, you need its cluster ID. To get the cluster ID, send a `GET` request to the `/clusters` endpoint, replacing `{organizationId}` with your own:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations/{organizationId}/clusters' \
--header 'Authorization: Bearer <ID-TOKEN>'
```

You'll get a response similar to the example below:

```json showLineNumbers {8}
[
  {
    "autoDetectIpAddress": "47.35.228.147",
    "createdAt": "2024-01-17T20:07:49.173932Z",
    "domain": "trusted-dog-1049",
    "fqdn": "trusted-dog-1049.pomerium.app",
    "hasFailingHealthChecks": true,
    "id": "bjQWGxKgPJRSZWSBWpgRWMpJbsv",
    "manualOverrideIpAddress": "127.0.0.1",
    "name": "trusted-dog-1049",
    "namespaceId": "bjQWGxKgPJRSZWSBWpgRWMpJbsv",
    "updatedAt": "2024-06-13T14:22:39.336616Z"
  }
]
```

Copy the cluster ID.

### Build a policy

Now, you'll build a policy that only grants access if the user's email address matches exactly the email address specified in the policy.

To create a policy, send a `POST` request to the `/policies` endpoint:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations/{organizationId}/policies' \
--header 'Content-Type: application/json' \
--header 'Authorization: <ID-TOKEN>' \
--data-raw '{
  "namespaceId": "bwjkRZwxbNXBQHHcJHphGSNBbxt",
  "name": "Allow only matching email",
  "enforced": false,
  "ppl": {
    "allow": {
      "and": [
        {"email":
            {
            "is": "user@example.com"
            }
        }
      ]
    }
  },
  "description": "Only allow users access with a matching email address.",
  "explanation": "You don'\''t have the correct email address to access this service.",
  "remediation": "Use account credentials that match policy requirements."
}'
```

:::info

In the request example above, setting the `"enforced"` field to `false` means that the policy won't be automatically assigned to routes in your cluster. Setting this field to `true` has the opposite effect: it will assign this policy to your existing routes and any new routes added to your cluster.

:::

If your request was successful, you should receive a response similar to the one below. Notice that the `"routes"` field is empty because this policy hasn't been assigned yet:

```json showLineNumbers {22}
{
  "createdAt": "2024-05-30T17:04:33.460441Z",
  "description": "Only allow users with a matching email address.",
  "enforced": false,
  "enforcedRoutes": [],
  "explanation": "You don't have the correct email address to access this service.",
  "id": "bgrXNgrJFJmMZvPsVsbZHGWxVWP",
  "name": "Allow matching email",
  "namespaceId": "bwjkRZwxbNXBQHHcJHphGSNBbxt",
  "ppl": {
    "allow": {
      "and": [
        {
          "email": {
            "is": "user@example.com"
          }
        }
      ]
    }
  },
  "remediation": "Use account credentials that match policy requirements.",
  "routes": [],
  "updatedAt": "2024-05-30T17:04:33.460441Z"
}
```

## 3. Create a route

Next, you'll create a route and attach it to the policy you just created. In this example, we're using [HTTPBin](https://httpbin.org/) as an example service, but you can use any service you want.

To create a route, you need to send a `POST` request to the `/routes` endpoint with your organization ID, namespace ID, and the policy ID of the policy you just created. Make sure you replace `{CLUSTER_STARTER_SUBDOMAIN}` in the `"from"` field with your own:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations/{organizationId}/routes' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {ID-TOKEN}' \
--data '{
    "namespaceId": "bwjkRZwxbNXBQHHcJHphGSNBbxt",
    "name": "HTTP Bin",
    "from": "https://httpbin.{CLUSTER_STARTER_SUBDOMAIN}.pomerium.app",
    "to": ["http://httpbin:80"],
    "policyIds": ["bgrXNgrJFJmMZvPsVsbZHGWxVWP"]
}'
```

You'll receive a response like the one below:

```json
{
  "allowSpdy": false,
  "allowWebsockets": false,
  "createdAt": "2024-05-30T20:21:05.087872Z",
  "enableGoogleCloudServerlessAuthentication": false,
  "enforcedPolicies": [],
  "enforcedPolicyIds": [],
  "from": "https://httpbin.trusted-dog-1049.pomerium.app",
  "id": "bFjRpQrVGFcBMWzKjvnRpmwwRXh",
  "name": "HTTP Bin",
  "namespaceId": "bwjkRZwxbNXBQHHcJHphGSNBbxt",
  "policies": [
    {
      "id": "bgrXNgrJFJmMZvPsVsbZHGWxVWP",
      "name": "Allow matching email"
    }
  ],
  "policyIds": ["bgrXNgrJFJmMZvPsVsbZHGWxVWP"],
  "preserveHostHeader": false,
  "showErrorDetails": false,
  "tlsSkipVerify": false,
  "tlsUpstreamAllowRenegotiation": false,
  "to": ["http://httpbin:80"],
  "updatedAt": "2024-05-30T20:21:05.087872Z"
}
```
