---
# cSpell:ignore containo
---
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: auth
spec:
  forwardAuth:
    address: https://pomerium-proxy.pomerium
    tls:
      insecureSkipVerify: true
    trustForwardHeader: true
```
