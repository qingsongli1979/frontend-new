import {
  clearPendingPayment,
  extractPaymentTradeNo,
  loadPendingPayment,
  openPaymentWindow,
  renderQrCode,
  savePendingPayment,
  submitPaymentHtml
} from "./payment.js?v=20260804-01";

const TOKEN_KEY = "token_key";
const REQUEST_TIMEOUT_MS = 15000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const PERIODS = {
  d: { label: "1 天", ratio: 1.5 / 30, months: 1 / 30 },
  w: { label: "1 周", ratio: 1.25 / 4, months: 0.25 },
  m: { label: "1 个月", ratio: 1, months: 1 },
  "3m": { label: "3 个月", ratio: 0.9 * 3, months: 3, badge: "9 折" },
  "6m": { label: "6 个月", ratio: 0.8 * 6, months: 6, badge: "8 折" },
  "12m": { label: "12 个月", ratio: 0.8 * 12, months: 12, badge: "8 折" }
};

const PRODUCTS = {
  tunnel: {
    name: "隧道代理",
    icon: "shuffle",
    note: "默认全球随机。代理池、粗粒度地区与 SESSION 均在提取代理时设置。",
    trial: "5 并发线程 4 小时，或 800MB 流量",
    types: [
      { key: "tunnelIp", label: "按并发线程", detail: "不限流量，按同时在途请求数计费", periods: ["d", "w", "m", "3m", "6m"] },
      { key: "trafficIp", label: "按流量", detail: "按实际代理传输流量扣减", periods: ["m", "3m", "6m"] }
    ]
  },
  residential: {
    name: "隧道住宅代理",
    icon: "globe-2",
    note: "仅按流量购买。国家或地区与 SESSION 在提取代理时选择。",
    trial: "200MB 住宅代理流量",
    types: [
      { key: "residentialDynamicIp", label: "住宅流量", detail: "8000 万+住宅 IP，覆盖 190+ 国家和地区", periods: ["m", "3m", "6m", "12m"] }
    ]
  },
  unlimited: {
    name: "不限量动态住宅",
    icon: "refresh-cw",
    note: "按端口购买，每个端口不限流量与并发。地区与 3-30 分钟轮转周期在提取时按套餐设置。",
    trial: "5 个端口 2 小时",
    types: [
      { key: "durationIp", label: "不限量端口", detail: "每个端口不限流量、不限并发", periods: ["w", "m", "3m", "6m"] }
    ]
  },
  staticDatacenter: {
    name: "长效静态代理",
    icon: "server",
    note: "购买只确定 IP 数量和时长；国家或地区在提取时按实时库存选择。不提供免费测试。",
    trial: "",
    types: [
      { key: "fixedIp", label: "独享数据中心 IP", detail: "固定出口，不限流量", periods: ["m", "3m", "6m", "12m"] }
    ]
  },
  staticResidential: {
    name: "长效静态住宅",
    icon: "house-plug",
    note: "购买只确定 IP 数量和时长；国家或地区在提取时按实时库存选择。不提供免费测试。",
    trial: "",
    types: [
      { key: "residentialStaticIp", label: "独享住宅 ISP IP", detail: "固定住宅网络身份，不限流量", periods: ["m", "3m", "6m", "12m"] }
    ]
  }
};

const state = {
  offers: [],
  user: null,
  productKey: "tunnel",
  typeKey: "tunnelIp",
  offerId: "",
  period: "m",
  loaded: false,
  paymentOrder: "",
  paymentTradeNo: "",
  paymentTimer: null,
  orders: [],
  orderStatusFilter: "",
  orderProductFilter: "",
  orderKeyword: "",
  orderPage: 1,
  orderPageSize: 10
};

class CommerceRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "CommerceRequestError";
    this.status = status;
  }
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMoney(value) {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number(value));
}

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(typeof value === "number" ? value : String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date).replaceAll("/", "-");
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

