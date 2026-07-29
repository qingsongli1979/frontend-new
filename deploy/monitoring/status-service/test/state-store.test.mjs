import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { StatusStateStore } from "../src/state-store.mjs";

test("state store persists daily history and calculates probe availability", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "status-store-"));
  const filePath = path.join(directory, "state.json");

  try {
    const store = new StatusStateStore(filePath);
    await store.load();
    await store.record([{
      id: "proxy-tunnel",
      status: "degraded",
      _availabilityPassed: 2,
      _availabilityTotal: 3
    }], "2026-07-29T01:00:00.000Z");

    const [component] = store.decorate([{ id: "proxy-tunnel", status: "degraded" }]);
    assert.deepEqual(component.history90d, ["degraded"]);
    assert.equal(component.uptime90d, 66.667);
    assert.equal(JSON.parse(await readFile(filePath, "utf8")).version, 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

