---
id: kubernetes-service-account-token
title: Kubernetes Service Account Token
keywords:
  - reference
  - Kubernetes Service Account Token
pagination_prev: null
pagination_next: null
---

# Kubernetes Service Account Token

- `yaml`/`json` setting: `kubernetes_service_account_token` / `kubernetes_service_account_token_file`
- Type: `string` or relative file location containing a Kubernetes bearer token
- Optional
- Example: `eyJ0eXAiOiJKV1QiLCJhbGciOiJ...` or `/var/run/secrets/kubernetes.io/serviceaccount/token`

Use this token to authenticate requests to a Kubernetes API server.

Pomerium will [impersonate](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#user-impersonation) the Pomerium user's identity, and Kubernetes RBAC can be applied to IdP user and groups.
