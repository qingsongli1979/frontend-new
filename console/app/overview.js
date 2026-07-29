const TOKEN_KEY = "token_key";
const LOGIN_PATH = "/login.html";
const REQUEST_TIMEOUT_MS = 12000;

const chargeTypeMeta = {
  trafficIp: {
    productKey: "tunnel",
    name: "隧道代理",
    icon: "shuffle",
    detail: (item) => `${formatNumber(item.traffInGB)}GB 流量套餐`
  },
  tunnelIp: {
    productKey: "tunnel",
    name: "隧道代理",
    icon: "shuffle",
    detail: (item) => `${formatNumber(item.total)} 并发线程`
  },
  tmpPackage: {
    productKey: "tunnel",
    name: "隧道代理",
    icon: "shuffle",
    detail: (item) => `${formatNumber(item.traffInGB)}GB 补充流量包`
  },
  durationIp: {
    productKey: "unlimited",
    name: "不限量动态住宅",
    icon: "refresh-cw",
    detail: (item) => `${formatNumber(item.total)} 端口套餐`
  },
  fixedIp: {
    productKey: "staticDatacenter",
    name: "长效静态代理",
    icon: "server",
    detail: (item) => `${formatNumber(item.total)} 个独享数据中心 IP`,
    staticType: "datacenter"
  },
  residentialStaticIp: {
    productKey: "staticResidential",
    name: "长效静态住宅",
    icon: "house-plug",
    detail: (item) => `${formatNumber(item.total)} 个独享住宅 ISP IP`,
    staticType: "residential"
  }
};

class OverviewRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "OverviewRequestError";
    this.status = status;
  }
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits,
    minimumFractionDigits: 0
  }).format(toNumber(value));
}

function formatMoney(value) {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(toNumber(value));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date).replaceAll("/", "-");
}

function daysUntil(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.ceil((timestamp - Date.now()) / 86400000));
}

function isExpired(item) {
  if ([true, "true", 1, "1"].includes(item?.overTime)) return true;
  const timestamp = new Date(item?.expirationTime).getTime();
  return Number.isFinite(timestamp) && timestamp < Date.now();
}

function unwrapTraffic(payload) {
  if (!payload || typeof payload !== "object") return {};
  return payload.res || payload.data || payload;
}

function orderKeys(order) {
  return [order?.orderId, order?.id, order?.referID]
    .filter(Boolean)
    .map(String);
}

function mergeLiveOrderData(history, liveOrders) {
  if (!Array.isArray(liveOrders) || !liveOrders.length) return history;
  const liveMap = new Map();
  liveOrders.forEach((order) => {
    orderKeys(order).forEach((key) => liveMap.set(key, order));
  });
  return history.map((order) => {
    const live = orderKeys(order).map((key) => liveMap.get(key)).find(Boolean);
    if (!live) return order;
    const merged = { ...live, ...order };
    if (live.remainingTrafficInKB !== undefined && live.remainingTrafficInKB !== null) {
      merged.remainTrafficInGB = Math.max(0, toNumber(live.remainingTrafficInKB) / 1000000);
    } else if (live.remainTrafficInGB !== undefined && live.remainTrafficInGB !== null) {
      merged.remainTrafficInGB = Math.max(0, toNumber(live.remainTrafficInGB));
    }
    return merged;
  });
}

function trafficKbToGb(value) {
  return toNumber(value) / 1000000;
}

function isResidentialMetered(item) {
  return item?.chargeType === "residentialDynamicIp" && toNumber(item.traffInGB) > 0;
}

function isMeteredOrder(item) {
  return ["trafficIp", "tmpPackage"].includes(item?.chargeType) || isResidentialMetered(item);
}

function remainingTrafficGb(item) {
  return Math.max(0, toNumber(item?.remainTrafficInGB));
}

function resolveChargeType(item) {
  if (item?.chargeType !== "residentialDynamicIp") {
    return chargeTypeMeta[item?.chargeType] || {
      productKey: "unknown",
      name: "代理套餐",
      icon: "package",
      detail: () => item?.chargeType || "标准套餐",
      route: "#packages"
    };
  }

  if (isResidentialMetered(item)) {
    return {
      productKey: "residential",
      name: "隧道住宅代理",
      icon: "globe-2",
      detail: (order) => `${formatNumber(order.traffInGB)}GB 流量套餐`
    };
  }

  return {
    productKey: "unlimited",
    name: "不限量动态住宅",
    icon: "refresh-cw",
    detail: (order) => `${formatNumber(order.total || 1)} 端口套餐`
  };
}

