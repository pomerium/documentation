---
title: Pomerium Enterprise
description: Learn what features come with Pomerium Enterprise, including a Console GUI where you can manage your policies, namespaces, groups, routes, and more.
keywords: [Pomerium Enterprise, PPL Builder, Console GUI, namespaces, directory sync, device management, groups, programmatic api, branding]
---

import ClearIcon from '@mui/icons-material/Clear';

# Pomerium Enterprise

Pomerium Enterprise is built on our open-source Pomerium Core offering. Pomerium Enterprise makes Pomerium easier to manage at scale, and adds additional functionality aimed at organizations with auditing, compliance, governance, and risk management needs.

## Key Pomerium Enterprise features

Pomerium Enterprise comes with all the capabiltiies in Pomerium Core. In addition to these capabilities, Pomerium Enterprise also provides the following features:

### Enterprise Console

The Enterprise Console dashboard is where you can view traffic and logs, manage routes and policies, import external data, and configure global and namespace settings.

![An overview animation of the Pomerium Enterprise Console](./enterprise/img/enterprise-console-overview.gif)

### Enterprise API

Integrate Pomerium into your workflows by managing configuration from the programming language or infrastructure management tool of your choice. Everything that is manageable in the Enterprise Console can also be driven programmatically through the [Enterprise API](/docs/capabilities/programmatic-access).

### Session management

Quickly view who is logged in your infrastructure, with easy access to revoke sessions.

![View and manage sessions in the Enterprise Console's Sessions dashboard](./enterprise/img/manage-sessions.png)

### Self-Service & Governance

Easily define who can control access to what areas of your infrastructure. Our [Namespaces](/docs/capabilities/namespacing) make it easy to allow teams to self-manage access to the infrastructure they build from or depend on.

[User roles](/docs/capabilities/namespacing#rbac-for-enterprise-console-users) are granted along Namespace hierarchy, with inheritance from parents.

Pomerium Enterprise uses teams and groups defined by your identity provider (**IdP**), so you can build stable policies that don't need to be adjusted as your company changes.

See [Self-Service Capabilities](/docs/capabilities/namespacing#self-service-capabilities) for more information.

![Manage Namespaces in the Enterprise Console's Namespaces dashboard](./enterprise/img/manage-namespaces.gif)

### Deployment History and Audit Logs

View and export change and access logs from the Enterprise Console. Pomerium Enterprise gives you a complete view of who's using it and how access is adjusted.

![View deployments in the Enterprise Console's Deployments dashboard](./enterprise/img/view-deployments.png)

![Compare changes in the Enterprise Console's Deployments diff modal](./enterprise/img/compare-changes.png)

## Pomerium Enterprise features comparison

| Features | Pomerium Core | Pomerium Enterprise |
| :--- | :--- | :--- |
| Enterprise Console | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Enterprise API](/docs/capabilities/programmatic-access) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Session Management](/docs/capabilities/reports#sessions) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Namespaces](/docs/capabilities/namespacing) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Directory Sync](/docs/integrations) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [User Impersonation](/docs/capabilities/impersonation) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Deployment History](/docs/capabilities/reports#deployments) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Device Identity](/docs/capabilities/device-identity) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Custom Branding](/docs/capabilities/branding) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Service Accounts](/docs/capabilities/service-accounts) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [Metrics](/docs/capabilities/metrics) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| [External Data Sources](/docs/integrations) | <ClearIcon /> | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| Identity-based Access | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| SSO Support | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| Declarative Authorization Policy | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
| TCP Support | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) | ![Pomerium checkmark](./enterprise/img/pomerium-checkmark.svg) |
