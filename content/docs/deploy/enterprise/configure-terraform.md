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

Pomerium Enterprise can be configured and managed using Terraform through the [official Pomerium provider](https://registry.terraform.io/providers/pomerium/pomerium/latest/docs). This enables you to manage your Pomerium Enterprise resources as infrastructure as code, making it easier to version, review, and automate your configuration changes.

## Prerequisites

- Pomerium Enterprise must be running first
- Console API must be accessible

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

The provider supports one of the two authentication methods:

### 1. Service Account Token

This method uses a [Pomerium Enterprise Service Account](/docs/capabilities/service-accounts) and provides fine-grained access control at the namespace level:

```hcl
provider "pomerium" {
  api_url               = "https://console-api.your-domain.com"
  service_account_token = var.pomerium_service_account_token
}
```

The Pomerium API route should authorize the relative pomerium service account access:

```yaml
- allow:
    or:
      - user:
          is: 'bootstrap-014e587b-3f4b-4fcf-90a9-f6ecdf8154af.pomerium'
```

### 2. Bootstrap Service Account

This method requires enabling bootstrap service accounts in your Enterprise Console. It may be used if you wish to configure Pomerium Enterprise part of the installation process, without accessing its UI to create a new service account.

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
          is: 'bootstrap-014e587b-3f4b-4fcf-90a9-f6ecdf8154af.pomerium'
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
