```yaml
version: "3"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      ## Mount your config file: https://www.pomerium.com/docs/reference/
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443

  ## https://verify.localhost.pomerium.io --> Pomerium --> http://verify
  verify:
    image: pomerium/verify:latest
    expose:
      - 8000
```
