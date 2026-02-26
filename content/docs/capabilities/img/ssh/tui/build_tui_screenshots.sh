#!/bin/bash

set -e

ID="$(id -u):$(id -g)"
docker build -t screenshot-builder -f Dockerfile .
docker run -it --rm --dns 127.0.0.1 -v ./out:/out -v ./tapes:/tapes screenshot-builder "scripts/run.sh" "${ID}"