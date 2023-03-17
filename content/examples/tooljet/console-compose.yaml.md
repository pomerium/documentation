```yaml title=docker-compose.yaml
version: '3'
networks:
  main: {}
services:
  pomerium:
    image: pomerium/pomerium:v0.21.1
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
    networks:
      main:
        aliases:
          - authenticate.localhost.pomerium.io
    environment:
      - AUTHENTICATE_SERVICE_URL=https://authenticate.localhost.pomerium.io
      - COOKIE_SECRET=j9jZgysWVxCs3uqbmw9a2LxWwz1ZPLKQZ8v20eoDT8Y=
      - SHARED_SECRET=mxGl062SqkrbQKvqG9R2jqHqxq1Oi1BNj2AAeZHNq7c=
      - DATABROKER_STORAGE_TYPE=postgres
      - DATABROKER_STORAGE_CONNECTION_STRING=postgresql://postgres:postgres@database/postgres?sslmode=disable
  pomerium_console:
    networks:
      main:
    depends_on:
      database:
        condition: service_healthy
      pomerium:
        condition: service_started
    image: docker.cloudsmith.io/pomerium/enterprise/pomerium-console:v0.21.0
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
    volumes:
      - metrics:/data:rw
      - ./console-config.yaml:/pomerium/console-config.yaml:ro
  database:
    networks:
      main: {}
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
    networks:
      main: {}
    image: pomerium/verify:latest
    expose:
      - 8000
    restart: always
  tooljet:
    networks:
      main: {}
    tty: true
    stdin_open: true
    image: tooljet/tooljet-ce:latest
    restart: always
    env_file: .env
    ports:
      - 80:80
      - 8082:8082
    depends_on:
      - postgres
    environment:
      SERVE_CLIENT: "true"
      PORT: "80"
    command: npm run start:prod

  postgres:
    networks:
      main: {}
    image: postgres:13
    restart: always
    ports:
      - 5433:5432
    volumes:
      - postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
volumes:
  pgdata:
  metrics:
  postgres:
    driver: local
    driver_opts:
      o: bind
      type: none
      device: ${PWD}/postgres_data
  certs:
  logs:
  fallbackcerts:
```