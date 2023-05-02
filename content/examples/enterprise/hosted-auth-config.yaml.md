```yaml title="config.yaml"
routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
  - from: https://console.localhost.pomerium.io
    to: http://pomerium_console:8701
    allowed_users:
      - user@example.com
    pass_identity_headers: true
```