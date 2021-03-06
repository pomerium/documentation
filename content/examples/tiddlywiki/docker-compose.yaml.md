```yaml title="docker-compose.yaml"
version: "3"

services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      # Use a volume to store ACME certificates
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443

  tiddlywiki_init:
    image: elasticdog/tiddlywiki:latest
    volumes:
      - ./wiki:/tiddlywiki
    command: ['mywiki', '--init', 'server']

  tiddlywiki:
    image: elasticdog/tiddlywiki:latest
    ports:
      - 8080:8080
    volumes:
      - ./wiki:/tiddlywiki
    command:
      - mywiki
      - --listen
      - host=0.0.0.0
      - authenticated-user-header=x-pomerium-claim-email
      - readers=reader1@example.com
      - writers=writer1@example.com
    depends_on:
      - tiddlywiki_init
```
