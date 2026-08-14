import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PRODUCTS,
  calculatePrice,
  extractPaymentTradeNo,
  offerIsVisible,
  offerLabel,
  orderSpecification,
  productNameForOrder
} from "../console/app/commerce.js";
import {
  PENDING_PAYMENT_KEY,
  PENDING_RECHARGE_KEY,
  clearPendingRecharge,
  extractPaymentTradeNo as extractSharedPaymentTradeNo,
  loadPendingPayment,
  loadPendingRecharge,
  normalizePaymentAction,
  normalizePaymentPayload,
  normalizePaymentUri,
  savePendingPayment,
  savePendingRecharge
} from "../console/app/payment.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

assert.deepEqual(
  Object.keys(PRODUCTS),
  ["tunnel", "residential", "unlimited", "staticDatacenter", "staticResidential"]
);
assert.equal(PRODUCTS.tunnel.types.length, 2);
assert.equal(PRODUCTS.residential.types[0].key, "residentialDynamicIp");
assert.equal(PRODUCTS.unlimited.types[0].key, "durationIp");
assert.equal(PRODUCTS.staticDatacenter.trial, "");
assert.equal(PRODUCTS.staticResidential.trial, "");
assert.equal(offerIsVisible({ forAccountIds: "" }, "u100"), true);
assert.equal(offerIsVisible({ forAccountIds: "u100,u200" }, "u100"), true);
assert.equal(offerIsVisible({ forAccountIds: "u100,u200" }, "u300"), false);
assert.deepEqual(
  [
    { id: "public", forAccountIds: "" },
    { id: "private-match", forAccountIds: "u100,u200" },
    { id: "private-other", forAccountIds: "u300" }
  ].filter((offer) => offerIsVisible(offer, "u100")).map((offer) => offer.id),
  ["public", "private-match"]
);

assert.deepEqual(
  calculatePrice({ price: 100, discount: 0.8 }, "3m"),
  { base: 270, total: 216, discount: 0.8, monthly: 72 }
);
assert.deepEqual(
  calculatePrice({ price: 300, discount: 0.9 }, "d"),
  { base: 15, total: 14, discount: 0.9, monthly: 420 }
);
assert.deepEqual(
  calculatePrice({ price: 300, discount: 0.9 }, "w"),
  { base: 94, total: 84, discount: 0.9, monthly: 336 }
);
assert.deepEqual(
  calculatePrice({ price: 480, discount: 0.9 }, "3m"),
  { base: 1296, total: 1166, discount: 0.9, monthly: 1166 / 3 }
);
assert.equal(offerLabel({ chargeType: "tunnelIp", amount: 25 }), "25 并发线程");
assert.equal(offerLabel({ chargeType: "trafficIp", trafficInGB: 100 }), "100GB 流量");
assert.equal(offerLabel({ chargeType: "durationIp", amount: 5 }), "5 个端口");
assert.equal(offerLabel({ chargeType: "fixedIp", amount: 10 }), "10 个 IP");

assert.equal(productNameForOrder({ chargeType: 14 }), "隧道代理 · 按并发线程");
assert.equal(
  orderSpecification({ chargeType: 14, details: { amount: 50 } }),
  "50 并发线程，不限累计流量"
);
assert.equal(
  productNameForOrder({ chargeType: 70, details: { trafficInGB: 20 } }),
  "隧道住宅代理"
);
assert.equal(
  productNameForOrder({ chargeType: 70, details: { trafficInGB: 0 } }),
  "不限量动态住宅"
);

assert.equal(
  extractPaymentTradeNo('<a href="/return?alipayreturn=PAY-123&x=1">pay</a>'),
  "PAY-123"
);
assert.equal(
  extractSharedPaymentTradeNo('<a href="/return?alipayreturn=RECHARGE-123&x=1">pay</a>'),
  "RECHARGE-123"
);
assert.equal(normalizePaymentUri("weixin://wxpay/bizpayurl?pr=test"), "weixin://wxpay/bizpayurl?pr=test");
assert.throws(() => normalizePaymentUri("javascript:alert(1)"), /无效/);
assert.equal(normalizePaymentAction("https://openapi.alipay.com/gateway.do"), "https://openapi.alipay.com/gateway.do");
assert.throws(() => normalizePaymentAction(""), /无效/);
assert.throws(() => normalizePaymentAction("javascript:alert(1)"), /无效/);
assert.equal(
  normalizePaymentPayload({ data: { paymentHtml: '<form action="https://openapi.alipay.com/gateway.do"></form>' } }),
  '<form action="https://openapi.alipay.com/gateway.do"></form>'
);
assert.equal(normalizePaymentPayload({ result: { payUrl: "https://openapi.alipay.com/gateway.do" } }), "https://openapi.alipay.com/gateway.do");

