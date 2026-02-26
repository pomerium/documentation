FROM golang:latest AS mockidp

RUN mkdir /workspace && cd /workspace \
 && git clone --depth=1 --branch kralicky/mockidp-cmd https://github.com/pomerium/pomerium \
 && cd pomerium \
 && go build -o bin/mock-idp ./internal/cmd/mock-idp

FROM pomerium/pomerium@sha256:5a2b585b7d24d9c7dedf38529cd7af27e5842527fc5825c7db14a0f79e31a0b4 AS pomerium

FROM debian@sha256:3615a749858a1cba49b408fb49c37093db813321355a9ab7c1f9f4836341e9db

RUN apt-get update \
 && apt-get install -y wget ffmpeg libnss3-tools ca-certificates dnsmasq iproute2 curl ldnsutils openssh-client openssl vim

RUN wget https://github.com/charmbracelet/vhs/releases/download/v0.10.0/vhs_0.10.0_amd64.deb \
 && dpkg -i ./vhs_0.10.0_amd64.deb \
 && wget https://github.com/fortio/fortio/releases/download/v1.74.0/fortio_1.74.0_amd64.deb \
 && dpkg -i ./fortio_1.74.0_amd64.deb \
 && wget -O /usr/local/bin/mkcert "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64" \
 && chmod +x /usr/local/bin/mkcert \
 && wget -O /usr/local/bin/ttyd https://github.com/tsl0922/ttyd/releases/download/1.7.7/ttyd.x86_64 \
 && chmod +x /usr/local/bin/ttyd \
 && rm vhs_0.10.0_amd64.deb \
 && rm fortio_1.74.0_amd64.deb

COPY --from=pomerium /bin/pomerium /usr/local/bin/pomerium

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
 && apt -y install ./google-chrome-stable_current_amd64.deb

COPY --from=mockidp /workspace/pomerium/bin/mock-idp /usr/local/bin/mock-idp

RUN echo "listen-address=::1,127.0.0.1\nport=53\nbind-interfaces\ndomain=example.com\naddress=/example.com/127.0.0.1" > /etc/dnsmasq.conf
RUN mkdir /pomerium

WORKDIR /pomerium

RUN mkcert -install \
 && mkcert "*.example.com"

RUN ssh-keygen -N "" -t ed25519 -f demo_host_key \
 && ssh-keygen -N "" -t ed25519 -f demo_user_ca_key \
 && ssh-keygen -N "" -t ed25519 -f /root/.ssh/id_ed25519 \
 && openssl rand -base64 32 | tr -d '\n' > /pomerium/demo_cookie_secret \
 && openssl rand -base64 32 | tr -d '\n' > /pomerium/demo_shared_secret \
 && echo "example.com $(cat demo_host_key.pub)" >> /root/.ssh/known_hosts

COPY config.yaml /pomerium/config.yaml
COPY scripts/ /pomerium/scripts/
COPY _entrypoint.sh /_entrypoint.sh
ENTRYPOINT [ "/_entrypoint.sh" ]

