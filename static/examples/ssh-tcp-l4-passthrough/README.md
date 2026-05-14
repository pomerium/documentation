# SSH over TCP/443 through an L4 edge

This example supports the guide at:

https://www.pomerium.com/docs/guides/ssh-tcp-l4-passthrough

It runs four services:

- `nginx`: L4 edge using `stream {}` passthrough on TCP/443
- `pomerium`: TCP route proxy
- `sshd`: SSH target
- `client`: in-network test client with `pomerium-cli`, `ssh`, and `sshpass`

Verified on May 14, 2026 with `pomerium/pomerium:v0.32.7` and `pomerium/cli:v0.32.2`.

## Run

Generate the local demo certificate first:

```bash
mkdir -p certs

openssl genrsa -out certs/ca.key 4096
openssl req -x509 -new -nodes -days 365 \
  -key certs/ca.key \
  -out certs/ca.crt \
  -subj "/CN=localhost.pomerium.io demo CA"

openssl genrsa -out certs/pomerium.key 2048
openssl req -new \
  -key certs/pomerium.key \
  -out certs/pomerium.csr \
  -config certs/openssl.cnf

openssl x509 -req -days 365 \
  -in certs/pomerium.csr \
  -CA certs/ca.crt \
  -CAkey certs/ca.key \
  -CAcreateserial \
  -out certs/pomerium.crt \
  -extensions v3_req \
  -extfile certs/openssl.cnf

rm certs/ca.key certs/ca.srl certs/pomerium.csr
```

Start the stack:

```bash
docker compose up -d --build
docker compose ps
```

Start the tunnel and SSH through it:

```bash
docker compose exec -d client sh -lc \
  'pomerium-cli tcp ssh.localhost.pomerium.io:22 \
    --alternate-ca-path /certs/ca.crt \
    --browser-cmd /bin/true \
    --listen 127.0.0.1:2222 \
    >/tmp/pomerium-cli.log 2>&1'

docker compose exec -T client sh -lc \
  'for i in $(seq 1 100); do
     nc -z 127.0.0.1 2222 && exit 0
     sleep 0.2
   done
   cat /tmp/pomerium-cli.log
   exit 1'

docker compose exec -T client sh -lc \
  "sshpass -p demo-password ssh \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o LogLevel=ERROR \
    -p 2222 demo@127.0.0.1 \
    'echo TUNNEL-OK; whoami; uname -srm'"
```

Clean up:

```bash
docker compose down -v
rm -f certs/ca.crt certs/ca.key certs/ca.srl certs/pomerium.crt certs/pomerium.csr certs/pomerium.key
```
