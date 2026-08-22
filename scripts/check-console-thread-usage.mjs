import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  normalizeRealtimeThreads,
  normalizeThreadHistory,
  standardConcurrencyCapacity
} from "../console/app/thread-usage.js";

assert.equal(normalizeRealtimeThreads("17"), 17);
assert.equal(normalizeRealtimeThreads({ current: 23 }), 23);
assert.equal(normalizeRealtimeThreads({ data: { conns: 9 } }), 9);
assert.equal(normalizeRealtimeThreads("not-a-number"), null);

const observedAt = Date.UTC(2026, 7, 22, 12, 3, 20);
const startTime = Date.UTC(2026, 7, 22, 12, 0, 0);
const history = normalizeThreadHistory({
  current: 8,
  observedAt,
  startTime,
  intervalSeconds: 60,
  samples: [
    { timestamp: startTime, conns: 2 },
    { timestamp: startTime + 60000, conns: 4 },
    { timestamp: startTime + 180000, conns: 10 }
  ]
});

assert.equal(history.current, 8);
assert.equal(history.samples.length, 4);
assert.equal(history.samples[2].conns, null, "missing minute must remain a gap, not become zero");
assert.equal(history.peak, 10);
assert.equal(history.average, 16 / 3);

const capacity = standardConcurrencyCapacity([
  { chargeType: "tunnelIp", total: 100, overTime: false },
  { chargeType: "tunnelIp", total: 250, overTime: false },
  { chargeType: "tunnelIp", total: 2000, overTime: false },
  { chargeType: "tunnelIp", total: 50, overTime: true },
  { chargeType: "trafficIp", total: 900, overTime: false }
]);
assert.equal(capacity, 350, "only active standard concurrency packages contribute capacity");

const html = await readFile(new URL("../console/app/index.html", import.meta.url), "utf8");
const products = await readFile(new URL("../console/app/products.js", import.meta.url), "utf8");
assert.match(html, /id="threadUsagePanel"/);
assert.match(html, /id="threadHistoryChart"/);
assert.match(products, /\/ip\/scrape\/threads\/history\?hours=12/);
assert.match(products, /THREAD_REALTIME_INTERVAL_MS = 5000/);
assert.match(products, /visibilitychange/);

console.log("Console thread usage audit passed: realtime, capacity, 12-hour gaps and polling lifecycle");
