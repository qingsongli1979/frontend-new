import {
  clearPendingRecharge,
  extractPaymentTradeNo,
  loadPendingRecharge,
  openPaymentWindow,
  renderQrCode,
  savePendingRecharge,
  submitPaymentHtml
} from "./payment.js?v=20260804-02";

const TOKEN_KEY = "token_key";
const REQUEST_TIMEOUT_MS = 20000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const state = {
  user: null,
  usage: {
    page: 0,
    size: 20,
    rows: [],
    totalElements: 0,
    totalPages: 1,
    totalCost: 0,
    dateFrom: dateInputValue(offsetDate(-6)),
    dateTo: dateInputValue(new Date()),
    username: ""
  },
  billing: {
    tab: "overview",
    month: monthInputValue(new Date()),
    overview: [],
    rechargePage: 0,
    rechargeSize: 10,
    rechargeStatus: "",
    rechargeRows: [],
    rechargeTotalElements: 0,
    rechargeTotalPages: 1,
    selectedPayments: new Set(),
    invoices: []
  },
  settingsTab: "profile",
  apiTokenVisible: false,
  paymentTimer: null,
  paymentDeadline: 0
};

class AccountRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "AccountRequestError";
    this.status = status;
  }
}

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function dateInputValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function monthInputValue(date) {
  return dateInputValue(date).slice(0, 7);
}

function timezoneOffset(date = new Date()) {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  return `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  }).format(number(value));
}

function formatMoney(value) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(number(value));
}

function formatDateTime(value) {
  if (!value) return "--";
  const normalized = typeof value === "string" && !value.includes("T")
    ? value.replace(" ", "T")
    : value;
  const date = new Date(number(value) || normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date).replaceAll("/", "-");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function plainText(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    const error = new AccountRequestError("登录后可查看交易与账户信息", 401);
    error.code = "NO_TOKEN";
    throw error;
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const hasBody = options.body !== undefined;
  try {
    const response = await window.fetch(`${apiBase()}${path}`, {
      method: options.method || "GET",
      body: hasBody
        ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body))
        : undefined,
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
      headers: {
        "Accept": options.accept || "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.5",
        "Authorization": `Bearer ${token}`,
        ...(hasBody ? { "Content-Type": "application/json" } : {})
      }
    });
    if (options.raw) {
      if (!response.ok) throw new AccountRequestError(`请求失败（${response.status}）`, response.status);
      return response;
    }
    const text = await response.text();
    let payload = text;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = text;
    }
    if (!response.ok) {
      throw new AccountRequestError(
        payload?.message || payload?.error_description || `请求失败（${response.status}）`,
        response.status
      );
    }
    return payload;
  } catch (error) {
    if (error?.name === "AbortError") throw new AccountRequestError("请求超时，请稍后重试");
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

function setNotice(view, type = "", message = "", action = null) {
  const notice = document.querySelector(`#${view}Notice`);
  if (!notice) return;
  notice.hidden = !message;
  notice.className = `overview-notice${type ? ` is-${type}` : ""}`;
  notice.innerHTML = message
    ? `<i data-lucide="${type === "error" ? "circle-alert" : "info"}" aria-hidden="true"></i><span>${escapeHtml(message)}</span>${action ? `<button type="button">${escapeHtml(action.label)}</button>` : ""}`
    : "";
  if (action) notice.querySelector("button")?.addEventListener("click", action.handler);
  refreshIcons();
}

function handleAccountError(view, workspace, error, retry) {
  if (error.code === "NO_TOKEN" || [401, 403].includes(error.status)) {
    if (!isLocalPreview()) {
      window.location.replace(loginUrl());
      return;
    }
  }
  const message = error.message || "数据加载失败";
  if (workspace) {
    workspace.innerHTML = `<div class="management-state is-error"><i data-lucide="circle-alert"></i><strong>${escapeHtml(message)}</strong></div>`;
  }
  setNotice(view, "error", message, retry ? { label: "重新加载", handler: retry } : null);
  refreshIcons();
}

function billingDetailsPath({ page, size, dateFrom, dateTo }) {
  const params = new URLSearchParams({
    zone: timezoneOffset(),
    page: String(page),
    size: String(size),
    dateFrom,
    dateTo
  });
  return `/accsrv/fee/userbilling?${params.toString()}`;
}

function billingOverviewPath(month) {
  const [year, monthNumber] = month.split("-");
  const params = new URLSearchParams({
    zone: timezoneOffset(),
    strDate: `${year}-${number(monthNumber)}`,
    services: ""
  });
  return `/accsrv/apiv1/current/userbilling?${params.toString()}`;
}

function normalizeUsagePayload(payload) {
  const data = payload?.data || {};
  const billings = data?.billings || {};
  const content = Array.isArray(billings?.content) ? billings.content : [];
  return {
    rows: content.map((item) => ({
      id: item.id || `${item.timestamp}-${item.target}`,
      timestamp: item.timestampString || item.timestamp,
      service: item.services || "IP",
      type: item.chargeTypeString || (number(item.chargeType) === 99 ? "流量消费" : "代理用量"),
      amount: number(item.amount),
      unit: item.amountUnit || item.unit || "MB",
      rate: number(item.rate),
      total: number(item.total),
      target: plainText(item.target).replace(/^User:\s*/i, "") || item.subUser || "--",
      status: item.status || "PAID"
    })),
    totalElements: number(billings.totalElements),
    totalPages: Math.max(1, number(billings.totalPages) || 1),
    totalCost: number(data.total)
  };
}

function trafficToMb(amount, unit) {
  const normalized = String(unit || "MB").toUpperCase();
  const factors = { B: 1 / 1024 / 1024, KB: 1 / 1024, MB: 1, GB: 1024, TB: 1024 * 1024 };
  return number(amount) * (factors[normalized] || 1);
}

function usageRowsMarkup(rows) {
  if (!rows.length) {
    return '<div class="management-state"><i data-lucide="chart-no-axes-combined"></i><strong>当前时间范围没有流量记录</strong></div>';
  }
  return rows.map((item) => `
    <div class="management-row traffic-detail-row" role="row">
      <span role="cell">${escapeHtml(formatDateTime(item.timestamp))}</span>
      <div role="cell"><strong>${escapeHtml(item.target)}</strong><small>${escapeHtml(item.type)}</small></div>
      <strong role="cell">${escapeHtml(formatNumber(item.amount, 4))} ${escapeHtml(item.unit)}</strong>
      <span role="cell">${item.rate ? `¥${escapeHtml(formatNumber(item.rate, 6))}` : "套餐内"}</span>
      <strong role="cell">${item.total ? `¥${escapeHtml(formatMoney(item.total))}` : "¥0.00"}</strong>
      <span class="status ${item.status === "PAID" ? "is-active" : "is-waiting"}" role="cell"><i></i>${item.status === "PAID" ? "已计入" : escapeHtml(item.status)}</span>
    </div>`).join("");
}

