```yaml
# See detailed configuration settings: https://www.pomerium.com/docs/reference/

authenticate_service_url: https://authenticate.pomerium.app

# Update the signing key: https://www.pomerium.com/docs/reference/signing-key
signing_key: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSURRemVZWDZyT2tuemFnTjRJVTYxaEtRc3pzY1EvRllmbzZPcXhWd2YvdGZvQY9HQ0NxR1NNNDkKQXdFSG9VUURRE0FFc1V0V2psYXZ3eHprSU9DVUNDeFVnTDJza2NjL3QxSTFmQXlxUDgrMWw5YU1CWDlzdm1pYgpRajJxcWFUbUJZZWhuQzhmak5LODZmVXhpc3d1SXN5bnp3PT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=

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
