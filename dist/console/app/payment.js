const PENDING_PAYMENT_KEY = "123proxy_pending_payment";
const PENDING_RECHARGE_KEY = "123proxy_pending_recharge";
const PENDING_PAYMENT_TTL_MS = 2 * 60 * 60 * 1000;

function normalizePaymentAction(value, base = globalThis.window?.location?.href || "https://console.123proxy.cn/") {
  const action = String(value || "").trim();
  if (!action) throw new Error("支付宝支付地址无效");
  let url;
  try {
    url = new URL(action, base);
  } catch {
    throw new Error("支付宝支付地址无效");
  }
  if (!/^https?:$/.test(url.protocol)) {
    throw new Error("支付宝支付地址无效");
  }
  return url.href;
}

function normalizePaymentPayload(payload, seen = new Set()) {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object" || seen.has(payload)) return "";
  seen.add(payload);

  const preferredKeys = [
    "html",
    "paymentHtml",
    "form",
    "url",
    "payUrl",
    "paymentUrl",
    "data",
    "body",
    "content",
    "result"
  ];
  for (const key of preferredKeys) {
    if (!(key in payload)) continue;
    const value = normalizePaymentPayload(payload[key], seen);
    if (value) return value;
  }

  for (const value of Object.values(payload)) {
    const normalized = normalizePaymentPayload(value, seen);
    if (/^(?:https?:\/\/|<!doctype|<html|<form|<script|<meta)/i.test(normalized)) return normalized;
  }
  return "";
}

