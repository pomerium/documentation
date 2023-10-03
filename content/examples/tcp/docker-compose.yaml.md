```yaml title="docker-compose.md"
version: "3"
services:
  pomerium:
    image: pomerium/pomerium:main
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443

  redis:
    image: redis:latest
    expose:
      - 6379

  ssh:
    image: linuxserver/openssh-server:latest
    expose:
      - 2222
    environment:
      PASSWORD_ACCESS: "true"
      USER_PASSWORD: supersecret
      USER_NAME: user

  pgsql:
    image: postgres
    restart: always
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=postgres
    expose:
      - 5432
```
