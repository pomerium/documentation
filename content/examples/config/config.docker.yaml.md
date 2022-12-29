```yaml
# See detailed configuration settings : https://www.pomerium.com/docs/reference/


# this is the domain the identity provider will callback after a user authenticates
authenticate_service_url: https://authenticate.localhost.pomerium.io

####################################################################################
# Certificate settings: https://www.pomerium.com/docs/reference/certificates       #
# You do not need to generate your own certificates. We auto-generate and populate #
# the certificate variables below with an X.509 public and private key.            #
####################################################################################
# certificate_file: /pomerium/cert.pem
# certificate_key_file: /pomerium/private-key.pem

##################################################################################
# Identity provider settings : https://www.pomerium.com/docs/identity-providers/ #
# The keys required in this section vary depending on your IdP. See the          #
# appropriate docs for your IdP to configure Pomerium accordingly.               #
##################################################################################
idp_provider: google
idp_client_id: REPLACE_ME
idp_client_secret: REPLACE_ME

##################################################################################
# Cookie secret settings: https://www.pomerium.com/docs/reference/cookie-secret  #
# You do not need to generate a cookie secret. We auto-generate and populate the #
# cookie secret for you below to encrypt and sign session cookies.               #
##################################################################################
# cookie_secret: V2JBZk0zWGtsL29UcFUvWjVDWWQ2UHExNXJ0b2VhcDI=

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
