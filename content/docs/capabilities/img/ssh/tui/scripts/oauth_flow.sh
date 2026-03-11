#!/bin/bash

set -e

rm -f cookie-jar
URL="$(curl -sfL --dump-header % -o /dev/null -b cookie-jar -c cookie-jar "$1" 2>&1 | grep 'location: ' | sed -e 's/location: [[:space:]]*//' -e 's/[[:space:]]*$//')"
URL2="$(curl -X POST -sL --max-redirs 1 -o /dev/null --dump-header % -b cookie-jar -c cookie-jar "${URL}" -F email=user@example.com 2>&1 | grep 'location: ' | sed -e 's/location: [[:space:]]*//' -e 's/[[:space:]]*$//')"
curl -s -X GET -o /dev/null -b cookie-jar -c cookie-jar "${URL2}"
curl -s -X POST -o /dev/null -b cookie-jar -c cookie-jar "${URL2}&confirm=true"
rm -f cookie-jar