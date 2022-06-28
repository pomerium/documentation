```yaml title=pomerium.yaml
apiVersion: ingress.pomerium.io/v1
kind: Pomerium
metadata:
name: global
spec:
secrets: pomerium/bootstrap
authenticate:
    url: https://authenticate.localhost.pomerium.io
identityProvider:
    provider: ${YOUR_IdP}
    secret: pomerium/idp
certificates:
    - pomerium/pomerium-wildcard-tls
```