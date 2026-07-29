import assert from "node:assert/strict";
import {
  API_CODE_TABS,
  ASSIGNED_PROXY_TABS,
  CONNECTION_CODE_TABS,
  PROXY_OUTPUT_FORMATS,
  STATIC_DATACENTER_CODES,
  STATIC_RESIDENTIAL_CODES,
  buildApiSnippets,
  buildAssignedStaticOutput,
  buildConnectionOutput,
  buildDynamicRouting,
  buildStaticExtractionSnippets,
  buildUnlimitedConnectionOutput,
  buildProxySnippets,
  formatProxyCredential,
  matchesProduct,
  normalizeWhitelist,
  normalizeTrafficData,
  orderWhitelist,
  residentialConnectionGuide,
  retrieveApiUrl,
  unlimitedConnectionGuide,
  unlimitedPortRange,
  validWhitelist,
  whitelistRequestParameters,
  whitelistTextareaValue,
  whitelistUpdatePath
} from "../console/app/extractor.js";

assert.equal(STATIC_DATACENTER_CODES.includes("CN"), false);
assert.equal(STATIC_DATACENTER_CODES.includes("US"), true);
assert.equal(STATIC_RESIDENTIAL_CODES.includes("HN"), true);
assert.equal(STATIC_RESIDENTIAL_CODES.includes("CN"), false);

assert.equal(matchesProduct({ chargeType: "trafficIp" }, "tunnel"), true);
assert.equal(matchesProduct({ chargeType: "tunnelIp" }, "tunnel"), true);
assert.equal(
  matchesProduct({ chargeType: "residentialDynamicIp", totalTrafficInGB: 50 }, "residential"),
  true
);
assert.equal(
  matchesProduct({ chargeType: "residentialDynamicIp", totalTrafficInGB: 0 }, "unlimited"),
  true
);
assert.equal(matchesProduct({ chargeType: "durationIp" }, "unlimited"), true);
assert.equal(matchesProduct({ chargeType: "fixedIp" }, "staticDatacenter"), true);
assert.equal(matchesProduct({ chargeType: "residentialStaticIp" }, "staticResidential"), true);

const normalized = normalizeTrafficData({
  orders: [
    { id: "traffic", chargeType: "trafficIp" },
    { id: "residential", chargeType: "residentialDynamicIp", totalTrafficInGB: 10 }
  ],
  users: [{ id: 1, username: "proxy_user" }]
}, "tunnel");
assert.deepEqual(normalized.orders.map((item) => item.id), ["traffic"]);
assert.equal(normalized.users.length, 1);

assert.equal(validWhitelist("203.0.113.10,198.51.100.4"), true);
assert.equal(validWhitelist("203.0.113.10\n198.51.100.4"), true);
assert.equal(validWhitelist("203.0.113.999"), false);
assert.equal(validWhitelist("203.0.113.10，198.51.100.4"), false);
assert.equal(
  normalizeWhitelist(" 203.0.113.10 \n\n198.51.100.4\n203.0.113.10 "),
  "203.0.113.10,198.51.100.4"
);
assert.equal(
  whitelistTextareaValue("203.0.113.10,198.51.100.4"),
  "203.0.113.10\n198.51.100.4"
);
assert.equal(orderWhitelist({ ipwhitelist: "203.0.113.10" }), "203.0.113.10");
assert.equal(orderWhitelist({ ipWhitelist: "198.51.100.4" }), "198.51.100.4");

