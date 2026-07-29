import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lastModifiedForRoute, productSeoFacts, siteUrl } from "./seo-entities.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const routePairs = [
  ["/", "/en/"],
  ["/high-bandwidth-proxy.html", "/en/high-bandwidth-proxy.html"],
  ["/scraping-rotating-proxy.html", "/en/scraping-rotating-proxy.html"],
  ["/residential-proxy.html", "/en/residential-proxy.html"],
  ["/unlimited-residential-proxy.html", "/en/unlimited-residential-proxy.html"],
  ["/static-datacenter-proxy.html", "/en/static-datacenter-proxy.html"],
  ["/static-residential-proxy.html", "/en/static-residential-proxy.html"],
  ["/ai-data.html", "/en/ai-data.html"],
  ["/ai-video-proxy.html", "/en/ai-video-proxy.html"],
  ["/ai-image-proxy.html", "/en/ai-image-proxy.html"],
  ["/ai-github-proxy.html", "/en/ai-github-proxy.html"],
  ["/ai-text-proxy.html", "/en/ai-text-proxy.html"],
  ["/ai-youtube-api.html", "/en/ai-youtube-api.html"],
  ["/enterprise.html", "/en/enterprise.html"],
  ["/custom-proxy-pool.html", "/en/custom-proxy-pool.html"],
  ["/data-scraping-service.html", "/en/data-scraping-service.html"],
  ["/global-network.html", "/en/global-network.html"],
  ["/pricing.html", "/en/pricing.html"]
];

const developerRoutes = [
  "/developers/",
  "/developers/getting-started/",
  "/developers/products/scraping-rotating-proxy/",
  "/developers/products/residential-rotating-proxy/",
  "/developers/products/unlimited-residential-proxy/",
  "/developers/products/static-datacenter-proxy/",
  "/developers/products/static-residential-proxy/",
  "/developers/guides/concurrency-qps-performance/",
  "/developers/guides/session-geo-rotation/",
  "/developers/guides/proxy-errors-retries/",
  "/developers/guides/proxy-product-selection/",
  "/developers/examples/",
  "/developers/examples/python-requests-proxy/",
  "/developers/examples/scrapy-proxy/",
  "/developers/examples/playwright-proxy/",
  "/developers/examples/selenium-proxy/",
  "/developers/examples/puppeteer-proxy/",
  "/developers/examples/nodejs-axios-proxy/",
  "/developers/examples/go-colly-proxy/",
  "/developers/examples/java-jsoup-proxy/",
  "/developers/examples/php-curl-proxy/"
];

const developerGuideFacts = new Map([
  ["/developers/products/scraping-rotating-proxy/", productSeoFacts.tunnel],
  ["/developers/products/residential-rotating-proxy/", productSeoFacts.residential],
  ["/developers/products/unlimited-residential-proxy/", productSeoFacts.unlimitedResidential],
  ["/developers/products/static-datacenter-proxy/", productSeoFacts.staticDatacenter],
  ["/developers/products/static-residential-proxy/", productSeoFacts.staticResidential]
]);

const developerEngineeringGuideFacts = new Map([
  ["/developers/guides/concurrency-qps-performance/", [productSeoFacts.tunnel, productSeoFacts.residential, productSeoFacts.unlimitedResidential, productSeoFacts.highBandwidth]],
  ["/developers/guides/session-geo-rotation/", [productSeoFacts.tunnel, productSeoFacts.residential, productSeoFacts.unlimitedResidential, productSeoFacts.staticDatacenter, productSeoFacts.staticResidential]],
  ["/developers/guides/proxy-errors-retries/", [productSeoFacts.tunnel, productSeoFacts.residential, productSeoFacts.unlimitedResidential, productSeoFacts.staticDatacenter, productSeoFacts.staticResidential]],
  ["/developers/guides/proxy-product-selection/", Object.values(productSeoFacts)]
]);

const developerExampleFacts = new Map([
  ["/developers/examples/python-requests-proxy/", productSeoFacts.tunnel],
  ["/developers/examples/scrapy-proxy/", productSeoFacts.tunnel],
  ["/developers/examples/playwright-proxy/", productSeoFacts.tunnel],
  ["/developers/examples/selenium-proxy/", productSeoFacts.unlimitedResidential],
  ["/developers/examples/puppeteer-proxy/", productSeoFacts.tunnel],
  ["/developers/examples/nodejs-axios-proxy/", productSeoFacts.residential],
  ["/developers/examples/go-colly-proxy/", productSeoFacts.tunnel],
  ["/developers/examples/java-jsoup-proxy/", productSeoFacts.tunnel],
  ["/developers/examples/php-curl-proxy/", productSeoFacts.tunnel]
]);

const developerExampleRoutes = new Set(developerExampleFacts.keys());

