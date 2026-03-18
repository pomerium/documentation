---
title: Terraform
description: Learn how to manage your Pomerium configuration using Terraform, including authentication setup, resource management, and deployment examples.
keywords:
  [
    Pomerium Enterprise,
    Terraform,
    IaC,
    infrastructure as code,
    configuration management,
    service accounts,
    provider configuration,
  ]
---

# Configure with Terraform

Pomerium Core, Enterprise and Zero can be configured and managed using Terraform through the [official Pomerium provider](https://registry.terraform.io/providers/pomerium/pomerium/latest/docs). This enables you to manage your Pomerium resources as infrastructure as code, making it easier to version, review, and automate your configuration changes.

## Prerequisites

- For Pomerium Core:
  - A running instance of Core
  - gRPC port must be accessible
- For Pomerium Enterprise:
  - A running instance of Core and Enterprise
  - Console API must be accessible
- For Pomerium Zero:
  - An API user for Zero must be created

## Provider Configuration

To use the Pomerium Terraform provider, first configure it in your Terraform configuration:

```hcl
terraform {
  required_providers {
    pomerium = {
      source  = "pomerium/pomerium"
      version = "~> 0.31.0"
    }
  }
}

provider "pomerium" {
  # For Zero use "https://console.pomerium.app"
  # For Core use the gRPC address, e.g. "http://your-server:5443"
  api_url = "https://console-api.your-domain.com"
  # Choose one of the authentication methods below
}
```

## Authentication Methods

The provider supports one of the two authentication methods:

### 1. Service Account Token

For Pomerium Enterprise or Pomerium Zero, a service account can be used:

```hcl
provider "pomerium" {
  api_url               = "https://console-api.your-domain.com"
  service_account_token = var.pomerium_service_account_token
}
```

In Pomerium Zero the service account corresponds to an API User.

In Pomerium Enterprise the service account token corresponds to a service account and the Pomerium route for the Console API should grant access to the service account user:

```yaml
- allow:
    or:
      - user:
          is: "bootstrap-014e587b-3f4b-4fcf-90a9-f6ecdf8154af.pomerium"
```

### 2. Shared Secret

For Pomerium Core and Pomerium Enterprise, the shared secret can be used.

For Pomerium Enterprise this method requires enabling bootstrap service accounts in your Enterprise Console. It may be used if you wish to configure Pomerium Enterprise part of the installation process, without accessing its UI to create a new service account.

```hcl
provider "pomerium" {
  api_url          = "https://console-api.your-domain.com"
  shared_secret_b64 = var.shared_secret_b64
}
```

The Pomerium API route should have the following policy, with the special bootstrap service account user ID.

```yaml
- allow:
    or:
      - user:
          is: "bootstrap-014e587b-3f4b-4fcf-90a9-f6ecdf8154af.pomerium"
```

:::warning

The Bootstrap Service Account method requires setting `BOOTSTRAP_SERVICE_ACCOUNT=true` in your Enterprise Console configuration.

:::

## Example

```hcl
  resource "pomerium_namespace" "engineering" {
    name = "engineering"
  }

  resource "pomerium_policy" "engineering_policy" {
    name = "engineering-policy"
    namespace = pomerium_namespace.engineering.id
    ppl = yamlencode({
        allow = {
        and = [
            {
                groups = {
                    has = "engineering"
                }
            }
        ]
        }
    })
  }

  resource "pomerium_route" "internal_tools" {
    name = "internal-tools"
    namespace = pomerium_namespace.engineering.id
    from = "https://tools.example.com"
    to = ["https://internal-tools.local"]
    policies = [
      pomerium_policy.engineering_policy.id
    ]
  }
```

## Next Steps

- [Provider Documentation](https://registry.terraform.io/providers/pomerium/pomerium/latest/docs)
- [Example Configurations](https://github.com/pomerium/enterprise-terraform-provider/tree/main/example)
- [Enterprise API Reference](/docs/internals/management-api-enterprise)
- [Service Accounts](/docs/capabilities/service-accounts)