async function request(path, options = {}) {
  const token = getAccessToken();
  if (!token) {
    const error = new CommerceRequestError("登录后可购买和管理套餐", 401);
    error.code = "NO_TOKEN";
    throw error;
  }
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
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.5",
        "Authorization": `Bearer ${token}`,
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
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
      throw new CommerceRequestError(
        payload?.message || payload?.error_description || `请求失败（${response.status}）`,
        response.status
      );
    }
    return payload;
  } catch (error) {
    if (error?.name === "AbortError") throw new CommerceRequestError("请求超时，请稍后重试");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function setNotice(id, type, message, action) {
  const notice = document.querySelector(id);
  if (!notice) return;
  notice.hidden = !message;
  notice.className = `overview-notice${type ? ` is-${type}` : ""}`;
  notice.innerHTML = message
    ? `<i data-lucide="${type === "error" ? "circle-alert" : "info"}" aria-hidden="true"></i>
       <span>${escapeHtml(message)}</span>
       ${action ? `<button type="button">${escapeHtml(action.label)}</button>` : ""}`
    : "";
  if (action) notice.querySelector("button")?.addEventListener("click", action.handler);
  refreshIcons();
}

function accountName() {
  return String(state.user?.name || state.user?.username || "");
}

function offerIsVisible(offer, currentAccount = accountName()) {
  const assigned = String(offer?.forAccountIds || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return !assigned.length || assigned.includes(currentAccount);
}

function offersForType(typeKey) {
  return state.offers
    .filter((offer) => offer?.chargeType === typeKey)
    .filter((offer) => offerIsVisible(offer))
    .filter((offer) => {
      if (typeKey === "residentialDynamicIp") return number(offer.amount) > 0 && number(offer.trafficInGB) > 0;
      return true;
    })
    .sort((left, right) => number(left.price) - number(right.price));
}

function offerLabel(offer) {
  switch (offer?.chargeType) {
    case "tunnelIp":
      return `${number(offer.amount)} 并发线程`;
    case "trafficIp":
    case "residentialDynamicIp":
      return `${number(offer.trafficInGB)}GB 流量`;
    case "durationIp":
      return `${number(offer.amount)} 个端口`;
    case "fixedIp":
    case "residentialStaticIp":
      return `${number(offer.amount)} 个 IP`;
    default:
      return "标准套餐";
  }
}

function offerUnitNote(offer) {
  switch (offer?.chargeType) {
    case "tunnelIp":
      return "不限累计流量";
    case "trafficIp":
    case "residentialDynamicIp":
      return "不限请求数量";
    case "durationIp":
      return "每端口不限流量与并发";
    default:
      return "独享固定出口";
  }
}

function selectedOffer() {
  return state.offers.find((offer) => String(offer.id) === String(state.offerId)) || null;
}

function calculatePrice(offer, periodKey) {
  const period = PERIODS[periodKey] || PERIODS.m;
  const base = Math.round(number(offer?.price) * period.ratio);
  const productDiscount = number(offer?.discount);
  const discount = productDiscount > 0.1 && productDiscount < 1 ? productDiscount : 1;
  const total = Math.round(number(offer?.price) * period.ratio * discount);
  return {
    base,
    total,
    discount,
    monthly: period.months > 0 ? total / period.months : total
  };
}

function normalizePurchaseSelection(productKey) {
  state.productKey = PRODUCTS[productKey] ? productKey : "tunnel";
  const product = PRODUCTS[state.productKey];
  if (!product.types.some((type) => type.key === state.typeKey)) {
    state.typeKey = product.types[0].key;
  }
  const type = product.types.find((item) => item.key === state.typeKey) || product.types[0];
  if (!type.periods.includes(state.period)) state.period = type.periods.includes("m") ? "m" : type.periods[0];
  const offers = offersForType(type.key);
  if (!offers.some((offer) => String(offer.id) === String(state.offerId))) {
    state.offerId = String(offers[0]?.id || "");
  }
}

function purchaseRoute(productKey) {
  return `#purchase?product=${encodeURIComponent(productKey)}`;
}

function extractRoute(productKey, orderId) {
  return `#extract?product=${encodeURIComponent(productKey)}&order=${encodeURIComponent(orderId || "")}`;
}

function parseHashParameters() {
  const [, query = ""] = (window.location.hash || "").split("?");
  return new URLSearchParams(query);
}

function renderProductTabs() {
  return Object.entries(PRODUCTS).map(([key, product]) => `
    <button class="${key === state.productKey ? "is-active" : ""}" type="button" data-commerce-product="${key}" aria-pressed="${key === state.productKey}">
      <i data-lucide="${product.icon}" aria-hidden="true"></i>
      <span>${escapeHtml(product.name)}</span>
    </button>`).join("");
}

function renderTypeTabs(product) {
  if (product.types.length < 2) return "";
  return `<div class="commerce-type-tabs" role="tablist" aria-label="计费方式">
    ${product.types.map((type) => `
      <button class="${type.key === state.typeKey ? "is-active" : ""}" type="button" data-commerce-type="${type.key}">
        <strong>${escapeHtml(type.label)}</strong><small>${escapeHtml(type.detail)}</small>
      </button>`).join("")}
  </div>`;
}

function renderOfferCards(offers) {
  if (!offers.length) {
    return `<div class="management-state"><i data-lucide="package-search" aria-hidden="true"></i><strong>当前没有可购买套餐</strong></div>`;
  }
  return `<div class="commerce-offer-grid">
    ${offers.map((offer) => {
      const selected = String(offer.id) === String(state.offerId);
      const privateOffer = Boolean(String(offer.forAccountIds || ""));
      return `<button class="commerce-offer${selected ? " is-selected" : ""}" type="button" data-commerce-offer="${escapeHtml(offer.id)}" aria-pressed="${selected}">
        <span class="commerce-radio" aria-hidden="true"></span>
        <span class="commerce-offer-copy">
          <small>${privateOffer ? "账户专属" : "套餐规格"}</small>
          <strong>${escapeHtml(offerLabel(offer))}</strong>
          <em>${escapeHtml(offerUnitNote(offer))}</em>
        </span>
        <span class="commerce-offer-price"><small>月付标准价</small><strong>¥${formatMoney(offer.price)}</strong></span>
      </button>`;
    }).join("")}
  </div>`;
}

function renderPeriods(type) {
  return `<div class="commerce-periods">
    ${type.periods.map((key) => {
      const period = PERIODS[key];
      return `<button class="${key === state.period ? "is-active" : ""}" type="button" data-commerce-period="${key}">
        <strong>${period.label}</strong>${period.badge ? `<small>${period.badge}</small>` : ""}
      </button>`;
    }).join("")}
  </div>`;
}

function renderPurchaseSummary(product, type, offer) {
  const price = calculatePrice(offer, state.period);
  const period = PERIODS[state.period] || PERIODS.m;
  return `<aside class="panel commerce-summary">
    <header><span>当前订单</span><strong>${escapeHtml(product.name)}</strong></header>
    <dl>
      <div><dt>计费方式</dt><dd>${escapeHtml(type.label)}</dd></div>
      <div><dt>套餐规格</dt><dd>${offer ? escapeHtml(offerLabel(offer)) : "--"}</dd></div>
      <div><dt>购买时长</dt><dd>${escapeHtml(period.label)}</dd></div>
      <div><dt>出口地区</dt><dd>提取时选择</dd></div>
    </dl>
    <div class="commerce-total">
      <span>应付金额</span>
      <div><small>¥</small><strong>${formatMoney(price.total)}</strong>${price.base > price.total ? `<del>¥${formatMoney(price.base)}</del>` : ""}</div>
      <p>月均约 ¥${formatMoney(price.monthly)}，最终金额以订单确认为准</p>
    </div>
    <button class="button button-primary commerce-submit" id="createPlanOrder" type="button" ${offer ? "" : "disabled"}>
      <i data-lucide="shield-check" aria-hidden="true"></i>创建订单并确认支付
    </button>
    <div class="commerce-confirm">
      <strong>使用前请确认</strong>
      <p>123Proxy 仅提供代理 IP 服务，不支持任何 VPN 或翻墙类功能；抓取程序需部署在海外。</p>
    </div>
  </aside>`;
}

function renderPurchase() {
  normalizePurchaseSelection(state.productKey);
  const product = PRODUCTS[state.productKey];
  const type = product.types.find((item) => item.key === state.typeKey) || product.types[0];
  const offers = offersForType(type.key);
  const offer = selectedOffer();
  const workspace = document.querySelector("#purchaseWorkspace");
  if (!workspace) return;
  workspace.innerHTML = `
    <nav class="commerce-product-tabs" aria-label="选择代理产品">${renderProductTabs()}</nav>
    <section class="commerce-product-intro">
      <span><i data-lucide="${product.icon}" aria-hidden="true"></i></span>
      <div><small>STANDARD PROXY PRODUCT</small><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.note)}</p></div>
      ${product.trial ? `<a class="commerce-trial-link" href="https://www.123proxy.cn/contact.html#service" target="_blank" rel="noreferrer"><i data-lucide="flask-conical" aria-hidden="true"></i><span><strong>免费测试</strong><small>${escapeHtml(product.trial)}</small></span></a>` : `<em>不提供免费测试</em>`}
    </section>
    ${renderTypeTabs(product)}
    <div class="commerce-layout">
      <section class="panel commerce-config">
        <header class="panel-head"><div><h2>选择套餐</h2><p>价格由后台实时返回</p></div><span class="live-badge"><i></i>LIVE PRICE</span></header>
        <div class="commerce-config-section"><label>套餐规格</label>${renderOfferCards(offers)}</div>
        <div class="commerce-config-section"><label>购买时长</label>${renderPeriods(type)}</div>
        <footer><i data-lucide="info" aria-hidden="true"></i><span>${escapeHtml(product.note)}</span></footer>
      </section>
      ${renderPurchaseSummary(product, type, offer)}
    </div>`;
  bindPurchaseWorkspace();
  const productTabs = workspace.querySelector(".commerce-product-tabs");
  const activeProduct = productTabs?.querySelector("[data-commerce-product].is-active");
  if (productTabs && activeProduct && productTabs.scrollWidth > productTabs.clientWidth) {
    productTabs.scrollLeft = Math.max(
      0,
      activeProduct.offsetLeft - (productTabs.clientWidth - activeProduct.offsetWidth) / 2
    );
  }
  refreshIcons();
}

function setPurchaseLoading(message) {
  document.querySelector("#purchaseWorkspace").innerHTML =
    `<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>${escapeHtml(message)}</strong></div>`;
}

async function loadCatalog(force = false) {
  if (state.loaded && !force) return;
  const [offerPayload, userPayload] = await Promise.all([
    request("/ip/default/offers"),
    request("/accsrv/information")
  ]);
  state.offers = Array.isArray(offerPayload?.offers) ? offerPayload.offers : [];
  state.user = userPayload || {};
  state.loaded = true;
}

async function openPurchase(productKey = "", force = false) {
  const requested = productKey || parseHashParameters().get("product") || "tunnel";
  state.productKey = PRODUCTS[requested] ? requested : "tunnel";
  setNotice("#purchaseNotice", "", "");
  setPurchaseLoading("正在加载实时套餐");
  try {
    await loadCatalog(force);
    renderPurchase();
  } catch (error) {
    if (error.code === "NO_TOKEN" || [401, 403].includes(error.status)) {
      if (!isLocalPreview()) {
        window.location.replace(loginUrl());
        return;
      }
    }
    document.querySelector("#purchaseWorkspace").innerHTML =
      `<div class="management-state is-error"><i data-lucide="circle-alert" aria-hidden="true"></i><strong>${escapeHtml(error.message || "套餐加载失败")}</strong></div>`;
    setNotice("#purchaseNotice", "error", error.message || "套餐加载失败", {
      label: "重新加载",
      handler: () => openPurchase(state.productKey, true)
    });
    refreshIcons();
  }
}

function bindPurchaseWorkspace() {
  document.querySelectorAll("[data-commerce-product]").forEach((button) => {
    button.addEventListener("click", () => {
      state.productKey = button.dataset.commerceProduct;
      state.typeKey = PRODUCTS[state.productKey].types[0].key;
      state.offerId = "";
      state.period = "m";
      window.history.replaceState(null, "", purchaseRoute(state.productKey));
      renderPurchase();
    });
  });
  document.querySelectorAll("[data-commerce-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.typeKey = button.dataset.commerceType;
      state.offerId = "";
      state.period = "m";
      renderPurchase();
    });
  });
  document.querySelectorAll("[data-commerce-offer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.offerId = button.dataset.commerceOffer;
      renderPurchase();
    });
  });
  document.querySelectorAll("[data-commerce-period]").forEach((button) => {
    button.addEventListener("click", () => {
      state.period = button.dataset.commercePeriod;
      renderPurchase();
    });
  });
  document.querySelector("#createPlanOrder")?.addEventListener("click", createPlanOrder);
}