function fileFromRoute(route) {
  if (route === "/") return "index.html";
  if (route === "/en/") return path.join("en", "index.html");
  if (route.endsWith("/")) return path.join(...route.slice(1, -1).split("/"), "index.html");
  return route.slice(1).split("/").join(path.sep);
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function count(html, expression) {
  return [...html.matchAll(expression)].length;
}

const structuredProductRoutes = new Map(
  Object.values(productSeoFacts).flatMap((fact) => [
    [fact.path, fact],
    [`/en${fact.path}`, fact]
  ])
);

async function checkPage(route, locale, zhRoute, enRoute) {
  const file = fileFromRoute(route);
  const html = await readFile(path.join(rootDir, file), "utf8");
  const canonical = `${siteUrl}${route}`;
  const zhCanonical = `${siteUrl}${zhRoute}`;
  const enCanonical = `${siteUrl}${enRoute}`;
  const faviconPath = locale === "en" ? "../assets/favicon.svg" : "assets/favicon.svg";

  expect(html.includes(`<html lang="${locale}">`), `${file}: incorrect html lang`);
  expect(html.includes("<h1"), `${file}: missing static H1`);
  expect(!html.includes('<div id="app"></div>'), `${file}: contains an empty client-rendered app`);
  expect(!html.includes("gw.123proxy.cn"), `${file}: obsolete high-bandwidth gateway detected`);
  expect(html.includes('href="/status/"'), `${file}: missing service status link`);
  expect(html.includes(`<link rel="icon" type="image/svg+xml" href="${faviconPath}">`), `${file}: missing favicon`);
  if (locale === "zh-CN") {
    expect(!html.includes('class="utility-link language-link"'), `${file}: English header entry should remain hidden`);
    expect(html.includes('href="/developers/#guides"'), `${file}: missing engineering guide mega-menu entry`);
    expect(html.includes("9 个完整代码案例"), `${file}: missing current developer example count`);
    expect(!html.includes('href="/developers/getting-started/#troubleshooting"'), `${file}: obsolete developer troubleshooting menu entry`);
  }
  expect(!html.includes("mailto:sales@123proxy.cn"), `${file}: direct sales email link bypasses contact routing`);
  expect(count(html, /rel="canonical"/g) === 1, `${file}: expected one canonical`);
  expect(html.includes(`<link rel="canonical" href="${canonical}">`), `${file}: incorrect canonical`);
  expect(html.includes(`<link rel="alternate" hreflang="zh-CN" href="${zhCanonical}">`), `${file}: missing zh-CN alternate`);
  expect(html.includes(`<link rel="alternate" hreflang="en" href="${enCanonical}">`), `${file}: missing en alternate`);
  expect(html.includes(`<link rel="alternate" hreflang="x-default" href="${zhCanonical}">`), `${file}: incorrect x-default`);

  const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(schemaMatch, `${file}: missing JSON-LD`);
  const schema = JSON.parse(schemaMatch[1]);
  const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [];
  const organization = graph.find((item) => item["@type"] === "Organization");
  expect(organization?.description?.includes("爬虫工程师"), `${file}: Organization schema missing brand description`);
  expect(Array.isArray(organization?.contactPoint) && organization.contactPoint.length >= 2, `${file}: Organization schema missing contact routing`);
  expect(organization?.knowsAbout?.includes("AI 数据采集"), `${file}: Organization schema missing GEO topics`);
  const productFact = structuredProductRoutes.get(route);
  if (productFact) {
    const service = graph.find((item) => item["@type"] === "Service");
    expect(service?.serviceType === productFact.serviceType, `${file}: Service schema has incorrect serviceType`);
    expect(service?.category === productFact.category, `${file}: Service schema has incorrect category`);
    expect(service?.audience?.audienceType === productFact.audience, `${file}: Service schema missing audience`);
    for (const [name, value] of productFact.properties) {
      expect(
        service?.additionalProperty?.some((item) => item.name === name && item.value === value),
        `${file}: Service schema missing ${name}`
      );
    }
  }
}

for (const [zhRoute, enRoute] of routePairs) {
  await checkPage(zhRoute, "zh-CN", zhRoute, enRoute);
  await checkPage(enRoute, "en", zhRoute, enRoute);
}

for (const route of developerRoutes) {
  const file = fileFromRoute(route);
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(html.includes('<html lang="zh-CN">'), `${file}: incorrect html lang`);
  expect(html.includes("<h1"), `${file}: missing static H1`);
  expect(html.includes('<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">'), `${file}: missing favicon`);
  expect(html.includes('<meta name="robots" content="index,follow,max-image-preview:large">'), `${file}: missing index policy`);
  expect(html.includes(`<link rel="canonical" href="${siteUrl}${route}">`), `${file}: incorrect canonical`);
  expect(!html.includes('hreflang="en"'), `${file}: unpublished English documentation must not be advertised`);
  expect(html.includes('id="developerSearchIndex"'), `${file}: missing static search index`);
  expect(html.includes('/assets/developer-docs.css'), `${file}: missing documentation stylesheet`);
  expect(html.includes('/assets/developer-docs.js'), `${file}: missing documentation script`);
  expect(html.includes('href="/status/"'), `${file}: missing service status link`);
  expect(!html.includes("mailto:sales@123proxy.cn"), `${file}: direct technical-support email link detected`);
  const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(schemaMatch, `${file}: missing JSON-LD`);
  const schema = JSON.parse(schemaMatch[1]);
  const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [];
  const organization = graph.find((item) => item["@type"] === "Organization");
  const document = graph.find((item) => ["CollectionPage", "HowTo", "TechArticle"].includes(item["@type"]));
  expect(organization?.description?.includes("爬虫工程师"), `${file}: incomplete Organization entity`);
  expect(Array.isArray(organization?.contactPoint) && organization.contactPoint.length >= 2, `${file}: missing contact routing entity`);
  expect(document?.dateModified === lastModifiedForRoute(route), `${file}: incorrect document dateModified`);
  expect(!JSON.stringify(schema).includes('"@type":"SearchAction"'), `${file}: unsupported documentation SearchAction detected`);

  if (route === "/developers/" || route === "/developers/examples/") {
    expect(document?.["@type"] === "CollectionPage", `${file}: documentation hub must be a CollectionPage`);
  } else if (route === "/developers/getting-started/") {
    expect(document?.["@type"] === "HowTo", `${file}: quick start must be a HowTo`);
    expect(document?.isPartOf?.["@id"] === `${siteUrl}/developers/#document`, `${file}: quick start missing collection relationship`);
  } else {
    expect(document?.["@type"] === "TechArticle", `${file}: guide must be a TechArticle`);
    expect(document?.isPartOf?.["@id"] === `${siteUrl}/developers/#document`, `${file}: article missing collection relationship`);
  }

  const guideFact = developerGuideFacts.get(route);
  if (guideFact) {
    expect(
      document?.about?.["@id"] === `${siteUrl}${guideFact.path}#service`,
      `${file}: guide missing product service relationship`
    );
    expect(
      graph.some((item) => item["@type"] === "Service" && item["@id"] === `${siteUrl}${guideFact.path}#service`),
      `${file}: guide missing related Service entity`
    );
  }

  if (developerExampleRoutes.has(route)) {
    const exampleFact = developerExampleFacts.get(route);
    expect(document?.hasPart?.["@type"] === "SoftwareSourceCode", `${file}: missing SoftwareSourceCode`);
    expect(document?.hasPart?.url === `${siteUrl}${route}#code`, `${file}: source code missing visible code anchor`);
    expect(document?.hasPart?.isPartOf?.["@id"] === `${siteUrl}${route}#document`, `${file}: source code missing article relationship`);
    expect(
      document?.about?.some((item) => item["@id"] === `${siteUrl}${exampleFact.path}#service`),
      `${file}: example missing ${exampleFact.name} service relationship`
    );
    expect(graph.some((item) => item["@type"] === "FAQPage"), `${file}: example missing FAQPage`);
  }

  const engineeringFacts = developerEngineeringGuideFacts.get(route);
  if (engineeringFacts) {
    expect(Array.isArray(document?.about), `${file}: engineering guide about must be an array`);
    for (const fact of engineeringFacts) {
      expect(
        document.about.some((item) => item["@id"] === `${siteUrl}${fact.path}#service`),
        `${file}: engineering guide missing ${fact.name} relationship`
      );
    }
    expect(graph.some((item) => item["@type"] === "FAQPage"), `${file}: engineering guide missing FAQPage`);
  }
}

const statusFile = fileFromRoute("/status/");
const statusPage = await readFile(path.join(rootDir, statusFile), "utf8");
expect(statusPage.includes('<html lang="zh-CN">'), `${statusFile}: incorrect html lang`);
expect(statusPage.includes("<h1>服务状态</h1>"), `${statusFile}: missing service status H1`);
expect(statusPage.includes(`<link rel="canonical" href="${siteUrl}/status/">`), `${statusFile}: incorrect canonical`);
expect(statusPage.includes('/assets/status-page.css'), `${statusFile}: missing status stylesheet`);
expect(statusPage.includes('/assets/status-page.js'), `${statusFile}: missing status script`);
expect(statusPage.includes('endpoint: "/status-api/v1/summary"'), `${statusFile}: missing live status endpoint`);
expect(statusPage.includes('href="/developers/#guides"'), `${statusFile}: missing engineering guide mega-menu entry`);
expect(statusPage.includes("9 个完整代码案例"), `${statusFile}: missing current developer example count`);
expect(!statusPage.includes('href="/developers/getting-started/#troubleshooting"'), `${statusFile}: obsolete developer troubleshooting menu entry`);
for (const component of [
  "proxy-tunnel",
  "proxy-residential",
  "proxy-unlimited",
  "gateway-us",
  "gateway-eu",
  "gateway-asia",
  "website",
  "console",
  "api"
]) {
  expect(statusPage.includes(`data-status-component="${component}"`), `${statusFile}: missing ${component}`);
}
const statusSchemaMatch = statusPage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
expect(statusSchemaMatch, `${statusFile}: missing JSON-LD`);
JSON.parse(statusSchemaMatch[1]);
expect(!statusPage.includes("mailto:sales@123proxy.cn"), `${statusFile}: direct sales email link bypasses contact routing`);

const contactFile = fileFromRoute("/contact.html");
const contactPage = await readFile(path.join(rootDir, contactFile), "utf8");
expect(contactPage.includes('<html lang="zh-CN">'), `${contactFile}: incorrect html lang`);
expect(contactPage.includes('id="solutions"'), `${contactFile}: missing technical and enterprise section`);
expect(contactPage.includes('id="service"'), `${contactFile}: missing customer service section`);
expect(contactPage.includes('id="email"'), `${contactFile}: missing formal email section`);
expect(contactPage.includes("assets/contact-solutions-wechat.png"), `${contactFile}: missing solutions WeChat QR`);
expect(contactPage.includes("assets/contact-service-wecom.png"), `${contactFile}: missing customer service WeCom QR`);
expect(count(contactPage, /mailto:sales@123proxy\.cn/g) === 1, `${contactFile}: email must appear only in the formal correspondence section`);
expect(contactPage.includes(`<link rel="canonical" href="${siteUrl}/contact.html">`), `${contactFile}: incorrect canonical`);
expect(contactPage.includes('href="/developers/#guides"'), `${contactFile}: missing engineering guide mega-menu entry`);
expect(contactPage.includes("9 个完整代码案例"), `${contactFile}: missing current developer example count`);
expect(!contactPage.includes('href="/developers/getting-started/#troubleshooting"'), `${contactFile}: obsolete developer troubleshooting menu entry`);
const contactSchemaMatch = contactPage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
expect(contactSchemaMatch, `${contactFile}: missing JSON-LD`);
JSON.parse(contactSchemaMatch[1]);

const developerHome = await readFile(path.join(rootDir, fileFromRoute("/developers/")), "utf8");
expect(developerHome.includes("从一条 cURL 开始"), "developers/index.html: missing developer-first promise");
expect(developerHome.includes("按代理产品查看接入方式"), "developers/index.html: missing product access section");

const quickStart = await readFile(path.join(rootDir, fileFromRoute("/developers/getting-started/")), "utf8");
for (const language of ["cURL", "Python", "Node.js", "Go", "Java", "PHP", "Scrapy", "Playwright"]) {
  expect(quickStart.includes(`>${language}<`), `developers/getting-started/index.html: missing ${language} example`);
}
expect(quickStart.includes("静态类代理不支持白名单"), "developers/getting-started/index.html: incorrect static whitelist boundary");
expect(quickStart.includes("proxy.123proxy.cn:36923"), "developers/getting-started/index.html: missing tunnel gateway");
expect(!quickStart.includes("YOUR_PROXY_HOST"), "developers/getting-started/index.html: fake proxy host detected");
expect(!quickStart.includes("YOUR_PROXY_PORT"), "developers/getting-started/index.html: fake proxy port detected");
expect(!quickStart.includes('os.environ[&quot;PROXY_HOST&quot;]'), "developers/getting-started/index.html: host must not come from an environment placeholder");

const tunnelGuide = await readFile(path.join(rootDir, fileFromRoute("/developers/products/scraping-rotating-proxy/")), "utf8");
for (const fact of [
  "约 95% 住宅 + 约 5% 数据中心",
  "默认全球随机",
  "按流量或并发线程使用",
  "SESSION 只支持账密认证",
  "支持 1-120 分钟",
  "HOST:PORT:USER:PASSWORD",
  "USER:PASSWORD@HOST:PORT",
  "proxy.123proxy.cn",
  "36923"
]) {
  expect(tunnelGuide.includes(fact), `developers/products/scraping-rotating-proxy/index.html: missing ${fact}`);
}

const residentialGuide = await readFile(path.join(rootDir, fileFromRoute("/developers/products/residential-rotating-proxy/")), "utf8");
for (const fact of [
  "8000 万+住宅 IP",
  "190+国家和地区",
  "仅按流量",
  "proxy-user-sess_a8F3kP9xQ2mL_15+us",
  "国家码必须为小写",
  "约 3–15 分钟同步",
  "1–120 分钟",
  "residential.123proxy.cn",
  "33000"
]) {
  expect(residentialGuide.includes(fact), `developers/products/residential-rotating-proxy/index.html: missing ${fact}`);
}

const unlimitedGuide = await readFile(path.join(rootDir, fileFromRoute("/developers/products/unlimited-residential-proxy/")), "utf8");
for (const fact of [
  "每端口不限流量与并发",
  "每端口不限制并发线程",
  "unlimit.residential.123proxy.cn",
  "10253",
  "3–30 分钟",
  "不能为单个端口分别设置",
  "不需要在用户名中设置 SESSION",
  "固定网关与套餐端口资源分开理解"
]) {
  expect(unlimitedGuide.includes(fact), `developers/products/unlimited-residential-proxy/index.html: missing ${fact}`);
}

for (const route of [
  "/developers/products/static-datacenter-proxy/",
  "/developers/products/static-residential-proxy/"
]) {
  const guide = await readFile(path.join(rootDir, fileFromRoute(route)), "utf8");
  for (const fact of [
    "分配链接不是代理地址",
    "只有调用后返回的固定代理信息才能用于代理请求",
    "调用会消耗套餐可提数量",
    "每行一个固定代理",
    "静态代理只支持账密认证",
    "不支持：123Proxy 套餐 IP 白名单认证",
    "无 SESSION / 不轮转"
  ]) {
    expect(guide.includes(fact), `${fileFromRoute(route)}: missing ${fact}`);
  }
  for (const language of ["cURL", "Python", "Node.js", "Go", "Java", "PHP"]) {
    expect(guide.includes(`>${language}<`), `${fileFromRoute(route)}: missing ${language} example`);
  }
}

const staticDatacenterGuide = await readFile(path.join(rootDir, fileFromRoute("/developers/products/static-datacenter-proxy/")), "utf8");
expect(staticDatacenterGuide.includes("不支持中国地区 IP"), "static datacenter guide: missing China inventory boundary");
expect(staticDatacenterGuide.includes("将固定代理出口 IP 加到合作方 API"), "static datacenter guide: missing target allowlist distinction");

const engineeringGuideExpectations = [
  ["/developers/guides/concurrency-qps-performance/", ["并发、QPS 与响应时间", "平均在途请求数 ÷ 平均端到端响应时间", "一个浏览器页面不是一个代理请求", "Little"]],
  ["/developers/guides/session-geo-rotation/", ["购买决定容量，提取决定路由", "SESSION 是一段有期限的粘性路由", "连接池会影响你观察到的换 IP 行为"]],
  ["/developers/guides/proxy-errors-retries/", ["DNS", "TCP", "TLS", "407", "Retry-After", "只重试可恢复且幂等的请求"]],
  ["/developers/guides/proxy-product-selection/", ["先回答六个工程问题", "六类代理能力对比", "浏览器任务同时考虑流量与子请求"]]
];

for (const [route, facts] of engineeringGuideExpectations) {
  const file = fileFromRoute(route);
  const guide = await readFile(path.join(rootDir, file), "utf8");
  for (const fact of facts) {
    expect(guide.includes(fact), `${file}: missing ${fact}`);
  }
}

const examplesHub = await readFile(path.join(rootDir, fileFromRoute("/developers/examples/")), "utf8");
for (const fact of [
  "proxy.123proxy.cn",
  "residential.123proxy.cn",
  "unlimit.residential.123proxy.cn",
  "36923",
  "33000",
  "10253",
  "控制台分配的固定代理IP",
  "httpbin.org/ip",
  "quotes.toscrape.com",
  "books.toscrape.com"
]) {
  expect(examplesHub.includes(fact), `developers/examples/index.html: missing ${fact}`);
}
for (const framework of ["Requests + BeautifulSoup", "Scrapy", "Playwright", "Selenium 4", "Puppeteer", "Axios + Cheerio", "Colly", "Jsoup", "cURL + DOMXPath"]) {
  expect(examplesHub.includes(framework), `developers/examples/index.html: missing ${framework}`);
}

const exampleExpectations = [
  ["/developers/examples/python-requests-proxy/", "Requests + BeautifulSoup", "quotes.jsonl", "session.get", "proxy.123proxy.cn", "36923"],
  ["/developers/examples/scrapy-proxy/", "Scrapy", "books.jsonl", "CrawlerProcess", "proxy.123proxy.cn", "36923"],
  ["/developers/examples/playwright-proxy/", "Playwright", "quotes-playwright.json", "async_playwright", "proxy.123proxy.cn", "36923"],
  ["/developers/examples/selenium-proxy/", "Selenium 4 + Chromium", "quotes-selenium.json", "chrome.webRequest.onAuthRequired", "unlimit.residential.123proxy.cn", "10253"],
  ["/developers/examples/puppeteer-proxy/", "Puppeteer", "quotes-puppeteer.json", "puppeteer.launch", "proxy.123proxy.cn", "36923"],
  ["/developers/examples/nodejs-axios-proxy/", "Axios + Cheerio", "quotes-axios.jsonl", "axios.create", "residential.123proxy.cn", "33000"],
  ["/developers/examples/go-colly-proxy/", "Colly", "quotes-colly.csv", "RoundRobinProxySwitcher", "proxy.123proxy.cn", "36923"],
  ["/developers/examples/java-jsoup-proxy/", "Jsoup", "books-jsoup.csv", "context.isProxy", "proxy.123proxy.cn", "36923"],
  ["/developers/examples/php-curl-proxy/", "cURL + DOMXPath", "quotes-php.json", "CURLOPT_PROXYUSERPWD", "proxy.123proxy.cn", "36923"]
];

for (const [route, framework, output, codeFact, gateway, port] of exampleExpectations) {
  const file = fileFromRoute(route);
  const guide = await readFile(path.join(rootDir, file), "utf8");
  for (const fact of [
    framework,
    output,
    codeFact,
    gateway,
    port,
    "PROXY_USER",
    "PROXY_PASS",
    "完整代理用户名",
    "结构化",
    '"@type":"SoftwareSourceCode"',
    '"codeSampleType":"完整可运行示例"'
  ]) {
    expect(guide.includes(fact), `${file}: missing ${fact}`);
  }
  expect(!guide.includes("tunnel.123proxy.cn"), `${file}: obsolete tunnel gateway detected`);
  expect(!guide.includes("unlimited.123proxy.cn"), `${file}: obsolete unlimited gateway detected`);
  expect(!guide.includes("all.gateway.123proxy.cn"), `${file}: obsolete generic gateway detected`);
  expect(!guide.includes("all.zhuzhai.123proxy.cn"), `${file}: obsolete residential gateway detected`);
  expect(!guide.includes("YOUR_PROXY_HOST"), `${file}: fake proxy host detected`);
  expect(!guide.includes("YOUR_PROXY_PORT"), `${file}: fake proxy port detected`);
  expect(!guide.includes('os.environ[&quot;PROXY_HOST&quot;]'), `${file}: proxy host must be fixed`);
  expect(!guide.includes("process.env.PROXY_HOST"), `${file}: proxy host must be fixed`);
}

for (const file of ["scraping-rotating-proxy.html", "unlimited-residential-proxy.html"]) {
  const productPage = await readFile(path.join(rootDir, file), "utf8");
  expect(!productPage.includes("tunnel.123proxy.cn"), `${file}: obsolete tunnel gateway detected`);
  expect(!productPage.includes("unlimited.123proxy.cn"), `${file}: obsolete unlimited gateway detected`);
}

const productDetailSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
for (const endpoint of [
  'endpoint: "proxy.123proxy.cn:36923"',
  'endpoint: "residential.123proxy.cn:33000"',
  'endpoint: "unlimit.residential.123proxy.cn:10253"'
]) {
  expect(productDetailSource.includes(endpoint), `assets/product-detail.js: missing ${endpoint}`);
}

const developerSource = [
  await readFile(path.join(rootDir, "scripts", "developer-content.mjs"), "utf8"),
  await readFile(path.join(rootDir, "scripts", "developer-examples.mjs"), "utf8"),
  await readFile(path.join(rootDir, "scripts", "developer-guides.mjs"), "utf8")
].join("\n");
for (const obsolete of [
  "all.gateway.123proxy.cn",
  "all.zhuzhai.123proxy.cn",
  "tunnel.123proxy.cn",
  "unlimited.123proxy.cn",
  "YOUR_PROXY_HOST",
  "YOUR_PROXY_PORT"
]) {
  expect(!developerSource.includes(obsolete), `developer source: obsolete placeholder or gateway detected: ${obsolete}`);
}

const pricingSource = await readFile(path.join(rootDir, "assets", "pricing.js"), "utf8");
expect(pricingSource.includes('const PRICE_API = "/ip/default/offers"'), "assets/pricing.js: price API must use the website same-origin proxy");
expect(pricingSource.includes('mode: "same-origin"'), "assets/pricing.js: live pricing request must remain same-origin");
expect(!pricingSource.includes("https://console.123proxy.cn/ip/default/offers"), "assets/pricing.js: cross-origin price API detected");
for (const guideHref of [
  "/developers/products/scraping-rotating-proxy/",
  "/developers/products/residential-rotating-proxy/",
  "/developers/products/unlimited-residential-proxy/",
  "/developers/products/static-datacenter-proxy/",
  "/developers/products/static-residential-proxy/"
]) {
  expect(pricingSource.includes(`guide: "${guideHref}"`), `assets/pricing.js: missing ${guideHref}`);
}

const productLinkClosure = [
  ["/developers/products/scraping-rotating-proxy/", "/pricing.html?product=tunnel", "/developers/examples/python-requests-proxy/", "#extract?product=tunnel"],
  ["/developers/products/residential-rotating-proxy/", "/pricing.html?product=residential", "/developers/examples/nodejs-axios-proxy/", "#extract?product=residential"],
  ["/developers/products/unlimited-residential-proxy/", "/pricing.html?product=unlimited", "/developers/examples/selenium-proxy/", "#extract?product=unlimited"],
  ["/developers/products/static-datacenter-proxy/", "/pricing.html?product=static-datacenter", "/developers/examples/python-requests-proxy/", "#extract?product=staticDatacenter"],
  ["/developers/products/static-residential-proxy/", "/pricing.html?product=static-residential", "/developers/examples/python-requests-proxy/", "#extract?product=staticResidential"]
];

for (const [route, priceHref, exampleHref, consoleHref] of productLinkClosure) {
  const file = fileFromRoute(route);
  const guide = await readFile(path.join(rootDir, file), "utf8");
  for (const href of [priceHref, exampleHref, consoleHref]) {
    expect(guide.includes(href), `${file}: missing internal link ${href}`);
  }
}

const sitemap = await readFile(path.join(rootDir, "sitemap.xml"), "utf8");
expect(count(sitemap, /<loc>/g) === routePairs.length * 2 + developerRoutes.length + 2, "sitemap.xml: incorrect URL count");
for (const [zhRoute, enRoute] of routePairs) {
  expect(sitemap.includes(`<loc>${siteUrl}${zhRoute}</loc>`), `sitemap.xml: missing ${zhRoute}`);
  expect(sitemap.includes(`<loc>${siteUrl}${enRoute}</loc>`), `sitemap.xml: missing ${enRoute}`);
  expect(sitemap.includes(`<loc>${siteUrl}${zhRoute}</loc>\n    <lastmod>${lastModifiedForRoute(zhRoute)}</lastmod>`), `sitemap.xml: incorrect lastmod for ${zhRoute}`);
  expect(sitemap.includes(`<loc>${siteUrl}${enRoute}</loc>\n    <lastmod>${lastModifiedForRoute(enRoute)}</lastmod>`), `sitemap.xml: incorrect lastmod for ${enRoute}`);
}
for (const route of developerRoutes) {
  expect(sitemap.includes(`<loc>${siteUrl}${route}</loc>`), `sitemap.xml: missing ${route}`);
  expect(sitemap.includes(`<loc>${siteUrl}${route}</loc>\n    <lastmod>${lastModifiedForRoute(route)}</lastmod>`), `sitemap.xml: incorrect lastmod for ${route}`);
}
expect(sitemap.includes(`<loc>${siteUrl}/status/</loc>`), "sitemap.xml: missing /status/");
expect(sitemap.includes(`<loc>${siteUrl}/contact.html</loc>`), "sitemap.xml: missing /contact.html");
expect(sitemap.includes(`<loc>${siteUrl}/status/</loc>\n    <lastmod>${lastModifiedForRoute("/status/")}</lastmod>`), "sitemap.xml: incorrect lastmod for /status/");
expect(sitemap.includes(`<loc>${siteUrl}/contact.html</loc>\n    <lastmod>${lastModifiedForRoute("/contact.html")}</lastmod>`), "sitemap.xml: incorrect lastmod for /contact.html");
expect(!sitemap.includes("/en/developers/"), "sitemap.xml: unpublished English documentation detected");

const robots = await readFile(path.join(rootDir, "robots.txt"), "utf8");
expect(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots.txt: missing sitemap URL");
expect(robots.includes("User-agent: OAI-SearchBot"), "robots.txt: missing OAI-SearchBot policy");
expect(robots.includes("User-agent: ChatGPT-User"), "robots.txt: missing ChatGPT-User policy");
expect(robots.includes("Allow: /"), "robots.txt: missing allow rule");

const comparisonPage = await readFile(path.join(rootDir, "index-lite.html"), "utf8");
expect(comparisonPage.includes('<body class="home-lite">'), "index-lite.html: missing comparison variant class");
expect(comparisonPage.includes('<meta name="robots" content="noindex,nofollow">'), "index-lite.html: comparison page must remain noindex");
expect(comparisonPage.includes(`<link rel="canonical" href="${siteUrl}/">`), "index-lite.html: canonical must point to the production homepage");
expect(comparisonPage.includes('<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">'), "index-lite.html: missing favicon");
expect(comparisonPage.includes("<h1"), "index-lite.html: missing static H1");
expect(!sitemap.includes("/index-lite.html"), "sitemap.xml: comparison page must not be published");
expect(!comparisonPage.includes("/document/docs/"), "index-lite.html: obsolete documentation links detected");

const homepage = await readFile(path.join(rootDir, "index.html"), "utf8");
expect(!homepage.includes("Direct answer"), "index.html: exposed GEO answer label detected");
expect(homepage.includes('href="/developers/"'), "index.html: missing developer center entry");
expect(homepage.includes('href="/developers/examples/"'), "index.html: missing current code example entry");
expect(!homepage.includes("/developers/getting-started/#code-examples"), "index.html: obsolete code example anchor detected");
expect(!homepage.includes("/document/docs/"), "index.html: obsolete documentation links detected");
expect(homepage.includes('class="home-lite home-refined site-refined"'), "index.html: refined production homepage class missing");

const visualRefinement = await readFile(path.join(rootDir, "assets", "visual-refinement.css"), "utf8");
expect(
  visualRefinement.includes("body.site-refined[data-product] .metric-strip"),
  "visual-refinement.css: missing calm product-detail visual layer"
);
expect(
  visualRefinement.includes("body.site-refined[data-solution] .solution-hero"),
  "visual-refinement.css: missing AI data-task visual layer"
);

const refinedProductDescriptions = [
  "不限流量，面向 AI 大规模数据下载",
  "混合与纯住宅双池，默认全球随机",
  "8000万+ 住宅 IP，国家/地区定向",
  "每端口不限流量与并发",
  "独享固定机房 IP，稳定长会话",
  "固定住宅出口，兼顾身份与稳定性"
];

for (const [zhRoute] of routePairs) {
  const file = fileFromRoute(zhRoute);
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(html.includes("assets/visual-refinement.css"), `${file}: missing refined visual layer`);
  expect(html.includes("site-refined"), `${file}: missing refined production class`);
}

for (const file of [
  "scraping-rotating-proxy.html",
  "residential-proxy.html",
  "unlimited-residential-proxy.html",
  "static-datacenter-proxy.html",
  "static-residential-proxy.html",
  "ai-data.html",
  "ai-video-proxy.html",
  "ai-image-proxy.html",
  "ai-github-proxy.html",
  "ai-text-proxy.html",
  "ai-youtube-api.html"
]) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(
    html.includes("assets/visual-refinement.css?v=20260728-07"),
    `${file}: stale visual refinement asset version`
  );
}

const unlimitedProductPage = await readFile(path.join(rootDir, "unlimited-residential-proxy.html"), "utf8");
expect(unlimitedProductPage.includes("套餐内可用端口"), "unlimited-residential-proxy.html: simplified product visual copy missing");
expect(!unlimitedProductPage.includes(">ACTIVE<"), "unlimited-residential-proxy.html: obsolete dashboard status label detected");

const codeSolutionPage = await readFile(path.join(rootDir, "ai-github-proxy.html"), "utf8");
expect(codeSolutionPage.includes("公开代码同步任务"), "ai-github-proxy.html: data-task visual label missing");

const pricingPage = await readFile(path.join(rootDir, "pricing.html"), "utf8");
expect(pricingPage.includes('class="pricing-refined site-refined"'), "pricing.html: refined pricing class missing");
expect(pricingPage.includes('assets/pricing.js?v=20260729-03'), "pricing.html: pricing asset cache version is stale");
const englishPricingPage = await readFile(path.join(rootDir, "en", "pricing.html"), "utf8");
expect(englishPricingPage.includes('../assets/pricing.js?v=20260729-03'), "en/pricing.html: pricing asset cache version is stale");
for (const description of refinedProductDescriptions) {
  expect(homepage.includes(description), `index.html: missing canonical product menu copy: ${description}`);
  expect(pricingPage.includes(description), `pricing.html: product menu copy differs from homepage: ${description}`);
}

for (const file of [
  "pricing.html",
  "ai-data.html",
  "ai-video-proxy.html",
  "ai-image-proxy.html",
  "ai-github-proxy.html",
  "ai-text-proxy.html",
  "ai-youtube-api.html",
  "enterprise.html",
  "custom-proxy-pool.html",
  "data-scraping-service.html",
  "global-network.html"
]) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(
    !html.includes('href="scraping-rotating-proxy.html" aria-current="page"'),
    `${file}: inherited false current state for tunnel proxy`
  );
}

