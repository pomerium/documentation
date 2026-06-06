# Validation-only image: installs the openclaw npm package and runs the gateway
# headlessly in local mode so the sealed E2E can exercise the HTTP route without a
# model-provider API key or interactive setup. The published guide builds OpenClaw
# from the openclaw-pomerium-guide repo (with an SSH server); see ../../docker-compose.yaml.
FROM node:24-slim@sha256:242549cd46785b480c832479a730f4f2a20865d61ea2e404fdb2a5c3d3b73ecf

RUN apt-get update && \
  apt-get install -y curl && \
  rm -rf /var/lib/apt/lists/*

RUN useradd -m -d /claw -s /bin/bash claw && \
  mkdir -p /claw/workspace /claw/.openclaw && \
  chown -R claw:claw /claw

ARG OPENCLAW_VERSION=2026.6.1
RUN npm install -g openclaw@${OPENCLAW_VERSION}

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER claw
WORKDIR /claw

EXPOSE 18789
HEALTHCHECK --interval=5s --timeout=4s --retries=30 --start-period=20s \
  CMD curl -fsS http://127.0.0.1:18789/ >/dev/null || exit 1

CMD ["/entrypoint.sh"]
