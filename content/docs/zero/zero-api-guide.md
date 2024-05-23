---
id: zero-api-guide
title: Pomerium Zero API User Guide
sidebar_label: API User Guide
description: This page shows you how to configure your cluster programmatically with the Zero API.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pomerium Zero API User Guide

This user guide shows you how to programmatically configure your cluster with the Pomerium Zero API. Anything that can be configured in the Zero Console can also be done through the Zero API. 

Throughout this guide, you can refer to either the [Zero API reference](/docs/api) or the Zero API playground at `https://console.pomerium.app/openapi`.

## Authenticate

The Zero API requires authenticated access for both personal accounts and organizations. To send an authenticated request, you must first create an **API User** in the Zero Console: 

1. In the **Account** menu, select **API Tokens**
1. Select **Add API User**
1. Enter a **Name** and select **Create**
1. Copy the **API User Token** (keep it somewhere safe; you can't view it again)

Now, you must exchange the API User Token for an ID token using the `getIdToken` method. Send a `POST` request to the `token` endpoint:



:::note

API User accounts are scoped to the organization they are created in. For example, an API User account created in a "personal" organization can't make API calls for a "professional" type organization in the same cluster.

:::

:::note

Once you've created your first API User account in the Zero Console, you can create additional API user accounts programmatically with the the [`createApiAccessUser`](/docs/api#tag/user/operation/createApiAccessUser) endpoint.

:::