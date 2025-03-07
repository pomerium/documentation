```yaml title="docker-compose.yaml"
services:
  nginx:
    # to emulate nginx-ingress behavior, use openresty which comes with 'escaped_request_uri'
    # pre-compiled. Also uncomment lines marked `uncomment to emulate nginx-ingress behavior`
    # in the nginx `.conf` configuration files.
    # image: openresty/openresty
    image: nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./verify.conf:/etc/nginx/conf.d/verify.conf
      - ./pomerium.conf:/etc/nginx/conf.d/pomerium.conf
      - ./_wildcard.localhost.pomerium.io.pem:/etc/nginx/nginx.pem
      - ./_wildcard.localhost.pomerium.io-key.pem:/etc/nginx/nginx-key.pem
      - ./proxy.conf:/etc/nginx/proxy.conf

  verify:
    image: pomerium/verify:latest
    expose:
      - 80
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    expose:
      - 80
```