async function createPlanOrder(event) {
  const button = event.currentTarget;
  const offer = selectedOffer();
  if (!offer) return;
  button.disabled = true;
  button.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span>正在创建订单';
  try {
    const payload = await request("/ip/order1/create", {
      method: "POST",
      body: JSON.stringify({
        productId: offer.id,
        period: 1,
        ttl: 10,
        unit: state.period
      })
    });
    if (!payload?.tradeNo) throw new CommerceRequestError("订单已提交，但未返回订单号");
    window.location.hash = `#order?tradeNo=${encodeURIComponent(payload.tradeNo)}`;
  } catch (error) {
    setNotice("#purchaseNotice", "error", error.message || "订单创建失败，请稍后重试");
    renderPurchase();
  }
}

function productNameForOrder(order) {
  const details = order?.details || {};
  switch (number(order?.chargeType)) {
    case 13: return "不限量动态住宅";
    case 14: return "隧道代理 · 按并发线程";
    case 15: return "长效静态代理";
    case 16: return "隧道代理 · 按流量";
    case 17: return "隧道代理 · 补充流量包";
    case 70: return number(details.trafficInGB) > 0 ? "隧道住宅代理" : "不限量动态住宅";
    case 71: return "长效静态住宅";
    default: return "代理套餐";
  }
}

