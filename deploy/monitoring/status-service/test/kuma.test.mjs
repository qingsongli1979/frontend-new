import assert from "node:assert/strict";
import test from "node:test";
import { pushComponentToKuma } from "../src/kuma.mjs";

test("Kuma push maps detailed public states to a safe binary heartbeat", async () => {
  let requestedUrl = null;
  const result = await pushComponentToKuma({
    id: "proxy-tunnel",
    status: "degraded",
    latencyMs: 81,
    message: "部分节点异常",
    _internalMessage: "2/3 checks passed; affected: tun-us-01",
    _pushTokenEnv: "TOKEN_ENV"
  }, {
    env: {
      TOKEN_ENV: "generated-token",
      KUMA_PUSH_BASE_URL: "http://uptime-kuma:3001/api/push"
    },
    fetchImpl: async (url) => {
      requestedUrl = new URL(url);
      return { ok: true, status: 200 };
    }
  });

  assert.equal(result.pushed, true);
  assert.equal(requestedUrl.pathname, "/api/push/generated-token");
  assert.equal(requestedUrl.searchParams.get("status"), "down");
  assert.equal(requestedUrl.searchParams.get("ping"), "81");
  assert.match(requestedUrl.searchParams.get("msg"), /tun-us-01/);
});

