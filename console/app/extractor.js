import { isHighBandwidthPackage } from "./package-classification.js?v=20260818-01";
import { formatConsoleDateTime } from "./date-time.js?v=20260818-03";

const TOKEN_KEY = "token_key";
const REQUEST_TIMEOUT_MS = 15000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const STATIC_DATACENTER_CODES = [
  "ZA", "VN", "VE", "UZ", "US", "UA", "TW", "TR", "TH", "SK", "SG", "SE", "SA", "RS", "RO", "PT",
  "PL", "PK", "PH", "PE", "NZ", "NO", "NL", "NG", "MY", "MX", "MT", "MA", "LV", "LT", "LK", "KZ",
  "KR", "KH", "KE", "JP", "IT", "IN", "IL", "IE", "ID", "HU", "HR", "HK", "GR", "GE", "GB", "FR",
  "FI", "ES", "EG", "EE", "DZ", "DK", "DE", "CZ", "CY", "CO", "CL", "CH", "CA", "BR", "BG", "BE",
  "BD", "AU", "AT", "AR", "AE"
];

const STATIC_RESIDENTIAL_CODES = [
  "AE", "AR", "AT", "AU", "BD", "BE", "BG", "BR", "CA", "CH", "CL", "CO", "CY", "CZ", "DE", "DK",
  "DZ", "EE", "EG", "ES", "FI", "FR", "GB", "GE", "GR", "HK", "HN", "HR", "HU", "ID", "IE", "IL",
  "IN", "IT", "JP", "KE", "KH", "KR", "KZ", "LK", "LT", "LV", "MA", "MT", "MX", "MY", "NG", "NL",
  "NO", "NZ", "PE", "PH", "PK", "PL", "PT", "RO", "RS", "SA", "SE", "SG", "SK", "TH", "TR", "TW",
  "UA", "US", "VE", "VN", "ZA"
];

const ROTATING_COUNTRY_CODES = [
  "US", "HK", "TW", "MO", "JP", "KR", "SG", "GB", "FR", "IT", "DE", "IN", "ID", "PH", "VN", "MM",
  "TH", "MY", "BD", "BT", "MV", "NP", "PK", "LK", "BH", "KW", "OM", "QA", "SA", "AE", "YE", "CY",
  "IQ", "IL", "JO", "LB", "PS", "SY", "AF", "AM", "AZ", "IR", "TR", "KZ", "KG", "TJ", "TM", "UZ",
  "GE", "TL", "LU", "BY", "BE", "AT", "ES", "IE", "SE", "FI", "VA", "PT", "LV", "PL", "LT", "HU",
  "MD", "NL", "CH", "MC", "CZ", "NO", "IS", "GR", "MT", "EE", "UA", "HR", "CA", "JM", "LC", "MX",
  "PA", "BR", "AR", "CO", "CL", "VE", "PE", "NZ", "PW", "AU", "MG", "MZ", "ZA", "ET", "KE", "GH",
  "NG", "DZ", "RU", "RS", "RO", "SK", "BG", "DK", "EG", "MA", "HN", "KH", "CN", "CR", "DO", "EC",
  "GT", "NI", "PR", "PY", "SV", "TT", "UY", "BO", "AL", "BA", "ME", "MK", "SI", "CI", "CM", "SN",
  "TZ", "UG", "ZM", "ZW", "AO", "BW", "NA", "RW", "SD", "SO", "TN", "LY", "ML", "NE", "CD", "CG",
  "GA", "GM", "GN", "LR", "SL", "BF", "BJ", "CV", "SC", "MU", "RE", "FJ", "PG", "WS", "SB", "NC",
  "VU", "MN", "BN", "LA", "CU", "BZ", "BS", "BB", "DM", "GY", "SR", "GF", "MQ", "GP", "AW", "CW"
];

const TUNNEL_MIXED_REGIONS = [
  ["all", "全球随机"], ["euus", "欧美"], ["na", "北美"], ["europe", "欧洲"],
  ["asia", "亚洲"], ["us", "美国"], ["japan", "日韩"]
];

const TUNNEL_RESIDENTIAL_REGIONS = [
  ["la-all", "全球随机"], ["la-na", "北美"], ["la-sa", "南美"],
  ["la-europe", "欧洲"], ["la-asia", "亚洲"]
];

const PROXY_OUTPUT_FORMATS = [
  {
    value: "1",
    label: "HOST:PORT:USER:PASSWORD",
    description: "主机、端口、用户名、密码"
  },
  {
    value: "3",
    label: "USER:PASSWORD:HOST:PORT",
    description: "用户名和密码在前"
  },
  {
    value: "4",
    label: "USER:PASSWORD@HOST:PORT",
    description: "标准代理 URL 鉴权格式"
  },
  {
    value: "2",
    label: "HOST:PORT@USER:PASSWORD",
    description: "主机和端口在前"
  }
];

const PRODUCT_META = {
  bandwidth: {
    name: "高带宽代理 IP",
    description: "不限流量、不限并发的专属代理项目，由高级技术支持独立交付接入信息。",
    icon: "gauge",
    static: false
  },
  tunnel: {
    name: "隧道代理",
    description: "选择爬虫混合池或纯住宅池，并配置认证、地区与 SESSION。",
    icon: "shuffle",
    static: false
  },
  residential: {
    name: "隧道住宅代理",
    description: "按国家或地区定位住宅出口，并按任务需要配置 SESSION。",
    icon: "globe-2",
    static: false
  },
  unlimited: {
    name: "不限量动态住宅",
    description: "按套餐统一设置地区和 3-30 分钟轮转周期。",
    icon: "refresh-cw",
    static: false
  },
  staticDatacenter: {
    name: "长效静态代理",
    description: "从套餐剩余数量中提取固定数据中心 IP，并管理已分配 IP。",
    icon: "server",
    static: true
  },
  staticResidential: {
    name: "长效静态住宅",
    description: "从套餐剩余数量中提取固定住宅 ISP IP，并管理已分配 IP。",
    icon: "house-plug",
    static: true
  }
};

const CONNECTION_CODE_TABS = [
  ["connection", "接入参数"],
  ["curl", "cURL"],
  ["python", "Python"],
  ["nodejs", "Node.js"],
  ["go", "Go"],
  ["java", "Java"],
  ["php", "PHP"],
  ["apiUrl", "API 链接"]
];

const API_CODE_TABS = [
  ["apiUrl", "API 链接"],
  ["curl", "cURL"],
  ["python", "Python"],
  ["nodejs", "Node.js"],
  ["go", "Go"],
  ["java", "Java"],
  ["php", "PHP"]
];

const ASSIGNED_PROXY_TABS = [
  ["connection", "接入参数"],
  ["curl", "cURL"],
  ["python", "Python"],
  ["nodejs", "Node.js"],
  ["go", "Go"],
  ["java", "Java"],
  ["php", "PHP"]
];

const state = {
  productKey: "tunnel",
  requestedOrder: "",
  orders: [],
  users: [],
  assigned: [],
  output: null,
  loading: false
};

class ExtractRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ExtractRequestError";
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

