---
title: Pomerium Enterprise
description: Install, configure, and operate the self-hosted Pomerium Enterprise control plane for Pomerium Core clusters.
sidebar_position: 3
keywords:
  [
    Pomerium Enterprise,
    Enterprise Console,
    Enterprise API,
    self-hosted control plane,
    namespaces,
    directory sync,
    service accounts,
    metrics,
    terraform,
  ]
---

# Pomerium Enterprise

Pomerium Enterprise is the self-hosted control plane for Pomerium Core clusters. Core still runs in your environment and proxies traffic to your applications. Enterprise adds the Console, API, centralized configuration, governance, audit history, and operational visibility for teams that need to manage Pomerium at scale.

## Enterprise Console

The Enterprise Console is the browser-based management UI and API surface for Enterprise deployments. Use it to manage global settings, namespaces, routes, policies, certificates, external data, directory sync, sessions, service accounts, deployment history, and operational dashboards.

## Start Here

| Goal | Page | Use it for |
| :-- | :-- | :-- |
| Try Enterprise locally | [Quickstart](/docs/deploy/enterprise/quickstart) | Run Core, the Enterprise Console, PostgreSQL, and a test app with Docker Compose. |
| Install Enterprise | [Install](/docs/deploy/enterprise/install) | Choose Docker, OS packages, Kubernetes with Kustomize, or Kubernetes with Terraform. |
| Set Console options | [Configuration](/docs/deploy/enterprise/configure) | Configure bootstrap admins, licensing, database access, Databroker access, TLS, and runtime flags. |
| Enable traffic metrics | [Metrics](/docs/deploy/enterprise/configure-metrics) | Connect Enterprise to external Prometheus or use the embedded Prometheus mode. |
| Manage resources as code | [Terraform](/docs/deploy/terraform) | Configure Core, Enterprise, or Zero resources with the Pomerium Terraform provider. |
| Upgrade safely | [Upgrading](/docs/deploy/upgrading) | Review version-specific Core and Enterprise upgrade notes. |

## How Enterprise Fits With Core

An Enterprise deployment has three required pieces:

1. **Pomerium Core** is the data plane. It authenticates users, authorizes requests, proxies traffic, stores Databroker state, and protects the Console route.
1. **Pomerium Enterprise Console** is the self-hosted management plane. It stores its own data in PostgreSQL, connects to the Core Databroker, and exposes the Console UI and Enterprise API.
1. **A protected Console route** in Core sends authenticated users to the Console and passes identity headers so Enterprise can authorize administrators and namespace members.

Keep Core and Enterprise Console on the same minor version. For example, Core `v0.32.x` with Enterprise Console `v0.32.x` is supported; Core `v0.32.x` with Enterprise Console `v0.31.x` is not. The Docker examples in these docs use Pomerium Core `v0.32.6` and Enterprise Console `v0.32.1`.

:::caution

For the v0.32 upgrade path, upgrade the Enterprise Console before upgrading Core. See [Upgrading Pomerium Enterprise](/docs/deploy/upgrading#upgrading-pomerium-enterprise).

:::

## Enterprise Capabilities

| Area | Enterprise adds |
| :-- | :-- |
| Central management | The [Enterprise Console](/docs/deploy/enterprise/install) and [Enterprise API](/docs/internals/management-api-enterprise) for managing routes, policies, certificates, settings, and namespaces. |
| Delegated administration | [Namespaces](/docs/internals/namespacing) for RBAC and self-service management across teams. |
| Identity context | [Directory Sync](/docs/integrations/user-standing/directory-sync), [Device Identity](/docs/integrations/device-context/device-identity), and [External Data Sources](/docs/capabilities/integrations) for richer policy context. |
| Automation | [Service accounts](/docs/capabilities/service-accounts), the Enterprise API, and [Terraform](/docs/deploy/terraform) for infrastructure-as-code workflows. |
| Operations | [Session management](/docs/internals/sessions), [audit logs](/docs/capabilities/audit-logs), deployment history, and [metrics](/docs/deploy/enterprise/configure-metrics). |
| User experience | [Custom branding](/docs/capabilities/branding), [user impersonation](/docs/capabilities/impersonation), and self-service access workflows. |

## Setup Sequence

1. Install or confirm a working [Pomerium Core](/docs/deploy/core) deployment.
1. Install the Enterprise Console with [Docker, OS packages, Kubernetes, or Terraform](/docs/deploy/enterprise/install).
1. Configure the Console database, license key, shared secret, Databroker connection, and initial administrators.
1. Protect the Console route with Core and enable identity headers.
1. Add optional operations features such as [metrics](/docs/deploy/enterprise/configure-metrics), [Terraform configuration](/docs/deploy/terraform), directory sync, external data, and service accounts.
