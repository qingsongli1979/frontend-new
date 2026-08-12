const TOKEN_KEY = "token_key";
const REQUEST_TIMEOUT_MS = 12000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const TRIAL_CONTACT_URL = "https://www.123proxy.cn/contact.html?intent=trial#service";

const PRODUCT_CATALOG = {
  tunnel: {
    name: "隧道代理",
    description: "固定隧道入口连接全球随机出口，支持爬虫混合池与纯住宅池。",
    facts: [["出口范围", "默认全球随机"], ["计费方式", "流量 / 并发线程"], ["代理池", "混合池 / 纯住宅池"]],
    chargeTypes: ["trafficIp", "tunnelIp"],
    pricing: "tunnel",
    plist: 1,
    icon: "shuffle",
    trial: true,
    purchaseNote: "按流量或并发线程购买；出口地区、代理池与 SESSION 在使用时设置。"
  },
  residential: {
    name: "隧道住宅代理",
    description: "8000 万+住宅代理池，支持按国家或地区定位与 SESSION。",
    facts: [["住宅 IP 池", "8000 万+"], ["覆盖范围", "190+ 国家/地区"], ["计费方式", "仅按流量"]],
    chargeTypes: ["residentialDynamicIp"],
    pricing: "residential",
    plist: 2,
    icon: "globe-2",
    trial: true,
    purchaseNote: "地区与 SESSION 在代理提取时选择，不在购买时锁定。"
  },
  unlimited: {
    name: "不限量动态住宅",
    description: "按端口使用的动态住宅代理，每个端口不限流量、不限并发。",
    facts: [["计费单位", "代理端口"], ["流量与并发", "均不限制"], ["出口轮转", "3-30 分钟"]],
    chargeTypes: ["durationIp", "residentialDynamicIp"],
    pricing: "unlimited",
    plist: 4,
    icon: "refresh-cw",
    trial: true,
    purchaseNote: "地区按套餐统一设置，端口出口在 3-30 分钟内固定后自动轮转。"
  },
  staticDatacenter: {
    name: "长效静态代理",
    description: "独享固定数据中心 IP，适合长期稳定出口与固定网络身份。",
    facts: [["计费单位", "独享 IP"], ["出口类型", "数据中心"], ["免费测试", "不提供"]],
    chargeTypes: ["fixedIp"],
    pricing: "static-datacenter",
    plist: 0,
    icon: "server",
    trial: false,
    purchaseNote: "购买只确定 IP 数量和时长，国家或地区在代理提取时选择。"
  },
  staticResidential: {
    name: "长效静态住宅",
    description: "独享住宅 ISP IP，在套餐有效期内保持固定住宅网络身份。",
    facts: [["计费单位", "独享 IP"], ["出口类型", "住宅 ISP"], ["免费测试", "不提供"]],
    chargeTypes: ["residentialStaticIp"],
    pricing: "static-residential",
    plist: 3,
    icon: "house-plug",
    trial: false,
    purchaseNote: "购买只确定 IP 数量和时长，国家或地区在代理提取时选择。"
  },
  bandwidth: {
    name: "高带宽代理 IP",
    description: "面向 AI 数据下载、视频、图片与代码采集任务的不限流量定制代理池。",
    facts: [["单项目带宽", "10Gbps+"], ["计费方式", "项目制"], ["代理资源", "定制代理池"]],
    chargeTypes: [],
    pricing: "",
    route: "",
    icon: "gauge",
    trial: false,
    enterprise: true,
    purchaseNote: "根据目标站点、并发、区域与任务规模配置专属带宽和代理资源。"
  }
};

const PRODUCT_DOCUMENTATION = {
  tunnel: "https://www.123proxy.cn/developers/products/scraping-rotating-proxy/",
  residential: "https://www.123proxy.cn/developers/products/residential-rotating-proxy/",
  unlimited: "https://www.123proxy.cn/developers/products/unlimited-residential-proxy/",
  staticDatacenter: "https://www.123proxy.cn/developers/products/static-datacenter-proxy/",
  staticResidential: "https://www.123proxy.cn/developers/products/static-residential-proxy/",
  bandwidth: "https://www.123proxy.cn/developers/"
};

const state = {
  loaded: false,
  loadingPromise: null,
  traffic: null,
  orders: [],
  users: [],
  currentProduct: "",
  selectedByProduct: new Map()
};

function isLocalPreview() {
  return LOCAL_HOSTS.has(window.location.hostname);
}

function apiBase() {
  const configured = window.__CONSOLE_CONFIG__?.apiBase;
  if (configured) return String(configured).replace(/\/$/, "");
  return window.location.origin;
}

