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

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      # Trust the email Pomerium forwards and skip Open WebUI's own login screen.
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-Pomerium-Claim-Email
      - WEBUI_URL=https://llm.yourdomain.com
      # The first provisioned user becomes admin; later users default to "pending" and
      # must be approved. Uncomment to make new SSO users active immediately instead.
      # - DEFAULT_USER_ROLE=user
    volumes:
      - open-webui-data:/app/backend/data
    restart: always

volumes:
  pomerium-cache:
  open-webui-data:
```
