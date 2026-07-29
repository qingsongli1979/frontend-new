import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadMonitorConfig, PUBLIC_COMPONENT_IDS } from "../src/config.mjs";

const configPath = fileURLToPath(new URL("../../monitors.json", import.meta.url));

test("production monitor map covers all public components without credentials", async () => {
  const config = await loadMonitorConfig(configPath, {
    WEBSITE_CHECK_URL: "https://www.123proxy.cn/healthz",
    CONSOLE_CHECK_URL: "https://console.123proxy.cn/healthz",
    API_CHECK_URL: "https://console.123proxy.cn/ip/mytraffic",
    API_HEALTH_TOKEN: "test-api-token"
  });

  assert.equal(config.proxyChecks.length, 9);
  assert.deepEqual(config.components.map((item) => item.id), PUBLIC_COMPONENT_IDS);
  assert.equal(
    config.proxyChecks.filter((item) => item.product === "proxy-tunnel").length,
    3
  );
  assert.equal(
    config.proxyChecks.filter((item) => item.product === "proxy-residential").length,
    3
  );
  assert.equal(
    config.proxyChecks.filter((item) => item.product === "proxy-unlimited").length,
    3
  );
  assert.ok(config.proxyChecks.every((item) => !item.host.includes("@")));
  const consoleCheck = config.serviceChecks.find((item) => item.id === "console");
  const apiCheck = config.serviceChecks.find((item) => item.id === "api");
  assert.equal(consoleCheck.auth, null);
  assert.equal(consoleCheck.expectJson, false);
  assert.equal(consoleCheck.expectText, "ok");
  assert.equal(apiCheck.auth.token, "test-api-token");
  assert.equal(apiCheck.expectJson, true);
});
