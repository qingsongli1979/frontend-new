import assert from "node:assert/strict";
import test from "node:test";
import { createStatusServer } from "../src/server.mjs";

test("public summary endpoint returns the website contract without internal data", async () => {
  const summary = {
    generatedAt: "2026-07-29T01:00:00.000Z",
    overallStatus: "operational",
    components: [{
      id: "proxy-tunnel",
      status: "operational",
      latencyMs: 42,
      uptime90d: 99.99,
      message: "最近检测正常",
      history90d: ["operational"]
    }],
    incidents: [],
    maintenance: []
  };
  const coordinator = {
    isReady: () => true,
    getSummary: () => summary,
    runCycle: async () => summary
  };
  const server = createStatusServer({ coordinator });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/v1/summary`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), summary);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

