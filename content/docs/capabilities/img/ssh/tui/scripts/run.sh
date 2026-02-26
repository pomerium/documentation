#!/bin/bash

set -e

sleep 1;

cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null

./initial_login.sh
./process_tapes.sh
chown "$1" /out/*