function loginUrl() {
  const next = isLocalPreview()
    ? `/console/app/${window.location.hash || ""}`
    : `/app/${window.location.hash || ""}`;
  const path = isLocalPreview() ? "/console/login.html" : "/login.html";
  return `${window.location.origin}${path}?next=${encodeURIComponent(next)}`;
}

function getAccessToken() {
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw)?.access_token || "" : "";
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
    const raw = await response.text();
    let payload = raw;
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = raw;
    }
    if (!response.ok) {
      const error = new Error(payload?.message || payload?.error_description || `请求失败（${response.status}）`);
      error.status = response.status;
      throw error;
    }
    return payload;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("代理产品数据加载超时，请稍后重试");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function normalizeProductTraffic(payload, orderPayload = null) {
  const source = payload?.res || payload?.data || payload || {};
  const orders = Array.isArray(source.orders) ? source.orders : [];
  const users = Array.isArray(source.users) ? source.users : [];
  const historySource = orderPayload?.res || orderPayload?.data || orderPayload || {};
  const history = Array.isArray(historySource.userOrderList)
    ? historySource.userOrderList
    : (Array.isArray(historySource) ? historySource : []);
  const staticHistory = history
    .filter((order) => ["fixedIp", "residentialStaticIp"].includes(order?.chargeType))
    .filter((order) => !order?.overTime)
    .filter((order) => {
      if (!order?.expirationTime) return true;
      const value = new Date(String(order.expirationTime).replace(" ", "T")).getTime();
      return Number.isNaN(value) || value > Date.now();
    })
    .map((order) => ({
      ...order,
      id: order.orderId,
      amount: order.remainAmount ?? order.total,
      totalTrafficInGB: order.traffInGB,
      remainingTrafficInKB: number(order.remainTrafficInGB) * 1000000,
      expiration: order.expirationTime
    }));
  const activeOrders = orders.filter((order) => !order?.overTime);
  const activeKeys = new Set(activeOrders.map((order) => `${order.chargeType}:${order.referID || packageId(order)}`));
  staticHistory.forEach((order) => {
    const key = `${order.chargeType}:${order.referID || packageId(order)}`;
    if (!activeKeys.has(key)) activeOrders.push(order);
  });
  return {
    traffic: source,
    orders: activeOrders,
    users
  };
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInteger(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(number(value));
}

function formatGbFromKb(value) {
  const gb = Math.max(0, number(value)) / 1000000;
  return `${new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(gb)} GB`;
}

function formatDate(value) {
  if (!value) return "未提供";
  const normalized = typeof value === "number" && value < 100000000000
    ? value * 1000
    : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date).replaceAll("/", "-");
}

function isResidentialTraffic(order) {
  return order?.chargeType === "residentialDynamicIp"
    && number(order.totalTrafficInGB ?? order.traffInGB) > 0;
}

function matchesProduct(order, productKey) {
  if (!order) return false;
  if (productKey === "residential") return isResidentialTraffic(order);
  if (productKey === "unlimited") {
    return order.chargeType === "durationIp"
      || (order.chargeType === "residentialDynamicIp" && !isResidentialTraffic(order));
  }
  return PRODUCT_CATALOG[productKey]?.chargeTypes.includes(order.chargeType) || false;
}

function packageName(order) {
  switch (order.chargeType) {
    case "trafficIp":
      return `隧道代理 · ${formatInteger(order.totalTrafficInGB || order.total)}GB 流量`;
    case "tunnelIp":
      return `隧道代理 · ${formatInteger(order.total)} 并发线程`;
    case "residentialDynamicIp":
      return isResidentialTraffic(order)
        ? `隧道住宅代理 · ${formatInteger(order.totalTrafficInGB || order.traffInGB)}GB 流量`
        : `不限量动态住宅 · ${formatInteger(order.total)} 个端口`;
    case "durationIp":
      return `不限量动态住宅 · ${formatInteger(order.total)} 个端口`;
    case "fixedIp":
      return `长效静态代理 · ${formatInteger(order.total)} 个 IP`;
    case "residentialStaticIp":
      return `长效静态住宅 · ${formatInteger(order.total)} 个 IP`;
    default:
      return "代理套餐";
  }
}

