#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ACME_HOME="${ACME_HOME:-/var/lib/acme-123proxy}"
ACME_BIN="${ACME_BIN:-${ACME_HOME}/acme.sh}"
ACME_EMAIL="${ACME_EMAIL:-}"
ACME_SERVER="${ACME_SERVER:-letsencrypt}"
DNS_SLEEP="${DNS_SLEEP:-120}"
STAGING_DIR="${STAGING_DIR:-/var/lib/123proxy-certificates/staging}"
STATE_DIR="${STATE_DIR:-/var/lib/123proxy-certificates/state}"
STATE_FILE="${STATE_DIR}/installed.sha256"
FORCE_CERT_DEPLOY="${FORCE_CERT_DEPLOY:-false}"

[[ -x "$ACME_BIN" ]] || {
  echo "acme.sh is missing or not executable: ${ACME_BIN}" >&2
  exit 1
}
: "${ACME_EMAIL:?ACME_EMAIL is required}"

install -d -m 700 "$ACME_HOME" "$STAGING_DIR" "$STATE_DIR"

acme() {
  "$ACME_BIN" \
    --home "$ACME_HOME" \
    --config-home "$ACME_HOME" \
    "$@"
}

register_account() {
  if [[ ! -f "${ACME_HOME}/account.conf" ]]; then
    acme --register-account --server "$ACME_SERVER" --accountemail "$ACME_EMAIL"
  fi
}

issue_if_missing() {
  local primary_domain="$1"
  shift
  local certificate_config="${ACME_HOME}/${primary_domain}_ecc/${primary_domain}.conf"

  if [[ -f "$certificate_config" ]]; then
    return 0
  fi

  : "${Ali_Key:?Ali_Key is required for the first Aliyun DNS issuance}"
  : "${Ali_Secret:?Ali_Secret is required for the first Aliyun DNS issuance}"

  acme \
    --issue \
    --server "$ACME_SERVER" \
    --dns dns_ali \
    --dnssleep "$DNS_SLEEP" \
    --keylength ec-256 \
    -d "$primary_domain" \
    "$@"
}

install_current_certificates() {
  install -m 644 /dev/null "${STAGING_DIR}/123proxy.cn.pem"
  install -m 600 /dev/null "${STAGING_DIR}/123proxy.cn.key"
  install -m 644 /dev/null "${STAGING_DIR}/console.123proxy.cn.pem"
  install -m 600 /dev/null "${STAGING_DIR}/console.123proxy.cn.key"

  acme \
    --install-cert \
    --ecc \
    -d 123proxy.cn \
    --key-file "${STAGING_DIR}/123proxy.cn.key" \
    --fullchain-file "${STAGING_DIR}/123proxy.cn.pem"

  acme \
    --install-cert \
    --ecc \
    -d console.123proxy.cn \
    --key-file "${STAGING_DIR}/console.123proxy.cn.key" \
    --fullchain-file "${STAGING_DIR}/console.123proxy.cn.pem"
}

certificate_checksum() {
  sha256sum \
    "${STAGING_DIR}/123proxy.cn.pem" \
    "${STAGING_DIR}/123proxy.cn.key" \
    "${STAGING_DIR}/console.123proxy.cn.pem" \
    "${STAGING_DIR}/console.123proxy.cn.key" \
    | sha256sum \
    | awk '{print $1}'
}

register_account
issue_if_missing 123proxy.cn -d www.123proxy.cn
issue_if_missing console.123proxy.cn

# acme.sh uses the CA's ARI renewal window when available and otherwise its
# normal lifetime-based schedule.
acme --cron --server "$ACME_SERVER"
install_current_certificates
"${SCRIPT_DIR}/validate-certificates.sh" "$STAGING_DIR" "${CERT_MIN_VALID_DAYS:-14}"

new_checksum="$(certificate_checksum)"
old_checksum="$(cat "$STATE_FILE" 2>/dev/null || true)"
if [[ "$FORCE_CERT_DEPLOY" != "true" && "$new_checksum" == "$old_checksum" ]]; then
  echo "Certificates are unchanged; distribution is not required"
  exit 0
fi

"${SCRIPT_DIR}/deploy-certificates.sh" "$STAGING_DIR"

state_tmp="${STATE_FILE}.tmp"
printf '%s\n' "$new_checksum" > "$state_tmp"
chmod 600 "$state_tmp"
mv "$state_tmp" "$STATE_FILE"

echo "Certificate renewal workflow completed"
