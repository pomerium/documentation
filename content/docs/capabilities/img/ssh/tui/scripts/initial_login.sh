#!/bin/bash

set -e

function onError() {
  printf "Initial login failed\nPomerium logs:\n"
  cat /pomerium.log
  exit 1
}

trap onError SIGINT

sleep 1

URL=$( ( ssh example.com -- whoami 2>&1 & ) | grep -m 1 "https://" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
[ -n "$URL" ] || onError
echo ">> detected login URL: $URL"
./oauth_flow.sh "$URL"
echo ">> logged in successfully"