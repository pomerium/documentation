```yaml
# The domain the identity provider will callback after a user authenticates
authenticate_service_url: https://authenticate.pomerium.app

# https://pomerium.com/reference/routes
routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```
