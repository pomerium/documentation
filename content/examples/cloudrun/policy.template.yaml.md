```yaml title="policy.template.yaml"
- from: https://hello.cloudrun.pomerium.io
  to: ${HELLO_URL}
  allowed_domains:
    - gmail.com
  enable_google_cloud_serverless_authentication: true
- from: https://verify.cloudrun.pomerium.io
  to: https://verify.pomerium.com
  pass_identity_headers: true
  allowed_domains:
    - gmail.com
```
