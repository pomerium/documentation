```yaml
authenticate:
  idp:
    provider: REPLACE_ME
    url: REPLACE_ME
    clientID: REPLACE_ME
    clientSecret: REPLACE_ME

config:
  rootDomain: localhost.pomerium.io
  sharedSecret: R0+XRoGVpcoi4PfB8tMlvnrS5XUasO+D1frAEdYcYjs=
  cookieSecret: FLPCOQKigK5EQnyXlBhchl5fgzNKqi3ubtvOGt477Dg=
  generateTLS: true
  routes:
    - from: https://hello.localhost.pomerium.io
      to: http://hello-nginx
      policy:
        - allow:
            or:
              - domain:
                  is: gmail.com
ingress:
  annotations:
    traefik.ingress.kubernetes.io/router.tls: "true"
  secretName: wildcard-tls
forwardAuth:
  enabled: true
  internal: true
```
