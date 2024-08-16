```yaml
authenticate_service_url: https://authenticate.pomerium.app

jwt_claim_headers: email

routes:
    pass_identity_headers: true
  - from: https://guacamole.localhost.pomerium.io
    to: http://guacamole:8080
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```