const paymentStorage = new Map();
const storage = {
  getItem: (key) => paymentStorage.get(key) || null,
  setItem: (key, value) => paymentStorage.set(key, value),
  removeItem: (key) => paymentStorage.delete(key)
};
savePendingPayment({
  provider: "alipay",
  orderTradeNo: "ORDER-123",
  paymentTradeNo: "PAY-123",
  createdAt: 1000
}, storage);
assert.equal(JSON.parse(storage.getItem(PENDING_PAYMENT_KEY)).orderTradeNo, "ORDER-123");
assert.equal(loadPendingPayment("PAY-123", storage, 2000).provider, "alipay");
assert.equal(loadPendingPayment("PAY-OTHER", storage, 2000), null);
savePendingRecharge({
  provider: "alipay",
  paymentTradeNo: "RECHARGE-123",
  amount: 100,
  createdAt: 1000
}, storage);
assert.equal(JSON.parse(storage.getItem(PENDING_RECHARGE_KEY)).amount, 100);
assert.equal(loadPendingRecharge("RECHARGE-123", storage, 2000).provider, "alipay");
assert.equal(loadPendingRecharge("RECHARGE-OTHER", storage, 2000), null);
clearPendingRecharge(storage);
assert.equal(storage.getItem(PENDING_RECHARGE_KEY), null);

const consoleHtml = await readFile(path.join(rootDir, "console", "app", "index.html"), "utf8");
const consoleCss = await readFile(path.join(rootDir, "console", "app", "console.css"), "utf8");
const pricingScript = await readFile(path.join(rootDir, "assets", "pricing.js"), "utf8");
for (const required of ["commerce.js", "extractor.js", "#purchase?product=tunnel"]) {
  assert.equal(consoleHtml.includes(required), true, `console app is missing ${required}`);
}
assert.equal(consoleHtml.includes("vendor/qrcode.min.js?v=1.0.0"), true);
assert.equal(consoleHtml.includes("cdn.jsdelivr.net/npm/qrcode"), false);
assert.equal(pricingScript.includes('const CONSOLE_ORIGIN = "https://console.123proxy.cn"'), true);
assert.equal(pricingScript.includes('const PRICE_API = "/ip/default/offers"'), true);
assert.equal(pricingScript.includes('mode: "same-origin"'), true);
assert.equal(pricingScript.includes("https://console.123proxy.cn/ip/default/offers"), false);
assert.equal(pricingScript.includes("/console/app/"), true);
assert.equal(pricingScript.includes("/console/app/index.html"), false);
assert.equal(pricingScript.includes("consolePurchaseUrl(consoleProduct)"), true);
assert.equal(pricingScript.includes('TRIAL_CONTACT_URL = isEnglish ? "../contact.html#service" : "contact.html#service"'), true);
assert.equal(pricingScript.includes("els.purchase.href = isTrial ? TRIAL_CONTACT_URL : consolePurchaseUrl(consoleProduct)"), true);
assert.equal(pricingScript.includes("price-dynamic.html"), false);
assert.match(
  pricingScript,
  /\.filter\(\(item\) => !String\(item\.forAccountIds \|\| ""\)\.trim\(\)\)/
);
assert.match(
  pricingScript,
  /Number\(item\.discount\) > 0\.1 && Number\(item\.discount\) < 1/
);
const commerceScript = await readFile(path.join(rootDir, "console", "app", "commerce.js"), "utf8");
const consoleScript = await readFile(path.join(rootDir, "console", "app", "console.js"), "utf8");
const productsScript = await readFile(path.join(rootDir, "console", "app", "products.js"), "utf8");
assert.equal(consoleHtml.includes("mailto:sales@123proxy.cn"), false);
assert.equal(consoleHtml.includes("https://www.123proxy.cn/contact.html#solutions"), true);
assert.equal(commerceScript.includes("mailto:sales@123proxy.cn"), false);
assert.equal(commerceScript.includes("https://www.123proxy.cn/contact.html#service"), true);
assert.equal(commerceScript.includes("data-open-trial"), false);
assert.equal(commerceScript.includes("trialRequestDialog"), false);
assert.equal(commerceScript.includes("handlePaymentReturn"), true);
assert.match(commerceScript, /paymentReturnKey:\s*""/);
assert.match(commerceScript, /state\.paymentReturnKey === returnKey && state\.paymentReturnPromise/);
assert.match(commerceScript, /FULFILLING:\s*\["套餐开通中",\s*"is-waiting"\]/);
assert.match(consoleScript, /function routeModuleOnce\(moduleKey, handler\)/);
assert.match(consoleScript, /routeModuleOnce\("commerce:payment-return"/);
assert.match(consoleScript, /if \(hash !== lastRoutedHash\)/);
assert.match(commerceScript, /submitPaymentHtml\(html, paymentWindow\)/);
assert.doesNotMatch(commerceScript, /popup\.document\.write\(String\(html\)\)/);
assert.equal(productsScript.includes('const TRIAL_CONTACT_URL = "https://www.123proxy.cn/contact.html?intent=trial#service"'), true);
assert.match(productsScript, /"申请测试",\s*TRIAL_CONTACT_URL/);
assert.equal(commerceScript.includes("isTrialOffer"), false);
assert.match(
  commerceScript,
  /productId:\s*offer\.id,\s*period:\s*1,\s*ttl:\s*10,\s*unit:\s*state\.period/s
);
assert.match(
  consoleCss,
  /\.console-dialog\.commerce-dialog\s*\{[^}]*width:\s*min\(620px,\s*calc\(100vw - 48px\)\)/s
);
assert.match(
  consoleCss,
  /\.console-dialog\s*>\s*\.dialog-card\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*0;[^}]*max-width:\s*100%/s
);

console.log("Console commerce audit passed: five products, live-price math, order mapping and internal purchase routes");
