```yaml title="config.yaml"
authenticate_service_url: https://authenticate.pomerium.app

jwt_claims_headers:
  X-Pomerium-Sub: sub
  X-Pomerium-Claim-Email: email
  X-Pomerium-Claim-Name: name

routes:
  - from: https://forgejo.localhost.pomerium.io
    to: http://forgejo:3000
    pass_identity_headers: true
    # Git transfers can be large and long-running; don't cap total request time.
    timeout: 0s
    idle_timeout: 600s
    policy:
      - allow:
          and:
            - email:
                # Replace with the users or domain you want to allow
                is: user@example.com
```
