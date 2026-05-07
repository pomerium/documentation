```yaml title="docker-compose.yaml"
# WARNING: the COOKIE_SECRET, SHARED_SECRET, SIGNING_KEY, and DATABASE_ENCRYPTION_KEY
# values below are example-only. Generate fresh values before any non-trial use:
#   COOKIE_SECRET / SHARED_SECRET / DATABASE_ENCRYPTION_KEY: openssl rand -base64 32
#   SIGNING_KEY: a base64-encoded EC private key PEM. Generate with:
#     openssl ecparam -name prime256v1 -genkey -noout | base64 | tr -d '\n'
#   See https://www.pomerium.com/docs/reference/signing-key for details.
#   In this local quickstart, Core and Console must use the same SIGNING_KEY so
#   Console can verify Pomerium identity headers without fetching JWKS over the
#   self-signed trial certificate.
services:
  pomerium:
    image: pomerium/pomerium:v0.32.6
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 127.0.0.1:443:443
    # Keep local route hostnames resolvable inside the Compose network. Console
    # also receives SIGNING_KEY below so the signed-in UI does not depend on
    # JWKS over the self-signed trial certificate.
    networks:
      default:
        aliases:
          - console.localhost.pomerium.io
          - verify.localhost.pomerium.io
    environment:
      - AUTHENTICATE_SERVICE_URL=https://authenticate.pomerium.app
      - COOKIE_SECRET=j9jZgysWVxCs3uqbmw9a2LxWwz1ZPLKQZ8v20eoDT8Y=
      - SHARED_SECRET=mxGl062SqkrbQKvqG9R2jqHqxq1Oi1BNj2AAeZHNq7c=
      - DATABROKER_STORAGE_TYPE=postgres
      - DATABROKER_STORAGE_CONNECTION_STRING=postgresql://postgres:postgres@database/postgres?sslmode=disable
      - SIGNING_KEY=LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUc0R0N4bjlxaDBHRVZnV3VCM0VoRm51RlptZ2VkZXJsMEtLd0ZoRWo4Tk9vQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFMXFOWXNUMFpSZEVTS0djSXRqZFUxcGJZREVDTktRd2lNcmNHVFl6RUhLM1V5MnVoT1N3bgpXVGdWUHppTk4vcWozYXFJeSs3Sk55ZEFLVlo3bURPNGtnPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=
  pomerium_console:
    depends_on:
      database:
        condition: service_healthy
      pomerium:
        condition: service_started
    image: docker.cloudsmith.io/pomerium/enterprise/pomerium-console:v0.32.1
    command:
      - 'serve'
      - '--config'
      - '/pomerium/console-config.yaml'
    expose:
      - 8701
      - 9090
    environment:
      - AUDIENCE=console.localhost.pomerium.io
      - DATABASE_ENCRYPTION_KEY=tXBj4gGDj45m8cW7ehhcy5lRuxsEeNl0X/nnsN5YJPw=
      - DATABROKER_SERVICE_URL=http://pomerium:5443
      - SHARED_SECRET=mxGl062SqkrbQKvqG9R2jqHqxq1Oi1BNj2AAeZHNq7c=
      - DATABASE_URL=postgresql://postgres:postgres@database/postgres?sslmode=disable
      - SIGNING_KEY=LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUc0R0N4bjlxaDBHRVZnV3VCM0VoRm51RlptZ2VkZXJsMEtLd0ZoRWo4Tk9vQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFMXFOWXNUMFpSZEVTS0djSXRqZFUxcGJZREVDTktRd2lNcmNHVFl6RUhLM1V5MnVoT1N3bgpXVGdWUHppTk4vcWozYXFJeSs3Sk55ZEFLVlo3bURPNGtnPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=
      - METRICS_ADDR=:9092
      - PROMETHEUS_LISTEN_ADDR=:9090
      - PROMETHEUS_DATA_DIR=/data
    volumes:
      - metrics:/data:rw
      - ./console-config.yaml:/pomerium/console-config.yaml:ro
  database:
    image: postgres:17
    restart: always
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -d postgres -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 30s
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    expose:
      - 5432
    volumes:
      - pgdata:/var/lib/postgresql/data
  verify:
    image: pomerium/verify:sha-b4ecbab
    expose:
      - 8000
    restart: always
volumes:
  pgdata:
  metrics:
```
