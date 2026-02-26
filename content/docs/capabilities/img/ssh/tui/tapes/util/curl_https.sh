#!/bin/bash

( sleep "$1"; curl https://https-route.example.com ) &
disown