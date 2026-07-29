export const siteUrl = "https://www.123proxy.cn";

export const seoOrganization = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "123Proxy",
  url: `${siteUrl}/`,
  email: "sales@123proxy.cn",
  logo: `${siteUrl}/assets/original-123proxy-logo-final.jpg`,
  description: "123Proxy 面向爬虫工程师和 AI 数据团队提供海外代理 IP、住宅代理、静态代理与高带宽数据采集代理基础设施。",
  areaServed: "Worldwide",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "技术支持、定制咨询与企业咨询",
      url: `${siteUrl}/contact.html#solutions`,
      availableLanguage: ["zh-CN"]
    },
    {
      "@type": "ContactPoint",
      contactType: "免费测试、开票与基础客服",
      url: `${siteUrl}/contact.html#service`,
      availableLanguage: ["zh-CN"]
    }
  ],
  knowsAbout: [
    "海外代理 IP",
    "住宅代理",
    "隧道代理",
    "静态代理",
    "高带宽代理 IP",
    "AI 数据采集",
    "网页爬虫代理",
    "数据抓取代理"
  ]
};

export const productSeoFacts = {
  highBandwidth: {
    key: "highBandwidth",
    path: "/high-bandwidth-proxy.html",
    name: "高带宽代理 IP",
    serviceType: "High-bandwidth proxy IP service",
    category: "Proxy infrastructure for AI data scraping",
    audience: "爬虫开发工程师、AI 数据采集团队、数据工程团队",
    description: "为 AI 视频、图片、代码和公开文档的大规模下载配置 10Gbps+ 单项目带宽、不限流量与定制代理池。",
    properties: [
      ["单项目带宽", "10Gbps+"],
      ["总网络能力", "200Gbps+"],
      ["流量方式", "不限流量"],
      ["代理池", "可按目标站点和任务定制"]
    ]
  },
  tunnel: {
    key: "tunnel",
    path: "/scraping-rotating-proxy.html",
    name: "隧道代理",
    serviceType: "Scraping rotating proxy",
    category: "Rotating proxy for web scraping",
    audience: "爬虫开发工程师、采集系统开发者、数据工程团队",
    description: "固定网关接入爬虫混合池或纯住宅池，默认全球随机，支持按流量或并发线程使用。",
    properties: [
      ["代理网关", "proxy.123proxy.cn"],
      ["端口", "36923"],
      ["默认地区", "全球随机"],
      ["代理池", "爬虫混合池约 95% 住宅 IP + 5% 数据中心 IP；纯住宅池为 100% 住宅 IP"],
      ["计费方式", "按流量或按并发线程"]
    ]
  },
  residential: {
    key: "residential",
    path: "/residential-proxy.html",
    name: "隧道住宅代理",
    serviceType: "Residential rotating proxy",
    category: "Geo-targeted residential proxy",
    audience: "爬虫开发工程师、跨地区采集任务、AI 数据采集团队",
    description: "固定网关接入 8000万+ 住宅 IP，覆盖 190+ 国家和地区，提取代理时指定国家或地区与 SESSION，仅按流量购买。",
    properties: [
      ["代理网关", "residential.123proxy.cn"],
      ["端口", "33000"],
      ["住宅代理池", "8000万+"],
      ["覆盖范围", "190+ 国家和地区"],
      ["计费方式", "仅按流量"]
    ]
  },
  unlimitedResidential: {
    key: "unlimitedResidential",
    path: "/unlimited-residential-proxy.html",
    name: "不限量动态住宅",
    serviceType: "Unlimited residential proxy by port",
    category: "Port-based residential proxy",
    audience: "浏览器自动化开发者、持续采集任务、AI 数据采集团队",
    description: "每端口不限流量与并发，按端口和带宽套餐使用，出口 IP 每 3–30 分钟固定轮转。",
    properties: [
      ["代理网关", "unlimit.residential.123proxy.cn"],
      ["端口", "10253"],
      ["端口能力", "每端口不限流量与并发"],
      ["轮转周期", "3–30 分钟"],
      ["地区设置", "提取代理时按套餐统一设置"]
    ]
  },
  staticDatacenter: {
    key: "staticDatacenter",
    path: "/static-datacenter-proxy.html",
    name: "长效静态代理",
    serviceType: "Dedicated static datacenter proxy",
    category: "Static datacenter proxy IP",
    audience: "企业系统开发者、固定出口任务、API 集成团队",
    description: "独享固定数据中心代理 IP，周期内不轮转，方案内不限流量，客户直连分配的代理 IP。",
    properties: [
      ["接入方式", "直连分配的代理 IP"],
      ["出口类型", "独享固定数据中心 IP"],
      ["流量方式", "方案内不限流量"],
      ["白名单模式", "不支持 123Proxy 套餐 IP 白名单认证"],
      ["免费测试", "不提供"]
    ]
  },
  staticResidential: {
    key: "staticResidential",
    path: "/static-residential-proxy.html",
    name: "长效静态住宅",
    serviceType: "Dedicated static residential proxy",
    category: "Static residential ISP proxy IP",
    audience: "需要固定住宅出口的开发者、长期会话任务、AI 数据采集团队",
    description: "独享固定住宅 ISP 代理 IP，周期内不轮转，方案内不限流量，客户直连分配的代理 IP。",
    properties: [
      ["接入方式", "直连分配的代理 IP"],
      ["出口类型", "独享固定住宅 ISP IP"],
      ["覆盖范围", "69 个国家和地区"],
      ["流量方式", "方案内不限流量"],
      ["免费测试", "不提供"]
    ]
  }
};

