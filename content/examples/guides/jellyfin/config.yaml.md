```yaml title="config.yaml"
# Pomerium Core configuration for Jellyfin. Uses the hosted authenticate service, so
# you don't run your own identity provider. To self-host the IdP, see the Keycloak
# guide: https://www.pomerium.com/docs/integrations/user-identity/oidc
authenticate_service_url: https://authenticate.pomerium.app

# Obtain TLS certificates automatically from Let's Encrypt.
autocert: true

routes:
  - from: https://jellyfin.yourdomain.com
    to: http://jellyfin:8096
    # The Jellyfin web client streams events over WebSockets; without this the UI
    # loads but playback state and remote control never update.
    allow_websockets: true
    # Forward the original Host so Jellyfin's absolute URLs (web client, casting)
    # match the public name instead of the container name.
    preserve_host_header: true
    policy:
      - allow:
          or:
            - email:
                is: you@example.com
```
