import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(rootDir, relativePath), "utf8");
}

const buildScript = await read("build_web_cn.sh");
const releaseDockerfile = await read("Dockerfile.release");
const nginxConfig = await read("deploy/nginx/nginx.conf");
const nginxTemplate = await read("deploy/nginx/site.conf.template");
const tlsEntrypoint = await read("deploy/nginx/docker-entrypoint.d/15-prepare-123proxy.sh");
const cnRateLimit = await read("deploy/nginx/targets/cn/ip-rate-limit.conf");
const szRateLimit = await read("deploy/nginx/targets/sz/ip-rate-limit.conf");
const swarm = await read("deploy/production/frontend-out.yml");
const compose = await read("deploy/production/docker-compose.yml");
const deployScript = await read("deploy/production/deploy.sh");
const rollbackScript = await read("deploy/production/rollback.sh");
const certificateDeployScript = await read("deploy/certificates/deploy-certificates.sh");
const certificateRenewScript = await read("deploy/certificates/renew-certificates.sh");
const certificateValidator = await read("deploy/certificates/validate-certificates.sh");
const dockerIgnore = await read(".dockerignore");

for (const required of [
  "TARGETS=(cn sz)",
  "123proxy/intelligroup-frontend",
  "123proxy/intelligroup-frontend-sz",
  "Dockerfile.release",
  "PUSH_IMAGE",
  "--password-stdin",
  "47.254.19.92:6000",
  "47.254.19.92:5000",
  "47.254.19.92:6800",
  "47.254.19.92:8000"
]) {
  expect(buildScript.includes(required), `build_web_cn.sh: missing ${required}`);
}
expect(!buildScript.includes("Proxy123"), "build_web_cn.sh: hard-coded registry password detected");
expect(!buildScript.includes("docker login -u"), "build_web_cn.sh: insecure command-line password login detected");

for (const required of [
  "ARG DEPLOY_TARGET=cn",
  "ARG TLS_MODE=on",
  "COPY dist/www /var/www/website",
  "COPY dist/console /var/www/console",
  "COPY deploy/nginx/targets/${DEPLOY_TARGET}/ip-rate-limit.conf",
  "WEBSITE_TLS_CERTIFICATE=/cert/123proxy.cn.pem",
  "CONSOLE_TLS_CERTIFICATE=/cert/console.123proxy.cn.pem",
  "EXPOSE 80 443"
]) {
  expect(releaseDockerfile.includes(required), `Dockerfile.release: missing ${required}`);
}
expect(!releaseDockerfile.includes("COPY cert"), "Dockerfile.release: certificates must be mounted, not embedded");
expect(!releaseDockerfile.includes("COPY ./react/cert"), "Dockerfile.release: legacy certificate copy detected");
expect(!dockerIgnore.split(/\r?\n/).includes("dist"), ".dockerignore: dist must be available to Dockerfile.release");

expect(nginxConfig.includes("zone=console_ip:10m rate=5r/s"), "nginx.conf: missing Shenzhen-compatible IP rate-limit zone");
for (const required of [
  "listen ${WEBSITE_LISTEN}",
  "listen ${CONSOLE_LISTEN}",
  "listen ${HTTPS_REDIRECT_LISTEN}",
  "include /etc/nginx/tls/website.conf",
  "include /etc/nginx/tls/console.conf",
  "include /etc/nginx/target/ip-rate-limit.conf"
]) {
  expect(nginxTemplate.includes(required), `site.conf.template: missing ${required}`);
}
expect(cnRateLimit.includes("primary Swarm"), "CN target must explicitly document backend-side rate limiting");
expect(szRateLimit.includes("limit_req zone=console_ip burst=1 nodelay"), "SZ target: missing legacy /ip/ limit");

for (const required of [
  "TLS_MODE:-off",
  "Required TLS file is missing or unreadable",
  "ssl_protocols TLSv1.2 TLSv1.3",
  'chmod'
]) {
  expect(
    tlsEntrypoint.includes(required) || (required === "chmod" && releaseDockerfile.includes("chmod +x")),
    `TLS entrypoint: missing ${required}`
  );
}

for (const required of [
  "intelligroup-frontend:${RELEASE_TAG}",
  "replicas: 2",
  "mode: host",
  "max_replicas_per_node: 1",
  "failure_action: rollback",
  "/data/cert:/cert:ro",
  "ACCOUNT_SERVICE_UPSTREAM: http://account-service:6000",
  "AUTH_SERVICE_UPSTREAM: http://auth-service:5000",
  "IP_SERVICE_UPSTREAM: http://c3-ip-app:6800",
  "name: ${BACKEND_NETWORK}"
]) {
  expect(swarm.includes(required), `frontend-out.yml: missing ${required}`);
}

for (const required of [
  "intelligroup-frontend-sz:${RELEASE_TAG}",
  "/data/cert:/cert:ro",
  "ACCOUNT_SERVICE_UPSTREAM: http://47.254.19.92:6000",
  "AUTH_SERVICE_UPSTREAM: http://47.254.19.92:5000",
  "IP_SERVICE_UPSTREAM: http://47.254.19.92:6800",
  "WORDPRESS_UPSTREAM: http://47.254.19.92:8000",
  'restart: always'
]) {
  expect(compose.includes(required), `docker-compose.yml: missing ${required}`);
}

for (const required of [
  "BACKEND_NETWORK",
  "docker stack deploy",
  "--with-registry-auth",
  "docker compose",
  "COMPOSE_PROJECT_NAME",
  "local_https_check",
  "upstream_route_check",
  "/accsrv/information",
  "/ssosrv/oauth/token",
  "/ip/default/offers",
  "console.123proxy.cn /app/",
  "www.123proxy.cn /ip/default/offers",
  "/status-api/v1/summary",
  "../certificates/validate-certificates.sh",
  "CERT_MIN_VALID_DAYS",
  "RELEASE_TAG"
]) {
  expect(deployScript.includes(required), `deploy.sh: missing ${required}`);
}
expect(rollbackScript.includes("docker service rollback"), "rollback.sh: missing Swarm rollback");
expect(rollbackScript.includes("ROLLBACK_TAG"), "rollback.sh: missing Compose immutable-tag rollback");

for (const required of [
  "--dns dns_ali",
  "Ali_Key",
  "Ali_Secret",
  "123proxy.cn",
  "www.123proxy.cn",
  "console.123proxy.cn",
  "--fullchain-file",
  "--cron",
  "certificate_checksum"
]) {
  expect(certificateRenewScript.includes(required), `renew-certificates.sh: missing ${required}`);
}

for (const required of [
  "CERT_REMOTE_TARGETS",
  "StrictHostKeyChecking=yes",
  "SSH_IDENTITY_FILE",
  "SSH_KNOWN_HOSTS_FILE",
  "validate-certificates.sh",
  "docker kill --signal HUP"
]) {
  expect(certificateDeployScript.includes(required), `deploy-certificates.sh: missing ${required}`);
}

for (const required of [
  "openssl x509",
  "openssl pkey",
  "-checkend",
  "subjectAltName",
  "certificate and private key do not match",
  "fullchain"
]) {
  expect(certificateValidator.includes(required), `validate-certificates.sh: missing ${required}`);
}

console.log("Production deployment audit passed: dual images, managed TLS, target upstreams, rollout and rollback");
