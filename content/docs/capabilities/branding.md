---
title: 'Whitelabeling'
sidebar_label: 'Whitelabeling'
description: "Customize Pomerium's user-facing and administrative UI with your organization's branding."
keywords:
  - 'pomerium'
  - 'custom branding'
  - 'white labeling'
  - 'beyondcorp'
  - 'zero trust'
  - 'compliance'
---

# White Labeling

:::enterprise

This article describes a use case available to [Pomerium Enterprise](/docs/deploy/enterprise/install) customers.

:::

## Overview

Pomerium Enterprise allows you to visually align your identity-aware proxy with your organization's brand identity. You can replace Pomerium's default logos, change color themes, and add your own favicon to ensure that all administrative pages and user-facing prompts feel like a natural extension of your existing portals.

For instructions on customizing error pages and enabling user self-remediation, see [Self-Remediation & Custom Error Pages](/docs/capabilities/self-remediation).

## Settings

Most Branding options reside in the **Branding** tab of the **Settings** page:

![Branding Settings in Pomerium Enterprise](./img/branding/no_branding_settings.png)

### Colors

By adding a [hex code](https://color.adobe.com/create/color-wheel) in **Primary Color** and **Secondary Color**, you can seamlessly alter the console's UI to match your brand guidelines.

![Primary Color Pomerium Enterprise](./img/branding/branded_colors_console.png)

If you have users who prefer dark mode, you can add a different primary/secondary palette for dark mode:

![Dark Mode Colors](./img/branding/branded_colors_darkmode_console.png)

This ensures a consistent brand experience whether someone is an admin in the console or a user landing on Pomerium's sign-in pages.

### Logo

You can replace Pomerium's default logo and favicon by specifying a custom URL:

![Replace the Logo and Favicon in Pomerium Enterprise](./img/branding/svg_logo_console.png)

Both administrative and user-facing pages will use your organization's imagery:

![Replace the Logo and Favicon in Open Source webpages](./img/branding/svg_logo_error_details.png)

## Why White Labeling?

- **Professional Appearance**: Present a unified front to end users, ensuring they associate your secure portal with your organization's branding.
- **Trust & Familiarity**: A consistent identity lowers user confusion, especially for teams already accustomed to your internal brand or product suite.
- **Easier User Adoption**: When Pomerium “feels” like part of your standard workflow, employees are more likely to comply with zero-trust and security measures.

White labeling is not merely cosmetic; it's a critical step to assure teams that they're accessing official, trusted corporate resources—enhancing user confidence and security posture.

## Configuration Settings

This reference covers all of Pomerium's branding settings:

- [Primary Color](#primary-color)
- [Secondary Color](#secondary-color)
- [Primary Color (Dark Mode)](#primary-color-dark-mode)
- [Secondary Color (Dark Mode)](#secondary-color-dark-mode)
- [Favicon URL](#favicon-url)
- [Logo URL](#logo-url)
- [Error Message Header](#error-message-header)

### Primary Color {#primary-color}

**Primary Color** sets the primary color for the **Enterprise Console** and **Route Error Details** pages when users are in **Light Mode**.

#### How to configure {#primary-color-how-to-configure}

| **Type**   | **Default**                 |
| :--------- | :-------------------------- |
| `hex code` | Pomerium Purple (`#6F43E7`) |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#primary-color-examples}

Customize **Primary Color** in the Console:

![Set custom primary color for light mode](./img/branding/branding-primary-light-mode.png)

### Secondary Color {#secondary-color}

**Secondary Color** sets the primary color for the **Enterprise Console** and **Route Error Details** pages when users are in **Light Mode**.

#### How to configure {#secondary-color-how-to-configure}

| **Type**   | **Default**                 |
| :--------- | :-------------------------- |
| `hex code` | Pomerium Purple (`#6F43E7`) |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#secondary-color-examples}

Customize **Secondary Color** in the Console:

![Set custom secondary color for light mode](./img/branding/branding-secondary-light-mode.png)

### Primary Color (Dark Mode) {#primary-color-dark-mode}

**Primary Color (Dark Mode)** sets the primary color for the **Enterprise Console** and **Route Error Details** pages when users are in **Dark Mode**.

#### How to configure {#primary-color-dark-mode-how-to-configure}

| **Type**   | **Default**                 |
| :--------- | :-------------------------- |
| `hex code` | Pomerium Purple (`#6F43E7`) |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#primary-color-dark-mode-examples}

Customize **Primary Color (Dark Mode)** in the Console:

![Set custom primary color for dark mode](./img/branding/branding-dark-mode.png)

### Secondary Color (Dark Mode) {#secondary-color-dark-mode}

**Secondary Color (Dark Mode)** sets the secondary color for the **Enterprise Console** and **Route Error Details** pages when users are in **Dark Mode**.

#### How to configure {#secondary-color-dark-mode-how-to-configure}

| **Type**   | **Default**                |
| :--------- | :------------------------- |
| `hex code` | Pomerium Green (`#49AAA1`) |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#secondary-color-dark-mode-examples}

Customize **Secondary Color (Dark Mode)** in the Console:

![Set custom secondary color for dark mode](./img/branding/branding-dark-mode-secondary.png)

### Favicon URL {#favicon-url}

**Favicon URL** customizes the Favicon displayed in the Enterprise Console and Open Source endpoints.

#### How to configure {#favicon-url-how-to-configure}

| **Type** | **Default**      |
| :------- | :--------------- |
| `URL`    | Pomerium Favicon |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#favicon-url-examples}

Customize **Favicon URL** in the Console:

![Replace the Favicon in Pomerium Enterprise](./img/branding/branding-favicon-url.png)

### Logo URL {#logo-url}

**Logo URL** customizes the logo displayed in the Enterprise Console and Open Source endpoints.

#### How to configure {#logo-url-how-to-configure}

| **Type** | **Default**   |
| :------- | :------------ |
| `URL`    | Pomerium Logo |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#logo-url-examples}

Customize **Logo URL** in the Console:

![Replace the Logo in Pomerium Enterprise](./img/branding/branding-custom-logo.png)

### Error Message Header {#error-message-header}

**Error Message Header** customizes the error message that Pomerium displays on the Error Details page for `403 Unauthorized` errors.

Error messages must be written in plain text or [Markdown](https://www.markdownguide.org/basic-syntax/), and are only applied to routes where the **Show Error Details** setting is enabled.

#### How to configure {#error-message-header-how-to-configure}

| **Type** | **Default**            |
| :------- | :--------------------- |
| `string` | Pomerium error message |

See [Custom Branding / Errors](/docs/capabilities/branding) for more information.

#### Examples {#error-message-header-examples}

Customize the **Error Message Header** in the Console:

1. Enter your custom error message ![Error message box](./img/branding/branding-error-message-header.png)

1. Select **Show Error Details** for the route where you want to display the custom error message ![Show error details for a specific route](./img/branding/branding-show-error-details.png)

1. View your custom error message ![Shows custom error message](./img/branding/branding-custom-error-message.png)
