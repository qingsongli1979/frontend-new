import { isHighBandwidthPackage } from "./package-classification.js?v=20260818-01";
import { consoleTimestamp, formatConsoleDateTime } from "./date-time.js?v=20260818-03";

const TOKEN_KEY = "token_key";
const REQUEST_TIMEOUT_MS = 12000;
const PAGE_SIZE = 12;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const PROXY_CHARGE_TYPES = new Set([
  "trafficIp",
  "tmpPackage",
  "tunnelIp",
  "residentialDynamicIp",
  "durationIp",
  "fixedIp",
  "residentialStaticIp"
]);

const PRODUCT_META = {
  bandwidth: {
    name: "高带宽代理 IP",
    icon: "gauge",
    plist: 1
  },
  tunnel: {
    name: "隧道代理",
    icon: "shuffle",
    plist: 1
  },
  residential: {
    name: "隧道住宅代理",
    icon: "globe-2",
    plist: 2
  },
  unlimited: {
    name: "不限量动态住宅",
    icon: "refresh-cw",
    plist: 4
  },
  staticDatacenter: {
    name: "长效静态代理",
    icon: "server",
    plist: 0
  },
  staticResidential: {
    name: "长效静态住宅",
    icon: "house-plug",
    plist: 3
  }
};

const state = {
  loaded: false,
  loadingPromise: null,
  data: null,
  account: null,
  currentView: "",
  packagePage: 1,
  selectedPackage: null,
  revealedUsers: new Set(),
  selectedUser: null
};

class ResourceRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ResourceRequestError";
    this.status = status;
  }
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits,
    minimumFractionDigits: 0
  }).format(number(value));
}