function isLocalPreview() {
  return LOCAL_HOSTS.has(window.location.hostname);
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
    const error = new ExtractRequestError("登录后可使用代理套餐", 401);
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
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {})
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
      throw new ExtractRequestError(
        payload?.message || payload?.error_description || `请求失败（${response.status}）`,
        response.status
      );
    }
    return payload;
  } catch (error) {
    if (error?.name === "AbortError") throw new ExtractRequestError("请求超时，请稍后重试");
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

async function copyText(value) {
  const text = String(value ?? "");
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through for browsers that block Clipboard API outside HTTPS.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "-9999px auto auto -9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("copy_failed");
}

function setNotice(type, message, action) {
  const notice = document.querySelector("#extractNotice");
  if (!notice) return;
  notice.hidden = !message;
  notice.className = `overview-notice${type ? ` is-${type}` : ""}`;
  notice.innerHTML = message
    ? `<i data-lucide="${type === "error" ? "circle-alert" : "info"}" aria-hidden="true"></i><span>${escapeHtml(message)}</span>${action ? `<button type="button">${escapeHtml(action.label)}</button>` : ""}`
    : "";
  if (action) notice.querySelector("button")?.addEventListener("click", action.handler);
  refreshIcons();
}

function parseHashParameters() {
  const [, query = ""] = (window.location.hash || "").split("?");
  return new URLSearchParams(query);
}

function packageId(order) {
  return String(order?.id || order?.orderId || "");
}

function packageExpiry(order) {
  const value = order?.expiration || order?.expirationTime;
  return formatConsoleDateTime(value);
}

function isResidentialTraffic(order) {
  return order?.chargeType === "residentialDynamicIp" && number(order?.totalTrafficInGB) > 0;
}

function isTunnelProduct(productKey = state.productKey) {
  return ["tunnel", "bandwidth"].includes(productKey);
}

function matchesProduct(order, productKey) {
  if (productKey === "bandwidth") return isHighBandwidthPackage(order);
  if (productKey === "tunnel") {
    return ["trafficIp", "tunnelIp", "tmpPackage"].includes(order?.chargeType)
      && !isHighBandwidthPackage(order);
  }
  if (productKey === "residential") return isResidentialTraffic(order);
  if (productKey === "unlimited") {
    return order?.chargeType === "durationIp"
      || (order?.chargeType === "residentialDynamicIp" && !isResidentialTraffic(order));
  }
  if (productKey === "staticDatacenter") return order?.chargeType === "fixedIp";
  if (productKey === "staticResidential") return order?.chargeType === "residentialStaticIp";
  return false;
}

function packageLabel(order) {
  if (isHighBandwidthPackage(order)) return "专属项目套餐";
  if (order.chargeType === "trafficIp") return `${number(order.totalTrafficInGB || order.total)}GB 流量`;
  if (order.chargeType === "tmpPackage") return `${number(order.totalTrafficInGB || order.total)}GB 补充流量`;
  if (order.chargeType === "tunnelIp") return `${number(order.total)} 并发线程`;
  if (isResidentialTraffic(order)) return `${number(order.totalTrafficInGB)}GB 住宅流量`;
  if (order.chargeType === "durationIp" || order.chargeType === "residentialDynamicIp") {
    return `${number(order.total || 1)} 个不限量端口`;
  }
  return `${number(order.amount ?? order.total ?? 1)} 个固定 IP`;
}

function packageAvailable(order) {
  if (isHighBandwidthPackage(order)) return "不限流量 · 不限并发";
  if (["trafficIp", "tmpPackage"].includes(order.chargeType) || isResidentialTraffic(order)) {
    return `${Math.max(0, number(order.remainingTrafficInKB) / 1000000).toFixed(2)} GB 可用`;
  }
  if (order.chargeType === "tunnelIp") return `${number(order.total)} 并发可用`;
  if (["fixedIp", "residentialStaticIp"].includes(order.chargeType)) {
    return `${Math.max(0, number(order.amount ?? order.total))} 个待提取`;
  }
  return `${number(order.total || 1)} 个端口`;
}

function countryName(code) {
  try {
    return new Intl.DisplayNames(["zh-CN"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function countryOptions(codes, backendAliases = null, includeAll = true) {
  const options = includeAll ? '<option value="all">全球随机</option>' : "";
  return options + [...new Set(codes)].map((code) => {
    const value = backendAliases?.[code] || code;
    return `<option value="${escapeHtml(value)}" data-country-code="${code}">${escapeHtml(countryName(code))}</option>`;
  }).join("");
}

function residentialCountryOptions() {
  const options = [
    '<option value="all" data-country-code="ALL">全球随机</option>',
    '<option value="eu" data-country-code="EU">欧洲随机</option>'
  ];
  ROTATING_COUNTRY_CODES.forEach((code) => {
    options.push(
      `<option value="${code.toLowerCase()}" data-country-code="${code}">${escapeHtml(countryName(code))}</option>`
    );
  });
  return options.join("");
}

function residentialRegionName(region) {
  if (region === "all") return "全球随机";
  if (region === "eu") return "欧洲随机";
  const code = String(region || "").toUpperCase();
  return countryName(code);
}

function orderOptions() {
  return state.orders.map((order) => `
    <option value="${escapeHtml(packageId(order))}" ${packageId(order) === state.requestedOrder ? "selected" : ""}>
      ${escapeHtml(packageLabel(order))} · ${escapeHtml(packageAvailable(order))}
    </option>`).join("");
}

function userOptions() {
  return state.users.map((user) => `
    <option value="${escapeHtml(user.id)}">${escapeHtml(user.username)}</option>`).join("");
}

function selectedOrder() {
  const select = document.querySelector("#extractPackage");
  const id = select?.value || state.requestedOrder;
  return state.orders.find((order) => packageId(order) === String(id)) || state.orders[0] || null;
}

function selectedUser() {
  const id = document.querySelector("#extractProxyUser")?.value || "";
  return state.users.find((user) => String(user.id) === String(id)) || state.users[0] || null;
}

function orderWhitelist(order) {
  return String(order?.ipwhitelist ?? order?.ipWhitelist ?? order?.whiteList ?? "");
}

function whitelistTextareaValue(value) {
  return whitelistEntries(value).join("\n");
}

function whitelistScopeHelp(productKey = state.productKey) {
  if (isTunnelProduct(productKey)) {
    const productName = PRODUCT_META[productKey]?.name || "隧道代理";
    return `绑定当前${productName}套餐；白名单模式使用轮转出口，纯住宅池的 SESSION 仅支持账密认证。`;
  }
  if (productKey === "residential") {
    return "绑定当前隧道住宅套餐；国家/地区与 SESSION 路由会随本次配置一起保存。";
  }
  if (productKey === "unlimited") {
    return "绑定当前不限量套餐；地区与 3-30 分钟轮转周期对套餐内全部端口生效。";
  }
  return "绑定当前套餐。";
}

function syncWhitelistField(order = selectedOrder()) {
  const input = document.querySelector("#extractWhitelist");
  const hint = document.querySelector("#extractWhitelistHint");
  if (input) input.value = whitelistTextareaValue(orderWhitelist(order));
  if (hint) {
    const count = whitelistEntries(orderWhitelist(order)).length;
    hint.textContent = count
      ? `已载入当前套餐保存的 ${count} 个 IPv4 地址。一行填写一个，保存时自动转换为英文逗号分隔。`
      : "当前套餐尚未保存白名单。一行填写一个 IPv4 地址，保存时自动转换为英文逗号分隔。";
  }
}

function rememberOrderWhitelist(settings) {
  if (!settings?.order) return;
  const value = settings.auth === "whitelist" ? settings.whitelist : "";
  settings.order.ipwhitelist = value;
  settings.order.ipWhitelist = value;
  syncWhitelistField(settings.order);
}

function renderEmpty(meta) {
  const actionUrl = state.productKey === "bandwidth"
    ? "#product-bandwidth"
    : `#purchase?product=${encodeURIComponent(state.productKey)}`;
  const actionLabel = state.productKey === "bandwidth" ? "获取高带宽方案" : "购买套餐";
  document.querySelector("#extractWorkspace").innerHTML = `
    <section class="panel extraction-empty">
      <span><i data-lucide="${meta.icon}" aria-hidden="true"></i></span>
      <h2>当前没有可用${escapeHtml(meta.name)}套餐</h2>
      <p>先购买对应套餐，再回到这里配置并生成代理。</p>
      <a class="button button-primary" href="${actionUrl}"><i data-lucide="${state.productKey === "bandwidth" ? "messages-square" : "shopping-cart"}" aria-hidden="true"></i>${actionLabel}</a>
    </section>`;
  refreshIcons();
}

function isConsoleExtractableProduct(productKey) {
  return productKey !== "bandwidth";
}

function renderManagedDelivery(meta) {
  document.querySelector("#extractWorkspace").innerHTML = `
    <section class="panel extraction-empty">
      <span><i data-lucide="headphones" aria-hidden="true"></i></span>
      <h2>${escapeHtml(meta.name)}由高级技术支持独立交付</h2>
      <p>该产品不限流量、不限并发，代理地址、认证和接入配置不在控制台生成或提取。</p>
      <a class="button button-primary" href="https://www.123proxy.cn/contact.html#service" target="_blank" rel="noreferrer"><i data-lucide="messages-square" aria-hidden="true"></i>联系高级技术支持</a>
    </section>`;
  refreshIcons();
}

function authFields() {
  return `
    <fieldset class="extract-fieldset">
      <legend>认证方式</legend>
      <div class="extract-choice-row" id="extractAuthChoices">
        <button class="is-active" type="button" data-auth="user"><i data-lucide="key-round"></i><span><strong>账密认证</strong><small>使用代理用户和密码</small></span></button>
        <button type="button" data-auth="whitelist"><i data-lucide="shield-check"></i><span><strong>IP 白名单</strong><small>绑定当前套餐</small></span></button>
      </div>
      <label class="extract-field" id="proxyUserField">
        <span>代理用户</span>
        <select id="extractProxyUser">${userOptions()}</select>
        <small>${state.users.length ? "认证用户可在资源管理中设置独立流量限额" : "尚未创建代理用户"}</small>
      </label>
      <label class="extract-field" id="whitelistField" hidden>
        <span>白名单 IP</span>
        <textarea id="extractWhitelist" rows="4" spellcheck="false" placeholder="203.0.113.10&#10;198.51.100.24&#10;192.0.2.8">${escapeHtml(whitelistTextareaValue(orderWhitelist(selectedOrder())))}</textarea>
        <small id="extractWhitelistHint"></small>
        <small class="extract-field-note">${escapeHtml(whitelistScopeHelp())}</small>
      </label>
      ${state.users.length ? "" : '<a class="extract-inline-link" href="#users"><i data-lucide="user-round-plus"></i>创建代理用户</a>'}
    </fieldset>`;
}

function commonConnectionFields() {
  const unlimitedEndpoint = state.productKey === "unlimited";
  const endpointMode = (isTunnelProduct() || unlimitedEndpoint)
    ? `<div class="extract-field extract-endpoint-field">
        <span>接入地址</span>
        <div class="extract-choice-row is-compact" id="extractEndpointChoices">
          <button class="${unlimitedEndpoint ? "" : "is-active"}" type="button" data-endpoint-mode="1">
            <i data-lucide="whole-word"></i>
            <span><strong>HOSTNAME</strong><small>域名接入${unlimitedEndpoint ? "" : "，推荐"}</small></span>
          </button>
          <button class="${unlimitedEndpoint ? "is-active" : ""}" type="button" data-endpoint-mode="2">
            <i data-lucide="binary"></i>
            <span><strong>IP</strong><small>固定地址接入${unlimitedEndpoint ? "，默认" : ""}</small></span>
          </button>
        </div>
      </div>`
    : "";
  const countField = state.productKey === "unlimited"
    ? `<label class="extract-field">
        <span>套餐端口数量</span>
        <input id="extractCount" type="number" min="1" value="1" readonly>
        <small id="extractPortStatus">生成时输出当前套餐的全部连续端口</small>
      </label>`
    : `<label class="extract-field"><span>输出数量</span><input id="extractCount" type="number" min="1" max="1000" step="1" value="1" inputmode="numeric"><small>API 链接单次最多返回 1000 条</small></label>`;
  return `
    <fieldset class="extract-fieldset extract-access-fieldset">
      <legend>接入与输出</legend>
      ${endpointMode}
      <div class="extract-two-columns">
        <label class="extract-field"><span>代理协议</span><select id="extractProtocol"><option value="http">HTTP(S)</option><option value="socks">SOCKS5</option></select></label>
        ${countField}
      </div>
      <label class="extract-field">
        <span>代理输出格式</span>
        <select id="extractOutputFormat">
          ${PROXY_OUTPUT_FORMATS.map((format) => `<option value="${format.value}">${format.label}</option>`).join("")}
        </select>
        <small id="extractOutputFormatHint">${PROXY_OUTPUT_FORMATS[0].description}</small>
      </label>
    </fieldset>`;
}

function tunnelSettings() {
  return `
    <fieldset class="extract-fieldset">
      <legend>代理池与出口</legend>
      <div class="extract-choice-row" id="extractPoolChoices">
        <button class="is-active" type="button" data-pool="mixed"><i data-lucide="network"></i><span><strong>爬虫混合池</strong><small>约 95% 住宅 + 5% 数据中心，通常更快</small></span></button>
        <button type="button" data-pool="residential"><i data-lucide="house-plug"></i><span><strong>纯住宅池</strong><small>仅住宅 IP，支持 SESSION</small></span></button>
      </div>
      <label class="extract-field"><span>出口地区</span><select id="extractRegion">${TUNNEL_MIXED_REGIONS.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select><small>默认全球随机，地区为粗粒度范围。</small></label>
      <div class="extract-field" id="extractSessionField" hidden>
        <span>换 IP 周期</span>
        <div class="extract-choice-row is-compact" id="extractSessionChoices">
          <button class="is-active" type="button" data-session-mode="rotate">
            <i data-lucide="refresh-cw"></i>
            <span><strong>每次请求换 IP</strong><small>默认轮转模式</small></span>
          </button>
          <button type="button" data-session-mode="sticky">
            <i data-lucide="link"></i>
            <span><strong>固定 SESSION</strong><small>按时长保持出口</small></span>
          </button>
        </div>
      </div>
      <div class="extract-session-settings" id="extractSessionSettings" hidden>
        <div class="extract-two-columns">
          <label class="extract-field" id="extractSessionIdField">
            <span>SESSION ID</span>
            <input id="extractSessionId" type="text" minlength="12" maxlength="12" pattern="[A-Za-z0-9]{12}" autocomplete="off">
            <small>自定义 12 位英文字母或数字</small>
          </label>
          <label class="extract-field">
            <span>固定时长（分钟）</span>
            <input id="extractSessionMinutes" type="number" min="1" max="120" value="15">
            <small>支持 1-120 分钟</small>
          </label>
        </div>
        <div class="extract-session-guide">
          <span><i data-lucide="braces"></i>SESSION 用户名格式</span>
          <code id="extractSessionPattern">&lt;代理用户名&gt;-sess_&lt;SESSION_ID&gt;_&lt;分钟&gt;</code>
          <p id="extractSessionHelp">相同 SESSION ID 与时长会复用同一粘性路由；修改 ID 可创建新的 SESSION。</p>
          <div><small>当前预览</small><code id="extractSessionPreview">--</code></div>
        </div>
      </div>
    </fieldset>`;
}

function residentialSettings() {
  return `
    <fieldset class="extract-fieldset">
      <legend>国家定位与 SESSION</legend>
      <label class="extract-field">
        <span>出口国家或地区</span>
        <select id="extractRegion">${residentialCountryOptions()}</select>
        <small>默认全球随机；选择具体国家后，系统会把小写国家码写入认证用户名末尾，例如美国为 <code>+us</code>。</small>
      </label>
      <div class="extract-region-preview">
        <span><i data-lucide="map-pin"></i>当前定位规则</span>
        <strong id="extractRegionPreview">全球随机 · 用户名不添加国家后缀</strong>
        <p>国家定位由认证用户名控制。选择国家后，国家码必须位于用户名最后，例如美国为 <code>+us</code>。</p>
      </div>
      <div class="extract-field">
        <span>出口轮换方式</span>
        <div class="extract-choice-row is-compact" id="extractSessionChoices">
          <button class="is-active" type="button" data-session-mode="rotate">
            <i data-lucide="refresh-cw"></i>
            <span><strong>每次请求换 IP</strong><small>默认轮转</small></span>
          </button>
          <button type="button" data-session-mode="sticky">
            <i data-lucide="link"></i>
            <span><strong>Sticky SESSION</strong><small>按时长保持出口</small></span>
          </button>
        </div>
      </div>
      <div class="extract-session-settings" id="extractSessionSettings" hidden>
        <div class="extract-two-columns">
          <label class="extract-field" id="extractSessionIdField">
            <span>SESSION ID</span>
            <input id="extractSessionId" type="text" minlength="12" maxlength="12" pattern="[A-Za-z0-9]{12}" autocomplete="off">
            <small>12 位英文字母或数字；复用同一 ID 才能复用会话</small>
          </label>
          <label class="extract-field">
            <span>保持时长（分钟）</span>
            <input id="extractSessionMinutes" type="number" min="1" max="120" value="15">
            <small>1-120 分钟，超时后出口会重新分配</small>
          </label>
        </div>
        <div class="extract-session-guide">
          <span><i data-lucide="braces"></i>完整认证用户名结构</span>
          <code id="extractSessionPattern">&lt;代理用户名&gt;-sess_&lt;12位SESSION_ID&gt;_&lt;分钟&gt;+&lt;国家码&gt;</code>
          <p id="extractSessionHelp">SESSION 段位于代理用户名之后，国家码始终放在最后；相同完整用户名会尽量保持同一住宅出口。</p>
          <div><small>当前预览</small><code id="extractSessionPreview">--</code></div>
        </div>
      </div>
      <div class="extract-routing-help">
        <div><span>01</span><strong>选择国家</strong><p>全球随机不加后缀；美国添加 <code>+us</code>，日本添加 <code>+jp</code>。</p></div>
        <div><span>02</span><strong>决定是否保持出口</strong><p>默认每次请求轮换；Sticky SESSION 在设置时间内尽量复用出口。</p></div>
        <div><span>03</span><strong>等待配置同步</strong><p>首次生成或修改定位设置后，通常约需 3-15 分钟同步生效；这与 SESSION 保持时长无关。</p></div>
      </div>
    </fieldset>`;
}

function unlimitedSettings() {
  return `
    <fieldset class="extract-fieldset">
      <legend>套餐级出口设置</legend>
      <label class="extract-field"><span>国家或地区</span><select id="extractRegion">${countryOptions(ROTATING_COUNTRY_CODES.filter((code) => code !== "CN"), null, true)}</select><small>设置会应用到当前套餐的全部端口，不能为单个端口分别设置。</small></label>
      <label class="extract-field"><span>出口轮转周期（分钟）</span><input id="extractRotationMinutes" type="number" min="3" max="30" value="10"><small>每个端口在周期内保持出口，3-30 分钟后自动轮转。</small></label>
      <div class="extract-routing-help">
        <div><span>01</span><strong>连续端口接入</strong><p>生成结果会列出套餐从起始端口开始的全部端口，不使用网关接口返回的单个端口。</p></div>
        <div><span>02</span><strong>端口独立轮转</strong><p>每个端口在所选周期内保持自己的住宅出口，周期结束后自动更换。</p></div>
        <div><span>03</span><strong>套餐统一配置</strong><p>国家或地区与 3-30 分钟周期对套餐内全部端口生效，修改后通常需 3-15 分钟同步。</p></div>
      </div>
    </fieldset>`;
}

function renderDynamic(meta) {
  const isTunnel = isTunnelProduct();
  document.querySelector("#extractWorkspace").innerHTML = `
    <div class="extraction-layout">
      <form class="panel extraction-form" id="dynamicExtractForm">
        <header class="panel-head extraction-panel-head">
          <div><h2>${isTunnel ? "提取隧道代理" : "配置代理接入"}</h2><p>${isTunnel ? "选择套餐并生成可直接使用的隧道入口" : "所有设置均绑定当前选择的套餐"}</p></div>
          <div class="extraction-head-actions">
            <span class="live-badge"><i></i>PACKAGE READY</span>
            <button class="button button-primary extract-head-submit" type="submit" data-submit-label="生成代理" data-submit-icon="route"><i data-lucide="route" aria-hidden="true"></i>生成代理</button>
          </div>
        </header>
        <div class="extraction-form-body">
          <label class="extract-field"><span>使用套餐</span><select id="extractPackage">${orderOptions()}</select><small id="extractPackageStatus"></small></label>
          ${authFields()}
          ${commonConnectionFields()}
          ${isTunnelProduct() ? tunnelSettings() : state.productKey === "residential" ? residentialSettings() : unlimitedSettings()}
          <div class="extract-validation" id="extractValidation" hidden></div>
        </div>
        <footer class="extract-primary-footer">
          <button class="button button-primary" type="submit" data-submit-label="生成代理接入信息" data-submit-icon="route"><i data-lucide="route" aria-hidden="true"></i>生成代理接入信息</button>
          <small>生成会把认证、出口与接入地址设置保存到当前套餐</small>
        </footer>
      </form>
      <section class="panel extraction-output-panel">
        <header class="panel-head"><div><h2>代理接入信息</h2><p>生成后可直接复制到爬虫程序</p></div></header>
        <div id="extractOutput">${outputPlaceholder(meta)}</div>
      </section>
    </div>`;
  bindDynamicForm();
  updatePackageStatus();
  refreshIcons();
}

function outputPlaceholder(meta) {
  return `<div class="extraction-output-empty"><span><i data-lucide="terminal-square" aria-hidden="true"></i></span><strong>等待生成${escapeHtml(meta.name)}接入信息</strong><p>生成后可直接使用 cURL、Python、Node.js、Go、Java 或 PHP 接入。</p></div>`;
}

function updatePackageStatus() {
  const order = selectedOrder();
  const status = document.querySelector("#extractPackageStatus");
  if (status && order) status.textContent = `${packageAvailable(order)} · 有效期至 ${packageExpiry(order)}`;
  syncWhitelistField(order);
  if (state.productKey === "unlimited" && order) {
    const range = unlimitedPortRange(order);
    const count = document.querySelector("#extractCount");
    const portStatus = document.querySelector("#extractPortStatus");
    if (count) count.value = String(range.count);
    if (portStatus) {
      portStatus.textContent = range.start
        ? `将输出 ${range.start}-${range.end}，共 ${range.count} 个连续端口`
        : `将输出当前套餐的全部 ${range.count} 个端口`;
    }
  }
}

function setChoice(group, button) {
  group.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
}

function bindDynamicForm() {
  document.querySelector("#extractPackage")?.addEventListener("change", updatePackageStatus);
  document.querySelector("#extractAuthChoices")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-auth]");
    if (!button) return;
    setChoice(event.currentTarget, button);
    const whitelist = button.dataset.auth === "whitelist";
    document.querySelector("#proxyUserField").hidden = whitelist;
    document.querySelector("#whitelistField").hidden = !whitelist;
    if (whitelist) syncWhitelistField(selectedOrder());
    const sticky = document.querySelector("[data-session-mode='sticky']");
    if (isTunnelProduct() && sticky) {
      sticky.disabled = whitelist;
      sticky.setAttribute(
        "title",
        whitelist ? "隧道代理的白名单认证不支持 SESSION，请使用账密认证。" : ""
      );
      if (whitelist) {
        const rotate = document.querySelector("[data-session-mode='rotate']");
        if (rotate) setChoice(document.querySelector("#extractSessionChoices"), rotate);
        document.querySelector("#extractSessionSettings").hidden = true;
      }
    }
    updateSessionGuide();
  });
  document.querySelector("#extractProxyUser")?.addEventListener("change", updateSessionGuide);
  document.querySelector("#extractEndpointChoices")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-endpoint-mode]");
    if (button) setChoice(event.currentTarget, button);
  });
  document.querySelector("#extractOutputFormat")?.addEventListener("change", updateOutputFormatHint);
  document.querySelector("#extractPoolChoices")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pool]");
    if (!button) return;
    setChoice(event.currentTarget, button);
    const pure = button.dataset.pool === "residential";
    document.querySelector("#extractRegion").innerHTML = (pure ? TUNNEL_RESIDENTIAL_REGIONS : TUNNEL_MIXED_REGIONS)
      .map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    document.querySelector("#extractSessionField").hidden = !pure;
    if (!pure) {
      const rotate = document.querySelector("[data-session-mode='rotate']");
      if (rotate) setChoice(document.querySelector("#extractSessionChoices"), rotate);
      document.querySelector("#extractSessionSettings").hidden = true;
    }
  });
  document.querySelector("#extractSessionChoices")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-session-mode]");
    if (!button) return;
    setChoice(event.currentTarget, button);
    document.querySelector("#extractSessionSettings").hidden = button.dataset.sessionMode !== "sticky";
    updateSessionGuide();
  });
  document.querySelector("#extractSessionId")?.addEventListener("input", updateSessionGuide);
  document.querySelector("#extractSessionMinutes")?.addEventListener("input", updateSessionGuide);
  document.querySelector("#extractRegion")?.addEventListener("change", () => {
    updateResidentialRegionGuide();
    updateSessionGuide();
  });
  document.querySelector("#extractSession")?.addEventListener("change", (event) => {
    document.querySelector("#extractSessionMinutesField").hidden = !event.currentTarget.checked;
  });
  document.querySelector("#dynamicExtractForm")?.addEventListener("submit", generateDynamic);
  const sessionId = document.querySelector("#extractSessionId");
  if (sessionId && !sessionId.value) sessionId.value = randomSessionId();
  syncWhitelistField(selectedOrder());
  updateOutputFormatHint();
  updateResidentialRegionGuide();
  updateSessionGuide();
}

