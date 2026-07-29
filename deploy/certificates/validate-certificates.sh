#!/usr/bin/env bash

set -Eeuo pipefail

CERT_DIR="${1:-${CERT_DIR:-/data/cert}}"
MIN_VALID_DAYS="${2:-${CERT_MIN_VALID_DAYS:-14}}"

command -v openssl >/dev/null 2>&1 || {
  echo "openssl is required to validate TLS certificates" >&2
  exit 1
}

case "$MIN_VALID_DAYS" in
  *[!0-9]*|"")
    echo "MIN_VALID_DAYS must be a non-negative integer" >&2
    exit 1
    ;;
esac

MIN_VALID_SECONDS=$((MIN_VALID_DAYS * 86400))

validate_pair() {
  local label="$1"
  local certificate="$2"
  local private_key="$3"
  shift 3
  local domains=("$@")
  local certificate_public_key
  local private_public_key
  local certificate_count
  local san_output

  [[ -r "$certificate" ]] || {
    echo "${label}: certificate is missing or unreadable: ${certificate}" >&2
    return 1
  }
  [[ -r "$private_key" ]] || {
    echo "${label}: private key is missing or unreadable: ${private_key}" >&2
    return 1
  }

  openssl x509 -in "$certificate" -noout >/dev/null
  openssl pkey -in "$private_key" -check -noout >/dev/null

  if ! openssl x509 -in "$certificate" -noout -checkend "$MIN_VALID_SECONDS" >/dev/null; then
    echo "${label}: certificate expires in less than ${MIN_VALID_DAYS} days" >&2
    return 1
  fi

  san_output="$(openssl x509 -in "$certificate" -noout -ext subjectAltName)"
  for domain in "${domains[@]}"; do
    if [[ "$san_output" != *"DNS:${domain}"* ]]; then
      echo "${label}: certificate SAN does not contain ${domain}" >&2
      return 1
    fi
  done

  certificate_public_key="$(
    openssl x509 -in "$certificate" -pubkey -noout \
      | openssl pkey -pubin -outform DER 2>/dev/null \
      | openssl dgst -sha256
  )"
  private_public_key="$(
    openssl pkey -in "$private_key" -pubout -outform DER 2>/dev/null \
      | openssl dgst -sha256
  )"
  if [[ "$certificate_public_key" != "$private_public_key" ]]; then
    echo "${label}: certificate and private key do not match" >&2
    return 1
  fi

  certificate_count="$(grep -c -- '-----BEGIN CERTIFICATE-----' "$certificate")"
  if (( certificate_count < 2 )); then
    echo "${label}: fullchain must contain the leaf and at least one intermediate certificate" >&2
    return 1
  fi

  echo "${label}: valid for at least ${MIN_VALID_DAYS} days; SAN and private key verified"
}

validate_pair \
  "website" \
  "${CERT_DIR}/123proxy.cn.pem" \
  "${CERT_DIR}/123proxy.cn.key" \
  "123proxy.cn" \
  "www.123proxy.cn"

validate_pair \
  "console" \
  "${CERT_DIR}/console.123proxy.cn.pem" \
  "${CERT_DIR}/console.123proxy.cn.key" \
  "console.123proxy.cn"

echo "Certificate validation passed: ${CERT_DIR}"
