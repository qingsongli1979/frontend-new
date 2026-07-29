const statusGroups = [
  {
    id: "proxy-products",
    label: "PROXY PRODUCTS",
    title: "代理产品",
    description: "从固定网关完成认证、建立连接，并通过代理出口发起合成请求。",
    components: [
      {
        id: "proxy-tunnel",
        icon: "route",
        name: "隧道代理",
        endpoint: "proxy.123proxy.cn:36923",
        description: "爬虫混合池与纯住宅池"
      },
      {
        id: "proxy-residential",
        icon: "house",
        name: "隧道住宅代理",
        endpoint: "residential.123proxy.cn:33000",
        description: "国家地区与 SESSION 路由"
      },
      {
        id: "proxy-unlimited",
        icon: "refresh-cw",
        name: "不限量动态住宅",
        endpoint: "unlimit.residential.123proxy.cn:10253",
        description: "套餐级地区与周期轮转"
      }
    ]
  },
  {
    id: "regional-gateways",
    label: "REGIONAL GATEWAYS",
    title: "区域网关",
    description: "持续检查区域入口的解析、连接和跨区域请求链路。",
    components: [
      {
        id: "gateway-us",
        icon: "map-pin",
        name: "美国网关",
        endpoint: "US Gateway",
        description: "美国区域接入节点"
      },
      {
        id: "gateway-eu",
        icon: "map-pin",
        name: "欧洲网关",
        endpoint: "EU Gateway",
        description: "欧洲区域接入节点"
      },
      {
        id: "gateway-asia",
        icon: "map-pin",
        name: "亚洲网关",
        endpoint: "Asia Gateway",
        description: "亚洲区域接入节点"
      }
    ]
  },
  {
    id: "platform-services",
    label: "PLATFORM SERVICES",
    title: "平台服务",
    description: "通过 HTTPS 检查公开网站、控制台与 API 的可访问性和响应时间。",
    components: [
      {
        id: "website",
        icon: "globe-2",
        name: "123Proxy 网站",
        endpoint: "www.123proxy.cn",
        description: "官网与公开内容"
      },
      {
        id: "console",
        icon: "panel-top",
        name: "用户控制台",
        endpoint: "console.123proxy.cn",
        description: "登录、套餐与资源管理"
      },
      {
        id: "api",
        icon: "braces",
        name: "API 服务",
        endpoint: "api.123proxy.cn",
        description: "公开 API 与服务接口"
      }
    ]
  }
];

const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function componentMarkup(component) {
  return `
    <article class="status-component" data-status-component="${escapeHtml(component.id)}">
      <div class="status-component-main">
        <span class="status-component-icon">${icon(component.icon)}</span>
        <div>
          <h3>${escapeHtml(component.name)}</h3>
          <p>${escapeHtml(component.description)}</p>
          <code data-component-endpoint>${escapeHtml(component.endpoint)}</code>
        </div>
      </div>
      <div class="status-component-history">
        <div class="status-history-label">
          <span>过去 90 天</span>
          <small data-component-message>等待监测数据</small>
        </div>
        <div class="status-history-track" data-component-history aria-label="${escapeHtml(component.name)}过去 90 天状态"></div>
      </div>
      <div class="status-component-metrics">
        <div>
          <span>响应时间</span>
          <strong data-component-latency>--</strong>
        </div>
        <div>
          <span>90 天可用率</span>
          <strong data-component-uptime>--</strong>
        </div>
      </div>
      <span class="status-badge is-unknown" data-component-status><i></i>等待数据</span>
    </article>`;
}

function groupMarkup(group) {
  return `
    <section class="status-group" id="${escapeHtml(group.id)}">
      <header class="status-group-head">
        <div>
          <span>${escapeHtml(group.label)}</span>
          <h2>${escapeHtml(group.title)}</h2>
        </div>
        <p>${escapeHtml(group.description)}</p>
      </header>
      <div class="status-component-list">
        ${group.components.map(componentMarkup).join("")}
      </div>
    </section>`;
}

function structuredData(page, siteUrl) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "123Proxy",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/assets/original-123proxy-logo-final.jpg`
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}${page.route}#webpage`,
        name: page.title,
        description: page.description,
        url: `${siteUrl}${page.route}`,
        inLanguage: "zh-CN",
        publisher: { "@id": `${siteUrl}/#organization` },
        about: statusGroups.flatMap((group) => group.components.map((component) => ({
          "@type": "Service",
          name: component.name,
          serviceType: group.title,
          provider: { "@id": `${siteUrl}/#organization` }
        })))
      }
    ]
  }).replaceAll("<", "\\u003c");
}

export const statusZh = {
  file: "status/index.html",
  route: "/status/",
  title: "服务状态 | 123Proxy",
  description: "查看 123Proxy 隧道代理、隧道住宅代理、不限量动态住宅、区域网关、网站、控制台与 API 的实时运行状态。"
};

