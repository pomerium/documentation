```yaml
# See detailed configuration settings : https://www.pomerium.com/docs/reference/

# this is the domain the identity provider will callback after a user authenticates
authenticate_service_url: https://authenticate.localhost.pomerium.io

# certificate settings:  https://www.pomerium.com/docs/reference/certificates.html
autocert: true
# REMOVE FOR PRODUCTION
autocert_use_staging: true

# If you're using mkcert to test Pomerium locally, comment the autocert keys and uncomment
# the keys below, adjusting for your mkcert path:
# certificate_file: /home/user/.local/share/mkcert/rootCA.pem
# certificate_key_file: /user/alex/.local/share/mkcert/rootCA-key.pem

# identity provider settings : https://www.pomerium.com/docs/integrations/user-identity/identity-providers.html
idp_provider: google
idp_client_id: REPLACE_ME
idp_client_secret: REPLACE_ME

# Generate 256 bit random keys  e.g. `head -c32 /dev/urandom | base64`
cookie_secret: WwMtDXWaRDMBQCylle8OJ+w4kLIDIGd8W3cB4/zFFtg=

# https://pomerium.io/reference/#routes
routes:
  - from: https://verify.localhost.pomerium.io
    to: https://verify.pomerium.com
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```
