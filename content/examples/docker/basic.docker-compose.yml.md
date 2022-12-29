```yaml
version: "3"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      #################################################################################
      # Certificate settings: https://www.pomerium.com/docs/reference/certificates    #
      # You do not need to mount your certificate files. We auto-generate certificate #
      # files in your config.yaml file that will mount on your Docker container.      #
      #################################################################################
      # - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      # - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/private-key.pem:ro

      ## Mount your config file : https://www.pomerium.com/docs/reference/
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443

  ## https://verify.localhost.pomerium.io --> Pomerium --> http://verify
  verify:
    image: pomerium/verify:latest
    expose:
      - 8000
```
