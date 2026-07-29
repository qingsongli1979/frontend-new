import http from "node:http";
import https from "node:https";
import { performance } from "node:perf_hooks";

const MAX_BODY_BYTES = 64 * 1024;

function sleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function responseResult(response, startedAt, resolve, reject) {
  const chunks = [];
  let received = 0;

  response.on("data", (chunk) => {
    received += chunk.length;
    if (received <= MAX_BODY_BYTES) chunks.push(chunk);
  });
  response.on("end", () => {
    const latencyMs = Math.max(0, Math.round(performance.now() - startedAt));
    const body = Buffer.concat(chunks).toString("utf8");
    if (response.statusCode < 200 || response.statusCode >= 400) {
      reject(new Error(`HTTP ${response.statusCode}`));
      return;
    }
    if (body.trim() === "") {
      reject(new Error("empty response body"));
      return;
    }
    resolve({ statusCode: response.statusCode, body, latencyMs });
  });
  response.on("error", reject);
}

export function requestDirect(urlValue, { timeoutMs = 8000, headers = {} } = {}) {
  const url = new URL(urlValue);
  const client = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    const request = client.request(url, {
      method: "GET",
      headers: {
        Accept: "text/plain, application/json;q=0.9, */*;q=0.8",
        "User-Agent": "123Proxy-Status-Probe/1.0",
        Connection: "close",
        ...headers
      }
    }, (response) => responseResult(response, startedAt, resolve, reject));

    request.setTimeout(timeoutMs, () => request.destroy(new Error("request timed out")));
    request.on("error", reject);
    request.end();
  });
}

export function requestViaHttpProxyOnce(endpoint, targetUrl, credentials, {
  timeoutMs = 10000
} = {}) {
  const target = new URL(targetUrl);
  if (target.protocol !== "http:") {
    throw new Error("proxy target must use http");
  }

  const authorization = Buffer.from(
    `${credentials.username}:${credentials.password}`,
    "utf8"
  ).toString("base64");

  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    const request = http.request({
      hostname: endpoint.host,
      port: endpoint.port,
      method: "GET",
      path: target.href,
      headers: {
        Host: target.host,
        Accept: "text/plain, application/json;q=0.9, */*;q=0.8",
        "User-Agent": "123Proxy-Status-Probe/1.0",
        "Proxy-Authorization": `Basic ${authorization}`,
        "Proxy-Connection": "close",
        Connection: "close"
      }
    }, (response) => responseResult(response, startedAt, resolve, reject));

    request.setTimeout(timeoutMs, () => request.destroy(new Error("proxy request timed out")));
    request.on("error", reject);
    request.end();
  });
}

export async function probeProxy(endpoint, targetUrl, credentials, {
  timeoutMs = 10000,
  attempts = 3,
  retryDelayMs = 1000
} = {}) {
  if (!credentials.username || !credentials.password) {
    return {
      id: endpoint.id,
      ok: null,
      latencyMs: null,
      attempts: 0,
      error: "monitor credentials are not configured"
    };
  }

  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await requestViaHttpProxyOnce(endpoint, targetUrl, credentials, { timeoutMs });
      return {
        id: endpoint.id,
        ok: true,
        latencyMs: result.latencyMs,
        attempts: attempt,
        error: ""
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(retryDelayMs);
    }
  }

  return {
    id: endpoint.id,
    ok: false,
    latencyMs: null,
    attempts,
    error: lastError?.message || "proxy check failed"
  };
}

export async function selectHealthyProxyTarget(targetUrls, {
  timeoutMs = 8000,
  preflight = true
} = {}) {
  if (!preflight) {
    return { url: targetUrls[0], error: "" };
  }

  const errors = [];
  for (const targetUrl of targetUrls) {
    try {
      await requestDirect(targetUrl, { timeoutMs });
      return { url: targetUrl, error: "" };
    } catch (error) {
      errors.push(error.message);
    }
  }
  return {
    url: "",
    error: `all probe targets are unavailable (${errors.join("; ")})`
  };
}

export async function probeService(check, { timeoutMs = 8000 } = {}) {
  if (!check.url) {
    return {
      id: check.id,
      ok: null,
      latencyMs: null,
      error: `${check.urlEnv || "service URL"} is not configured`
    };
  }

  if (check.auth?.type === "bearer" && !check.auth.token) {
    return {
      id: check.id,
      ok: null,
      latencyMs: null,
      error: `${check.auth.tokenEnv} is not configured`
    };
  }

  try {
    const headers = check.auth?.type === "bearer"
      ? { Authorization: `Bearer ${check.auth.token}` }
      : {};
    const result = await requestDirect(check.url, { timeoutMs, headers });
    if (check.expectJson) {
      try {
        JSON.parse(result.body);
      } catch {
        throw new Error("response is not valid JSON");
      }
    }
    if (check.expectText && result.body.trim() !== check.expectText) {
      throw new Error("response does not match the expected health marker");
    }
    return {
      id: check.id,
      ok: true,
      latencyMs: result.latencyMs,
      error: ""
    };
  } catch (error) {
    return {
      id: check.id,
      ok: false,
      latencyMs: null,
      error: error.message
    };
  }
}