function currentAuth() {
  return document.querySelector("[data-auth].is-active")?.dataset.auth || "user";
}

function randomSessionId() {
  const source = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 12 }, () => source[Math.floor(Math.random() * source.length)]).join("");
}

function currentEndpointMode() {
  return document.querySelector("[data-endpoint-mode].is-active")?.dataset.endpointMode || "1";
}

function currentSessionMode() {
  return document.querySelector("[data-session-mode].is-active")?.dataset.sessionMode || "rotate";
}

function outputFormat(value) {
  return PROXY_OUTPUT_FORMATS.find((format) => format.value === String(value)) || PROXY_OUTPUT_FORMATS[0];
}

function updateOutputFormatHint() {
  const selected = outputFormat(document.querySelector("#extractOutputFormat")?.value);
  const hint = document.querySelector("#extractOutputFormatHint");
  if (hint) hint.textContent = selected.description;
}

function updateResidentialRegionGuide() {
  if (state.productKey !== "residential") return;
  const region = document.querySelector("#extractRegion")?.value || "all";
  const preview = document.querySelector("#extractRegionPreview");
  if (!preview) return;
  preview.textContent = region === "all"
    ? "全球随机 · 用户名不添加国家后缀"
    : `${residentialRegionName(region)} · 用户名末尾添加 +${region}`;
}

