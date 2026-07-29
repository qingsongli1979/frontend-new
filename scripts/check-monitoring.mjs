import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectFile(file) {
  const fileStat = await stat(path.join(rootDir, file));
  expect(fileStat.isFile(), `${file}: expected a file`);
}

const requiredFiles = [
  "deploy/monitoring/compose.yaml",
  "deploy/monitoring/.env.example",
  "deploy/monitoring/.gitignore",
  "deploy/monitoring/monitors.json",
  "deploy/monitoring/public-events.json",
  "deploy/monitoring/README.md",
  "deploy/monitoring/status-service/Dockerfile",
  "deploy/monitoring/status-service/package.json",
  "deploy/monitoring/status-service/src/main.mjs",
  "deploy/monitoring/status-service/src/probe.mjs",
  "deploy/monitoring/status-service/src/aggregate.mjs",
  "deploy/monitoring/status-service/src/server.mjs"
];

for (const file of requiredFiles) await expectFile(file);

const monitorPath = path.join(rootDir, "deploy", "monitoring", "monitors.json");
const monitorText = await readFile(monitorPath, "utf8");
const monitorConfig = JSON.parse(monitorText);

expect(monitorConfig.proxyChecks.length === 9, "monitors.json: expected 9 real proxy checks");
expect(
  monitorConfig.proxyChecks.every((check) => (
    typeof check.host === "string" &&
    Number.isInteger(check.port) &&
    !check.host.includes("@") &&
    !Object.hasOwn(check, "username") &&
    !Object.hasOwn(check, "password")
  )),
  "monitors.json: credentials must not be stored with endpoints"
);

const serviceChecks = new Map(
  monitorConfig.serviceChecks.map((check) => [check.id, check])
);
expect(
  serviceChecks.get("console")?.defaultUrl ===
    "https://console.123proxy.cn/healthz",
  "monitors.json: console health check must use the public liveness endpoint"
);
expect(
  !serviceChecks.get("console")?.auth,
  "monitors.json: console liveness check must not depend on an expiring login token"
);
for (const id of ["website", "console"]) {
  expect(
    serviceChecks.get(id)?.expectText === "ok",
    `monitors.json: ${id} health check must reject an HTML fallback response`
  );
}
expect(
  serviceChecks.get("api")?.defaultUrl ===
    "https://console.123proxy.cn/ip/mytraffic",
  "monitors.json: API health check must use the authenticated traffic endpoint"
);
const apiCheck = serviceChecks.get("api");
expect(apiCheck?.auth?.type === "bearer", "monitors.json: API must use bearer auth");
expect(
  apiCheck?.auth?.tokenEnv === "API_HEALTH_TOKEN",
  "monitors.json: API must read API_HEALTH_TOKEN from the environment"
);
expect(apiCheck?.expectJson === true, "monitors.json: API must validate JSON");

const expectedProductCounts = {
  "proxy-tunnel": 3,
  "proxy-residential": 3,
  "proxy-unlimited": 3
};
for (const [product, count] of Object.entries(expectedProductCounts)) {
  expect(
    monitorConfig.proxyChecks.filter((check) => check.product === product).length === count,
    `monitors.json: ${product} must have ${count} checks`
  );
}

const expectedComponents = [
  "proxy-tunnel",
  "proxy-residential",
  "proxy-unlimited",
  "gateway-us",
  "gateway-eu",
  "gateway-asia",
  "website",
  "console",
  "api"
];
expect(
  JSON.stringify(monitorConfig.components.map((component) => component.id)) ===
    JSON.stringify(expectedComponents),
  "monitors.json: public component order does not match the status API contract"
);

const compose = await readFile(
  path.join(rootDir, "deploy", "monitoring", "compose.yaml"),
  "utf8"
);
expect(
  compose.includes('"127.0.0.1:${KUMA_PORT:-3001}:3001"'),
  "compose.yaml: Kuma admin UI must bind to localhost"
);
expect(
  compose.includes("STATUS_API_UPSTREAM") === false,
  "compose.yaml: website runtime variables do not belong in the monitoring stack"
);

const envExample = await readFile(
  path.join(rootDir, "deploy", "monitoring", ".env.example"),
  "utf8"
);
expect(
  envExample.includes("PROXY_PASSWORD=replace-with-rotated-password"),
  ".env.example: proxy password must remain a placeholder"
);
expect(
  !envExample.includes("CONSOLE_HEALTH_TOKEN=") &&
    envExample.includes("API_HEALTH_TOKEN=replace-with-api-monitor-token"),
  ".env.example: only the API monitor should require a bearer token"
);
expect(
  !/qyapi\.weixin\.qq\.com\/cgi-bin\/webhook\/send\?key=[0-9a-f-]{20,}/i.test(envExample),
  ".env.example: WeCom webhook secret detected"
);

console.log("Monitoring audit passed: endpoints, public components, secret handling and local Kuma binding");