const residentialSettings = {
  auth: "whitelist",
  user: { username: "must-not-leak" },
  region: "us",
  session: true,
  sessionId: "crawler00001",
  sessionMinutes: 15,
  pool: "",
  protocol: "http",
  whitelist: "203.0.113.10",
  count: 1,
  order: { id: "res-order", total: 1 }
};
const residentialRouting = buildDynamicRouting(residentialSettings, "residential");
assert.equal(residentialRouting.username, "sess_crawler00001_15+us");
assert.equal(residentialRouting.username.includes("must-not-leak"), false);
assert.equal(residentialRouting.cap, residentialRouting.username);
const residentialWhitelistPath = whitelistUpdatePath(
  residentialSettings,
  residentialRouting,
  "residential"
);
assert.match(residentialWhitelistPath, /^\/ip\/whitelist\/res-order\?/);
const residentialWhitelistParams = new URL(
  `https://example.test${residentialWhitelistPath}`
).searchParams;
assert.equal(residentialWhitelistParams.get("userip"), "203.0.113.10");
assert.equal(residentialWhitelistParams.get("updateip"), "false");
assert.equal(residentialWhitelistParams.get("ttl"), "-1");
assert.equal(residentialWhitelistParams.get("cap"), "sess_crawler00001_15+us");
assert.equal(residentialWhitelistParams.get("tag"), "zz-all");

const tunnelRouting = buildDynamicRouting({
  ...residentialSettings,
  auth: "user",
  user: { username: "proxy_user" },
  region: "la-all",
  session: true,
  sessionId: "crawler00001",
  sessionMinutes: 15,
  endpointMode: "2",
  outputFormat: "3",
  pool: "residential"
}, "tunnel");
assert.equal(tunnelRouting.username, "proxy_user-sess_crawler00001_15");
assert.equal(tunnelRouting.cap, "");
assert.equal(tunnelRouting.updateIp, true);
assert.equal(tunnelRouting.mode, "2");
assert.equal(tunnelRouting.ttl, 15);

const tunnelWhitelistSettings = {
  ...residentialSettings,
  auth: "whitelist",
  order: { id: "tunnel-whitelist-order" },
  region: "la-all",
  session: true,
  endpointMode: "2",
  pool: "residential",
  protocol: "socks"
};
const tunnelWhitelistRouting = buildDynamicRouting(tunnelWhitelistSettings, "tunnel");
assert.equal(tunnelWhitelistRouting.username, "");
assert.equal(tunnelWhitelistRouting.ttl, 0);
assert.equal(tunnelWhitelistRouting.updateIp, true);
const tunnelWhitelistParams = whitelistRequestParameters(
  tunnelWhitelistSettings,
  tunnelWhitelistRouting,
  "tunnel"
);
assert.deepEqual(tunnelWhitelistParams, {
  userip: "203.0.113.10",
  protocol: "socks",
  needpwd: "false",
  updateip: "true",
  ttl: "0",
  cap: "",
  tag: "la-all",
  mode: "2"
});

globalThis.window = {
  __CONSOLE_CONFIG__: { apiBase: "https://console.example" },
  location: { origin: "https://console.example" }
};
const residentialUserSettings = {
  ...residentialSettings,
  auth: "user",
  user: { username: "proxy_user", password: "secret" },
  outputFormat: "1",
  productKey: "residential"
};
const residentialUserRouting = buildDynamicRouting(residentialUserSettings, "residential");
assert.equal(residentialUserRouting.username, "proxy_user-sess_crawler00001_15+us");
const residentialApiUrl = retrieveApiUrl(
  residentialUserSettings,
  residentialUserRouting,
  "residential"
);
const residentialApiParams = new URL(residentialApiUrl).searchParams;
assert.equal(residentialApiParams.get("region"), "us");
assert.equal(residentialApiParams.get("loginuser"), "proxy_user-sess_crawler00001_15+us");

const tunnelApiUrl = retrieveApiUrl({
  ...residentialSettings,
  auth: "user",
  user: { username: "proxy_user" },
  order: { id: "tunnel-order", total: 25000 },
  region: "la-all",
  outputFormat: "3",
  count: 25
}, tunnelRouting, "tunnel");
const tunnelApiParams = new URL(tunnelApiUrl).searchParams;
assert.equal(tunnelApiParams.get("txt_type"), "3");
assert.equal(tunnelApiParams.get("mode"), "2");
assert.equal(tunnelApiParams.get("pool"), "la-all");
assert.equal(tunnelApiParams.get("loginuser"), "proxy_user-sess_crawler00001_15");
delete globalThis.window;

