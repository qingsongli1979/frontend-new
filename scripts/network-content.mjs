const registerUrl = "https://console.123proxy.cn/register.html";
const docsUrl = "/developers/";

export const networkZh = {
  key: "global-network",
  file: "global-network.html",
  zhFile: "global-network.html",
  name: "全球代理网络",
  serviceType: "全球代理网络",
  title: "全球代理网络 - 8000万+住宅IP与190+国家和地区 | 123Proxy",
  description: "123Proxy 全球代理网络面向爬虫与 AI 数据任务，提供 8000万+住宅代理IP、190+国家和地区覆盖、200Gbps+网络总带宽，以及轮换、地区定位和固定出口能力。",
  eyebrow: "123PROXY GLOBAL NETWORK",
  titleLines: ["8000万+ 住宅 IP", "覆盖 190+ 国家和地区"],
  lead: "提供全球随机轮换、国家与地区定向、SESSION、固定数据中心和固定住宅 ISP 出口。",
  primaryLabel: "免费测试 1GB",
  primaryUrl: registerUrl,
  secondaryLabel: "查看开发文档",
  secondaryUrl: docsUrl,
  metrics: [
    ["8000万+", "全球住宅代理 IP 池"],
    ["190+", "国家和地区覆盖"],
    ["200Gbps+", "代理网络总带宽"],
    ["7x24", "企业服务受理"]
  ],
  coverage: {
    title: "190+ 国家和地区住宅代理覆盖",
    text: "覆盖北美、欧洲、亚太、拉丁美洲、中东与非洲等主要互联网市场。",
    regions: [
      ["北美", "North America", "美国、加拿大及其他可用地区"],
      ["欧洲", "Europe", "覆盖主要欧洲互联网市场"],
      ["亚太", "Asia Pacific", "东亚、东南亚、大洋洲及其他可用地区"],
      ["拉丁美洲", "Latin America", "覆盖主要拉美互联网市场"],
      ["中东与非洲", "Middle East & Africa", "按当前资源提供可用位置"]
    ],
    noteTitle: "地区能力因产品而异",
    noteText: "购买套餐不会锁定地区。隧道代理默认全球随机，提取时可选粗粒度地区；隧道住宅代理在提取时支持国家或地区定位。"
  },
  resources: {
    title: "轮换代理、地区住宅与固定出口",
    text: "比较位置、SESSION、轮转方式、固定周期与计费模型，直接进入对应代理产品。",
    headers: ["代理能力", "位置与出口", "会话与轮换", "适合任务"],
    rows: [
      {
        icon: "route",
        title: "隧道代理",
        href: "scraping-rotating-proxy.html",
        location: "默认全球随机；提取时可选欧美、北美、欧洲、亚洲、美国或日韩",
        session: "混合池自动轮换；纯住宅池支持 SESSION",
        fit: "通用网页抓取、高速轮换与高并发请求"
      },
      {
        icon: "wifi",
        title: "隧道住宅代理",
        href: "residential-proxy.html",
        location: "提取时选择国家或地区，覆盖 190+ 位置",
        session: "提取时指定 SESSION，仅按流量购买",
        fit: "本地化搜索、地区内容与市场数据"
      },
      {
        icon: "infinity",
        title: "不限量动态住宅",
        href: "unlimited-residential-proxy.html",
        location: "提取时按套餐设置地区，不能逐端口指定",
        session: "每个端口固定 3-30 分钟后轮换",
        fit: "长时间运行、端口不限并发的爬虫任务"
      },
      {
        icon: "map-pinned",
        title: "长效静态代理",
        href: "static-datacenter-proxy.html",
        location: "提取时从 69 个支持地区中选择",
        session: "固定 IP，不随请求自动轮换",
        fit: "账号环境、长期会话与目标系统来源白名单"
      },
      {
        icon: "gauge",
        title: "高带宽与定制代理池",
        href: "high-bandwidth-proxy.html",
        location: "按目标、任务规模与资源要求规划",
        session: "项目级代理资源与容量配置",
        fit: "视频、图片、代码和大文件数据爬取"
      }
    ]
  },
  routing: {
    title: "HTTP(S) / SOCKS 标准代理接入",
    text: "购买套餐后，在控制台或 API 提取代理时选择地区、代理池和 SESSION，再由爬虫程序连接代理网关。",
    steps: [
      ["01", "爬虫程序", "requests / Scrapy / Playwright"],
      ["02", "统一代理入口", "HTTP(S) / SOCKS"],
      ["03", "路由策略", "产品 / 地区 / SESSION"],
      ["04", "代理资源", "轮换 / 住宅 / 固定出口"],
      ["05", "公开数据", "响应与质量记录"]
    ],
    codeLabel: "Python / requests",
    code: `import requests

proxy = "http://USERNAME:PASSWORD@PROXY_HOST:PORT"
proxies = {"http": proxy, "https": proxy}

response = requests.get(
    "https://target.example/data",
    proxies=proxies,
    timeout=20,
)

print(response.status_code, response.elapsed.total_seconds())`,
    points: [
      ["地区参数", "购买时不选择，提取代理时按产品能力配置"],
      ["SESSION", "用于需要连续出口身份的请求组"],
      ["并发控制", "根据产品计费方式与目标限制设置"],
      ["任务记录", "保留目标、地区、重试和有效响应"]
    ]
  },
  quality: {
    title: "可用性、地区准确性与有效吞吐",
    text: "生产任务可同时监控有效响应率、地区匹配、会话连续性、重试量和成功写入的数据量。",
    items: [
      ["有效响应率", "成功返回且通过业务校验的对象比例", "circle-check"],
      ["地区准确性", "出口位置与任务要求的一致程度", "map-pin-check"],
      ["会话连续性", "指定 SESSION 或固定 IP 的保持效果", "link"],
      ["重试放大", "超时、失败和重复传输带来的额外请求", "repeat-2"],
      ["有效吞吐", "单位时间成功写入的有效数据量", "chart-no-axes-combined"]
    ],
    bandwidthTitle: "200Gbps+ 网络总带宽与 10Gbps+ 单项目能力",
    bandwidthText: "200Gbps+ 是 123Proxy 代理网络总带宽；10Gbps+ 是符合条件的企业高带宽单项目聚合能力。实际吞吐还取决于目标响应、连接、工作节点、对象大小和存储。",
    bandwidthFacts: [["200Gbps+", "代理网络总带宽"], ["10Gbps+", "企业单项目聚合能力"], ["PoC", "使用代表性任务确认配置"]]
  },
  faqs: [
    ["所有代理产品都能指定 190+ 国家和地区吗？", "不能。190+ 是住宅代理网络的总体覆盖。隧道代理默认全球随机，提取时可选欧美、北美、欧洲、亚洲、美国和日韩；隧道住宅代理在提取时支持国家或地区定位；不限量动态住宅按套餐设置地区；静态数据中心和静态住宅均支持 69 个地区。"],
    ["哪些产品支持 SESSION？", "隧道住宅代理支持在鉴权中指定 SESSION；隧道代理的纯住宅池支持 SESSION。其他产品的出口保持方式以端口轮转周期或固定 IP 为主。"],
    ["购买代理套餐时需要选择地区吗？", "不需要。所有代理产品都在提取代理时选择地区，购买套餐不会锁定地区。具体可选粒度和支持清单取决于产品。"],
    ["200Gbps+ 是单个客户可用带宽吗？", "不是。200Gbps+ 表示 123Proxy 代理网络总带宽。符合条件的高带宽企业项目以 10Gbps+ 单项目聚合能力进行评估，并通过真实任务确认配置。"],
    ["8000万+ 是否代表同时独享 8000万个在线 IP？", "不是。8000万+ 表示全球住宅代理资源池规模，不代表全部 IP 同时在线或由单一客户独享。实时可用资源会随位置、网络和代理池状态变化。"],
    ["上线前应该怎样测试？", "使用真实目标、目标地区、请求类型、并发和完成周期进行测试，并记录有效响应率、响应时间、字节数、重试、地区准确性和有效吞吐。"]
  ],
  cta: {
    eyebrow: "START WITH REAL REQUESTS",
    title: "开始使用全球代理产品",
    text: "提供免费测试的动态代理可直接申请；两类静态代理不提供免费测试。定制代理池与高带宽项目可联系解决方案工程师。",
    primaryLabel: "免费测试 1GB",
    primaryUrl: registerUrl,
    secondaryLabel: "联系解决方案工程师",
    secondaryUrl: "contact.html#solutions"
  }
};

