```yaml
version: "3"
networks:
  main: {}
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      ## Mount your config file: https://www.pomerium.com/docs/reference/
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
    networks:
      main:
        aliases:
        - authenticate.localhost.pomerium.io
  ## https://verify.localhost.pomerium.io --> Pomerium --> http://verify
  verify:
    networks:
      main: {}
    image: pomerium/verify:latest
    expose:
      - 8000
```