const unlimitedRouting = buildDynamicRouting({
  ...residentialSettings,
  auth: "user",
  user: { username: "proxy_user" },
  region: "US",
  rotationMinutes: 10,
  session: false,
  endpointMode: "1"
}, "unlimited");
assert.equal(unlimitedRouting.username, "proxy_user");
assert.match(unlimitedRouting.cap, /^sess_[a-z0-9]{12}_10\+US$/);
assert.equal(unlimitedRouting.tag, "zz-unlimit");
assert.equal(unlimitedRouting.mode, "1");

const unlimitedWhitelistSettings = {
  ...residentialSettings,
  auth: "whitelist",
  order: { id: "unlimited-whitelist-order", total: 3 },
  region: "US",
  rotationMinutes: 10,
  session: false,
  endpointMode: "2"
};
const unlimitedWhitelistRouting = buildDynamicRouting(unlimitedWhitelistSettings, "unlimited");
const unlimitedWhitelistParams = whitelistRequestParameters(
  unlimitedWhitelistSettings,
  unlimitedWhitelistRouting,
  "unlimited"
);
assert.equal(unlimitedWhitelistParams.userip, "203.0.113.10");
assert.equal(unlimitedWhitelistParams.updateip, "false");
assert.equal(unlimitedWhitelistParams.ttl, "-1");
assert.match(unlimitedWhitelistParams.cap, /^sess_[a-z0-9]{12}_10\+US$/);
assert.equal(unlimitedWhitelistParams.tag, "zz-unlimit");
assert.equal(unlimitedWhitelistParams.mode, "2");

const accountAuthParams = whitelistRequestParameters(
  {
    ...unlimitedWhitelistSettings,
    auth: "user",
    whitelist: "must-be-cleared"
  },
  unlimitedWhitelistRouting,
  "unlimited"
);
assert.equal(accountAuthParams.userip, "");
assert.equal(accountAuthParams.ttl, "0");

assert.deepEqual(
  unlimitedPortRange({ total: 3, portStart: 36001, portEnd: 49999 }, { port: 9000 }),
  { count: 3, start: 36001, end: 36003 }
);

const unlimitedSettings = {
  auth: "user",
  protocol: "http",
  user: { username: "port_user", password: "port_secret" },
  outputFormat: "3",
  order: {
    id: "unlimited-order",
    total: 3,
    portStart: 36001,
    portEnd: 49999
  },
  region: "US",
  rotationMinutes: 10,
  productKey: "unlimited"
};
const unlimitedOutput = buildUnlimitedConnectionOutput(
  unlimitedSettings,
  { ...unlimitedRouting, username: "port_user" },
  { host: "gateway.example", port: 9000 },
  "https://console.example/ip/retreveip/unlimited-order"
);
assert.equal(unlimitedOutput.endpoint, "gateway.example:36001-36003");
assert.equal(unlimitedOutput.firstEndpoint, "gateway.example:36001");
assert.equal(unlimitedOutput.portStart, 36001);
assert.equal(unlimitedOutput.portEnd, 36003);
assert.equal(unlimitedOutput.portCount, 3);
assert.equal(unlimitedOutput.regionName, "美国");
assert.equal(unlimitedOutput.sessionSummary, "10 分钟固定轮转");
assert.equal(
  unlimitedOutput.firstCredential,
  "port_user:port_secret:gateway.example:36001"
);
assert.deepEqual(
  unlimitedOutput.credential.split("\n"),
  [
    "port_user:port_secret:gateway.example:36001",
    "port_user:port_secret:gateway.example:36002",
    "port_user:port_secret:gateway.example:36003"
  ]
);
assert.match(unlimitedOutput.connection, /代理端口范围: 36001-36003/);
assert.match(unlimitedOutput.connection, /出口轮转周期: 10 分钟/);
assert.match(unlimitedOutput.curl, /首个端口 36001/);
assert.doesNotMatch(unlimitedOutput.connection, /9000/);
const unlimitedGuide = unlimitedConnectionGuide(unlimitedOutput);
assert.match(unlimitedGuide, /从 36001 开始连续输出 3 个端口/);
assert.match(unlimitedGuide, /无需在认证用户名中设置 SESSION/);

