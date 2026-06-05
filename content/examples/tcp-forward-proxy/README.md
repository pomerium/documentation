# pomerium-cli tcp through a client-side forward proxy

This example supports the guide at:

https://www.pomerium.com/docs/guides/tcp-forward-proxy

It runs five services:

- `postgres`: the upstream TCP service
- `pomerium`: the TCP route proxy / edge
- `squid`: an HTTP CONNECT forward proxy
- `socks5`: a SOCKS5 forward proxy
- `client`: in-network test client with `pomerium-cli` and `psql`

The `client` image copies `pomerium-cli` from `pomerium/cli:latest`. The
`--forward-proxy` flag requires a `pomerium-cli` release that includes it; see
the guide for the minimum version.

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

Tunnel to Postgres through the HTTP proxy and run a query:

```bash
docker compose exec -d client sh -lc \
  'pomerium-cli tcp pgsql.localhost.pomerium.io:5432 \
    --pomerium-url https://proxy.localhost.pomerium.io \
    --alternate-ca-path /certs/pomerium.crt \
    --forward-proxy http://squid:3128 \
    --browser-cmd /bin/true \
    --listen 127.0.0.1:5432 \
    >/tmp/pomerium-cli.log 2>&1'

docker compose exec client sh -lc \
  'PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -c "select version();"'
```

Through the SOCKS5 proxy instead, change the flag to `--forward-proxy socks5://socks5:1080`.

Confirm the tunnel traversed the HTTP proxy:

```bash
docker compose exec squid grep CONNECT /var/log/squid/access.log
```

Clean up:

```bash
docker compose down -v
rm -f certs/pomerium.crt certs/pomerium.key
```
