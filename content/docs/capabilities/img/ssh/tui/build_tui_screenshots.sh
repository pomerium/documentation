#!/bin/bash

set -e

TAPES=${1:-"*.tape"}
BUILD_ARGS=()

if [ -n "$POMERIUM_IMAGE" ]; then
  BUILD_ARGS+=("--build-arg=pomerium_image=${POMERIUM_IMAGE}")
fi

ID="$(id -u):$(id -g)"
docker build -t screenshot-builder -f Dockerfile "${BUILD_ARGS[@]}" .
docker run -it --rm --dns 127.0.0.1 -v ./out:/out -v ./tapes:/tapes screenshot-builder "scripts/run.sh" "${ID}" "${TAPES}"