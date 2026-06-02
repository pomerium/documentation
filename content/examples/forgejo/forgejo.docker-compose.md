```yaml title="docker-compose.yaml"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
    networks:
      forgejo-pomerium:
        ipv4_address: 172.30.0.2

  forgejo:
    image: codeberg.org/forgejo/forgejo:15.0.2
    # Do not publish Forgejo's port to the host. Reverse-proxy auth trusts the
    # identity header from ANY peer that can reach forgejo:3000, and
    # REVERSE_PROXY_TRUSTED_PROXIES does NOT change that (it only affects
    # X-Forwarded-For parsing). Network isolation is the trust boundary: keep
    # only Pomerium on this network and attach no untrusted containers.
    expose:
      - '3000'
    networks:
      forgejo-pomerium: {}
    volumes:
      - forgejo-data:/data
    environment:
      FORGEJO__server__ROOT_URL: 'https://forgejo.localhost.pomerium.io/'
      FORGEJO__database__DB_TYPE: 'sqlite3'
      FORGEJO__security__INSTALL_LOCK: 'true'
      FORGEJO__service__REQUIRE_SIGNIN_VIEW: 'true'

      # Reverse-proxy SSO
      FORGEJO__service__ENABLE_REVERSE_PROXY_AUTHENTICATION: 'true'
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
      # Trust only the proxy in front of Forgejo. This MUST be an IP/CIDR, not a
      # hostname. The Compose network below gives Pomerium a fixed address.
      FORGEJO__security__REVERSE_PROXY_TRUSTED_PROXIES: '172.30.0.2/32'
      FORGEJO__security__REVERSE_PROXY_LIMIT: '1'

networks:
  forgejo-pomerium:
    name: forgejo-pomerium
    ipam:
      config:
        - subnet: 172.30.0.0/24

volumes:
  forgejo-data:
```
