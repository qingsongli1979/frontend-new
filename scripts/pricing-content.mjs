export const pricingZh = {
  key: "pricing",
  file: "pricing.html",
  zhFile: "pricing.html",
  name: "代理产品价格",
  serviceType: "代理产品定价",
  title: "代理IP价格与免费测试 - 5类标准代理产品 | 123Proxy",
  description: "查看 123Proxy 隧道代理、隧道住宅代理、不限量动态住宅、长效静态代理和长效静态住宅代理的实时价格、免费测试与购买条件。",
  eyebrow: "PRICING & FREE TRIAL",
  heading: "代理价格与免费测试",
  lead: "五类标准代理产品实时计价；三类动态产品提供免费测试，两类静态产品直接购买付费套餐。",
  apiLoading: "正在获取实时价格",
  apiNote: "付费价格实时更新，免费测试条件按产品显示。",
  complianceTitle: "使用前请确认",
  complianceText: "123Proxy 仅提供代理 IP 服务，不支持任何 VPN 或翻墙类功能。抓取程序需部署在海外，严禁使用代理 IP 从事任何违法犯罪行为。",
  highBandwidth: {
    eyebrow: "HIGH-BANDWIDTH PROXY",
    title: "高带宽代理 IP 按项目报价",
    text: "面向视频、图片、代码和公开文档的大规模下载，按目标站点、任务规模、工作节点与完成周期配置代理池和聚合带宽。",
    facts: [
      ["10Gbps+", "单项目聚合能力"],
      ["不限流量", "不按累计流量计费"],
      ["定制代理池", "按目标与任务配置"],
      ["项目制报价", "测试后确认方案"]
    ],
    note: "高带宽代理 IP 不属于五类标准套餐。提交目标站点、预计数据量、完成周期和并发规模后，由项目工程师提供测试与报价。",
    primaryLabel: "获取项目报价",
    primaryUrl: "contact.html#solutions",
    secondaryLabel: "查看产品详情",
    secondaryUrl: "high-bandwidth-proxy.html"
  },
  comparison: {
    eyebrow: "PRODUCT COMPARISON",
    title: "五类标准代理产品对比",
    text: "按代理资源、地区能力、轮转方式和计费模型选择适合当前采集任务的产品。",
    products: [
      ["隧道代理", "pricing.html?product=tunnel"],
      ["隧道住宅代理", "pricing.html?product=residential"],
      ["不限量动态住宅", "pricing.html?product=unlimited"],
      ["长效静态代理", "pricing.html?product=static-datacenter"],
      ["长效静态住宅", "pricing.html?product=static-residential"]
    ],
    rows: [
      ["代理资源", "爬虫混合池或纯住宅池", "8000万+住宅 IP 池", "动态住宅 IP", "独享数据中心 IP", "独享住宅 ISP IP"],
      ["出口地区", "默认全球随机；提取时可选欧美、北美、欧洲、亚洲、美国或日韩", "提取时选择国家或地区", "提取时按套餐设置地区", "提取时从 69 个支持地区中选择", "提取时从 69 个支持地区中选择"],
      ["出口保持方式", "混合池自动轮转；纯住宅池支持 SESSION", "鉴权可指定 SESSION", "每端口固定 3–30 分钟", "套餐期内固定 IP", "套餐期内固定住宅 IP"],
      ["计费方式", "按并发线程或流量", "仅按实际传输流量", "按端口与购买时长", "按固定 IP 与购买时长", "按固定住宅 IP 与购买时长"],
      ["鉴权方式", "代理账密 / 套餐 IP 白名单", "代理账密 / 套餐 IP 白名单", "代理账密 / 套餐 IP 白名单", "仅代理账密", "仅代理账密"],
      ["流量与并发", "线程套餐不限流量；流量套餐按量扣减", "按流量扣减，不限制请求数量", "每端口不限流量、不限并发", "不限流量，受单 IP 带宽限制", "不限流量，受单 IP 带宽限制"],
      ["免费测试", "5 线程 4 小时，或 800MB", "200MB 流量", "5 个端口 2 小时", "不提供", "不提供"],
      ["适合任务", "通用爬虫、高并发轮换", "地区定向与住宅 SESSION", "浏览器自动化与长期采集", "目标系统白名单、固定出口与自动化", "长期住宅身份与地区会话"]
    ]
  },
  faqs: [
    ["什么是隧道代理？", "隧道代理通过固定服务器地址和端口接入，云端负责自动选择和轮转出口 IP，开发者无需自行维护代理池。123Proxy 隧道代理提供爬虫混合池和纯住宅池。"],
    ["什么是隧道代理 IP？", "隧道代理 IP 是通过固定隧道入口中继请求时使用的动态出口 IP，支持 HTTP(S) 与 SOCKS 协议，可按设定周期自动轮转。"],
    ["隧道代理按并发线程和按流量有什么区别？", "按并发线程套餐限制同时在途的请求数，但不按累计流量计费；按流量套餐按照实际代理传输流量扣减。两种方式都适合代码通过代理协议直接接入。"],
    ["为什么浏览器会消耗较多并发线程？", "浏览器打开一个页面时会同时请求 HTML、图片、CSS、JavaScript 等资源，通常需要 10–20 个并发线程。因此浏览器任务应按页面资源数量评估并发，或考虑不限量动态住宅。"],
    ["什么是不限量 IP 代理？", "不限量代理在套餐有效期内不按累计流量收费。不限量动态住宅按端口购买，每个端口不限并发；隧道代理的并发线程套餐同样不按累计流量计费。"],
    ["什么是隧道住宅代理？", "隧道住宅代理使用 8000 万+住宅 IP 池，覆盖 190+ 国家和地区，支持国家或地区定位与 SESSION，并且仅按流量购买。"],
    ["123Proxy 提供国内代理 IP 吗？", "不提供。123Proxy 的标准代理产品均为海外代理 IP，抓取程序需要部署在海外网络环境。"],
    ["免费测试如何申请？", "隧道代理、隧道住宅代理和不限量动态住宅可选择“免费测试”后联系客户服务企业微信申请；长效静态代理与长效静态住宅不提供免费测试。具体资格与开通方式由客服专员确认。"],
    ["购买套餐时需要选择出口地区吗？", "不需要。购买套餐不会锁定地区。隧道代理默认全球随机，提取时可选粗粒度地区；其他产品也在提取代理时按各自能力选择地区。"],
    ["为什么最终价格还需要在控制台确认？", "公开接口返回标准套餐报价；地区库存、促销资格、轮转参数和订单状态需要在控制台确认后才能提交。"]
  ]
};

