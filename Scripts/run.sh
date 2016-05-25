#!/bin/bash

COMMAND=$1
PACKAGES=$2

ROOT="$(pwd)"

for package in $PACKAGES; do
    if [ -f "${package}/Makefile" ]; then
        cd "$package"
        make "$COMMAND"
        cd "$ROOT"
    fi
done
