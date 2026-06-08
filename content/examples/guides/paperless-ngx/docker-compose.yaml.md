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
    # Pomerium is the only service on both networks: the default network for public
    # traffic, and the internal-only network to reach Paperless. This bridge is the
    # single path in, so the policy can't be bypassed.
    networks:
      default: {}
      paperless-internal: {}
    restart: always

  paperless:
    image: ghcr.io/paperless-ngx/paperless-ngx@sha256:3421ebe06ed27662d014046cf5089e612de853aae0c676a2bc72f73b38080e57 # 2.18.4
    depends_on:
      - db
      - redis
    environment:
      PAPERLESS_REDIS: redis://redis:6379
      PAPERLESS_DBHOST: db
      PAPERLESS_DBUSER: paperless
      PAPERLESS_DBPASS: change-this-database-password
      PAPERLESS_DBNAME: paperless
      # Generate your own: openssl rand -base64 48
      PAPERLESS_SECRET_KEY: change-this-to-a-long-random-string
      # Must equal the public route host below, or Django answers HTTP 400 behind
      # the proxy (ALLOWED_HOSTS / CSRF_TRUSTED_ORIGINS are derived from this).
      PAPERLESS_URL: https://paperless.yourdomain.com
      # Bootstraps the first superuser on initial startup only.
      PAPERLESS_ADMIN_USER: admin
      PAPERLESS_ADMIN_PASSWORD: change-this-admin-password
    volumes:
      - paperless-data:/usr/src/paperless/data
      - paperless-media:/usr/src/paperless/media
    networks:
      - paperless-internal
    restart: always

  db:
    image: postgres@sha256:16bc17c64a573ef34162af9298258d1aec548232985b33ed7b1eac33ba35c229 # 16-alpine
    environment:
      POSTGRES_DB: paperless
      POSTGRES_USER: paperless
      POSTGRES_PASSWORD: change-this-database-password
    volumes:
      - paperless-db:/var/lib/postgresql/data
    networks:
      - paperless-internal
    restart: always

  redis:
    image: redis@sha256:6ab0b6e7381779332f97b8ca76193e45b0756f38d4c0dcda72dbb3c32061ab99 # 7-alpine
    volumes:
      - paperless-redis:/data
    networks:
      - paperless-internal
    restart: always

networks:
  # Internal-only: no route to the outside, so Paperless, Postgres, and Redis are
  # reachable only via Pomerium, which is the lone service bridging it to default.
  paperless-internal:
    internal: true

volumes:
  pomerium-cache:
  paperless-data:
  paperless-media:
  paperless-db:
  paperless-redis:
```
