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

const environment = await read("deploy/certificates/certificates.env.example");
const service = await read("deploy/certificates/systemd/123proxy-certificates.service");
const timer = await read("deploy/certificates/systemd/123proxy-certificates.timer");
const renew = await read("deploy/certificates/renew-certificates.sh");
const distribute = await read("deploy/certificates/deploy-certificates.sh");
const validate = await read("deploy/certificates/validate-certificates.sh");

expect(
  environment.includes("ACME_BIN=/var/lib/acme-123proxy/acme.sh"),
  "Certificate environment must run the acme.sh installation managed under ACME_HOME"
);
expect(
  !environment.includes("/root/.acme.sh"),
  "Certificate environment must not conflict with systemd ProtectHome"
);
expect(
  environment.includes("replace-with-aliyun-ram-access-key-id")
    && environment.includes("replace-with-aliyun-ram-access-key-secret"),
  "Certificate environment must contain placeholders, not real Aliyun credentials"
);
expect(
  service.includes("ProtectSystem=strict")
    && service.includes("ProtectHome=true")
    && service.includes("UMask=0077")
    && service.includes("StateDirectory=acme-123proxy 123proxy-certificates")
    && service.includes("ReadWritePaths=/data/cert"),
  "Certificate service is missing required filesystem hardening"
);
expect(timer.includes("Persistent=true"), "Certificate timer must catch up after downtime");
expect(timer.includes("OnCalendar=daily"), "Certificate renewal must be checked daily");

for (const [file, source, tokens] of [
  ["renew-certificates.sh", renew, ["--dns dns_ali", "--keylength ec-256", "--cron"]],
  ["deploy-certificates.sh", distribute, ["StrictHostKeyChecking=yes", "docker kill --signal HUP"]],
  ["validate-certificates.sh", validate, ["-checkend", "subjectAltName", "openssl pkey"]]
]) {
  expect(source.includes("set -Eeuo pipefail"), `${file}: strict Bash mode is required`);
  for (const token of tokens) {
    expect(source.includes(token), `${file}: missing ${token}`);
  }
}

console.log("Certificate deployment audit passed: Aliyun DNS-01, daily renewal, validation and node reload");
