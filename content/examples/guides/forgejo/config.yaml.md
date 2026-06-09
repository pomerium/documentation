```yaml title="config.yaml"
# Pomerium Core configuration for Forgejo. Uses the hosted authenticate service, so
# you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# Forward the user's identity claims to Forgejo as request headers. Forgejo
# usernames cannot contain every character that is valid in an email address, so
# this uses the stable OIDC sub claim for the username and carries the real
# address in X-Pomerium-Claim-Email.
jwt_claims_headers:
  X-Pomerium-Sub: sub
  X-Pomerium-Claim-Email: email
  X-Pomerium-Claim-Name: name

routes:
  - from: https://forgejo.yourdomain.com
    to: http://forgejo:3000
    pass_identity_headers: true
    # Git transfers can be large and long-running; don't cap total request time.
    timeout: 0s
    idle_timeout: 600s
    policy:
      - allow:
          or:
            - email:
                # Replace with the users or domain you want to allow
                is: you@example.com
```
