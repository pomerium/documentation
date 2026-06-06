```yaml title="config.yaml"
# Pomerium Core configuration for Grafana. Uses the hosted authenticate service, so
# you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# Signs the identity assertion Pomerium forwards to Grafana, and is published at the
# route's /.well-known/pomerium/jwks.json for Grafana to verify against. Generate
# your own and keep it secret:
#   openssl ecparam -genkey -name prime256v1 -noout | base64
signing_key: REPLACE_WITH_BASE64_ENCODED_EC_P256_PRIVATE_KEY

routes:
  - from: https://grafana.yourdomain.com
    to: http://grafana:3000
    pass_identity_headers: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
