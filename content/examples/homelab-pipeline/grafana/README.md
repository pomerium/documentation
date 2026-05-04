# Pomerium Cluster Control Room

This bundle turns Grafana into the first operator surface behind Pomerium.

It is derived from the live homelab's `pomerium-consolidated` and
`homelab-ops-control` dashboards, but trimmed down to one landing page that
answers the first questions that matter:

- are requests flowing
- are authorization decisions succeeding
- are routes failing
- are the Pomerium pods healthy
- is GitOps drifting or degrading

Files:

- `pomerium-cluster-control-room.json` is the canonical dashboard JSON
- `dashboard-configmap.yaml` provisions that dashboard in Kubernetes the same
  way the live lab does

## Assumptions

- Grafana uses a Prometheus data source with UID `prometheus`
- Grafana mounts dashboards at `/var/lib/grafana/dashboards`
- Grafana is already configured to trust Pomerium as an auth proxy
- Grafana is not reachable except through Pomerium

If your Prometheus data source uses a different UID, replace `"uid": "prometheus"` in the dashboard JSON before importing it, or set your provisioned data source UID to match.

If the auth proxy panel stays empty in your cluster, check the Envoy ext_authz metric names. Some installations expose those counters with an HTTP connection manager stat prefix, so you may need to adapt the `envoy_http_*_ext_authz_*` selectors to match your Prometheus labels.

If you use the kube-prometheus-stack sidecar dashboard loader instead of a direct volume mount, keep the `grafana_dashboard: "1"` label on the ConfigMap and point Grafana at the sidecar-managed dashboard folder instead of `/var/lib/grafana/dashboards`.

To make this the landing page, set:

```yaml
env:
  - name: GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH
    value: /var/lib/grafana/dashboards/pomerium-cluster-control-room.json
```

If you are using Grafana auth proxy mode, also lock it down:

```yaml
env:
  - name: GF_AUTH_PROXY_WHITELIST
    value: YOUR_CLUSTER_INTERNAL_CIDR
  - name: GF_USERS_AUTO_ASSIGN_ORG_ROLE
    value: Viewer
```

Set `YOUR_CLUSTER_INTERNAL_CIDR` to the pod CIDR or other internal source network that can actually reach Grafana from the Pomerium side in your cluster. The live lab currently uses `10.244.0.0/16`, but that is not portable.

Treat this dashboard as code. File-provisioned dashboards overwrite ad hoc UI
edits.

## Validation

Representative PromQL queries in this dashboard were executed successfully
against the live homelab's Prometheus API on April 3, 2026. Confirmed metric
families included `pomerium_http_*`, `pomerium_authorize_*`, `envoy_*`,
`kube_*`, and `argocd_app_*`.

Local file checks:

```bash
python3 -m json.tool pomerium-cluster-control-room.json >/dev/null
kubectl apply --dry-run=client -f dashboard-configmap.yaml
```
