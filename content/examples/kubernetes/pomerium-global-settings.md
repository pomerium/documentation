```yaml title="pomerium.yaml"
apiVersion: ingress.pomerium.io/v1
kind: Pomerium
metadata:
  name: global
spec:
  secrets: pomerium/bootstrap
  identityProvider:
    provider: hosted
  certificates:
      - pomerium/pomerium-wildcard-tls
```
