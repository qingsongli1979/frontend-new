import assert from "node:assert/strict";
import {
  matchesProduct,
  normalizeProductTraffic,
  packageAvailable,
  packageName
} from "../console/app/products.js";

const payload = {
  orders: [
    {
      id: "tunnel-traffic",
      chargeType: "trafficIp",
      total: 60,
      totalTrafficInGB: 60,
      remainingTrafficInKB: 50500000,
      overTime: false
    },
    {
      id: "tunnel-concurrency",
      chargeType: "tunnelIp",
      total: 25000,
      remainingTrafficInKB: 1000000,
      overTime: false
    },
    {
      id: "residential",
      chargeType: "residentialDynamicIp",
      total: 1,
      totalTrafficInGB: 100,
      remainingTrafficInKB: 99946949,
      overTime: false
    },
    {
      id: "unlimited",
      chargeType: "durationIp",
      total: 2,
      portStart: 36001,
      portEnd: 36002,
      overTime: false
    },
    {
      id: "legacy-unlimited",
      chargeType: "residentialDynamicIp",
      total: 3,
      totalTrafficInGB: 0,
      overTime: false
    },
    {
      id: "static-dc",
      chargeType: "fixedIp",
      total: 4,
      amount: 2,
      overTime: false
    },
    {
      id: "expired",
      chargeType: "residentialStaticIp",
      total: 1,
      overTime: true
    }
  ],
  users: [{ id: 1, username: "masked-in-test" }]
};

const normalized = normalizeProductTraffic(payload, {
  userOrderList: [
    {
      orderId: "static-residential",
      chargeType: "residentialStaticIp",
      total: 1,
      remainAmount: 1,
      expirationTime: new Date(Date.now() + 86400000).toISOString(),
      overTime: false
    }
  ]
});

assert.equal(normalized.orders.length, 7);
assert.equal(normalized.users.length, 1);
assert.equal(matchesProduct(normalized.orders[0], "tunnel"), true);
assert.equal(matchesProduct(normalized.orders[1], "tunnel"), true);
assert.equal(matchesProduct(normalized.orders[2], "residential"), true);
assert.equal(matchesProduct(normalized.orders[2], "unlimited"), false);
assert.equal(matchesProduct(normalized.orders[3], "unlimited"), true);
assert.equal(matchesProduct(normalized.orders[4], "unlimited"), true);
assert.equal(matchesProduct(normalized.orders[5], "staticDatacenter"), true);
assert.equal(normalized.orders.some((order) => matchesProduct(order, "staticResidential")), true);
assert.match(packageName(normalized.orders[0]), /60GB/);
assert.match(packageName(normalized.orders[1]), /25,000/);
assert.match(packageAvailable({
  chargeType: "durationIp",
  total: 3,
  portStart: 36001,
  portEnd: 49999
}), /36001-36003/);
assert.match(packageAvailable(normalized.orders[2]), /99\.95 GB/);
assert.match(packageAvailable(normalized.orders[3]), /36001-36002/);
assert.equal(packageAvailable(normalized.orders[5]), "2 个待提取");

console.log("Console products audit passed: product classification, package labels and resource values");
