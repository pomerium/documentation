```yaml title=config.yaml
authenticate_service_url: https://authenticate.localhost.pomerium.io


idp_provider: github
idp_client_id: REPLACE_ME
idp_client_secret: REPLACE_ME

# Update the signing key: https://www.pomerium.com/docs/reference/signing-key
signing_key: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSURRemVZWDZyT2tuemFnTjRJVTYxaEtRc3pzY1EvRllmbzZPcXhWd2YvdGZvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFc1V0V2psYXZ3eHprSU9DVUNDeFVnTDJza2NjL3QxSTFmQXlxUDgrMWw5YU1CWDlzdm1pYgpRajJxcWFUbUJZZWhuQzhmak5LODZmVXhpc3d1SXN5bnp3PT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
    pass_identity_headers: true
  - from: https://tooljet.localhost.pomerium.io
    to: http://tooljet:80
    host_rewrite_header: true
    policy:
      - allow:
          or:
            - email:
                is: user@example.com

```