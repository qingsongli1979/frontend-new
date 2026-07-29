#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
SOURCE_CERT_DIR="${1:-${SOURCE_CERT_DIR:-/var/lib/123proxy-certificates/staging}}"
CERT_DIR="${CERT_DIR:-/data/cert}"
CERT_MIN_VALID_DAYS="${CERT_MIN_VALID_DAYS:-14}"
INSTALL_LOCAL="${INSTALL_LOCAL:-true}"
REMOTE_CERT_DIR="${REMOTE_CERT_DIR:-/data/cert}"
REMOTE_SUDO="${REMOTE_SUDO:-sudo}"
CERT_REMOTE_TARGETS="${CERT_REMOTE_TARGETS:-}"
SSH_IDENTITY_FILE="${SSH_IDENTITY_FILE:-}"
SSH_KNOWN_HOSTS_FILE="${SSH_KNOWN_HOSTS_FILE:-}"

"${SCRIPT_DIR}/validate-certificates.sh" "$SOURCE_CERT_DIR" "$CERT_MIN_VALID_DAYS"

declare -a SSH_OPTIONS=(
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
  -o ConnectTimeout=15
)

if [[ -n "$CERT_REMOTE_TARGETS" ]]; then
  : "${SSH_IDENTITY_FILE:?SSH_IDENTITY_FILE is required when CERT_REMOTE_TARGETS is set}"
  : "${SSH_KNOWN_HOSTS_FILE:?SSH_KNOWN_HOSTS_FILE is required when CERT_REMOTE_TARGETS is set}"
  [[ -r "$SSH_IDENTITY_FILE" ]] || {
    echo "SSH identity file is missing or unreadable: ${SSH_IDENTITY_FILE}" >&2
    exit 1
  }
  [[ -r "$SSH_KNOWN_HOSTS_FILE" ]] || {
    echo "SSH known-hosts file is missing or unreadable: ${SSH_KNOWN_HOSTS_FILE}" >&2
    exit 1
  }
  SSH_OPTIONS+=(
    -i "$SSH_IDENTITY_FILE"
    -o "UserKnownHostsFile=${SSH_KNOWN_HOSTS_FILE}"
  )
fi

install_cert_files() {
  local source="$1"
  local destination="$2"

  install -d -m 700 "$destination"
  install -m 644 "${source}/123proxy.cn.pem" "${destination}/123proxy.cn.pem"
  install -m 600 "${source}/123proxy.cn.key" "${destination}/123proxy.cn.key"
  install -m 644 "${source}/console.123proxy.cn.pem" "${destination}/console.123proxy.cn.pem"
  install -m 600 "${source}/console.123proxy.cn.key" "${destination}/console.123proxy.cn.key"
}

reload_local_frontends() {
  local container_ids

  command -v docker >/dev/null 2>&1 || {
    echo "Docker is unavailable; certificates were installed but no local container was reloaded"
    return 0
  }

  container_ids="$(docker ps -q --filter label=cn.123proxy.deploy-target)"
  if [[ -z "$container_ids" ]]; then
    echo "No local 123Proxy frontend container requires a TLS reload"
    return 0
  fi

  # Intentional word splitting: docker accepts one or more validated container IDs.
  # shellcheck disable=SC2086
  docker kill --signal HUP $container_ids >/dev/null
  echo "Reloaded local 123Proxy frontend containers"
}

if [[ "$INSTALL_LOCAL" == "true" ]]; then
  if [[ "$(cd "$SOURCE_CERT_DIR" && pwd)" != "$(mkdir -p "$CERT_DIR"; cd "$CERT_DIR" && pwd)" ]]; then
    install_cert_files "$SOURCE_CERT_DIR" "$CERT_DIR"
  fi
  "${SCRIPT_DIR}/validate-certificates.sh" "$CERT_DIR" "$CERT_MIN_VALID_DAYS"
  reload_local_frontends
fi

for target in $CERT_REMOTE_TARGETS; do
  remote_tmp="/tmp/123proxy-certificates-$$"
  echo "Deploying certificates to ${target}"

  ssh "${SSH_OPTIONS[@]}" "$target" "set -e; umask 077; mkdir -p '${remote_tmp}'"
  scp \
    "${SSH_OPTIONS[@]}" \
    "${SOURCE_CERT_DIR}/123proxy.cn.pem" \
    "${SOURCE_CERT_DIR}/123proxy.cn.key" \
    "${SOURCE_CERT_DIR}/console.123proxy.cn.pem" \
    "${SOURCE_CERT_DIR}/console.123proxy.cn.key" \
    "${SCRIPT_DIR}/validate-certificates.sh" \
    "${target}:${remote_tmp}/"

  ssh "${SSH_OPTIONS[@]}" "$target" \
    "set -Eeuo pipefail
     trap 'rm -rf \"${remote_tmp}\"' EXIT
     bash '${remote_tmp}/validate-certificates.sh' '${remote_tmp}' '${CERT_MIN_VALID_DAYS}'
     ${REMOTE_SUDO} install -d -m 700 '${REMOTE_CERT_DIR}'
     ${REMOTE_SUDO} install -m 644 '${remote_tmp}/123proxy.cn.pem' '${REMOTE_CERT_DIR}/123proxy.cn.pem'
     ${REMOTE_SUDO} install -m 600 '${remote_tmp}/123proxy.cn.key' '${REMOTE_CERT_DIR}/123proxy.cn.key'
     ${REMOTE_SUDO} install -m 644 '${remote_tmp}/console.123proxy.cn.pem' '${REMOTE_CERT_DIR}/console.123proxy.cn.pem'
     ${REMOTE_SUDO} install -m 600 '${remote_tmp}/console.123proxy.cn.key' '${REMOTE_CERT_DIR}/console.123proxy.cn.key'
     ${REMOTE_SUDO} bash '${remote_tmp}/validate-certificates.sh' '${REMOTE_CERT_DIR}' '${CERT_MIN_VALID_DAYS}'
     container_ids=\$(docker ps -q --filter label=cn.123proxy.deploy-target)
     if [ -n \"\$container_ids\" ]; then docker kill --signal HUP \$container_ids >/dev/null; fi
     echo 'Certificate deployment verified on ${target}'"
done

echo "Certificate distribution completed"
