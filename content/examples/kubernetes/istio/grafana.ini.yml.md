```yaml title="grafana.ini.yaml"
grafana.ini:
  auth:
    disable_login_form: true
  auth.jwt:
    enabled: true
    header_name: X-Pomerium-Jwt-Assertion
    email_claim: email
    jwk_set_url: https://grafana.localhost.pomerium.io/.well-known/pomerium/jwks.json
```
