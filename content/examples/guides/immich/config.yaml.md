```yaml title="config.yaml"
# Pomerium Core configuration for Immich. Uses the hosted authenticate service, so
# you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

routes:
  - from: https://immich.yourdomain.com
    to: http://immich-server:2283
    # Photo and video uploads (and original-quality downloads) can be large and
    # long-running, so don't cap total request time at the proxy.
    timeout: 0s
    idle_timeout: 600s
    policy:
      - allow:
          or:
            - email:
                # Replace with the users or domain you want to allow
                is: you@example.com
```
