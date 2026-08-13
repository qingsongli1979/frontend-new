import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  agencyRegistrationUrl,
  agencyCustomerPath,
  normalizeBillDetailPayload,
  normalizeCustomerPayload,
  normalizeIdentityPayload,
  normalizeAgencyPayload
} from "../console/assets/agency.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

assert.equal(
  agencyCustomerPath({ page: 2, size: 20, mode: "username", query: "agency-user" }),
  "/accsrv/0xagency/agencyuser?page=2&size=20&username=agency-user&phoneNumber="
);
assert.equal(
  agencyCustomerPath({ mode: "phone", query: "13800138000" }),
  "/accsrv/0xagency/agencyuser?page=0&size=1000&username=&phoneNumber=13800138000"
);

const customers = normalizeCustomerPayload({
  data: {
    totalElements: 2,
    totalPages: 1,
    content: [{
      username: "u13800138000",
      recharge: 1200,
      consume: 860.5,
      createAt: "2026-07-01T08:00:00+08:00",
      phoneNumber: "13800138000"
    }]
  }
});
assert.equal(customers.totalElements, 2);
assert.equal(customers.rows[0].username, "u13800138000");
assert.equal(customers.rows[0].recharge, 1200);
assert.equal(customers.rows[0].createAt.includes("2026"), true);

const details = normalizeBillDetailPayload({
  data: [{
    year: 2026,
    month: 7,
    usingStatus: "USING",
    userBillAmount: 89,
    payStatus: "PAID",
    agencyEarnings: 8.9
  }]
});
assert.equal(details[0].period, "2026 年 07 月");
assert.equal(details[0].usingStatus, "正在使用");
assert.equal(details[0].payStatus, "已支付");
assert.equal(details[0].agencyEarnings, 8.9);

const identity = normalizeIdentityPayload({
  data: {
    name: "u13800138000",
    fullName: "测试客户",
    companyName: "数据团队",
    jobTitle: "爬虫工程师",
    email: "dev@example.com",
    phoneNumber: "13800138000"
  }
});
assert.equal(identity.username, "u13800138000");
assert.equal(identity.jobTitle, "爬虫工程师");

const agency = normalizeAgencyPayload({
  data: {
    name: "agency-demo",
    companyName: "数据合作伙伴",
    agencyID: "f5b9e19f-16e2-45d7-9e00-f51095a256d81714636091305"
  }
});
assert.equal(agency.agencyID, "f5b9e19f-16e2-45d7-9e00-f51095a256d81714636091305");
assert.equal(
  agencyRegistrationUrl(agency.agencyID),
  "https://console.123proxy.cn/apiv1/yonghu/register?uuid=f5b9e19f-16e2-45d7-9e00-f51095a256d81714636091305"
);
assert.equal(agencyRegistrationUrl(""), "");

const loginHtml = await readFile(path.join(rootDir, "console", "agency-login.html"), "utf8");
const managerHtml = await readFile(path.join(rootDir, "console", "agency-manager.html"), "utf8");
const agencyCss = await readFile(path.join(rootDir, "console", "assets", "agency.css"), "utf8");
const nginx = await readFile(path.join(rootDir, "deploy", "nginx", "site.conf.template"), "utf8");

assert.equal(loginHtml.includes('data-agency-page="login"'), true);
assert.equal(loginHtml.includes('id="agencyLoginForm"'), true);
assert.equal(loginHtml.includes('assets/auth.css?v=20260813-04'), true);
assert.equal(loginHtml.includes('assets/agency.css?v=20260813-04'), true);
assert.equal(managerHtml.includes('data-agency-page="manager"'), true);
assert.equal(managerHtml.includes('app/console.css?v=20260813-04'), true);
assert.equal(managerHtml.includes('assets/agency.css?v=20260813-04'), true);
assert.match(agencyCss, /\.agency-brand-row \.brand-mark\s*\{[^}]*width:\s*34px;[^}]*flex:\s*0 0 34px;/);
assert.match(agencyCss, /\.agency-brand-word\s*\{[^}]*width:\s*78px;/);
assert.equal(managerHtml.includes('id="agencyCustomerRows"'), true);
assert.equal(managerHtml.includes('id="agencyRegistrationUrl"'), true);
assert.equal(managerHtml.includes('id="agencyCopyRegistrationUrl"'), true);
assert.equal(managerHtml.includes('id="agencyOpenRegistrationUrl"'), true);
assert.equal(managerHtml.includes('id="agencyRegistrationQr"'), true);
assert.equal(managerHtml.includes('id="agencyDownloadRegistrationQr"'), true);
assert.equal(managerHtml.includes('app/vendor/qrcode.min.js?v=1.0.0'), true);
assert.equal(managerHtml.includes("cdn.jsdelivr.net/npm/qrcode"), false);
assert.equal(managerHtml.includes('id="agencyIdentityDialog"'), true);
assert.equal(managerHtml.includes('id="agencyBillDialog"'), true);
assert.equal(nginx.includes("location = /apiv1/managements/login-page"), true);
assert.equal(nginx.includes("agencyconsole/agency-manager"), true);
assert.equal(nginx.includes("try_files /agency-manager.html =404"), true);
assert.equal(nginx.includes("return 302 /register.html$is_args$args"), true);

console.log("Console agency audit passed: referral link and QR code, login, customer search, profile and monthly bill detail");