const output = buildConnectionOutput(
  {
    auth: "user",
    protocol: "http",
    user: { password: "secret" },
    outputFormat: "3",
    session: true,
    sessionId: "crawler00001",
    sessionMinutes: 15
  },
  { username: "proxy_user-sess_crawler00001_15", mode: "2" },
  { host: "gateway.example", port: 9000 },
  "https://console.example/ip/retreveip/order"
);
assert.equal(output.endpoint, "gateway.example:9000");
assert.equal(output.endpointMode, "IP");
assert.equal(output.credential, "proxy_user-sess_crawler00001_15:secret:gateway.example:9000");
assert.match(output.curl, /proxy_user-sess_crawler00001_15:secret@gateway\.example:9000/);
assert.deepEqual(
  CONNECTION_CODE_TABS.map(([key]) => key),
  ["connection", "curl", "python", "nodejs", "go", "java", "php", "apiUrl"]
);
assert.deepEqual(
  API_CODE_TABS.map(([key]) => key),
  ["apiUrl", "curl", "python", "nodejs", "go", "java", "php"]
);
assert.deepEqual(
  ASSIGNED_PROXY_TABS.map(([key]) => key),
  ["connection", "curl", "python", "nodejs", "go", "java", "php"]
);

const languageKeys = ["curl", "python", "nodejs", "go", "java", "php"];
for (const key of languageKeys) {
  assert.equal(typeof output[key], "string");
  assert.ok(output[key].length > 80, `${key} proxy snippet should be complete`);
}
assert.match(output.python, /ThreadPoolExecutor/);
assert.match(output.nodejs, /HttpsProxyAgent/);
assert.match(output.nodejs, /require\("got"\)/);
assert.match(output.go, /http\.ProxyURL/);
assert.match(output.java, /Proxy\.Type\.HTTP/);
assert.match(output.php, /CURLPROXY_HTTP/);

const residentialOutput = buildConnectionOutput(
  residentialUserSettings,
  residentialUserRouting,
  { host: "residential.123proxy.cn", port: 33000 },
  "https://console.example/ip/retreveip/res-order"
);
assert.equal(residentialOutput.region, "us");
assert.equal(residentialOutput.regionName, "美国");
assert.equal(residentialOutput.geoSuffix, "+us");
assert.equal(residentialOutput.sessionSuffix, "-sess_crawler00001_15");
assert.equal(residentialOutput.username, "proxy_user-sess_crawler00001_15+us");
const residentialGuide = residentialConnectionGuide(residentialOutput);
assert.match(residentialGuide, /美国 · \+us/);
assert.match(residentialGuide, /国家码必须放在认证用户名最后/);
assert.match(residentialGuide, /crawler00001 · 15 分钟/);
assert.match(residentialGuide, /约 3-15 分钟/);
assert.match(residentialGuide, /proxy_user-sess_crawler00001_15\+us/);

const socksOutput = buildConnectionOutput(
  { auth: "whitelist", protocol: "socks", user: null, outputFormat: "4", session: false },
  { username: "", mode: "1" },
  { host: "socks.example", port: 1080 },
  "https://console.example/ip/retreveip/socks-order"
);
assert.equal(socksOutput.proxyUrl, "socks5h://socks.example:1080");
assert.equal(socksOutput.credential, "socks.example:1080");
assert.match(socksOutput.python, /requests\[socks\]/);
assert.match(socksOutput.nodejs, /SocksProxyAgent/);
assert.match(socksOutput.go, /golang\.org\/x\/net\/proxy/);
assert.match(socksOutput.java, /Proxy\.Type\.SOCKS/);
assert.match(socksOutput.php, /CURLPROXY_SOCKS5_HOSTNAME/);

const directSnippets = buildProxySnippets({
  host: "gateway.example",
  port: 9000,
  endpoint: "gateway.example:9000",
  username: "engineer",
  password: "p@ss word",
  proxyUrl: "http://engineer:p%40ss%20word@gateway.example:9000",
  protocol: "http"
});
assert.match(directSnippets.curl, /p%40ss%20word/);
assert.match(directSnippets.java, /p@ss word/);

