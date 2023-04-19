---
id: error-message-header
title: Error Message Header
description: |
  Customize the text and color of the Error Details page that Pomerium throws for 403 Unauthorized errors. 
keywords: [branding, error messages header, 403 unauthorized, enterprise console]
---

# Error Message Header

**Type:** `string` <br/>
**Default:** `string` (`''`)

**Error Message Header** customizes the error message that Pomerium displays on the Error Details page for `403 Unauthorized` errors.

Error messages must be written in plain text or [Markdown](https://www.markdownguide.org/basic-syntax/), and are only applied to routes where the **Show Error Details** setting is enabled.

![Error message box](./img/branding-error-messages.png)

![Show error details for a specific route](./img/branding-show-error-details.png)