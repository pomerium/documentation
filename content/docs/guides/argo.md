---
title: Secure Argo Workflows with Pomerium
sidebar_label: Argo Workflows
lang: en-US
keywords:
  [pomerium, argo, argo workflows, kubernetes, sso, oidc, identity aware proxy]
description: Put Argo Workflows behind the Pomerium Ingress Controller on Kubernetes for single sign-on and per-route authorization.
---

# Secure Argo Workflows with Pomerium

## What this guide does

[Argo Workflows](https://argo-workflows.readthedocs.io/) is a container-native workflow engine for orchestrating parallel jobs on Kubernetes. Its web UI and API have no opinionated SSO of their own beyond delegating to an OIDC provider or the Kubernetes API. This guide puts Argo behind the [Pomerium Ingress Controller](/docs/deploy/k8s/ingress) so Pomerium handles single sign-on and authorization at the edge, and the Argo Server only ever sees requests from users your policy already allowed.

## When to use this guide

Use it when you run Argo Workflows on Kubernetes and want one front door that authenticates users against your existing identity provider and enforces who can reach the Argo UI and API. This is a good fit when you would rather not wire Argo's own SSO or hand out Kubernetes bearer tokens to every user. If you only need private network access to Argo without browser SSO, a plain [TCP route](/docs/capabilities/non-http) is simpler.

## Prerequisites

- A Kubernetes cluster and `kubectl` configured to reach it.
- [Helm](https://helm.sh/docs/intro/install/) v3.
- The [Pomerium Ingress Controller](/docs/deploy/k8s/install) installed in the cluster, with [global configuration](/docs/deploy/k8s/configure) applied so Pomerium can sign users in through your identity provider. If you are new to Pomerium on Kubernetes, start with the [Kubernetes Quickstart](/docs/deploy/k8s/quickstart).
- A domain you control for the Argo route (this guide uses `argo.yourdomain.com`) with DNS pointing at the `pomerium-proxy` load balancer.
- A way to issue TLS certificates for that host, such as [cert-manager](https://cert-manager.io/).

:::tip Prefer to self-host the identity provider?

Pomerium works with any OIDC provider. To run your own instead of a hosted identity provider (IdP), follow [Keycloak + Pomerium](/docs/integrations/user-identity/oidc) and set the matching `identityProvider` values in the Pomerium [global configuration](/docs/deploy/k8s/configure).

:::

## Install Argo Workflows

Install Argo with the official [Helm chart](https://github.com/argoproj/argo-helm/tree/main/charts/argo-workflows). Run the Argo Server in `server` auth mode so that Pomerium is the single gatekeeper and the Server authenticates to Kubernetes with its own service account instead of asking each user for a bearer token:

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
kubectl create namespace argo
helm install argo argo/argo-workflows \
  --namespace argo \
  --set server.authModes='{server}'
```

Setting `server.authModes={server}` runs the Argo Server with `--auth-mode=server`, so the later notes about that flag refer to this same setting.

The chart creates a `Service` named `argo-argo-workflows-server` (the pattern is `<release>-<chart>-server`) that listens on port `2746` over plain HTTP. Confirm it before wiring up the Ingress:

```bash
kubectl --namespace argo get svc argo-argo-workflows-server
```

You can sanity-check the UI by port-forwarding directly, but only do this from a trusted machine since `server` auth mode does not prompt for a login on its own:

```bash
kubectl --namespace argo port-forward svc/argo-argo-workflows-server 2746:2746
```

Then close the port-forward. From here on, all access goes through Pomerium.

## Configure the Pomerium route

Create an `Ingress` resource that the Pomerium Ingress Controller will turn into a route. It points `argo.yourdomain.com` at the Argo Server, restricts access with a Pomerium policy, and forwards identity headers so Argo's logs can attribute requests to a user:

```yaml title="argo-ingress.yaml"
# Routes argo.yourdomain.com through the Pomerium Ingress Controller to the
# Argo Workflows Server. Replace argo.yourdomain.com with a domain you control
# and you@example.com with the user(s) who should have access.
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argo
  namespace: argo
  annotations:
    # Forward the Pomerium identity headers (e.g. X-Pomerium-Claim-Email) to the
    # Argo Server so downstream logs and audit trails can attribute the user.
    ingress.pomerium.io/pass_identity_headers: 'true'
    # Only allow the listed user(s). Swap in a group or domain match as needed.
    ingress.pomerium.io/policy: |
      - allow:
          or:
            - email:
                is: you@example.com
spec:
  ingressClassName: pomerium
  rules:
    - host: argo.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                # Service created by the argo-workflows Helm chart with release
                # name "argo": <release>-<chart>-server. Run
                # `kubectl -n argo get svc` to confirm the name in your cluster.
                name: argo-argo-workflows-server
                port:
                  number: 2746
  tls:
    - hosts:
        - argo.yourdomain.com
      secretName: argo-yourdomain-com-tls
```

Replace `argo.yourdomain.com` with your domain and `you@example.com` with the user(s) who should have access. The `tls` block names the secret your certificate solution will populate; with cert-manager you would add a `cert-manager.io/cluster-issuer` annotation so the certificate is issued automatically. To allow a whole team, replace the `email` matcher with a `group` or `domain` claim; see [Policy](/docs/reference/routes/policy).

Validate it against your cluster's API, then apply it:

```bash
kubectl apply -f argo-ingress.yaml --dry-run=server
kubectl apply -f argo-ingress.yaml
```

The Pomerium Ingress Controller reconciles the resource and serves the route. You can watch it pick up the Ingress with `kubectl --namespace argo describe ingress argo`.

## Verify the setup

1. **The route requires authentication.** In a fresh browser, open `https://argo.yourdomain.com`. Pomerium should redirect you to sign in, not drop you straight into Argo.
2. **An allowed user gets in.** Sign in as the user your policy allows. Pomerium redirects you back and the Argo Workflows dashboard loads.
3. **A disallowed user is blocked.** Sign in as a user the policy does not list and confirm Pomerium returns a 403 instead of the Argo UI.

## Common failure modes

- **404 or no route from Pomerium.** The Ingress Controller did not adopt the resource. Confirm `spec.ingressClassName` is `pomerium` and check the controller logs with `kubectl --namespace pomerium logs deploy/pomerium`.
- **502 / upstream connection errors.** The backend service name or port is wrong. Run `kubectl --namespace argo get svc` and make sure the `backend.service.name` and `port.number` match the Argo Server service (`argo-argo-workflows-server:2746` by default).
- **Certificate warnings or a redirect loop.** DNS for `argo.yourdomain.com` is not pointing at the `pomerium-proxy` load balancer, or the `argo-yourdomain-com-tls` secret has not been issued yet. Verify the DNS record and that cert-manager (or your equivalent) populated the secret.
- **Argo UI loads without a login prompt when reached directly.** That is expected with `--auth-mode=server`: Argo itself does not authenticate, so it must only be reachable through Pomerium. See Security considerations.

## Security considerations

- **Do not expose the Argo Server directly.** With `--auth-mode=server`, the Argo UI and API trust whoever can reach them. Keep the `argo-argo-workflows-server` service as a `ClusterIP` (the chart default) so the only ingress path is through Pomerium, and avoid `LoadBalancer`/`NodePort` services or unscoped port-forwards in shared environments.
- **Scope the policy to the people who should run workflows.** The example allows a single email. Tighten it to the right group or domain, since anyone the policy allows can submit and manage workflows that run with the Argo Server's Kubernetes permissions.
- **Prefer `server` auth mode over `client` for this pattern.** `client` mode would require each user to present a Kubernetes bearer token, which defeats the point of fronting Argo with Pomerium. If you do need per-user Kubernetes RBAC, combine Pomerium with Argo SSO RBAC instead of header trust.

## Next steps

- [Pomerium Ingress configuration](/docs/deploy/k8s/ingress)
- [Build policies](/docs/reference/routes/policy)
- [Pass identity headers](/docs/reference/routes/pass-identity-headers-per-route)
