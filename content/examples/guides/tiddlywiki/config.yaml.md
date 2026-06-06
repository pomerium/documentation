```yaml title="config.yaml"
# Pomerium Core configuration for TiddlyWiki. Uses the hosted authenticate service,
# so you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# Forward the authenticated user's email to TiddlyWiki in an unsigned request header.
# TiddlyWiki's listen command trusts this header as the logged-in username.
jwt_claims_headers:
  X-Pomerium-Claim-Email: email

routes:
  - from: https://tiddlywiki.yourdomain.com
    to: http://tiddlywiki:8080
    pass_identity_headers: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
