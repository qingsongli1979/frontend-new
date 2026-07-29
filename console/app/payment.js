const PENDING_PAYMENT_KEY = "123proxy_pending_payment";
const PENDING_PAYMENT_TTL_MS = 2 * 60 * 60 * 1000;

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

export {
  PENDING_PAYMENT_KEY,
  PENDING_PAYMENT_TTL_MS,
  clearPendingPayment,
  loadPendingPayment,
  normalizePaymentUri,
  renderQrCode,
  savePendingPayment
};
