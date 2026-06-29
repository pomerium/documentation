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
    restart: always

  hedgedoc:
    # Check https://hedgedoc.org/latest-release for the current stable release.
    image: quay.io/hedgedoc/hedgedoc@sha256:abdb6b08815d5bc5832b52d983d983ac678895e9fa0d76aaad80d08c5d70812b # 1.10.8
    environment:
      - CMD_DB_URL=postgres://hedgedoc:password@database:5432/hedgedoc
      - CMD_DOMAIN=hedgedoc.yourdomain.com
      - CMD_PROTOCOL_USESSL=true
      - CMD_URL_ADDPORT=false
      # Replace this with your own value: head -c32 /dev/urandom | base64
      - CMD_SESSION_SECRET=replace-with-a-random-session-secret
    volumes:
      - hedgedoc-uploads:/hedgedoc/public/uploads
    restart: always
    depends_on:
      - database

  database:
    image: postgres@sha256:16bc17c64a573ef34162af9298258d1aec548232985b33ed7b1eac33ba35c229 # 16-alpine
    environment:
      - POSTGRES_USER=hedgedoc
      # Change this before running anything beyond a local demo.
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=hedgedoc
    volumes:
      - hedgedoc-database:/var/lib/postgresql/data
    restart: always

volumes:
  pomerium-cache:
  hedgedoc-uploads:
  hedgedoc-database:
```