assert.deepEqual(
  PROXY_OUTPUT_FORMATS.map(({ value }) => value),
  ["1", "3", "4", "2"]
);
assert.equal(
  formatProxyCredential(
    { host: "gateway.example", port: 9000, username: "user", password: "pass" },
    "1"
  ),
  "gateway.example:9000:user:pass"
);
assert.equal(
  formatProxyCredential(
    { host: "gateway.example", port: 9000, username: "user", password: "pass" },
    "3"
  ),
  "user:pass:gateway.example:9000"
);
assert.equal(
  formatProxyCredential(
    { host: "gateway.example", port: 9000, username: "user", password: "pass" },
    "4"
  ),
  "user:pass@gateway.example:9000"
);

const apiSnippets = buildApiSnippets("https://console.example/ip/retreveip/order?count=10");
for (const key of ["apiUrl", ...languageKeys]) {
  assert.equal(typeof apiSnippets[key], "string");
  assert.ok(apiSnippets[key].length > 20, `${key} API snippet should be complete`);
}
assert.match(apiSnippets.nodejs, /Node\.js 18\+/);
assert.match(apiSnippets.go, /client\.Get/);
assert.match(apiSnippets.java, /HttpClient/);
assert.match(apiSnippets.php, /curl_init/);
assert.doesNotThrow(() => new Function(apiSnippets.nodejs));
assert.doesNotThrow(() => new Function(directSnippets.nodejs));

const staticExtractUrl =
  "https://console.example/ip/retreveip/static-order?protocol=proxy&region=US&usepwd=true&count=2&format=text&userip=";
const staticExtraction = buildStaticExtractionSnippets(staticExtractUrl, "proxy");
assert.equal(staticExtraction.apiUrl, staticExtractUrl);
assert.equal(staticExtraction.responseFormat, "HOST:PORT:USER:PASSWORD");
assert.match(staticExtraction.curl, /不是代理地址/);
assert.match(staticExtraction.curl, /--max-time 330/);
assert.match(staticExtraction.python, /requests\.get\(extract_url, timeout=330\)/);
assert.match(staticExtraction.python, /line\.split\(":", 3\)/);
assert.match(staticExtraction.nodejs, /AbortSignal\.timeout\(330_000\)/);
assert.match(staticExtraction.nodejs, /passwordParts\.join\(":"\)/);
assert.match(staticExtraction.go, /strings\.SplitN\(line, ":", 4\)/);
assert.match(staticExtraction.java, /Duration\.ofSeconds\(330\)/);
assert.match(staticExtraction.php, /CURLOPT_TIMEOUT => 330/);
assert.doesNotMatch(staticExtraction.python, /proxies\s*=\s*\{\s*"http":\s*extract_url/);
assert.doesNotThrow(() => new Function(staticExtraction.nodejs));

const assignedStaticOutput = buildAssignedStaticOutput({
  orderId: "assigned-order",
  proxyIp: "198.51.100.25",
  port: 1080,
  username: "fixed_user",
  password: "fixed_secret"
}, "socks");
assert.equal(assignedStaticOutput.endpoint, "198.51.100.25:1080");
assert.equal(
  assignedStaticOutput.credential,
  "198.51.100.25:1080:fixed_user:fixed_secret"
);
assert.equal(
  assignedStaticOutput.proxyUrl,
  "socks5h://fixed_user:fixed_secret@198.51.100.25:1080"
);
assert.match(assignedStaticOutput.connection, /认证方式: 代理账密/);
assert.doesNotMatch(assignedStaticOutput.connection, /白名单/);
assert.equal("whitelist" in assignedStaticOutput, false);
assert.match(assignedStaticOutput.python, /requests\[socks\]/);
assert.match(assignedStaticOutput.nodejs, /SocksProxyAgent/);
assert.match(assignedStaticOutput.go, /golang\.org\/x\/net\/proxy/);
assert.match(assignedStaticOutput.java, /Proxy\.Type\.SOCKS/);
assert.match(assignedStaticOutput.php, /CURLPROXY_SOCKS5_HOSTNAME/);

console.log("Console extractor audit passed: package routing, dynamic whitelist and six-language code examples");
