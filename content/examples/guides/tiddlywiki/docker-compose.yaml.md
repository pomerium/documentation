```yaml title="docker-compose.yaml"
services:
  pomerium:
    image: pomerium/pomerium@sha256:e10d1d267af24f581157f485d9b0bc08469e2428675b696a08e42ceb09b2279c # v0.32.7
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
      - pomerium-cache:/data
    ports:
      - 443:443
      - 80:80
    networks:
      default: {}
      tiddlywiki-internal: {}
    restart: always

  # One-shot: create the wiki folder with the Node.js server edition if it doesn't
  # already exist, then exit. The guard keeps repeated `docker compose up` runs working.
  tiddlywiki-init:
    image: elasticdog/tiddlywiki@sha256:6fdb8c46c92680c48be5eca5d35cf477b111285481e2ce1717c7dfa131476b17 # v5.1.23
    entrypoint: ['/bin/sh', '-c']
    command:
      - 'test -f /tiddlywiki/mywiki/tiddlywiki.info || tiddlywiki mywiki --init server'
    volumes:
      - tiddlywiki-data:/tiddlywiki
    networks:
      tiddlywiki-internal: {}

  tiddlywiki:
    image: elasticdog/tiddlywiki@sha256:6fdb8c46c92680c48be5eca5d35cf477b111285481e2ce1717c7dfa131476b17 # v5.1.23
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
    # Internal-only network with no published ports: TiddlyWiki trusts the identity
    # header, so the only thing allowed to reach it is Pomerium.
    networks:
      tiddlywiki-internal: {}
    restart: always

networks:
  tiddlywiki-internal:
    internal: true

volumes:
  pomerium-cache:
  tiddlywiki-data:
```