const currentMegaMenuItems = [
  ["scraping-rotating-proxy.html", "scraping-rotating-proxy.html"],
  ["residential-proxy.html", "residential-proxy.html"],
  ["unlimited-residential-proxy.html", "unlimited-residential-proxy.html"],
  ["static-datacenter-proxy.html", "static-datacenter-proxy.html"],
  ["static-residential-proxy.html", "static-residential-proxy.html"],
  ["ai-video-proxy.html", "ai-video-proxy.html"],
  ["ai-image-proxy.html", "ai-image-proxy.html"],
  ["ai-github-proxy.html", "ai-github-proxy.html"],
  ["ai-text-proxy.html", "ai-text-proxy.html"],
  ["ai-youtube-api.html", "ai-youtube-api.html"],
  ["custom-proxy-pool.html", "custom-proxy-pool.html"],
  ["data-scraping-service.html", "data-scraping-service.html"]
];

for (const [file, href] of currentMegaMenuItems) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(
    html.includes(`href="${href}" aria-current="page"`),
    `${file}: matching Mega Menu item is not marked as current`
  );
}

for (const file of ["ai-data.html", "enterprise.html"]) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(
    !/<a class="mega-link(?: is-featured)?" href="[^"]+" aria-current="page">/.test(html),
    `${file}: overview page must not select an unrelated Mega Menu item`
  );
}

