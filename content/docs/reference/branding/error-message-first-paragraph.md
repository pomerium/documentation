---
id: error-message-header
title: Error Message Header
description: |
  Customize the text and color of the Error Details page that Pomerium throws for 403 Unauthorized errors.
keywords: [branding, error messages header, 403 unauthorized, enterprise console]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Error Message Header

## Summary

**Error Message Header** customizes the error message that Pomerium displays on the Error Details page for `403 Unauthorized` errors.

Error messages must be written in plain text or [Markdown](https://www.markdownguide.org/basic-syntax/), and are only applied to routes where the **Show Error Details** setting is enabled.

## How to configure

| **Type** | **Default** |
| :--- | :--- |
| `string` | Pomerium error message |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

### Examples

Customize the **Error Message Header** in the Console:

1. Enter your custom error message

![Error message box](./img/branding-error-message-header.png)

2. Select **Show Error Details** for the route you want to display the custom error message

![Show error details for a specific route](./img/branding-show-error-details.png)

3. View your custom error message

![Shows custom error message](./img/branding-custom-error-message.png)
