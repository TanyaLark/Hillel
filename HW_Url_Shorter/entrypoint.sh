#!/bin/sh
>&2 echo "Start migrations..."
if [ -z "${SKIP_MIGRATIONS}" ]; then
	npm run migrate:latest
fi
exec "$@"