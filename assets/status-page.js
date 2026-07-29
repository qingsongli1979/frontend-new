(() => {
  "use strict";

  const root = document.querySelector("[data-status-page]");
  if (!root) return;

  const componentDefinitions = [
    { id: "proxy-tunnel", aliases: ["tunnel", "scraping-rotating-proxy"] },
    { id: "proxy-residential", aliases: ["residential", "residential-rotating-proxy"] },
    { id: "proxy-unlimited", aliases: ["unlimited", "unlimited-residential"] },
    { id: "gateway-us", aliases: ["us", "us-gateway", "gateway-usa"] },
    { id: "gateway-eu", aliases: ["eu", "eu-gateway", "gateway-europe"] },
    { id: "gateway-asia", aliases: ["asia", "asia-gateway", "gateway-apac"] },
    { id: "website", aliases: ["web", "www", "homepage"] },
    { id: "console", aliases: ["dashboard", "user-console"] },
    { id: "api", aliases: ["public-api", "platform-api"] }
  ];

  const statusMeta = {
    operational: {
      label: "运行正常",
      overallTitle: "所有服务运行正常",
      overallDescription: "代理产品、区域网关与平台服务均未发现异常。"
    },
    degraded: {
      label: "性能下降",
      overallTitle: "部分服务性能下降",
      overallDescription: "部分请求可能出现延迟升高或成功率下降。"
    },
    partial_outage: {
      label: "部分中断",
      overallTitle: "部分服务中断",
      overallDescription: "部分组件不可用，技术团队正在处理。"
    },
    major_outage: {
      label: "服务中断",
      overallTitle: "多项服务中断",
      overallDescription: "核心服务受到影响，技术团队正在紧急处理。"
    },
    maintenance: {
      label: "维护中",
      overallTitle: "计划维护进行中",
      overallDescription: "部分服务处于计划维护窗口。"
    },
    unknown: {
      label: "暂无数据",
      overallTitle: "监测数据暂不可用",
      overallDescription: "暂时无法连接状态服务，请稍后刷新。"
    }
  };

  const severity = {
    operational: 0,
    maintenance: 1,
    degraded: 2,
    partial_outage: 3,
    major_outage: 4,
    unknown: -1
  };

  const config = {
    endpoint: "/status-api/v1/summary",
    refreshIntervalMs: 60000,
    requestTimeoutMs: 8000,
    ...(window.__STATUS_CONFIG__ || {})
  };

  const elements = {
    overall: document.querySelector("[data-overall-status]"),
    overallTitle: document.querySelector("[data-overall-title]"),
    overallDescription: document.querySelector("[data-overall-description]"),
    updated: document.querySelector("[data-status-updated]"),
    refresh: document.querySelector("[data-status-refresh]"),
    sourceNote: document.querySelector("[data-status-source-note]"),
    total: document.querySelector("[data-summary-total]"),
    operational: document.querySelector("[data-summary-operational]"),
    affected: document.querySelector("[data-summary-affected]"),
    incidents: document.querySelector("[data-status-incidents]"),
    maintenance: document.querySelector("[data-status-maintenance]")
  };

  let activeController = null;
  let refreshTimer = null;
  let hasLiveData = false;

  function normalizeStatus(value) {
    const normalized = String(value || "").trim().toLowerCase().replaceAll("-", "_");
    const aliases = {
      up: "operational",
      ok: "operational",
      healthy: "operational",
      normal: "operational",
      warning: "degraded",
      slow: "degraded",
      partial: "partial_outage",
      down: "major_outage",
      outage: "major_outage",
      scheduled: "maintenance",
      unavailable: "unknown"
    };
    const result = aliases[normalized] || normalized;
    return Object.hasOwn(statusMeta, result) ? result : "unknown";
  }

  function componentId(value) {
    const candidate = String(value || "").trim().toLowerCase();
    const definition = componentDefinitions.find((item) => (
      item.id === candidate || item.aliases.includes(candidate)
    ));
    return definition?.id || candidate;
  }

  function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatLatency(value) {
    const latency = toNumber(value);
    if (latency === null) return "--";
    return `${Math.max(0, Math.round(latency)).toLocaleString("zh-CN")} ms`;
  }

  function formatUptime(value) {
    const uptime = toNumber(value);
    if (uptime === null) return "--";
    return `${Math.min(100, Math.max(0, uptime)).toFixed(uptime >= 99 ? 3 : 2)}%`;
  }

  function formatDateTime(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date);
  }

  function historyValues(component) {
    const source = component.history90d || component.history || component.dailyStatus || [];
    if (!Array.isArray(source) || source.length === 0) return Array(90).fill("unknown");
    const normalized = source.slice(-90).map((entry) => (
      normalizeStatus(typeof entry === "object" ? entry.status : entry)
    ));
    return [...Array(Math.max(0, 90 - normalized.length)).fill("unknown"), ...normalized];
  }

  function renderHistory(container, values) {
    const fragment = document.createDocumentFragment();
    values.forEach((status, index) => {
      const segment = document.createElement("i");
      segment.className = `is-${status}`;
      segment.title = `第 ${index + 1} 天：${statusMeta[status].label}`;
      fragment.append(segment);
    });
    container.replaceChildren(fragment);
  }

  function updateComponent(component) {
    const id = componentId(component.id || component.key || component.name);
    const container = document.querySelector(`[data-status-component="${CSS.escape(id)}"]`);
    if (!container) return null;

    const status = normalizeStatus(component.status);
    const badge = container.querySelector("[data-component-status]");
    const endpoint = container.querySelector("[data-component-endpoint]");
    const latency = container.querySelector("[data-component-latency]");
    const uptime = container.querySelector("[data-component-uptime]");
    const message = container.querySelector("[data-component-message]");
    const history = container.querySelector("[data-component-history]");

    badge.className = `status-badge is-${status}`;
    badge.innerHTML = `<i></i>${statusMeta[status].label}`;
    if (component.endpoint || component.displayEndpoint) {
      endpoint.textContent = component.displayEndpoint || component.endpoint;
    }
    latency.textContent = formatLatency(component.latencyMs ?? component.responseTimeMs ?? component.latency);
    uptime.textContent = formatUptime(component.uptime90d ?? component.uptime);
    message.textContent = component.message || (status === "unknown" ? "暂无历史数据" : "按日汇总");
    renderHistory(history, historyValues(component));
    return status;
  }

  function setOverall(status, payload = {}) {
    const normalized = normalizeStatus(status);
    const meta = statusMeta[normalized];
    elements.overall.className = `status-overall is-${normalized}`;
    elements.overallTitle.textContent = payload.overallTitle || meta.overallTitle;
    elements.overallDescription.textContent = payload.overallMessage || payload.message || meta.overallDescription;
    elements.updated.textContent = formatDateTime(payload.generatedAt || payload.updatedAt);

    const utility = document.querySelector(".utility-status");
    if (utility) {
      const textNode = [...utility.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = normalized === "operational"
        ? "全球代理网络运行正常"
        : `全球代理网络：${meta.label}`;
      const dot = utility.querySelector(".status-dot");
      if (dot) dot.dataset.networkStatus = normalized;
    }
  }

  function deriveOverall(statuses) {
    const known = statuses.filter((status) => status !== "unknown");
    if (known.length === 0) return "unknown";
    return known.reduce((worst, current) => (
      severity[current] > severity[worst] ? current : worst
    ), "operational");
  }

  function normalizeComponents(payload) {
    const source = payload.components || payload.services || [];
    if (Array.isArray(source)) return source;
    return Object.entries(source).map(([id, value]) => ({
      id,
      ...(typeof value === "object" ? value : { status: value })
    }));
  }

  function renderEmpty(container, title, description) {
    container.replaceChildren();
    const empty = document.createElement("div");
    empty.className = "status-empty";
    const strong = document.createElement("strong");
    strong.textContent = title;
    const span = document.createElement("span");
    span.textContent = description;
    empty.append(strong, span);
    container.append(empty);
  }

  function renderEvents(container, entries, emptyTitle, emptyDescription) {
    if (!Array.isArray(entries) || entries.length === 0) {
      renderEmpty(container, emptyTitle, emptyDescription);
      return;
    }

    const fragment = document.createDocumentFragment();
    entries.slice(0, 6).forEach((entry) => {
      const item = document.createElement("article");
      item.className = "status-event-item";
      const head = document.createElement("div");
      head.className = "status-event-item-head";
      const title = document.createElement("strong");
      title.textContent = entry.title || "服务状态更新";
      const time = document.createElement("time");
      time.textContent = formatDateTime(entry.startedAt || entry.scheduledFor || entry.createdAt);
      const description = document.createElement("p");
      description.textContent = entry.message || entry.description || "暂无详细说明";
      const affected = document.createElement("small");
      const names = entry.affectedComponents || entry.components || [];
      affected.textContent = Array.isArray(names) && names.length
        ? `影响范围：${names.join("、")}`
        : "影响范围：请查看事件更新";
      head.append(title, time);
      item.append(head, description, affected);
      fragment.append(item);
    });
    container.replaceChildren(fragment);
  }

  function applyPayload(rawPayload, { preview = false } = {}) {
    const payload = rawPayload?.data && typeof rawPayload.data === "object"
      ? rawPayload.data
      : rawPayload;
    const components = normalizeComponents(payload);
    const byId = new Map(components.map((component) => [
      componentId(component.id || component.key || component.name),
      component
    ]));
    const statuses = [];

    componentDefinitions.forEach((definition) => {
      const component = byId.get(definition.id) || { id: definition.id, status: "unknown" };
      statuses.push(updateComponent(component));
    });

    const overall = normalizeStatus(payload.overallStatus || payload.status);
    const derived = overall === "unknown" ? deriveOverall(statuses) : overall;
    setOverall(derived, payload);

    const operationalCount = statuses.filter((status) => status === "operational").length;
    const affectedCount = statuses.filter((status) => (
      status !== "operational" && status !== "unknown"
    )).length;
    elements.total.textContent = String(componentDefinitions.length);
    elements.operational.textContent = String(operationalCount);
    elements.affected.textContent = String(affectedCount);

    renderEvents(
      elements.incidents,
      payload.incidents,
      "当前没有公开服务事件",
      "过去 90 天未记录影响服务可用性的事件"
    );
    renderEvents(
      elements.maintenance,
      payload.maintenance || payload.scheduledMaintenance,
      "当前没有计划维护",
      "后续维护窗口将在这里提前公布"
    );

    hasLiveData = !preview;
    elements.sourceNote.hidden = !preview;
    elements.sourceNote.textContent = preview ? "本地预览数据，不代表线上服务状态" : "";
  }

  function previewPayload(mode) {
    const baseStatuses = Object.fromEntries(componentDefinitions.map((item) => [item.id, "operational"]));
    if (mode === "degraded") {
      baseStatuses["gateway-eu"] = "degraded";
      baseStatuses.api = "partial_outage";
    }
    if (mode === "outage") {
      baseStatuses["proxy-residential"] = "major_outage";
      baseStatuses["gateway-us"] = "partial_outage";
    }
    return {
      generatedAt: new Date().toISOString(),
      components: componentDefinitions.map((item, index) => ({
        id: item.id,
        status: baseStatuses[item.id],
        latencyMs: 36 + index * 11,
        uptime90d: baseStatuses[item.id] === "operational" ? 99.98 - index * 0.003 : 98.72,
        message: baseStatuses[item.id] === "operational" ? "最近检测正常" : "技术团队正在处理",
        history90d: Array.from({ length: 90 }, (_, day) => (
          day === 70 && index === 3 ? "degraded" : baseStatuses[item.id]
        ))
      })),
      incidents: mode === "operational" ? [] : [{
        title: "部分服务请求成功率下降",
        startedAt: new Date().toISOString(),
        message: "技术团队正在确认区域链路与上游服务状态。",
        affectedComponents: mode === "degraded" ? ["欧洲网关", "API 服务"] : ["隧道住宅代理", "美国网关"]
      }],
      maintenance: []
    };
  }

  function localPreviewMode() {
    const host = window.location.hostname;
    if (host !== "127.0.0.1" && host !== "localhost") return "";
    const value = new URLSearchParams(window.location.search).get("preview");
    return ["operational", "degraded", "outage"].includes(value) ? value : "";
  }

  async function fetchStatus({ manual = false } = {}) {
    const preview = localPreviewMode();
    if (preview) {
      applyPayload(previewPayload(preview), { preview: true });
      return;
    }

    activeController?.abort();
    activeController = new AbortController();
    const timeout = window.setTimeout(() => activeController.abort(), config.requestTimeoutMs);
    elements.refresh.disabled = true;
    elements.refresh.classList.add("is-loading");

    try {
      const response = await fetch(config.endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "same-origin",
        signal: activeController.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      applyPayload(await response.json());
    } catch (error) {
      if (error.name === "AbortError" && !manual) return;
      if (!hasLiveData) {
        applyPayload({
          generatedAt: new Date().toISOString(),
          status: "unknown",
          components: [],
          incidents: null,
          maintenance: null,
          overallMessage: "暂时无法连接状态服务，请稍后刷新或联系技术支持。"
        });
        renderEmpty(elements.incidents, "事件数据暂不可用", "状态服务连接失败");
        renderEmpty(elements.maintenance, "维护数据暂不可用", "状态服务连接失败");
      }
    } finally {
      window.clearTimeout(timeout);
      elements.refresh.disabled = false;
      elements.refresh.classList.remove("is-loading");
    }
  }

  function initializeHistory() {
    document.querySelectorAll("[data-status-component]").forEach((component) => {
      renderHistory(component.querySelector("[data-component-history]"), Array(90).fill("unknown"));
    });
  }

  elements.refresh.addEventListener("click", () => fetchStatus({ manual: true }));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") fetchStatus();
  });

  initializeHistory();
  fetchStatus();
  refreshTimer = window.setInterval(fetchStatus, Math.max(30000, config.refreshIntervalMs));
  window.addEventListener("pagehide", () => {
    window.clearInterval(refreshTimer);
    activeController?.abort();
  }, { once: true });
})();
