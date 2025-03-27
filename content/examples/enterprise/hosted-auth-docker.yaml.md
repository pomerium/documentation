```yaml title="docker-compose.yaml"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
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
    image: docker.cloudsmith.io/pomerium/enterprise/pomerium-console:v0.27.2
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
      - PROMETHEUS_LISTEN_ADDR=:9090
      - PROMETHEUS_DATA_DIR=/data
      - SIGNING_KEY=LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUc0R0N4bjlxaDBHRVZnV3VCM0VoRm51RlptZ2VkZXJsMEtLd0ZoRWo4Tk9vQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFMXFOWXNUMFpSZEVTS0djSXRqZFUxcGJZREVDTktRd2lNcmNHVFl6RUhLM1V5MnVoT1N3bgpXVGdWUHppTk4vcWozYXFJeSs3Sk55ZEFLVlo3bURPNGtnPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=
    volumes:
      - metrics:/data:rw
      - ./console-config.yaml:/pomerium/console-config.yaml:ro
  database:
    image: postgres:latest
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
    image: pomerium/verify:latest
    expose:
      - 8000
    restart: always
volumes:
  pgdata:
  metrics:
```
