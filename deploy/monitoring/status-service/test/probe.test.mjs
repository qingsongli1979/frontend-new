import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { probeProxy, probeService } from "../src/probe.mjs";

async function fakeProxy({ username, password }) {
  const expected = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  const server = http.createServer((request, response) => {
    if (request.headers["proxy-authorization"] !== expected) {
      response.writeHead(407, { "Content-Type": "text/plain" });
      response.end("proxy authentication required");
      return;
    }
    assert.equal(request.url, "http://myip.ipip.net/");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("当前 IP：203.0.113.10");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    port: server.address().port,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

test("proxy probe sends Basic proxy authentication and checks real response data", async () => {
  const proxy = await fakeProxy({ username: "monitor-user", password: "monitor-pass" });
  try {
    const result = await probeProxy(
      { id: "test-proxy", host: "127.0.0.1", port: proxy.port },
      "http://myip.ipip.net",
      { username: "monitor-user", password: "monitor-pass" },
      { attempts: 1, timeoutMs: 1000 }
    );
    assert.equal(result.ok, true);
    assert.equal(result.attempts, 1);
    assert.ok(Number.isFinite(result.latencyMs));
  } finally {
    await proxy.close();
  }
});

test("proxy probe treats authentication rejection as failure", async () => {
  const proxy = await fakeProxy({ username: "monitor-user", password: "monitor-pass" });
  try {
    const result = await probeProxy(
      { id: "test-proxy", host: "127.0.0.1", port: proxy.port },
      "http://myip.ipip.net",
      { username: "wrong", password: "wrong" },
      { attempts: 1, timeoutMs: 1000 }
    );
    assert.equal(result.ok, false);
    assert.match(result.error, /HTTP 407/);
  } finally {
    await proxy.close();
  }
});

test("service probe validates bearer authentication and JSON response", async () => {
  const server = http.createServer((request, response) => {
    if (request.headers.authorization !== "Bearer service-health-token") {
      response.writeHead(401, { "Content-Type": "application/json" });
      response.end('{"error":"unauthorized"}');
      return;
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end('{"status":"ok"}');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const result = await probeService({
      id: "console",
      url: `http://127.0.0.1:${server.address().port}/accsrv/information`,
      expectJson: true,
      auth: {
        type: "bearer",
        tokenEnv: "CONSOLE_HEALTH_TOKEN",
        token: "service-health-token"
      }
    }, { timeoutMs: 1000 });
    assert.equal(result.ok, true);
    assert.ok(Number.isFinite(result.latencyMs));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("service probe reports missing bearer token as unknown", async () => {
  const result = await probeService({
    id: "api",
    url: "https://console.123proxy.cn/ip/mytraffic",
    expectJson: true,
      auth: {
        type: "bearer",
        tokenEnv: "API_HEALTH_TOKEN",
        token: ""
    }
  });
  assert.equal(result.ok, null);
  assert.match(result.error, /API_HEALTH_TOKEN/);
});

test("service probe rejects an HTML fallback from a health endpoint", async () => {
  const server = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("<!doctype html><title>Homepage</title>");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const result = await probeService({
      id: "console",
      url: `http://127.0.0.1:${server.address().port}/healthz`,
      expectJson: false,
      expectText: "ok",
      auth: null
    }, { timeoutMs: 1000 });
    assert.equal(result.ok, false);
    assert.match(result.error, /health marker/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