const highBandwidthPage = await readFile(path.join(rootDir, "high-bandwidth-proxy.html"), "utf8");
expect(!highBandwidthPage.includes("Direct answer"), "high-bandwidth-proxy.html: exposed GEO answer label detected");
const highBandwidthCurrentCount = (
  highBandwidthPage.match(
    /class="mega-link is-featured" href="high-bandwidth-proxy\.html" aria-current="page"/g
  ) || []
).length;
expect(
  highBandwidthCurrentCount === 2,
  "high-bandwidth-proxy.html: product and AI menu entries must both be marked as current"
);

for (const file of [
  "scraping-rotating-proxy.html",
  "residential-proxy.html",
  "unlimited-residential-proxy.html",
  "static-datacenter-proxy.html",
  "static-residential-proxy.html"
]) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(!html.includes("Direct answer"), `${file}: exposed GEO answer label detected`);
}

const authRoutes = [
  [path.join("console", "login.html"), 'data-auth-page="login"', "loginForm"],
  [path.join("console", "register.html"), 'data-auth-page="register"', "registerForm"],
  [path.join("console", "forgot-password.html"), 'data-auth-page="forgot-password"', "forgotForm"],
  [path.join("console", "agency-login.html"), 'data-agency-page="login"', "agencyLoginForm"]
];

