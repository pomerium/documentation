#!/bin/bash

set -e

cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null

echo "starting initial login"
./initial_login.sh
echo "processing tapes"
./process_tapes.sh "$2"
echo "done"
chown "$1" /out/*