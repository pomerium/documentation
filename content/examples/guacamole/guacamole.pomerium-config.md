```yaml
authenticate_service_url: https://authenticate.pomerium.app

jwt_claims_headers: email

routes:
  - from: https://guacamole.localhost.pomerium.io
    to: http://guacamole:8080
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```