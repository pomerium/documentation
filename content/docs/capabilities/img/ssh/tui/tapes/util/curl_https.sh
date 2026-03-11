#!/bin/bash

DURATION="$1"
shift 1
( sleep "$DURATION"; curl "$@" https://https-route.example.com ) &
disown