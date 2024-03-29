```yaml
authenticate:
  ingress:
    tls:
      secretName: pomerium-tls
  existingTLSSecret: pomerium-tls
  idp:
    provider: "google"
    clientID: YOUR_CLIENT_ID
    clientSecret: YOUR_SECRET
  proxied: false

proxy:
  existingTLSSecret: pomerium-tls

databroker:
  existingTLSSecret: pomerium-tls
  storage:
    connectionString: postgres://://postgres.pomerium.svc.cluster.local #Replace with the path to your DB solution.
    type: postgres
    clientTLS:
      existingSecretName: pomerium-tls
      existingCASecretKey: ca.crt

authorize:
  existingTLSSecret: pomerium-tls

ingressController:
  enabled: true

ingress:
  enabled: false

config:
  rootDomain: localhost.pomerium.io
  existingCASecret: pomerium-tls
  generateTLS: false # On by default, disabled when cert-manager or another solution is in place.
# The policy block isn't required when using the Pomerium Ingress Controller, as routes are defined
# by the addition of Ingress Resources.
#  routes:
#      # This will be our testing app, to confirm that Pomerium is authenticating and routing traffic.
#    - from: https://authenticate.localhost.pomerium.io
#      to: https://pomerium-authenticate.pomerium.svc.cluster.local
#      preserve_host_header: true
#      allow_public_unauthenticated_access: true
#      policy:
```
