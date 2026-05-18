# SSH over port 443 through an L4 edge

This example supports the guide at:

https://www.pomerium.com/docs/guides/ssh-tcp-l4-passthrough

It runs four services:

- `nginx`: L4 edge using `stream {}` passthrough on port 443
- `pomerium`: TCP route proxy
- `sshd`: SSH target
- `client`: in-network test client with `pomerium-cli`, `ssh`, and `sshpass`

## Run

Generate the local demo certificate first:

```bash
./gen-certs.sh
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

docker compose exec client sh -lc \
  "sshpass -p demo-password ssh \
    -o StrictHostKeyChecking=no \
    -o LogLevel=ERROR \
    -p 2222 demo@127.0.0.1 \
    'hostname; whoami; uname -srm'"
```

Expected output:

```text
sshd
demo
Linux 6.19.13-orbstack-gbd1dc07b8cf4 aarch64
```

The kernel version will vary by Docker host.

Clean up:

```bash
docker compose down -v
rm -f certs/ca.crt certs/ca.key certs/ca.srl certs/pomerium.crt certs/pomerium.csr certs/pomerium.key
```
