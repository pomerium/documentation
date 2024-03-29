```yaml
# This file contains only policy and route configuration details. Other
# configuration settings required by pomerium are excluded for clarity.
# See: https://www.pomerium.com/docs/reference/

#
# For a complete self contained configuration see : config.example.yaml.
# Or, mix and match a policy file (this) with env vars : config.example.env

# Proxied routes and per-route policies are defined in a policy block
# NOTA BENE: You must uncomment the below 'policy' key if you are loading policy as a file.
# policy:
- from: https://verify.localhost.pomerium.io
  to: http://localhost:8000
  allowed_domains:
    - pomerium.io
  cors_allow_preflight: true
  timeout: 30s
- from: https://external-verify.localhost.pomerium.io
  to: https://verify.pomerium.com
  allowed_domains:
    - gmail.com
- from: https://weirdlyssl.localhost.pomerium.io
  to: http://neverssl.com
  allowed_users:
    - user@example.com
- from: https://hello.localhost.pomerium.io
  to: http://localhost:8080
  allowed_users:
    - user@example.com
```