function packageAvailable(order) {
  if (["trafficIp", "residentialDynamicIp"].includes(order.chargeType) && isResidentialTraffic(order)) {
    return formatGbFromKb(order.remainingTrafficInKB);
  }
  if (order.chargeType === "trafficIp") return formatGbFromKb(order.remainingTrafficInKB);
  if (order.chargeType === "tunnelIp") return `${formatInteger(order.total)} 并发线程`;
  if (order.chargeType === "durationIp" || (order.chargeType === "residentialDynamicIp" && !isResidentialTraffic(order))) {
    const start = number(order.portStart);
    const count = Math.max(1, number(order.total));
    const range = start ? ` · ${start}-${start + count - 1}` : "";
    return `${formatInteger(order.total)} 个端口${range}`;
  }
  if (["fixedIp", "residentialStaticIp"].includes(order.chargeType)) {
    return `${formatInteger(order.amount ?? order.total)} 个待提取`;
  }
  return "可使用";
}

function packageId(order) {
  return String(order?.id ?? order?.orderId ?? "");
}

function packageExpiry(order) {
  return formatDate(order.expirationStr || order.expiration || order.expirationTime);
}

function isUsablePackage(order) {
  if (order?.chargeType === "trafficIp" || isResidentialTraffic(order)) {
    return number(order.remainingTrafficInKB) > 0;
  }
  return true;
}

function productOrders(productKey) {
  return state.orders
    .filter((order) => matchesProduct(order, productKey))
    .sort((left, right) => Number(isUsablePackage(right)) - Number(isUsablePackage(left)));
}

function setNotice(type, message, action) {
  const notice = document.querySelector("#productNotice");
  if (!notice) return;
  notice.hidden = !message;
  notice.className = `overview-notice${type ? ` is-${type}` : ""}`;
  notice.innerHTML = message
    ? `<i data-lucide="${type === "error" ? "circle-alert" : "info"}" aria-hidden="true"></i>
       <span>${escapeHtml(message)}</span>
       ${action ? `<button type="button" id="productNoticeAction">${escapeHtml(action.label)}</button>` : ""}`
    : "";
  if (action) document.querySelector("#productNoticeAction")?.addEventListener("click", action.handler);
  refreshIcons();
}

function renderMetadata(product) {
  document.querySelector("#productTitle").textContent = product.name;
  document.querySelector("#productDescription").textContent = product.description;
  product.facts.forEach((fact, index) => {
    const suffix = ["One", "Two", "Three"][index];
    document.querySelector(`#productFact${suffix}Label`).textContent = fact[0];
    document.querySelector(`#productFact${suffix}`).textContent = fact[1];
  });
  document.querySelector("#purchasePanelTitle").textContent = product.enterprise
    ? "获取高带宽代理方案"
    : `购买${product.name}`;
  document.querySelector(".purchase-panel-footer span").innerHTML =
    `<i data-lucide="info" aria-hidden="true"></i>${escapeHtml(product.purchaseNote)}`;
}

function renderLoading(product) {
  document.querySelector("#productResourceDescription").textContent = "正在读取当前账户的有效套餐";
  document.querySelector("#currentProductResource").innerHTML = `
    <div class="product-state">
      <span class="loading-spinner" aria-hidden="true"></span>
      <strong>正在加载${escapeHtml(product.name)}套餐</strong>
      <small>读取套餐余量和有效期</small>
    </div>`;
  setProductActions(null, product);
  refreshIcons();
}

function renderEmpty(product) {
  const isEnterprise = product.enterprise;
  document.querySelector("#productResourceDescription").textContent = isEnterprise
    ? "项目资源由技术团队评估后配置"
    : "当前账户没有该产品的有效套餐";
  document.querySelector("#currentProductResource").innerHTML = `
    <div class="empty-product-resource">
      <span><i data-lucide="${product.icon}" aria-hidden="true"></i></span>
      <h3>${isEnterprise ? "提交任务需求，获取专属代理方案" : `尚无可用${escapeHtml(product.name)}套餐`}</h3>
      <p>${isEnterprise ? "根据目标站点、并发和数据规模配置资源" : "购买标准套餐后即可进入代理提取与配置"}</p>
    </div>`;
  setProductActions(null, product);
  refreshIcons();
}

function renderError(product, message) {
  document.querySelector("#productResourceDescription").textContent = "套餐暂时无法读取";
  document.querySelector("#currentProductResource").innerHTML = `
    <div class="product-state is-error">
      <i data-lucide="circle-alert" aria-hidden="true"></i>
      <strong>套餐加载失败</strong>
      <small>${escapeHtml(message)}</small>
    </div>`;
  setProductActions(null, product);
  refreshIcons();
}

