```yaml title="policy.template.yaml"
- from: https://hello.cloudrun.pomerium.io
  to: ${HELLO_URL}
  enable_google_cloud_serverless_authentication: true
  policy:
    - allow:
        or:
          - domain:
              is: gmail.com
- from: https://verify.cloudrun.pomerium.io
  to: https://verify.pomerium.com
  pass_identity_headers: true
  policy:
    - allow:
        or:
          - domain:
              is: gmail.com
```
