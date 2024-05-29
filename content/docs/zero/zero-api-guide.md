---
id: zero-api-guide
title: Pomerium Zero API - Send your first request
sidebar_label: Send your first API request
description: This page shows you how to send your first API request to the Pomerium Zero API.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pomerium Zero API: Send your first request

This guide walks you through creating your first route, policy, and API user with the Pomerium Zero API.  

:::tip

Throughout this guide, you can refer to either the [**Zero API reference**](/docs/api) or the Zero API playground at `https://console.pomerium.app/openapi`.

:::

## 1. Authenticate

### Create an API User

The Zero API requires authenticated access for both personal accounts and organizations. To send an authenticated request, first create an **API User** in the Zero Console: 

1. In the **Account** menu, select **API Tokens**
1. Select **Add API User**
1. Name the API user and select **Create**
1. Copy the **API User Token** (keep it somewhere safe; you can't view it again)

### Get API User Token

Now, exchange the API User Token for an ID token by sending a `POST` request to the `token` endpoint. Make sure you replace `<API-USER-TOKEN>` with the one generated for you in the Zero Console:

```curl
curl --location 'https://console.pomerium.app/api/v0/token' \
--header 'Content-Type: application/json' \
--data '{
  "refreshToken": "<API-USER-TOKEN>"
}'
```

If your request was successful, you should get a response with a temporary ID token:

```json
{
    "expiresInSeconds": "3600",
    "idToken": "<ID-TOKEN>"
}
```

Copy the ID token and keep it somewhere safe. You won't be able to see it again, and you need it to make authenticated requests. 

## 2. Build an access policy with the Zero API



## 3. Create a route with the Zero API

To create a route, you need your organization ID and your namespace ID. 

### Get organization ID

In Pomerium Zero, there are two types of organizations: **personal** and **professional**. When you create an account, you get a personal organization by default. 

To get your personal organization ID, send a `GET` request to the `organizations` endpoint:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations' \
--header 'Authorization: Bearer <ID-TOKEN>' \
--data ''
```

If your request was successful, you should get a response similar to the example below:

```json
[
    {
        "createdAt": "2024-01-17T20:07:47.794672Z",
        "id": "<ORG-ID>",
        "joinedAt": "2024-05-29T20:27:27.336939Z",
        "name": "personal",
        "organizationType": "personal",
        "ownerUserId": "<USER-ID>",
        "role": "admin",
        "updatedAt": "2024-01-17T20:07:47.794672Z"
    }
]
```

Copy your organization ID so you can use it to create a route.

### Get namespace ID

TODO: Explain namespace relationship with clusters.

Now, send a `GET` request to the `/namespaces` endpoint, replacing `{organizationId}` with your own:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations/{organizationId}/namespaces' \
--header 'Authorization: Bearer <ID-TOKEN>'
```

You should get a response similar to the one below:

```json
[
    {
        "createdAt": "2024-01-17T20:07:47.794672Z",
        "id": "<NAMESPACE-ID>",
        "name": "personal",
        "role": "admin",
        "type": "root",
        "updatedAt": "2024-01-17T20:07:47.794672Z"
    }
]
```

Copy the namespace ID.

### Create a route

Now, send a `POST` request to the `/routes` endpoint. Make sure you replace `{organizationId}` with your personal organization ID, and `ID-TOKEN` with your own:

```curl
curl --location 'https://console.pomerium.app/api/v0/organizations/{organizationId}/routes' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ' \
--data '{
    "namespaceId": "<NAMESPACE-ID>",
    "name": "HTTP Bin",
    "from": "https://httpbin.grand-viper-9697.pomerium.app",
    "to": ["http://httpbin:80"],
    "allowWebsockets": false,
    "allowSpdy": false,
    "tlsSkipVerify": false,
    "tlsUpstreamAllowRenegotiation": false,
    "preserveHostHeader": false,
    "enableGoogleCloudServerlessAuthentication": false,
    "showErrorDetails": false,
    "policyIds": ["bsbjMgRcsgMRvGzcMZNRvcKJKPv"]
}'
```
