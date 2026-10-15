```yaml title="config.yaml"
# Pomerium Core configuration for Paperless-ngx. Uses the hosted authenticate
# service, so you don't run your own identity provider. To self-host the IdP, see
# the Keycloak guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

routes:
  - from: https://paperless.yourdomain.com
    to: http://paperless:8000
    # Paperless-ngx is a Django app: it validates the Host header against
    # ALLOWED_HOSTS (derived from PAPERLESS_URL) and uses it for CSRF checks, so
    # forward the original Host unchanged or it answers HTTP 400.
    preserve_host_header: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
