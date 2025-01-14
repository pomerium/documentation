```yaml
# networks
# create a network 'guacnetwork_compose' in mode 'bridged'
networks:
  guacnetwork_compose:
    driver: bridge
services:
  # guacd
  guacd:
    container_name: guacd_compose
    image: guacamole/guacd
    networks:
      - guacnetwork_compose
    restart: always
    volumes:
    - ./drive:/drive:rw
    - ./record:/record:rw

  # postgres
  postgres:
    container_name: postgres_guacamole_compose
    environment:
      PGDATA: /var/lib/postgresql/data/guacamole
      POSTGRES_DB: guacamole_db
      POSTGRES_PASSWORD: 'ChooseYourOwnPasswordHere1234'
      POSTGRES_USER: guacamole_user
    image: postgres:15.2-alpine
    networks:
      - guacnetwork_compose
    restart: always
    volumes:
    - ./init:/docker-entrypoint-initdb.d:z
    - ./data:/var/lib/postgresql/data:Z

  # guacamole
  guacamole:
    container_name: guacamole_compose
    depends_on:
    - guacd
    - postgres
    environment:
      GUACD_HOSTNAME: guacd
      POSTGRES_DATABASE: guacamole_db
      POSTGRES_HOSTNAME: postgres
      POSTGRES_PASSWORD: 'ChooseYourOwnPasswordHere1234'
      POSTGRES_USER: guacamole_user
      HEADER_ENABLED: true
      HTTP_AUTH_HEADER: X-Pomerium-Claim-Email
    image: guacamole/guacamole
    networks:
      - guacnetwork_compose
    volumes:
      - ./record:/record:rw
    ports:
    - 8080/tcp
    restart: always

  # pomerium
  pomerium:
    image: pomerium.com/pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
    networks:
      - guacnetwork_compose
    environment:
      JWT_CLAIMS_HEADERS: email
```