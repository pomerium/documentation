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

  adguard:
    image: adguard/adguardhome:latest
    volumes:
      - adguard-work:/opt/adguardhome/work
      - adguard-conf:/opt/adguardhome/conf
    ports:
      # DNS, served straight from AdGuard. The web UI stays private behind Pomerium.
      - 53:53/tcp
      - 53:53/udp
    restart: always

volumes:
  pomerium-cache:
  adguard-work:
  adguard-conf:
```
