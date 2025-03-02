#!/bin/sh

set -e

if [ -n "$DATABASE_HOST" ]; then
  ./wait-for-it.sh "$DATABASE_HOST:$DATABASE_PORT"
fi

exec "$@"