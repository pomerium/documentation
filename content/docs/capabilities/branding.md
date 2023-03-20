---
sidebar_label: Custom Branding / Errors
description: Add custom colors, logos, and error messages.
---

# Custom Branding / White Labeling

:::tip

This article describes a use case available to [Pomerium Enterprise](/docs/enterprise/install/index.md) customers.

:::

Pomerium's user and administrative facing GUI and error messages can be customized to meet your organization's needs.

## Settings

Most of the Branding settings are located in the Branding Tab of the main Settings Page.

![Branding Settings in Pomerium Enterprise](./img/branding/no_branding_settings.png)

There is also a setting to enable Error Details on Edit Route's General Tab.

![Enable Error Details on a Route](./img/branding/enable_error_details.png)

Policies have two new fields, explanation and remediation.

Explanation is an optional short description of why the user would have been denied. Likewise, remediation is an optional field to cover how the user can self-remediate their state. Oftentimes, this will be a link to your internal help desk support site or knowledge base repo.

![Add custom error messages.](./img/branding/policy_with_explanation_and_remediation.png)

## Colors

Adding a [hex code](https://color.adobe.com/create/color-wheel) to the Primary Color setting will affect the majority of the theming on the console. For more details on how the types of colors will impact the look and feel of Pomerium, see Material Designs' [color documentation](https://material.io/resources/color/#!/?view.left=0&view.right=0)'s color documentation.

![Primary Color Pomerium Enterprise](./img/branding/branded_colors_console.png)

There is also a secondary color that is used for a few things such as certain button colors.

![Secondary Color Pomerium Enterprise](./img/branding/secondary_color.png)

Choosing colors also affects the majority of webpages served by Pomerium Core.

![Error Pages and User Info](./img/branding/branded_colors_error_details.png)

You can also set different colors for users using dark mode.

![Dark Mode Colors](./img/branding/branded_colors_darkmode_console.png)

## Logo

You may add a URL to link to your logo and favicon which will replace the Pomerium defaults.

![Replace the Logo and Favicon in Pomerium Enterprise](./img/branding/svg_logo_console.png)

It will also appear for all the user-facing webpages too.

![Replace the Logo and Favicon in Open Source webpages](./img/branding/svg_logo_error_details.png)

## Error Details

It is possible to customize the error messages displayed on 403 unauthorized pages.

This feature is enabled on a per Route basis by toggling the setting in the General Tab of the Route settings.

![Enable Error Details](./img/branding/enable_error_details.png)

Error Message will appear similar to this example.

![Extra Error Details](./img/branding/error_details_enabled.png)

Policies without an explanation or remediation field will show the policy ID.

If the explanation or remediation fields are added to the policy they will show up in the error details.

![Policy Settings](./img/branding/policy_with_explanation_and_remediation.png)

You can additionally add a Header paragraph that supports markdown to all error pages in the General Settings (same place you add colors and logos).

![Markdown Header](./img/branding/first_paragraph_setting.png)

You can see the link added to the Error Page.

![Markdown Header](./img/branding/includes_first_paragraph.png)
