```yaml title="config.yaml"
# Pomerium Core configuration for Open WebUI. Uses the hosted authenticate service,
# so you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# Emit the user's claims as X-Pomerium-Claim-* headers. pass_identity_headers alone
# only forwards the signed assertion; Open WebUI's trusted-header SSO needs these
# explicit claim headers.
jwt_claims_headers:
  X-Pomerium-Claim-Email: email

routes:
  - from: https://llm.yourdomain.com
    to: http://open-webui:8080
    # Forward the identity headers (including X-Pomerium-Claim-Email) to Open WebUI.
    pass_identity_headers: true
    # Open WebUI streams responses over WebSockets.
    allow_websockets: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
