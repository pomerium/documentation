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
    networks:
      forgejo-pomerium:
        ipv4_address: 172.30.0.2
    restart: always

  forgejo:
    image: codeberg.org/forgejo/forgejo:15
    # Do not publish Forgejo's port to the host. Reverse-proxy auth trusts the
    # identity header from ANY peer that can reach forgejo:3000, and
    # REVERSE_PROXY_TRUSTED_PROXIES does NOT change that (it only affects
    # X-Forwarded-For parsing). Network isolation is the trust boundary: keep
    # only Pomerium on this network and attach no untrusted containers.
    networks:
      forgejo-pomerium: {}
    volumes:
      - forgejo-data:/data
    environment:
      FORGEJO__server__ROOT_URL: 'https://forgejo.yourdomain.com/'
      FORGEJO__database__DB_TYPE: 'sqlite3'
      FORGEJO__security__INSTALL_LOCK: 'true'
      FORGEJO__service__REQUIRE_SIGNIN_VIEW: 'true'

      # Reverse-proxy SSO: Forgejo trusts the identity header Pomerium forwards.
      FORGEJO__service__ENABLE_REVERSE_PROXY_AUTHENTICATION: 'true'
      # Web UI sign-in only. Keep header auth off the API so tokens/SSH stay the
      # path for Git and API clients (set explicitly, not relying on the default).
      FORGEJO__service__ENABLE_REVERSE_PROXY_AUTHENTICATION_API: 'false'
      FORGEJO__service__ENABLE_REVERSE_PROXY_AUTO_REGISTRATION: 'true'
      FORGEJO__service__ENABLE_REVERSE_PROXY_EMAIL: 'true'
      FORGEJO__service__ENABLE_REVERSE_PROXY_FULL_NAME: 'true'
      # Allow provisioning via the proxy, but keep the local sign-up form closed.
      FORGEJO__service__DISABLE_REGISTRATION: 'false'
      FORGEJO__service__ALLOW_ONLY_EXTERNAL_REGISTRATION: 'true'
      FORGEJO__service__SHOW_REGISTRATION_BUTTON: 'false'

      # Header names must match what Pomerium sends (config.yaml above).
      FORGEJO__security__REVERSE_PROXY_AUTHENTICATION_USER: 'X-Pomerium-Sub'
      FORGEJO__security__REVERSE_PROXY_AUTHENTICATION_EMAIL: 'X-Pomerium-Claim-Email'
      FORGEJO__security__REVERSE_PROXY_AUTHENTICATION_FULL_NAME: 'X-Pomerium-Claim-Name'
      # For X-Forwarded-For client-IP parsing, list only Pomerium. This does not
      # restrict which peer the reverse-proxy auth header is trusted from. Must
      # be an IP/CIDR, not a hostname; the Compose network gives Pomerium a
      # fixed address.
      FORGEJO__security__REVERSE_PROXY_TRUSTED_PROXIES: '172.30.0.2/32'
      FORGEJO__security__REVERSE_PROXY_LIMIT: '1'
    restart: always

networks:
  forgejo-pomerium:
    name: forgejo-pomerium
    ipam:
      config:
        - subnet: 172.30.0.0/24

volumes:
  pomerium-cache:
  forgejo-data:
```
