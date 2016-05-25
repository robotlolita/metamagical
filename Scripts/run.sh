#!/bin/bash
COMMAND=$1
PACKAGES=$2

ROOT="$(pwd)"

for package in $PACKAGES; do
    if [ -f "${package}/Makefile" ]; then
        cd "$package"
        make "$COMMAND" || exit 1
        cd "$ROOT"
    fi
done
