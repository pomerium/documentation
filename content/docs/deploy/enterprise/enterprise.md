---
title: Pomerium Enterprise
description: Learn what features come with Pomerium Enterprise, including a Console GUI where you can manage your policies, namespaces, groups, routes, and more.
keywords:
  [
    Pomerium Enterprise,
    PPL Builder,
    Console GUI,
    namespaces,
    directory sync,
    device management,
    groups,
    programmatic api,
    branding,
  ]
---

import ClearIcon from '@mui/icons-material/Clear';

# Pomerium Enterprise

Pomerium Enterprise is built on our open-source Pomerium Core offering. Pomerium Enterprise makes Pomerium easier to manage at scale, and adds additional functionality aimed at organizations with auditing, compliance, governance, and risk management needs.

## Pomerium Enterprise Features

Pomerium Enterprise comes with all the capabilities in Pomerium Core, plus the following features:

### Enterprise Console

The **Enterprise Console** provides a dashboard where you can view traffic and logs, manage routes and policies, import external data, configure global and namespaced settings, and more.

![An overview animation of the Pomerium Enterprise Console](./img/enterprise-console-overview.gif)

### Enterprise API

The **Enterprise API** helps you manage your configuration with your preferred programming language or infrastructure management tool.

Everything that is manageable in the Enterprise Console can also be driven programmatically through the [Enterprise API](/docs/internals/management-api-enterprise).

### Session Management

The **Sessions** dashboard allows you to view and manage sessions within your organization. Admin members can export session data and revoke sessions in real time.

![View and manage sessions in the Enterprise Console's Sessions dashboard](./img/manage-sessions.png)

:::enterprise

Ready to upgrade to Pomerium Enterprise? [**Contact us**](https://www.pomerium.com/enterprise-sales/) today to get started.

:::

### Namespaces and Self-Service

The **Namespaces** dashboard is where you configure user roles and permissions for routes, policies, and the Enterprise Console itself. Once you've configured a [Namespace](/docs/internals/namespacing), members of that namespace can self-manage access to the infrastructure they build from or depend on.

Pomerium Enterprise allows you to import groups defined by your identity provider. This allows you to build stable policies that don't require adjustments as your company changes.

![Manage Namespaces in the Enterprise Console's Namespaces dashboard](./img/manage-namespaces.gif)

### Clusters

In the **Namespaces** dashboard you can also add [**Clusters**](/docs/internals/clusters-for-enterprise) &mdash; independent installations of [Pomerium Core](/docs/deploy/core), each with their own set of routes, certificates, and policies.

![Add Cluster](../../internals/img/clusters/enterprise-add-cluster.png)

### Deployment History and Audit Logs

The **Deployments** dashboard allows you to view and export change logs from the Enterprise Console. Select a change to review which user applied it and when.

![View deployments in the Enterprise Console's Deployments dashboard](./img/deployments-dashboard.gif)

### Directory Sync

Pomerium Enterprise's [**Directory Sync**](/docs/integrations/user-standing/directory-sync) feature allows you to import your identity provider's directory data. After a successful sync, you can use your internal groups and teams data when building policies. ![Viewing the Identity Providers settings for a directory sync in the Enterprise Console](./img/directory-sync-2.png)

### External Data Sources

In the **External Data** dashboard, you can import, view, and manage [external data sources](/docs/capabilities/integrations). After a successful sync, you can use data unique to your organization to serve as context in your authorization policies. ![Using the External Data Source Record type in a policy](./img/external-data-as-context.gif)

## Pomerium Enterprise features comparison

| Features | Pomerium Core | Pomerium Enterprise |
| :-- | :-- | :-- |
| Identity-based Access | ![Pomerium checkmark](./img/pomerium-checkmark.svg) | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| SSO Support | ![Pomerium checkmark](./img/pomerium-checkmark.svg) | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| Declarative Authorization Policy | ![Pomerium checkmark](./img/pomerium-checkmark.svg) | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| TCP Support | ![Pomerium checkmark](./img/pomerium-checkmark.svg) | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| Enterprise Console | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Enterprise API](/docs/internals/management-api-enterprise) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Session Management](/docs/internals/metrics#sessions) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Namespaces](/docs/internals/namespacing) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Directory Sync](/docs/integrations/user-standing/directory-sync) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [User Impersonation](/docs/capabilities/impersonation) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Deployment History](/docs/internals/metrics#changesets-and-deployments) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Device Identity](/docs/integrations/device-context/device-identity) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Custom Branding](/docs/capabilities/branding) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Service Accounts](/docs/capabilities/service-accounts) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [Metrics](/docs/internals/metrics) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |
| [External Data Sources](/docs/capabilities/integrations) | <ClearIcon /> | ![Pomerium checkmark](./img/pomerium-checkmark.svg) |

## Next Steps

:::enterprise

Already upgraded to Pomerium Enterprise, but need some help setting up the Enterprise Console?

The following docs can help:

- [**Install Pomerium Enterprise**](/docs/deploy/enterprise/install)
- [**Pomerium Enterprise Configuration**](/docs/deploy/enterprise/configure)
- [**Pomerium Enterprise Quickstart**](/docs/deploy/enterprise/quickstart)

:::