function orderSpecification(order) {
  const details = order?.details || {};
  switch (number(order?.chargeType)) {
    case 13: return `${number(details.amount)} 个端口，不限流量与并发`;
    case 14: return `${number(details.amount)} 并发线程，不限累计流量`;
    case 15:
    case 71: return `${number(details.amount)} 个独享 IP`;
    case 16:
    case 17:
    case 70:
      return number(details.trafficInGB) > 0
        ? `${number(details.trafficInGB)}GB 流量`
        : `${number(details.amount)} 个不限量端口`;
    default: return details.amount ? `${number(details.amount)} 个` : "--";
  }
}

function periodLabel(details = {}) {
  if (PERIODS[details.unit]) return PERIODS[details.unit].label;
  const units = { month: "个月", week: "周", year: "年", hour: "小时" };
  return units[details.unit] ? `${number(details.period)} ${units[details.unit]}` : "--";
}

function orderStatus(status) {
  return {
    UNPAID: ["待支付", "is-waiting"],
    PAYING: ["支付中", "is-waiting"],
    PAID: ["已支付", "is-active"],
    EXPIRED: ["已失效", "is-expired"],
    FAILURE: ["支付失败", "is-expired"]
  }[status] || [status || "--", "is-expired"];
}

async function openOrder(tradeNo = "") {
  const orderNumber = tradeNo || parseHashParameters().get("tradeNo") || "";
  const workspace = document.querySelector("#orderWorkspace");
  if (!orderNumber) {
    workspace.innerHTML = '<div class="management-state is-error"><strong>缺少订单号</strong></div>';
    return;
  }
  setNotice("#orderNotice", "", "");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在读取订单</strong></div>';
  try {
    const [order, user] = await Promise.all([
      request(`/accsrv/clouduserorder/${encodeURIComponent(orderNumber)}`),
      request("/accsrv/information")
    ]);
    state.user = user;
    state.paymentOrder = orderNumber;
    renderOrder(order, user);
  } catch (error) {
    workspace.innerHTML = `<div class="management-state is-error"><i data-lucide="circle-alert" aria-hidden="true"></i><strong>${escapeHtml(error.message || "订单读取失败")}</strong></div>`;
    setNotice("#orderNotice", "error", error.message || "订单读取失败", {
      label: "重试",
      handler: () => openOrder(orderNumber)
    });
    refreshIcons();
  }
}

