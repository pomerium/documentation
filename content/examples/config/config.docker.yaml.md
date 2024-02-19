```yaml title="config.yaml"
# Replace signing key
signing_key: <signing_key>

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                # Replace user@example.com with your email address
                is: user@example.com
    pass_identity_headers: true
```
