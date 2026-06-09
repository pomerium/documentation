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

  transmission:
    image: lscr.io/linuxserver/transmission@sha256:aa4926b22bc25e89820acf427f8a5d1426c34a7ae9bd834e06eda43b12d839c3 # 4.1.2
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
    volumes:
      - transmission-config:/config
      - transmission-downloads:/downloads
    restart: always

volumes:
  pomerium-cache:
  transmission-config:
  transmission-downloads:
```
