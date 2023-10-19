#!/bin/bash

if [ ! -f "./.env.local" ]; then
  echo "Secrets not found. Pulling files from Bitwarden..."
  if [[ -z "${BW_PASSWORD}" ]]; then
    echo "Error: BW_PASSWORD envvar is not defined. Please inject BW_PASSWORD into container!"
    exit 1;
  fi

  npm i -g @bitwarden/cli fx
# get secrets
  bw logout
  export BW_SESSION=$(bw login product@bitsofgood.org ${BW_PASSWORD} --raw);
  bw sync -- --session $BW_SESSION
  bw get item 5047b46d-6f28-464e-9a0a-b0950116d2b2 | fx .notes > ".env.local"

  echo "Secrets successfully retrieved."
fi

yarn dev
