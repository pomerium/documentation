#!/bin/bash

set -e

dnsmasq -8 /dnsmasq.log

fortio server >/fortio.log 2>&1 &

mock-idp -httptest.serve=localhost:8024 '{"users":[{"email":"user@example.com"}]}' >/mockidp.log 2>&1 &

pomerium --config /pomerium/config.yaml >/pomerium.log 2>&1 &

command "$@"