const productFactsByPath = new Map(
  Object.values(productSeoFacts).flatMap((fact) => [
    [fact.path, fact],
    [`/en${fact.path}`, fact]
  ])
);

const routeLastmod = {
  "/": "2026-07-29",
  "/en/": "2026-07-29",
  "/high-bandwidth-proxy.html": "2026-07-29",
  "/en/high-bandwidth-proxy.html": "2026-07-29",
  "/scraping-rotating-proxy.html": "2026-07-29",
  "/en/scraping-rotating-proxy.html": "2026-07-29",
  "/residential-proxy.html": "2026-07-29",
  "/en/residential-proxy.html": "2026-07-29",
  "/unlimited-residential-proxy.html": "2026-07-29",
  "/en/unlimited-residential-proxy.html": "2026-07-29",
  "/static-datacenter-proxy.html": "2026-07-29",
  "/en/static-datacenter-proxy.html": "2026-07-29",
  "/static-residential-proxy.html": "2026-07-29",
  "/en/static-residential-proxy.html": "2026-07-29",
  "/ai-data.html": "2026-07-29",
  "/en/ai-data.html": "2026-07-29",
  "/ai-video-proxy.html": "2026-07-29",
  "/en/ai-video-proxy.html": "2026-07-29",
  "/ai-image-proxy.html": "2026-07-29",
  "/en/ai-image-proxy.html": "2026-07-29",
  "/ai-github-proxy.html": "2026-07-29",
  "/en/ai-github-proxy.html": "2026-07-29",
  "/ai-text-proxy.html": "2026-07-29",
  "/en/ai-text-proxy.html": "2026-07-29",
  "/ai-youtube-api.html": "2026-07-29",
  "/en/ai-youtube-api.html": "2026-07-29",
  "/enterprise.html": "2026-07-29",
  "/en/enterprise.html": "2026-07-29",
  "/custom-proxy-pool.html": "2026-07-29",
  "/en/custom-proxy-pool.html": "2026-07-29",
  "/data-scraping-service.html": "2026-07-29",
  "/en/data-scraping-service.html": "2026-07-29",
  "/global-network.html": "2026-07-29",
  "/en/global-network.html": "2026-07-29",
  "/pricing.html": "2026-07-29",
  "/en/pricing.html": "2026-07-29",
  "/status/": "2026-07-29",
  "/contact.html": "2026-07-29",
  "/developers/": "2026-07-29",
  "/developers/getting-started/": "2026-07-29",
  "/developers/products/scraping-rotating-proxy/": "2026-07-29",
  "/developers/products/residential-rotating-proxy/": "2026-07-29",
  "/developers/products/unlimited-residential-proxy/": "2026-07-29",
  "/developers/products/static-datacenter-proxy/": "2026-07-29",
  "/developers/products/static-residential-proxy/": "2026-07-29",
  "/developers/guides/concurrency-qps-performance/": "2026-07-29",
  "/developers/guides/session-geo-rotation/": "2026-07-29",
  "/developers/guides/proxy-errors-retries/": "2026-07-29",
  "/developers/guides/proxy-product-selection/": "2026-07-29",
  "/developers/examples/": "2026-07-29",
  "/developers/examples/python-requests-proxy/": "2026-07-29",
  "/developers/examples/scrapy-proxy/": "2026-07-29",
  "/developers/examples/playwright-proxy/": "2026-07-29",
  "/developers/examples/selenium-proxy/": "2026-07-29",
  "/developers/examples/puppeteer-proxy/": "2026-07-29",
  "/developers/examples/nodejs-axios-proxy/": "2026-07-29",
  "/developers/examples/go-colly-proxy/": "2026-07-29",
  "/developers/examples/java-jsoup-proxy/": "2026-07-29",
  "/developers/examples/php-curl-proxy/": "2026-07-29"
};

export function productSeoFactForPath(pathname) {
  return productFactsByPath.get(pathname) || null;
}

export function lastModifiedForRoute(route) {
  return routeLastmod[route] || "2026-07-29";
}