function updateSessionGuide() {
  const preview = document.querySelector("#extractSessionPreview");
  if (!preview) return;
  const whitelist = currentAuth() === "whitelist";
  const sessionIdField = document.querySelector("#extractSessionIdField");
  const pattern = document.querySelector("#extractSessionPattern");
  const help = document.querySelector("#extractSessionHelp");
  const region = document.querySelector("#extractRegion")?.value || "all";
  const geoSuffix = state.productKey === "residential" && region !== "all" ? `+${region}` : "";
  if (sessionIdField) sessionIdField.hidden = whitelist;
  if (whitelist) {
    pattern.textContent = state.productKey === "residential"
      ? `系统路由: sess_<SESSION_ID>_<分钟>${geoSuffix || "+<国家码>"}`
      : "白名单认证由套餐 TTL 保持出口，无需修改代理用户名";
    help.textContent = state.productKey === "residential"
      ? "白名单模式无需在程序中发送认证用户名，系统仍会按国家和 SESSION 设置保存套餐路由。"
      : "固定时长会保存到当前套餐；使用已加入白名单的爬虫服务器访问代理入口。";
    preview.textContent = `白名单 SESSION · ${document.querySelector("#extractSessionMinutes")?.value || 15} 分钟${geoSuffix ? ` · ${residentialRegionName(region)}` : ""}`;
    return;
  }
  const baseUser = selectedUser()?.username || "<代理用户名>";
  const sessionId = document.querySelector("#extractSessionId")?.value.trim() || "<SESSION_ID>";
  const minutes = document.querySelector("#extractSessionMinutes")?.value || "<分钟>";
  pattern.textContent = state.productKey === "residential"
    ? "<代理用户名>-sess_<12位SESSION_ID>_<分钟>+<国家码>"
    : "<代理用户名>-sess_<SESSION_ID>_<分钟>";
  help.textContent = state.productKey === "residential"
    ? "SESSION 段位于代理用户名之后，国家码始终放在最后；复用相同完整用户名会尽量保持同一住宅出口。"
    : "相同 SESSION ID 与时长会复用同一粘性路由；修改 ID 可创建新的 SESSION。";
  preview.textContent = `${baseUser}-sess_${sessionId}_${minutes}${geoSuffix}`;
}

function validWhitelist(value) {
  if (!value || value.includes("，")) return false;
  const entries = whitelistEntries(value);
  return entries.length > 0 && entries.every((part) => {
    const pieces = part.trim().split(".");
    return pieces.length === 4 && pieces.every((piece) => /^\d{1,3}$/.test(piece) && number(piece) <= 255);
  });
}

function whitelistEntries(value) {
  return [...new Set(
    String(value || "")
      .split(/[\r\n,]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
  )];
}

function normalizeWhitelist(value) {
  return whitelistEntries(value).join(",");
}

function dynamicSettings() {
  const order = selectedOrder();
  const auth = currentAuth();
  const user = selectedUser();
  const protocol = document.querySelector("#extractProtocol").value;
  const count = Math.floor(number(document.querySelector("#extractCount").value));
  const region = document.querySelector("#extractRegion").value;
  const whitelistInput = document.querySelector("#extractWhitelist")?.value || "";
  const whitelist = normalizeWhitelist(whitelistInput);
  const checkboxSession = Boolean(document.querySelector("#extractSession")?.checked);
  const sessionMinutes = Math.floor(number(document.querySelector("#extractSessionMinutes")?.value || 0));
  const sessionId = document.querySelector("#extractSessionId")?.value.trim() || "";
  const rotationMinutes = Math.floor(number(document.querySelector("#extractRotationMinutes")?.value || 0));
  const pool = document.querySelector("[data-pool].is-active")?.dataset.pool || "";
  const endpointMode = currentEndpointMode();
  const outputFormatValue = document.querySelector("#extractOutputFormat")?.value || "1";
  const choiceSession = (isTunnelProduct() || state.productKey === "residential") && currentSessionMode() === "sticky";
  const session = isTunnelProduct() && auth === "whitelist"
    ? false
    : ((isTunnelProduct() || state.productKey === "residential") ? choiceSession : checkboxSession);
  return {
    order,
    auth,
    user,
    protocol,
    count,
    region,
    whitelist,
    session,
    sessionMinutes,
    sessionId,
    rotationMinutes,
    pool,
    endpointMode,
    outputFormat: outputFormatValue,
    productKey: state.productKey
  };
}

function validateDynamic(settings) {
  if (!settings.order) return "请选择可用套餐。";
  if (settings.count < 1 || settings.count > 1000) return "输出数量必须在 1-1000 之间。";
  if (settings.auth === "user" && !settings.user) return "请先创建并选择代理用户。";
  if (settings.auth === "whitelist" && !validWhitelist(settings.whitelist)) return "请输入有效的 IPv4 白名单，每行填写一个地址。";
  if (settings.session && (settings.sessionMinutes < 1 || settings.sessionMinutes > 120)) return "SESSION 时长必须在 1-120 分钟之间。";
  if (
    (isTunnelProduct() || state.productKey === "residential") &&
    settings.session &&
    settings.auth === "user" &&
    !/^[A-Za-z0-9]{12}$/.test(settings.sessionId)
  ) return "SESSION ID 必须是 12 位英文字母或数字。";
  if (state.productKey === "unlimited" && (settings.rotationMinutes < 3 || settings.rotationMinutes > 30)) return "出口轮转周期必须在 3-30 分钟之间。";
  return "";
}

function buildDynamicRouting(settings, productKey = state.productKey) {
  let username = settings.auth === "user" ? settings.user?.username || "" : "";
  let cap = "";
  let tag = "all";
  let mode = "1";
  let ttl = 0;
  let updateIp = false;
  let retrieveRegion = settings.region;

  if (isTunnelProduct(productKey)) {
    mode = settings.endpointMode || "1";
    tag = settings.region;
    updateIp = true;
    if (settings.auth === "user" && settings.session && settings.pool === "residential") {
      ttl = settings.sessionMinutes;
      username += `${username ? "-" : ""}sess_${settings.sessionId}_${settings.sessionMinutes}`;
    }
  }
  if (productKey === "residential") {
    tag = settings.region === "eu" ? "zz-eu" : "zz-all";
    if (settings.session) {
      username += `${username ? "-" : ""}sess_${settings.sessionId}_${settings.sessionMinutes}`;
    }
    if (settings.region !== "all") username += `+${settings.region}`;
    cap = username;
  }
  if (productKey === "unlimited") {
    mode = settings.endpointMode || "2";
    tag = "zz-unlimit";
    const routeParts = [`sess_${randomSessionId()}_${settings.rotationMinutes}`];
    if (settings.region !== "all") routeParts.push(`+${settings.region}`);
    cap = routeParts.join("");
  }

  return { username, cap, tag, mode, ttl, updateIp, retrieveRegion };
}

function whitelistRequestParameters(settings, routing, productKey = state.productKey) {
  const whitelistTtl = isTunnelProduct(productKey) ? 0 : -1;
  return {
    userip: settings.auth === "whitelist" ? settings.whitelist : "",
    protocol: settings.protocol === "socks" ? "socks" : "proxy",
    needpwd: "false",
    updateip: String(routing.updateIp),
    ttl: String(settings.auth === "whitelist" ? whitelistTtl : routing.ttl),
    cap: routing.cap,
    tag: routing.tag,
    mode: routing.mode
  };
}

function whitelistUpdatePath(settings, routing, productKey = state.productKey) {
  const params = new URLSearchParams(whitelistRequestParameters(settings, routing, productKey));
  return `/ip/whitelist/${encodeURIComponent(packageId(settings.order))}?${params.toString()}`;
}

function retrieveApiUrl(settings, routing, productKey = state.productKey) {
  const params = new URLSearchParams({
    protocol: settings.protocol,
    region: routing.retrieveRegion,
    usepwd: String(settings.auth === "user"),
    count: String(productKey === "unlimited" ? Math.max(1, number(settings.order.total)) : settings.count),
    format: "text",
    txt_type: settings.outputFormat || "1",
    loginuser: settings.auth === "user" ? routing.username : "",
    pool: routing.tag,
    mode: routing.mode
  });
  return `${apiBase()}/ip/retreveip/${encodeURIComponent(packageId(settings.order))}?${params.toString()}`;
}

async function generateDynamic(event) {
  event.preventDefault();
  const settings = dynamicSettings();
  const validation = validateDynamic(settings);
  const validationBox = document.querySelector("#extractValidation");
  if (validation) {
    validationBox.hidden = false;
    validationBox.textContent = validation;
    return;
  }
  validationBox.hidden = true;
  const buttons = [...event.currentTarget.querySelectorAll('[type="submit"]')];
  buttons.forEach((button) => {
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span>正在生成';
  });
  try {
    const routing = buildDynamicRouting(settings);
    const gateway = await request(whitelistUpdatePath(settings, routing), { method: "POST", body: "{}" });
    if (!gateway?.host || !gateway?.port) throw new ExtractRequestError("代理网关生成失败，请稍后重试");
    const output = buildConnectionOutput(settings, routing, gateway, retrieveApiUrl(settings, routing));
    state.output = output;
    rememberOrderWhitelist(settings);
    renderConnectionOutput(output);
    showToast("代理接入信息已生成");
  } catch (error) {
    setNotice("error", error.message || "代理生成失败，请稍后重试");
  } finally {
    buttons.forEach((button) => {
      button.disabled = false;
      button.innerHTML = `<i data-lucide="${button.dataset.submitIcon || "route"}" aria-hidden="true"></i>${button.dataset.submitLabel || "生成代理"}`;
    });
    refreshIcons();
  }
}

function codeString(value) {
  return JSON.stringify(String(value ?? ""));
}

function phpString(value) {
  return `'${String(value ?? "").replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
}

function shellString(value) {
  return `"${String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("$", "\\$")
    .replaceAll("`", "\\`")}"`;
}

function buildApiSnippets(apiUrl) {
  const url = String(apiUrl || "");
  return {
    apiUrl: url,
    curl: `curl --fail-with-body --silent --show-error ${shellString(url)}`,
    python: `# pip install requests
import requests

url = ${codeString(url)}
response = requests.get(url, timeout=30)
response.raise_for_status()
print(response.text)`,
    nodejs: `// Node.js 18+
async function main() {
  const url = ${codeString(url)};
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${await response.text()}\`);
  }
  console.log(await response.text());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`,
    go: `package main

import (
    "fmt"
    "io"
    "net/http"
    "time"
)

func main() {
    client := &http.Client{Timeout: 30 * time.Second}
    response, err := client.Get(${codeString(url)})
    if err != nil {
        panic(err)
    }
    defer response.Body.Close()

    body, err := io.ReadAll(response.Body)
    if err != nil {
        panic(err)
    }
    if response.StatusCode >= 400 {
        panic(fmt.Sprintf("HTTP %d: %s", response.StatusCode, body))
    }
    fmt.Println(string(body))
}`,
    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public final class ExtractProxy {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(${codeString(url)}))
            .timeout(Duration.ofSeconds(30))
            .GET()
            .build();

        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );
        if (response.statusCode() >= 400) {
            throw new IllegalStateException(
                "HTTP " + response.statusCode() + ": " + response.body()
            );
        }
        System.out.println(response.body());
    }
}`,
    php: `<?php
$url = ${phpString(url)};
$curl = curl_init($url);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_FAILONERROR => true,
]);

$response = curl_exec($curl);
if ($response === false) {
    throw new RuntimeException(curl_error($curl));
}
curl_close($curl);
echo $response;`
  };
}

function buildStaticExtractionSnippets(apiUrl, protocol = "proxy") {
  const url = String(apiUrl || "");
  const protocolLabel = protocol === "socks" ? "SOCKS5" : "HTTP(S)";
  return {
    apiUrl: url,
    protocol: protocol === "socks" ? "socks" : "proxy",
    protocolLabel,
    responseFormat: "HOST:PORT:USER:PASSWORD",
    curl: `# 此链接用于分配固定 IP，不是代理地址；请只按计划调用一次。
# 请求最多可能等待约 5 分钟，响应每行格式为 HOST:PORT:USER:PASSWORD。
extract_url=${shellString(url)}
curl --fail-with-body --silent --show-error \
  --max-time 330 \
  "$extract_url"`,
    python: `# pip install requests
# 此请求会从套餐中分配固定 IP，请勿把 extract_url 配置为代理地址。
import requests

