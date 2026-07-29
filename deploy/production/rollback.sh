#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
TARGET="${1:-${TARGET:-}}"

case "$TARGET" in
  cn)
    STACK_NAME="${STACK_NAME:-frontend}"
    docker service rollback "${STACK_NAME}_http"
    docker service ps --no-trunc "${STACK_NAME}_http"
    ;;
  sz)
    : "${ROLLBACK_TAG:?ROLLBACK_TAG is required for the Shenzhen Compose rollback}"
    export RELEASE_TAG="$ROLLBACK_TAG"
    COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-frontend}"
    if docker compose version >/dev/null 2>&1; then
      COMPOSE=(docker compose)
    elif command -v docker-compose >/dev/null 2>&1; then
      COMPOSE=(docker-compose)
    else
      echo "docker compose or docker-compose is required" >&2
      exit 1
    fi
    "${COMPOSE[@]}" -p "$COMPOSE_PROJECT_NAME" -f "${SCRIPT_DIR}/docker-compose.yml" pull
    "${COMPOSE[@]}" -p "$COMPOSE_PROJECT_NAME" -f "${SCRIPT_DIR}/docker-compose.yml" up -d --remove-orphans
    "${COMPOSE[@]}" -p "$COMPOSE_PROJECT_NAME" -f "${SCRIPT_DIR}/docker-compose.yml" ps
    ;;
  *)
    echo "Usage: $0 cn | ROLLBACK_TAG=<previous-tag> $0 sz" >&2
    exit 1
    ;;
esac
