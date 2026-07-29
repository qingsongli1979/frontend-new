import assert from "node:assert/strict";
import test from "node:test";
import { buildComponents, deriveOverallStatus } from "../src/aggregate.mjs";

const config = {
  proxyChecks: [
    { id: "a", product: "proxy-tunnel", region: "gateway-us" },
    { id: "b", product: "proxy-tunnel", region: "gateway-us" },
    { id: "c", product: "proxy-tunnel", region: "gateway-asia" }
  ],
  components: [
    {
      id: "proxy-tunnel",
      name: "隧道代理",
      kind: "proxy-group",
      selector: "product",
      value: "proxy-tunnel",
      pushTokenEnv: "TOKEN"
    }
  ]
};

function proxyResults(values) {
  return ["a", "b", "c"].map((id, index) => ({
    id,
    ok: values[index],
    latencyMs: values[index] ? 20 + index : null,
    error: values[index] ? "" : "failed"
  }));
}

test("proxy groups expose four useful availability states", () => {
  const statuses = [
    [[true, true, true], "operational"],
    [[true, true, false], "degraded"],
    [[true, false, false], "partial_outage"],
    [[false, false, false], "major_outage"],
    [[null, null, null], "unknown"]
  ];

  for (const [values, expected] of statuses) {
    const [component] = buildComponents(config, { proxyResults: proxyResults(values) });
    assert.equal(component.status, expected);
  }
});

test("an unknown component lowers an otherwise healthy overall state", () => {
  assert.equal(deriveOverallStatus([
    { status: "operational" },
    { status: "unknown" }
  ]), "degraded");
  assert.equal(deriveOverallStatus([
    { status: "unknown" },
    { status: "unknown" }
  ]), "unknown");
});

