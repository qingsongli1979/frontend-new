import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadMonitorConfig } from "../src/config.mjs";
import { MonitorCoordinator } from "../src/coordinator.mjs";
import { StatusStateStore } from "../src/state-store.mjs";

const configPath = fileURLToPath(new URL("../../monitors.json", import.meta.url));

test("a full monitoring cycle produces nine safe public components", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "status-cycle-"));
  try {
    const env = {
      PROXY_USERNAME: "monitor-user",
      PROXY_PASSWORD: "monitor-pass",
      WEBSITE_CHECK_URL: "https://www.123proxy.cn/healthz",
      CONSOLE_CHECK_URL: "https://console.123proxy.cn/healthz",
      API_CHECK_URL: "https://console.123proxy.cn/ip/mytraffic",
      API_HEALTH_TOKEN: "test-api-token"
    };
    const config = await loadMonitorConfig(configPath, env);
    const pushed = [];
    const coordinator = new MonitorCoordinator({
      config,
      env,
      store: new StatusStateStore(path.join(directory, "state.json")),
      logger: { info() {}, warn() {}, error() {} },
      dependencies: {
        selectHealthyProxyTarget: async () => ({
          url: "http://myip.ipip.net/",
          error: ""
        }),
        probeProxy: async (check) => ({
          id: check.id,
          ok: true,
          latencyMs: 40,
          attempts: 1,
          error: ""
        }),
        probeService: async (check) => ({
          id: check.id,
          ok: true,
          latencyMs: 20,
          error: ""
        }),
        readPublicEvents: async () => ({
          incidents: [],
          maintenance: [],
          componentOverrides: {}
        }),
        pushComponentsToKuma: async (components) => {
          pushed.push(...components.map((component) => component.id));
          return components.map((component) => ({
            id: component.id,
            pushed: true,
            reason: ""
          }));
        }
      }
    });
    await coordinator.initialize();
    const summary = await coordinator.runCycle();

    assert.equal(summary.overallStatus, "operational");
    assert.equal(summary.components.length, 9);
    assert.equal(pushed.length, 9);
    assert.ok(summary.components.every((component) => component.status === "operational"));
    assert.ok(summary.components.every((component) => !Object.hasOwn(component, "host")));
    assert.ok(summary.components.every((component) => !Object.hasOwn(component, "_pushTokenEnv")));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
