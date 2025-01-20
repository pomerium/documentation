```yaml
# See detailed configuration settings: https://www.pomerium.com/docs/reference/

#####################################################################
# If self-hosting, use the localhost authenticate service URL below #
# and remove the hosted URL.                                        #
#####################################################################
# authenticate_service_url: https://authenticate.localhost.pomerium.io

authenticate_service_url: https://authenticate.pomerium.app

####################################################################################
# If self-hosting, you must configure an identity provider.                        #
# See identity provider settings: https://www.pomerium.com/docs/integrations/#
####################################################################################

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
