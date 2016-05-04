#!/bin/bash

PACKAGES=$1
BABEL=$2
BABEL_OPTIONS=$3

echo "Compiling packages: $PACKAGES"
echo ""
for package in $PACKAGES; do
  if [ -d "${package}/src" ]; then
    "$BABEL" "${package}/src" --source-map inline \
                              --out-dir    "${package}/lib" \
                              $BABEL_OPTIONS
  fi
done