import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  agencyCustomerPath,
  normalizeBillDetailPayload,
  normalizeCustomerPayload,
  normalizeIdentityPayload
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

const loginHtml = await readFile(path.join(rootDir, "console", "agency-login.html"), "utf8");
const managerHtml = await readFile(path.join(rootDir, "console", "agency-manager.html"), "utf8");
const nginx = await readFile(path.join(rootDir, "deploy", "nginx", "site.conf.template"), "utf8");

assert.equal(loginHtml.includes('data-agency-page="login"'), true);
assert.equal(loginHtml.includes('id="agencyLoginForm"'), true);
assert.equal(managerHtml.includes('data-agency-page="manager"'), true);
assert.equal(managerHtml.includes('id="agencyCustomerRows"'), true);
assert.equal(managerHtml.includes('id="agencyIdentityDialog"'), true);
assert.equal(managerHtml.includes('id="agencyBillDialog"'), true);
assert.equal(nginx.includes("location = /apiv1/managements/login-page"), true);
assert.equal(nginx.includes("agencyconsole/agency-manager"), true);
assert.equal(nginx.includes("try_files /agency-manager.html =404"), true);

console.log("Console agency audit passed: login, customer search, profile and monthly bill detail");
