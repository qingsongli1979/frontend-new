#!/bin/sh

set -eu

TLS_DIR=/etc/nginx/tls
NGINX_LOG_DIR=/var/log/nginx

mkdir -p "$NGINX_LOG_DIR"
touch "$NGINX_LOG_DIR/access.log" "$NGINX_LOG_DIR/error.log"
chmod 0755 "$NGINX_LOG_DIR"
chmod 0644 "$NGINX_LOG_DIR/access.log" "$NGINX_LOG_DIR/error.log"

mkdir -p "$TLS_DIR"

case "${TLS_MODE:-off}" in
  on)
    : "${WEBSITE_TLS_CERTIFICATE:?WEBSITE_TLS_CERTIFICATE is required when TLS_MODE=on}"
    : "${WEBSITE_TLS_CERTIFICATE_KEY:?WEBSITE_TLS_CERTIFICATE_KEY is required when TLS_MODE=on}"
    : "${CONSOLE_TLS_CERTIFICATE:?CONSOLE_TLS_CERTIFICATE is required when TLS_MODE=on}"
    : "${CONSOLE_TLS_CERTIFICATE_KEY:?CONSOLE_TLS_CERTIFICATE_KEY is required when TLS_MODE=on}"

    for certificate_file in \
      "$WEBSITE_TLS_CERTIFICATE" \
      "$WEBSITE_TLS_CERTIFICATE_KEY" \
      "$CONSOLE_TLS_CERTIFICATE" \
      "$CONSOLE_TLS_CERTIFICATE_KEY"
    do
      if [ ! -r "$certificate_file" ]; then
        echo "Required TLS file is missing or unreadable: $certificate_file" >&2
        exit 1
      fi
    done

    {
      printf 'ssl_certificate %s;\n' "$WEBSITE_TLS_CERTIFICATE"
      printf 'ssl_certificate_key %s;\n' "$WEBSITE_TLS_CERTIFICATE_KEY"
      printf '%s\n' 'ssl_session_cache shared:website_tls:10m;'
      printf '%s\n' 'ssl_session_timeout 10m;'
      printf '%s\n' 'ssl_protocols TLSv1.2 TLSv1.3;'
    } > "$TLS_DIR/website.conf"

    {
      printf 'ssl_certificate %s;\n' "$CONSOLE_TLS_CERTIFICATE"
      printf 'ssl_certificate_key %s;\n' "$CONSOLE_TLS_CERTIFICATE_KEY"
      printf '%s\n' 'ssl_session_cache shared:console_tls:10m;'
      printf '%s\n' 'ssl_session_timeout 10m;'
      printf '%s\n' 'ssl_protocols TLSv1.2 TLSv1.3;'
    } > "$TLS_DIR/console.conf"
    ;;
  off)
    : > "$TLS_DIR/website.conf"
    : > "$TLS_DIR/console.conf"
    ;;
  *)
    echo "TLS_MODE must be either on or off" >&2
    exit 1
    ;;
esac
