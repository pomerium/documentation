---
# cSpell:ignore fwdauth
---
```nginx
# Pomerium endpoint
server {
    listen 443 ssl;
    server_name  authenticate.localhost.pomerium.io fwdauth.localhost.pomerium.io;
    ssl_certificate /etc/nginx/nginx.pem;
    ssl_certificate_key /etc/nginx/nginx-key.pem;

    location / {
      proxy_pass http://pomerium;
      include /etc/nginx/proxy.conf;
    }
}

# Define an upstream so that we don't need resolvers when we use variables in proxy_pass directives
# https://stackoverflow.com/questions/17685674/nginx-proxy-pass-with-remote-addr
upstream pomerium {
    server pomerium;
}
```
