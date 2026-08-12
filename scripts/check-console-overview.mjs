import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  maskAccount,
  normalizeOverviewData,
  resolveChargeType
} from "../console/app/overview.js";

const future = new Date(Date.now() + 14 * 86400000).toISOString();
const expired = new Date(Date.now() - 86400000).toISOString();

const data = normalizeOverviewData(
  {
    name: "u13800001234",
    balance: 89,
    parent: ""
  },
  {
    res: {
      avaTrafficInKB: 50000,
      avaZhuzhaiTrafficInKB: 99950000,
      avaFixedIPs: 1,
      avaZhuzhaiFixedIPs: 1
    }
  },
  {
    userOrderList: [
      {
        orderId: "residential-active",
        chargeType: "residentialDynamicIp",
        total: 0,
        traffInGB: 100,
        remainTrafficInGB: 99.95,
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "unlimited-active",
        chargeType: "residentialDynamicIp",
        total: 2,
        traffInGB: 0,
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "static-active",
        chargeType: "fixedIp",
        total: 1,
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "expired-order",
        chargeType: "trafficIp",
        traffInGB: 1,
        remainTrafficInGB: 0,
        expirationTime: expired,
        overTime: true
      }
    ]
  }
);

assert.equal(data.user.balance, 89);
assert.equal(data.user.accountType, "主账户");
assert.equal(data.resources.currentPlans, 3);
assert.equal(data.resources.usablePlans, 3);
assert.equal(data.resources.depletedPlans, 0);
assert.equal(data.resources.usableProductCount, 3);
assert.equal(data.resources.meteredTrafficGb, 100);
assert.equal(data.resources.pendingDatacenter, 1);
assert.equal(data.resources.pendingResidential, 1);
assert.equal(data.totalPackageCount, 4);
assert.equal(data.packages.length, 3);

const residential = data.packages.find((item) => item.id === "residential-active");
const unlimited = data.packages.find((item) => item.id === "unlimited-active");
const staticDatacenter = data.packages.find((item) => item.id === "static-active");

assert.equal(residential.name, "隧道住宅代理");
assert.equal(residential.resource.value, "99.95 GB");
assert.equal(unlimited.name, "不限量动态住宅");
assert.equal(unlimited.resource.value, "2 端口");
assert.equal(staticDatacenter.status, "attention");
assert.equal(staticDatacenter.actionLabel, "提取");
assert.equal(residential.manageable, true);
assert.equal(resolveChargeType({ chargeType: "tunnelIp" }).name, "隧道代理");
assert.equal(maskAccount("u13800001234"), "u1380****1234");

const duplicateTunnelData = normalizeOverviewData({}, {}, {
  userOrderList: [
    {
      orderId: "tunnel-25000-a",
      chargeType: "tunnelIp",
      total: 25000,
      expirationTime: future,
      overTime: false
    },
    {
      orderId: "tunnel-25000-b",
      chargeType: "tunnelIp",
      total: 25000,
      expirationTime: future,
      overTime: false
    }
  ]
});
assert.equal(duplicateTunnelData.packages.length, 2);
assert.deepEqual(
  duplicateTunnelData.packages.map((item) => item.id),
  ["tunnel-25000-a", "tunnel-25000-b"]
);

const liveTrafficData = normalizeOverviewData(
  {},
  {
    res: {
      avaTrafficInKB: -12305,
      avaZhuzhaiTrafficInKB: 99946458
    }
  },
  {
    userOrderList: [
      {
        orderId: "residential-live",
        chargeType: "residentialDynamicIp",
        total: 0,
        traffInGB: 100,
        remainTrafficInGB: 99.95,
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "tunnel-depleted",
        chargeType: "trafficIp",
        total: 0,
        traffInGB: 60,
        remainTrafficInGB: 0,
        expirationTime: future,
        overTime: false
      }
    ]
  },
  {
    res: {
      orders: [
        {
          id: "residential-live",
          remainingTrafficInKB: 99946458
        }
      ]
    }
  }
);
assert.equal(liveTrafficData.resources.currentPlans, 2);
assert.equal(liveTrafficData.resources.usablePlans, 1);
assert.equal(liveTrafficData.resources.depletedPlans, 1);
assert.ok(Math.abs(liveTrafficData.resources.meteredTrafficGb - 99.946458) < 0.000001);
assert.equal(
  liveTrafficData.packages.find((item) => item.id === "residential-live").resource.value,
  "99.95 GB"
);
const depletedTunnel = liveTrafficData.packages.find((item) => item.id === "tunnel-depleted");
assert.equal(depletedTunnel.statusLabel, "已用完");
assert.equal(depletedTunnel.actionLabel, "购买流量");
assert.equal(depletedTunnel.usable, false);

const consoleHtml = await readFile(new URL("../console/app/index.html", import.meta.url), "utf8");
const consoleCss = await readFile(new URL("../console/app/console.css", import.meta.url), "utf8");
const consoleScript = await readFile(new URL("../console/app/console.js", import.meta.url), "utf8");
const overviewScript = await readFile(new URL("../console/app/overview.js", import.meta.url), "utf8");
const resourcesScript = await readFile(new URL("../console/app/resources.js", import.meta.url), "utf8");
assert.match(consoleHtml, /id="userMenuButton"[\s\S]*?aria-haspopup="menu"/);
assert.match(consoleCss, /\.nav-item\.is-product\s*\{[\s\S]*?font-size:\s*13px;/);
assert.match(consoleCss, /\.nav-item\.is-submenu\s*\{[\s\S]*?font-size:\s*13px;/);
assert.equal((consoleHtml.match(/class="nav-item is-submenu"/g) || []).length, 6);
assert.match(consoleHtml, /id="userAccountMenu"[\s\S]*?data-user-menu-logout/);
assert.doesNotMatch(consoleHtml, /aria-label="通知"/);
assert.doesNotMatch(consoleHtml, /class="top-link"/);
assert.match(consoleScript, /function setUserMenuOpen\(open,\s*returnFocus = false\)/);
assert.match(consoleScript, /window\.localStorage\.removeItem\("token_key"\)/);
assert.match(overviewScript, /const packages = data\.packages;/);
assert.match(overviewScript, /data-overview-package-manage/);
assert.match(overviewScript, /window\.ConsoleResources\.managePackage\(packageId\)/);
assert.match(resourcesScript, /managePackage/);
assert.doesNotMatch(overviewScript, /data\.packages\.slice\(0,\s*4\)/);
assert.match(consoleHtml, /<small>可用套餐<\/small>/);
assert.match(consoleHtml, /<small>待提取固定 IP<\/small>/);
assert.match(
  consoleHtml,
  /id="overviewTrialButton"[\s\S]*?href="https:\/\/www\.123proxy\.cn\/contact\.html\?intent=trial#service"/
);

console.log("Console overview audit passed: API normalization, package mapping and account masking");
