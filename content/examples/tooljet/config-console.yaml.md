```yaml title=config.yaml
idp_provider: REPLACE_ME
idp_provider_url: REPLACE_ME
idp_client_id: REPLACE_ME
idp_client_secret: REPLACE_ME

signing_key: REPLACE_ME

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    pass_identity_headers: true
    policy:
      - allows:
           or:
            - email:
                 is: user@example.com
  - from: https://console.localhost.pomerium.io
    to: http://pomerium_console:8701
    pass_identity_headers: true
    policy:
      - allows:
           or:
            - email:
                 is: user@example.com
```