function usageMetricsMarkup(rows, totalCost) {
  const totalMb = rows.reduce((sum, item) => sum + trafficToMb(item.amount, item.unit), 0);
  const users = new Set(rows.map((item) => item.target).filter((item) => item && item !== "--")).size;
  return `
    <section class="account-metrics usage-ledger-metrics" aria-label="当前流量统计">
      <div><small>当前页流量</small><strong>${formatNumber(totalMb / 1024, 6)} <em>GB</em></strong><span>当前页记录合计</span></div>
      <div><small>当前页记录</small><strong>${formatNumber(rows.length, 0)}</strong><span>每页最多 20 条</span></div>
      <div><small>代理用户</small><strong>${formatNumber(users, 0)}</strong><span>当前页去重统计</span></div>
      <div><small>筛选期费用</small><strong><em>¥</em>${formatMoney(totalCost)}</strong><span>所选时间范围合计</span></div>
    </section>`;
}

async function loadUsage() {
  const payload = await request(billingDetailsPath(state.usage), {
    method: "POST",
    body: {
      includeSummary: true,
      chargeTypes: [99],
      ...(state.usage.username ? { username: state.usage.username } : {})
    }
  });
  const normalized = normalizeUsagePayload(payload);
  Object.assign(state.usage, normalized);
}

function renderUsage() {
  const workspace = document.querySelector("#usageWorkspace");
  workspace.innerHTML = `
    <section class="account-filter-bar usage-ledger-filter">
      <div>
        <strong>流量明细</strong>
        <span>查看所选时间范围内的代理用量与计费记录。</span>
      </div>
      <form id="usageFilterForm">
        <label><span>开始日期</span><input id="usageDateFrom" type="date" value="${escapeHtml(state.usage.dateFrom)}"></label>
        <label><span>结束日期</span><input id="usageDateTo" type="date" value="${escapeHtml(state.usage.dateTo)}"></label>
        <label><span>代理用户</span><input id="usageUsername" type="search" value="${escapeHtml(state.usage.username)}" placeholder="全部用户"></label>
        <button class="button button-primary" type="submit"><i data-lucide="search"></i>查询</button>
        <button class="button button-secondary" id="usageExport" type="button"><i data-lucide="download"></i>导出</button>
      </form>
    </section>
    ${usageMetricsMarkup(state.usage.rows, state.usage.totalCost)}
    <section class="panel management-table-panel">
      <div class="management-table traffic-detail-table" role="table" aria-label="流量明细">
        <div class="management-row is-head" role="row">
          <span>计费时间</span><span>代理用户 / 类型</span><span>流量</span><span>单价</span><span>金额</span><span>状态</span>
        </div>
        <div id="usageDetailRows">${usageRowsMarkup(state.usage.rows)}</div>
      </div>
      <footer class="management-table-footer">
        <span>共 ${formatNumber(state.usage.totalElements, 0)} 条记录</span>
        <div class="pagination-controls">
          <button id="usagePrevPage" type="button" aria-label="上一页" ${state.usage.page <= 0 ? "disabled" : ""}><i data-lucide="chevron-left"></i></button>
          <span>第 ${state.usage.page + 1} / ${state.usage.totalPages} 页</span>
          <button id="usageNextPage" type="button" aria-label="下一页" ${state.usage.page + 1 >= state.usage.totalPages ? "disabled" : ""}><i data-lucide="chevron-right"></i></button>
        </div>
      </footer>
    </section>`;
  bindUsageActions();
  refreshIcons();
}

async function openUsage() {
  const workspace = document.querySelector("#usageWorkspace");
  if (!workspace) return;
  setNotice("usage");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner" aria-hidden="true"></span><strong>正在读取流量明细</strong></div>';
  try {
    await loadUsage();
    renderUsage();
  } catch (error) {
    handleAccountError("usage", workspace, error, openUsage);
  }
}

function bindUsageActions() {
  document.querySelector("#usageFilterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dateFrom = document.querySelector("#usageDateFrom").value;
    const dateTo = document.querySelector("#usageDateTo").value;
    if (!dateFrom || !dateTo || dateFrom > dateTo) {
      setNotice("usage", "error", "请选择有效的开始和结束日期。");
      return;
    }
    state.usage.dateFrom = dateFrom;
    state.usage.dateTo = dateTo;
    state.usage.username = document.querySelector("#usageUsername").value.trim();
    state.usage.page = 0;
    await openUsage();
  });
  document.querySelector("#usagePrevPage")?.addEventListener("click", async () => {
    state.usage.page = Math.max(0, state.usage.page - 1);
    await openUsage();
  });
  document.querySelector("#usageNextPage")?.addEventListener("click", async () => {
    state.usage.page += 1;
    await openUsage();
  });
  document.querySelector("#usageExport")?.addEventListener("click", downloadUsage);
}