export const pricingEn = {
  key: "pricing",
  file: "pricing.html",
  zhFile: "pricing.html",
  name: "Proxy pricing",
  serviceType: "Proxy product pricing",
  title: "Proxy Pricing and Free Trials - 5 Standard Products | 123Proxy",
  description: "View live pricing, free trials, and purchase conditions for five 123Proxy proxy products.",
  eyebrow: "PRICING & FREE TRIAL",
  heading: "Proxy pricing and plans",
  lead: "Live pricing for five standard proxy products. Three rotating products offer free trials; the two static products start with paid plans.",
  apiLoading: "Loading live pricing",
  apiNote: "Paid plans come from the live backend. Free-trial limits follow product rules.",
  complianceTitle: "Confirm before use",
  complianceText: "123Proxy provides proxy IP services only. It does not provide VPN or network-circumvention functions. Scraping programs must be deployed outside mainland China, and proxy IPs must not be used for illegal activity.",
  highBandwidth: {
    eyebrow: "HIGH-BANDWIDTH PROXY",
    title: "Project pricing for high-bandwidth proxy IPs",
    text: "For large-scale video, image, code, and public document downloads, proxy pools and aggregate bandwidth are configured around target sites, workload size, workers, and completion windows.",
    facts: [
      ["10Gbps+", "Aggregate capacity per project"],
      ["Unmetered", "No accumulated traffic billing"],
      ["Custom pool", "Configured by target and workload"],
      ["Project quote", "Confirmed after testing"]
    ],
    note: "High-bandwidth proxy IPs are not one of the five standard plans. Share target sites, expected data volume, completion window, and concurrency for a project test and quote.",
    primaryLabel: "Request project pricing",
    primaryUrl: "../contact.html#solutions",
    secondaryLabel: "View product details",
    secondaryUrl: "high-bandwidth-proxy.html"
  },
  comparison: {
    eyebrow: "PRODUCT COMPARISON",
    title: "Compare five standard proxy products",
    text: "Choose by proxy resource, location support, rotation behavior, and billing model.",
    products: [
      ["Scraping Rotating Proxy", "pricing.html?product=tunnel"],
      ["Residential Rotating Proxy", "pricing.html?product=residential"],
      ["Unlimited Rotating Residential", "pricing.html?product=unlimited"],
      ["Static Datacenter Proxy", "pricing.html?product=static-datacenter"],
      ["Static Residential Proxy", "pricing.html?product=static-residential"]
    ],
    rows: [
      ["Proxy resource", "Crawler mixed pool or pure residential pool", "80M+ residential IP pool", "Rotating residential IPs", "Dedicated datacenter IP", "Dedicated residential ISP IP"],
      ["Exit location", "Global random by default; optionally choose Europe & America, North America, Europe, Asia, US, or Japan & Korea at extraction", "Choose country or region at extraction", "Set one package region at extraction", "Choose from 69 supported locations at extraction", "Choose from 69 supported locations at extraction"],
      ["Exit retention", "Mixed pool rotates; pure residential supports SESSION", "SESSION in authentication", "Each port retains an exit for 3–30 minutes", "Fixed IP during the plan", "Fixed residential IP during the plan"],
      ["Billing", "Concurrent threads or traffic", "Transferred traffic only", "Ports and service period", "Fixed IPs and service period", "Fixed residential IPs and service period"],
      ["Authentication", "Proxy credentials / package IP allowlist", "Proxy credentials / package IP allowlist", "Proxy credentials / package IP allowlist", "Proxy credentials only", "Proxy credentials only"],
      ["Traffic and concurrency", "Thread plans are unmetered; traffic plans are metered", "Traffic is metered; request count is not", "Unlimited traffic and concurrency per port", "Unmetered traffic within IP bandwidth", "Unmetered traffic within IP bandwidth"],
      ["Free trial", "5 threads for 4 hours, or 800MB", "200MB traffic", "5 ports for 2 hours", "Not available", "Not available"],
      ["Best for", "General scraping and high-concurrency rotation", "Geo-targeted residential sessions", "Browser automation and long-running collection", "Target-system allowlists, fixed exits, and automation", "Persistent residential identity and regional sessions"]
    ]
  },
  faqs: [
    ["What is a rotating tunnel proxy?", "It uses a fixed server address and port while the cloud selects and rotates exit IPs. Developers do not need to maintain a proxy pool. 123Proxy provides a crawler mixed pool and a pure residential pool."],
    ["What is a tunnel proxy IP?", "It is a dynamic exit IP used when requests are relayed through a fixed tunnel gateway. HTTP(S) and SOCKS are supported, with automatic rotation by the selected interval."],
    ["How do concurrent-thread and traffic plans differ?", "Concurrent-thread plans limit simultaneous in-flight requests without metering accumulated traffic. Traffic plans meter the actual bytes transferred through the proxy."],
    ["Why do browsers consume more concurrent threads?", "A browser loads HTML, images, CSS, JavaScript, and other resources in parallel. One page commonly consumes 10–20 threads, so browser workloads need extra concurrency or an unlimited-port product."],
    ["What is an unlimited proxy?", "Unlimited plans do not meter accumulated traffic during the service period. Unlimited rotating residential is purchased by port with unlimited concurrency per port, while concurrent tunnel plans are also unmetered by traffic."],
    ["What is a residential rotating proxy?", "It uses an 80M+ residential IP pool across 190+ countries and regions, supports country or region targeting and SESSION, and is purchased by traffic only."],
    ["Does 123Proxy provide mainland China proxy IPs?", "No. Standard 123Proxy products provide overseas proxy IPs, and scraping programs must run in an overseas network environment."],
    ["How do I request a free trial?", "Scraping Rotating Proxy, Residential Rotating Proxy, and Unlimited Rotating Residential offer a free-trial option through customer service. Static Datacenter Proxy and Static Residential Proxy do not provide free trials."],
    ["Do I choose an exit location when purchasing?", "No. Purchasing a plan does not lock a location. Scraping Rotating Proxy is globally random by default with optional broad presets at extraction; other products also apply their location options when proxies are extracted."],
    ["Why is the final amount confirmed in the console?", "The public API provides standard plan prices. Location inventory, promotion eligibility, rotation parameters, and order state must be confirmed in the console."]
  ]
};

