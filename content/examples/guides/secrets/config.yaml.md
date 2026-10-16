```yaml title="config.yaml"
# Pomerium Core configuration. Uses the hosted authenticate service, so you
# don't run your own identity provider. To self-host the IdP, see the OIDC
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# Prometheus metrics, published to localhost only by the Compose file.
metrics_address: :9090

# The binding table names every credential Pomerium may inject, and says where
# each one comes from. Routes reference a binding by ID and never name a path,
# so this block is the only place a credential location is written down.
secrets:
  defaults:
    # Re-read every binding at least this often. Pomerium also watches the file,
    # so a rotation is usually visible in about a second.
    refresh: 1m
    # If re-reading fails, keep using the last good value for this long. After
    # that, requests that need the credential are rejected with 503.
    stale_grace: 5m
  bindings:
    upstream-api-token:
      url: 'file:///etc/pomerium/secrets/upstream-api-token'

routes:
  - from: https://api.yourdomain.com
    to: http://upstream:8080
    # Pomerium substitutes the current value of the binding on every request.
    # The credential itself is not part of this file.
    set_request_headers:
      Authorization: 'Bearer ${secret.upstream-api-token}'
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
