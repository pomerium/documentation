```yaml
# The domain the identity provider will callback after a user authenticates
# It's hardcoded to point to 127.0.0.1
authenticate_service_url: https://authenticate.localhost.pomerium.io


##################################################################################
# Identity provider settings : https://www.pomerium.com/docs/identity-providers/ #
# The keys required in this section vary depending on your IdP. See the          #
# appropriate docs for your IdP to configure Pomerium accordingly.               #
##################################################################################

idp_provider: 'auth0'
idp_client_id: REPLACE_ME
idp_client_secret: REPLACE_ME
# idp_service_account: REPLACE_ME # Required by some identity providers for directory sync
# idp_provider_url: https://your-idp-provider-url.com # Required by some identity providers for directory sync

# https://pomerium.com/reference/routes
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