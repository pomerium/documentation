```yaml title="docker-compose.yaml"
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
      - readers=reader@example.com
      - writers=writer@example.com
      - username=<reader/writer@example.com>
      - password=password
    depends_on:
      - tiddlywiki_init
```