extract_url = ${codeString(url)}
response = requests.get(extract_url, timeout=330)
response.raise_for_status()

proxies = []
for line in response.text.splitlines():
    line = line.strip()
    if not line:
        continue
    parts = line.split(":", 3)
    if len(parts) != 4 or not parts[1].isdigit():
        raise ValueError(f"无法识别提取结果: {line}")
    host, port, username, password = parts
    proxies.append({
        "host": host,
        "port": int(port),
        "username": username,
        "password": password,
    })

print(proxies)`,
    nodejs: `// Node.js 18+
// 此请求会从套餐中分配固定 IP，请勿把 extractUrl 配置为代理地址。
async function main() {
  const extractUrl = ${codeString(url)};
  const response = await fetch(extractUrl, {
    signal: AbortSignal.timeout(330_000),
  });

  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${await response.text()}\`);
  }

  const proxies = (await response.text())
    .split(/\\r?\\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [host, port, username, ...passwordParts] = line.split(":");
      if (!host || !/^\\d+$/.test(port) || !username || passwordParts.length === 0) {
        throw new Error(\`无法识别提取结果: \${line}\`);
      }
      return {
        host,
        port: Number(port),
        username,
        password: passwordParts.join(":"),
      };
    });

  console.log(proxies);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`,
    go: `package main

import (
    "bufio"
    "fmt"
    "io"
    "net/http"
    "strconv"
    "strings"
    "time"
)

type ProxyCredential struct {
    Host     string
    Port     int
    Username string
    Password string
}

func main() {
    // 此请求会从套餐中分配固定 IP，请勿把 extractURL 配置为代理地址。
    extractURL := ${codeString(url)}
    client := &http.Client{Timeout: 330 * time.Second}
    response, err := client.Get(extractURL)
    if err != nil {
        panic(err)
    }
    defer response.Body.Close()

    if response.StatusCode >= 400 {
        body, _ := io.ReadAll(response.Body)
        panic(fmt.Sprintf("HTTP %d: %s", response.StatusCode, body))
    }

    var proxies []ProxyCredential
    scanner := bufio.NewScanner(response.Body)
    for scanner.Scan() {
        line := strings.TrimSpace(scanner.Text())
        if line == "" {
            continue
        }
        parts := strings.SplitN(line, ":", 4)
        if len(parts) != 4 {
            panic("无法识别提取结果: " + line)
        }
        port, err := strconv.Atoi(parts[1])
        if err != nil {
            panic("端口格式错误: " + line)
        }
        proxies = append(proxies, ProxyCredential{
            Host: parts[0], Port: port, Username: parts[2], Password: parts[3],
        })
    }
    if err := scanner.Err(); err != nil {
        panic(err)
    }
    fmt.Printf("%+v\\n", proxies)
}`,
    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public final class ExtractStaticProxy {
    record ProxyCredential(
        String host,
        int port,
        String username,
        String password
    ) {}

    public static void main(String[] args) throws Exception {
        // 此请求会从套餐中分配固定 IP，请勿把 extractUrl 配置为代理地址。
        String extractUrl = ${codeString(url)};
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(extractUrl))
            .timeout(Duration.ofSeconds(330))
            .GET()
            .build();

        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );
        if (response.statusCode() >= 400) {
            throw new IllegalStateException(
                "HTTP " + response.statusCode() + ": " + response.body()
            );
        }

        List<ProxyCredential> proxies = new ArrayList<>();
        for (String rawLine : response.body().split("\\\\R")) {
            String line = rawLine.trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split(":", 4);
            if (parts.length != 4) {
                throw new IllegalArgumentException("无法识别提取结果: " + line);
            }
            proxies.add(new ProxyCredential(
                parts[0],
                Integer.parseInt(parts[1]),
                parts[2],
                parts[3]
            ));
        }
        System.out.println(proxies);
    }
}`,
    php: `<?php
// 此请求会从套餐中分配固定 IP，请勿把 $extractUrl 配置为代理地址。
$extractUrl = ${phpString(url)};
$curl = curl_init($extractUrl);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_TIMEOUT => 330,
    CURLOPT_FAILONERROR => true,
]);

$response = curl_exec($curl);
if ($response === false) {
    throw new RuntimeException(curl_error($curl));
}
curl_close($curl);

$proxies = [];
foreach (preg_split('/\\R/', trim($response)) as $line) {
    if ($line === '') {
        continue;
    }
    $parts = explode(':', $line, 4);
    if (count($parts) !== 4 || !ctype_digit($parts[1])) {
        throw new RuntimeException('无法识别提取结果: ' . $line);
    }
    [$host, $port, $username, $password] = $parts;
    $proxies[] = [
        'host' => $host,
        'port' => (int) $port,
        'username' => $username,
        'password' => $password,
    ];
}

print_r($proxies);`
  };
}

function buildProxySnippets({ host, port, endpoint, username, password, proxyUrl, protocol }) {
  const targetUrl = "https://ifconfig.me";
  const useSocks = protocol === "socks";
  const pythonDependency = useSocks ? "requests[socks]" : "requests";
  const nodeDependencies = useSocks ? "got@11 socks-proxy-agent" : "got@11 hpagent";
  const nodeAgentSource = useSocks
    ? `const { SocksProxyAgent } = require("socks-proxy-agent");
const proxyAgent = new SocksProxyAgent(proxyUrl);
const agents = { http: proxyAgent, https: proxyAgent };`
    : `const { HttpProxyAgent, HttpsProxyAgent } = require("hpagent");
const agents = {
  http: new HttpProxyAgent({ proxy: proxyUrl }),
  https: new HttpsProxyAgent({ proxy: proxyUrl }),
};`;
  const goSource = useSocks
    ? `// go get golang.org/x/net/proxy
package main

import (
    "context"
    "fmt"
    "io"
    "net"
    "net/http"
    "time"

    "golang.org/x/net/proxy"
)

func main() {
    proxyUser := ${codeString(username)}
    proxyPassword := ${codeString(password)}
    var auth *proxy.Auth
    if proxyUser != "" {
        auth = &proxy.Auth{User: proxyUser, Password: proxyPassword}
    }

    dialer, err := proxy.SOCKS5("tcp", ${codeString(endpoint)}, auth, proxy.Direct)
    if err != nil {
        panic(err)
    }
    transport := &http.Transport{
        DialContext: func(
            _ context.Context,
            network string,
            address string,
        ) (net.Conn, error) {
            return dialer.Dial(network, address)
        },
    }
    client := &http.Client{Transport: transport, Timeout: 30 * time.Second}
    response, err := client.Get(${codeString(targetUrl)})
    if err != nil {
        panic(err)
    }
    defer response.Body.Close()

    body, err := io.ReadAll(response.Body)
    if err != nil {
        panic(err)
    }
    if response.StatusCode >= 400 {
        panic(fmt.Sprintf("HTTP %d: %s", response.StatusCode, body))
    }
    fmt.Println(string(body))
}`
    : `package main

import (
    "fmt"
    "io"
    "net/http"
    "net/url"
    "time"
)

func main() {
    proxyURL, err := url.Parse(${codeString(proxyUrl)})
    if err != nil {
        panic(err)
    }
    client := &http.Client{
        Transport: &http.Transport{Proxy: http.ProxyURL(proxyURL)},
        Timeout:   30 * time.Second,
    }
    response, err := client.Get(${codeString(targetUrl)})
    if err != nil {
        panic(err)
    }
    defer response.Body.Close()

    body, err := io.ReadAll(response.Body)
    if err != nil {
        panic(err)
    }
    if response.StatusCode >= 400 {
        panic(fmt.Sprintf("HTTP %d: %s", response.StatusCode, body))
    }
    fmt.Println(string(body))
}`;

  const javaAuth = username
    ? `
        final String proxyUser = ${codeString(username)};
        final String proxyPassword = ${codeString(password)};
        Authenticator.setDefault(new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                    proxyUser,
                    proxyPassword.toCharArray()
                );
            }
        });
`
    : "";

  const phpAuth = username
    ? `    CURLOPT_PROXYUSERPWD => ${phpString(`${username}:${password}`)},\n`
    : "";

  return {
    curl: `curl --fail-with-body --silent --show-error \\
  --proxy ${shellString(proxyUrl)} \\
  ${shellString(targetUrl)}`,
    python: `# pip install "${pythonDependency}"
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

proxy_url = ${codeString(proxyUrl)}
proxies = {
    "http": proxy_url,
    "https": proxy_url,
}
target_url = ${codeString(targetUrl)}
concurrency = 5

def fetch(index):
    with requests.Session() as session:
        session.proxies.update(proxies)
        response = session.get(target_url, timeout=30)
        response.raise_for_status()
        return index, response.text

with ThreadPoolExecutor(max_workers=concurrency) as executor:
    futures = [executor.submit(fetch, index) for index in range(concurrency)]
    for future in as_completed(futures):
        index, body = future.result()
        print(f"[{index}] {body}")`,
    nodejs: `// npm install ${nodeDependencies}
const got = require("got");