for (const [file, pageMarker, formId] of authRoutes) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(html.includes('<html lang="zh-CN">'), `${file}: incorrect html lang`);
  expect(html.includes('<meta name="robots" content="noindex,nofollow">'), `${file}: account route must remain noindex`);
  expect(html.includes('href="assets/favicon.svg"'), `${file}: missing favicon`);
  expect(html.includes(pageMarker), `${file}: incorrect auth page marker`);
  expect(html.includes(`id="${formId}"`), `${file}: missing functional form`);
  expect(html.includes("<h1"), `${file}: missing context H1`);
  expect(html.includes('href="https://www.123proxy.cn/agreement.html"'), `${file}: agreement must use the public website URL`);
}

const documentationLinkFiles = [
  ...new Set([
    ...routePairs.flatMap(([zhRoute, enRoute]) => [fileFromRoute(zhRoute), fileFromRoute(enRoute)]),
    ...developerRoutes.map(fileFromRoute),
    statusFile,
    "index-lite.html",
    path.join("console", "login.html"),
    path.join("console", "register.html"),
    path.join("console", "forgot-password.html"),
    path.join("console", "agency-login.html"),
    path.join("console", "agency-manager.html"),
    path.join("console", "app", "index.html"),
    "agreement.html"
  ])
];

const developerTargetCache = new Map();
for (const file of documentationLinkFiles) {
  const html = await readFile(path.join(rootDir, file), "utf8");
  expect(!html.includes("/document/docs/"), `${file}: obsolete documentation URL detected`);
  expect(!html.includes("/developers/getting-started/#code-examples"), `${file}: obsolete code example anchor detected`);

  for (const match of html.matchAll(/href="([^"]*\/developers\/[^"]*)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    const url = new URL(href, siteUrl);
    if (url.origin !== siteUrl || !url.pathname.startsWith("/developers/")) continue;

    expect(developerRoutes.includes(url.pathname), `${file}: unknown developer route ${url.pathname}`);
    if (!developerTargetCache.has(url.pathname)) {
      developerTargetCache.set(
        url.pathname,
        await readFile(path.join(rootDir, fileFromRoute(url.pathname)), "utf8")
      );
    }
    if (url.hash) {
      const fragment = decodeURIComponent(url.hash.slice(1));
      expect(
        developerTargetCache.get(url.pathname).includes(`id="${fragment}"`),
        `${file}: missing developer fragment ${url.pathname}#${fragment}`
      );
    }
  }
}

const consoleProductsSource = await readFile(path.join(rootDir, "console", "app", "products.js"), "utf8");
for (const route of [
  "https://www.123proxy.cn/developers/products/scraping-rotating-proxy/",
  "https://www.123proxy.cn/developers/products/residential-rotating-proxy/",
  "https://www.123proxy.cn/developers/products/unlimited-residential-proxy/",
  "https://www.123proxy.cn/developers/products/static-datacenter-proxy/",
  "https://www.123proxy.cn/developers/products/static-residential-proxy/"
]) {
  expect(consoleProductsSource.includes(route), `console/app/products.js: missing product documentation route ${route}`);
}
expect(!consoleProductsSource.includes("/document/docs/"), "console/app/products.js: obsolete documentation URL detected");

const agreementPage = await readFile(path.join(rootDir, "agreement.html"), "utf8");
expect(agreementPage.includes('<html lang="zh-CN">'), "agreement.html: incorrect html lang");
expect(agreementPage.includes('<link rel="canonical" href="https://www.123proxy.cn/agreement.html">'), "agreement.html: incorrect canonical");
expect(agreementPage.includes("<h1>123Proxy 用户服务条款</h1>"), "agreement.html: missing agreement H1");
expect(agreementPage.includes('id="other"'), "agreement.html: incomplete agreement sections");
expect(agreementPage.includes('href="assets/favicon.svg"'), "agreement.html: missing favicon");
expect(agreementPage.includes('href="assets/agreement.css'), "agreement.html: must use the website legal stylesheet");
expect(agreementPage.includes('href="https://console.123proxy.cn/register.html"'), "agreement.html: registration link must use the console origin");

const legacyAgreement = await readFile(path.join(rootDir, "console", "aggrement.html"), "utf8");
expect(legacyAgreement.includes('url=https://www.123proxy.cn/agreement.html'), "console/aggrement.html: legacy redirect must target the public agreement");

const consoleAuthCss = await readFile(path.join(rootDir, "console", "assets", "auth.css"), "utf8");
const consoleAuthJs = await readFile(path.join(rootDir, "console", "assets", "auth.js"), "utf8");
const consoleAgencyCss = await readFile(path.join(rootDir, "console", "assets", "agency.css"), "utf8");
const consoleAgencyJs = await readFile(path.join(rootDir, "console", "assets", "agency.js"), "utf8");
expect(consoleAuthCss.includes("123Proxy console authentication"), "console/assets/auth.css: missing console asset");
expect(consoleAuthJs.includes("123Proxy console authentication"), "console/assets/auth.js: missing console asset");
expect(consoleAuthJs.includes('request("/accsrv/information"'), "console/assets/auth.js: login page must validate an existing session");
expect(consoleAuthJs.includes("location.replace(consoleDestination())"), "console/assets/auth.js: valid sessions must enter the console without leaving login in history");
expect(consoleAuthJs.includes("localStorage.removeItem(TOKEN_KEY)"), "console/assets/auth.js: expired sessions must be cleared");
const consoleLoginPage = await readFile(path.join(rootDir, "console", "login.html"), "utf8");
expect(consoleLoginPage.includes("assets/auth.js?v=20260729-03"), "console/login.html: authentication asset cache version is stale");
expect(consoleAgencyCss.includes("123Proxy agency partner console"), "console/assets/agency.css: missing agency asset");
expect(consoleAgencyJs.includes("123Proxy agency partner console"), "console/assets/agency.js: missing agency asset");

console.log(`Static audit passed: ${routePairs.length * 2} public routes, 4 console auth routes, 1 agency manager, 1 public agreement, 1 legacy redirect, 1 noindex comparison page, metadata, JSON-LD, sitemap.xml, robots.txt`);