function renderOrder(order, user) {
  const workspace = document.querySelector("#orderWorkspace");
  const status = orderStatus(order.status);
  const payable = ["UNPAID", "PAYING"].includes(order.status);
  const balance = number(user?.balance);
  const total = number(order.rate);
  const wechatAvailable = total <= 3000;
  const defaultMethod = balance >= total ? "balance" : "alipay";
  workspace.innerHTML = `
    <div class="order-layout">
      <section class="panel order-detail-panel">
        <header class="panel-head"><div><h2>订单信息</h2><p>${escapeHtml(order.tradeNo || state.paymentOrder)}</p></div><span class="status ${status[1]}"><i></i>${status[0]}</span></header>
        <dl class="order-detail-list">
          <div><dt>代理产品</dt><dd>${escapeHtml(productNameForOrder(order))}</dd></div>
          <div><dt>套餐规格</dt><dd>${escapeHtml(orderSpecification(order))}</dd></div>
          <div><dt>购买时长</dt><dd>${escapeHtml(periodLabel(order.details))}</dd></div>
          <div><dt>创建时间</dt><dd>${escapeHtml(formatDateTime(order.orderTimeStamp))}</dd></div>
          <div><dt>出口地区</dt><dd>代理提取时选择</dd></div>
        </dl>
        <div class="order-compliance"><i data-lucide="shield-alert" aria-hidden="true"></i><p>123Proxy 仅提供代理 IP 服务，不支持任何 VPN 或翻墙类功能；抓取程序需部署在海外。</p></div>
      </section>
      <aside class="panel payment-panel">
        <header><span>订单金额</span><strong><small>¥</small>${formatMoney(total)}</strong></header>
        ${payable ? `
          <div class="payment-methods" role="radiogroup" aria-label="支付方式">
            <button class="${defaultMethod === "balance" ? "is-active" : ""}" type="button" data-payment-method="balance" ${balance >= total ? "" : "disabled"}>
              <i data-lucide="wallet-cards" aria-hidden="true"></i><span><strong>余额支付</strong><small>可用 ¥${formatMoney(balance)}</small></span>
            </button>
            <button class="${defaultMethod === "alipay" ? "is-active" : ""}" type="button" data-payment-method="alipay">
              <i data-lucide="scan-line" aria-hidden="true"></i><span><strong>支付宝</strong><small>跳转支付宝完成支付</small></span>
            </button>
            <button type="button" data-payment-method="wechat" ${wechatAvailable ? "" : "disabled"}>
              <i data-lucide="qr-code" aria-hidden="true"></i><span><strong>微信支付</strong><small>${wechatAvailable ? "扫码完成支付" : "订单超过 3000 元时不可用"}</small></span>
            </button>
          </div>
          ${balance < total ? `<p class="payment-warning">余额不足 ¥${formatMoney(total - balance)}，请选择在线支付。</p>` : ""}
          <button class="button button-primary payment-submit" id="confirmOrderPayment" type="button">确认支付 ¥${formatMoney(total)}</button>
          <button class="payment-check" id="checkOrderPayment" type="button">已完成在线支付，检查状态</button>
        ` : `
          <div class="payment-complete"><i data-lucide="${order.status === "PAID" ? "circle-check-big" : "circle-alert"}" aria-hidden="true"></i><strong>${status[0]}</strong><p>${order.status === "PAID" ? "套餐已经生效，可前往所有套餐开始使用。" : "该订单当前无法支付。"}</p></div>
          <a class="button button-primary payment-submit" href="${order.status === "PAID" ? "#packages" : purchaseRoute("tunnel")}">${order.status === "PAID" ? "查看我的套餐" : "重新购买"}</a>
        `}
      </aside>
    </div>`;
  bindOrderActions(order);
  refreshIcons();
}

function selectedPaymentMethod() {
  return document.querySelector("[data-payment-method].is-active")?.dataset.paymentMethod || "balance";
}

function bindOrderActions(order) {
  document.querySelectorAll("[data-payment-method]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-payment-method]").forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });
  document.querySelector("#confirmOrderPayment")?.addEventListener("click", () => payOrder(order, selectedPaymentMethod()));
  document.querySelector("#checkOrderPayment")?.addEventListener("click", () => checkExternalPayment(order));
}

async function payOrder(order, method) {
  const button = document.querySelector("#confirmOrderPayment");
  button.disabled = true;
  button.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span>正在发起支付';
  try {
    if (number(order.rate) <= 0 || method === "balance") {
      await request(`/ip/clouduserorder/imply?tradeNo=${encodeURIComponent(order.tradeNo)}`, {
        method: "PUT",
        body: ""
      });
      showToast("支付成功，套餐正在生效");
      invalidateConsoleData();
      window.location.hash = "#packages";
      return;
    }
    if (method === "wechat") {
      await startWechatPayment(order);
      return;
    }
    await startAlipayPayment(order);
  } catch (error) {
    setNotice("#orderNotice", "error", error.message || "支付请求失败，请稍后重试");
    renderOrder(order, state.user || {});
  }
}

async function startAlipayPayment(order) {
  const paymentWindow = openPaymentWindow();
  if (!paymentWindow) throw new CommerceRequestError("浏览器阻止了支付窗口，请允许弹窗后重试");
  savePendingPayment({
    provider: "alipay",
    orderTradeNo: order.tradeNo
  });
  try {
    const html = await request(`/accsrv/clouduserorder/alipay/${encodeURIComponent(order.tradeNo)}?by=6`);
    state.paymentTradeNo = extractPaymentTradeNo(html);
    savePendingPayment({
      provider: "alipay",
      orderTradeNo: order.tradeNo,
      paymentTradeNo: state.paymentTradeNo
    });
    submitPaymentHtml(html, paymentWindow);
    setNotice("#orderNotice", "info", "支付宝支付窗口已打开。支付完成后回到本页检查状态。");
    renderOrder(order, state.user || {});
  } catch (error) {
    clearPendingPayment();
    paymentWindow.popup?.close();
    throw error;
  }
}

async function startWechatPayment(order) {
  const payload = await request(`/accsrv/clouduserorder/wxpay/${encodeURIComponent(order.tradeNo)}`);
  if (!payload?.url) throw new CommerceRequestError("微信支付二维码生成失败");
  state.paymentTradeNo = String(payload.tradeNo || "");
  savePendingPayment({
    provider: "wechat",
    orderTradeNo: order.tradeNo,
    paymentTradeNo: state.paymentTradeNo
  });
  await openWechatDialog(payload.url, order);
  startPaymentPolling(order, "wechat");
}

async function openWechatDialog(url, order) {
  const dialog = document.querySelector("#wechatPaymentDialog");
  if (!dialog) return;
  document.querySelector("#wechatPaymentOrder").textContent = order.tradeNo;
  const qr = document.querySelector("#wechatPaymentQr");
  const fallback = document.querySelector("#wechatPaymentFallback");
  fallback.textContent = "";
  fallback.hidden = true;
  dialog.showModal();
  try {
    await renderQrCode(qr, url, { size: 220 });
  } catch {
    qr.hidden = true;
    fallback.textContent = "二维码加载失败，请关闭窗口后重新发起支付。";
    fallback.hidden = false;
  }
}