function formatDate(value) {
  return formatConsoleDateTime(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function unwrap(payload) {
  if (!payload || typeof payload !== "object") return payload;
  return payload.res || payload.data || payload;
}

function arrayFrom(payload, key = "") {
  const source = unwrap(payload);
  if (Array.isArray(source)) return source;
  if (key && Array.isArray(source?.[key])) return source[key];
  return [];
}

function isExpired(order, now = Date.now()) {
  if ([true, "true", 1, "1"].includes(order?.overTime)) return true;
  const value = order?.expirationTime || order?.expiration || order?.expirationStr || order?.expirationTimestamp;
  if (!value) return false;
  const timestamp = consoleTimestamp(value);
  return timestamp !== null && timestamp < now;
}

function isResidentialTraffic(order) {
  return order?.chargeType === "residentialDynamicIp"
    && number(order.totalTrafficInGB ?? order.traffInGB) > 0;
}

function resolveProduct(order) {
  if (isHighBandwidthPackage(order)) {
    return { key: "bandwidth", ...PRODUCT_META.bandwidth };
  }

  switch (order?.chargeType) {
    case "trafficIp":
    case "tmpPackage":
    case "tunnelIp":
      return { key: "tunnel", ...PRODUCT_META.tunnel };
    case "residentialDynamicIp":
      return isResidentialTraffic(order)
        ? { key: "residential", ...PRODUCT_META.residential }
        : { key: "unlimited", ...PRODUCT_META.unlimited };
    case "durationIp":
      return { key: "unlimited", ...PRODUCT_META.unlimited };
    case "fixedIp":
      return { key: "staticDatacenter", ...PRODUCT_META.staticDatacenter };
    case "residentialStaticIp":
      return { key: "staticResidential", ...PRODUCT_META.staticResidential };
    default:
      return {
        key: "unknown",
        name: "代理套餐",
        icon: "package",
        plist: 1
      };
  }
}

function packageIdentifier(order) {
  return String(order?.orderId || order?.id || order?.referID || "");
}

function totalTrafficGb(order) {
  return Math.max(0, number(order?.totalTrafficInGB ?? order?.traffInGB));
}

function remainingTrafficGb(order) {
  if (order?.remainTrafficInGB !== undefined && order?.remainTrafficInGB !== null) {
    return Math.max(0, number(order.remainTrafficInGB));
  }
  if (order?.remainingTrafficInKB !== undefined && order?.remainingTrafficInKB !== null) {
    return Math.max(0, number(order.remainingTrafficInKB) / 1000000);
  }
  return 0;
}

function hasReliableTrafficTotal(order) {
  const total = totalTrafficGb(order);
  const remaining = remainingTrafficGb(order);
  return total > 0 && remaining <= total * 1.05;
}

function packageLabel(order, product) {
  if (isHighBandwidthPackage(order)) return "专属项目套餐";
  switch (order.chargeType) {
    case "trafficIp":
      return hasReliableTrafficTotal(order)
        ? `${formatNumber(totalTrafficGb(order) || order.total, 0)}GB 流量套餐`
        : "按流量套餐";
    case "tmpPackage":
      return hasReliableTrafficTotal(order)
        ? `${formatNumber(totalTrafficGb(order) || order.total, 0)}GB 补充流量包`
        : "补充流量包";
    case "tunnelIp":
      return `${formatNumber(order.total, 0)} 并发线程`;
    case "residentialDynamicIp":
      return isResidentialTraffic(order)
        ? (hasReliableTrafficTotal(order)
          ? `${formatNumber(totalTrafficGb(order), 0)}GB 流量套餐`
          : "按流量套餐")
        : `${formatNumber(order.total || 1, 0)} 个不限量端口`;
    case "durationIp":
      return `${formatNumber(order.total || 1, 0)} 个不限量端口`;
    case "fixedIp":
    case "residentialStaticIp":
      return `${formatNumber(order.total || 1, 0)} 个独享 IP`;
    default:
      return product.name;
  }
}

function packageResource(order) {
  if (isHighBandwidthPackage(order)) {
    return {
      available: "不限流量 · 不限并发",
      usage: "高级技术支持独立交付",
      progress: 0
    };
  }

  if (["trafficIp", "tmpPackage"].includes(order.chargeType) || isResidentialTraffic(order)) {
    const reliableTotal = hasReliableTrafficTotal(order);
    return {
      available: `${formatNumber(remainingTrafficGb(order))} GB`,
      usage: reliableTotal
        ? `${formatNumber(Math.max(0, totalTrafficGb(order) - remainingTrafficGb(order)))} / ${formatNumber(totalTrafficGb(order))} GB`
        : "按实时余量计量",
      progress: reliableTotal
        ? Math.min(100, Math.max(0, (totalTrafficGb(order) - remainingTrafficGb(order)) / totalTrafficGb(order) * 100))
        : 0
    };
  }
  if (order.chargeType === "tunnelIp") {
    return {
      available: `${formatNumber(order.total, 0)} 并发线程`,
      usage: "不限累计流量",
      progress: 0
    };
  }
  if (order.chargeType === "durationIp"
      || (order.chargeType === "residentialDynamicIp" && !isResidentialTraffic(order))) {
    return {
      available: `${formatNumber(order.total || 1, 0)} 个端口`,
      usage: "不限流量与并发",
      progress: 0
    };
  }
  if (["fixedIp", "residentialStaticIp"].includes(order.chargeType)) {
    const pending = Math.max(0, number(order.remainAmount ?? order.amount));
    return {
      available: pending > 0 ? `${formatNumber(pending, 0)} 个待提取` : `${formatNumber(order.total || 1, 0)} 个 IP`,
      usage: pending > 0 ? "等待分配出口" : "独享固定出口",
      progress: pending > 0 ? 8 : 100
    };
  }
  return { available: "可使用", usage: "--", progress: 0 };
}

function packageStatus(order, resource, now = Date.now()) {
  if (isExpired(order, now)) {
    return { key: "expired", label: "已过期" };
  }
  const metered = ["trafficIp", "tmpPackage"].includes(order.chargeType) || isResidentialTraffic(order);
  const pendingStatic = ["fixedIp", "residentialStaticIp"].includes(order.chargeType)
    && Math.max(0, number(order.remainAmount ?? order.amount)) > 0;
  if (pendingStatic) return { key: "attention", label: "待提取" };
  if (metered && remainingTrafficGb(order) <= 0) return { key: "attention", label: "已用完" };
  if (isHighBandwidthPackage(order)) return { key: "active", label: "专属交付" };
  return { key: "active", label: "使用中" };
}

function packageCanRenew(order, now = Date.now()) {
  const raw = order?.raw || order || {};
  if ([true, "true", 1, "1"].includes(raw.present)) return false;
  if (isHighBandwidthPackage(raw)) return false;
  if (order?.status === "expired" || isExpired(raw, now)) return false;
  if (["tmpPackage", "trafficIp"].includes(raw.chargeType)) return false;
  if (raw.chargeType === "residentialDynamicIp" && number(raw.traffInGB) > 0) return false;
  return ["tunnelIp", "residentialDynamicIp", "durationIp", "fixedIp", "residentialStaticIp"]
    .includes(raw.chargeType);
}

function packageActionRequest(action, item, values = {}) {
  const raw = item?.raw || item || {};
  const orderId = String(item?.id || raw.orderId || "");
  if (!orderId) throw new ResourceRequestError("缺少套餐订单号，请刷新后重试");

  if (action === "renew") {
    const productId = raw.productId ?? item?.productId;
    if (productId === undefined || productId === null || productId === "") {
      throw new ResourceRequestError("当前套餐缺少续费产品标识，请联系技术支持");
    }
    return {
      path: "/ip/order1/create",
      method: "POST",
      body: {
        renew: true,
        period: 1,
        unit: "month",
        orderid: orderId,
        productId
      }
    };
  }
  if (action === "remark") {
    return {
      path: "/ip/modifyorder",
      method: "PUT",
      body: { orderId, referID: String(values.value ?? "") }
    };
  }
  if (action === "bind") {
    return {
      path: "/ip/bindorder",
      method: "PUT",
      body: { orderId, bindUser: String(values.value ?? "") }
    };
  }
  if (action === "notify") {
    return {
      path: "/ip/notifyorder",
      method: "PUT",
      body: {
        orderId,
        enabledNotify: Boolean(values.enabledNotify),
        criteriaInGB: Math.max(0, number(values.criteriaInGB)),
        notifyPhone: String(values.notifyPhone ?? ""),
        notifyEmail: String(values.notifyEmail ?? "")
      }
    };
  }
  throw new ResourceRequestError("不支持的套餐操作");
}

function mergeOrders(history, liveOrders) {
  const liveMap = new Map();
  liveOrders.forEach((order) => {
    const keys = [order?.orderId, order?.id, order?.referID].filter(Boolean).map(String);
    keys.forEach((key) => liveMap.set(key, order));
  });
  return history.map((order) => {
    const live = [order?.orderId, order?.id, order?.referID]
      .filter(Boolean)
      .map(String)
      .map((key) => liveMap.get(key))
      .find(Boolean);
    if (!live) return order;
    const merged = { ...live, ...order, orderId: order.orderId || live.orderId || live.id };
    if (live.remainingTrafficInKB !== undefined && live.remainingTrafficInKB !== null) {
      merged.remainTrafficInGB = Math.max(0, number(live.remainingTrafficInKB) / 1000000);
    }
    return merged;
  });
}

function normalizeResourceData(trafficPayload, orderPayload, userPayload, now = Date.now()) {
  const traffic = unwrap(trafficPayload) || {};
  const history = arrayFrom(orderPayload, "userOrderList");
  const liveOrders = arrayFrom(traffic, "orders");
  const rawUsers = arrayFrom(userPayload).length
    ? arrayFrom(userPayload)
    : arrayFrom(traffic, "users");
  const orders = mergeOrders(history, liveOrders)
    .filter((order) => PROXY_CHARGE_TYPES.has(order?.chargeType))
    .map((order) => {
      const product = resolveProduct(order);
      const resource = packageResource(order);
      const status = packageStatus(order, resource, now);
      const id = packageIdentifier(order);
      return {
        raw: order,
        id,
        orderNumber: String(order.orderId || order.referID || id || "--"),
        productKey: product.key,
        productName: product.name,
        icon: product.icon,
        detail: packageLabel(order, product),
        available: resource.available,
        usage: resource.usage,
        progress: resource.progress,
        created: formatDate(order.createTime || order.createTimestamp),
        expiry: formatDate(order.expirationTime || order.expirationTimestamp),
        expiryTimestamp: consoleTimestamp(order.expirationTime || order.expirationTimestamp) || 0,
        status: status.key,
        statusLabel: status.label,
        remark: String(order.referID || ""),
        bindUser: String(order.bindUser || ""),
        enabledNotify: [true, "true", 1, "1"].includes(order.enabledNotify),
        criteriaInGB: Math.max(0, number(order.criteriaInGB)),
        notifyPhone: String(order.notifyPhone || ""),
        notifyEmail: String(order.notifyEmail || ""),
        productId: order.productId,
        present: [true, "true", 1, "1"].includes(order.present),
        renewable: packageCanRenew(order, now),
        metered: ["trafficIp", "tmpPackage"].includes(order.chargeType) || isResidentialTraffic(order),
        route: product.key === "bandwidth"
          ? "#product-bandwidth"
          : `#extract?product=${encodeURIComponent(product.key)}&order=${encodeURIComponent(id)}`,
        purchaseUrl: product.key === "bandwidth"
          ? "#product-bandwidth"
          : `#purchase?product=${encodeURIComponent(product.key === "unknown" ? "tunnel" : product.key)}`,
        totalTrafficGb: totalTrafficGb(order),
        remainingTrafficGb: remainingTrafficGb(order)
      };
    })
    .sort((left, right) => {
      const statusOrder = { active: 0, attention: 1, expired: 2 };
      return statusOrder[left.status] - statusOrder[right.status]
        || right.expiryTimestamp - left.expiryTimestamp;
    });

  const users = rawUsers.map((user) => ({
    id: String(user.id ?? ""),
    username: String(user.username || ""),
    password: String(user.password || ""),
    limitInGB: Math.max(0, number(user.limitInGB)),
    usedInGB: Math.max(0, number(user.usedInKB) / 1000000)
  }));

  return {
    packages: orders,
    users,
    resources: {
      meteredTrafficGb: Math.max(0, number(traffic.avaTrafficInKB)) / 1000000
        + Math.max(0, number(traffic.avaZhuzhaiTrafficInKB)) / 1000000,
      concurrency: Math.max(
        0,
        number(traffic.avaTunnelIPs ?? traffic.conns)
          - orders
            .filter((item) => item.productKey === "bandwidth" && item.status !== "expired")
            .reduce((total, item) => total + number(item.raw?.total), 0)
      ),
      unlimitedPorts: Math.max(0, number(traffic.amountOfDurationIPs ?? traffic.avaUnlimitZhuzhai)),
      userTrafficGb: users.reduce((total, user) => total + user.usedInGB, 0)
    }
  };
}

function isLocalPreview() {
  return LOCAL_HOSTS.has(window.location.hostname);
}

function apiBase() {
  const configured = window.__CONSOLE_CONFIG__?.apiBase;
  if (configured) return String(configured).replace(/\/$/, "");
  return window.location.origin;
}

function getAccessToken() {
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw)?.access_token || "" : "";
  } catch {
    return "";
  }
}

