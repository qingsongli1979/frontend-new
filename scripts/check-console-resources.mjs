import assert from "node:assert/strict";
import {
  normalizeResourceData,
  packageBindOptions,
  packageActionRequest,
  packageCanRenew,
  packageResource,
  packageStatus,
  resolveProduct
} from "../console/app/resources.js";

const now = new Date("2026-07-27T10:00:00+08:00").getTime();
const future = "2026-08-27 10:00:00";
const past = "2026-06-27 10:00:00";

const data = normalizeResourceData(
  {
    avaTrafficInKB: -12000,
    avaZhuzhaiTrafficInKB: 99950000,
    avaTunnelIPs: 50000,
    amountOfDurationIPs: 2,
    orders: [
      {
        id: "traffic-order",
        orderId: "traffic-order",
        chargeType: "trafficIp",
        totalTrafficInGB: 60,
        remainingTrafficInKB: 50500000,
        expiration: future,
        overTime: false
      }
    ]
  },
  {
    userOrderList: [
      {
        orderId: "traffic-order",
        chargeType: "trafficIp",
        traffInGB: 60,
        remainTrafficInGB: 10,
        createTime: "2026-07-01 10:00:00",
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "thread-order",
        productId: 205,
        chargeType: "tunnelIp",
        total: 50000,
        createTime: "2026-07-02 10:00:00",
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "residential-order",
        chargeType: "residentialDynamicIp",
        traffInGB: 100,
        remainTrafficInGB: 99.95,
        createTime: "2026-07-03 10:00:00",
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "unlimited-order",
        chargeType: "durationIp",
        total: 2,
        createTime: "2026-07-04 10:00:00",
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "static-order",
        productId: 305,
        chargeType: "fixedIp",
        total: 2,
        remainAmount: 1,
        referID: "AI 爬虫任务",
        bindUser: "data_team",
        enabledNotify: true,
        criteriaInGB: 0,
        notifyPhone: "13800138000",
        notifyEmail: "ops@example.com",
        createTime: "2026-07-05 10:00:00",
        expirationTime: future,
        overTime: false
      },
      {
        orderId: "expired-order",
        chargeType: "residentialStaticIp",
        total: 1,
        remainAmount: 0,
        createTime: "2026-05-01 10:00:00",
        expirationTime: past,
        overTime: true
      },
      {
        orderId: "non-proxy-order",
        chargeType: "cloudHost",
        total: 1,
        expirationTime: future,
        overTime: false
      }
    ]
  },
  [
    {
      id: 1,
      username: "proxy_test_1",
      password: "fixture-secret",
      limitInGB: 0,
      usedInKB: 1500000
    },
    {
      id: 2,
      username: "proxy_test_2",
      password: "fixture-secret-2",
      limitInGB: 10,
      usedInKB: 1000000
    }
  ],
  now
);

assert.equal(data.packages.length, 6);
assert.equal(data.users.length, 2);
assert.deepEqual(
  packageBindOptions(data.users, "proxy_test_2").map(({ value, disabled }) => ({ value, disabled })),
  [
    { value: "", disabled: false },
    { value: "proxy_test_1", disabled: false },
    { value: "proxy_test_2", disabled: false }
  ]
);
assert.deepEqual(
  packageBindOptions(data.users, "deleted_proxy_user").at(-1),
  {
    value: "deleted_proxy_user",
    label: "当前绑定：deleted_proxy_user（该用户已不存在）",
    disabled: true
  }
);
assert.equal(data.resources.meteredTrafficGb, 99.95);
assert.equal(data.resources.concurrency, 50000);
assert.equal(data.resources.unlimitedPorts, 2);
assert.equal(data.resources.userTrafficGb, 2.5);

const traffic = data.packages.find((item) => item.id === "traffic-order");
const thread = data.packages.find((item) => item.id === "thread-order");
const residential = data.packages.find((item) => item.id === "residential-order");
const unlimited = data.packages.find((item) => item.id === "unlimited-order");
const staticOrder = data.packages.find((item) => item.id === "static-order");
const expired = data.packages.find((item) => item.id === "expired-order");

assert.equal(traffic.available, "50.5 GB");
assert.match(traffic.usage, /9\.5 \/ 60 GB/);
assert.equal(residential.productName, "隧道住宅代理");
assert.equal(unlimited.productName, "不限量动态住宅");
assert.equal(staticOrder.status, "attention");
assert.equal(staticOrder.statusLabel, "待提取");
assert.equal(staticOrder.remark, "AI 爬虫任务");
assert.equal(staticOrder.bindUser, "data_team");
assert.equal(staticOrder.enabledNotify, true);
assert.equal(expired.status, "expired");
assert.equal(resolveProduct({ chargeType: "tunnelIp" }).name, "隧道代理");
assert.equal(resolveProduct({ chargeType: "residentialDynamicIp", traffInGB: 20 }).key, "residential");
assert.equal(resolveProduct({ chargeType: "residentialDynamicIp", traffInGB: 0 }).key, "unlimited");
assert.equal(packageCanRenew(thread, now), true);
assert.equal(packageCanRenew(traffic, now), false);
assert.equal(packageCanRenew(residential, now), false);
assert.equal(packageCanRenew(unlimited, now), true);
assert.equal(packageCanRenew(staticOrder, now), true);
assert.equal(packageCanRenew(expired, now), false);

assert.deepEqual(packageActionRequest("renew", thread), {
  path: "/ip/order1/create",
  method: "POST",
  body: {
    renew: true,
    period: 1,
    unit: "month",
    orderid: "thread-order",
    productId: 205
  }
});
assert.deepEqual(packageActionRequest("remark", staticOrder, { value: "生产爬虫" }), {
  path: "/ip/modifyorder",
  method: "PUT",
  body: { orderId: "static-order", referID: "生产爬虫" }
});
assert.deepEqual(packageActionRequest("bind", staticOrder, { value: "crawler_team" }), {
  path: "/ip/bindorder",
  method: "PUT",
  body: { orderId: "static-order", bindUser: "crawler_team" }
});
assert.deepEqual(
  packageActionRequest("notify", staticOrder, {
    enabledNotify: true,
    criteriaInGB: 2.5,
    notifyPhone: "13800138000",
    notifyEmail: "ops@example.com"
  }),
  {
    path: "/ip/notifyorder",
    method: "PUT",
    body: {
      orderId: "static-order",
      enabledNotify: true,
      criteriaInGB: 2.5,
      notifyPhone: "13800138000",
      notifyEmail: "ops@example.com"
    }
  }
);

const exhausted = {
  chargeType: "trafficIp",
  traffInGB: 10,
  remainTrafficInGB: -5,
  expirationTime: future,
  overTime: false
};
assert.equal(packageResource(exhausted).available, "0 GB");
assert.equal(packageStatus(exhausted, packageResource(exhausted), now).label, "已用完");

console.log("Console resources audit passed: package history, real usage and proxy-user limits");
