import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(rootDir, file), "utf8");

const [trackerSource, registerPage, consolePage, contactPage, authSource, commerceSource, accountSource] = await Promise.all([
  read("assets/google-ads.js"),
  read("console/register.html"),
  read("console/app/index.html"),
  read("contact.html"),
  read("console/assets/auth.js"),
  read("console/app/commerce.js"),
  read("console/app/account.js")
]);

for (const [name, html] of [["register", registerPage], ["console app", consolePage]]) {
  assert.match(html, /AW-11399174770/, `${name}: Google Ads destination is missing`);
  assert.match(html, /\/assets\/google-ads\.js/, `${name}: conversion tracker is missing`);
}
assert.match(consolePage, /"purchase":"SuudCJ3Tyv4YEPK0xrsq"/, "existing 123Proxy purchase conversion label is missing");

assert.match(contactPage, /data-google-ads-conversion="consultation"/, "contact: consultation channel is not tracked");
assert.match(contactPage, /data-google-ads-conversion="trial"/, "contact: trial channel is not tracked");
assert.match(contactPage, /data-google-ads-requires-intent="trial"/, "contact: generic service traffic could be counted as a trial");
assert.match(authSource, /ProxyGoogleAds\?\.registration/, "registration success is not tracked");
assert.match(commerceSource, /ProxyGoogleAds\?\.purchase/, "purchase success is not tracked");
assert.match(accountSource, /ProxyGoogleAds\?\.recharge/, "recharge success is not tracked");

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
}

const document = {
  readyState: "complete",
  addEventListener() {}
};
const window = {
  ProxyGoogleAdsConfig: {
    adsId: "AW-11399174770",
    labels: { registration: "registration_test", purchase: "purchase_test" }
  },
  dataLayer: [],
  localStorage: memoryStorage(),
  sessionStorage: memoryStorage(),
  location: { href: "https://console.123proxy.cn/register.html" },
  document
};
vm.runInNewContext(trackerSource, { window, Object, Number, String, URL });

window.ProxyGoogleAds.registration({ method: "phone", dedupe_key: "13800000000" });
window.ProxyGoogleAds.registration({ method: "phone", dedupe_key: "13800000000" });
window.ProxyGoogleAds.purchase({ transaction_id: "ORDER-1", value: 45, currency: "CNY" });
window.ProxyGoogleAds.purchase({ transaction_id: "ORDER-1", value: 45, currency: "CNY" });

const calls = window.dataLayer.map((entry) => Array.from(entry));
assert.equal(calls.filter((entry) => entry[1] === "sign_up").length, 1, "registration event must be deduplicated");
assert.equal(calls.filter((entry) => entry[1] === "purchase").length, 1, "purchase event must be deduplicated");
assert.equal(calls.filter((entry) => entry[1] === "conversion").length, 2, "configured Google Ads conversions were not sent");
assert.equal(calls.find((entry) => entry[1] === "purchase")?.[2]?.transaction_id, "ORDER-1", "purchase transaction ID is missing");
assert.equal(calls.find((entry) => entry[1] === "purchase")?.[2]?.value, 45, "purchase value is missing");

console.log("Google Ads conversion checks passed");