function stopPaymentPolling() {
  if (state.paymentTimer) window.clearInterval(state.paymentTimer);
  state.paymentTimer = null;
}

function startPaymentPolling(order, provider) {
  stopPaymentPolling();
  state.paymentTimer = window.setInterval(async () => {
    const paid = await pollPayment(order, provider).catch(() => false);
    if (paid) {
      stopPaymentPolling();
      clearPendingPayment();
      document.querySelector("#wechatPaymentDialog")?.close();
      invalidateConsoleData();
      showToast("支付成功，套餐正在生效");
      window.location.hash = "#packages";
    }
  }, 5000);
}

async function pollPayment(order, provider) {
  if (!state.paymentTradeNo) return false;
  const path = provider === "wechat"
    ? `/accsrv/0xwxcheckorderstatus/${encodeURIComponent(state.paymentTradeNo)}`
    : `/accsrv/0xalicheckorderstatus/${encodeURIComponent(state.paymentTradeNo)}`;
  const result = await request(path);
  if (!result?.paid) return false;
  await request(`/ip/clouduserorder/imply?tradeNo=${encodeURIComponent(order.tradeNo)}&tradeNo_pay=${encodeURIComponent(state.paymentTradeNo)}`, {
    method: "PUT",
    body: ""
  });
  return true;
}

async function checkExternalPayment(order) {
  try {
    if (state.paymentTradeNo) {
      const paid = await pollPayment(order, "alipay");
      if (paid) {
        invalidateConsoleData();
        showToast("支付成功，套餐正在生效");
        window.location.hash = "#packages";
        return;
      }
    }
    await openOrder(order.tradeNo);
    showToast("订单状态已刷新");
  } catch (error) {
    setNotice("#orderNotice", "error", error.message || "支付状态检查失败");
  }
}

function renderPaymentReturnState(type, title, message) {
  const workspace = document.querySelector("#orderWorkspace");
  if (!workspace) return;
  const icon = type === "success" ? "circle-check-big" : type === "error" ? "circle-alert" : "loader-circle";
  workspace.innerHTML = `
    <section class="panel payment-return-panel">
      <div class="payment-complete is-${type}">
        <i data-lucide="${icon}" aria-hidden="true"></i>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(message)}</p>
        <div class="payment-return-actions">
          <a class="button button-primary" href="#packages">查看我的套餐</a>
          <a class="button button-secondary" href="#orders">查看订单</a>
        </div>
      </div>
    </section>`;
  refreshIcons();
}

function notifyPaymentComplete(orderTradeNo) {
  try {
    window.opener?.postMessage({
      type: "123proxy-payment-complete",
      orderTradeNo
    }, window.location.origin);
  } catch {
    // The payment result page still works when the opener has already closed.
  }
}

async function handlePaymentReturn(params = new URLSearchParams()) {
  const paymentTradeNo = String(params.get("tradeNo") || "");
  const pending = loadPendingPayment(paymentTradeNo);
  if (!paymentTradeNo) {
    renderPaymentReturnState("error", "缺少支付流水号", "无法确认本次支付，请前往订单管理查看订单状态。");
    return;
  }
  if (!pending?.orderTradeNo) {
    renderPaymentReturnState("pending", "支付结果已返回", "未找到原套餐订单，请前往订单管理刷新订单状态。");
    return;
  }

  state.paymentOrder = pending.orderTradeNo;
  state.paymentTradeNo = paymentTradeNo;
  renderPaymentReturnState("pending", "正在确认支付结果", "正在向支付后台核验到账状态，请勿关闭页面。");

  try {
    const order = await request(`/accsrv/clouduserorder/${encodeURIComponent(pending.orderTradeNo)}`);
    const paid = order?.status === "PAID" || await pollPayment(order, "alipay");
    if (!paid) {
      renderPaymentReturnState("pending", "支付结果确认中", "支付平台尚未返回最终状态，请稍后在订单管理中刷新。");
      return;
    }
    clearPendingPayment();
    invalidateConsoleData();
    notifyPaymentComplete(pending.orderTradeNo);
    renderPaymentReturnState("success", "支付成功", "套餐订单已确认，相关代理资源正在生效。");
  } catch (error) {
    renderPaymentReturnState("error", "支付状态确认失败", error.message || "请前往订单管理重新检查支付状态。");
  }
}

function invalidateConsoleData() {
  state.loaded = false;
  window.ConsoleOverview?.reload?.();
  window.ConsoleProducts?.reload?.();
  window.ConsoleResources?.reload?.();
}

async function openOrders() {
  const workspace = document.querySelector("#ordersWorkspace");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在加载订单</strong></div>';
  setNotice("#ordersNotice", "", "");
  try {
    const payload = await request("/accsrv/clouduserorder/querybyuser");
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.content) ? payload.content : [];
    state.orders = list
      .filter((item) => [13, 14, 15, 16, 17, 70, 71].includes(number(item?.chargeType)))
      .sort((left, right) => number(right.orderTimeStamp) - number(left.orderTimeStamp));
    renderOrders();
  } catch (error) {
    workspace.innerHTML = `<div class="management-state is-error"><strong>${escapeHtml(error.message || "订单加载失败")}</strong></div>`;
    setNotice("#ordersNotice", "error", error.message || "订单加载失败", { label: "重试", handler: openOrders });
  }
}

