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

  tooljet:
    image: tooljet/tooljet-ce@sha256:bc3f53b35a6264742f30384463ed062d9e6325c539805efd603281d899e943e6
    tty: true
    stdin_open: true
    command: npm run start:prod
    environment:
      # The public URL Pomerium serves ToolJet on. ToolJet rejects requests whose
      # Host header doesn't match, which is why the route preserves the Host header.
      TOOLJET_HOST: https://tooljet.yourdomain.com
      PORT: '80'
      SERVE_CLIENT: 'true'
      # Encryption keys. Generate your own and keep them secret:
      #   openssl rand -hex 32   (LOCKBOX_MASTER_KEY)
      #   openssl rand -hex 64   (SECRET_KEY_BASE)
      LOCKBOX_MASTER_KEY: REPLACE_WITH_64_CHAR_HEX
      SECRET_KEY_BASE: REPLACE_WITH_128_CHAR_HEX
      # PostgreSQL connection. The bundled entrypoint runs migrations on first boot.
      PG_HOST: postgres
      PG_PORT: '5432'
      PG_USER: postgres
      PG_PASS: postgres
      PG_DB: tooljet_production
      # ToolJet's built-in database. It reuses the same PostgreSQL server here.
      TOOLJET_DB: tooljet_db
      TOOLJET_DB_HOST: postgres
      TOOLJET_DB_USER: postgres
      TOOLJET_DB_PASS: postgres
    depends_on:
      postgres:
        condition: service_healthy
    restart: always

  postgres:
    image: postgres@sha256:4b7183ac05f8ef417db21fd72d71047a4238340c261d3cc3ddb6d579ab5071ae # 16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 20
    restart: always

volumes:
  pomerium-cache:
  postgres-data:
```