function loginUrl() {
  const next = isLocalPreview()
    ? `/console/app/${window.location.hash || ""}`
    : `/app/${window.location.hash || ""}`;
  const path = isLocalPreview() ? "/console/login.html" : "/login.html";
  return `${window.location.origin}${path}?next=${encodeURIComponent(next)}`;
}

async function request(path, token, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await window.fetch(`${apiBase()}${path}`, {
      method: options.method || "GET",
      body: options.body,
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "Accept-Language": "zh-CN,zh;q=0.5",
        "Authorization": `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const raw = await response.text();
    let payload = raw;
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = raw;
    }
    if (!response.ok) {
      throw new ResourceRequestError(
        payload?.message || payload?.error_description || `请求失败（${response.status}）`,
        response.status
      );
    }
    return payload;
  } catch (error) {
    if (error?.name === "AbortError") throw new ResourceRequestError("请求超时，请稍后重试");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
  }
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function setNotice(view, type, message, action) {
  const notice = document.querySelector(`#${view}Notice`);
  if (!notice) return;
  notice.hidden = !message;
  notice.className = `overview-notice${type ? ` is-${type}` : ""}`;
  notice.innerHTML = message
    ? `<i data-lucide="${type === "error" ? "circle-alert" : "info"}" aria-hidden="true"></i>
       <span>${escapeHtml(message)}</span>
       ${action ? `<button type="button" data-notice-action="${escapeHtml(view)}">${escapeHtml(action.label)}</button>` : ""}`
    : "";
  if (action) {
    notice.querySelector("[data-notice-action]")?.addEventListener("click", action.handler);
  }
  refreshIcons();
}

function unavailableMarkup(message) {
  return `<div class="management-state is-error"><i data-lucide="circle-alert" aria-hidden="true"></i><strong>${escapeHtml(message)}</strong></div>`;
}

function loadingMarkup(message) {
  return `<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>${escapeHtml(message)}</strong></div>`;
}

async function ensureData(force = false) {
  if (force) {
    state.loaded = false;
    state.data = null;
  }
  if (state.loaded) return state.data;
  if (state.loadingPromise) return state.loadingPromise;

  const token = getAccessToken();
  if (!token) {
    const error = new ResourceRequestError("登录后加载资源数据");
    error.code = "NO_TOKEN";
    throw error;
  }

  state.loadingPromise = Promise.all([
    request("/ip/mytraffic", token),
    request("/ip/getorder/", token),
    request("/ip/pairs", token),
    request("/accsrv/information", token).catch(() => ({}))
  ])
    .then(([trafficPayload, orderPayload, userPayload, accountPayload]) => {
      state.data = normalizeResourceData(trafficPayload, orderPayload, userPayload);
      state.account = unwrap(accountPayload) || {};
      state.loaded = true;
      return state.data;
    })
    .finally(() => {
      state.loadingPromise = null;
    });
  return state.loadingPromise;
}

function statusMarkup(item) {
  const className = item.status === "active"
    ? "is-active"
    : item.status === "attention" ? "is-waiting" : "is-expired";
  return `<span class="status ${className}"><i></i>${escapeHtml(item.statusLabel)}</span>`;
}

function packageRowMarkup(item) {
  const exhausted = item.statusLabel === "已用完";
  const primaryLabel = item.productKey === "bandwidth"
    ? "查看交付说明"
    : item.status === "expired"
    ? "重新购买"
    : exhausted ? "购买流量"
    : item.statusLabel === "待提取" ? "立即提取" : "使用套餐";
  const primaryUrl = item.status === "expired" || exhausted ? item.purchaseUrl : item.route;
  const context = [
    item.remark ? `备注：${item.remark}` : "",
    item.bindUser ? `绑定：${item.bindUser}` : "",
    item.enabledNotify ? "提醒已开启" : ""
  ].filter(Boolean).join(" · ");
  const canManage = item.status !== "expired" && !item.present;
  return `
    <div class="management-row package-management-row" role="row" data-package-id="${escapeHtml(item.id)}">
      <div class="management-product" role="cell">
        <span class="product-symbol"><i data-lucide="${item.icon}" aria-hidden="true"></i></span>
        <span>
          <strong>${escapeHtml(item.productName)}</strong>
          <small>${escapeHtml(item.detail)} · ${escapeHtml(item.orderNumber)}</small>
          ${context ? `<small class="package-context">${escapeHtml(context)}</small>` : ""}
        </span>
      </div>
      <div class="management-resource" role="cell">
        <strong>${escapeHtml(item.available)}</strong>
        <small>${escapeHtml(item.usage)}</small>
      </div>
      <div class="management-dates" role="cell">
        <strong>${escapeHtml(item.created)}</strong>
        <small>到期 ${escapeHtml(item.expiry)}</small>
      </div>
      <div role="cell">${statusMarkup(item)}</div>
      <div class="management-actions" role="cell">
        <a class="button-mini is-primary" href="${escapeHtml(primaryUrl)}">${primaryLabel}</a>
        ${item.present
          ? '<span class="package-gift-label">系统赠送</span>'
          : canManage
            ? `<button class="button-mini package-manage-button" type="button" data-package-manage="${escapeHtml(item.id)}">
                管理<i data-lucide="settings-2" aria-hidden="true"></i>
              </button>`
            : ""}
      </div>
    </div>`;
}

function filteredPackages() {
  if (!state.data) return [];
  const status = document.querySelector("#packagesStatusFilter")?.value || "all";
  const product = document.querySelector("#packagesProductFilter")?.value || "all";
  const keyword = (document.querySelector("#packagesSearch")?.value || "").trim().toLowerCase();
  return state.data.packages.filter((item) => {
    const statusMatch = status === "all" || item.status === status;
    const productMatch = product === "all" || item.productKey === product;
    const searchText = `${item.productName} ${item.detail} ${item.orderNumber}`.toLowerCase();
    return statusMatch && productMatch && (!keyword || searchText.includes(keyword));
  });
}

function renderPackageMetrics(data) {
  const active = data.packages.filter((item) => item.status === "active").length;
  const attention = data.packages.filter((item) => item.status === "attention").length;
  const expired = data.packages.filter((item) => item.status === "expired").length;
  document.querySelector("#packagesActiveMetric").textContent = formatNumber(active, 0);
  document.querySelector("#packagesAttentionMetric").textContent = formatNumber(attention, 0);
  document.querySelector("#packagesHistoryMetric").textContent = formatNumber(data.packages.length, 0);
  const badge = document.querySelector('[data-view="packages"] em');
  if (badge) badge.textContent = formatNumber(active + attention, 0);
  return { active, attention, expired };
}

function renderPackageTable() {
  const rows = document.querySelector("#packagesTableRows");
  if (!rows || !state.data) return;
  const filtered = filteredPackages();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  state.packagePage = Math.min(totalPages, Math.max(1, state.packagePage));
  const start = (state.packagePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  rows.innerHTML = visible.length
    ? visible.map(packageRowMarkup).join("")
    : `<div class="management-state"><i data-lucide="search-x" aria-hidden="true"></i><strong>没有符合条件的套餐</strong></div>`;
  document.querySelector("#packagesResultCount").textContent = `共 ${formatNumber(filtered.length, 0)} 条记录`;
  document.querySelector("#packagesPageLabel").textContent = `第 ${state.packagePage} / ${totalPages} 页`;
  document.querySelector("#packagesPrevPage").disabled = state.packagePage <= 1;
  document.querySelector("#packagesNextPage").disabled = state.packagePage >= totalPages;
  refreshIcons();
}

function renderPackagesView(data) {
  setNotice("packages", "", "");
  renderPackageMetrics(data);
  renderPackageTable();
}

function usagePackageRowMarkup(item) {
  const hasProgress = item.totalTrafficGb > 0;
  return `
    <div class="management-row usage-package-row" role="row">
      <div class="management-product" role="cell">
        <span class="product-symbol"><i data-lucide="${item.icon}" aria-hidden="true"></i></span>
        <span><strong>${escapeHtml(item.productName)}</strong><small>${escapeHtml(item.detail)}</small></span>
      </div>
      <div class="usage-progress-cell" role="cell">
        <strong>${escapeHtml(item.usage)}</strong>
        ${hasProgress ? `<span><i style="width:${item.progress}%"></i></span>` : "<small>套餐不按累计流量计费</small>"}
      </div>
      <div class="management-resource" role="cell"><strong>${escapeHtml(item.available)}</strong><small>${escapeHtml(item.statusLabel)}</small></div>
      <div class="management-dates" role="cell"><strong>${escapeHtml(item.expiry)}</strong><small>套餐有效期</small></div>
      <div class="management-actions" role="cell"><a class="button-mini is-primary" href="${escapeHtml(item.route)}">${item.productKey === "bandwidth" ? "查看交付说明" : "使用套餐"}</a></div>
    </div>`;
}

function usageUserRowMarkup(user) {
  const limited = user.limitInGB > 0;
  const progress = limited ? Math.min(100, user.usedInGB / user.limitInGB * 100) : 0;
  return `
    <div class="management-row usage-user-row" role="row">
      <strong role="cell">${escapeHtml(user.username)}</strong>
      <span role="cell">${formatNumber(user.usedInGB)} GB</span>
      <span role="cell">${limited ? `${formatNumber(user.limitInGB)} GB` : "不限制"}</span>
      <div class="usage-progress-cell" role="cell">
        ${limited
          ? `<strong>${formatNumber(progress, 1)}%</strong><span><i style="width:${progress}%"></i></span>`
          : "<small>未设置流量限额</small>"}
      </div>
    </div>`;
}

function renderUsageView(data) {
  setNotice("usage", "", "");
  document.querySelector("#usageTrafficMetric").textContent = formatNumber(data.resources.meteredTrafficGb);
  document.querySelector("#usageConcurrencyMetric").textContent = formatNumber(data.resources.concurrency, 0);
  document.querySelector("#usagePortMetric").textContent = formatNumber(data.resources.unlimitedPorts, 0);
  document.querySelector("#usageUserMetric").textContent = formatNumber(data.resources.userTrafficGb);

  const product = document.querySelector("#usageProductFilter")?.value || "all";
  const packages = data.packages.filter((item) => (
    item.status !== "expired" && (product === "all" || item.productKey === product)
  ));
  document.querySelector("#usagePackageRows").innerHTML = packages.length
    ? packages.map(usagePackageRowMarkup).join("")
    : `<div class="management-state"><i data-lucide="package-search" aria-hidden="true"></i><strong>当前筛选下没有有效套餐</strong></div>`;
  document.querySelector("#usageUserRows").innerHTML = data.users.length
    ? data.users.map(usageUserRowMarkup).join("")
    : `<div class="management-state"><i data-lucide="users-round" aria-hidden="true"></i><strong>尚未创建代理用户</strong></div>`;
  refreshIcons();
}

function maskPassword(password) {
  return password ? "••••••••••••" : "--";
}

function proxyUserRowMarkup(user) {
  const revealed = state.revealedUsers.has(user.id);
  return `
    <div class="management-row proxy-user-row" role="row" data-user-id="${escapeHtml(user.id)}">
      <div class="proxy-username" role="cell">
        <span><i data-lucide="user-round" aria-hidden="true"></i></span>
        <strong>${escapeHtml(user.username)}</strong>
      </div>
      <div class="proxy-secret" role="cell">
        <code>${escapeHtml(revealed ? user.password : maskPassword(user.password))}</code>
        <button type="button" data-user-action="reveal" aria-label="${revealed ? "隐藏" : "显示"}代理密码" title="${revealed ? "隐藏密码" : "显示密码"}"><i data-lucide="${revealed ? "eye-off" : "eye"}" aria-hidden="true"></i></button>
        <button type="button" data-user-action="copy" aria-label="复制代理密码" title="复制密码"><i data-lucide="copy" aria-hidden="true"></i></button>
      </div>
      <div class="management-resource" role="cell"><strong>${formatNumber(user.usedInGB)} GB</strong><small>累计代理流量</small></div>
      <div class="management-resource" role="cell"><strong>${user.limitInGB > 0 ? `${formatNumber(user.limitInGB)} GB` : "不限制"}</strong><small>${user.limitInGB > 0 ? "独立用户限额" : "使用套餐总额度"}</small></div>
      <div class="management-actions" role="cell">
        <button class="button-mini" type="button" data-user-action="limit">设置限额</button>
        <button class="icon-button is-danger" type="button" data-user-action="delete" aria-label="删除代理用户" title="删除"><i data-lucide="trash-2" aria-hidden="true"></i></button>
      </div>
    </div>`;
}

function renderUsersView(data) {
  setNotice("users", "", "");
  const limited = data.users.filter((user) => user.limitInGB > 0).length;
  document.querySelector("#usersCountMetric").textContent = formatNumber(data.users.length, 0);
  document.querySelector("#usersLimitedMetric").textContent = formatNumber(limited, 0);
  document.querySelector("#usersTrafficMetric").textContent = formatNumber(data.resources.userTrafficGb);
  document.querySelector("#usersTableRows").innerHTML = data.users.length
    ? data.users.map(proxyUserRowMarkup).join("")
    : `<div class="management-state"><i data-lucide="user-round-plus" aria-hidden="true"></i><strong>尚未创建代理用户</strong></div>`;
  refreshIcons();
}

function renderLoading(view) {
  if (view === "packages") {
    document.querySelector("#packagesTableRows").innerHTML = loadingMarkup("正在加载套餐记录");
  } else if (view === "usage") {
    document.querySelector("#usagePackageRows").innerHTML = loadingMarkup("正在读取套餐资源");
    document.querySelector("#usageUserRows").innerHTML = loadingMarkup("正在读取代理用户用量");
  } else if (view === "users") {
    document.querySelector("#usersTableRows").innerHTML = loadingMarkup("正在加载代理用户");
  }
  refreshIcons();
}

function renderError(view, message) {
  setNotice(view, "error", message, {
    label: "重新加载",
    handler: () => openResource(view, true)
  });
  if (view === "packages") document.querySelector("#packagesTableRows").innerHTML = unavailableMarkup(message);
  if (view === "usage") {
    document.querySelector("#usagePackageRows").innerHTML = unavailableMarkup(message);
    document.querySelector("#usageUserRows").innerHTML = unavailableMarkup(message);
  }
  if (view === "users") document.querySelector("#usersTableRows").innerHTML = unavailableMarkup(message);
  refreshIcons();
}

async function openResource(view, force = false) {
  if (!["packages", "users"].includes(view)) return;
  state.currentView = view;
  renderLoading(view);
  try {
    const data = await ensureData(force);
    if (state.currentView !== view) return;
    if (view === "packages") renderPackagesView(data);
    if (view === "usage") renderUsageView(data);
    if (view === "users") renderUsersView(data);
  } catch (error) {
    if (state.currentView !== view) return;
    if (error.code === "NO_TOKEN") {
      setNotice(view, "info", "登录后可查看真实资源数据。", {
        label: "前往登录",
        handler: () => { window.location.href = loginUrl(); }
      });
      if (view === "packages") document.querySelector("#packagesTableRows").innerHTML = unavailableMarkup("登录后加载资源数据");
      if (view === "usage") {
        document.querySelector("#usagePackageRows").innerHTML = unavailableMarkup("登录后加载资源数据");
        document.querySelector("#usageUserRows").innerHTML = unavailableMarkup("登录后加载资源数据");
      }
      if (view === "users") document.querySelector("#usersTableRows").innerHTML = unavailableMarkup("登录后加载资源数据");
      refreshIcons();
      return;
    }
    if ([401, 403].includes(error.status)) {
      window.localStorage.removeItem(TOKEN_KEY);
      if (!isLocalPreview()) {
        window.location.replace(loginUrl());
        return;
      }
    }
    renderError(view, error.message || "资源数据加载失败");
  }
}

function downloadUsageCsv() {
  if (!state.data) return;
  const rows = [
    ["类型", "名称", "套餐或限额", "已用或可用", "到期时间"],
    ...state.data.packages
      .filter((item) => item.status !== "expired")
      .map((item) => ["套餐", item.productName, item.detail, `${item.usage}；可用 ${item.available}`, item.expiry]),
    ...state.data.users
      .map((user) => ["代理用户", user.username, user.limitInGB > 0 ? `${user.limitInGB} GB` : "不限制", `${formatNumber(user.usedInGB)} GB`, "--"])
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `123proxy-usage-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("真实用量数据已导出");
}

function openDialog(id) {
  const dialog = document.querySelector(id);
  if (dialog?.showModal) dialog.showModal();
}

function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
}

function setDialogMessage(id, message, type = "error") {
  const element = document.querySelector(id);
  if (!element) return;
  element.hidden = !message;
  element.className = `dialog-message${type ? ` is-${type}` : ""}`;
  element.textContent = message;
}

function setFormBusy(form, busy) {
  form?.querySelectorAll("button, input, select, textarea").forEach((control) => {
    control.disabled = busy;
  });
}

async function mutateUser(path, method, form, messageSelector) {
  const token = getAccessToken();
  if (!token) throw new ResourceRequestError("登录状态已失效", 401);
  setFormBusy(form, true);
  setDialogMessage(messageSelector, "");
  try {
    await request(path, token, { method });
  } finally {
    setFormBusy(form, false);
  }
}

function userById(id) {
  return state.data?.users.find((user) => user.id === String(id));
}

function packageById(id) {
  return state.data?.packages.find((item) => item.id === String(id));
}

function packageDialogSummary(item) {
  return `${item.productName} · ${item.detail} · ${item.orderNumber}`;
}

function openPackageManageDialog(item) {
  state.selectedPackage = item;
  document.querySelector("#packageManageSummary").textContent = packageDialogSummary(item);
  document.querySelector("#packageManageActions").innerHTML = `
    ${item.renewable
      ? '<button type="button" data-package-action="renew"><i data-lucide="calendar-plus"></i><span><strong>续费套餐</strong><small>按原套餐创建 1 个月续费订单</small></span><i data-lucide="chevron-right"></i></button>'
      : ""}
    <button type="button" data-package-action="remark"><i data-lucide="notebook-pen"></i><span><strong>修改备注</strong><small>记录项目、用途或负责人</small></span><i data-lucide="chevron-right"></i></button>
    ${item.productKey === "bandwidth" ? "" : '<button type="button" data-package-action="bind"><i data-lucide="user-round-check"></i><span><strong>绑定代理用户</strong><small>从当前账户已有代理用户中选择</small></span><i data-lucide="chevron-right"></i></button>'}
    <button type="button" data-package-action="notify"><i data-lucide="bell-ring"></i><span><strong>套餐提醒</strong><small>设置到期通知与流量阈值</small></span><i data-lucide="chevron-right"></i></button>
    <a href="${escapeHtml(item.purchaseUrl)}"><i data-lucide="${item.productKey === "bandwidth" ? "messages-square" : "shopping-cart"}"></i><span><strong>${item.productKey === "bandwidth" ? "获取同类方案" : "购买同类套餐"}</strong><small>${item.productKey === "bandwidth" ? "进入高带宽代理产品页" : "进入该产品的实时套餐列表"}</small></span><i data-lucide="arrow-up-right"></i></a>`;
  openDialog("#packageManageDialog");
  refreshIcons();
}

async function managePackage(packageId) {
  const data = await ensureData();
  const item = data.packages.find((candidate) => candidate.id === String(packageId));
  if (!item) {
    throw new ResourceRequestError("未找到该套餐，请刷新概览后重试。");
  }
  if (item.status === "expired") {
    throw new ResourceRequestError("该套餐已过期，请前往所有套餐重新购买。");
  }
  if (item.present) {
    throw new ResourceRequestError("系统赠送套餐不支持续费或修改管理设置。");
  }
  openPackageManageDialog(item);
  return item;
}

function packageBindOptions(users, currentUsername = "") {
  const usernames = [...new Set(
    (Array.isArray(users) ? users : [])
      .map((user) => String(user?.username || "").trim())
      .filter(Boolean)
  )].sort((left, right) => left.localeCompare(right, "zh-CN"));
  const current = String(currentUsername || "").trim();
  const options = [
    {
      value: "",
      label: "解除绑定（不绑定代理用户）",
      disabled: false
    },
    ...usernames.map((username) => ({
      value: username,
      label: username,
      disabled: false
    }))
  ];
  if (current && !usernames.includes(current)) {
    options.push({
      value: current,
      label: `当前绑定：${current}（该用户已不存在）`,
      disabled: true
    });
  }
  if (!usernames.length) {
    options.push({
      value: "__no_proxy_users__",
      label: "暂无可绑定的代理用户",
      disabled: true
    });
  }
  return options;
}

function openPackageTextDialog(item, mode) {
  state.selectedPackage = item;
  const isBinding = mode === "bind";
  const form = document.querySelector("#packageTextForm");
  const valueInput = document.querySelector("#packageTextValue");
  const userSelect = document.querySelector("#packageTextUserSelect");
  form.dataset.packageTextMode = mode;
  document.querySelector("#packageTextEyebrow").textContent =
    isBinding ? "PROXY USER BINDING" : "PACKAGE NOTE";
  document.querySelector("#packageTextTitle").textContent =
    isBinding ? "绑定代理用户" : "修改套餐备注";
  document.querySelector("#packageTextSummary").textContent = packageDialogSummary(item);
  document.querySelector("#packageTextLabel").textContent =
    isBinding ? "代理用户" : "套餐备注";
  document.querySelector("#packageTextHelp").textContent = isBinding
    ? "套餐将绑定到所选代理用户；不会修改该用户的认证密码。选择“解除绑定”可清除当前绑定。"
    : "最多 20 个中英文字符；留空保存可清除备注。";
  valueInput.hidden = isBinding;
  userSelect.hidden = !isBinding;
  valueInput.value = isBinding ? "" : item.remark;
  if (isBinding) {
    const options = packageBindOptions(state.data?.users, item.bindUser);
    userSelect.innerHTML = options.map((option) =>
      `<option value="${escapeHtml(option.value)}"${option.disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`
    ).join("");
    userSelect.value = item.bindUser || "";
  }
  setDialogMessage("#packageTextMessage", "");
  openDialog("#packageTextDialog");
  window.setTimeout(() => (isBinding ? userSelect : valueInput)?.focus(), 50);
}

function openPackageRenewDialog(item) {
  state.selectedPackage = item;
  document.querySelector("#packageRenewSummary").textContent = packageDialogSummary(item);
  document.querySelector("#packageRenewExpiry").textContent = item.expiry;
  setDialogMessage("#packageRenewMessage", "");
  openDialog("#packageRenewDialog");
}

function accountPhone() {
  const raw = String(state.account?.phoneNumber || state.account?.name || "");
  return /^u\d+$/.test(raw) ? raw.slice(1) : raw;
}

function openPackageNotifyDialog(item) {
  state.selectedPackage = item;
  document.querySelector("#packageNotifySummary").textContent = packageDialogSummary(item);
  document.querySelector("#packageNotifyEnabled").checked = item.enabledNotify;
  document.querySelector("#packageNotifyPhone").value = item.notifyPhone || accountPhone();
  document.querySelector("#packageNotifyEmail").value =
    item.notifyEmail || String(state.account?.email || "");
  document.querySelector("#packageNotifyThreshold").value = String(item.criteriaInGB || 0);
  document.querySelector("#packageNotifyThresholdField").hidden = !item.metered;
  setDialogMessage("#packageNotifyMessage", "");
  openDialog("#packageNotifyDialog");
}

async function submitPackageRequest(action, values, form, messageSelector) {
  const item = state.selectedPackage;
  if (!item) throw new ResourceRequestError("未选择套餐，请刷新后重试");
  const token = getAccessToken();
  if (!token) throw new ResourceRequestError("登录状态已失效", 401);
  const operation = packageActionRequest(action, item, values);
  setFormBusy(form, true);
  setDialogMessage(messageSelector, "");
  try {
    return await request(operation.path, token, {
      method: operation.method,
      body: JSON.stringify(operation.body),
      headers: { "Content-Type": "application/json" }
    });
  } finally {
    setFormBusy(form, false);
  }
}

async function refreshAfterPackageMutation(message) {
  showToast(message);
  await openResource("packages", true);
  window.ConsoleOverview?.reload?.();
}

function bindPackageControls() {
  ["#packagesStatusFilter", "#packagesProductFilter"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", () => {
      state.packagePage = 1;
      renderPackageTable();
    });
  });
  document.querySelector("#packagesSearch")?.addEventListener("input", () => {
    state.packagePage = 1;
    renderPackageTable();
  });
  document.querySelector("#packagesPrevPage")?.addEventListener("click", () => {
    state.packagePage -= 1;
    renderPackageTable();
  });
  document.querySelector("#packagesNextPage")?.addEventListener("click", () => {
    state.packagePage += 1;
    renderPackageTable();
  });
  document.querySelector("#packagesReload")?.addEventListener("click", () => openResource("packages", true));

  document.querySelector("#packagesTableRows")?.addEventListener("click", (event) => {
    const row = event.target.closest("[data-package-id]");
    if (!row) return;
    const item = packageById(row.dataset.packageId);
    if (!item) return;

    const manageButton = event.target.closest("[data-package-manage]");
    if (manageButton) {
      event.preventDefault();
      openPackageManageDialog(item);
    }
  });

  document.querySelector("#packageManageActions")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-package-action]");
    const purchaseLink = event.target.closest("a[href]");
    if (purchaseLink) {
      closeDialog(document.querySelector("#packageManageDialog"));
      return;
    }
    if (!action || !state.selectedPackage) return;
    event.preventDefault();
    const item = state.selectedPackage;
    closeDialog(document.querySelector("#packageManageDialog"));
    if (action.dataset.packageAction === "renew") openPackageRenewDialog(item);
    if (action.dataset.packageAction === "remark") openPackageTextDialog(item, "remark");
    if (action.dataset.packageAction === "bind") openPackageTextDialog(item, "bind");
    if (action.dataset.packageAction === "notify") openPackageNotifyDialog(item);
  });

  document.querySelector("#packageRenewForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const payload = await submitPackageRequest("renew", {}, form, "#packageRenewMessage");
      if (!payload?.tradeNo) throw new ResourceRequestError("续费订单已创建，但未返回订单号");
      closeDialog(document.querySelector("#packageRenewDialog"));
      window.location.hash = `#order?tradeNo=${encodeURIComponent(payload.tradeNo)}`;
    } catch (error) {
      setDialogMessage("#packageRenewMessage", error.message || "续费订单创建失败，请稍后重试");
    }
  });

  document.querySelector("#packageTextForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const mode = form.dataset.packageTextMode === "bind" ? "bind" : "remark";
    const value = mode === "bind"
      ? document.querySelector("#packageTextUserSelect").value
      : document.querySelector("#packageTextValue").value.trim();
    if (mode === "remark" && Array.from(value).length > 20) {
      setDialogMessage("#packageTextMessage", "内容不能超过 20 个中英文字符。");
      return;
    }
    if (mode === "bind" && value
        && !state.data?.users.some((user) => user.username === value)) {
      setDialogMessage("#packageTextMessage", "请选择列表中的有效代理用户，或选择“解除绑定”。");
      return;
    }
    try {
      await submitPackageRequest(mode, { value }, form, "#packageTextMessage");
      closeDialog(document.querySelector("#packageTextDialog"));
      await refreshAfterPackageMutation(mode === "bind" ? "套餐绑定已更新" : "套餐备注已更新");
    } catch (error) {
      setDialogMessage("#packageTextMessage", error.message || "套餐信息更新失败，请稍后重试");
    }
  });

  document.querySelector("#packageNotifyForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const enabledNotify = document.querySelector("#packageNotifyEnabled").checked;
    const notifyPhone = document.querySelector("#packageNotifyPhone").value.trim();
    const notifyEmail = document.querySelector("#packageNotifyEmail").value.trim();
    const criteriaInGB = number(document.querySelector("#packageNotifyThreshold").value);
    if (enabledNotify && !notifyPhone && !notifyEmail) {
      setDialogMessage("#packageNotifyMessage", "启用提醒后，请至少填写手机号或邮箱。");
      return;
    }
    if (notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      setDialogMessage("#packageNotifyMessage", "请输入有效的通知邮箱。");
      return;
    }
    if (criteriaInGB < 0) {
      setDialogMessage("#packageNotifyMessage", "流量阈值不能小于 0。");
      return;
    }
    try {
      await submitPackageRequest(
        "notify",
        { enabledNotify, criteriaInGB, notifyPhone, notifyEmail },
        form,
        "#packageNotifyMessage"
      );
      closeDialog(document.querySelector("#packageNotifyDialog"));
      await refreshAfterPackageMutation(enabledNotify ? "套餐提醒已开启" : "套餐提醒已关闭");
    } catch (error) {
      setDialogMessage("#packageNotifyMessage", error.message || "套餐提醒更新失败，请稍后重试");
    }
  });
}

