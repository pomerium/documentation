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

  # One-shot: create the wiki folder with the Node.js server edition if it doesn't
  # already exist, then exit. The guard keeps repeated `docker compose up` runs working.
  tiddlywiki-init:
    image: elasticdog/tiddlywiki:latest
    entrypoint: ['/bin/sh', '-c']
    command:
      - 'test -f /tiddlywiki/mywiki/tiddlywiki.info || tiddlywiki mywiki --init server'
    volumes:
      - tiddlywiki-data:/tiddlywiki

  tiddlywiki:
    image: elasticdog/tiddlywiki:latest
    volumes:
      - tiddlywiki-data:/tiddlywiki
    # authenticated-user-header tells TiddlyWiki to trust the email Pomerium
    # forwards as the logged-in user. It must match the jwt_claims_headers name.
    command:
      - mywiki
      - --listen
      - host=0.0.0.0
      - authenticated-user-header=x-pomerium-claim-email
    depends_on:
      tiddlywiki-init:
        condition: service_completed_successfully
    restart: always

volumes:
  pomerium-cache:
  tiddlywiki-data:
```