async function main() {
  const proxyUrl = ${codeString(proxyUrl)};
  ${nodeAgentSource}
  const concurrency = 5;
  const requests = Array.from({ length: concurrency }, async (_, index) => {
    const response = await got(${codeString(targetUrl)}, {
      agent: agents,
      timeout: { request: 30_000 },
      retry: { limit: 0 },
    });
    console.log(\`[\${index}] \${response.body}\`);
  });
  await Promise.all(requests);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`,
    go: goSource,
    java: `import java.io.InputStream;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.PasswordAuthentication;
import java.net.Proxy;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public final class ProxyRequest {
    public static void main(String[] args) throws Exception {${javaAuth}
        Proxy proxy = new Proxy(
            Proxy.Type.${useSocks ? "SOCKS" : "HTTP"},
            new InetSocketAddress(${codeString(host)}, ${Number(port)})
        );
        HttpURLConnection connection = (HttpURLConnection)
            new URL(${codeString(targetUrl)}).openConnection(proxy);
        connection.setConnectTimeout(30_000);
        connection.setReadTimeout(30_000);

        try (InputStream input = connection.getInputStream()) {
            String body = new String(
                input.readAllBytes(),
                StandardCharsets.UTF_8
            );
            System.out.println(body);
        } finally {
            connection.disconnect();
        }
    }
}`,
    php: `<?php
$curl = curl_init(${phpString(targetUrl)});
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_PROXY => ${phpString(endpoint)},
    CURLOPT_PROXYTYPE => ${useSocks ? "CURLPROXY_SOCKS5_HOSTNAME" : "CURLPROXY_HTTP"},
${phpAuth}    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_FAILONERROR => true,
]);

$response = curl_exec($curl);
if ($response === false) {
    throw new RuntimeException(curl_error($curl));
}
curl_close($curl);
echo $response;`
  };
}

function buildConnectionOutput(settings, routing, gateway, apiUrl) {
  const productKey = settings.productKey || state.productKey;
  if (productKey === "unlimited") {
    return buildUnlimitedConnectionOutput(settings, routing, gateway, apiUrl);
  }
  const username = settings.auth === "user" ? routing.username : "";
  const password = settings.auth === "user" ? settings.user.password : "";
  const auth = settings.auth === "user"
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : "";
  const endpoint = `${gateway.host}:${gateway.port}`;
  const proxyUrl = `${settings.protocol === "socks" ? "socks5h" : "http"}://${auth}${endpoint}`;
  const selectedFormat = outputFormat(settings.outputFormat);
  const credential = formatProxyCredential({
    host: gateway.host,
    port: gateway.port,
    username,
    password
  }, selectedFormat.value);
  const endpointMode = routing.mode === "2" ? "IP" : "HOSTNAME";
  const protocolLabel = settings.protocol === "socks" ? "SOCKS5" : "HTTP(S)";
  const region = settings.region || "all";
  const regionName = productKey === "residential" ? residentialRegionName(region) : "";
  const geoSuffix = productKey === "residential" && region !== "all" ? `+${region}` : "";
  const baseUsername = settings.auth === "user" ? settings.user?.username || "" : "";
  const sessionSuffix = settings.session ? `-sess_${settings.sessionId}_${settings.sessionMinutes}` : "";
  const sessionSummary = settings.session
    ? (settings.auth === "user"
        ? `${settings.sessionId} · ${settings.sessionMinutes} 分钟`
        : `白名单 TTL · ${settings.sessionMinutes} 分钟`)
    : "每次请求轮换";
  const snippets = buildProxySnippets({
    host: gateway.host,
    port: gateway.port,
    endpoint,
    username,
    password,
    proxyUrl,
    protocol: settings.protocol
  });
  const connection = [
    `接入地址类型: ${endpointMode}`,
    `代理主机: ${gateway.host}`,
    `代理端口: ${gateway.port}`,
    `代理协议: ${protocolLabel}`,
    `认证方式: ${settings.auth === "user" ? "代理账密" : "套餐 IP 白名单"}`,
    ...(username ? [`认证用户名: ${username}`, `认证密码: ${password}`] : []),
    ...(settings.auth === "whitelist" ? [`生效白名单: ${settings.whitelist}`] : []),
    ...(productKey === "residential" ? [`国家定位: ${regionName}${geoSuffix ? ` (${geoSuffix})` : ""}`] : []),
    `换 IP 周期: ${sessionSummary}`,
    `输出格式: ${selectedFormat.label}`,
    "",
    credential
  ].join("\n");
  return {
    endpoint,
    endpointMode,
    productKey,
    protocolLabel,
    username,
    password,
    credential,
    outputFormat: selectedFormat.label,
    sessionSummary,
    region,
    regionName,
    geoSuffix,
    baseUsername,
    sessionSuffix,
    sessionId: settings.sessionId || "",
    sessionMinutes: settings.sessionMinutes || 0,
    usesSession: Boolean(settings.session),
    usesWhitelist: settings.auth === "whitelist",
    whitelist: settings.auth === "whitelist" ? settings.whitelist : "",
    routingUsername: routing.username || "",
    proxyUrl,
    apiUrl,
    connection,
    ...snippets
  };
}

function unlimitedPortRange(order, gateway = null) {
  const count = Math.max(1, Math.floor(number(order?.total || 1)));
  const start = Math.floor(number(order?.portStart || gateway?.port));
  return {
    count,
    start,
    end: start ? start + count - 1 : 0
  };
}

function buildUnlimitedConnectionOutput(settings, routing, gateway, apiUrl) {
  const username = settings.auth === "user" ? routing.username : "";
  const password = settings.auth === "user" ? settings.user?.password || "" : "";
  const selectedFormat = outputFormat(settings.outputFormat);
  const range = unlimitedPortRange(settings.order, gateway);
  const firstPort = range.start || number(gateway?.port);
  const host = String(gateway?.host || "");
  const firstEndpoint = `${host}:${firstPort}`;
  const endpoint = range.start ? `${host}:${range.start}-${range.end}` : firstEndpoint;
  const auth = settings.auth === "user"
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : "";
  const proxyUrl = `${settings.protocol === "socks" ? "socks5h" : "http"}://${auth}${firstEndpoint}`;
  const credentials = Array.from({ length: range.count }, (_, index) => (
    formatProxyCredential({
      host,
      port: firstPort + index,
      username,
      password
    }, selectedFormat.value)
  ));
  const firstCredential = credentials[0] || "";
  const portList = credentials.join("\n");
  const endpointMode = routing.mode === "2" ? "IP" : "HOSTNAME";
  const protocolLabel = settings.protocol === "socks" ? "SOCKS5" : "HTTP(S)";
  const region = settings.region || "all";
  const regionName = region === "all" ? "全球随机" : countryName(region.toUpperCase());
  const rotationMinutes = Math.max(3, Math.floor(number(settings.rotationMinutes || 3)));
  const sessionSummary = `${rotationMinutes} 分钟固定轮转`;
  const baseSnippets = buildProxySnippets({
    host,
    port: firstPort,
    endpoint: firstEndpoint,
    username,
    password,
    proxyUrl,
    protocol: settings.protocol
  });
  const rangeNote = `套餐端口范围 ${range.start}-${range.end}（共 ${range.count} 个）；以下示例使用首个端口 ${firstPort}。`;
  const snippets = {
    ...baseSnippets,
    curl: `# ${rangeNote}\n${baseSnippets.curl}`,
    python: `# ${rangeNote}\n${baseSnippets.python}`,
    nodejs: `// ${rangeNote}\n${baseSnippets.nodejs}`,
    go: `// ${rangeNote}\n${baseSnippets.go}`,
    java: `// ${rangeNote}\n${baseSnippets.java}`,
    php: `<?php\n// ${rangeNote}\n${baseSnippets.php.replace(/^<\?php\n?/, "")}`
  };
  const connection = [
    `接入地址类型: ${endpointMode}`,
    `代理主机: ${host}`,
    `代理端口范围: ${range.start}-${range.end}`,
    `套餐端口数量: ${range.count}`,
    `代理协议: ${protocolLabel}`,
    `认证方式: ${settings.auth === "user" ? "代理账密" : "套餐 IP 白名单"}`,
    ...(username ? [`认证用户名: ${username}`, `认证密码: ${password}`] : []),
    ...(settings.auth === "whitelist" ? [`生效白名单: ${settings.whitelist}`] : []),
    `出口地区: ${regionName}${region !== "all" ? ` (${region.toUpperCase()})` : ""}`,
    `出口轮转周期: ${rotationMinutes} 分钟`,
    `输出格式: ${selectedFormat.label}`,
    "",
    portList
  ].join("\n");
  return {
    endpoint,
    firstEndpoint,
    endpointMode,
    productKey: "unlimited",
    protocolLabel,
    host,
    portStart: range.start,
    portEnd: range.end,
    portCount: range.count,
    portRange: `${range.start}-${range.end}`,
    username,
    password,
    credential: portList,
    firstCredential,
    outputFormat: selectedFormat.label,
    sessionSummary,
    rotationMinutes,
    region,
    regionName,
    usesWhitelist: settings.auth === "whitelist",
    whitelist: settings.auth === "whitelist" ? settings.whitelist : "",
    proxyUrl,
    apiUrl,
    connection,
    ...snippets
  };
}

function formatProxyCredential(connection, formatValue = "1") {
  const host = String(connection?.host || "");
  const port = String(connection?.port || "");
  const username = String(connection?.username || "");
  const password = String(connection?.password || "");
  if (!username) return `${host}:${port}`;
  if (String(formatValue) === "2") return `${host}:${port}@${username}:${password}`;
  if (String(formatValue) === "3") return `${username}:${password}:${host}:${port}`;
  if (String(formatValue) === "4") return `${username}:${password}@${host}:${port}`;
  return `${host}:${port}:${username}:${password}`;
}

function outputTabsMarkup(tabs, activeKey) {
  return `<div class="output-tabs" role="tablist" aria-label="代码示例语言">
    ${tabs.map(([key, label]) => `<button
      class="${key === activeKey ? "is-active" : ""}"
      type="button"
      role="tab"
      aria-selected="${key === activeKey ? "true" : "false"}"
      tabindex="${key === activeKey ? "0" : "-1"}"
      data-output-tab="${key}"
    >${label}</button>`).join("")}
  </div>`;
}

function outputCodeMarkup(output, activeKey, copyLabel = "复制") {
  return `
    <div class="output-code">
      <pre><code id="outputCodeValue" data-code-language="${activeKey}">${escapeHtml(output[activeKey] || "")}</code></pre>
      <button type="button" data-copy-output="active" title="复制当前内容"><i data-lucide="copy"></i>${copyLabel}</button>
    </div>`;
}

function renderConnectionOutput(output) {
  if (output.productKey === "unlimited") {
    renderUnlimitedConnectionOutput(output);
    return;
  }
  document.querySelector("#extractOutput").innerHTML = `
    <div class="connection-result">
      <div class="connection-status"><span></span><strong>代理网关已生成</strong><small>READY</small></div>
      <dl class="connection-details">
        <div><dt>接入地址<small>${escapeHtml(output.endpointMode)}</small></dt><dd><code>${escapeHtml(output.endpoint)}</code><button type="button" data-copy-output="endpoint" title="复制代理地址"><i data-lucide="copy"></i></button></dd></div>
        ${output.username ? `<div><dt>认证用户名</dt><dd><code>${escapeHtml(output.username)}</code><button type="button" data-copy-output="username" title="复制用户名"><i data-lucide="copy"></i></button></dd></div>
        <div><dt>认证密码</dt><dd><code>${escapeHtml(output.password)}</code><button type="button" data-copy-output="password" title="复制密码"><i data-lucide="copy"></i></button></dd></div>` : `<div><dt>认证方式</dt><dd><strong>套餐 IP 白名单</strong></dd></div>
        <div><dt>生效白名单<small>当前套餐</small></dt><dd><code>${escapeHtml(whitelistTextareaValue(output.whitelist))}</code><button type="button" data-copy-output="whitelist" title="复制白名单"><i data-lucide="copy"></i></button></dd></div>`}
        <div><dt>完整代理格式<small>${escapeHtml(output.outputFormat)}</small></dt><dd><code>${escapeHtml(output.credential)}</code><button type="button" data-copy-output="credential" title="复制完整代理格式"><i data-lucide="copy"></i></button></dd></div>
        <div><dt>协议与轮换</dt><dd><strong>${escapeHtml(output.protocolLabel)} · ${escapeHtml(output.sessionSummary)}</strong></dd></div>
      </dl>
      ${residentialConnectionGuide(output)}
      ${outputTabsMarkup(CONNECTION_CODE_TABS, "connection")}
      ${outputCodeMarkup(output, "connection")}
      <div class="output-parameter-note">
        <strong>API 输出参数</strong>
        <span><code>txt_type=1</code> HOST:PORT:USER:PASSWORD</span>
        <span><code>txt_type=2</code> HOST:PORT@USER:PASSWORD</span>
        <span><code>txt_type=3</code> USER:PASSWORD:HOST:PORT</span>
        <span><code>txt_type=4</code> USER:PASSWORD@HOST:PORT</span>
      </div>
      <p class="output-security"><i data-lucide="shield-check"></i>代理密码仅在当前页面显示，请勿提交到公开代码仓库。</p>
    </div>`;
  bindOutputActions();
  refreshIcons();
}

function renderUnlimitedConnectionOutput(output) {
  document.querySelector("#extractOutput").innerHTML = `
    <div class="connection-result">
      <div class="connection-status"><span></span><strong>套餐端口配置已保存</strong><small>READY</small></div>
      <dl class="connection-details">
        <div><dt>代理主机<small>${escapeHtml(output.endpointMode)}</small></dt><dd><code>${escapeHtml(output.host)}</code><button type="button" data-copy-output="host" title="复制代理主机"><i data-lucide="copy"></i></button></dd></div>
        <div><dt>代理端口范围<small>${output.portCount} 个连续端口</small></dt><dd><code>${escapeHtml(output.portRange)}</code><button type="button" data-copy-output="portRange" title="复制端口范围"><i data-lucide="copy"></i></button></dd></div>
        ${output.username ? `<div><dt>认证用户名</dt><dd><code>${escapeHtml(output.username)}</code><button type="button" data-copy-output="username" title="复制用户名"><i data-lucide="copy"></i></button></dd></div>
        <div><dt>认证密码</dt><dd><code>${escapeHtml(output.password)}</code><button type="button" data-copy-output="password" title="复制密码"><i data-lucide="copy"></i></button></dd></div>` : `<div><dt>认证方式</dt><dd><strong>套餐 IP 白名单</strong></dd></div>
        <div><dt>生效白名单<small>当前套餐全部端口</small></dt><dd><code>${escapeHtml(whitelistTextareaValue(output.whitelist))}</code><button type="button" data-copy-output="whitelist" title="复制白名单"><i data-lucide="copy"></i></button></dd></div>`}
        <div><dt>首个端口示例<small>${escapeHtml(output.outputFormat)}</small></dt><dd><code>${escapeHtml(output.firstCredential)}</code><button type="button" data-copy-output="firstCredential" title="复制首个端口"><i data-lucide="copy"></i></button></dd></div>
        <div><dt>协议与轮转</dt><dd><strong>${escapeHtml(output.protocolLabel)} · ${escapeHtml(output.sessionSummary)}</strong></dd></div>
      </dl>
      ${unlimitedConnectionGuide(output)}
      <div class="unlimited-port-copy">
        <div><span>完整代理列表</span><strong>${output.portCount} 个端口 · ${escapeHtml(output.portRange)}</strong><p>每行一个代理，格式为 ${escapeHtml(output.outputFormat)}。</p></div>
        <button class="button button-secondary" type="button" data-copy-output="credential"><i data-lucide="copy"></i>复制全部端口</button>
      </div>
      ${outputTabsMarkup(CONNECTION_CODE_TABS, "connection")}
      ${outputCodeMarkup(output, "connection")}
      <div class="output-parameter-note">
        <strong>API 输出参数</strong>
        <span><code>count=${output.portCount}</code> 输出套餐全部端口</span>
        <span><code>pool=zz-unlimit</code> 不限量住宅端口池</span>
        <span><code>mode=${output.endpointMode === "IP" ? "2" : "1"}</code> ${escapeHtml(output.endpointMode)} 接入</span>
        <span><code>region=${escapeHtml(output.region)}</code> ${escapeHtml(output.regionName)}</span>
      </div>
      <p class="output-security"><i data-lucide="shield-check"></i>代理密码仅在当前页面显示，请勿提交到公开代码仓库。</p>
    </div>`;
  bindOutputActions();
  refreshIcons();
}

function unlimitedConnectionGuide(output) {
  return `
    <section class="connection-logic">
      <header>
        <div><span>PORT-BASED RESIDENTIAL</span><h3>按套餐端口直接接入</h3></div>
        <p>网关接口只返回接入主机；实际代理端口来自套餐的起始端口和端口数量。</p>
      </header>
      <div class="connection-logic-grid">
        <article>
          <span>01 · 端口范围</span>
          <strong>${escapeHtml(output.portRange)}</strong>
          <p>从 ${output.portStart} 开始连续输出 ${output.portCount} 个端口；每个端口均不限流量与并发。</p>
        </article>
        <article>
          <span>02 · 出口轮转</span>
          <strong>${output.rotationMinutes} 分钟固定轮转</strong>
          <p>同一端口在周期内保持住宅出口，周期结束后自动更换；无需在认证用户名中设置 SESSION。</p>
        </article>
        <article>
          <span>03 · 套餐定位</span>
          <strong>${escapeHtml(output.regionName)}</strong>
          <p>地区和轮转周期对当前套餐全部端口生效，修改后通常需要 3-15 分钟同步。</p>
        </article>
      </div>
    </section>`;
}

function residentialConnectionGuide(output) {
  if (output.productKey !== "residential") return "";
  const locationValue = output.geoSuffix
    ? `${output.regionName} · ${output.geoSuffix}`
    : "全球随机 · 无国家后缀";
  const sessionValue = output.usesSession
    ? `${output.sessionId} · ${output.sessionMinutes} 分钟`
    : "每次请求轮换出口";
  const routingUsername = output.usesWhitelist
    ? (output.routingUsername ? `系统内部路由: ${output.routingUsername}` : "系统内部路由")
    : output.username;
  return `
    <section class="connection-logic">
      <header>
        <div><span>RESIDENTIAL ROUTING</span><h3>这组接入信息如何工作</h3></div>
        <p>国家定位和 SESSION 都编码在路由用户名中；代理主机、端口和密码保持不变。</p>
      </header>
      <div class="connection-logic-grid">
        <article>
          <span>01 · 国家定位</span>
          <strong>${escapeHtml(locationValue)}</strong>
          <p>${output.geoSuffix ? `国家码必须放在认证用户名最后；后端接收的 region 同样是 ${escapeHtml(output.region)}。` : "不添加国家后缀时，请求会从全球住宅池随机选择出口。"}</p>
        </article>
        <article>
          <span>02 · 出口轮换</span>
          <strong>${escapeHtml(sessionValue)}</strong>
          <p>${output.usesSession ? "相同 SESSION ID 和分钟数会尽量复用同一出口；改变 ID 会开启新的粘性会话。" : "不使用 SESSION 时，每个新请求都会进入轮转逻辑并获取新的住宅出口。"}</p>
        </article>
        <article>
          <span>03 · 配置生效</span>
          <strong>约 3-15 分钟</strong>
          <p>首次生成或修改国家、SESSION 后，请预留配置同步时间，再用目标站点验证出口。</p>
        </article>
      </div>
      <div class="username-anatomy">
        <div><span>路由用户名结构</span><code>${escapeHtml(routingUsername || "白名单认证")}</code></div>
        ${output.usesWhitelist ? `<p>白名单认证无需在程序中发送用户名；系统仍按上面的国家与 SESSION 设置保存套餐路由。</p>` : `
          <div class="username-parts">
            <span><code>${escapeHtml(output.baseUsername)}</code><small>代理用户</small></span>
            ${output.sessionSuffix ? `<span><code>${escapeHtml(output.sessionSuffix)}</code><small>SESSION ID 与分钟</small></span>` : ""}
            ${output.geoSuffix ? `<span><code>${escapeHtml(output.geoSuffix)}</code><small>国家码，必须在最后</small></span>` : ""}
          </div>
          <p>拼接顺序固定：代理用户 → SESSION（可选）→ 国家码（可选且始终在最后）。</p>`}
      </div>
    </section>`;
}

function bindOutputActions(rootSelector = "#extractOutput", output = state.output) {
  const root = document.querySelector(rootSelector);
  const tabs = [...(root?.querySelectorAll("[data-output-tab]") || [])];
  const selectTab = (button) => {
    tabs.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.tabIndex = active ? 0 : -1;
    });
    const code = root?.querySelector("#outputCodeValue");
    if (code) {
      code.textContent = output?.[button.dataset.outputTab] || "";
      code.dataset.codeLanguage = button.dataset.outputTab;
      code.closest("pre").scrollTo({ top: 0, left: 0 });
    }
  };
  tabs.forEach((button, index) => {
    button.addEventListener("click", () => selectTab(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + offset + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });
  root?.querySelectorAll("[data-copy-output]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.copyOutput;
      const activeKey = root.querySelector("[data-output-tab].is-active")?.dataset.outputTab || "curl";
      const value = key === "active" ? output?.[activeKey] : output?.[key];
      try {
        await copyText(value || "");
        showToast("已复制");
      } catch {
        showToast("浏览器未允许复制");
      }
    });
  });
}

