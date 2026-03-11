#!/bin/bash

set -e


for f in /tapes/$1; do
  rm -f /ssh.log
  NAME=$(basename "$f" ".tape")
  VHS_NO_SANDBOX=1 vhs -o "${NAME}.gif" "$f"
  [ -f "/ssh.log" ] && ( echo "SSH logs:"; cat /ssh.log ) || echo "WARN: tape $f failed. Check the screenshot"
  ffmpeg -loglevel quiet -i "${NAME}.gif" -fps_mode passthrough "${NAME}_%d.png"
  mv "${NAME}_1.png" "/out/${NAME}.png"
done