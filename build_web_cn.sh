#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$ROOT_DIR"

command -v npm >/dev/null 2>&1 || {
  echo "npm is required" >&2
  exit 1
}

SOURCE_REVISION="${BUILD_REVISION:-$(git rev-parse --short=12 HEAD 2>/dev/null || printf 'nogit')}"
RELEASE_TAG="${RELEASE_TAG:-$(date -u +%Y%m%d%H%M%S)-${SOURCE_REVISION}}"
BUILD_REVISION="$SOURCE_REVISION"
export BUILD_REVISION

case "$RELEASE_TAG" in
  *[!A-Za-z0-9_.-]*|"")
    echo "RELEASE_TAG contains unsupported Docker tag characters: $RELEASE_TAG" >&2
    exit 1
    ;;
esac

TARGET="${TARGET:-all}"
case "$TARGET" in
  all) TARGETS=(cn sz) ;;
  cn|sz) TARGETS=("$TARGET") ;;
  *)
    echo "TARGET must be all, cn, or sz" >&2
    exit 1
    ;;
esac

echo "Building static release ${RELEASE_TAG} from revision ${BUILD_REVISION}"
npm run build:deploy

cat > dist/release.env <<EOF
RELEASE_TAG=${RELEASE_TAG}
BUILD_REVISION=${BUILD_REVISION}
BUILT_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

if [[ "${BUILD_DOCKER_IMAGE:-true}" != "true" ]]; then
  echo "Static deploy package is ready in $ROOT_DIR/dist"
  exit 0
fi

command -v docker >/dev/null 2>&1 || {
  echo "docker is required when BUILD_DOCKER_IMAGE=true" >&2
  exit 1
}

REGISTRY="${DOCKER_REGISTRY:-registry.cn-hongkong.aliyuncs.com}"
CN_REPOSITORY="${CN_IMAGE_REPOSITORY:-123proxy/intelligroup-frontend}"
SZ_REPOSITORY="${SZ_IMAGE_REPOSITORY:-123proxy/intelligroup-frontend-sz}"
DOCKERFILE="${DOCKERFILE:-Dockerfile.release}"
PUBLISH_LATEST="${PUBLISH_LATEST:-true}"
PULL_BASE_IMAGE="${PULL_BASE_IMAGE:-true}"

declare -a VERSIONED_IMAGES=()
declare -a LATEST_IMAGES=()

build_target() {
  local target="$1"
  local repository
  local account_upstream
  local auth_upstream
  local ip_upstream
  local status_upstream
  local legacy_upstream
  local wordpress_upstream

  case "$target" in
    cn)
      repository="$CN_REPOSITORY"
      account_upstream="${CN_ACCOUNT_SERVICE_UPSTREAM:-http://account-service:6000}"
      auth_upstream="${CN_AUTH_SERVICE_UPSTREAM:-http://auth-service:5000}"
      ip_upstream="${CN_IP_SERVICE_UPSTREAM:-http://c3-ip-app:6800}"
      status_upstream="${CN_STATUS_API_UPSTREAM:-http://192.168.85.105:8080}"
      legacy_upstream="${CN_LEGACY_CONSOLE_UPSTREAM:-http://legacy-console:80}"
      wordpress_upstream="${CN_WORDPRESS_UPSTREAM:-http://cloudam-wordpress:80}"
      ;;
    sz)
      repository="$SZ_REPOSITORY"
      account_upstream="${SZ_ACCOUNT_SERVICE_UPSTREAM:-http://47.254.19.92:6000}"
      auth_upstream="${SZ_AUTH_SERVICE_UPSTREAM:-http://47.254.19.92:5000}"
      ip_upstream="${SZ_IP_SERVICE_UPSTREAM:-http://47.254.19.92:6800}"
      status_upstream="${SZ_STATUS_API_UPSTREAM:-http://192.168.85.105:8080}"
      legacy_upstream="${SZ_LEGACY_CONSOLE_UPSTREAM:-http://47.254.19.92:80}"
      wordpress_upstream="${SZ_WORDPRESS_UPSTREAM:-http://47.254.19.92:8000}"
      ;;
  esac

  local versioned_image="${REGISTRY}/${repository}:${RELEASE_TAG}"
  local latest_image="${REGISTRY}/${repository}:latest"
  local -a pull_arg=()
  if [[ "$PULL_BASE_IMAGE" == "true" ]]; then
    pull_arg=(--pull)
  fi

  echo "Building ${target} image: ${versioned_image}"
  docker build \
    "${pull_arg[@]}" \
    --build-arg "BUILD_REVISION=${BUILD_REVISION}" \
    --build-arg "DEPLOY_TARGET=${target}" \
    --build-arg "ACCOUNT_SERVICE_UPSTREAM=${account_upstream}" \
    --build-arg "AUTH_SERVICE_UPSTREAM=${auth_upstream}" \
    --build-arg "IP_SERVICE_UPSTREAM=${ip_upstream}" \
    --build-arg "STATUS_API_UPSTREAM=${status_upstream}" \
    --build-arg "LEGACY_CONSOLE_UPSTREAM=${legacy_upstream}" \
    --build-arg "WORDPRESS_UPSTREAM=${wordpress_upstream}" \
    --build-arg "TLS_MODE=on" \
    --build-arg "WEBSITE_LISTEN=443 ssl http2" \
    --build-arg "CONSOLE_LISTEN=443 ssl http2" \
    --build-arg "HTTPS_REDIRECT_LISTEN=80" \
    -f "$DOCKERFILE" \
    -t "$versioned_image" \
    .

  VERSIONED_IMAGES+=("$versioned_image")
  if [[ "$PUBLISH_LATEST" == "true" ]]; then
    docker tag "$versioned_image" "$latest_image"
    LATEST_IMAGES+=("$latest_image")
  fi
}

for target in "${TARGETS[@]}"; do
  build_target "$target"
done

if [[ "${PUSH_IMAGE:-false}" == "true" ]]; then
  if [[ -n "${DOCKER_USER:-}" || -n "${DOCKER_PASSWORD:-}" ]]; then
    : "${DOCKER_USER:?DOCKER_USER is required when DOCKER_PASSWORD is supplied}"
    : "${DOCKER_PASSWORD:?DOCKER_PASSWORD is required when DOCKER_USER is supplied}"
    printf '%s' "$DOCKER_PASSWORD" | docker login \
      --username "$DOCKER_USER" \
      --password-stdin \
      "$REGISTRY"
  else
    echo "Using the existing Docker login for ${REGISTRY}"
  fi

  for image in "${VERSIONED_IMAGES[@]}"; do
    docker push "$image"
  done
  for image in "${LATEST_IMAGES[@]}"; do
    docker push "$image"
  done
fi

echo
echo "Release tag: ${RELEASE_TAG}"
printf 'Built image: %s\n' "${VERSIONED_IMAGES[@]}"
if [[ "${PUSH_IMAGE:-false}" != "true" ]]; then
  echo "Images were not pushed. Re-run with PUSH_IMAGE=true after verification."
fi
