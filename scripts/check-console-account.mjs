import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  billingDetailsPath,
  billingOverviewPath,
  normalizeInvoicePayload,
  normalizeOverview,
  normalizeRechargePayload,
  normalizeUsagePayload,
  paymentMethodLabel,
  timezoneOffset,
  trafficToMb
} from "../console/app/account.js";

assert.match(timezoneOffset(new Date()), /^[+-]\d{2}:\d{2}$/);

const detailPath = billingDetailsPath({
  page: 2,
  size: 20,
  dateFrom: "2026-07-20",
  dateTo: "2026-07-27"
});
assert.match(detailPath, /^\/accsrv\/fee\/userbilling\?/);
assert.match(detailPath, /page=2/);
assert.match(detailPath, /size=20/);
assert.match(detailPath, /dateFrom=2026-07-20/);
assert.match(billingOverviewPath("2026-07"), /strDate=2026-7/);

const usage = normalizeUsagePayload({
  data: {
    total: 2,
    billings: {
      totalElements: 21,
      totalPages: 3,
      content: [
        {
          id: "billing-1",
          timestampString: "2026-07-27 23:00:00",
          services: "IP",
          chargeType: 99,
          chargeTypeString: "流量消费",
          amount: 36.5,
          amountUnit: "MB",
          rate: 0,
          total: 0,
          target: "User: proxy_user",
          status: "PAID"
        }
      ]
    }
  }
});
assert.equal(usage.rows.length, 1);
assert.equal(usage.rows[0].target, "proxy_user");
assert.equal(usage.rows[0].unit, "MB");
assert.equal(usage.totalElements, 21);
assert.equal(usage.totalPages, 3);
assert.equal(usage.totalCost, 2);
assert.equal(trafficToMb(1, "GB"), 1024);
assert.equal(trafficToMb(1024, "KB"), 1);

const overview = normalizeOverview([
  {
    period: 1782919846198,
    status: "PAID",
    bill: {
      services: "IP",
      chargeType: 99,
      chargeTypeString: "流量消费",
      amount: 2,
      amountUnit: "GB",
      total: 18,
      prepaid: true
    }
  }
]);
assert.equal(overview[0].type, "流量消费");
assert.equal(overview[0].total, 18);
assert.equal(overview[0].prepaid, true);

const recharge = normalizeRechargePayload({
  totalElements: 11,
  totalPages: 2,
  content: [
    {
      id: "payment-1",
      tradeNo: "trade-1",
      amount: 500,
      paymentMethod: "ALIPAY",
      state: "UNPROCESSED"
    }
  ]
});
assert.equal(recharge.rows[0].paymentMethodLabel, "支付宝");
assert.equal(recharge.rows[0].invoiceState, "UNPROCESSED");
assert.equal(recharge.totalElements, 11);
assert.equal(paymentMethodLabel("WECHAT"), "微信支付");

const invoices = normalizeInvoicePayload([
  { invoiceType: "GENERAL", amount: 500 },
  { invoiceType: "VAT", amount: 1000 }
]);
assert.equal(invoices[0].invoiceTypeLabel, "普通电子发票");
assert.equal(invoices[1].invoiceTypeLabel, "增值税专用发票");

const index = await readFile(new URL("../console/app/index.html", import.meta.url), "utf8");
const consoleCss = await readFile(new URL("../console/app/console.css", import.meta.url), "utf8");
const accountScript = await readFile(new URL("../console/app/account.js", import.meta.url), "utf8");
assert.match(index, /account\.js\?v=/);
assert.match(index, /id="usageWorkspace"/);
assert.doesNotMatch(index, /id="usagePackageRows"/);
assert.match(accountScript, /includeSummary:\s*true,\s*chargeTypes:\s*\[99\]/);
assert.match(accountScript, /chargeType:\s*"99"/);
assert.match(
  consoleCss,
  /\.console-dialog\.account-dialog\s*\{[^}]*width:\s*min\(640px,\s*calc\(100vw - 48px\)\)/s
);
assert.match(
  consoleCss,
  /@media \(max-width:\s*700px\)[\s\S]*?\.console-dialog\.account-dialog,[\s\S]*?width:\s*calc\(100vw - 24px\)/
);
assert.match(
  consoleCss,
  /\.money-input\s*\{[^}]*height:\s*42px;[^}]*grid-template-columns:\s*34px\s+minmax\(0,\s*1fr\)/s
);
assert.match(consoleCss, /\.money-input em\s*\{[^}]*height:\s*100%/s);
assert.match(consoleCss, /\.money-input input\s*\{[^}]*height:\s*100%/s);
assert.match(accountScript, /\/accsrv\/0xalicheckorderstatus\//);
assert.match(accountScript, /handleRechargeReturn/);
assert.match(accountScript, /submitPaymentHtml\(paymentResponse, paymentWindow\)/);
assert.doesNotMatch(accountScript, /paymentWindow\.document\.write\(paymentHtml\)/);
assert.doesNotMatch(accountScript, /\/ip\/clouduserorder\/imply/);

console.log("Console account audit passed: traffic ledger, billing, recharge, invoices and account settings");
