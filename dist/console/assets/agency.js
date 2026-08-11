/* 123Proxy agency partner console */
const TOKEN_KEY = "token_key";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DEFAULT_FETCH_SIZE = 1000;
const PAGE_SIZE = 12;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseAmount(value) {
  const amount = Number(String(value ?? 0).replaceAll(",", ""));
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value) {
  return parseAmount(value).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDateTime(value) {
  if (!value) return "--";
  const numeric = Number(value);
  const date = Number.isFinite(numeric)
    ? new Date(numeric < 1e12 ? numeric * 1000 : numeric)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function firstDefined(source, keys, fallback = "") {
  for (const key of keys) {
    if (source?.[key] !== undefined && source[key] !== null) return source[key];
  }
  return fallback;
}

function unwrapPayload(payload) {
  let current = payload;
  for (let depth = 0; depth < 5; depth += 1) {
    if (!current || Array.isArray(current) || typeof current !== "object") break;
    if (current.content && Array.isArray(current.content)) break;
    if (current.data !== undefined) {
      current = current.data;
      continue;
    }
    if (current.res !== undefined) {
      current = current.res;
      continue;
    }
    break;
  }
  return current;
}

export function agencyCustomerPath({
  page = 0,
  size = DEFAULT_FETCH_SIZE,
  mode = "username",
  query = ""
} = {}) {
  const params = new URLSearchParams({
    page: String(Math.max(0, Number(page) || 0)),
    size: String(Math.max(1, Number(size) || DEFAULT_FETCH_SIZE)),
    username: mode === "username" ? String(query).trim() : "",
    phoneNumber: mode === "phone" ? String(query).trim() : ""
  });
  return `/accsrv/0xagency/agencyuser?${params.toString()}`;
}

export function normalizeCustomerPayload(payload) {
  const unwrapped = unwrapPayload(payload);
  const content = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(unwrapped?.content)
      ? unwrapped.content
      : [];
  const rows = content.map((item, index) => ({
    id: String(firstDefined(item, ["id", "userId", "username", "name"], index)),
    username: String(firstDefined(item, ["username", "name", "userName"], "--")),
    recharge: parseAmount(firstDefined(item, ["recharge", "rechargeAmount", "totalRecharge"], 0)),
    consume: parseAmount(firstDefined(item, ["consume", "consumeAmount", "totalConsume"], 0)),
    createAt: formatDateTime(firstDefined(item, ["createAt", "createdAt", "createTime", "registeredAt"], "")),
    phoneNumber: String(firstDefined(item, ["phoneNumber", "phone", "mobile"], "--"))
  }));
  return {
    rows,
    totalElements: Number(unwrapped?.totalElements ?? rows.length) || rows.length,
    totalPages: Number(unwrapped?.totalPages ?? (rows.length ? 1 : 0)) || 0
  };
}

export function normalizeBillDetailPayload(payload) {
  const unwrapped = unwrapPayload(payload);
  const content = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(unwrapped?.content)
      ? unwrapped.content
      : [];
  return content.map((item) => {
    const usingCode = String(firstDefined(item, ["usingStatus", "useStatus"], "")).toUpperCase();
    const payCode = String(firstDefined(item, ["payStatus", "paymentStatus"], "")).toUpperCase();
    return {
      period: `${firstDefined(item, ["year"], "--")} 年 ${String(firstDefined(item, ["month"], "--")).padStart(2, "0")} 月`,
      usingStatus: usingCode === "USING" ? "正在使用" : "已停止使用",
      usingActive: usingCode === "USING",
      userBillAmount: parseAmount(firstDefined(item, ["userBillAmount", "consume", "amount"], 0)),
      payStatus: payCode === "PAID" ? "已支付" : "未支付",
      payActive: payCode === "PAID",
      agencyEarnings: parseAmount(firstDefined(item, ["agencyEarnings", "earnings", "commission"], 0))
    };
  });
}

export function normalizeIdentityPayload(payload) {
  const item = unwrapPayload(payload) || {};
  return {
    username: String(firstDefined(item, ["name", "username", "userName"], "--")),
    fullName: String(firstDefined(item, ["fullName", "realName"], "--")),
    companyName: String(firstDefined(item, ["companyName", "company"], "--")),
    jobTitle: String(firstDefined(item, ["jobTitle", "position"], "--")),
    email: String(firstDefined(item, ["email"], "--")),
    phoneNumber: String(firstDefined(item, ["phoneNumber", "phone", "mobile"], "--"))
  };
}

function normalizeAgency(payload) {
  const item = unwrapPayload(payload) || {};
  return {
    name: String(firstDefined(item, ["name", "username", "agencyName"], "代理商账户")),
    companyName: String(firstDefined(item, ["companyName", "company"], "")),
    email: String(firstDefined(item, ["email"], ""))
  };
}

function isLocalPreview() {
  return typeof window !== "undefined" && LOCAL_HOSTS.has(window.location.hostname);
}

function apiBase() {
  if (typeof window === "undefined") return "";
  return String(window.__CONSOLE_CONFIG__?.apiBase || window.location.origin).replace(/\/$/, "");
}

function accessToken() {
  if (typeof window === "undefined") return "";
  const raw = window.localStorage.getItem(TOKEN_KEY);
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return parsed?.access_token || parsed?.token || raw;
  } catch {
    return raw;
  }
}

function agencyLoginPath() {
  return isLocalPreview() ? "/console/agency-login.html" : "/agency-login.html";
}

function agencyManagerPath() {
  return isLocalPreview() ? "/console/agency-manager.html" : "/agency-manager.html";
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const next = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
  window.location.href = `${agencyLoginPath()}?next=${next}`;
}

async function request(path, {
  method = "GET",
  body,
  token = accessToken(),
  headers = {},
  allowUnauthorized = false
} = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await window.fetch(`${apiBase()}${path}`, {
      method,
      body,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Accept-Language": "zh-CN,zh;q=0.5",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      }
    });
    const raw = await response.text();
    let payload = raw;
    if (raw.trim().startsWith("{") || raw.trim().startsWith("[") || (response.headers.get("content-type") || "").includes("json")) {
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = raw;
      }
    }
    if (!response.ok) {
      if (!allowUnauthorized && [401, 403].includes(response.status)) {
        window.localStorage.removeItem(TOKEN_KEY);
        redirectToLogin();
      }
      const message = payload?.message
        || payload?.error_description
        || payload?.error?.message
        || payload?.error
        || `请求未完成（${response.status}）`;
      const error = new Error(String(message));
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("请求超时，请检查网络后重试。");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function refreshIcons() {
  if (typeof window !== "undefined" && window.lucide) window.lucide.createIcons();
}

function setAuthMessage(form, type, message) {
  const box = form.querySelector(".auth-form-message");
  if (!box) return;
  box.className = `auth-form-message is-visible is-${type}`;
  box.innerHTML = `<i data-lucide="${type === "success" ? "circle-check" : "circle-alert"}" aria-hidden="true"></i><span>${escapeHtml(message)}</span>`;
  refreshIcons();
}

function clearAuthMessage(form) {
  const box = form.querySelector(".auth-form-message");
  if (!box) return;
  box.className = "auth-form-message";
  box.textContent = "";
}

function setAuthBusy(form, busy) {
  const submit = form.querySelector(".auth-submit");
  if (!submit) return;
  submit.disabled = busy;
  submit.classList.toggle("is-loading", busy);
  const text = submit.querySelector(".auth-submit-text");
  if (text) text.textContent = busy ? "正在验证" : "登录代理商工作台";
}

function initAgencyLogin() {
  const form = document.getElementById("agencyLoginForm");
  if (!form) return;
  const account = document.getElementById("agencyLoginAccount");
  const password = document.getElementById("agencyLoginPassword");
  const toggle = document.querySelector("[data-agency-password-toggle]");

  toggle?.addEventListener("click", () => {
    const reveal = password.type === "password";
    password.type = reveal ? "text" : "password";
    toggle.setAttribute("aria-label", reveal ? "隐藏密码" : "显示密码");
    toggle.innerHTML = `<i data-lucide="${reveal ? "eye-off" : "eye"}" aria-hidden="true"></i>`;
    refreshIcons();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessage(form);
    const username = account.value.trim();
    if (!username) {
      setAuthMessage(form, "error", "请输入代理商用户名或邮箱。");
      account.focus();
      return;
    }
    if (!password.value) {
      setAuthMessage(form, "error", "请输入登录密码。");
      password.focus();
      return;
    }
    setAuthBusy(form, true);
    try {
      const body = new URLSearchParams({
        scope: "ui",
        username,
        password: password.value,
        grant_type: "password"
      });
      const token = await request("/ssosrv/oauth/token", {
        method: "POST",
        body,
        token: "",
        allowUnauthorized: true,
        headers: {
          Authorization: "Basic YnJvd3Nlcjo=",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      window.localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      request("/accsrv/0xagency/upgrade", {
        token: token?.access_token || token?.token || ""
      }).catch(() => {});
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      window.location.href = requestedNext?.startsWith("/") ? requestedNext : agencyManagerPath();
    } catch (error) {
      setAuthMessage(form, "error", error.message || "登录失败，请核对账户与密码。");
    } finally {
      setAuthBusy(form, false);
    }
  });
}

const managerState = {
  agency: null,
  rows: [],
  totalElements: 0,
  page: 0,
  pageSize: PAGE_SIZE,
  mode: "username",
  query: "",
  loading: false
};

function setNotice(message = "") {
  const notice = document.getElementById("agencyNotice");
  if (!notice) return;
  notice.hidden = !message;
  notice.textContent = message;
}

function toast(message) {
  const element = document.getElementById("agencyToast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("is-visible");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => element.classList.remove("is-visible"), 2200);
}

function renderAgencyIdentity() {
  const agency = managerState.agency || { name: "代理商账户", companyName: "" };
  const display = agency.companyName || agency.name;
  ["agencySidebarName", "agencyDisplayName", "agencyMenuName", "agencyMetricName"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = display;
  });
  const account = document.getElementById("agencySidebarAccount");
  if (account) account.textContent = agency.companyName ? agency.name : (agency.email || "代理商账户");
  const avatar = document.getElementById("agencyAvatar");
  if (avatar) avatar.textContent = display.slice(0, 1).toUpperCase() || "A";
}

function renderMetrics() {
  const recharge = managerState.rows.reduce((sum, item) => sum + item.recharge, 0);
  const consume = managerState.rows.reduce((sum, item) => sum + item.consume, 0);
  document.getElementById("agencyCustomerCount").textContent = managerState.totalElements.toLocaleString("zh-CN");
  document.getElementById("agencyRechargeTotal").textContent = formatMoney(recharge);
  document.getElementById("agencyConsumeTotal").textContent = formatMoney(consume);
}

function customerPageRows() {
  const start = managerState.page * managerState.pageSize;
  return managerState.rows.slice(start, start + managerState.pageSize);
}

function renderCustomerRows() {
  const container = document.getElementById("agencyCustomerRows");
  const rows = customerPageRows();
  if (managerState.loading) {
    container.innerHTML = '<div class="agency-empty">正在读取客户数据...</div>';
  } else if (!rows.length) {
    container.innerHTML = '<div class="agency-empty">没有找到符合条件的代理客户。</div>';
  } else {
    container.innerHTML = rows.map((item) => `
      <div class="agency-customer-row" role="row">
        <div><strong>${escapeHtml(item.username)}</strong><small>代理客户</small></div>
        <span>¥${formatMoney(item.recharge)}</span>
        <span>¥${formatMoney(item.consume)}</span>
        <span>${escapeHtml(item.createAt)}</span>
        <span>${escapeHtml(item.phoneNumber)}</span>
        <div class="agency-row-actions">
          <button type="button" data-agency-action="bill" data-username="${escapeHtml(item.username)}"><i data-lucide="receipt-text" aria-hidden="true"></i>明细</button>
          <button type="button" data-agency-action="identity" data-username="${escapeHtml(item.username)}"><i data-lucide="contact-round" aria-hidden="true"></i>用户信息</button>
        </div>
      </div>
    `).join("");
  }
  const pageCount = Math.max(1, Math.ceil(managerState.rows.length / managerState.pageSize));
  const visibleStart = managerState.rows.length ? managerState.page * managerState.pageSize + 1 : 0;
  const visibleEnd = Math.min((managerState.page + 1) * managerState.pageSize, managerState.rows.length);
  document.getElementById("agencyTableSummary").textContent = managerState.rows.length
    ? `显示 ${visibleStart}-${visibleEnd}，共 ${managerState.totalElements} 个客户`
    : "当前查询没有客户";
  document.getElementById("agencyPageLabel").textContent = `第 ${managerState.page + 1} / ${pageCount} 页`;
  document.getElementById("agencyPrevPage").disabled = managerState.page <= 0 || managerState.loading;
  document.getElementById("agencyNextPage").disabled = managerState.page >= pageCount - 1 || managerState.loading;
  refreshIcons();
}

async function loadAgency() {
  try {
    managerState.agency = normalizeAgency(await request("/accsrv/0xagency/current"));
    renderAgencyIdentity();
  } catch (error) {
    if (![401, 403].includes(error.status)) {
      managerState.agency = { name: "代理商账户", companyName: "", email: "" };
      renderAgencyIdentity();
    }
  }
}

async function loadCustomers() {
  if (managerState.loading) return;
  managerState.loading = true;
  setNotice("");
  renderCustomerRows();
  try {
    const payload = await request(agencyCustomerPath({
      page: 0,
      size: DEFAULT_FETCH_SIZE,
      mode: managerState.mode,
      query: managerState.query
    }));
    const normalized = normalizeCustomerPayload(payload);
    managerState.rows = normalized.rows;
    managerState.totalElements = normalized.totalElements;
    const pageCount = Math.max(1, Math.ceil(managerState.rows.length / managerState.pageSize));
    managerState.page = Math.min(managerState.page, pageCount - 1);
  } catch (error) {
    managerState.rows = [];
    managerState.totalElements = 0;
    setNotice(
      isLocalPreview() && !accessToken()
        ? "本地预览未连接代理商 API；部署并登录后将读取真实客户数据。"
        : (error.message || "客户数据读取失败，请稍后重试。")
    );
  } finally {
    managerState.loading = false;
    renderMetrics();
    renderCustomerRows();
  }
}

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  refreshIcons();
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

async function showIdentity(username) {
  const dialog = document.getElementById("agencyIdentityDialog");
  const intro = document.getElementById("agencyIdentityIntro");
  const list = document.getElementById("agencyIdentityList");
  intro.textContent = `${username} 的注册与联系资料`;
  list.innerHTML = '<div><dt>状态</dt><dd>正在读取...</dd></div>';
  openDialog(dialog);
  try {
    const identity = normalizeIdentityPayload(
      await request(`/accsrv/0xagency/useridentitydetail/${encodeURIComponent(username)}`)
    );
    const fields = [
      ["用户名", identity.username],
      ["姓名", identity.fullName],
      ["公司", identity.companyName],
      ["职位", identity.jobTitle],
      ["邮箱", identity.email],
      ["电话", identity.phoneNumber]
    ];
    list.innerHTML = fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  } catch (error) {
    list.innerHTML = `<div><dt>读取失败</dt><dd>${escapeHtml(error.message)}</dd></div>`;
  }
}

async function showBill(username) {
  const dialog = document.getElementById("agencyBillDialog");
  const intro = document.getElementById("agencyBillIntro");
  const container = document.getElementById("agencyBillRows");
  intro.textContent = `${username} 的月度消费、支付状态与代理收益`;
  container.innerHTML = '<div class="agency-empty">正在读取月度明细...</div>';
  openDialog(dialog);
  try {
    const rows = normalizeBillDetailPayload(
      await request(`/accsrv/0xagency/userbilldetail/${encodeURIComponent(username)}`)
    );
    container.innerHTML = rows.length
      ? rows.map((item) => `
        <div class="agency-detail-row">
          <span>${escapeHtml(item.period)}</span>
          <span><i class="agency-status${item.usingActive ? "" : " is-muted"}">${escapeHtml(item.usingStatus)}</i></span>
          <span>¥${formatMoney(item.userBillAmount)}</span>
          <span><i class="agency-status${item.payActive ? "" : " is-muted"}">${escapeHtml(item.payStatus)}</i></span>
          <span>¥${formatMoney(item.agencyEarnings)}</span>
        </div>
      `).join("")
      : '<div class="agency-empty">该客户暂无月度账单明细。</div>';
  } catch (error) {
    container.innerHTML = `<div class="agency-empty">${escapeHtml(error.message)}</div>`;
  }
}

function legacyDetailUsername() {
  const match = window.location.pathname.match(/agency-manager-detail\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function initManagerEvents() {
  const userButton = document.getElementById("agencyUserButton");
  const userMenu = document.getElementById("agencyUserMenu");
  userButton.addEventListener("click", () => {
    const open = userMenu.hidden;
    userMenu.hidden = !open;
    userButton.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#agencyUserButton") && !event.target.closest("#agencyUserMenu")) {
      userMenu.hidden = true;
      userButton.setAttribute("aria-expanded", "false");
    }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) closeDialog(closeButton.closest("dialog"));
    const action = event.target.closest("[data-agency-action]");
    if (!action) return;
    const username = action.dataset.username;
    if (action.dataset.agencyAction === "bill") showBill(username);
    if (action.dataset.agencyAction === "identity") showIdentity(username);
  });
  document.querySelectorAll(".agency-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });
  document.getElementById("agencyMobileMenu").addEventListener("click", () => {
    document.body.classList.toggle("is-menu-open");
  });
  document.getElementById("agencyLogout").addEventListener("click", async () => {
    const token = accessToken();
    try {
      await request("/ssosrv/agency/token", {
        method: "DELETE",
        token,
        allowUnauthorized: true
      });
    } catch {
      // Local token removal is authoritative even if the legacy logout endpoint is unavailable.
    }
    window.localStorage.removeItem(TOKEN_KEY);
    window.location.href = agencyLoginPath();
  });
  const mode = document.getElementById("agencySearchMode");
  const text = document.getElementById("agencySearchText");
  mode.addEventListener("change", () => {
    text.placeholder = mode.value === "phone" ? "输入注册手机号" : "输入客户账号";
  });
  document.getElementById("agencySearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    managerState.mode = mode.value;
    managerState.query = text.value.trim();
    managerState.page = 0;
    loadCustomers();
  });
  document.getElementById("agencyResetSearch").addEventListener("click", () => {
    mode.value = "username";
    text.value = "";
    text.placeholder = "输入客户账号";
    managerState.mode = "username";
    managerState.query = "";
    managerState.page = 0;
    loadCustomers();
  });
  document.getElementById("agencyReload").addEventListener("click", async () => {
    await Promise.all([loadAgency(), loadCustomers()]);
    toast("代理商数据已刷新");
  });
  document.getElementById("agencyPrevPage").addEventListener("click", () => {
    managerState.page = Math.max(0, managerState.page - 1);
    renderCustomerRows();
  });
  document.getElementById("agencyNextPage").addEventListener("click", () => {
    const pageCount = Math.max(1, Math.ceil(managerState.rows.length / managerState.pageSize));
    managerState.page = Math.min(pageCount - 1, managerState.page + 1);
    renderCustomerRows();
  });
}

async function initAgencyManager() {
  if (!accessToken() && !isLocalPreview()) {
    redirectToLogin();
    return;
  }
  initManagerEvents();
  renderAgencyIdentity();
  renderCustomerRows();
  await Promise.all([loadAgency(), loadCustomers()]);
  const legacyUsername = legacyDetailUsername();
  if (legacyUsername) showBill(legacyUsername);
}

function initAgencyPage() {
  const page = document.body?.dataset.agencyPage;
  if (page === "login") initAgencyLogin();
  if (page === "manager") initAgencyManager();
  refreshIcons();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAgencyPage, { once: true });
  } else {
    initAgencyPage();
  }
}
