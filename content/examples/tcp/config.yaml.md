```yaml title="config.yaml"
authenticate_service_url: https://authenticate.pomerium.app

# Uncomment to use certificates (optional)
# certificates:
#   - cert: /pomerium/cert.pem
#     key: /pomerium/key.pem

databroker_storage_type: postgres
databroker_storage_connection_string: postgresql://postgres:postgres@pgsql:5432

routes:
  - from: tcp+https://redis.localhost.pomerium.io:6379
    to: tcp://redis:6379
    policy:
      - allow:
          or:
            - domain:
                is: example.com

  - from: tcp+https://ssh.localhost.pomerium.io:22
    to: tcp://ssh:2222
    policy:
      - allow:
          or:
            - domain:
                is: example.com

  - from: tcp+https://pgsql.localhost.pomerium.io:5432
    to: tcp://pgsql:5432
    policy:
      - allow:
          or:
            - domain:
                is: example.com
```
