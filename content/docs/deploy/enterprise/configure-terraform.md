---
title: Configure with Terraform
description: Learn how to manage your Pomerium Enterprise configuration using Terraform, including authentication setup, resource management, and deployment examples.
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

Pomerium Enterprise can be configured and managed using Terraform through our official provider. This enables you to manage your Pomerium Enterprise resources as infrastructure as code, making it easier to version, review, and automate your configuration changes.

## Provider Configuration

To use the Pomerium Terraform provider, first configure it in your Terraform configuration:

```hcl
terraform {
  required_providers {
    pomerium = {
      source  = "pomerium/pomerium"
      version = "~> 0.0.7"
    }
  }
}

provider "pomerium" {
  api_url = "https://console-api.your-domain.com"
  # Choose one of the authentication methods below
}
```

## Authentication Methods

The provider supports two authentication methods:

### 1. Service Account Token (Recommended)

This method uses a [Pomerium Enterprise Service Account](/docs/capabilities/service-accounts) and provides fine-grained access control at the namespace level:

```hcl
provider "pomerium" {
  api_url               = "https://console-api.your-domain.com"
  service_account_token = var.pomerium_service_account_token
}
```

### 2. Bootstrap Service Account

This method requires enabling bootstrap service accounts in your Enterprise Console:

```hcl
provider "pomerium" {
  api_url          = "https://console-api.your-domain.com"
  shared_secret_b64 = var.shared_secret_b64
}
```

:::warning The Bootstrap Service Account method requires setting `BOOTSTRAP_SERVICE_ACCOUNT=true` in your Enterprise Console configuration. :::

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
  }
```

## Next Steps

- [Provider Documentation](https://registry.terraform.io/providers/pomerium/pomerium/latest/docs)
- [Example Configurations](https://github.com/pomerium/enterprise-terraform-provider/tree/main/examples)
- [Enterprise API Reference](/docs/internals/management-api-enterprise)
- [Service Accounts](/docs/capabilities/service-accounts)