function resourceForOrder(item, meta, requiresAttention) {
  if (isMeteredOrder(item)) {
    const remaining = remainingTrafficGb(item);
    const total = toNumber(item.traffInGB);
    const ratio = total > 0 && remaining <= total * 1.05
      ? Math.min(100, Math.max(0, remaining / total * 100))
      : remaining > 0 ? 100 : 0;
    return {
      value: `${formatNumber(remaining)} GB`,
      note: "剩余代理流量",
      progress: ratio
    };
  }

  if (item.chargeType === "tunnelIp") {
    return {
      value: `${formatNumber(item.total)} 并发`,
      note: "不限累计流量",
      progress: 100
    };
  }

  if (["durationIp"].includes(item.chargeType)
      || (item.chargeType === "residentialDynamicIp" && toNumber(item.traffInGB) <= 0)) {
    return {
      value: `${formatNumber(item.total || 1)} 端口`,
      note: "不限流量与并发",
      progress: 100
    };
  }

  if (meta.staticType) {
    return {
      value: requiresAttention
        ? `${formatNumber(item.total || 1)} 个待提取`
        : `${formatNumber(item.total || 1)} 个 IP`,
      note: requiresAttention ? "尚未分配出口" : "套餐有效",
      progress: requiresAttention ? 8 : 100
    };
  }

  return {
    value: `${formatNumber(item.total)} 个`,
    note: "可用资源",
    progress: 100
  };
}

function packageView(item, pending) {
  const meta = resolveChargeType(item);
  let requiresAttention = false;

  if (meta.staticType === "datacenter" && pending.datacenter > 0) {
    requiresAttention = true;
    pending.datacenter = Math.max(0, pending.datacenter - toNumber(item.total || 1));
  }
  if (meta.staticType === "residential" && pending.residential > 0) {
    requiresAttention = true;
    pending.residential = Math.max(0, pending.residential - toNumber(item.total || 1));
  }

  const resource = resourceForOrder(item, meta, requiresAttention);
  const remainingDays = daysUntil(item.expirationTime);
  const reference = item.orderId || item.tradeNo || item.referID || "";
  const depleted = isMeteredOrder(item) && remainingTrafficGb(item) <= 0;
  const status = requiresAttention || depleted ? "attention" : "active";
  const statusLabel = requiresAttention ? "待提取" : depleted ? "已用完" : "使用中";
  const actionLabel = requiresAttention ? "提取" : depleted ? "购买流量" : "使用";
  const route = depleted
    ? `#purchase?product=${encodeURIComponent(meta.productKey)}`
    : `#extract?product=${encodeURIComponent(meta.productKey)}&order=${encodeURIComponent(reference)}`;

  return {
    id: String(reference),
    productKey: meta.productKey,
    name: meta.name,
    icon: meta.icon,
    detail: meta.detail(item),
    resource,
    expiry: formatDate(item.expirationTime),
    expiryNote: remainingDays === null ? "有效期以套餐为准" : `剩余 ${remainingDays} 天`,
    status,
    statusLabel,
    actionLabel,
    route,
    usable: !depleted,
    manageable: ![true, "true", 1, "1"].includes(item.present)
  };
}

function normalizeOverviewData(userPayload, trafficPayload, ordersPayload, livePayload = null) {
  const user = userPayload && typeof userPayload === "object" ? userPayload : {};
  const traffic = unwrapTraffic(trafficPayload);
  const liveTraffic = unwrapTraffic(livePayload);
  const historyOrders = Array.isArray(ordersPayload?.userOrderList)
    ? ordersPayload.userOrderList
    : Array.isArray(ordersPayload)
      ? ordersPayload
      : [];
  const orders = mergeLiveOrderData(
    historyOrders,
    Array.isArray(liveTraffic.orders)
      ? liveTraffic.orders
      : Array.isArray(traffic.orders) ? traffic.orders : []
  );
  const currentOrders = orders
    .filter((item) => !isExpired(item))
    .sort((a, b) => new Date(a.expirationTime).getTime() - new Date(b.expirationTime).getTime());
  const pending = {
    datacenter: toNumber(traffic.avaFixedIPs),
    residential: toNumber(traffic.avaZhuzhaiFixedIPs)
  };
  const packages = currentOrders.map((item) => packageView(item, pending));
  const usablePackages = packages.filter((item) => item.usable);
  const usableProductCount = new Set(usablePackages.map((item) => item.productKey)).size;
  const meteredTrafficGb =
    Math.max(0, trafficKbToGb(traffic.avaTrafficInKB))
      + Math.max(0, trafficKbToGb(traffic.avaZhuzhaiTrafficInKB));

  return {
    user: {
      name: String(user.name || user.username || ""),
      balance: toNumber(user.balance),
      accountType: user.parent ? "子账户" : "主账户"
    },
    resources: {
      currentPlans: currentOrders.length,
      usablePlans: usablePackages.length,
      depletedPlans: packages.length - usablePackages.length,
      usableProductCount,
      meteredTrafficGb,
      pendingDatacenter: toNumber(traffic.avaFixedIPs),
      pendingResidential: toNumber(traffic.avaZhuzhaiFixedIPs)
    },
    packages,
    totalPackageCount: orders.length
  };
}

