import crypto from "node:crypto";
import http from "node:http";

function writeJson(response, statusCode, payload) {
  const body = `${JSON.stringify(payload)}\n`;
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  });
  response.end(body);
}

function writeText(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(body);
}

function tokenMatches(request, expectedToken) {
  if (!expectedToken) return false;
  const supplied = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const expectedBuffer = Buffer.from(expectedToken);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function metrics(summary) {
  const lines = [
    "# HELP proxy_status_component_up Component status: 1 operational, 0 affected, -1 unknown.",
    "# TYPE proxy_status_component_up gauge"
  ];
  for (const component of summary.components) {
    const value = component.status === "operational"
      ? 1
      : component.status === "unknown"
        ? -1
        : 0;
    lines.push(`proxy_status_component_up{id="${component.id}"} ${value}`);
    if (Number.isFinite(component.latencyMs)) {
      lines.push(`proxy_status_component_latency_ms{id="${component.id}"} ${component.latencyMs}`);
    }
    if (Number.isFinite(component.uptime90d)) {
      lines.push(`proxy_status_component_uptime_90d{id="${component.id}"} ${component.uptime90d}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

export function parseListenAddress(value = "0.0.0.0:8080") {
  const match = String(value).match(/^(.*):(\d+)$/);
  if (!match) throw new Error("HTTP_LISTEN must use host:port format");
  const port = Number.parseInt(match[2], 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("HTTP_LISTEN port must be between 1 and 65535");
  }
  return { host: match[1] || "0.0.0.0", port };
}

export function createStatusServer({
  coordinator,
  internalApiToken = "",
  logger = console
}) {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://status-service.local");

    if (request.method === "GET" && url.pathname === "/healthz") {
      writeText(response, 200, "ok\n");
      return;
    }

    if (request.method === "GET" && url.pathname === "/readyz") {
      writeText(response, coordinator.isReady() ? 200 : 503, coordinator.isReady() ? "ready\n" : "waiting\n");
      return;
    }

    if (request.method === "GET" && url.pathname === "/v1/summary") {
      writeJson(response, 200, coordinator.getSummary());
      return;
    }

    if (request.method === "GET" && url.pathname === "/metrics") {
      writeText(
        response,
        200,
        metrics(coordinator.getSummary()),
        "text/plain; version=0.0.4; charset=utf-8"
      );
      return;
    }

    if (request.method === "POST" && url.pathname === "/v1/run") {
      if (!tokenMatches(request, internalApiToken)) {
        writeJson(response, 404, { error: "not found" });
        return;
      }
      try {
        writeJson(response, 200, await coordinator.runCycle());
      } catch (error) {
        logger.error(`Manual status cycle failed: ${error.message}`);
        writeJson(response, 500, { error: "status cycle failed" });
      }
      return;
    }

    writeJson(response, 404, { error: "not found" });
  });
}

