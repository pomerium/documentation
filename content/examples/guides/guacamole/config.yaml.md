```yaml title="config.yaml"
# Pomerium Core configuration for Apache Guacamole. Uses the hosted authenticate
# service, so you don't run your own identity provider. To self-host the IdP, see
# the Keycloak guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# Forward the authenticated user's email as an unsigned X-Pomerium-Claim-Email
# header. Guacamole's header-auth extension reads this header to sign the user in.
jwt_claims_headers:
  X-Pomerium-Claim-Email: email

routes:
  - from: https://guacamole.yourdomain.com
    to: http://guacamole:8080
    pass_identity_headers: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
