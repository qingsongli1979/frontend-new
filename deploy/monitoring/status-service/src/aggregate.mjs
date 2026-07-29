const STATUS_RANK = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  major_outage: 4,
  unknown: -1
};

export const SUPPORTED_STATUSES = new Set(Object.keys(STATUS_RANK));

function average(values) {
  const usable = values.filter(Number.isFinite);
  if (usable.length === 0) return null;
  return Math.round(usable.reduce((sum, value) => sum + value, 0) / usable.length);
}

function groupStatus({ passed, failed, unknown, total }) {
  if (passed === total) return "operational";
  if (passed === 0 && failed === 0 && unknown > 0) return "unknown";
  if (passed === 0 && failed > 0) return "major_outage";
  if (passed / total >= 2 / 3) return "degraded";
  return "partial_outage";
}

function groupMessage({ passed, failed, unknown, total, status }) {
  if (status === "operational") return `${total}/${total} 个监测节点正常`;
  if (status === "unknown") return "代理探针暂时没有可用数据";

  const parts = [`${passed}/${total} 个监测节点正常`];
  if (failed) parts.push(`${failed} 个异常`);
  if (unknown) parts.push(`${unknown} 个未返回数据`);
  return parts.join("，");
}

function buildProxyGroup(component, config, proxyResults) {
  const members = config.proxyChecks.filter(
    (check) => check[component.selector] === component.value
  );
  const results = members.map((member) => ({
    member,
    result: proxyResults.get(member.id) || {
      id: member.id,
      ok: null,
      latencyMs: null,
      error: "check did not return"
    }
  }));

  const passed = results.filter(({ result }) => result.ok === true).length;
  const failed = results.filter(({ result }) => result.ok === false).length;
  const unknown = results.filter(({ result }) => result.ok === null).length;
  const total = results.length;
  const status = groupStatus({ passed, failed, unknown, total });
  const failedIds = results
    .filter(({ result }) => result.ok !== true)
    .map(({ member }) => member.id);

  return {
    id: component.id,
    name: component.name,
    status,
    latencyMs: average(results.map(({ result }) => result.ok ? result.latencyMs : null)),
    message: groupMessage({ passed, failed, unknown, total, status }),
    _availabilityPassed: passed,
    _availabilityTotal: passed + failed,
    _pushTokenEnv: component.pushTokenEnv,
    _internalMessage: failedIds.length
      ? `${passed}/${total} checks passed; affected: ${failedIds.join(", ")}`
      : `${total}/${total} checks passed`
  };
}

function buildServiceComponent(component, serviceResults) {
  const result = serviceResults.get(component.serviceCheck) || {
    id: component.serviceCheck,
    ok: null,
    latencyMs: null,
    error: "check did not return"
  };

  const status = result.ok === true
    ? "operational"
    : result.ok === false
      ? "major_outage"
      : "unknown";

  return {
    id: component.id,
    name: component.name,
    status,
    latencyMs: result.ok ? result.latencyMs : null,
    message: result.ok === true
      ? "最近检测正常"
      : result.ok === false
        ? "最近检测失败，技术团队正在确认"
        : "监测地址尚未配置或暂无数据",
    _availabilityPassed: result.ok === true ? 1 : 0,
    _availabilityTotal: result.ok === null ? 0 : 1,
    _pushTokenEnv: component.pushTokenEnv,
    _internalMessage: result.ok === true
      ? "HTTP check passed"
      : result.error || "HTTP check failed"
  };
}

export function applyComponentOverrides(components, overrides = {}) {
  return components.map((component) => {
    const override = overrides[component.id];
    if (!override) return component;

    const status = typeof override === "string" ? override : override.status;
    if (!SUPPORTED_STATUSES.has(status)) return component;
    const message = typeof override === "object" && override.message
      ? String(override.message)
      : component.message;

    return {
      ...component,
      status,
      message,
      _internalMessage: `manual override: ${status}`
    };
  });
}

export function buildComponents(config, {
  proxyResults = [],
  serviceResults = [],
  overrides = {}
} = {}) {
  const proxyResultMap = new Map(proxyResults.map((result) => [result.id, result]));
  const serviceResultMap = new Map(serviceResults.map((result) => [result.id, result]));

  const components = config.components.map((component) => (
    component.kind === "proxy-group"
      ? buildProxyGroup(component, config, proxyResultMap)
      : buildServiceComponent(component, serviceResultMap)
  ));
  return applyComponentOverrides(components, overrides);
}

export function deriveOverallStatus(components) {
  const known = components.filter((component) => component.status !== "unknown");
  if (known.length === 0) return "unknown";

  const worstKnown = known.reduce((worst, component) => (
    STATUS_RANK[component.status] > STATUS_RANK[worst]
      ? component.status
      : worst
  ), "operational");

  if (
    components.some((component) => component.status === "unknown") &&
    STATUS_RANK[worstKnown] < STATUS_RANK.degraded
  ) {
    return "degraded";
  }
  return worstKnown;
}

export function worstDailyStatus(current, candidate) {
  if (!SUPPORTED_STATUSES.has(candidate)) return current || "unknown";
  if (!current || current === "unknown") return candidate;
  if (candidate === "unknown") return current;
  return STATUS_RANK[candidate] > STATUS_RANK[current] ? candidate : current;
}

export function toPublicComponent(component) {
  return {
    id: component.id,
    status: component.status,
    latencyMs: component.latencyMs,
    uptime90d: component.uptime90d ?? null,
    message: component.message,
    history90d: component.history90d || []
  };
}

