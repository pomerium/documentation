---
# cSpell:ignore middlewares kubernetescrd
---
```yaml
ingress:
  enabled: true
  hosts:
    - name: hello.localhost.pomerium.io
      path: /

  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: pomerium-auth@kubernetescrd
    traefik.ingress.kubernetes.io/router.tls: "true"
  tls:
    - hosts:
        - hello.localhost.pomerium.io
      secretName: wildcard-tls
service:
  type: ClusterIP
```
