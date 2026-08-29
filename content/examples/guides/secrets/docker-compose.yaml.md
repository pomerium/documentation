```yaml title="docker-compose.yaml"
services:
  pomerium:
    image: pomerium/pomerium:main
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
      # Mount the directory, not the single file, so the credential can be
      # replaced atomically from the host. Read-only: Pomerium never writes it.
      - ./secrets:/etc/pomerium/secrets:ro
      - pomerium-cache:/data
    ports:
      - 443:443
      - 80:80
      # Metrics stay on the loopback interface.
      - 127.0.0.1:9090:9090
    # Pomerium bridges both networks: `default` for autocert/Let's Encrypt and the
    # hosted authenticate service, and the internal-only network to reach the API.
    networks:
      - default
      - api-internal
    restart: always

  # Stand-in for the real upstream API. It echoes the request it received,
  # including headers, so you can see what Pomerium injected.
  upstream:
    image: mendhak/http-https-echo:37
    environment:
      HTTP_PORT: 8080
    # Internal-only network with no published ports: the API is reachable only
    # through Pomerium, so a leaked credential cannot be replayed against it
    # from outside.
    networks:
      - api-internal
    restart: always

networks:
  api-internal:
    internal: true

volumes:
  pomerium-cache:
```
