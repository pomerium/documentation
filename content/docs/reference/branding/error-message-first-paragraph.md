---
id: error-message-header
title: Error Message Header
description: |
  Customize the text and color of the Error Details page that Pomerium throws for 403 Unauthorized errors. 
keywords: [branding, error messages header, 403 unauthorized, enterprise console]
---

# Error Message Header

---

**Type:** `string` <br/>
**Example:** `You are not authorized to access this **URL**` <br/>
**Default:** Pomerium's error message

---

**Error Message Header** customizes the error message that Pomerium displays on the Error Details page for `403 Unauthorized` errors.

Error messages must be written in plain text or [Markdown](https://www.markdownguide.org/basic-syntax/), and are only applied to routes where the **Show Error Details** setting is enabled.

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

![Error message box](./img/branding-error-message-header.png)

![Show error details for a specific route](./img/branding-show-error-details.png)

![Shows custom error message](./img/branding-custom-error-message.png)