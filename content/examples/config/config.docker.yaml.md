```yaml
# See detailed configuration settings: https://www.pomerium.com/docs/reference/

##################################################################################
# Identity provider settings : https://www.pomerium.com/docs/identity-providers/ #
# The keys required in this section vary depending on your IdP. See the          #
# appropriate docs for your IdP to configure Pomerium accordingly.               #
##################################################################################
idp_provider: google
idp_client_id: REPLACE_ME
idp_client_secret: REPLACE_ME

# https://pomerium.com/reference/#routes
routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
```
