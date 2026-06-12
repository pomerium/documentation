FROM node:24-slim

# Install git, openssh-server, iproute2 (for ip command), curl, and jq
# (curl + jq are used by ./bootstrap.sh on the host via 'docker compose exec'
# to talk to the Pomerium Zero API without requiring those tools on the host)
RUN apt-get update && \
  apt-get install -y curl git openssh-server iproute2 jq sudo && \
  rm -rf /var/lib/apt/lists/*

# Create claw user with home directory at /claw
RUN useradd -m -d /claw -s /bin/bash claw && \
  mkdir -p /claw/workspace && \
  mkdir -p /claw/.openclaw && \
  chown -R claw:claw /claw

# Configure SSH
RUN mkdir -p /var/run/sshd && \
  mkdir -p /var/lib/pomerium && \
  sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config && \
  echo "TrustedUserCAKeys /var/lib/pomerium/pomerium_user_ca_key.pub" >> /etc/ssh/sshd_config

# Install openclaw
ARG OPENCLAW_VERSION=latest
RUN npm install -g openclaw@${OPENCLAW_VERSION}

WORKDIR /claw

# Copy and set up entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 22

CMD ["/entrypoint.sh"]
