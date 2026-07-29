import { buildComponents, deriveOverallStatus, toPublicComponent } from "./aggregate.mjs";
import { readPublicEvents } from "./events.mjs";
import { pushComponentsToKuma } from "./kuma.mjs";
import {
  probeProxy,
  probeService,
  selectHealthyProxyTarget
} from "./probe.mjs";

function integerSetting(env, name, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number.parseInt(env[name], 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function booleanSetting(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  return !["false", "0", "no", "off"].includes(String(value).toLowerCase());
}

function initialSummary(config) {
  return {
    generatedAt: null,
    overallStatus: "unknown",
    components: config.components.map((component) => ({
      id: component.id,
      status: "unknown",
      latencyMs: null,
      uptime90d: null,
      message: "等待首次监测",
      history90d: []
    })),
    incidents: [],
    maintenance: []
  };
}

export class MonitorCoordinator {
  constructor({
    config,
    store,
    env = process.env,
    publicEventsFile = "",
    logger = console,
    dependencies = {}
  }) {
    this.config = config;
    this.store = store;
    this.env = env;
    this.publicEventsFile = publicEventsFile;
    this.logger = logger;
    this.dependencies = {
      probeProxy: dependencies.probeProxy || probeProxy,
      probeService: dependencies.probeService || probeService,
      selectHealthyProxyTarget:
        dependencies.selectHealthyProxyTarget || selectHealthyProxyTarget,
      pushComponentsToKuma: dependencies.pushComponentsToKuma || pushComponentsToKuma,
      readPublicEvents: dependencies.readPublicEvents || readPublicEvents
    };
    this.settings = {
      intervalMs: integerSetting(env, "CHECK_INTERVAL_MS", 60000, { min: 20000 }),
      proxyTimeoutMs: integerSetting(env, "PROBE_TIMEOUT_MS", 10000, {
        min: 1000,
        max: 120000
      }),
      proxyAttempts: integerSetting(env, "PROBE_ATTEMPTS", 3, { min: 1, max: 10 }),
      proxyRetryDelayMs: integerSetting(env, "PROBE_RETRY_DELAY_MS", 1000, {
        min: 0,
        max: 30000
      }),
      serviceTimeoutMs: integerSetting(env, "SERVICE_TIMEOUT_MS", 8000, {
        min: 1000,
        max: 120000
      }),
      kumaTimeoutMs: integerSetting(env, "KUMA_PUSH_TIMEOUT_MS", 5000, {
        min: 1000,
        max: 30000
      }),
      preflight: booleanSetting(env.PROBE_PREFLIGHT, true)
    };
    this.credentials = {
      username: String(env.PROXY_USERNAME || ""),
      password: String(env.PROXY_PASSWORD || "")
    };
    this.summary = initialSummary(config);
    this.completedCycle = false;
    this.running = false;
    this.timer = null;
  }

  async initialize() {
    await this.store.load();
  }

  getSummary() {
    return this.summary;
  }

  isReady() {
    return this.completedCycle;
  }

  async runCycle() {
    if (this.running) return this.summary;
    this.running = true;
    const generatedAt = new Date().toISOString();

    try {
      const eventsPromise = this.dependencies.readPublicEvents(this.publicEventsFile)
        .catch((error) => {
          this.logger.error(`Unable to read public events: ${error.message}`);
          return { incidents: [], maintenance: [], componentOverrides: {} };
        });
      const serviceResultsPromise = Promise.all(
        this.config.serviceChecks.map((check) => (
          this.dependencies.probeService(check, {
            timeoutMs: this.settings.serviceTimeoutMs
          })
        ))
      );
      const target = await this.dependencies.selectHealthyProxyTarget(
        this.config.proxyTargets,
        {
          timeoutMs: this.settings.serviceTimeoutMs,
          preflight: this.settings.preflight
        }
      );

      const proxyResultsPromise = target.url
        ? Promise.all(this.config.proxyChecks.map((check) => (
            this.dependencies.probeProxy(check, target.url, this.credentials, {
              timeoutMs: this.settings.proxyTimeoutMs,
              attempts: this.settings.proxyAttempts,
              retryDelayMs: this.settings.proxyRetryDelayMs
            })
          )))
        : Promise.resolve(this.config.proxyChecks.map((check) => ({
            id: check.id,
            ok: null,
            latencyMs: null,
            attempts: 0,
            error: target.error
          })));

      const [events, serviceResults, proxyResults] = await Promise.all([
        eventsPromise,
        serviceResultsPromise,
        proxyResultsPromise
      ]);

      let components = buildComponents(this.config, {
        proxyResults,
        serviceResults,
        overrides: events.componentOverrides
      });

      try {
        await this.store.record(components, generatedAt);
      } catch (error) {
        this.logger.error(`Unable to persist status history: ${error.message}`);
      }
      components = this.store.decorate(components);

      this.summary = {
        generatedAt,
        overallStatus: deriveOverallStatus(components),
        components: components.map(toPublicComponent),
        incidents: events.incidents,
        maintenance: events.maintenance
      };
      this.completedCycle = true;

      const pushResults = await this.dependencies.pushComponentsToKuma(components, {
        env: this.env,
        timeoutMs: this.settings.kumaTimeoutMs
      });
      const failedPushes = pushResults.filter(
        (result) => !result.pushed && result.reason !== "token is not configured"
      );
      if (failedPushes.length) {
        this.logger.warn(
          `Kuma push failed for: ${failedPushes.map((item) => item.id).join(", ")}`
        );
      }

      const states = components.map((component) => `${component.id}=${component.status}`).join(" ");
      this.logger.info(`Status cycle completed: ${states}`);
      return this.summary;
    } finally {
      this.running = false;
    }
  }

  start() {
    const tick = async () => {
      try {
        await this.runCycle();
      } catch (error) {
        this.logger.error(`Status cycle failed: ${error.stack || error.message}`);
      } finally {
        this.timer = setTimeout(tick, this.settings.intervalMs);
        this.timer.unref?.();
      }
    };
    void tick();
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
  }
}

