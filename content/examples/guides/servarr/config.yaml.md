```yaml title="config.yaml"
# Pomerium Core configuration for a Servarr media-automation suite. Uses the hosted
# authenticate service, so you don't run your own identity provider. To self-host the
# IdP, see the Keycloak guide:
# https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

# One route per app. Each app keeps its own API key, so these are front-door gates,
# not header-trust integrations.
routes:
  - from: https://sonarr.yourdomain.com
    to: http://sonarr:8989
    policy:
      - allow:
          or:
            - email:
                is: you@example.com

  - from: https://radarr.yourdomain.com
    to: http://radarr:7878
    policy:
      - allow:
          or:
            - email:
                is: you@example.com

  - from: https://prowlarr.yourdomain.com
    to: http://prowlarr:9696
    policy:
      - allow:
          or:
            - email:
                is: you@example.com

  - from: https://sabnzbd.yourdomain.com
    to: http://sabnzbd:8080
    # SABnzbd validates the Host header against its host_whitelist, so forward the
    # original host unchanged and add sabnzbd.yourdomain.com to that whitelist.
    preserve_host_header: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