async function downloadUsage() {
  try {
    const params = new URLSearchParams({
      zone: timezoneOffset(),
      dateFrom: state.usage.dateFrom,
      dateTo: state.usage.dateTo,
      chargeType: "99"
    });
    const response = await request(`/accsrv/fee/userbilling/export?${params.toString()}`, {
      raw: true,
      accept: "application/vnd.ms-excel, text/csv, */*"
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `123proxy-traffic-${state.usage.dateFrom}-${state.usage.dateTo}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("流量明细已导出");
  } catch (error) {
    setNotice("usage", "error", error.message || "导出失败");
  }
}

function normalizeOverview(payload) {
  const list = Array.isArray(payload) ? payload : [];
  return list.map((item, index) => {
    const bill = item.bill || {};
    return {
      id: bill.id || index,
      period: item.period || bill.timestamp,
      service: bill.services || "IP",
      type: bill.chargeTypeString || (number(bill.chargeType) === 99 ? "流量消费" : "代理服务"),
      amount: number(bill.amount),
      unit: bill.amountUnit || bill.unit || "--",
      total: number(bill.total),
      status: item.status || bill.status || "PAID",
      prepaid: bill.prepaid !== false
    };
  });
}

function overviewRowsMarkup(rows) {
  if (!rows.length) {
    return '<div class="management-state"><i data-lucide="calendar-x"></i><strong>所选月份暂无账单</strong></div>';
  }
  return rows.map((item) => `
    <div class="management-row billing-overview-row" role="row">
      <span>${escapeHtml(formatDateTime(item.period).slice(0, 7))}</span>
      <div><strong>${escapeHtml(item.type)}</strong><small>${escapeHtml(item.service)}</small></div>
      <span>${item.amount ? `${escapeHtml(formatNumber(item.amount, 4))} ${escapeHtml(item.unit)}` : "--"}</span>
      <span>${item.prepaid ? "预付费" : "后付费"}</span>
      <strong>¥${escapeHtml(formatMoney(item.total))}</strong>
      <span class="status ${item.status === "PAID" ? "is-active" : "is-waiting"}"><i></i>${item.status === "PAID" ? "已结算" : escapeHtml(item.status)}</span>
    </div>`).join("");
}

async function renderBillingOverview() {
  const content = document.querySelector("#billingContent");
  content.innerHTML = '<div class="management-state"><span class="loading-spinner"></span><strong>正在读取月度账单</strong></div>';
  try {
    state.billing.overview = normalizeOverview(await request(billingOverviewPath(state.billing.month)));
    const total = state.billing.overview.reduce((sum, item) => sum + item.total, 0);
    content.innerHTML = `
      <section class="account-filter-bar billing-month-filter">
        <div><strong>月度账单</strong><span>按月查看代理产品的结算汇总。</span></div>
        <form id="billingMonthForm">
          <label><span>账单月份</span><input id="billingMonth" type="month" value="${escapeHtml(state.billing.month)}"></label>
          <button class="button button-secondary" type="submit"><i data-lucide="refresh-cw"></i>查询</button>
        </form>
      </section>
      <section class="billing-overview-summary">
        <div><small>本月账单</small><strong><em>¥</em>${formatMoney(total)}</strong><span>${formatNumber(state.billing.overview.length, 0)} 个计费项目</span></div>
        <div><i data-lucide="chart-no-axes-combined"></i><span><strong>流量明细</strong><small>按小时查看代理用量与计费记录</small></span><a href="#usage">查看明细</a></div>
      </section>
      <section class="panel management-table-panel">
        <div class="management-table billing-overview-table" role="table">
          <div class="management-row is-head"><span>账期</span><span>计费项目</span><span>用量</span><span>模式</span><span>金额</span><span>状态</span></div>
          <div>${overviewRowsMarkup(state.billing.overview)}</div>
        </div>
      </section>`;
    document.querySelector("#billingMonthForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      state.billing.month = document.querySelector("#billingMonth").value || monthInputValue(new Date());
      await renderBillingOverview();
    });
    refreshIcons();
  } catch (error) {
    handleAccountError("billing", content, error, renderBillingOverview);
  }
}

function paymentMethodLabel(value) {
  const methods = {
    ALIPAY: "支付宝",
    WECHAT: "微信支付",
    WEPAY: "微信支付",
    BANK: "银行转账",
    STRIPE: "Stripe"
  };
  return methods[String(value || "").toUpperCase()] || value || "--";
}

function normalizeRechargePayload(payload) {
  const content = Array.isArray(payload?.content) ? payload.content : [];
  return {
    rows: content.map((item) => ({
      ...item,
      amount: number(item.amount),
      paymentMethodLabel: paymentMethodLabel(item.paymentMethod),
      invoiceState: item.state || "UNPROCESSED"
    })),
    totalElements: number(payload?.totalElements),
    totalPages: Math.max(1, number(payload?.totalPages) || 1)
  };
}

function canInvoice(payment) {
  return payment.invoiceState === "UNPROCESSED"
    && ["支付宝", "微信支付"].includes(payment.paymentMethodLabel);
}

function rechargeRowsMarkup(rows) {
  if (!rows.length) {
    return '<div class="management-state"><i data-lucide="wallet-cards"></i><strong>暂无充值记录</strong></div>';
  }
  return rows.map((item) => `
    <div class="management-row recharge-record-row" role="row">
      <label class="table-checkbox"><input type="checkbox" data-payment-id="${escapeHtml(item.id)}" ${state.billing.selectedPayments.has(String(item.id)) ? "checked" : ""} ${canInvoice(item) ? "" : "disabled"}><span></span></label>
      <div><strong>${escapeHtml(item.tradeNo || "--")}</strong><small>${escapeHtml(item.transId || "")}</small></div>
      <span>${escapeHtml(formatDateTime(item.paymentDate || item.paymentDateStr))}</span>
      <span>${escapeHtml(item.paymentMethodLabel)}</span>
      <strong>¥${escapeHtml(formatMoney(item.amount))}</strong>
      <span class="status ${item.invoiceState === "PROCESSED" ? "is-active" : "is-waiting"}"><i></i>${item.invoiceState === "PROCESSED" ? "已开票" : "未开票"}</span>
      <span>${escapeHtml(item.invoiceTitle || "--")}</span>
    </div>`).join("");
}

async function loadRechargeRecords() {
  const params = new URLSearchParams({
    name: state.user?.name || "",
    state: state.billing.rechargeStatus,
    page: String(state.billing.rechargePage),
    size: String(state.billing.rechargeSize)
  });
  const normalized = normalizeRechargePayload(await request(`/accsrv/fee/userpayment?${params.toString()}`));
  state.billing.rechargeRows = normalized.rows;
  state.billing.rechargeTotalElements = normalized.totalElements;
  state.billing.rechargeTotalPages = normalized.totalPages;
}

async function renderRechargeRecords() {
  const content = document.querySelector("#billingContent");
  content.innerHTML = '<div class="management-state"><span class="loading-spinner"></span><strong>正在读取充值记录</strong></div>';
  try {
    await loadRechargeRecords();
    content.innerHTML = `
      <section class="account-filter-bar recharge-filter">
        <div><strong>充值记录与开票</strong><span>仅支付宝和微信的未开票充值可申请电子发票，最低开票金额 50 元。</span></div>
        <div class="filter-actions">
          <label><span>开票状态</span><select id="rechargeStatusFilter"><option value="">全部</option><option value="UNPROCESSED" ${state.billing.rechargeStatus === "UNPROCESSED" ? "selected" : ""}>未开票</option><option value="PROCESSED" ${state.billing.rechargeStatus === "PROCESSED" ? "selected" : ""}>已开票</option></select></label>
          <button class="button button-secondary" id="rechargeRecordSearch" type="button"><i data-lucide="search"></i>查询</button>
          <button class="button button-primary" id="applyInvoiceButton" type="button"><i data-lucide="file-plus-2"></i>申请开票</button>
        </div>
      </section>
      <section class="panel management-table-panel">
        <div class="management-table recharge-record-table" role="table">
          <div class="management-row is-head"><span></span><span>交易单号</span><span>充值时间</span><span>支付方式</span><span>金额</span><span>开票状态</span><span>发票抬头</span></div>
          <div>${rechargeRowsMarkup(state.billing.rechargeRows)}</div>
        </div>
        <footer class="management-table-footer">
          <span>共 ${formatNumber(state.billing.rechargeTotalElements, 0)} 条记录</span>
          <div class="pagination-controls">
            <button id="rechargePrevPage" type="button" ${state.billing.rechargePage <= 0 ? "disabled" : ""}><i data-lucide="chevron-left"></i></button>
            <span>第 ${state.billing.rechargePage + 1} / ${state.billing.rechargeTotalPages} 页</span>
            <button id="rechargeNextPage" type="button" ${state.billing.rechargePage + 1 >= state.billing.rechargeTotalPages ? "disabled" : ""}><i data-lucide="chevron-right"></i></button>
          </div>
        </footer>
      </section>`;
    bindRechargeRecordActions();
    refreshIcons();
  } catch (error) {
    handleAccountError("billing", content, error, renderRechargeRecords);
  }
}

function bindRechargeRecordActions() {
  document.querySelectorAll("[data-payment-id]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = String(input.dataset.paymentId);
      if (input.checked) state.billing.selectedPayments.add(id);
      else state.billing.selectedPayments.delete(id);
    });
  });
  document.querySelector("#rechargeRecordSearch")?.addEventListener("click", async () => {
    state.billing.rechargeStatus = document.querySelector("#rechargeStatusFilter").value;
    state.billing.rechargePage = 0;
    state.billing.selectedPayments.clear();
    await renderRechargeRecords();
  });
  document.querySelector("#applyInvoiceButton")?.addEventListener("click", openInvoiceDialog);
  document.querySelector("#rechargePrevPage")?.addEventListener("click", async () => {
    state.billing.rechargePage = Math.max(0, state.billing.rechargePage - 1);
    await renderRechargeRecords();
  });
  document.querySelector("#rechargeNextPage")?.addEventListener("click", async () => {
    state.billing.rechargePage += 1;
    await renderRechargeRecords();
  });
}

function normalizeInvoicePayload(payload) {
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.content) ? payload.content : [];
  return list.map((item) => ({
    ...item,
    amount: number(item.amount),
    invoiceTypeLabel: item.invoiceType === "VAT" ? "增值税专用发票" : "普通电子发票"
  }));
}

function invoiceRowsMarkup(rows) {
  if (!rows.length) {
    return '<div class="management-state"><i data-lucide="file-check-2"></i><strong>暂无发票记录</strong></div>';
  }
  return rows.map((item) => `
    <div class="management-row invoice-record-row" role="row">
      <span>${escapeHtml(formatDateTime(item.date || item.createTime))}</span>
      <div><strong>${escapeHtml(item.invoiceTitle || "--")}</strong><small>${escapeHtml(item.companyTaxNumber || "")}</small></div>
      <span>${escapeHtml(item.invoiceTypeLabel)}</span>
      <strong>¥${escapeHtml(formatMoney(item.amount))}</strong>
      <span>${escapeHtml(item.email || "--")}</span>
      <span class="status is-active"><i></i>${escapeHtml(item.status || "已提交")}</span>
    </div>`).join("");
}

async function renderInvoices() {
  const content = document.querySelector("#billingContent");
  content.innerHTML = '<div class="management-state"><span class="loading-spinner"></span><strong>正在读取发票记录</strong></div>';
  try {
    state.billing.invoices = normalizeInvoicePayload(await request("/accsrv/invoice?page=0&size=50"));
    content.innerHTML = `
      <section class="account-context-band">
        <span><i data-lucide="file-check-2"></i></span>
        <div><strong>电子发票记录</strong><p>发票申请需先在“充值记录与开票”中勾选符合条件的充值。</p></div>
        <button class="button button-secondary" type="button" data-billing-tab="recharge"><i data-lucide="file-plus-2"></i>申请开票</button>
      </section>
      <section class="panel management-table-panel">
        <div class="management-table invoice-record-table" role="table">
          <div class="management-row is-head"><span>申请时间</span><span>发票抬头</span><span>发票类型</span><span>金额</span><span>接收邮箱</span><span>状态</span></div>
          <div>${invoiceRowsMarkup(state.billing.invoices)}</div>
        </div>
      </section>`;
    document.querySelector('[data-billing-tab="recharge"]')?.addEventListener("click", () => selectBillingTab("recharge"));
    refreshIcons();
  } catch (error) {
    handleAccountError("billing", content, error, renderInvoices);
  }
}

function billingShellMarkup(user) {
  return `
    <section class="account-balance-band">
      <div class="account-balance-main">
        <small>账户可用余额</small>
        <strong><em>¥</em>${formatMoney(user?.balance)}</strong>
        <span>可直接支付代理套餐订单</span>
      </div>
      <div class="account-balance-meta"><small>账户类型</small><strong>${user?.parent ? "子账户" : "主账户"}</strong><span>${user?.prePaid === false ? "后付费账户" : "预付费账户"}</span></div>
      <div class="account-balance-actions">
        <button class="button button-primary" id="openRechargeDialog" type="button"><i data-lucide="wallet-cards"></i>账户充值</button>
        <a class="button button-secondary" href="#orders"><i data-lucide="receipt-text"></i>查看订单</a>
      </div>
    </section>
    <nav class="account-tabs" aria-label="账单与发票视图">
      <button type="button" data-billing-tab="overview">月度账单</button>
      <button type="button" data-billing-tab="recharge">充值记录与开票</button>
      <button type="button" data-billing-tab="invoices">发票记录</button>
    </nav>
    <div id="billingContent"></div>`;
}

async function selectBillingTab(tab) {
  state.billing.tab = ["overview", "recharge", "invoices"].includes(tab) ? tab : "overview";
  document.querySelectorAll("[data-billing-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.billingTab === state.billing.tab);
    button.setAttribute("aria-selected", button.dataset.billingTab === state.billing.tab ? "true" : "false");
  });
  if (state.billing.tab === "overview") await renderBillingOverview();
  if (state.billing.tab === "recharge") await renderRechargeRecords();
  if (state.billing.tab === "invoices") await renderInvoices();
}

async function openBilling(initialTab = "") {
  const workspace = document.querySelector("#billingWorkspace");
  if (!workspace) return;
  setNotice("billing");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner"></span><strong>正在读取账单与账户余额</strong></div>';
  try {
    state.user = await request("/accsrv/information");
    workspace.innerHTML = billingShellMarkup(state.user);
    document.querySelectorAll("[data-billing-tab]").forEach((button) => {
      button.addEventListener("click", () => selectBillingTab(button.dataset.billingTab));
    });
    document.querySelector("#openRechargeDialog")?.addEventListener("click", openRechargeDialog);
    await selectBillingTab(initialTab === "recharge" ? "overview" : (initialTab || state.billing.tab));
    if (initialTab === "recharge") openRechargeDialog();
    refreshIcons();
  } catch (error) {
    handleAccountError("billing", workspace, error, () => openBilling(initialTab));
  }
}

function selectedInvoicePayments() {
  return state.billing.rechargeRows.filter((item) => state.billing.selectedPayments.has(String(item.id)));
}

function openInvoiceDialog() {
  const payments = selectedInvoicePayments();
  if (!payments.length) {
    setNotice("billing", "error", "请先勾选可开票的充值记录。");
    return;
  }
  const total = payments.reduce((sum, item) => sum + item.amount, 0);
  if (total < 50) {
    setNotice("billing", "error", "开票金额最低为 50 元。");
    return;
  }
  const dialog = document.querySelector("#invoiceApplyDialog");
  document.querySelector("#invoiceAmount").textContent = `¥${formatMoney(total)}`;
  document.querySelector("#invoiceApplyMessage").hidden = true;
  dialog?.showModal();
}

async function submitInvoice(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payments = selectedInvoicePayments();
  const amount = payments.reduce((sum, item) => sum + item.amount, 0);
  const invoiceType = form.invoiceType.value;
  const invoiceSubject = form.invoiceSubject.value;
  const title = form.invoiceTitle.value.trim();
  const taxNumber = form.companyTaxNumber.value.trim();
  const email = form.invoiceEmail.value.trim();
  const message = document.querySelector("#invoiceApplyMessage");
  if (title.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || ((invoiceType === "VAT" || invoiceSubject === "Company") && taxNumber.length < 2)) {
    message.hidden = false;
    message.textContent = "请填写有效的发票抬头、税号和接收邮箱。";
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    await request("/accsrv/wirteinvoice", {
      method: "POST",
      body: {
        invoice: {
          username: state.user?.name || "",
          invoiceType,
          invoiceSubject: invoiceType === "GENERAL" ? invoiceSubject : undefined,
          amount,
          invoiceTitle: title,
          companyTaxNumber: taxNumber,
          email,
          phone: "",
          name: "",
          expressInformation: "",
          bank: "",
          bankInformation: "",
          registAddress: "",
          registPhone: "",
          registInformation: ""
        },
        paymentIds: payments.map((item) => item.id)
      }
    });
    state.billing.selectedPayments.clear();
    document.querySelector("#invoiceApplyDialog")?.close();
    showToast("发票申请已提交");
    await renderRechargeRecords();
  } catch (error) {
    message.hidden = false;
    message.textContent = error.message || "发票申请失败";
  } finally {
    submit.disabled = false;
  }
}

function openRechargeDialog() {
  stopPaymentPolling();
  const form = document.querySelector("#accountRechargeForm");
  form.reset();
  form.amount.value = "500";
  form.paymentMethod.value = "alipay";
  document.querySelector("#rechargeCurrentBalance").textContent = `¥${formatMoney(state.user?.balance)}`;
  document.querySelector("#accountRechargeMessage").hidden = true;
  document.querySelector("#rechargePaymentStage").hidden = true;
  document.querySelector("#rechargeFormStage").hidden = false;
  updateRechargeMethod();
  document.querySelector("#accountRechargeDialog")?.showModal();
}

function updateRechargeMethod() {
  document.querySelectorAll("[data-recharge-method]").forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("is-active", input.checked);
  });
}

async function submitRecharge(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const amount = Number(form.amount.value);
  const method = form.paymentMethod.value;
  const message = document.querySelector("#accountRechargeMessage");
  if (!Number.isInteger(amount) || amount < 100) {
    message.hidden = false;
    message.textContent = "充值金额必须为不低于 100 元的整数。";
    return;
  }
  if (method === "wechat" && amount > 3000) {
    message.hidden = false;
    message.textContent = "微信单笔充值不能超过 3000 元，请使用支付宝或联系对公转账。";
    return;
  }
  message.hidden = true;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  if (method === "alipay") {
    const paymentWindow = openPaymentWindow();
    if (!paymentWindow) {
      submit.disabled = false;
      message.hidden = false;
      message.textContent = "浏览器阻止了支付窗口，请允许弹窗后重试。";
      return;
    }
    savePendingRecharge({ provider: "alipay", amount });
    try {
      const paymentResponse = await request(`/accsrv/0xalipay/${amount}`);
      savePendingRecharge({
        provider: "alipay",
        paymentTradeNo: extractPaymentTradeNo(paymentResponse),
        amount
      });
      submitPaymentHtml(paymentResponse, paymentWindow);
      document.querySelector("#accountRechargeDialog")?.close();
      showToast("支付宝支付页面已打开");
    } catch (error) {
      clearPendingRecharge();
      paymentWindow.popup?.close();
      message.hidden = false;
      message.textContent = error.message || "支付宝充值创建失败";
    } finally {
      submit.disabled = false;
    }
    return;
  }
  try {
    const payload = await request(`/accsrv/0xwxpayputorder/${amount}`);
    document.querySelector("#rechargeFormStage").hidden = true;
    document.querySelector("#rechargePaymentStage").hidden = false;
    document.querySelector("#rechargePaymentAmount").textContent = `¥${formatMoney(amount)}`;
    document.querySelector("#rechargePaymentOrder").textContent = payload.tradeNo || "--";
    const qr = document.querySelector("#accountRechargeQr");
    const qrError = document.querySelector("#accountRechargeQrError");
    try {
      await renderQrCode(qr, payload.url || "", { size: 220 });
      qrError.hidden = true;
    } catch {
      qr.hidden = true;
      qrError.textContent = "二维码加载失败，请返回后重新发起充值。";
      qrError.hidden = false;
    }
    startPaymentPolling(payload.tradeNo);
  } catch (error) {
    message.hidden = false;
    message.textContent = error.message || "微信充值创建失败";
  } finally {
    submit.disabled = false;
  }
}

function stopPaymentPolling() {
  if (state.paymentTimer) window.clearTimeout(state.paymentTimer);
  state.paymentTimer = null;
}

function startPaymentPolling(tradeNo) {
  stopPaymentPolling();
  state.paymentDeadline = Date.now() + 5 * 60 * 1000;
  const check = async () => {
    try {
      const payload = await request(`/accsrv/0xwxcheckorderstatus/${encodeURIComponent(tradeNo)}`);
      if (payload?.paid) {
        stopPaymentPolling();
        window.ProxyGoogleAds?.recharge({
          transaction_id: String(tradeNo),
          value: Number(document.querySelector("#rechargePaymentAmount")?.textContent?.replace(/[^0-9.]/g, "")) || 0,
          currency: "CNY",
          payment_method: "wechat"
        });
        if (state.user) state.user.balance = payload.balance ?? state.user.balance;
        document.querySelector("#accountRechargeDialog")?.close();
        showToast("充值成功");
        window.ConsoleOverview?.reload?.();
        await openBilling();
        return;
      }
      if (Date.now() >= state.paymentDeadline) {
        document.querySelector("#rechargePaymentHint").textContent = "二维码已过期，请返回后重新创建充值。";
        stopPaymentPolling();
        return;
      }
      state.paymentTimer = window.setTimeout(check, 5000);
    } catch (error) {
      document.querySelector("#rechargePaymentHint").textContent = error.message || "支付状态查询失败";
      stopPaymentPolling();
    }
  };
  state.paymentTimer = window.setTimeout(check, 5000);
}

function renderRechargeReturnState(type, title, message, balance = null) {
  const workspace = document.querySelector("#billingWorkspace");
  if (!workspace) return;
  const icon = type === "success" ? "circle-check-big" : type === "error" ? "circle-alert" : "loader-circle";
  workspace.innerHTML = `
    <section class="panel payment-return-panel">
      <div class="payment-complete is-${type}">
        <i data-lucide="${icon}" aria-hidden="true"></i>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(message)}</p>
        ${balance === null ? "" : `<p>当前账户余额 <strong>¥${formatMoney(balance)}</strong></p>`}
        <div class="payment-return-actions">
          <a class="button button-primary" href="#billing?tab=recharge">查看充值记录</a>
          <a class="button button-secondary" href="#overview">返回控制台概览</a>
        </div>
      </div>
    </section>`;
  refreshIcons();
}

function notifyRechargeComplete(balance) {
  try {
    window.opener?.postMessage({
      type: "123proxy-recharge-complete",
      balance
    }, window.location.origin);
  } catch {
    // The result page remains useful if the original console window was closed.
  }
}

async function handleRechargeReturn(params = new URLSearchParams()) {
  const paymentTradeNo = String(params.get("tradeNo") || "");
  const pending = loadPendingRecharge(paymentTradeNo);
  if (!paymentTradeNo) {
    renderRechargeReturnState("error", "缺少支付流水号", "无法核验本次充值，请前往充值记录查看到账状态。");
    return;
  }

  renderRechargeReturnState("pending", "正在确认充值结果", "正在向支付后台核验到账状态，请勿关闭页面。");
  try {
    const result = await request(`/accsrv/0xalicheckorderstatus/${encodeURIComponent(paymentTradeNo)}`);
    if (!result?.paid) {
      const waiting = ["NOTPAY", "USERPAYING", ""].includes(String(result?.status || ""));
      renderRechargeReturnState(
        waiting ? "pending" : "error",
        waiting ? "充值结果确认中" : "充值未完成",
        waiting
          ? "支付平台尚未返回最终状态，请稍后在充值记录中刷新查看。"
          : `支付状态：${result?.status || "UNKNOWN"}。如已扣款，请联系客户服务核查。`
      );
      return;
    }

    const user = await request("/accsrv/information").catch(() => null);
    const balance = number(result.balance ?? user?.balance ?? state.user?.balance);
    state.user = user || { ...(state.user || {}), balance };
    window.ProxyGoogleAds?.recharge({
      transaction_id: paymentTradeNo,
      value: number(pending?.amount),
      currency: "CNY",
      payment_method: pending?.provider || "alipay"
    });
    clearPendingRecharge();
    window.ConsoleOverview?.reload?.();
    notifyRechargeComplete(balance);
    const amountText = pending?.amount ? `¥${formatMoney(pending.amount)} 已到账。` : "充值金额已到账。";
    renderRechargeReturnState("success", "充值成功", amountText, balance);
  } catch (error) {
    renderRechargeReturnState(
      "error",
      "充值状态确认失败",
      error.message || "请前往充值记录重新检查到账状态。"
    );
  }
}

function hasAuthority(name) {
  const authorities = Array.isArray(state.user?.authorities) ? state.user.authorities : [];
  return !authorities.length || authorities.includes(name);
}

function settingsTabs() {
  return [
    ["profile", "个人资料", true],
    ["security", "登录安全", hasAuthority("MODIFY_PASSWORD")],
    ["api", "API Token", hasAuthority("MODIFY_API_TOKEN")]
  ].filter((item) => item[2]);
}

function profileMarkup(user) {
  return `
    <form class="panel settings-form account-profile-form" id="accountProfileForm">
      <header class="panel-head"><div><h2>个人资料</h2><p>用于账户联系、发票和服务支持</p></div><span class="status is-active"><i></i>账户正常</span></header>
      <div class="settings-form-grid">
        <label><span>登录账户</span><input value="${escapeHtml(user.name || "")}" disabled><small>登录名不可修改</small></label>
        <label><span>姓名</span><input name="fullname" value="${escapeHtml(user.fullname || "")}" autocomplete="name"></label>
        <label><span>公司名称</span><input name="companyName" value="${escapeHtml(user.companyName || "")}" autocomplete="organization"></label>
        <label><span>职位</span><input name="jobTitle" value="${escapeHtml(user.jobTitle || "")}" autocomplete="organization-title"></label>
        <label><span>联系邮箱</span><input name="email" type="email" value="${escapeHtml(user.email || "")}" autocomplete="email"></label>
        <label><span>手机号码</span><span class="field-with-action"><input value="${escapeHtml(user.phoneNumber || "")}" disabled><button type="button" id="openPhoneDialog">修改</button></span></label>
        <label><span>国家或地区</span><input name="country" value="${escapeHtml(user.country || "")}"></label>
        <label><span>省 / 州</span><input name="province" value="${escapeHtml(user.province || "")}"></label>
      </div>
      <div class="form-message" id="profileFormMessage" hidden></div>
      <footer><button class="button button-primary" type="submit"><i data-lucide="save"></i>保存资料</button></footer>
    </form>`;
}

function securityMarkup(user) {
  const securityLevels = {
    LOW: "低风险",
    MEDIUM: "中等风险",
    HIGH: "高风险"
  };
  const securityLevel = securityLevels[String(user.securityLevel || "").toUpperCase()] || user.securityLevel || "标准";
  return `
    <div class="settings-security-layout">
      <form class="panel settings-form" id="changePasswordForm">
        <header class="panel-head"><div><h2>修改登录密码</h2><p>修改后请使用新密码重新登录</p></div><i data-lucide="shield-check"></i></header>
        <div class="settings-form-stack">
          <label><span>当前密码</span><input name="currentPassword" type="password" autocomplete="current-password" required></label>
          <label><span>新密码</span><input name="newPassword" type="password" minlength="8" autocomplete="new-password" required><small>至少 8 位，建议包含字母、数字和符号</small></label>
          <label><span>确认新密码</span><input name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required></label>
        </div>
        <div class="form-message" id="passwordFormMessage" hidden></div>
        <footer><button class="button button-primary" type="submit"><i data-lucide="key-round"></i>更新密码</button></footer>
      </form>
      <section class="panel account-session-panel">
        <header class="panel-head"><div><h2>当前会话</h2><p>控制台登录与账户安全状态</p></div></header>
        <dl>
          <div><dt>账户</dt><dd>${escapeHtml(user.name || "--")}</dd></div>
          <div><dt>最近登录</dt><dd>${escapeHtml(formatDateTime(user.lastSeen))}</dd></div>
          <div><dt>安全等级</dt><dd>${escapeHtml(securityLevel)}</dd></div>
          <div><dt>账户类型</dt><dd>${user.parent ? "子账户" : "主账户"}</dd></div>
        </dl>
        <button class="button button-secondary" id="logoutAccount" type="button"><i data-lucide="log-out"></i>退出当前账户</button>
      </section>
    </div>`;
}

function apiTokenMarkup(user) {
  const token = String(user.token || "");
  const display = state.apiTokenVisible ? token : (token ? "•".repeat(Math.min(32, token.length)) : "--");
  return `
    <section class="panel api-token-panel">
      <header class="panel-head"><div><h2>API Token</h2><p>用于 API 服务认证，请像密码一样妥善保管</p></div><span class="status ${token ? "is-active" : "is-waiting"}"><i></i>${token ? "已生成" : "未生成"}</span></header>
      <div class="api-token-value">
        <code>${escapeHtml(display)}</code>
        <button class="icon-button" id="toggleApiToken" type="button" ${token ? "" : "disabled"} title="${state.apiTokenVisible ? "隐藏" : "显示"}"><i data-lucide="${state.apiTokenVisible ? "eye-off" : "eye"}"></i></button>
        <button class="icon-button" id="copyApiToken" type="button" ${token ? "" : "disabled"} title="复制"><i data-lucide="copy"></i></button>
      </div>
      <div class="account-context-band is-inline">
        <span><i data-lucide="triangle-alert"></i></span>
        <div><strong>重新生成会使旧 Token 失效</strong><p>更新前请确认采集程序已经准备切换凭据。</p></div>
      </div>
      <footer><button class="button button-primary" id="generateApiToken" type="button"><i data-lucide="refresh-cw"></i>${token ? "重新生成 Token" : "生成 Token"}</button></footer>
    </section>`;
}

function renderSettingsContent() {
  const content = document.querySelector("#settingsContent");
  if (state.settingsTab === "profile") content.innerHTML = profileMarkup(state.user);
  if (state.settingsTab === "security") content.innerHTML = securityMarkup(state.user);
  if (state.settingsTab === "api") content.innerHTML = apiTokenMarkup(state.user);
  bindSettingsActions();
  refreshIcons();
}

function selectSettingsTab(tab) {
  const available = settingsTabs().map((item) => item[0]);
  state.settingsTab = available.includes(tab) ? tab : available[0];
  document.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.settingsTab === state.settingsTab);
  });
  renderSettingsContent();
}

async function openSettings(initialTab = "") {
  const workspace = document.querySelector("#settingsWorkspace");
  if (!workspace) return;
  setNotice("settings");
  workspace.innerHTML = '<div class="management-state"><span class="loading-spinner"></span><strong>正在读取账户设置</strong></div>';
  try {
    state.user = await request("/accsrv/information");
    const tabs = settingsTabs();
    workspace.innerHTML = `
      <nav class="account-tabs settings-tabs" aria-label="账户设置视图">
        ${tabs.map(([key, label]) => `<button type="button" data-settings-tab="${key}">${label}</button>`).join("")}
      </nav>
      <div id="settingsContent"></div>`;
    document.querySelectorAll("[data-settings-tab]").forEach((button) => {
      button.addEventListener("click", () => selectSettingsTab(button.dataset.settingsTab));
    });
    selectSettingsTab(initialTab || state.settingsTab);
  } catch (error) {
    handleAccountError("settings", workspace, error, () => openSettings(initialTab));
  }
}

function setFormMessage(selector, message, type = "error") {
  const element = document.querySelector(selector);
  if (!element) return;
  element.hidden = !message;
  element.className = `form-message${type ? ` is-${type}` : ""}`;
  element.textContent = message;
}

function setFormBusy(form, busy) {
  form?.querySelectorAll("button, input, select").forEach((control) => {
    if (busy) {
      control.dataset.accountWasDisabled = control.disabled ? "true" : "false";
      control.disabled = true;
    } else {
      control.disabled = control.dataset.accountWasDisabled === "true";
      delete control.dataset.accountWasDisabled;
    }
  });
}

function bindSettingsActions() {
  document.querySelector("#accountProfileForm")?.addEventListener("submit", saveProfile);
  document.querySelector("#openPhoneDialog")?.addEventListener("click", () => {
    const form = document.querySelector("#changePhoneForm");
    form.reset();
    form.phone.value = state.user?.phoneNumber || "";
    document.querySelector("#changePhoneMessage").hidden = true;
    document.querySelector("#changePhoneDialog")?.showModal();
  });
  document.querySelector("#changePasswordForm")?.addEventListener("submit", changePassword);
  document.querySelector("#logoutAccount")?.addEventListener("click", () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.location.href = isLocalPreview() ? "/console/login.html" : "/login.html";
  });
  document.querySelector("#toggleApiToken")?.addEventListener("click", () => {
    state.apiTokenVisible = !state.apiTokenVisible;
    renderSettingsContent();
  });
  document.querySelector("#copyApiToken")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(state.user?.token || "");
      showToast("API Token 已复制");
    } catch {
      showToast("浏览器未允许复制");
    }
  });
  document.querySelector("#generateApiToken")?.addEventListener("click", generateApiToken);
}

async function saveProfile(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFormMessage("#profileFormMessage", "请输入有效的联系邮箱。");
    return;
  }
  setFormBusy(form, true);
  try {
    const payload = {
      companyName: form.companyName.value.trim(),
      jobTitle: form.jobTitle.value.trim(),
      email,
      country: form.country.value.trim(),
      province: form.province.value.trim(),
      note: state.user?.note || "",
      fullname: form.fullname.value.trim(),
      phoneNumber: state.user?.phoneNumber || ""
    };
    await request("/accsrv/current", { method: "PUT", body: payload });
    Object.assign(state.user, payload);
    setFormMessage("#profileFormMessage", "个人资料已保存。", "success");
    window.ConsoleOverview?.reload?.();
  } catch (error) {
    setFormMessage("#profileFormMessage", error.message || "资料保存失败");
  } finally {
    setFormBusy(form, false);
  }
}

async function changePassword(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;
  if (newPassword.length < 8 || newPassword !== form.confirmPassword.value) {
    setFormMessage("#passwordFormMessage", "新密码至少 8 位，且两次输入必须一致。");
    return;
  }
  setFormBusy(form, true);
  try {
    await request("/accsrv/changepass", {
      method: "PUT",
      body: {
        username: state.user?.name || "",
        password: currentPassword,
        newPassword,
        parent: state.user?.parent || ""
      }
    });
    form.reset();
    setFormMessage("#passwordFormMessage", "密码已更新，请在下次登录时使用新密码。", "success");
  } catch (error) {
    setFormMessage("#passwordFormMessage", error.message || "密码更新失败");
  } finally {
    setFormBusy(form, false);
  }
}

async function generateApiToken(event) {
  const button = event.currentTarget;
  if (state.user?.token && !window.confirm("重新生成后，旧 API Token 将立即失效。确认继续吗？")) return;
  button.disabled = true;
  try {
    const payload = await request("/intelligroup/current/gettoken/");
    state.user.token = typeof payload === "string" ? payload : payload?.token || payload?.data || "";
    state.apiTokenVisible = true;
    renderSettingsContent();
    showToast("API Token 已更新");
  } catch (error) {
    setNotice("settings", "error", error.message || "API Token 生成失败");
  } finally {
    button.disabled = false;
  }
}

async function sendPhoneOtp() {
  const form = document.querySelector("#changePhoneForm");
  const phone = form.phone.value.trim();
  const message = document.querySelector("#changePhoneMessage");
  if (!/^\d{11,}$/.test(phone)) {
    message.hidden = false;
    message.textContent = "请输入有效的手机号码。";
    return;
  }
  const button = document.querySelector("#sendPhoneOtp");
  button.disabled = true;
  try {
    await request(`/accsrv/sms-service/otp/${encodeURIComponent(phone)}`);
    let remaining = 60;
    button.textContent = `${remaining}s 后重发`;
    const timer = window.setInterval(() => {
      remaining -= 1;
      button.textContent = remaining > 0 ? `${remaining}s 后重发` : "发送验证码";
      if (remaining <= 0) {
        window.clearInterval(timer);
        button.disabled = false;
      }
    }, 1000);
    message.hidden = false;
    message.className = "form-message is-success";
    message.textContent = "验证码已发送。";
  } catch (error) {
    button.disabled = false;
    message.hidden = false;
    message.textContent = error.message || "验证码发送失败";
  }
}

async function submitPhoneChange(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const phone = form.phone.value.trim();
  const otp = form.otp.value.replace(/\s/g, "");
  const message = document.querySelector("#changePhoneMessage");
  if (!/^\d{11,}$/.test(phone) || !otp) {
    message.hidden = false;
    message.textContent = "请输入有效手机号码和验证码。";
    return;
  }
  setFormBusy(form, true);
  try {
    await request("/accsrv/resetphonewithotp", { method: "POST", body: { phone, otp } });
    state.user.phoneNumber = phone;
    document.querySelector("#changePhoneDialog")?.close();
    renderSettingsContent();
    showToast("手机号码已更新");
  } catch (error) {
    message.hidden = false;
    message.textContent = error.message || "手机号码更新失败";
  } finally {
    setFormBusy(form, false);
  }
}

function ensureDialogs() {
  if (document.querySelector("#accountRechargeDialog")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="console-dialog account-dialog" id="accountRechargeDialog">
      <form class="dialog-card" id="accountRechargeForm">
        <header><div><small>ACCOUNT RECHARGE</small><h2>账户充值</h2></div><button class="dialog-close" type="button" data-account-dialog-close aria-label="关闭"><i data-lucide="x"></i></button></header>
        <div class="dialog-body">
          <div id="rechargeFormStage">
            <div class="recharge-current-balance"><span>当前余额</span><strong id="rechargeCurrentBalance">¥${formatMoney(state.user?.balance)}</strong></div>
            <label class="dialog-field"><span>充值金额</span><span class="money-input"><em>¥</em><input name="amount" type="number" min="100" step="1" value="500" required></span><small>最低 100 元，仅支持整数金额</small></label>
            <fieldset class="payment-method-field"><legend>支付方式</legend>
              <label data-recharge-method><input type="radio" name="paymentMethod" value="alipay" checked><span><i data-lucide="landmark"></i><strong>支付宝</strong><small>支付页面将在新窗口打开</small></span></label>
              <label data-recharge-method><input type="radio" name="paymentMethod" value="wechat"><span><i data-lucide="scan-line"></i><strong>微信支付</strong><small>单笔最高 3000 元</small></span></label>
            </fieldset>
            <div class="form-message" id="accountRechargeMessage" hidden></div>
          </div>
          <div class="recharge-payment-stage" id="rechargePaymentStage" hidden>
            <strong id="rechargePaymentAmount">¥--</strong>
            <div class="payment-qr" id="accountRechargeQr" aria-live="polite"></div>
            <div class="form-message" id="accountRechargeQrError" hidden></div>
            <p>交易单号 <code id="rechargePaymentOrder">--</code></p>
            <small id="rechargePaymentHint">请使用微信扫描二维码，支付成功后将自动更新余额。</small>
          </div>
        </div>
        <footer><button class="button button-secondary" type="button" data-account-dialog-close>取消</button><button class="button button-primary" type="submit">立即充值</button></footer>
      </form>
    </dialog>
    <dialog class="console-dialog account-dialog" id="invoiceApplyDialog">
      <form class="dialog-card" id="invoiceApplyForm">
        <header><div><small>INVOICE APPLICATION</small><h2>申请电子发票</h2></div><button class="dialog-close" type="button" data-account-dialog-close aria-label="关闭"><i data-lucide="x"></i></button></header>
        <div class="dialog-body">
          <div class="invoice-amount-line"><span>开票金额</span><strong id="invoiceAmount">¥--</strong></div>
          <div class="dialog-choice-row">
            <label><input type="radio" name="invoiceType" value="GENERAL" checked><span>普通电子发票</span></label>
            <label><input type="radio" name="invoiceType" value="VAT"><span>增值税专用发票</span></label>
          </div>
          <div class="dialog-choice-row">
            <label><input type="radio" name="invoiceSubject" value="Personal" checked><span>个人</span></label>
            <label><input type="radio" name="invoiceSubject" value="Company"><span>企业</span></label>
          </div>
          <label class="dialog-field"><span>发票抬头</span><input name="invoiceTitle" minlength="2" maxlength="50" required></label>
          <label class="dialog-field"><span>公司税号</span><input name="companyTaxNumber" maxlength="50"><small>企业普通发票或专票必填</small></label>
          <label class="dialog-field"><span>接收邮箱</span><input name="invoiceEmail" type="email" required></label>
          <div class="form-message" id="invoiceApplyMessage" hidden></div>
        </div>
        <footer><button class="button button-secondary" type="button" data-account-dialog-close>取消</button><button class="button button-primary" type="submit">提交申请</button></footer>
      </form>
    </dialog>
    <dialog class="console-dialog account-dialog" id="changePhoneDialog">
      <form class="dialog-card" id="changePhoneForm">
        <header><div><small>PHONE VERIFICATION</small><h2>修改手机号码</h2></div><button class="dialog-close" type="button" data-account-dialog-close aria-label="关闭"><i data-lucide="x"></i></button></header>
        <div class="dialog-body">
          <label class="dialog-field"><span>新手机号码</span><input name="phone" type="tel" inputmode="numeric" required></label>
          <label class="dialog-field"><span>短信验证码</span><span class="field-with-action"><input name="otp" inputmode="numeric" required><button id="sendPhoneOtp" type="button">发送验证码</button></span></label>
          <div class="form-message" id="changePhoneMessage" hidden></div>
        </div>
        <footer><button class="button button-secondary" type="button" data-account-dialog-close>取消</button><button class="button button-primary" type="submit">确认修改</button></footer>
      </form>
    </dialog>`);
  document.querySelectorAll("[data-account-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      stopPaymentPolling();
      button.closest("dialog")?.close();
    });
  });
  document.querySelectorAll("[data-recharge-method] input").forEach((input) => {
    input.addEventListener("change", updateRechargeMethod);
  });
  document.querySelector("#accountRechargeForm")?.addEventListener("submit", submitRecharge);
  document.querySelector("#invoiceApplyForm")?.addEventListener("submit", submitInvoice);
  document.querySelector("#changePhoneForm")?.addEventListener("submit", submitPhoneChange);
  document.querySelector("#sendPhoneOtp")?.addEventListener("click", sendPhoneOtp);
  refreshIcons();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  ensureDialogs();
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "123proxy-recharge-complete") return;
    if (state.user && Number.isFinite(Number(event.data.balance))) {
      state.user.balance = Number(event.data.balance);
    }
    window.ConsoleOverview?.reload?.();
    showToast("充值成功，账户余额已更新");
  });
  window.ConsoleAccount = {
    openUsage,
    openBilling,
    openSettings,
    openRecharge: openRechargeDialog,
    handleRechargeReturn
  };
  window.dispatchEvent(new CustomEvent("console-account-ready"));
}

export {
  billingDetailsPath,
  billingOverviewPath,
  normalizeInvoicePayload,
  normalizeOverview,
  normalizeRechargePayload,
  normalizeUsagePayload,
  paymentMethodLabel,
  timezoneOffset,
  trafficToMb
};
