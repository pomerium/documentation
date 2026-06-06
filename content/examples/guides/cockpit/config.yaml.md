```yaml title="config.yaml"
# Pomerium Core configuration for Cockpit. Uses the hosted authenticate service, so
# you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

routes:
  - from: https://cockpit.yourdomain.com
    to: http://cockpit:9090
    # Cockpit upgrades to a WebSocket once you log in, so the route must allow it.
    allow_websockets: true
    # Cockpit checks the Host header against its configured Origins, so forward the
    # original host instead of rewriting it to the upstream address.
    preserve_host_header: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