export const networkEn = {
  key: "global-network",
  file: "global-network.html",
  zhFile: "global-network.html",
  name: "Global proxy network",
  serviceType: "Global proxy network",
  title: "Global Proxy Network - 80M+ Residential IPs in 190+ Locations | 123Proxy",
  description: "123Proxy provides 80M+ residential proxy IPs across 190+ countries and regions, 200Gbps+ total network bandwidth, rotating routes, geo targeting, sessions, and fixed exits.",
  eyebrow: "123PROXY GLOBAL NETWORK",
  titleLines: ["Global proxy network", "for data scraping"],
  lead: "Connect scraping and AI data workloads to 80M+ residential proxy IPs across 190+ countries and regions, with rotating, geo-targeted, session, and fixed-exit options.",
  primaryLabel: "Free 1GB trial",
  primaryUrl: registerUrl,
  secondaryLabel: "Developer documentation",
  secondaryUrl: docsUrl,
  metrics: [
    ["80M+", "Residential proxy IP pool"],
    ["190+", "Countries and regions"],
    ["200Gbps+", "Total proxy network bandwidth"],
    ["24/7", "Enterprise intake"]
  ],
  coverage: {
    title: "Move from global coverage to the locations your workload needs",
    text: "The global resource pool reaches major internet markets. Available locations vary by product, pool, and real-time network state, so validate the target country or region before production.",
    regions: [
      ["North America", "North America", "United States, Canada, and other available locations"],
      ["Europe", "Europe", "Coverage across major European internet markets"],
      ["Asia Pacific", "Asia Pacific", "East Asia, Southeast Asia, Oceania, and other locations"],
      ["Latin America", "Latin America", "Coverage across major Latin American markets"],
      ["Middle East & Africa", "Middle East & Africa", "Available locations subject to current resources"]
    ],
    noteTitle: "Global coverage does not mean every product supports per-location targeting",
    noteText: "All locations are selected when extracting proxies, not when purchasing. Location granularity and supported codes depend on the product."
  },
  resources: {
    title: "Choose exit behavior for the workload",
    text: "Decide whether you need geographic identity, a stable session, or sustained high-volume transfer before selecting a product. Coverage is the resource layer; routing behavior comes from the product.",
    headers: ["Capability", "Location and exit", "Session and rotation", "Best fit"],
    rows: [
      {icon: "route", title: "Scraping rotating proxy", href: "scraping-rotating-proxy.html", location: "Broad region presets selected at extraction", session: "Mixed pool rotates; pure residential pool supports SESSION", fit: "General crawling, fast rotation, and high concurrency"},
      {icon: "wifi", title: "Residential rotating proxy", href: "residential-proxy.html", location: "Country or region selected at extraction", session: "SESSION selected at extraction; traffic plans only", fit: "Localized search, regional content, and market data"},
      {icon: "infinity", title: "Unlimited rotating residential", href: "unlimited-residential-proxy.html", location: "Package region selected at extraction", session: "Each port retains an exit for 3-30 minutes", fit: "Long-running workloads with unlimited concurrency per port"},
      {icon: "map-pinned", title: "Long-lived static proxies", href: "static-datacenter-proxy.html", location: "Choose from 69 supported locations at extraction", session: "Fixed IP without request-by-request rotation", fit: "Account environments, persistent sessions, and target-system allowlists"},
      {icon: "gauge", title: "High bandwidth and custom pools", href: "high-bandwidth-proxy.html", location: "Planned around targets, workload scale, and resources", session: "Project-level proxy resources and capacity", fit: "Video, image, code, and large-object collection"}
    ]
  },
  routing: {
    title: "Carry location and session policy through the collection pipeline",
    text: "Applications still connect through standard proxy protocols. Product, location, pool, and SESSION configuration differ, so keep the chosen routing policy with the queue and telemetry.",
    steps: [
      ["01", "Collector", "requests / Scrapy / Playwright"],
      ["02", "Proxy gateway", "HTTP(S) / SOCKS"],
      ["03", "Route policy", "Product / region / SESSION"],
      ["04", "Proxy resource", "Rotating / residential / fixed"],
      ["05", "Public data", "Response and quality records"]
    ],
    codeLabel: "Python / requests",
    code: `import requests

proxy = "http://USERNAME:PASSWORD@PROXY_HOST:PORT"
proxies = {"http": proxy, "https": proxy}

response = requests.get(
    "https://target.example/data",
    proxies=proxies,
    timeout=20,
)

print(response.status_code, response.elapsed.total_seconds())`,
    points: [
      ["Location", "Configure only on products that support geo targeting"],
      ["SESSION", "Use for request groups that need a continuous exit identity"],
      ["Concurrency", "Set from the billing model and target behavior"],
      ["Telemetry", "Keep target, location, retry, and useful-response records"]
    ]
  },
  quality: {
    title: "Measure network performance by useful data",
    text: "Pool size and peak bandwidth are foundations. Production decisions should prioritize completion time, useful responses, location accuracy, and retry cost.",
    items: [
      ["Useful response rate", "Objects returned successfully and accepted by business rules", "circle-check"],
      ["Location accuracy", "How consistently exits match the requested location", "map-pin-check"],
      ["Session continuity", "Observed retention for SESSION or fixed IP routing", "link"],
      ["Retry amplification", "Extra requests caused by timeouts, failures, and repeats", "repeat-2"],
      ["Useful throughput", "Validated data written per unit of time", "chart-no-axes-combined"]
    ],
    bandwidthTitle: "What do 200Gbps+ and 10Gbps+ represent?",
    bandwidthText: "200Gbps+ is total 123Proxy network bandwidth. 10Gbps+ is aggregate per-project capability for qualified enterprise high-bandwidth projects. Actual throughput also depends on targets, connections, workers, object sizes, and storage.",
    bandwidthFacts: [["200Gbps+", "Total proxy network bandwidth"], ["10Gbps+", "Enterprise per-project capability"], ["PoC", "Confirm with representative workloads"]]
  },
  faqs: [
    ["Can every proxy product target all 190+ locations?", "No. Residential Rotating Proxy supports country or region selection. Scraping Rotating Proxy provides broad region presets. Unlimited Rotating Residential uses one package region. Static datacenter and static residential each support 69 locations."],
    ["Which products support SESSION?", "Residential rotating proxy supports SESSION in authentication. The pure residential pool in Scraping rotating proxy also supports SESSION. Other products retain exits through a port rotation window or a fixed IP."],
    ["When do I choose the exit location?", "Choose it when extracting proxies, not when purchasing a plan. Purchasing does not lock a location."],
    ["Is 200Gbps+ available to one customer?", "No. It is total 123Proxy proxy network bandwidth. Qualified enterprise high-bandwidth projects are assessed at 10Gbps+ aggregate per-project capability and validated with real workloads."],
    ["Does 80M+ mean 80 million dedicated IPs are online at once?", "No. 80M+ is the scale of the global residential resource pool, not a guarantee that every IP is simultaneously online or dedicated to one customer."],
    ["What should we test before production?", "Test real targets, locations, request types, concurrency, and completion windows. Record useful response rate, latency, bytes, retries, location accuracy, and useful throughput."]
  ],
  cta: {
    eyebrow: "START WITH REAL REQUESTS",
    title: "Validate location, session, and throughput with real targets",
    text: "Rotating products with trial options can be tested directly. The two static products do not offer free trials. Contact a solutions engineer for custom pools or high-bandwidth projects.",
    primaryLabel: "Free 1GB trial",
    primaryUrl: registerUrl,
    secondaryLabel: "Contact a solutions engineer",
    secondaryUrl: "../contact.html#solutions"
  }
};