function staticCountries() {
  return state.productKey === "staticDatacenter" ? STATIC_DATACENTER_CODES : STATIC_RESIDENTIAL_CODES;
}

function staticLinkPlaceholder(meta) {
  return `<div class="extraction-output-empty">
    <span><i data-lucide="link-2" aria-hidden="true"></i></span>
    <strong>等待生成${escapeHtml(meta.name)}提取 API 链接</strong>
    <p>链接用于分配固定 IP。调用成功后，返回值才是可以配置到程序中的代理信息。</p>
  </div>`;
}

function assignedProtocol(item) {
  const itemProtocol = String(item?.protocol || item?.proxyType || "").toLowerCase();
  if (itemProtocol.includes("socks")) return "socks";
  if (itemProtocol.includes("http") || itemProtocol === "proxy") return "proxy";
  return document.querySelector("#extractProtocol")?.value === "socks" ? "socks" : "proxy";
}

function buildAssignedStaticOutput(item, protocol = "proxy") {
  const host = String(item?.proxyIp || item?.ip || "");
  const port = Math.floor(number(item?.port));
  const username = String(item?.username || "");
  const password = String(item?.password || "");
  const normalizedProtocol = protocol === "socks" ? "socks" : "proxy";
  const protocolLabel = normalizedProtocol === "socks" ? "SOCKS5" : "HTTP(S)";
  const endpoint = `${host}:${port}`;
  const auth = `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
  const proxyUrl = `${normalizedProtocol === "socks" ? "socks5h" : "http"}://${auth}${endpoint}`;
  const credential = formatProxyCredential({ host, port, username, password }, "1");
  const snippets = buildProxySnippets({
    host,
    port,
    endpoint,
    username,
    password,
    proxyUrl,
    protocol: normalizedProtocol === "socks" ? "socks" : "http"
  });
  const connection = [
    `代理主机: ${host}`,
    `代理端口: ${port}`,
    `代理协议: ${protocolLabel}`,
    "认证方式: 代理账密",
    `认证用户名: ${username}`,
    `认证密码: ${password}`,
    `代理格式: HOST:PORT:USER:PASSWORD`,
    "",
    credential
  ].join("\n");
  return {
    productKey: "static",
    host,
    port,
    endpoint,
    username,
    password,
    credential,
    protocol: normalizedProtocol,
    protocolLabel,
    proxyUrl,
    connection,
    ...snippets
  };
}

async function renderStatic(meta) {
  const order = selectedOrder();
  state.assigned = [];
  document.querySelector("#extractWorkspace").innerHTML = `
    <div class="static-extraction-layout">
      <form class="panel extraction-form" id="staticExtractForm">
        <header class="panel-head"><div><h2>提取固定 IP</h2><p>地区在提取时按实时库存决定</p></div><span class="live-badge"><i></i>INVENTORY LIVE</span></header>
        <div class="extraction-form-body">
          <label class="extract-field"><span>使用套餐</span><select id="extractPackage">${orderOptions()}</select><small id="extractPackageStatus"></small></label>
          <div class="extract-two-columns">
            <label class="extract-field"><span>国家或地区</span><select id="extractRegion">${countryOptions(staticCountries(), null, false)}</select><small>${state.productKey === "staticDatacenter" ? "不支持中国地区 IP。" : "按住宅 ISP 实时库存分配。"}</small></label>
            <label class="extract-field"><span>提取数量</span><input id="extractCount" type="number" min="1" max="${Math.max(1, number(order?.amount ?? order?.total))}" value="1" step="1"><small>不能超过套餐剩余可提数量</small></label>
          </div>
          <label class="extract-field"><span>代理协议</span><select id="extractProtocol"><option value="proxy">HTTP(S)</option><option value="socks">SOCKS5</option></select></label>
          <div class="extract-validation" id="extractValidation" hidden></div>
        </div>
        <footer><button class="button button-primary" type="submit"><i data-lucide="link-2" aria-hidden="true"></i>生成提取 API 链接</button></footer>
      </form>
      <section class="panel extraction-output-panel">
        <header class="panel-head"><div><h2>提取 API 链接</h2><p>调用链接后才会从套餐中分配固定 IP</p></div></header>
        <div id="extractOutput">${staticLinkPlaceholder(meta)}</div>
      </section>
    </div>
    <section class="panel assigned-proxy-panel">
      <header class="panel-head"><div><h2>已分配固定 IP</h2><p>这里的代理地址和账密才可直接用于爬虫程序</p></div><button class="panel-text-action" id="assignedReload" type="button">刷新<i data-lucide="refresh-cw"></i></button></header>
      <div id="assignedProxyRows"><div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在加载已分配固定 IP</strong></div></div>
      <div class="assigned-code-panel" id="assignedCodePanel" hidden></div>
    </section>`;
  bindStaticForm();
  updatePackageStatus();
  refreshIcons();
  void refreshAssignedPanel();
}

