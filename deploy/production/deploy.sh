#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
TARGET="${1:-${TARGET:-}}"
RELEASE_TAG="${RELEASE_TAG:-}"
CERT_DIR="${CERT_DIR:-/data/cert}"
WAIT_SECONDS="${WAIT_SECONDS:-240}"
CERT_MIN_VALID_DAYS="${CERT_MIN_VALID_DAYS:-14}"

case "$TARGET" in
  cn|sz) ;;
  *)
    echo "Usage: RELEASE_TAG=<tag> $0 cn|sz" >&2
    exit 1
    ;;
esac

: "${RELEASE_TAG:?RELEASE_TAG is required}"

"${SCRIPT_DIR}/../certificates/validate-certificates.sh" \
  "$CERT_DIR" \
  "$CERT_MIN_VALID_DAYS"

wait_for_swarm_service() {
  local service="$1"
  local deadline=$((SECONDS + WAIT_SECONDS))
  local replicas

  while (( SECONDS < deadline )); do
    replicas="$(docker service ls --filter "name=${service}" --format '{{.Replicas}}' | head -n 1)"
    if [[ "$replicas" =~ ^([0-9]+)/([0-9]+)$ ]] && [[ "${BASH_REMATCH[1]}" == "${BASH_REMATCH[2]}" ]]; then
      echo "Swarm service converged: ${service} ${replicas}"
      return 0
    fi
    sleep 5
  done

  docker service ps --no-trunc "$service" || true
  echo "Swarm service did not converge within ${WAIT_SECONDS}s: ${service}" >&2
  return 1
}

local_https_check() {
  if [[ "${SKIP_LOCAL_HEALTHCHECK:-false}" == "true" ]]; then
    echo "Skipping node-local HTTPS health checks"
    return 0
  fi

  command -v curl >/dev/null 2>&1 || {
    echo "curl is required for post-deploy health checks" >&2
    return 1
  }

  curl --fail --silent --show-error --insecure \
    --resolve www.123proxy.cn:443:127.0.0.1 \
    https://www.123proxy.cn/healthz >/dev/null
  curl --fail --silent --show-error --insecure \
    --resolve console.123proxy.cn:443:127.0.0.1 \
    https://console.123proxy.cn/healthz >/dev/null
  echo "Website and console HTTPS health checks passed"

  upstream_route_check() {
    local host="$1"
    local path="$2"
    local status

    status="$(curl --silent --show-error --insecure \
      --output /dev/null \
      --write-out '%{http_code}' \
      --resolve "${host}:443:127.0.0.1" \
      "https://${host}${path}")"

    case "$status" in
      000|502|503|504)
        echo "Upstream route failed: https://${host}${path} returned ${status}" >&2
        return 1
        ;;
      *)
        echo "Upstream route reachable: https://${host}${path} returned ${status}"
        ;;
    esac
  }

  expected_status_check() {
    local host="$1"
    local path="$2"
    local expected="$3"
    local status

    status="$(curl --silent --show-error --insecure \
      --output /dev/null \
      --write-out '%{http_code}' \
      --resolve "${host}:443:127.0.0.1" \
      "https://${host}${path}")"

    if [[ "$status" != "$expected" ]]; then
      echo "Route check failed: https://${host}${path} returned ${status}, expected ${expected}" >&2
      return 1
    fi
    echo "Route check passed: https://${host}${path} returned ${status}"
  }

  cors_header_check() {
    local host="$1"
    local path="$2"
    local origin="$3"
    local headers
    local origin_count
    local origin_value

    headers="$(curl --silent --show-error --insecure \
      --dump-header - \
      --output /dev/null \
      --header "Origin: ${origin}" \
      --resolve "${host}:443:127.0.0.1" \
      "https://${host}${path}")"
    origin_count="$(printf '%s\n' "$headers" | awk 'BEGIN { IGNORECASE=1 } /^Access-Control-Allow-Origin:/ { count++ } END { print count + 0 }')"
    origin_value="$(printf '%s\n' "$headers" | awk 'BEGIN { IGNORECASE=1 } /^Access-Control-Allow-Origin:/ { sub(/^[^:]+:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit }')"

    if [[ "$origin_count" != "1" || "$origin_value" != "$origin" ]]; then
      echo "CORS check failed: https://${host}${path} returned ${origin_count} Access-Control-Allow-Origin headers, first value=${origin_value:-<empty>}" >&2
      return 1
    fi
    echo "CORS check passed: https://${host}${path} returned one origin header"
  }

  upstream_route_check console.123proxy.cn /accsrv/information
  upstream_route_check console.123proxy.cn /ssosrv/oauth/token
  upstream_route_check console.123proxy.cn /ip/default/offers
  expected_status_check console.123proxy.cn /app/ 200
  expected_status_check www.123proxy.cn /ip/default/offers 200
  cors_header_check console.123proxy.cn /ip/default/offers https://www.123proxy.cn
  cors_header_check console.123proxy.cn /ip/default/userorder https://www.123proxy.cn
  upstream_route_check www.123proxy.cn /status-api/v1/summary
}

if [[ "$TARGET" == "cn" ]]; then
  : "${BACKEND_NETWORK:?BACKEND_NETWORK must name the existing overlay network shared with account-service, auth-service, c3-ip-app and WordPress}"
  STACK_NAME="${STACK_NAME:-frontend}"
  SERVICE_NAME="${STACK_NAME}_http"

  docker network inspect "$BACKEND_NETWORK" >/dev/null
  docker stack deploy \
    --with-registry-auth \
    --prune \
    -c "${SCRIPT_DIR}/frontend-out.yml" \
    "$STACK_NAME"

  wait_for_swarm_service "$SERVICE_NAME"
else
  COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-frontend}"
  if docker compose version >/dev/null 2>&1; then
    COMPOSE=(docker compose)
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE=(docker-compose)
  else
    echo "docker compose or docker-compose is required" >&2
    exit 1
  fi

  export RELEASE_TAG
  "${COMPOSE[@]}" -p "$COMPOSE_PROJECT_NAME" -f "${SCRIPT_DIR}/docker-compose.yml" pull
  "${COMPOSE[@]}" -p "$COMPOSE_PROJECT_NAME" -f "${SCRIPT_DIR}/docker-compose.yml" up -d --remove-orphans
  "${COMPOSE[@]}" -p "$COMPOSE_PROJECT_NAME" -f "${SCRIPT_DIR}/docker-compose.yml" ps
fi

local_https_check
echo "Production deployment completed: target=${TARGET}, release=${RELEASE_TAG}"
