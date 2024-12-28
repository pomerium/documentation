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

Pomerium Enterprise allows you to visually align your identity-aware proxy with your organization’s brand identity. You can replace Pomerium’s default logos, change color themes, and add your own favicon to ensure that all administrative pages and user-facing prompts feel like a natural extension of your existing portals.

For instructions on customizing error pages and enabling user self-remediation, see [Self-Remediation & Custom Error Pages](/docs/enterprise/capabilities/custom-error-pages).

## Settings

Most Branding options reside in the **Branding** tab of the **Settings** page:

![Branding Settings in Pomerium Enterprise](./img/branding/no_branding_settings.png)

### Colors

By adding a [hex code](https://color.adobe.com/create/color-wheel) in **Primary Color** and **Secondary Color**, you can seamlessly alter the console’s UI to match your brand guidelines.

![Primary Color Pomerium Enterprise](./img/branding/branded_colors_console.png)

If you have users who prefer dark mode, you can add a different primary/secondary palette for dark mode:

![Dark Mode Colors](./img/branding/branded_colors_darkmode_console.png)

This ensures a consistent brand experience whether someone is an admin in the console or a user landing on Pomerium’s sign-in pages.

### Logo

You can replace Pomerium’s default logo and favicon by specifying a custom URL:

![Replace the Logo and Favicon in Pomerium Enterprise](./img/branding/svg_logo_console.png)

Both administrative and user-facing pages will use your organization’s imagery:

![Replace the Logo and Favicon in Open Source webpages](./img/branding/svg_logo_error_details.png)

## Why White Labeling?

- **Professional Appearance**: Present a unified front to end users, ensuring they associate your secure portal with your organization’s branding.
- **Trust & Familiarity**: A consistent identity lowers user confusion, especially for teams already accustomed to your internal brand or product suite.
- **Easier User Adoption**: When Pomerium “feels” like part of your standard workflow, employees are more likely to comply with zero-trust and security measures.

White labeling is not merely cosmetic; it’s a critical step to assure teams that they’re accessing official, trusted corporate resources—enhancing user confidence and security posture.
