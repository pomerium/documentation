```yaml
# This file contains only route and policy configuration details. Other
# configuration settings required by Pomerium are excluded for clarity.
# See https://www.pomerium.com/docs/reference for the full configuration
# reference.

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://localhost:8000
    policy:
      - allow:
          or:
            - domain:
                is: pomerium.io
    cors_allow_preflight: true
    timeout: 30s
  - from: https://external-verify.localhost.pomerium.io
    to: https://verify.pomerium.com
    policy:
      - allow:
          or:
            - domain:
                is: gmail.com
  - from: https://weirdlyssl.localhost.pomerium.io
    to: http://neverssl.com
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
  - from: https://hello.localhost.pomerium.io
    to: http://localhost:8080
    policy:
      - allow:
          or:
            - claim/groups: "admins@pomerium.io"
```