async function loadAssigned(order) {
  if (!order) {
    state.assigned = [];
    return;
  }
  const payload = await request(`/ip/iplist/${encodeURIComponent(packageId(order))}`);
  state.assigned = Array.isArray(payload) ? payload : [];
}

function assignedMarkup() {
  if (!state.assigned.length) {
    return '<div class="management-state"><i data-lucide="server-off"></i><strong>当前套餐尚未分配固定 IP</strong></div>';
  }
  return `<div class="assigned-table" role="table">
    <div class="assigned-row is-head" role="row"><span>代理地址</span><span>代理用户</span><span>代理密码</span><span>操作</span></div>
    ${state.assigned.map((item, index) => `<div class="assigned-row" role="row" data-assigned-order="${escapeHtml(item.orderId)}">
      <strong>${escapeHtml(item.proxyIp)}:${escapeHtml(item.port)}</strong>
      <code>${escapeHtml(item.username || "--")}</code>
      <code>${escapeHtml(item.password || "--")}</code>
      <div class="assigned-actions">
        <button class="button-mini is-primary" type="button" data-static-code="${index}">代码示例</button>
      </div>
    </div>`).join("")}
  </div>`;
}

async function refreshAssignedPanel(showSuccess = false) {
  const rows = document.querySelector("#assignedProxyRows");
  const reload = document.querySelector("#assignedReload");
  if (!rows) return;
  reload?.setAttribute("disabled", "");
  const codePanel = document.querySelector("#assignedCodePanel");
  if (codePanel) {
    codePanel.hidden = true;
    codePanel.innerHTML = "";
  }
  rows.innerHTML = '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在加载已分配固定 IP</strong></div>';
  try {
    await loadAssigned(selectedOrder());
    rows.innerHTML = assignedMarkup();
    bindAssignedActions();
    if (showSuccess) showToast("已分配 IP 已刷新");
  } catch (error) {
    state.assigned = [];
    rows.innerHTML = `<div class="management-state is-error"><i data-lucide="circle-alert"></i><strong>已分配 IP 加载失败</strong><span>${escapeHtml(error.message || "请稍后重试")}</span></div>`;
  } finally {
    reload?.removeAttribute("disabled");
    refreshIcons();
  }
}

function bindStaticForm() {
  document.querySelector("#extractPackage")?.addEventListener("change", () => {
    state.requestedOrder = document.querySelector("#extractPackage").value;
    updatePackageStatus();
    void refreshAssignedPanel();
  });
  document.querySelector("#staticExtractForm")?.addEventListener("submit", generateStaticLink);
  document.querySelector("#assignedReload")?.addEventListener("click", () => {
    void refreshAssignedPanel(true);
  });
  bindAssignedActions();
}

function generateStaticLink(event) {
  event.preventDefault();
  const order = selectedOrder();
  const count = Math.floor(number(document.querySelector("#extractCount").value));
  const available = Math.max(0, number(order?.amount ?? order?.total));
  const validation = document.querySelector("#extractValidation");
  if (!order || count < 1 || count > available || count > 1000) {
    validation.hidden = false;
    validation.textContent = `提取数量必须在 1-${Math.min(1000, available)} 之间。`;
    return;
  }
  validation.hidden = true;
  const params = new URLSearchParams({
    protocol: document.querySelector("#extractProtocol").value,
    region: document.querySelector("#extractRegion").value,
    usepwd: "true",
    count: String(count),
    format: "text",
    userip: ""
  });
  const apiUrl = `${apiBase()}/ip/retreveip/${encodeURIComponent(packageId(order))}?${params.toString()}`;
  state.output = buildStaticExtractionSnippets(
    apiUrl,
    document.querySelector("#extractProtocol").value
  );
  document.querySelector("#extractOutput").innerHTML = `
    <div class="static-link-result">
      <span><i data-lucide="link-2"></i></span><strong>提取 API 链接已生成</strong>
      <p>生成链接本身不会分配资源。执行下方链接或代码时，才会从套餐中分配 ${count} 个固定 IP。</p>
      <div class="static-extraction-flow">
        <div><span>01</span><strong>调用提取 API</strong><p>请求可能等待约 5 分钟，请勿把 API URL 配置为代理地址。</p></div>
        <div><span>02</span><strong>解析返回代理</strong><p>响应每行是 <code>HOST:PORT:USER:PASSWORD</code>。</p></div>
        <div><span>03</span><strong>使用固定 IP</strong><p>分配完成后，在下方列表打开对应代理的代码示例。</p></div>
      </div>
      <div class="static-allocation-warning"><i data-lucide="triangle-alert"></i><span><strong>调用会消耗套餐可提数量</strong><small>同一链接不要作为普通代理请求重复调用；需要代理代码请使用下方已分配 IP。</small></span></div>
      ${outputTabsMarkup(API_CODE_TABS, "apiUrl")}
      ${outputCodeMarkup(state.output, "apiUrl", "复制")}
    </div>`;
  bindOutputActions();
  refreshIcons();
}

function bindAssignedActions() {
  document.querySelectorAll("[data-static-code]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.assigned[number(button.dataset.staticCode)];
      if (!item) return;
      if (!item.username || !item.password) {
        setNotice("error", "静态代理仅支持账密认证。当前记录缺少代理用户名或密码，请刷新后联系技术支持。");
        return;
      }
      const output = buildAssignedStaticOutput(item, assignedProtocol(item));
      const panel = document.querySelector("#assignedCodePanel");
      if (!panel) return;
      panel.hidden = false;
      panel.innerHTML = `
        <div class="connection-result assigned-connection-result">
          <div class="connection-status"><span></span><strong>固定代理接入信息</strong><small>READY</small></div>
          <dl class="connection-details">
            <div><dt>代理地址</dt><dd><code>${escapeHtml(output.endpoint)}</code><button type="button" data-copy-output="endpoint" title="复制代理地址"><i data-lucide="copy"></i></button></dd></div>
            <div><dt>认证用户名</dt><dd><code>${escapeHtml(output.username)}</code><button type="button" data-copy-output="username" title="复制用户名"><i data-lucide="copy"></i></button></dd></div>
            <div><dt>认证密码</dt><dd><code>${escapeHtml(output.password)}</code><button type="button" data-copy-output="password" title="复制密码"><i data-lucide="copy"></i></button></dd></div>
            <div><dt>完整代理格式<small>HOST:PORT:USER:PASSWORD</small></dt><dd><code>${escapeHtml(output.credential)}</code><button type="button" data-copy-output="credential" title="复制完整代理格式"><i data-lucide="copy"></i></button></dd></div>
            <div><dt>代理协议</dt><dd><strong>${escapeHtml(output.protocolLabel)}</strong></dd></div>
          </dl>
          <div class="assigned-code-note"><i data-lucide="circle-check"></i><span>以下代码使用已分配的真实代理地址访问测试目标，不会再次调用提取 API。</span></div>
          ${outputTabsMarkup(ASSIGNED_PROXY_TABS, "connection")}
          ${outputCodeMarkup(output, "connection")}
        </div>`;
      bindOutputActions("#assignedCodePanel", output);
      refreshIcons();
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function normalizeTrafficData(payload, productKey) {
  const orders = Array.isArray(payload?.orders) ? payload.orders : [];
  const users = Array.isArray(payload?.users) ? payload.users : [];
  return {
    orders: orders.filter((order) => matchesProduct(order, productKey)),
    users
  };
}

async function loadExtractionData() {
  const meta = PRODUCT_META[state.productKey];
  if (meta.static) {
    const [payload, usersPayload] = await Promise.all([
      request("/ip/ava_fixed/"),
      request("/ip/pairs")
    ]);
    const normalized = normalizeTrafficData(payload, state.productKey);
    state.orders = normalized.orders;
    state.users = Array.isArray(usersPayload) ? usersPayload : [];
    return;
  }
  const [payload, usersPayload] = await Promise.all([
    request("/ip/ava_traffic/"),
    request("/ip/pairs")
  ]);
  const normalized = normalizeTrafficData(payload, state.productKey);
  state.orders = normalized.orders;
  state.users = Array.isArray(usersPayload) ? usersPayload : normalized.users;
}

async function openExtract(productKey = "", orderId = "") {
  const params = parseHashParameters();
  state.productKey = PRODUCT_META[productKey] ? productKey : (PRODUCT_META[params.get("product")] ? params.get("product") : "tunnel");
  state.requestedOrder = orderId || params.get("order") || "";
  state.output = null;
  const meta = PRODUCT_META[state.productKey];
  document.querySelector("#extractPageTitle").textContent = isConsoleExtractableProduct(state.productKey)
    ? `提取与使用${meta.name}`
    : `${meta.name}专属交付`;
  document.querySelector("#extractPageDescription").textContent = meta.description;
  document.querySelector("#extractBackToProduct").dataset.product = state.productKey;
  setNotice("", "");
  if (!isConsoleExtractableProduct(state.productKey)) {
    renderManagedDelivery(meta);
    return;
  }
  document.querySelector("#extractWorkspace").innerHTML =
    '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在加载套餐与认证信息</strong></div>';
  try {
    await loadExtractionData();
    if (state.requestedOrder && !state.orders.some((order) => packageId(order) === state.requestedOrder)) {
      state.requestedOrder = "";
    }
    if (!state.requestedOrder) state.requestedOrder = packageId(state.orders[0]);
    if (!state.orders.length) {
      renderEmpty(meta);
      return;
    }
    if (meta.static) await renderStatic(meta);
    else renderDynamic(meta);
  } catch (error) {
    if (error.code === "NO_TOKEN" || [401, 403].includes(error.status)) {
      if (!isLocalPreview()) {
        window.location.replace(loginUrl());
        return;
      }
    }
    document.querySelector("#extractWorkspace").innerHTML =
      `<div class="management-state is-error"><i data-lucide="circle-alert"></i><strong>${escapeHtml(error.message || "套餐数据加载失败")}</strong></div>`;
    setNotice("error", error.message || "套餐数据加载失败", {
      label: "重试",
      handler: () => openExtract(state.productKey, state.requestedOrder)
    });
    refreshIcons();
  }
}

function bindGlobalActions() {
  document.querySelector("#extractBackToProduct")?.addEventListener("click", (event) => {
    window.location.hash = `#product-${event.currentTarget.dataset.product || "tunnel"}`;
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  bindGlobalActions();
  window.ConsoleExtractor = {
    open: openExtract,
    reload: () => openExtract(state.productKey, state.requestedOrder)
  };
  window.dispatchEvent(new CustomEvent("console-extractor-ready"));
}

export {
  API_CODE_TABS,
  ASSIGNED_PROXY_TABS,
  CONNECTION_CODE_TABS,
  PRODUCT_META,
  PROXY_OUTPUT_FORMATS,
  STATIC_DATACENTER_CODES,
  STATIC_RESIDENTIAL_CODES,
  buildApiSnippets,
  buildAssignedStaticOutput,
  buildConnectionOutput,
  buildDynamicRouting,
  buildStaticExtractionSnippets,
  buildUnlimitedConnectionOutput,
  buildProxySnippets,
  formatProxyCredential,
  isConsoleExtractableProduct,
  matchesProduct,
  normalizeTrafficData,
  retrieveApiUrl,
  normalizeWhitelist,
  orderWhitelist,
  residentialConnectionGuide,
  validWhitelist,
  unlimitedConnectionGuide,
  unlimitedPortRange,
  whitelistRequestParameters,
  whitelistTextareaValue,
  whitelistUpdatePath
};
