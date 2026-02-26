#!/bin/bash

set -e

URL=$( ( ssh example.com -- whoami 2>&1 & ) | grep -m 1 "https://" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
echo ">> detected login URL: $URL"
./oauth_flow.sh "$URL"
echo ">> logged in successfully"