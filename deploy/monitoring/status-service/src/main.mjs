import { loadMonitorConfig } from "./config.mjs";
import { MonitorCoordinator } from "./coordinator.mjs";
import { createStatusServer, parseListenAddress } from "./server.mjs";
import { StatusStateStore } from "./state-store.mjs";

const configFile = process.env.CONFIG_FILE || "/config/monitors.json";
const publicEventsFile = process.env.PUBLIC_EVENTS_FILE || "/config/public-events.json";
const stateFile = process.env.STATE_FILE || "/data/status-state.json";
const listen = parseListenAddress(process.env.HTTP_LISTEN);

const config = await loadMonitorConfig(configFile);
const store = new StatusStateStore(stateFile);
const coordinator = new MonitorCoordinator({
  config,
  store,
  publicEventsFile
});
await coordinator.initialize();

const server = createStatusServer({
  coordinator,
  internalApiToken: String(process.env.INTERNAL_API_TOKEN || "")
});

server.listen(listen.port, listen.host, () => {
  console.info(`123Proxy status service listening on ${listen.host}:${listen.port}`);
  coordinator.start();
});

function shutdown(signal) {
  console.info(`Received ${signal}; shutting down`);
  coordinator.stop();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