function bindUsageControls() {
  document.querySelector("#usageProductFilter")?.addEventListener("change", () => {
    if (state.data) renderUsageView(state.data);
  });
  document.querySelector("#usageExport")?.addEventListener("click", downloadUsageCsv);
}

function bindUserControls() {
  document.querySelector("#createProxyUserButton")?.addEventListener("click", () => {
    document.querySelector("#createProxyUserForm")?.reset();
    setDialogMessage("#createProxyUserMessage", "");
    openDialog("#createProxyUserDialog");
    window.setTimeout(() => document.querySelector("#proxyUserPrefix")?.focus(), 50);
  });
  document.querySelector("#usersReload")?.addEventListener("click", () => openResource("users", true));

  document.querySelector("#usersTableRows")?.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-user-action]");
    const row = event.target.closest("[data-user-id]");
    if (!action || !row) return;
    const user = userById(row.dataset.userId);
    if (!user) return;

    if (action.dataset.userAction === "reveal") {
      if (state.revealedUsers.has(user.id)) state.revealedUsers.delete(user.id);
      else state.revealedUsers.add(user.id);
      renderUsersView(state.data);
      return;
    }
    if (action.dataset.userAction === "copy") {
      try {
        await navigator.clipboard.writeText(user.password);
        showToast("代理密码已复制");
      } catch {
        showToast("浏览器未允许复制，请先显示密码");
      }
      return;
    }
    state.selectedUser = user;
    if (action.dataset.userAction === "limit") {
      document.querySelector("#limitProxyUserName").textContent = user.username;
      document.querySelector("#proxyUserLimit").value = String(user.limitInGB);
      setDialogMessage("#limitProxyUserMessage", "");
      openDialog("#limitProxyUserDialog");
    }
    if (action.dataset.userAction === "delete") {
      document.querySelector("#deleteProxyUserName").textContent = user.username;
      setDialogMessage("#deleteProxyUserMessage", "");
      openDialog("#deleteProxyUserDialog");
    }
  });

  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")));
  });

  document.querySelector("#createProxyUserForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const prefix = document.querySelector("#proxyUserPrefix").value.trim();
    if (!/^[A-Za-z0-9]{5,15}$/.test(prefix)) {
      setDialogMessage("#createProxyUserMessage", "请输入 5-15 位字母或数字。");
      return;
    }
    try {
      await mutateUser(`/ip/pairs?prefix=${encodeURIComponent(prefix)}`, "POST", form, "#createProxyUserMessage");
      closeDialog(document.querySelector("#createProxyUserDialog"));
      showToast("代理用户已创建");
      await openResource("users", true);
    } catch (error) {
      setDialogMessage("#createProxyUserMessage", error.message || "创建失败，请稍后重试");
    }
  });

  document.querySelector("#limitProxyUserForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const user = state.selectedUser;
    const limit = number(document.querySelector("#proxyUserLimit").value);
    if (!user || limit < 0) {
      setDialogMessage("#limitProxyUserMessage", "请输入不小于 0 的流量限额。");
      return;
    }
    try {
      await mutateUser(
        `/ip/pairs?id=${encodeURIComponent(user.id)}&limit=${encodeURIComponent(limit)}`,
        "PUT",
        form,
        "#limitProxyUserMessage"
      );
      closeDialog(document.querySelector("#limitProxyUserDialog"));
      showToast("代理用户限额已更新");
      await openResource("users", true);
    } catch (error) {
      setDialogMessage("#limitProxyUserMessage", error.message || "限额更新失败，请稍后重试");
    }
  });

  document.querySelector("#deleteProxyUserForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const user = state.selectedUser;
    if (!user) return;
    try {
      await mutateUser(
        `/ip/pairs?id=${encodeURIComponent(user.id)}`,
        "DELETE",
        form,
        "#deleteProxyUserMessage"
      );
      closeDialog(document.querySelector("#deleteProxyUserDialog"));
      state.revealedUsers.delete(user.id);
      showToast("代理用户已删除");
      await openResource("users", true);
    } catch (error) {
      setDialogMessage("#deleteProxyUserMessage", error.message || "删除失败，请稍后重试");
    }
  });
}

function bindResourceLinks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-resource-link]");
    if (!link) return;
    event.preventDefault();
    const view = link.dataset.resourceLink;
    document.querySelector(`[data-view="${view}"]`)?.click();
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.ConsoleResources = {
    open: openResource,
    reload: () => openResource(state.currentView || "packages", true),
    managePackage
  };
  bindPackageControls();
  bindUsageControls();
  bindUserControls();
  bindResourceLinks();

  const initialView = window.location.hash.slice(1);
  if (["packages", "users"].includes(initialView)) {
    openResource(initialView);
  }
  refreshIcons();
}

export {
  normalizeResourceData,
  packageBindOptions,
  packageActionRequest,
  packageCanRenew,
  packageResource,
  packageStatus,
  resolveProduct
};
