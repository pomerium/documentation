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
    # Pomerium bridges both networks: `default` for autocert/Let's Encrypt and the
    # hosted authenticate service, and the internal-only network to reach AdGuard.
    networks:
      - default
      - adguard-internal
    restart: always

  adguard:
    image: adguard/adguardhome@sha256:e6f2b8bcda06064ab055b44933a4f0e983c35558b9cdb8d2e7ab1efcee36d890 # v0.107.77
    volumes:
      - adguard-work:/opt/adguardhome/work
      - adguard-conf:/opt/adguardhome/conf
    ports:
      # DNS, served straight from AdGuard. The web UI stays private behind Pomerium.
      - 53:53/tcp
      - 53:53/udp
    # Internal-only network: AdGuard's web UI is reachable only through Pomerium,
    # never directly, so a leaked basic-auth credential can't bypass Pomerium.
    networks:
      - adguard-internal
    restart: always

networks:
  # No route to the outside; only services attached here (Pomerium and AdGuard)
  # can reach AdGuard's web port.
  adguard-internal:
    internal: true

volumes:
  pomerium-cache:
  adguard-work:
  adguard-conf:
```
