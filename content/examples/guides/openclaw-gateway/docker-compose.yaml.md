```yaml title="docker-compose.yaml"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
      - pomerium-cache:/data
    ports:
      - 443:443
      - 80:80
    restart: always

  openclaw-gateway:
    # OpenClaw publishes no official image, so build one that installs the
    # openclaw npm package and runs its gateway. See the guide's Configure
    # OpenClaw section for the Dockerfile and SSH setup.
    build:
      context: ./openclaw
      args:
        OPENCLAW_VERSION: latest
    environment:
      # Origin Pomerium serves the gateway on; OpenClaw checks it on connect.
      - POMERIUM_CLUSTER_DOMAIN=yourdomain.com
    volumes:
      - ./openclaw-data/config:/claw/.openclaw
      - ./openclaw-data/workspace:/claw/workspace
      - ./openclaw-data/pomerium-ssh:/var/lib/pomerium
    restart: always

volumes:
  pomerium-cache:
```