function openPaymentWindow() {
  const browserWindow = globalThis.window;
  if (!browserWindow) return null;
  const target = `123proxy_alipay_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const popup = browserWindow.open("", target);
  if (!popup) return null;

  popup.document.open();
  popup.document.write("<!doctype html><html lang=\"zh-CN\"><head><meta charset=\"utf-8\"><title>支付宝支付</title></head><body><p style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;color:#334155\">正在进入支付宝...</p></body></html>");
  popup.document.close();
  return { popup, target };
}

function appendPaymentField(form, name, value) {
  const input = form.ownerDocument.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.append(input);
}

function extractPaymentNavigation(parsed) {
  const refresh = parsed.querySelector('meta[http-equiv="refresh" i]')?.getAttribute("content") || "";
  const refreshMatch = refresh.match(/(?:^|;)\s*url\s*=\s*["']?([^"']+)/i);
  if (refreshMatch?.[1]) return refreshMatch[1].trim();

  const scripts = Array.from(parsed.scripts || []).map((script) => script.textContent || "").join("\n");
  const patterns = [
    /(?:window\.)?location(?:\.href)?\s*=\s*["']([^"']+)["']/i,
    /(?:window\.)?location\.(?:assign|replace)\(\s*["']([^"']+)["']/i,
    /window\.open\(\s*["']([^"']+)["']/i
  ];
  for (const pattern of patterns) {
    const match = scripts.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return parsed.querySelector('a[href^="https://"], a[href^="http://"]')?.getAttribute("href") || "";
}

function navigatePaymentHtml(paymentHtml, paymentWindow) {
  const BlobType = globalThis.Blob;
  const UrlApi = globalThis.URL;
  if (!BlobType || typeof UrlApi?.createObjectURL !== "function") {
    throw new Error("当前浏览器无法打开支付宝支付页面，请升级浏览器后重试");
  }
  const blobUrl = UrlApi.createObjectURL(new BlobType([paymentHtml], { type: "text/html;charset=utf-8" }));
  paymentWindow.popup.location.replace(blobUrl);
  globalThis.window.setTimeout(() => UrlApi.revokeObjectURL(blobUrl), 2 * 60 * 1000);
}

function submitPaymentHtml(html, paymentWindow) {
  const browserWindow = globalThis.window;
  const document = globalThis.document;
  const Parser = globalThis.DOMParser;
  if (!browserWindow || !document || !Parser || !paymentWindow?.popup || paymentWindow.popup.closed) {
    throw new Error("支付宝支付窗口已关闭，请重新发起充值");
  }

  const paymentHtml = normalizePaymentPayload(html);
  if (!paymentHtml) throw new Error("支付宝未返回可用的支付页面，请稍后重试");
  if (/^https?:\/\/\S+$/i.test(paymentHtml)) {
    paymentWindow.popup.location.replace(normalizePaymentAction(paymentHtml));
    paymentWindow.popup.focus();
    return;
  }

  const parsed = new Parser().parseFromString(paymentHtml, "text/html");
  const sourceForm = parsed.querySelector("form");
  if (!sourceForm) {
    const navigation = extractPaymentNavigation(parsed);
    if (navigation) {
      paymentWindow.popup.location.replace(normalizePaymentAction(navigation));
    } else {
      navigatePaymentHtml(paymentHtml, paymentWindow);
    }
    paymentWindow.popup.focus();
    return;
  }

  const form = document.createElement("form");
  form.hidden = true;
  form.method = String(sourceForm.getAttribute("method") || "post").toLowerCase() === "get" ? "get" : "post";
  form.action = normalizePaymentAction(sourceForm.getAttribute("action"));
  form.target = paymentWindow.target;
  form.acceptCharset = sourceForm.getAttribute("accept-charset") || "UTF-8";

  for (const control of Array.from(sourceForm.elements || [])) {
    const name = String(control.getAttribute?.("name") || "");
    const tagName = String(control.tagName || "").toLowerCase();
    const type = String(control.getAttribute?.("type") || "").toLowerCase();
    if (!name || control.disabled || tagName === "button" || ["button", "submit", "reset", "file", "image"].includes(type)) continue;
    if (["checkbox", "radio"].includes(type) && !control.checked) continue;
    if (tagName === "select" && control.multiple) {
      for (const option of Array.from(control.selectedOptions || [])) {
        appendPaymentField(form, name, option.value);
      }
      continue;
    }
    appendPaymentField(form, name, control.value || "");
  }

  document.body.append(form);
  try {
    globalThis.HTMLFormElement.prototype.submit.call(form);
  } finally {
    browserWindow.setTimeout(() => form.remove(), 0);
  }
  paymentWindow.popup.focus();
}

function storageOrDefault(storage) {
  return storage || globalThis.window?.localStorage || null;
}

function normalizePaymentUri(value) {
  const uri = String(value || "").trim();
  if (!/^(?:weixin|https?):\/\//i.test(uri)) {
    throw new Error("支付二维码地址无效");
  }
  return uri;
}

function extractPaymentTradeNo(html) {
  const text = normalizePaymentPayload(html);
  const patterns = [
    /alipayreturn=([^"'&<>\s]+)/i,
    /out_trade_no["']?\s*[:=]\s*["']([^"']+)/i,
    /tradeNo["']?\s*[:=]\s*["']([^"']+)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return "";
}

async function renderQrCode(container, value, options = {}) {
  if (!container) throw new Error("二维码容器不存在");
  const uri = normalizePaymentUri(value);
  const size = Number(options.size) || 220;
  const QRCode = globalThis.window?.QRCode;
  if (typeof QRCode !== "function") {
    throw new Error("二维码组件未加载");
  }

  container.replaceChildren();
  container.hidden = false;
  new QRCode(container, {
    text: uri,
    width: size,
    height: size,
    colorDark: options.colorDark || "#0c111b",
    colorLight: options.colorLight || "#ffffff",
    correctLevel: QRCode.CorrectLevel?.M
  });

  await new Promise((resolve) => globalThis.window.requestAnimationFrame(resolve));
  const graphic = container.querySelector("img, canvas, svg, table");
  if (!graphic) throw new Error("二维码绘制失败");
  graphic.setAttribute("aria-label", "微信支付二维码");
  return graphic;
}

function savePendingPayment(record, storage) {
  const target = storageOrDefault(storage);
  if (!target || !record?.orderTradeNo) return null;
  const normalized = {
    provider: String(record.provider || ""),
    orderTradeNo: String(record.orderTradeNo),
    paymentTradeNo: String(record.paymentTradeNo || ""),
    amount: Number(record.amount) || 0,
    createdAt: Number(record.createdAt) || Date.now()
  };
  target.setItem(PENDING_PAYMENT_KEY, JSON.stringify(normalized));
  return normalized;
}

function loadPendingPayment(paymentTradeNo = "", storage, now = Date.now()) {
  const target = storageOrDefault(storage);
  if (!target) return null;
  try {
    const pending = JSON.parse(target.getItem(PENDING_PAYMENT_KEY) || "null");
    if (!pending?.orderTradeNo || now - Number(pending.createdAt) > PENDING_PAYMENT_TTL_MS) {
      target.removeItem(PENDING_PAYMENT_KEY);
      return null;
    }
    if (
      paymentTradeNo
      && pending.paymentTradeNo
      && String(paymentTradeNo) !== String(pending.paymentTradeNo)
    ) {
      return null;
    }
    return pending;
  } catch {
    target.removeItem(PENDING_PAYMENT_KEY);
    return null;
  }
}

function clearPendingPayment(storage) {
  storageOrDefault(storage)?.removeItem(PENDING_PAYMENT_KEY);
}

function savePendingRecharge(record, storage) {
  const target = storageOrDefault(storage);
  if (!target) return null;
  const normalized = {
    provider: String(record?.provider || ""),
    paymentTradeNo: String(record?.paymentTradeNo || ""),
    amount: Number(record?.amount) || 0,
    createdAt: Number(record?.createdAt) || Date.now()
  };
  target.setItem(PENDING_RECHARGE_KEY, JSON.stringify(normalized));
  return normalized;
}

function loadPendingRecharge(paymentTradeNo = "", storage, now = Date.now()) {
  const target = storageOrDefault(storage);
  if (!target) return null;
  try {
    const pending = JSON.parse(target.getItem(PENDING_RECHARGE_KEY) || "null");
    if (!pending || now - Number(pending.createdAt) > PENDING_PAYMENT_TTL_MS) {
      target.removeItem(PENDING_RECHARGE_KEY);
      return null;
    }
    if (
      paymentTradeNo
      && pending.paymentTradeNo
      && String(paymentTradeNo) !== String(pending.paymentTradeNo)
    ) {
      return null;
    }
    return pending;
  } catch {
    target.removeItem(PENDING_RECHARGE_KEY);
    return null;
  }
}

function clearPendingRecharge(storage) {
  storageOrDefault(storage)?.removeItem(PENDING_RECHARGE_KEY);
}

export {
  PENDING_PAYMENT_KEY,
  PENDING_RECHARGE_KEY,
  PENDING_PAYMENT_TTL_MS,
  clearPendingPayment,
  clearPendingRecharge,
  extractPaymentTradeNo,
  loadPendingPayment,
  loadPendingRecharge,
  normalizePaymentAction,
  normalizePaymentPayload,
  normalizePaymentUri,
  openPaymentWindow,
  renderQrCode,
  savePendingPayment,
  savePendingRecharge,
  submitPaymentHtml
};
