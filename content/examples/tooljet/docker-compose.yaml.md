```yaml title="docker-compose.yaml"
networks:
  main: {}
services:
  pomerium:
    image: cr.pomerium.com/pomerium/pomerium:latest
    volumes:
      ## Mount your config file: https://www.pomerium.com/docs/reference/
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
    ## A network alias is only required when using `localhost.pomerium.io`
    networks:
      main:
        aliases:
        - authenticate.localhost.pomerium.io
  ## https://verify.localhost.pomerium.io --> Pomerium --> http://verify
  verify:
    networks:
      main: {}
    image: cr.pomerium.com/pomerium/verify:latest
    expose:
      - 8000
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
      - 5432:5432
    volumes:
      - postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
volumes:
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
