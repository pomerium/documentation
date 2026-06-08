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

  jellyfin:
    image: jellyfin/jellyfin@sha256:aefb67e6a7ff1debdd154a78a7bbb780fd0c873d8639210a7f6a2016ad2b35db # 10.10.7
    environment:
      # Jellyfin builds absolute URLs (DLNA, casting, the web client) from this
      # value, so it must be the public route, not the container name.
      JELLYFIN_PublishedServerUrl: https://jellyfin.yourdomain.com
    volumes:
      - jellyfin-config:/config
      - jellyfin-cache:/cache
    restart: always

volumes:
  pomerium-cache:
  jellyfin-config:
  jellyfin-cache:
```