export function renderPricingMain(page, { icon, escapeHtml, locale }) {
  const isEnglish = locale === "en";
  const labels = isEnglish
    ? {
        home: "Home",
        current: "Pricing",
        productNav: "Proxy product",
        loading: "Loading product plans...",
        configTitle: "Plan configuration",
        summaryTitle: "Current selection",
        estimatedTotal: "Total",
        continue: "Continue in console",
        orderNote: "Customer service confirms free-trial eligibility. Confirm paid-plan inventory, location, and final amount in the console.",
        faqKicker: "FAQ",
        faqTitle: "Questions before purchase",
        retry: "Retry",
        apiLabel: "LIVE PRICE API"
      }
    : {
        home: "首页",
        current: "价格",
        productNav: "代理产品",
        loading: "正在加载产品套餐...",
        configTitle: "套餐配置",
        summaryTitle: "当前选择",
        estimatedTotal: "总计",
        continue: "前往控制台",
        orderNote: "免费测试资格由客服专员确认；付费套餐库存、地区与最终金额以控制台确认结果为准。",
        faqKicker: "FAQ",
        faqTitle: "购买前常见问题",
        retry: "重新获取",
        apiLabel: "实时价格接口"
      };

  return `
    <main class="pricing-main">
      <section class="pricing-workspace" id="configurator">
        <div class="container">
          <div class="pricing-breadcrumb"><a href="index.html">${labels.home}</a><span>/</span><strong>${labels.current}</strong></div>

          <header class="pricing-focus-head">
            <div>
              <span class="pricing-eyebrow">${escapeHtml(page.eyebrow)}</span>
              <h1>${escapeHtml(page.heading)}</h1>
              <p>${escapeHtml(page.lead)}</p>
            </div>
            <div class="pricing-api-status is-loading" id="pricingDataStatus" role="status" aria-live="polite">
              <span class="pricing-api-dot"></span>
              <div><small>${labels.apiLabel}</small><strong id="pricingDataStatusText">${escapeHtml(page.apiLoading)}</strong></div>
              <button id="pricingRetry" type="button">${icon("refresh-cw")}<span>${labels.retry}</span></button>
            </div>
          </header>

          <div class="pricing-product-selector">
            <div class="pricing-product-selector-label">${labels.productNav}</div>
            <div class="pricing-product-tabs" id="pricingProductTabs" role="tablist"></div>
          </div>

          <div class="pricing-product-intro">
            <div>
              <span id="pricingProductEyebrow"></span>
              <h2 id="pricingProductName">${labels.loading}</h2>
              <p id="pricingProductDescription"></p>
            </div>
            <div class="pricing-product-points" id="pricingProductPoints"></div>
          </div>

          <div class="pricing-product-notice" id="pricingProductNotice">
            ${icon("info")}
            <p></p>
          </div>

          <div class="pricing-config-grid">
            <form class="pricing-config-form" id="pricingConfigForm">
              <div class="pricing-config-form-head"><span>${labels.configTitle}</span><small>${escapeHtml(page.apiNote)}</small></div>
              <div id="pricingConfigFields"></div>
              <div class="pricing-config-actions">
                <button class="pricing-icon-action" id="pricingReset" type="button">${icon("rotate-ccw")}<span>${isEnglish ? "Reset" : "重置"}</span></button>
                <button class="pricing-icon-action" id="pricingCopyLink" type="button">${icon("link-2")}<span>${isEnglish ? "Copy link" : "复制配置链接"}</span></button>
              </div>
            </form>

            <aside class="pricing-summary" aria-live="polite">
              <div class="pricing-summary-head"><span>${labels.summaryTitle}</span><strong id="pricingSummaryProduct"></strong></div>
              <dl class="pricing-summary-details" id="pricingSummaryDetails"></dl>
              <div class="pricing-summary-total">
                <span>${labels.estimatedTotal}</span>
                <div><small>¥</small><strong id="pricingTotal">0</strong><del id="pricingOriginalTotal"></del></div>
                <p id="pricingMonthlyEquivalent"></p>
              </div>
              <a class="btn btn-primary pricing-purchase" id="pricingPurchaseButton" href="https://console.123proxy.cn/app/#purchase?product=tunnel" target="_blank" rel="noreferrer">${icon("arrow-up-right")}<span>${labels.continue}</span></a>
              <p class="pricing-summary-note">${labels.orderNote}</p>
            </aside>
          </div>

          <div class="pricing-toast" id="pricingToast" role="status" aria-live="polite"></div>
          <noscript><p class="pricing-noscript">${isEnglish ? "JavaScript is required to load live pricing and configure plans." : "实时价格与套餐配置需要启用 JavaScript。"}</p></noscript>
        </div>
      </section>

      <section class="pricing-compliance">
        <div class="container">
          <span>${icon("shield-alert")}</span>
          <div><strong>${escapeHtml(page.complianceTitle)}</strong><p>${escapeHtml(page.complianceText)}</p></div>
        </div>
      </section>

      <section class="pricing-bandwidth" id="high-bandwidth">
        <div class="container pricing-bandwidth-layout">
          <div class="pricing-bandwidth-copy">
            <span>${escapeHtml(page.highBandwidth.eyebrow)}</span>
            <h2>${escapeHtml(page.highBandwidth.title)}</h2>
            <p>${escapeHtml(page.highBandwidth.text)}</p>
            <div class="pricing-bandwidth-actions">
              <a class="btn btn-primary" href="${page.highBandwidth.primaryUrl}">${icon("messages-square")}${escapeHtml(page.highBandwidth.primaryLabel)}</a>
              <a class="btn" href="${page.highBandwidth.secondaryUrl}">${escapeHtml(page.highBandwidth.secondaryLabel)}${icon("arrow-right")}</a>
            </div>
          </div>
          <div class="pricing-bandwidth-detail">
            <div class="pricing-bandwidth-facts">
              ${page.highBandwidth.facts.map(([value, label]) => `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
            </div>
            <p>${escapeHtml(page.highBandwidth.note)}</p>
          </div>
        </div>
      </section>

      <section class="pricing-comparison" id="comparison">
        <div class="container">
          <header class="pricing-comparison-head">
            <div>
              <span>${escapeHtml(page.comparison.eyebrow)}</span>
              <h2>${escapeHtml(page.comparison.title)}</h2>
            </div>
            <p>${escapeHtml(page.comparison.text)}</p>
          </header>
          <div class="pricing-comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">${isEnglish ? "Capability" : "对比项"}</th>
                  ${page.comparison.products.map(([name, href]) => `
                    <th scope="col"><a href="${href}"><strong>${escapeHtml(name)}</strong>${icon("arrow-up-right")}</a></th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${page.comparison.rows.map(([label, ...values]) => `
                  <tr>
                    <th scope="row">${escapeHtml(label)}</th>
                    ${values.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
          <p class="pricing-comparison-note">${isEnglish ? "Customer service confirms trial eligibility. Location inventory and paid-plan availability remain live in the console." : "免费测试资格与开通方式由客服专员确认；地区库存与付费套餐仍以控制台实时信息为准。"}</p>
        </div>
      </section>

      <section class="pricing-faq-section" id="faq">
        <div class="container pricing-faq-layout">
          <header><span>${labels.faqKicker}</span><h2>${labels.faqTitle}</h2></header>
          <div class="pricing-faq-list">
            ${page.faqs.map(([question, answer], index) => `
              <details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}${icon("plus")}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}
          </div>
        </div>
      </section>
    </main>`;
}
