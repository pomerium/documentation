```yaml title="docker-compose.yaml"
services:
  # The guacd daemon renders remote desktop protocols (VNC, RDP, SSH) for the web app.
  guacd:
    image: guacamole/guacd:latest
    restart: always

  # PostgreSQL stores Guacamole's users, connections, and history. The schema is
  # loaded once from ./init on first boot; generate it with:
  #   docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --postgresql > init/initdb.sql
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: guacamole_db
      POSTGRES_USER: guacamole_user
      POSTGRES_PASSWORD: ChooseYourOwnPasswordHere1234
    volumes:
      - ./init:/docker-entrypoint-initdb.d:ro
      - guacamole-data:/var/lib/postgresql/data
    restart: always

  # The Guacamole web application. HEADER_ENABLED turns on header authentication and
  # HTTP_AUTH_HEADER tells it which header carries the already-authenticated user.
  # Pinned to 1.6: the 1.6 image expects POSTGRESQL_* env names (older POSTGRES_*
  # names are deprecated).
  guacamole:
    image: guacamole/guacamole:1.6.0
    depends_on:
      - guacd
      - postgres
    environment:
      GUACD_HOSTNAME: guacd
      POSTGRESQL_HOSTNAME: postgres
      POSTGRESQL_DATABASE: guacamole_db
      POSTGRESQL_USERNAME: guacamole_user
      POSTGRESQL_PASSWORD: ChooseYourOwnPasswordHere1234
      HEADER_ENABLED: 'true'
      HTTP_AUTH_HEADER: X-Pomerium-Claim-Email
      # Serve the app at / so the route host maps straight to it (no /guacamole prefix).
      WEBAPP_CONTEXT: ROOT
    restart: always

  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
      - pomerium-cache:/data
    ports:
      - 443:443
      - 80:80
    restart: always

volumes:
  guacamole-data:
  pomerium-cache:
```