function maskAccount(value) {
  const account = String(value || "");
  if (!account) return "控制台用户";
  const prefix = account.startsWith("u") ? "u" : "";
  const core = prefix ? account.slice(1) : account;
  if (core.length <= 7) return account;
  return `${prefix}${core.slice(0, 4)}****${core.slice(-4)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function apiBase() {
  const configured = window.__CONSOLE_CONFIG__?.apiBase;
  if (configured) return String(configured).replace(/\/$/, "");
  return window.location.origin;
}

function getAccessToken() {
  try {
    const value = window.localStorage.getItem(TOKEN_KEY);
    if (!value) return "";
    return JSON.parse(value)?.access_token || "";
  } catch {
    return "";
  }
}

function isLocalPreview() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function loginUrl() {
  const local = isLocalPreview();
  const next = encodeURIComponent(local ? "/console/app/" : "/app/");
  const path = local ? "/console/login.html" : LOGIN_PATH;
  return `${window.location.origin}${path}?next=${next}`;
}

async function request(path, token) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await window.fetch(`${apiBase()}${path}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "Accept-Language": "zh-CN,zh;q=0.5",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      throw new OverviewRequestError("登录状态已失效", response.status);
    }
    if (!response.ok) {
      throw new OverviewRequestError(`接口请求失败（${response.status}）`, response.status);
    }
    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new OverviewRequestError("请求超时，请稍后重试");
    }
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

