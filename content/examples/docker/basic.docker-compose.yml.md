```yaml title="docker-compose.yaml"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
    ## Mount your domain's certificates
      - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/privkey.pem:ro

      ## Mount your config file
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
  ## https://verify.localhost.pomerium.io --> Pomerium --> http://verify
  verify:
    image: pomerium/verify:latest
    environment:
      - JWKS_ENDPOINT=https://pomerium/.well-known/pomerium/jwks.json
```