function renderPackages(productKey, product, orders) {
  let selectedId = state.selectedByProduct.get(productKey);
  if (!orders.some((order) => packageId(order) === selectedId)) {
    selectedId = packageId(orders.find(isUsablePackage) || orders[0]);
    state.selectedByProduct.set(productKey, selectedId);
  }
  const selected = orders.find((order) => packageId(order) === selectedId) || orders[0];
  const usableCount = orders.filter(isUsablePackage).length;

  document.querySelector("#productResourceDescription").textContent =
    usableCount === orders.length
      ? `${orders.length} 个可用套餐，选择后进入对应代理提取页`
      : `${usableCount} 个可用套餐，${orders.length - usableCount} 个套餐资源已用完`;
  document.querySelector("#currentProductResource").innerHTML = `
    <div class="product-package-list">
      ${orders.map((order) => {
        const id = packageId(order);
        const active = id === selectedId;
        const usable = isUsablePackage(order);
        return `<button class="product-package-row${active ? " is-selected" : ""}${usable ? "" : " is-unavailable"}" type="button" data-package-id="${escapeHtml(id)}" aria-pressed="${active}">
          <span class="package-radio" aria-hidden="true"></span>
          <span class="product-package-main">
            <small>套餐</small>
            <strong>${escapeHtml(packageName(order))}</strong>
            ${usable ? "" : "<em>资源已用完</em>"}
          </span>
          <span>
            <small>可用资源</small>
            <strong>${escapeHtml(packageAvailable(order))}</strong>
          </span>
          <span>
            <small>有效期至</small>
            <strong>${escapeHtml(packageExpiry(order))}</strong>
          </span>
        </button>`;
      }).join("")}
    </div>`;
  setProductActions(isUsablePackage(selected) ? selected : null, product);
  refreshIcons();
}

function pricingUrl(product) {
  if (product.enterprise) return "https://www.123proxy.cn/high-bandwidth-proxy.html";
  return `https://www.123proxy.cn/pricing.html?product=${encodeURIComponent(product.pricing)}`;
}

function purchaseUrl(productKey, product) {
  return product.enterprise
    ? "https://www.123proxy.cn/contact.html#solutions"
    : `#purchase?product=${encodeURIComponent(productKey)}`;
}

function renderPurchaseOptions(productKey, product) {
  const options = product.enterprise
    ? [
        ["任务评估", "提供目标站点、并发、区域和数据规模", "提交需求", purchaseUrl(productKey, product), true]
      ]
    : [
        ...(product.trial
          ? [["免费测试", "使用真实目标站点验证成功率和接入方式", "申请测试", TRIAL_CONTACT_URL, true]]
          : []),
        ["标准套餐", "查看当前产品的实时套餐与价格", "选择套餐", purchaseUrl(productKey, product), !product.trial],
        ["产品与计费说明", "比较计费方式、地区能力与适用任务", "查看价格", pricingUrl(product), false]
      ];

  document.querySelector("#purchaseOptionList").innerHTML = options.map((option) => `
    <div class="purchase-option${option[4] ? " is-primary" : ""}${product.enterprise ? " is-enterprise" : ""}">
      <div><strong>${escapeHtml(option[0])}</strong><small>${escapeHtml(option[1])}</small></div>
      <a href="${escapeHtml(option[3])}"${option[3].startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(option[2])}<i data-lucide="arrow-right" aria-hidden="true"></i></a>
    </div>`).join("");
}

function setProductActions(order, product) {
  const isStatic = ["staticDatacenter", "staticResidential"].includes(state.currentProduct);
  const useAction = document.querySelector("#productUseAction");
  const usageAction = document.querySelector("#productUsageAction");
  const authAction = document.querySelector("#productAuthAction");
  const extractAction = document.querySelector("#productExtractAction");
  const primaryAction = document.querySelector("#productPrimaryAction");
  const docsAction = document.querySelector("#productDocsAction");

  useAction.disabled = !order;
  useAction.dataset.url = order
    ? `#extract?product=${encodeURIComponent(state.currentProduct)}&order=${encodeURIComponent(packageId(order))}`
    : "";
  useAction.querySelector("strong").textContent = product.enterprise ? "方案配置" : "提取代理";
  useAction.querySelector("small").textContent = order
    ? "配置接入地址、认证、出口与代码示例"
    : (product.enterprise ? "由技术团队完成资源配置" : "购买套餐后可使用");

  extractAction.hidden = !order || product.enterprise;
  extractAction.dataset.url = order
    ? `#extract?product=${encodeURIComponent(state.currentProduct)}&order=${encodeURIComponent(packageId(order))}`
    : "";

  usageAction.disabled = false;
  usageAction.dataset.url = "#packages";
  usageAction.querySelector("strong").textContent = "全部套餐";
  usageAction.querySelector("small").textContent = "查看有效套餐与历史记录";

  authAction.disabled = product.enterprise || isStatic;
  authAction.dataset.url = product.enterprise || isStatic ? "" : "#users";
  authAction.querySelector("strong").textContent = isStatic ? "账密认证" : "代理用户";
  authAction.querySelector("small").textContent = product.enterprise
    ? "项目认证由技术团队协助配置"
    : isStatic
      ? "静态代理仅支持提取后分配的代理账密"
      : "管理代理账户，套餐白名单在提取页设置";

  primaryAction.innerHTML = `<i data-lucide="${product.enterprise ? "messages-square" : "shopping-cart"}" aria-hidden="true"></i>${product.enterprise ? "获取方案" : "购买套餐"}`;
  primaryAction.dataset.url = purchaseUrl(state.currentProduct, product);
  primaryAction.classList.toggle("button-primary", !order || product.enterprise);
  primaryAction.classList.toggle("button-secondary", Boolean(order) && !product.enterprise);
  docsAction.dataset.url = PRODUCT_DOCUMENTATION[state.currentProduct]
    || "https://www.123proxy.cn/developers/";
}