function setNotice(type, message, action) {
  const notice = document.querySelector("#overviewNotice");
  if (!notice) return;
  if (!message) {
    notice.hidden = true;
    notice.textContent = "";
    return;
  }

  const icon = type === "error" ? "circle-alert" : "info";
  notice.className = `overview-notice is-${type}`;
  notice.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i><span>${escapeHtml(message)}</span>`
    + (action ? `<button type="button" id="overviewNoticeAction">${escapeHtml(action.label)}</button>` : "");
  notice.hidden = false;
  if (action) {
    notice.querySelector("#overviewNoticeAction")?.addEventListener("click", action.handler);
  }
  refreshIcons();
}

function renderAccount(data) {
  const displayName = maskAccount(data.user.name);
  document.querySelector("#topbarBalance").textContent = `¥${formatMoney(data.user.balance)}`;
  document.querySelector("#overviewBalance").textContent = formatMoney(data.user.balance);
  document.querySelector("#userDisplayName").textContent = displayName;
  document.querySelector("#userAccountType").textContent = data.user.accountType;
  document.querySelector("#userAvatar").textContent = (data.user.name || "U").slice(0, 1).toUpperCase();
}

function renderResources(data) {
  const resources = data.resources;
  const pendingTotal = resources.pendingDatacenter + resources.pendingResidential;
  document.querySelector("#overviewUsablePlans").textContent = formatNumber(resources.usablePlans, 0);
  document.querySelector("#overviewProductCoverage").textContent = resources.usablePlans
    ? `覆盖 ${formatNumber(resources.usableProductCount, 0)} 类代理产品`
    : "暂无有效套餐";
  document.querySelector("#overviewTraffic").textContent = formatNumber(resources.meteredTrafficGb);

  const action = document.querySelector("#pendingResourceAction");
  const text = document.querySelector("#pendingResourceText");
  const button = document.querySelector("#pendingResourceButton");
  action.classList.toggle("is-clear", pendingTotal === 0);

  if (pendingTotal === 0) {
    text.textContent = "0 个";
    button.disabled = true;
    button.dataset.url = "";
  } else {
    const parts = [];
    if (resources.pendingDatacenter) parts.push(`数据中心 ${formatNumber(resources.pendingDatacenter, 0)}`);
    if (resources.pendingResidential) parts.push(`住宅 ${formatNumber(resources.pendingResidential, 0)}`);
    text.textContent = `${formatNumber(pendingTotal, 0)} 个 · ${parts.join(" / ")}`;
    button.disabled = false;
    const pendingPackage = data.packages.find((item) => item.status === "attention");
    button.dataset.url = pendingPackage?.route || "#packages";
  }

  document.querySelector("#overviewResourceStrip").setAttribute("aria-busy", "false");
}

function packageRowMarkup(item) {
  const progressClass = item.status === "attention" ? " class=\"is-waiting\"" : "";
  const statusClass = item.status === "attention" ? "is-waiting" : "is-active";

  return `
    <div class="package-row" role="row" data-status="${item.status}" data-package-id="${escapeHtml(item.id)}">
      <div class="package-name" role="cell">
        <span class="product-symbol"><i data-lucide="${item.icon}" aria-hidden="true"></i></span>
        <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail)}</small></span>
      </div>
      <div class="resource-progress" role="cell">
        <span><strong>${escapeHtml(item.resource.value)}</strong><small>${escapeHtml(item.resource.note)}</small></span>
        <div${progressClass}><i style="width:${item.resource.progress}%"></i></div>
      </div>
      <div class="expiry" role="cell">
        <strong>${escapeHtml(item.expiry)}</strong>
        <small>${escapeHtml(item.expiryNote)}</small>
      </div>
      <div role="cell"><span class="status ${statusClass}"><i></i>${escapeHtml(item.statusLabel)}</span></div>
      <div class="row-actions" role="cell">
        <a class="button-mini is-primary" href="${escapeHtml(item.route)}">${escapeHtml(item.actionLabel)}</a>
        ${item.manageable
          ? `<button class="button-mini is-secondary overview-package-manage" type="button"
              data-overview-package-manage="${escapeHtml(item.id)}" aria-haspopup="dialog">管理</button>`
          : '<span class="package-gift-label">系统赠送</span>'}
      </div>
    </div>`;
}

function renderPackages(data) {
  const rows = document.querySelector("#overviewPackageRows");
  const packages = data.packages;
  const countParts = [`${formatNumber(data.resources.usablePlans, 0)} 个可用`];
  if (data.resources.depletedPlans) {
    countParts.push(`${formatNumber(data.resources.depletedPlans, 0)} 个已用完`);
  }
  countParts.push(`共 ${formatNumber(data.totalPackageCount, 0)} 条记录`);
  document.querySelector("#overviewPackageCount").textContent = countParts.join(" · ");
  document.querySelector('[data-view="packages"] em')?.replaceChildren(
    document.createTextNode(formatNumber(data.resources.usablePlans, 0))
  );

  if (!packages.length) {
    rows.innerHTML = `
      <div class="package-state-row" role="row">
        <i data-lucide="package-open" aria-hidden="true"></i>
        <span>当前没有有效代理套餐</span>
        <a href="#purchase?product=tunnel">购买套餐</a>
      </div>`;
  } else {
    rows.innerHTML = packages.map(packageRowMarkup).join("");
  }
  document.querySelector("#overviewPackageTable").setAttribute("aria-busy", "false");
  refreshIcons();
}

let quickPackages = [];

function renderQuickPackage(index) {
  const current = quickPackages[index];
  const summary = document.querySelector("#quickPackageSummary");
  const useButton = document.querySelector("#quickUseButton");

  if (!current) {
    summary.innerHTML = "<small>套餐状态</small><strong>暂无可用套餐</strong><span>购买后可从这里进入代理提取</span>";
    useButton.disabled = true;
    useButton.dataset.url = "";
    return;
  }

  summary.innerHTML = `
    <small>${escapeHtml(current.name)}</small>
    <strong>${escapeHtml(current.resource.value)}</strong>
    <span>${escapeHtml(current.detail)} · ${escapeHtml(current.expiryNote)}</span>`;
  useButton.disabled = false;
  useButton.dataset.url = current.route;
}

function renderQuickStart(data) {
  quickPackages = data.packages.filter((item) => item.usable);
  const select = document.querySelector("#quickPackageSelect");

  if (!quickPackages.length) {
    select.innerHTML = "<option>暂无有效套餐</option>";
    select.disabled = true;
    renderQuickPackage(-1);
    return;
  }

  select.innerHTML = quickPackages.map((item, index) => (
    `<option value="${index}">${escapeHtml(item.name)} · ${escapeHtml(item.resource.value)}</option>`
  )).join("");
  select.disabled = false;
  renderQuickPackage(0);
}

function renderLoadFailure(message) {
  document.querySelector("#overviewResourceStrip").setAttribute("aria-busy", "false");
  document.querySelector("#overviewPackageTable").setAttribute("aria-busy", "false");
  document.querySelector("#overviewPackageRows").innerHTML = `
    <div class="package-state-row is-error" role="row">
      <i data-lucide="circle-alert" aria-hidden="true"></i>
      <span>${escapeHtml(message)}</span>
    </div>`;
  refreshIcons();
}

function renderUnavailableState(label) {
  document.querySelector("#topbarBalance").textContent = "¥--";
  document.querySelector("#userDisplayName").textContent = label;
  document.querySelector("#userAccountType").textContent = "控制台账户";
  document.querySelector("#overviewBalance").textContent = "--";
  document.querySelector("#overviewUsablePlans").textContent = "--";
  document.querySelector("#overviewProductCoverage").textContent = "登录后查看套餐";
  document.querySelector("#overviewTraffic").textContent = "--";
  document.querySelector("#overviewPackageCount").textContent = "--";
  document.querySelector("#overviewResourceStrip").setAttribute("aria-busy", "false");

  const pendingAction = document.querySelector("#pendingResourceAction");
  pendingAction.classList.add("is-clear");
  document.querySelector("#pendingResourceText").textContent = "登录后查看待处理资源";
  const pendingButton = document.querySelector("#pendingResourceButton");
  pendingButton.disabled = true;
  pendingButton.dataset.url = "";

  const select = document.querySelector("#quickPackageSelect");
  select.innerHTML = "<option>登录后加载套餐</option>";
  select.disabled = true;
  quickPackages = [];
  renderQuickPackage(-1);
  document.querySelector("#quickPackageSummary").innerHTML =
    "<small>套餐状态</small><strong>登录后加载</strong><span>登录后可直接进入对应代理提取页面</span>";
}

async function loadOverview() {
  const token = getAccessToken();
  if (!token) {
    if (!isLocalPreview()) {
      window.location.replace(loginUrl());
      return;
    }
    const message = "本地预览未检测到控制台登录态，部署到 console.123proxy.cn 后将自动读取登录 Token。";
    setNotice("info", message, {
      label: "前往登录",
      handler: () => { window.location.href = loginUrl(); }
    });
    renderUnavailableState("未登录");
    renderLoadFailure("登录后加载真实套餐");
    return;
  }

  setNotice("", "");

  try {
    const [userPayload, trafficPayload, livePayload, ordersPayload] = await Promise.all([
      request("/accsrv/information", token),
      request("/ip/mytraffic", token),
      request("/ip/ava_traffic/", token).catch(() => null),
      request("/ip/getorder/", token)
    ]);
    const data = normalizeOverviewData(userPayload, trafficPayload, ordersPayload, livePayload);
    renderAccount(data);
    renderResources(data);
    renderPackages(data);
    renderQuickStart(data);
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      window.localStorage.removeItem(TOKEN_KEY);
      if (!isLocalPreview()) {
        window.location.replace(loginUrl());
        return;
      }
    }

    const message = error?.message || "概览数据加载失败，请稍后重试";
    setNotice("error", message, { label: "重新加载", handler: loadOverview });
    renderUnavailableState("暂不可用");
    renderLoadFailure(message);
  }
}

function bindOverviewActions() {
  document.querySelector("#rechargeButton")?.addEventListener("click", () => {
    window.location.hash = "#billing";
  });
  document.querySelector("#buyPackageButton")?.addEventListener("click", () => {
    window.location.hash = "#purchase?product=tunnel";
  });
  document.querySelector("#pendingResourceButton")?.addEventListener("click", (event) => {
    const url = event.currentTarget.dataset.url;
    if (url) window.location.hash = url.startsWith("#") ? url : `#${url}`;
  });
  document.querySelector("#quickPackageSelect")?.addEventListener("change", (event) => {
    renderQuickPackage(Number(event.currentTarget.value));
  });
  document.querySelector("#quickUseButton")?.addEventListener("click", (event) => {
    const url = event.currentTarget.dataset.url;
    if (url) window.location.hash = url.startsWith("#") ? url : `#${url}`;
  });
  document.querySelector("#overviewPackageRows")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-overview-package-manage]");
    if (!button) return;
    const packageId = button.dataset.overviewPackageManage;
    if (!window.ConsoleResources?.managePackage) {
      window.location.hash = "#packages";
      return;
    }
    button.disabled = true;
    try {
      await window.ConsoleResources.managePackage(packageId);
    } catch (error) {
      setNotice("error", error?.message || "套餐管理加载失败，请稍后重试", {
        label: "查看所有套餐",
        handler: () => { window.location.hash = "#packages"; }
      });
    } finally {
      button.disabled = false;
    }
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.ConsoleOverview = {
    reload: loadOverview,
    normalizeOverviewData
  };
  bindOverviewActions();
  loadOverview();
}

export {
  formatDate,
  maskAccount,
  normalizeOverviewData,
  resolveChargeType
};
