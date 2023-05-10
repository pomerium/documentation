```yaml title=pomerium.yaml
apiVersion: ingress.pomerium.io/v1
kind: Pomerium
metadata:
  name: global
spec:
  secrets: pomerium/bootstrap
  authenticate:
      url: https://authenticate.pomerium.app
  certificates:
      - pomerium/pomerium-wildcard-tls
  ```