async function ensureData() {
  if (state.loaded) return state;
  if (state.loadingPromise) return state.loadingPromise;

  const token = getAccessToken();
  if (!token) {
    const error = new Error("登录后加载真实套餐");
    error.code = "NO_TOKEN";
    throw error;
  }

  state.loadingPromise = Promise.all([
    request("/ip/ava_traffic/", token),
    request("/ip/getorder/", token)
  ])
    .then(([trafficPayload, orderPayload]) => {
      const normalized = normalizeProductTraffic(trafficPayload, orderPayload);
      state.traffic = normalized.traffic;
      state.orders = normalized.orders;
      state.users = normalized.users;
      state.loaded = true;
      return state;
    })
    .finally(() => {
      state.loadingPromise = null;
    });
  return state.loadingPromise;
}

async function openProduct(productKey) {
  const product = PRODUCT_CATALOG[productKey];
  if (!product) return;
  state.currentProduct = productKey;

  renderMetadata(product);
  renderPurchaseOptions(productKey, product);
  setNotice("", "");

  if (product.enterprise) {
    renderEmpty(product);
    refreshIcons();
    return;
  }

  renderLoading(product);
  try {
    await ensureData();
    if (state.currentProduct !== productKey) return;
    const orders = productOrders(productKey);
    if (orders.length) renderPackages(productKey, product, orders);
    else renderEmpty(product);
  } catch (error) {
    if (state.currentProduct !== productKey) return;
    if (error.code === "NO_TOKEN") {
      renderEmpty(product);
      setNotice("info", "登录后可查看真实套餐余量并进入代理提取。", {
        label: "前往登录",
        handler: () => { window.location.href = loginUrl(); }
      });
    } else {
      if ([401, 403].includes(error.status) && !isLocalPreview()) {
        window.location.replace(loginUrl());
        return;
      }
      renderError(product, error.message || "请稍后重试");
      setNotice("error", error.message || "产品数据加载失败", {
        label: "重新加载",
        handler: reload
      });
    }
  }
  refreshIcons();
}

function reload() {
  state.loaded = false;
  state.traffic = null;
  state.orders = [];
  return openProduct(state.currentProduct);
}

function bindActions() {
  document.querySelector("#currentProductResource")?.addEventListener("click", (event) => {
    const row = event.target.closest("[data-package-id]");
    if (!row || !state.currentProduct) return;
    state.selectedByProduct.set(state.currentProduct, row.dataset.packageId);
    const product = PRODUCT_CATALOG[state.currentProduct];
    renderPackages(state.currentProduct, product, productOrders(state.currentProduct));
  });

  ["#productUseAction", "#productUsageAction", "#productAuthAction", "#productExtractAction", "#productPrimaryAction", "#productDocsAction"]
    .forEach((selector) => {
      document.querySelector(selector)?.addEventListener("click", (event) => {
        const target = event.currentTarget;
        if (target.disabled || !target.dataset.url) return;
        if (target.dataset.url.startsWith("#")) {
          window.location.hash = target.dataset.url;
          return;
        }
        window.location.href = target.dataset.url;
      });
    });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.ConsoleProducts = {
    open: openProduct,
    reload
  };

  bindActions();

  const initialProduct = [...document.querySelectorAll("[data-product]")]
    .find((item) => item.getAttribute("href") === window.location.hash)?.dataset.product;
  if (initialProduct) openProduct(initialProduct);
}

export {
  formatDate,
  matchesProduct,
  normalizeProductTraffic,
  packageAvailable,
  packageName
};