function orderProductKey(order) {
  const type = number(order?.chargeType);
  if ([14, 16, 17].includes(type)) return "tunnel";
  if (type === 70 && number(order?.details?.trafficInGB) > 0) return "residential";
  if ([13].includes(type) || (type === 70 && number(order?.details?.trafficInGB) <= 0)) return "unlimited";
  if (type === 15) return "staticDatacenter";
  if (type === 71) return "staticResidential";
  return "";
}

function filteredOrders() {
  const keyword = state.orderKeyword.toLowerCase();
  return state.orders.filter((order) => {
    const statusMatch = !state.orderStatusFilter || order.status === state.orderStatusFilter;
    const productMatch = !state.orderProductFilter || orderProductKey(order) === state.orderProductFilter;
    const searchText = `${order.tradeNo || ""} ${productNameForOrder(order)} ${orderSpecification(order)}`.toLowerCase();
    return statusMatch && productMatch && (!keyword || searchText.includes(keyword));
  });
}

function orderMetricsMarkup(orders) {
  const unpaid = orders.filter((order) => ["UNPAID", "PAYING"].includes(order.status)).length;
  const paid = orders.filter((order) => order.status === "PAID").length;
  const paidAmount = orders
    .filter((order) => order.status === "PAID")
    .reduce((sum, order) => sum + number(order.rate), 0);
  return `
    <section class="account-metrics order-metrics">
      <div><small>代理订单</small><strong>${orders.length}</strong><span>全部历史记录</span></div>
      <div><small>待处理</small><strong>${unpaid}</strong><span>待支付或支付中</span></div>
      <div><small>已支付</small><strong>${paid}</strong><span>已生效订单</span></div>
      <div><small>已支付金额</small><strong><em>¥</em>${formatMoney(paidAmount)}</strong><span>代理订单合计</span></div>
    </section>`;
}

function renderOrders() {
  const workspace = document.querySelector("#ordersWorkspace");
  const filtered = filteredOrders();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.orderPageSize));
  state.orderPage = Math.min(totalPages, Math.max(1, state.orderPage));
  const start = (state.orderPage - 1) * state.orderPageSize;
  const visible = filtered.slice(start, start + state.orderPageSize);
  workspace.innerHTML = `
    ${orderMetricsMarkup(state.orders)}
    <section class="account-filter-bar order-filter-bar">
      <div><strong>代理订单</strong><span>筛选订单状态、产品并继续处理未支付订单。</span></div>
      <form id="orderFilterForm">
        <label><span>支付状态</span><select id="orderStatusFilter">
          <option value="">全部状态</option>
          <option value="PAID" ${state.orderStatusFilter === "PAID" ? "selected" : ""}>已支付</option>
          <option value="UNPAID" ${state.orderStatusFilter === "UNPAID" ? "selected" : ""}>待支付</option>
          <option value="PAYING" ${state.orderStatusFilter === "PAYING" ? "selected" : ""}>支付中</option>
          <option value="EXPIRED" ${state.orderStatusFilter === "EXPIRED" ? "selected" : ""}>已失效</option>
          <option value="FAILURE" ${state.orderStatusFilter === "FAILURE" ? "selected" : ""}>支付失败</option>
        </select></label>
        <label><span>代理产品</span><select id="orderProductFilter">
          <option value="">全部产品</option>
          ${Object.entries(PRODUCTS).map(([key, product]) => `<option value="${key}" ${state.orderProductFilter === key ? "selected" : ""}>${escapeHtml(product.name)}</option>`).join("")}
        </select></label>
        <label><span>订单搜索</span><input id="orderKeyword" type="search" value="${escapeHtml(state.orderKeyword)}" placeholder="订单号或套餐名称"></label>
        <button class="button button-secondary" type="submit"><i data-lucide="search"></i>查询</button>
      </form>
    </section>
    <section class="panel management-table-panel">
      <div class="management-table order-management-table" role="table" aria-label="代理订单">
        <div class="management-row is-head" role="row">
          <span>订单与产品</span><span>套餐规格</span><span>金额</span><span>创建时间</span><span>状态</span><span>操作</span>
        </div>
        <div>${visible.length ? visible.map(orderRowMarkup).join("") : '<div class="management-state"><i data-lucide="receipt-text" aria-hidden="true"></i><strong>没有符合条件的代理订单</strong></div>'}</div>
      </div>
      <footer class="management-table-footer">
        <span>共 ${filtered.length} 条记录</span>
        <div class="pagination-controls">
          <button id="ordersPrevPage" type="button" ${state.orderPage <= 1 ? "disabled" : ""}><i data-lucide="chevron-left"></i></button>
          <span>第 ${state.orderPage} / ${totalPages} 页</span>
          <button id="ordersNextPage" type="button" ${state.orderPage >= totalPages ? "disabled" : ""}><i data-lucide="chevron-right"></i></button>
        </div>
      </footer>
    </section>`;
  document.querySelector("#orderFilterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.orderStatusFilter = document.querySelector("#orderStatusFilter").value;
    state.orderProductFilter = document.querySelector("#orderProductFilter").value;
    state.orderKeyword = document.querySelector("#orderKeyword").value.trim();
    state.orderPage = 1;
    renderOrders();
  });
  document.querySelector("#ordersPrevPage")?.addEventListener("click", () => {
    state.orderPage = Math.max(1, state.orderPage - 1);
    renderOrders();
  });
  document.querySelector("#ordersNextPage")?.addEventListener("click", () => {
    state.orderPage += 1;
    renderOrders();
  });
  refreshIcons();
}