export function renderStatusDocument(page, {
  header,
  footer,
  siteUrl,
  assetVersion
}) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${siteUrl}${page.route}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="123Proxy">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${siteUrl}${page.route}">
  <meta property="og:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/product-detail.css?v=${assetVersion}">
  <link rel="stylesheet" href="/assets/status-page.css?v=${assetVersion}">
  <script type="application/ld+json">${structuredData(page, siteUrl)}</script>
</head>
<body class="site-refined status-page" data-status-page>
  <div class="page">
    ${header}
    <main>
      <section class="status-hero">
        <div class="container status-hero-inner">
          <div class="status-heading">
            <span class="status-eyebrow">123PROXY SERVICE STATUS</span>
            <h1>服务状态</h1>
            <p>查看代理产品、区域网关与平台服务的实时可用性。</p>
          </div>
          <div class="status-overall is-loading" data-overall-status role="status" aria-live="polite">
            <span class="status-overall-symbol">${icon("activity")}</span>
            <div class="status-overall-copy">
              <small>当前运行状态</small>
              <strong data-overall-title>正在获取监测状态</strong>
              <p data-overall-description>连接监测服务并汇总各项检查结果。</p>
            </div>
            <div class="status-overall-actions">
              <span class="status-updated"><small>最近更新</small><strong data-status-updated>--</strong></span>
              <button class="btn status-refresh" type="button" data-status-refresh>
                ${icon("refresh-cw")}<span>刷新状态</span>
              </button>
            </div>
          </div>
          <div class="status-source-note" data-status-source-note hidden></div>
        </div>
      </section>

      <section class="status-summary" aria-label="服务状态摘要">
        <div class="container status-summary-grid">
          <div><span>检测服务</span><strong data-summary-total>9</strong><small>代理、网关与平台</small></div>
          <div><span>运行正常</span><strong data-summary-operational>--</strong><small>最近一次检测</small></div>
          <div><span>受影响</span><strong data-summary-affected>--</strong><small>降级、故障或维护</small></div>
          <div><span>检测周期</span><strong>60s</strong><small>页面自动刷新</small></div>
        </div>
      </section>

      <section class="status-services">
        <div class="container">
          <div class="status-section-intro">
            <div>
              <span>LIVE COMPONENTS</span>
              <h2>服务组件</h2>
            </div>
            <div class="status-legend" aria-label="状态图例">
              <span><i class="is-operational"></i>正常</span>
              <span><i class="is-degraded"></i>性能下降</span>
              <span><i class="is-outage"></i>服务中断</span>
              <span><i class="is-maintenance"></i>维护中</span>
              <span><i class="is-unknown"></i>暂无数据</span>
            </div>
          </div>
          ${statusGroups.map(groupMarkup).join("")}
        </div>
      </section>

      <section class="status-events">
        <div class="container">
          <div class="status-section-intro">
            <div>
              <span>INCIDENTS & MAINTENANCE</span>
              <h2>事件与维护</h2>
            </div>
            <p>展示当前事件、近期恢复记录与计划维护窗口。</p>
          </div>
          <div class="status-event-grid">
            <section class="status-event-column" aria-labelledby="incidentTitle">
              <header>
                <span class="status-event-icon">${icon("triangle-alert")}</span>
                <div><h3 id="incidentTitle">服务事件</h3><p>最近 90 天的公开事件</p></div>
              </header>
              <div class="status-event-list" data-status-incidents>
                <div class="status-empty"><strong>正在读取事件记录</strong><span>请稍候</span></div>
              </div>
            </section>
            <section class="status-event-column" aria-labelledby="maintenanceTitle">
              <header>
                <span class="status-event-icon">${icon("calendar-clock")}</span>
                <div><h3 id="maintenanceTitle">计划维护</h3><p>未来维护窗口与影响范围</p></div>
              </header>
              <div class="status-event-list" data-status-maintenance>
                <div class="status-empty"><strong>正在读取维护计划</strong><span>请稍候</span></div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="status-method">
        <div class="container status-method-inner">
          <div>
            <span>MONITORING METHOD</span>
            <h2>从真实请求链路判断可用性</h2>
            <p>代理服务由外部探针完成 DNS、连接、认证与出口请求；网站和 API 通过 HTTPS 状态码与响应时间检测。单一探针异常会先复核，再汇总为公开状态。</p>
          </div>
          <div class="status-method-grid">
            <div>${icon("route")}<span><strong>代理链路</strong><small>连接 / 认证 / 出口请求</small></span></div>
            <div>${icon("map")}<span><strong>区域网关</strong><small>美国 / 欧洲 / 亚洲</small></span></div>
            <div>${icon("server-cog")}<span><strong>平台服务</strong><small>网站 / 控制台 / API</small></span></div>
          </div>
        </div>
      </section>
    </main>
    ${footer}
  </div>
  <script>
    window.__STATUS_CONFIG__ = {
      endpoint: "/status-api/v1/summary",
      refreshIntervalMs: 60000,
      requestTimeoutMs: 8000
    };
  </script>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="/assets/product-static.js?v=${assetVersion}"></script>
  <script src="/assets/status-page.js?v=${assetVersion}"></script>
</body>
</html>`;
}
