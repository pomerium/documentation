---
# cSpell:ignore fwdauth authredirect
---
```nginx
# Protected application
server {
  listen 80;
  listen 443 ssl http2;

  server_name verify.localhost.pomerium.io;
  ssl_certificate /etc/nginx/nginx.pem;
  ssl_certificate_key /etc/nginx/nginx-key.pem;


  location = /ext_authz {
    internal;

    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Forwarded-Proto "";

    proxy_set_header Host fwdauth.localhost.pomerium.io;
    proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
    proxy_set_header X-Original-Method $request_method;
    proxy_set_header X-Real-IP $remote_addr;

    proxy_set_header X-Forwarded-For $remote_addr;

    proxy_set_header X-Auth-Request-Redirect $request_uri;

    proxy_buffering off;

    proxy_buffer_size 4k;
    proxy_buffers 4 4k;
    proxy_request_buffering on;
    proxy_http_version 1.1;

    proxy_ssl_server_name on;
    proxy_pass_request_headers on;

    client_max_body_size 1m;

    # Pass the extracted client certificate to the auth provider

    set $target http://pomerium/verify?uri=$scheme://$http_host$request_uri;

    # uncomment to emulate nginx-ingress behavior
    # set $target http://pomerium/verify?uri=$scheme://$http_host$request_uri&rd=$pass_access_scheme://$http_host$escaped_request_uri;
    proxy_pass $target;
  }

  location @authredirect {
    internal;
    add_header Set-Cookie $auth_cookie;

    # uncomment to emulate nginx-ingress behavior
    # return 302 https://fwdauth.localhost.pomerium.io/?uri=$scheme://$host$request_uri&rd=$pass_access_scheme://$http_host$escaped_request_uri;

    return 302
      https://fwdauth.localhost.pomerium.io/?uri=$scheme://$host$request_uri;
  }

  location / {
    proxy_pass http://verify;

    include /etc/nginx/proxy.conf;
    # If we get a 401, respond with a named location
    error_page 401 = @authredirect;
    # this location requires authentication
    auth_request /ext_authz;
    auth_request_set $auth_cookie $upstream_http_set_cookie;
    add_header Set-Cookie $auth_cookie;
  }
}
```