function orderRowMarkup(order) {
  const status = orderStatus(order.status);
  return `<div class="management-row order-management-row" role="row">
    <div><strong>${escapeHtml(productNameForOrder(order))}</strong><small>${escapeHtml(order.tradeNo)}</small></div>
    <span>${escapeHtml(orderSpecification(order))}</span>
    <strong>¥${formatMoney(order.rate)}</strong>
    <span>${escapeHtml(formatDateTime(order.orderTimeStamp))}</span>
    <span class="status ${status[1]}"><i></i>${status[0]}</span>
    <a class="button-mini is-primary" href="#order?tradeNo=${encodeURIComponent(order.tradeNo)}">${["UNPAID", "PAYING"].includes(order.status) ? "立即支付" : "查看明细"}</a>
  </div>`;
}

async function openBilling() {
  const workspace = document.querySelector("#billingWorkspace");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在读取账户余额</strong></div>';
  try {
    const user = await request("/accsrv/information");
    workspace.innerHTML = `
      <section class="billing-balance-band">
        <div><small>账户余额</small><strong><em>¥</em>${formatMoney(user.balance)}</strong><span>可直接用于代理套餐支付</span></div>
        <div><i data-lucide="receipt-text" aria-hidden="true"></i><span><strong>套餐订单</strong><small>代理订单已迁移到新版控制台统一管理</small></span><a href="#orders">查看订单</a></div>
        <div><i data-lucide="landmark" aria-hidden="true"></i><span><strong>充值与发票</strong><small>如需充值、对公转账或开票，请联系客户服务</small></span><a href="https://www.123proxy.cn/contact.html#service" target="_blank" rel="noreferrer">联系客户服务</a></div>
      </section>`;
    refreshIcons();
  } catch (error) {
    workspace.innerHTML = `<div class="management-state is-error"><strong>${escapeHtml(error.message || "账户信息加载失败")}</strong></div>`;
  }
}

async function openSettings() {
  const workspace = document.querySelector("#settingsWorkspace");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在读取账户信息</strong></div>';
  try {
    const user = await request("/accsrv/information");
    const name = String(user.name || user.username || "--");
    workspace.innerHTML = `
      <section class="panel account-setting-panel">
        <header class="panel-head"><div><h2>登录账户</h2><p>当前控制台会话与账户类型</p></div><span class="status is-active"><i></i>已登录</span></header>
        <dl>
          <div><dt>账户</dt><dd>${escapeHtml(name)}</dd></div>
          <div><dt>账户类型</dt><dd>${user.parent ? "子账户" : "主账户"}</dd></div>
          <div><dt>代理认证</dt><dd><a href="#users">管理代理用户</a></dd></div>
          <div><dt>账户支持</dt><dd><a href="https://www.123proxy.cn/contact.html#service" target="_blank" rel="noreferrer">联系客户服务</a></dd></div>
        </dl>
      </section>`;
  } catch (error) {
    workspace.innerHTML = `<div class="management-state is-error"><strong>${escapeHtml(error.message || "账户信息加载失败")}</strong></div>`;
  }
}

function ensureDialogs() {
  if (document.querySelector("#wechatPaymentDialog")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="console-dialog commerce-dialog" id="wechatPaymentDialog">
      <div class="dialog-card">
        <header><div><small>WECHAT PAY</small><h2>微信扫码支付</h2></div><button class="dialog-close" type="button" data-commerce-dialog-close aria-label="关闭"><i data-lucide="x"></i></button></header>
        <div class="dialog-body wechat-payment-body">
          <div class="payment-qr" id="wechatPaymentQr" aria-live="polite"></div>
          <code id="wechatPaymentFallback" hidden></code>
          <p>订单 <strong id="wechatPaymentOrder">--</strong></p>
          <small>支付成功后页面将自动更新。</small>
        </div>
        <footer><button class="button button-secondary" type="button" data-commerce-dialog-close>稍后支付</button></footer>
      </div>
    </dialog>`);
  document.querySelectorAll("[data-commerce-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      stopPaymentPolling();
      button.closest("dialog")?.close();
    });
  });
  refreshIcons();
}

function bindGlobalActions() {
  document.querySelector("#purchaseReload")?.addEventListener("click", async () => {
    setPurchaseLoading("正在刷新实时套餐");
    try {
      await loadCatalog(true);
      renderPurchase();
      showToast("实时价格已更新");
    } catch (error) {
      setNotice("#purchaseNotice", "error", error.message || "价格刷新失败");
    }
  });
  document.querySelector("#rechargeButton")?.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    window.location.hash = "#billing?tab=recharge";
  });
}

function bindPaymentCompletionMessages() {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "123proxy-payment-complete") return;
    stopPaymentPolling();
    clearPendingPayment();
    invalidateConsoleData();
    showToast("支付成功，套餐正在生效");
    window.location.hash = "#packages";
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  ensureDialogs();
  bindGlobalActions();
  bindPaymentCompletionMessages();
  window.ConsoleCommerce = {
    openPurchase,
    openOrder,
    openOrders,
    openBilling,
    openSettings,
    handlePaymentReturn,
    purchaseRoute,
    extractRoute,
    reload: () => {
      state.loaded = false;
      return openPurchase(state.productKey);
    }
  };
  window.dispatchEvent(new CustomEvent("console-commerce-ready"));
}

export {
  PRODUCTS,
  PERIODS,
  calculatePrice,
  extractPaymentTradeNo,
  offerIsVisible,
  offerLabel,
  orderSpecification,
  productNameForOrder
};