export function renderNetworkMain(page, { icon, escapeHtml, locale, assetPrefix = "" }) {
  const isEnglish = locale === "en";
  const labels = isEnglish
    ? {
        home: "Home",
        page: "Global network",
        mapLabel: "Illustration of the 123Proxy global proxy network",
        coverageKicker: "01 / Global coverage",
        resourcesKicker: "02 / Routing capability",
        routingKicker: "03 / Developer routing",
        qualityKicker: "04 / Network quality",
        faqKicker: "05 / FAQ",
        faqTitle: "Questions before production",
        nav: ["Coverage", "Proxy resources", "Developer routing", "Quality", "FAQ"],
        openProduct: "Product details",
        mapStatus: "GLOBAL ROUTING READY",
        mapCaption: "Network availability changes with product, location, and real-time resources.",
        qualityMeasure: "Operational signal"
      }
    : {
        home: "首页",
        page: "全球网络",
        mapLabel: "123Proxy 全球代理网络覆盖示意",
        coverageKicker: "01 / 全球覆盖",
        resourcesKicker: "02 / 路由能力",
        routingKicker: "03 / 开发者接入",
        qualityKicker: "04 / 运行指标",
        faqKicker: "05 / 常见问题",
        faqTitle: "全球代理网络常见问题",
        nav: ["全球覆盖", "代理产品", "开发者接入", "运行指标", "常见问题"],
        openProduct: "查看产品",
        mapStatus: "GLOBAL ROUTING READY",
        mapCaption: "全球代理资源覆盖示意，具体位置以产品和实时库存为准。",
        qualityMeasure: "运行指标"
      };

  return `
    <main class="network-main">
      <section class="network-hero">
        <div class="container">
          <div class="network-breadcrumb"><a href="index.html">${labels.home}</a><span>/</span><strong>${labels.page}</strong></div>
          <div class="network-hero-grid">
            <div class="network-hero-copy">
              <div class="network-eyebrow">${escapeHtml(page.eyebrow)}</div>
              <h1>${page.titleLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</h1>
              <p>${escapeHtml(page.lead)}</p>
              <div class="network-actions">
                <a class="btn btn-primary" href="${page.primaryUrl}" target="_blank" rel="noreferrer">${icon("flask-conical")}${escapeHtml(page.primaryLabel)}</a>
                <a class="network-text-action" href="${page.secondaryUrl}">${escapeHtml(page.secondaryLabel)}${icon("arrow-right")}</a>
              </div>
            </div>
            <figure class="network-map-hero">
              <div class="network-map-topline"><span>123PROXY NETWORK</span><span>${icon("activity")}${labels.mapStatus}</span></div>
              <img src="${assetPrefix}assets/global-network-map.png" alt="${escapeHtml(labels.mapLabel)}" width="1672" height="941">
              <figcaption>${escapeHtml(labels.mapCaption)}</figcaption>
            </figure>
          </div>
          <div class="network-metrics">
            ${page.metrics.map(([value, label]) => `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
          </div>
        </div>
      </section>

      <nav class="network-page-nav" aria-label="${escapeHtml(labels.page)}">
        <div class="container">
          <a class="is-active" href="#coverage">${labels.nav[0]}</a>
          <a href="#resources">${labels.nav[1]}</a>
          <a href="#routing">${labels.nav[2]}</a>
          <a href="#quality">${labels.nav[3]}</a>
          <a href="#faq">${labels.nav[4]}</a>
        </div>
      </nav>

      <section class="network-section" id="coverage">
        <div class="container">
          <header class="network-section-head">
            <span>${labels.coverageKicker}</span>
            <div><h2>${escapeHtml(page.coverage.title)}</h2><p>${escapeHtml(page.coverage.text)}</p></div>
          </header>
          <div class="network-region-list">
            ${page.coverage.regions.map(([name, englishName, detail], index) => `
              <article>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <div><h3>${escapeHtml(name)}</h3><small>${escapeHtml(englishName)}</small></div>
                <p>${escapeHtml(detail)}</p>
                ${icon("arrow-up-right")}
              </article>`).join("")}
          </div>
          <aside class="network-coverage-note">
            <span>${icon("info")}</span>
            <div><strong>${escapeHtml(page.coverage.noteTitle)}</strong><p>${escapeHtml(page.coverage.noteText)}</p></div>
          </aside>
        </div>
      </section>

      <section class="network-section network-section-soft" id="resources">
        <div class="container">
          <header class="network-section-head">
            <span>${labels.resourcesKicker}</span>
            <div><h2>${escapeHtml(page.resources.title)}</h2><p>${escapeHtml(page.resources.text)}</p></div>
          </header>
          <div class="network-resource-table-wrap">
            <div class="network-resource-table">
              <div class="network-resource-head">
                ${page.resources.headers.map((header) => `<span>${escapeHtml(header)}</span>`).join("")}
              </div>
              ${page.resources.rows.map((row) => `
                <article class="network-resource-row">
                  <div class="network-resource-name"><span>${icon(row.icon)}</span><div><h3>${escapeHtml(row.title)}</h3><a href="${row.href}">${labels.openProduct}${icon("arrow-right")}</a></div></div>
                  <p>${escapeHtml(row.location)}</p>
                  <p>${escapeHtml(row.session)}</p>
                  <p>${escapeHtml(row.fit)}</p>
                </article>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="network-section network-routing-section" id="routing">
        <div class="container">
          <header class="network-section-head">
            <span>${labels.routingKicker}</span>
            <div><h2>${escapeHtml(page.routing.title)}</h2><p>${escapeHtml(page.routing.text)}</p></div>
          </header>
          <div class="network-route-line">
            ${page.routing.steps.map(([index, title, detail], stepIndex) => `
              <div class="network-route-step">
                <span>${escapeHtml(index)}</span>
                <strong>${escapeHtml(title)}</strong>
                <small>${escapeHtml(detail)}</small>
              </div>
              ${stepIndex < page.routing.steps.length - 1 ? `<i>${icon("arrow-right")}</i>` : ""}`).join("")}
          </div>
          <div class="network-developer-grid">
            <div class="network-code">
              <div class="network-code-head"><span>${icon("terminal")}${escapeHtml(page.routing.codeLabel)}</span><small>STANDARD PROXY ACCESS</small></div>
              <pre><code>${escapeHtml(page.routing.code)}</code></pre>
            </div>
            <dl class="network-route-points">
              ${page.routing.points.map(([term, detail]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd></div>`).join("")}
            </dl>
          </div>
        </div>
      </section>

      <section class="network-section network-section-dark" id="quality">
        <div class="container">
          <header class="network-section-head">
            <span>${labels.qualityKicker}</span>
            <div><h2>${escapeHtml(page.quality.title)}</h2><p>${escapeHtml(page.quality.text)}</p></div>
          </header>
          <div class="network-quality-list">
            ${page.quality.items.map(([title, detail, itemIcon]) => `
              <article><span>${icon(itemIcon)}</span><small>${labels.qualityMeasure}</small><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail)}</p></article>`).join("")}
          </div>
          <div class="network-bandwidth">
            <div><h3>${escapeHtml(page.quality.bandwidthTitle)}</h3><p>${escapeHtml(page.quality.bandwidthText)}</p></div>
            <dl>${page.quality.bandwidthFacts.map(([value, label]) => `<div><dt>${escapeHtml(value)}</dt><dd>${escapeHtml(label)}</dd></div>`).join("")}</dl>
          </div>
        </div>
      </section>

      <section class="network-section" id="faq">
        <div class="container network-faq-layout">
          <header><span>${labels.faqKicker}</span><h2>${labels.faqTitle}</h2></header>
          <div class="network-faq-list">
            ${page.faqs.map(([question, answer], index) => `
              <details${index === 0 ? " open" : ""}>
                <summary>${escapeHtml(question)}${icon("plus")}</summary>
                <p>${escapeHtml(answer)}</p>
              </details>`).join("")}
          </div>
        </div>
      </section>

      <section class="network-cta">
        <div class="container">
          <div><span>${escapeHtml(page.cta.eyebrow)}</span><h2>${escapeHtml(page.cta.title)}</h2><p>${escapeHtml(page.cta.text)}</p></div>
          <div class="network-cta-actions">
            <a class="btn btn-primary" href="${page.cta.primaryUrl}" target="_blank" rel="noreferrer">${icon("flask-conical")}${escapeHtml(page.cta.primaryLabel)}</a>
            <a class="network-text-action" href="${page.cta.secondaryUrl}">${escapeHtml(page.cta.secondaryLabel)}${icon("arrow-right")}</a>
          </div>
        </div>
      </section>
    </main>`;
}
