export const developerGuidePages = {
  guideConcurrency: {
    key: "guide-concurrency",
    kind: "guide",
    guideKey: "concurrency",
    output: "developers/guides/concurrency-qps-performance/index.html",
    route: "/developers/guides/concurrency-qps-performance/",
    title: "代理并发、QPS与响应时间计算 | 123Proxy 开发者中心",
    description: "从在途请求、平均响应时间和目标站点限速出发，计算代理任务的并发、QPS与吞吐量，并说明浏览器资源请求如何消耗并发线程。",
    heading: "代理并发、QPS 与响应时间",
    productKeys: ["tunnel", "residential", "unlimitedResidential", "highBandwidth"],
    consoleProduct: "tunnel",
    faq: [
      {
        question: "50 并发是否一定能达到 50 QPS？",
        answer: "不一定。稳态近似关系是吞吐量约等于并发数除以平均端到端响应时间。若平均响应时间为 2 秒，50 个持续饱和的在途请求理论上约为 25 QPS；限速、重试、解析和任务队列会继续降低实际值。",
        href: "/developers/guides/proxy-errors-retries/#retry",
        linkLabel: "查看重试与退避策略"
      },
      {
        question: "浏览器打开一个页面为什么会占用多个并发线程？",
        answer: "浏览器除主文档外还会并行请求 JavaScript、CSS、图片、字体和接口。一个页面可能同时产生 10-20 条代理请求，实际数量取决于页面资源、缓存、资源拦截和浏览器连接调度。",
        href: "/developers/examples/selenium-proxy/",
        linkLabel: "查看 Selenium 完整案例"
      },
      {
        question: "并发线程套餐是否等于目标站点允许的并发？",
        answer: "不是。套餐并发是代理侧可同时承载的在途请求上限，目标站点仍可能有更低的频率限制。应按目标域名单独设置并发、QPS和退避策略。"
      }
    ]
  },
  guideSession: {
    key: "guide-session",
    kind: "guide",
    guideKey: "session",
    output: "developers/guides/session-geo-rotation/index.html",
    route: "/developers/guides/session-geo-rotation/",
    title: "代理 SESSION、地区定位与出口轮转 | 123Proxy 开发者中心",
    description: "解释123Proxy不同代理产品的SESSION、国家定位、全球随机、按请求轮转、固定周期轮转和静态出口边界。",
    heading: "SESSION、地区定位与出口轮转",
    productKeys: ["tunnel", "residential", "unlimitedResidential", "staticDatacenter", "staticResidential"],
    consoleProduct: "residential",
    faq: [
      {
        question: "SESSION 是否代表出口 IP 永远不变？",
        answer: "不是。SESSION 表示在设定时间窗口内尽量复用同一条粘性路由。到期、出口不可用或网络调度变化时仍可能重新分配，业务代码必须能处理出口变化。",
        href: "/developers/products/residential-rotating-proxy/#session",
        linkLabel: "查看隧道住宅 SESSION 格式"
      },
      {
        question: "购买套餐时需要选择国家吗？",
        answer: "不需要。地区均在提取或分配代理时决定。隧道代理可选粗粒度地区，隧道住宅可选国家或地区，不限量动态住宅按套餐统一设置，两类静态代理在分配固定 IP 时按库存选择。",
        href: "/pricing.html",
        linkLabel: "比较代理套餐"
      },
      {
        question: "不限量动态住宅能否通过 SESSION 固定出口？",
        answer: "不能。它不使用 SESSION，而是每个套餐端口在配置的 3-30 分钟周期内固定出口并自动轮转；同一套餐的地区配置对全部端口生效。"
      }
    ]
  },
  guideErrors: {
    key: "guide-errors",
    kind: "guide",
    guideKey: "errors",
    output: "developers/guides/proxy-errors-retries/index.html",
    route: "/developers/guides/proxy-errors-retries/",
    title: "代理407、403、429、超时与重试排查 | 123Proxy 开发者中心",
    description: "按DNS、TCP、TLS、代理认证、目标响应和解析六层排查代理请求，处理407、403、429、超时、连接池与退避重试。",
    heading: "代理错误、超时与重试排查",
    productKeys: ["tunnel", "residential", "unlimitedResidential", "staticDatacenter", "staticResidential"],
    consoleProduct: "tunnel",
    faq: [
      {
        question: "代理返回 407 时是否应该更换出口 IP？",
        answer: "通常不应该。407 是代理认证失败，应先检查代理用户、密码、完整地区或SESSION用户名，以及套餐白名单是否绑定到当前服务器公网IPv4。更换出口不会修复错误账密。",
        href: "/developers/getting-started/#authentication",
        linkLabel: "查看代理认证"
      },
      {
        question: "403 和 429 是否代表代理网关故障？",
        answer: "通常不是。403 与429一般来自目标站点，分别表示拒绝访问或频率限制。应先记录响应头和目标域名，再检查授权、请求频率、Retry-After、账号状态和访问规则。",
        href: "/developers/guides/concurrency-qps-performance/",
        linkLabel: "计算目标站点并发与QPS"
      },
      {
        question: "遇到 TLS 错误能否直接关闭证书校验？",
        answer: "不建议。关闭校验会失去服务器身份验证。应先确认系统时间、CA证书、SNI、代理协议和目标证书链，再判断是否为受控测试环境中的临时诊断。"
      }
    ]
  },
  guideSelection: {
    key: "guide-selection",
    kind: "guide",
    guideKey: "selection",
    output: "developers/guides/proxy-product-selection/index.html",
    route: "/developers/guides/proxy-product-selection/",
    title: "网页爬虫与 AI 爬虫代理产品选型 | 123Proxy 开发者中心",
    description: "按出口身份、地区粒度、轮转方式、流量、并发和固定IP需求，对比123Proxy隧道代理、住宅代理、不限量动态住宅与静态代理。",
    heading: "代理产品选型边界",
    productKeys: ["highBandwidth", "tunnel", "residential", "unlimitedResidential", "staticDatacenter", "staticResidential"],
    consoleProduct: "tunnel",
    faq: [
      {
        question: "普通网页爬取应该先从哪个产品开始？",
        answer: "没有国家精确定位或固定出口要求时，可先用隧道代理的爬虫混合池验证。它默认全球随机，少量数据中心出口通常能提高公开网页的爬取速度，并支持流量或并发线程套餐。",
        href: "/developers/products/scraping-rotating-proxy/",
        linkLabel: "查看隧道代理接入手册"
      },
      {
        question: "浏览器自动化是否一定要用不限量动态住宅？",
        answer: "不一定。短期、低频或国家定向任务可使用隧道住宅按流量套餐；持续运行、资源下载量大且并发较高时，不限量动态住宅的端口和带宽模型通常更易控制预算。",
        href: "/developers/guides/concurrency-qps-performance/#browser",
        linkLabel: "了解浏览器并发消耗"
      },
      {
        question: "需要长期固定出口时应该选择哪一类？",
        answer: "需要稳定数据中心出口时选择长效静态代理，需要固定住宅ISP身份时选择长效静态住宅。两类产品均直连分配的固定代理IP，不使用SESSION，也不支持123Proxy套餐白名单认证。"
      }
    ]
  }
};

export const developerGuideOrder = [
  "guideConcurrency",
  "guideSession",
  "guideErrors",
  "guideSelection"
];

export const developerGuideSearch = [
  {
    title: "代理并发、QPS与响应时间",
    section: "工程指南",
    href: "/developers/guides/concurrency-qps-performance/",
    keywords: "并发线程 qps 吞吐量 响应时间 p95 浏览器资源 worker little law"
  },
  {
    title: "SESSION、地区定位与出口轮转",
    section: "工程指南",
    href: "/developers/guides/session-geo-rotation/",
    keywords: "session sticky geo country region rotation 全球随机 国家定位 固定出口"
  },
  {
    title: "代理错误、超时与重试排查",
    section: "工程指南",
    href: "/developers/guides/proxy-errors-retries/",
    keywords: "407 403 429 timeout tls dns tcp retry backoff connection pool"
  },
  {
    title: "代理产品选型边界",
    section: "工程指南",
    href: "/developers/guides/proxy-product-selection/",
    keywords: "代理选型 网页爬虫 AI爬虫 隧道住宅 不限量 静态 高带宽"
  }
];

const diagnosticCurl = `export PROXY_USER="YOUR_PROXY_USER"
export PROXY_PASS="YOUR_PROXY_PASSWORD"

curl --verbose --fail-with-body \
  --proxy "http://proxy.123proxy.cn:36923" \
  --proxy-user "\${PROXY_USER}:\${PROXY_PASS}" \
  --connect-timeout 15 \
  --max-time 30 \
  "https://httpbin.org/status/200"`;

const retryPython = `# python -m pip install requests
import random
import time

import requests

RETRYABLE = {429, 500, 502, 503, 504}


def get_with_backoff(session, url, proxies, attempts=4):
    for attempt in range(attempts):
        try:
            response = session.get(
                url,
                proxies=proxies,
                timeout=(15, 30),
            )
            if response.status_code not in RETRYABLE:
                response.raise_for_status()
                return response

            retry_after = response.headers.get("Retry-After")
            if retry_after and retry_after.isdigit():
                delay = min(float(retry_after), 60)
            else:
                delay = min(2 ** attempt + random.random(), 30)
        except (requests.ConnectTimeout, requests.ReadTimeout):
            delay = min(2 ** attempt + random.random(), 30)

        if attempt == attempts - 1:
            raise RuntimeError("request exhausted retry budget")
        time.sleep(delay)

    raise RuntimeError("unreachable")`;

function guideHeader(page, icon, facts, lead, primaryHref, primaryLabel, secondaryHref, secondaryLabel) {
  return `
    <nav class="docs-breadcrumb" aria-label="面包屑">
      <a href="/developers/">开发者中心</a>${icon("chevron-right")}
      <span>工程指南</span>${icon("chevron-right")}
      <span>${page.heading}</span>
    </nav>
    <header class="docs-article-header">
      <span class="docs-eyebrow">${icon("book-open-check")}ENGINEERING GUIDE</span>
      <h1>${page.heading}</h1>
      <p>${lead}</p>
      <div class="docs-product-facts">
        ${facts.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("")}
      </div>
      <div class="docs-article-actions">
        <a class="btn btn-primary" href="${primaryHref}">${icon("terminal")}${primaryLabel}</a>
        <a class="btn docs-secondary-button" href="${secondaryHref}">${icon("arrow-up-right")}${secondaryLabel}</a>
      </div>
    </header>`;
}

function faqMarkup(page, icon) {
  return `
    <div class="docs-troubleshooting">
      ${page.faq.map((item, index) => `
        <details${index === 0 ? " open" : ""}>
          <summary>${item.question}${icon("chevron-down")}</summary>
          <p>${item.answer}${item.href ? ` <a class="docs-inline-action" href="${item.href}">${item.linkLabel}${icon("arrow-right")}</a>` : ""}</p>
        </details>`).join("")}
    </div>`;
}

function concurrencyGuide(page, helpers) {
  const { icon, articleLayout } = helpers;
  const content = `
    ${guideHeader(
      page,
      icon,
      [["核心变量", "并发 / QPS / 延迟"], ["统计窗口", "稳态任务"], ["浏览器", "按资源请求计数"], ["目标", "可预测吞吐"]],
      "并发不是每秒请求数。先测量一次请求从发出到收到完整响应的端到端耗时，再结合在途请求上限、目标站点频率和任务处理开销估算吞吐量。",
      "https://console.123proxy.cn/app/#extract?product=tunnel",
      "打开隧道代理提取",
      "/pricing.html?product=tunnel",
      "查看并发与流量套餐"
    )}

    <section id="model">
      <div class="docs-section-title"><span>01</span><div><small>CAPACITY MODEL</small><h2>先区分并发、QPS 与响应时间</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>指标</span><span>工程含义</span><span>测量方式</span></div>
        <div><strong>并发线程</strong><span>某一时刻仍在等待结果的在途代理请求数</span><span>客户端活跃请求、连接池和代理套餐共同约束</span></div>
        <div><strong>QPS</strong><span>每秒完成或发出的请求数量，必须说明统计口径</span><span>按目标域名、状态码和时间窗口聚合</span></div>
        <div><strong>响应时间</strong><span>DNS、连接、TLS、代理转发、目标处理和下载的总耗时</span><span>同时记录平均值、p50、p95 与 p99</span></div>
        <div><strong>吞吐量</strong><span>单位时间内获得的有效页面、对象或字节数</span><span>不要只统计HTTP 200，还要验证业务数据</span></div>
      </div>
    </section>

    <section id="formula">
      <div class="docs-section-title"><span>02</span><div><small>STEADY-STATE ESTIMATE</small><h2>用在途请求和延迟估算吞吐</h2></div></div>
      <p>在请求持续供应、连接稳定且没有额外限速的稳态窗口内，可以使用 Little 定律对应的近似关系做容量起点。响应时间必须换算为秒。</p>
      <div class="docs-result">
        <span>近似关系</span>
        <code>完成 QPS ≈ 平均在途请求数 ÷ 平均端到端响应时间（秒）</code>
        <p>这是容量估算，不是承诺值。目标站点限速、重试、队列空闲、响应体大小、解析和存储都会让实际吞吐更低。</p>
      </div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>平均在途请求</span><span>平均响应时间</span><span>理论完成 QPS</span></div>
        <div><strong>20</strong><span>0.5 秒</span><span>约 40 QPS</span></div>
        <div><strong>50</strong><span>1 秒</span><span>约 50 QPS</span></div>
        <div><strong>50</strong><span>2 秒</span><span>约 25 QPS</span></div>
        <div><strong>100</strong><span>4 秒</span><span>约 25 QPS</span></div>
      </div>
      <div class="docs-callout is-warning">
        ${icon("triangle-alert")}
        <div><strong>不要用增加并发掩盖高延迟</strong><p>当 p95 持续上升、429 增多或有效数据率下降时，继续增加并发通常只会放大排队与重试。应先定位目标限速、连接复用、响应体大小和解析瓶颈。</p></div>
      </div>
    </section>

    <section id="browser">
      <div class="docs-section-title"><span>03</span><div><small>BROWSER REQUEST MODEL</small><h2>一个浏览器页面不是一个代理请求</h2></div></div>
      <p>Requests、Axios 等 HTTP 客户端通常由代码显式决定每一次请求；浏览器则会根据页面自动并行加载资源。一个页面可能同时消耗 10-20 个并发线程，也可能更多。</p>
      <div class="docs-fact-list">
        <div><strong>主文档</strong><p>页面导航本身的 HTML 请求，之后还会触发解析与子资源发现。</p></div>
        <div><strong>静态资源</strong><p>JavaScript、CSS、图片、字体和媒体文件可能同时发起多个连接。</p></div>
        <div><strong>接口请求</strong><p>XHR、Fetch、GraphQL、埋点与长轮询会在页面加载后继续占用连接。</p></div>
      </div>
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>按 BrowserContext 或 worker 限制并发</strong><small>不要把浏览器数量直接等同于代理线程数。</small></span></div>
        <div>${icon("check")}<span><strong>拦截不需要的资源</strong><small>确认任务只需要DOM或接口数据时，可阻止图片、字体或媒体。</small></span></div>
        <div>${icon("check")}<span><strong>测量真实页面</strong><small>记录每次导航的代理请求数量、总字节和完成时间。</small></span></div>
        <div>${icon("check")}<span><strong>复用浏览器进程</strong><small>按任务隔离Context，避免每页重复启动Chromium。</small></span></div>
      </div>
      <a class="docs-inline-action" href="/developers/examples/selenium-proxy/">运行 Selenium 浏览器代理案例${icon("arrow-right")}</a>
    </section>

    <section id="measure">
      <div class="docs-section-title"><span>04</span><div><small>OBSERVABILITY</small><h2>记录能解释容量的指标</h2></div></div>
      <div class="docs-format-table">
        <div><code>request_started_at</code><span>请求或导航开始时间</span></div>
        <div><code>duration_ms</code><span>收到完整响应或页面达到完成条件的耗时</span></div>
        <div><code>status_code</code><span>区分代理认证、目标拒绝、限速与服务端错误</span></div>
        <div><code>bytes_received</code><span>评估流量套餐与大对象下载成本</span></div>
        <div><code>retry_count</code><span>观察重试是否掩盖目标站点或网络问题</span></div>
        <div><code>target_host</code><span>按目标域名独立计算QPS与错误率</span></div>
        <div><code>session_id</code><span>需要粘性路由时定位同一SESSION的行为</span></div>
        <div><code>valid_record_count</code><span>用有效数据而不是HTTP成功数衡量吞吐</span></div>
      </div>
    </section>

    <section id="tuning">
      <div class="docs-section-title"><span>05</span><div><small>TUNING LOOP</small><h2>用小步阶梯找到稳定并发</h2></div></div>
      <ol class="docs-number-list">
        <li><span>1</span><div><strong>从低并发建立基线</strong><p>先确认代理出口、目标响应和解析结果正确，记录平均值与p95。</p></div></li>
        <li><span>2</span><div><strong>每轮只提高一个变量</strong><p>逐步增加worker或单域名并发，不同时改变重试、超时与请求间隔。</p></div></li>
        <li><span>3</span><div><strong>观察有效吞吐是否继续增长</strong><p>若QPS不再增长但延迟、429或重试率上升，应回退到上一档。</p></div></li>
        <li><span>4</span><div><strong>预留生产余量</strong><p>不要长期运行在瞬时极限，给目标抖动、代理切换和任务峰值留下空间。</p></div></li>
      </ol>
    </section>

    <section id="products">
      <div class="docs-section-title"><span>06</span><div><small>PRODUCT BOUNDARY</small><h2>容量模型与代理产品要匹配</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>任务</span><span>推荐起点</span><span>主要容量维度</span></div>
        <div><strong>持续HTTP爬虫</strong><span><a href="/developers/products/scraping-rotating-proxy/">隧道代理</a></span><span>并发线程或传输流量</span></div>
        <div><strong>国家定向住宅爬取</strong><span><a href="/developers/products/residential-rotating-proxy/">隧道住宅代理</a></span><span>传输流量</span></div>
        <div><strong>持续浏览器自动化</strong><span><a href="/developers/products/unlimited-residential-proxy/">不限量动态住宅</a></span><span>端口、带宽与页面资源请求</span></div>
        <div><strong>大对象批量下载</strong><span><a href="/high-bandwidth-proxy.html">高带宽代理IP</a></span><span>单项目带宽、流量与目标站点</span></div>
      </div>
    </section>

    <section id="faq">
      <div class="docs-section-title"><span>07</span><div><small>FAQ</small><h2>常见问题</h2></div></div>
      ${faqMarkup(page, icon)}
    </section>

    <nav class="docs-next">
      <span>下一篇工程指南</span>
      <a href="/developers/guides/session-geo-rotation/"><div><small>路由与身份</small><strong>SESSION、地区定位与出口轮转</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#model", "核心指标"],
    ["#formula", "吞吐估算"],
    ["#browser", "浏览器并发"],
    ["#measure", "监控指标"],
    ["#tuning", "并发调优"],
    ["#products", "产品边界"],
    ["#faq", "常见问题"]
  ]);
}

function sessionGuide(page, helpers) {
  const { icon, articleLayout } = helpers;
  const content = `
    ${guideHeader(
      page,
      icon,
      [["地区设置", "提取时决定"], ["SESSION", "产品能力不同"], ["轮转", "请求 / 周期 / 固定"], ["网关", "按产品固定"]],
      "地区、SESSION与轮转不是一组通用参数。它们由具体代理产品决定，购买套餐时不锁定地区，爬虫程序也不应该自行猜测网关或拼接未定义的用户名格式。",
      "https://console.123proxy.cn/app/#extract?product=residential",
      "打开隧道住宅提取",
      "/pricing.html?product=residential",
      "查看住宅流量套餐"
    )}

    <section id="matrix">
      <div class="docs-section-title"><span>01</span><div><small>ROUTING MATRIX</small><h2>先确认产品支持哪一种路由</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>产品</span><span>地区与出口</span><span>SESSION / 轮转</span></div>
        <div><strong><a href="/developers/products/scraping-rotating-proxy/">隧道代理</a></strong><span>默认全球随机；提取时可选欧美、北美、欧洲、亚洲、美国或日韩</span><span>混合池按请求轮转；纯住宅池支持1-120分钟SESSION</span></div>
        <div><strong><a href="/developers/products/residential-rotating-proxy/">隧道住宅代理</a></strong><span>全球随机、地区或具体国家；完整国家码位于用户名末尾</span><span>默认轮转；支持1-120分钟SESSION</span></div>
        <div><strong><a href="/developers/products/unlimited-residential-proxy/">不限量动态住宅</a></strong><span>提取时为整个套餐设置地区，不能逐端口指定</span><span>不支持SESSION；每端口固定3-30分钟后轮转</span></div>
        <div><strong><a href="/developers/products/static-datacenter-proxy/">长效静态代理</a></strong><span>分配固定IP时按支持地区与库存选择</span><span>不支持SESSION，不自动轮转</span></div>
        <div><strong><a href="/developers/products/static-residential-proxy/">长效静态住宅</a></strong><span>分配固定住宅ISP IP时按支持地区与库存选择</span><span>不支持SESSION，不自动轮转</span></div>
      </div>
    </section>

    <section id="purchase-extract">
      <div class="docs-section-title"><span>02</span><div><small>PURCHASE VS EXTRACTION</small><h2>购买决定容量，提取决定路由</h2></div></div>
      <div class="docs-allocation-flow">
        <article><span>01</span>${icon("shopping-cart")}<div><strong>购买套餐</strong><p>选择流量、并发线程、端口、带宽或固定IP数量与使用周期。</p></div></article>
        <article><span>02</span>${icon("route")}<div><strong>提取或分配代理</strong><p>根据产品能力设置地区、代理池、SESSION或固定轮转周期。</p></div></article>
        <article><span>03</span>${icon("code-2")}<div><strong>复制到程序</strong><p>动态产品使用固定网关；静态产品直连分配结果。</p></div></article>
      </div>
      <div class="docs-callout is-important">
        ${icon("map-pin")}
        <div><strong>修改地区或SESSION后需要重新建立连接</strong><p>住宅路由配置通常需要约3-15分钟同步。同步完成后关闭旧的keep-alive连接或BrowserContext，再用新的完整认证用户名建立请求。</p></div>
      </div>
    </section>

    <section id="session">
      <div class="docs-section-title"><span>03</span><div><small>STICKY SESSION</small><h2>SESSION 是一段有期限的粘性路由</h2></div></div>
      <p>SESSION适合分页、短流程和多步骤请求尽量保持同一住宅出口。它不是永久IP，也不是客户端Cookie；路由由完整代理认证用户名控制。</p>
      <div class="docs-username-anatomy is-residential">
        <span class="docs-username-label">美国 · 15 分钟 Sticky SESSION</span>
        <code><b>proxy-user</b><em>-sess_</em><strong>a8F3kP9xQ2mL_15</strong><em>+us</em></code>
        <div>
          <span><b>proxy-user</b><small>基础代理用户</small></span>
          <span><b>-sess_a8F3kP9xQ2mL_15</b><small>12位ID与分钟数</small></span>
          <span><b>+us</b><small>小写国家码，始终在末尾</small></span>
        </div>
      </div>
      <div class="docs-fact-list">
        <div><strong>复用同一出口</strong><p>连续请求使用完全相同的完整代理用户名，并尽量复用同一业务流程。</p></div>
        <div><strong>主动更换出口</strong><p>使用新的SESSION ID，或切回产品支持的按请求轮转模式。</p></div>
        <div><strong>到期与异常</strong><p>SESSION到期、出口不可用或调度变化时会重新分配，代码必须能恢复。</p></div>
      </div>
    </section>

    <section id="connections">
      <div class="docs-section-title"><span>04</span><div><small>CONNECTION LIFECYCLE</small><h2>连接池会影响你观察到的换 IP 行为</h2></div></div>
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>同一SESSION复用连接</strong><small>有助于多步骤流程减少握手，但不能突破SESSION到期或出口故障。</small></span></div>
        <div>${icon("check")}<span><strong>切换路由时关闭旧连接</strong><small>修改地区、SESSION或端口配置后，不要继续复用旧HTTP隧道。</small></span></div>
        <div>${icon("check")}<span><strong>浏览器按Context隔离身份</strong><small>不同账号或SESSION使用独立BrowserContext和Cookie存储。</small></span></div>
        <div>${icon("check")}<span><strong>记录完整路由参数</strong><small>日志可记录SESSION ID与地区，但不要记录代理密码。</small></span></div>
      </div>
    </section>

    <section id="decision">
      <div class="docs-section-title"><span>05</span><div><small>DECISION RULES</small><h2>按业务连续性选择出口方式</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>需求</span><span>路由方式</span><span>适合产品</span></div>
        <div><strong>每次请求尽量更换出口</strong><span>按请求轮转</span><span>隧道代理混合池、纯住宅池或隧道住宅</span></div>
        <div><strong>短流程保持同一住宅出口</strong><span>Sticky SESSION</span><span>隧道代理纯住宅池、隧道住宅代理</span></div>
        <div><strong>一个端口阶段性固定后轮转</strong><span>3-30分钟固定周期</span><span>不限量动态住宅</span></div>
        <div><strong>整个购买周期保持固定出口</strong><span>固定代理IP</span><span>长效静态代理、长效静态住宅</span></div>
      </div>
    </section>

    <section id="faq">
      <div class="docs-section-title"><span>06</span><div><small>FAQ</small><h2>常见问题</h2></div></div>
      ${faqMarkup(page, icon)}
    </section>

    <nav class="docs-next">
      <span>下一篇工程指南</span>
      <a href="/developers/guides/proxy-errors-retries/"><div><small>稳定性</small><strong>代理错误、超时与重试排查</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#matrix", "路由能力矩阵"],
    ["#purchase-extract", "购买与提取"],
    ["#session", "SESSION逻辑"],
    ["#connections", "连接生命周期"],
    ["#decision", "选择规则"],
    ["#faq", "常见问题"]
  ]);
}

function errorsGuide(page, helpers) {
  const { icon, codeTabs, articleLayout } = helpers;
  const content = `
    ${guideHeader(
      page,
      icon,
      [["排查层级", "6 层"], ["重点状态", "407 / 403 / 429"], ["重试", "有预算的退避"], ["安全", "保持TLS校验"]],
      "先确定错误发生在代理链路还是目标站点。把DNS、TCP、TLS、代理认证、目标HTTP响应和业务解析混在一起，会导致无效换IP、无限重试或错误关闭安全校验。",
      "https://console.123proxy.cn/app/#extract?product=tunnel",
      "打开提取代理",
      "/status/",
      "查看服务状态"
    )}

    <section id="layers">
      <div class="docs-section-title"><span>01</span><div><small>FAILURE LAYERS</small><h2>按请求链路逐层定位</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>层级</span><span>典型现象</span><span>优先检查</span></div>
        <div><strong>DNS</strong><span>无法解析代理网关或目标域名</span><span>解析器、服务器网络、网关域名拼写</span></div>
        <div><strong>TCP</strong><span>Connection refused、reset或连接超时</span><span>HOST、PORT、防火墙、出口网络和服务状态</span></div>
        <div><strong>TLS</strong><span>证书、握手、SNI或协议版本错误</span><span>系统时间、CA、客户端版本和代理协议</span></div>
        <div><strong>代理认证</strong><span>HTTP 407</span><span>代理用户、密码、完整路由用户名和套餐白名单</span></div>
        <div><strong>目标响应</strong><span>403、404、429、5xx</span><span>目标授权、请求频率、Retry-After和目标状态</span></div>
        <div><strong>业务解析</strong><span>HTTP成功但字段为空或页面结构不符</span><span>响应内容、登录状态、渲染方式和选择器</span></div>
      </div>
    </section>

    <section id="diagnose">
      <div class="docs-section-title"><span>02</span><div><small>MINIMUM DIAGNOSTIC</small><h2>先用 cURL 分离代理与框架问题</h2></div></div>
      <p>使用与程序相同的代理网关和账密访问简单测试目标。<code>--verbose</code> 可显示CONNECT、认证和TLS阶段；日志中不要长期保存完整代理密码。</p>
      ${codeTabs("proxy-diagnostic", {
        curl: { label: "cURL", code: diagnosticCurl }
      }, "curl")}
      <div class="docs-callout">
        ${icon("circle-check")}
        <div><strong>cURL成功而框架失败</strong><p>继续检查框架代理参数、环境变量覆盖、连接池、浏览器代理作用域和URL编码，不要先更换代理产品。</p></div>
      </div>
    </section>

    <section id="status">
      <div class="docs-section-title"><span>03</span><div><small>STATUS CODES</small><h2>不同状态码对应不同处理动作</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>状态</span><span>含义</span><span>正确动作</span></div>
        <div><strong>407</strong><span>代理网关拒绝认证</span><span>修复账密、完整用户名或套餐白名单，不盲目换出口</span></div>
        <div><strong>403</strong><span>目标站点拒绝当前请求或身份</span><span>确认访问授权、请求头、账号状态、地区与目标规则</span></div>
        <div><strong>429</strong><span>目标站点或接口触发频率限制</span><span>读取Retry-After，降低单域名并发并执行退避</span></div>
        <div><strong>5xx</strong><span>目标服务或中间链路临时失败</span><span>只对安全请求执行有限重试，并记录目标域名</span></div>
      </div>
    </section>

    <section id="timeouts">
      <div class="docs-section-title"><span>04</span><div><small>TIMEOUT BUDGET</small><h2>区分连接超时、读取超时和任务截止时间</h2></div></div>
      <div class="docs-fact-list">
        <div><strong>连接超时</strong><p>限制解析、TCP连接、代理CONNECT与TLS握手等待。建议单独设置，例如15秒。</p></div>
        <div><strong>读取超时</strong><p>限制连接建立后等待响应数据的时间。大文件下载应按对象大小调整。</p></div>
        <div><strong>任务截止时间</strong><p>限制包含重试在内的整个页面或对象处理时长，防止队列被少量慢任务占满。</p></div>
      </div>
      <div class="docs-callout is-warning">
        ${icon("timer-off")}
        <div><strong>超时不是越长越稳定</strong><p>过长超时会让失败请求长期占用并发线程；过短则会把正常慢响应误判为失败。应根据p95与对象大小设置，并给重试留下总预算。</p></div>
      </div>
    </section>

    <section id="retry">
      <div class="docs-section-title"><span>05</span><div><small>BOUNDED RETRY</small><h2>只重试可恢复且幂等的请求</h2></div></div>
      <p>GET与HEAD通常可以在有限预算内重试；会创建订单、分配静态IP或修改状态的请求不能因为结果未知就自动重复提交。</p>
      ${codeTabs("retry-backoff", {
        python: { label: "Python", code: retryPython }
      }, "python")}
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>限制最大尝试次数</strong><small>常见起点为首次请求加2-3次重试。</small></span></div>
        <div>${icon("check")}<span><strong>指数退避并加入随机抖动</strong><small>避免多个worker在同一时刻再次冲击目标。</small></span></div>
        <div>${icon("check")}<span><strong>尊重 Retry-After</strong><small>目标明确给出等待时间时优先使用，并设置合理上限。</small></span></div>
        <div>${icon("check")}<span><strong>保留总任务截止时间</strong><small>单次超时与多次重试之和不能无限增长。</small></span></div>
      </div>
    </section>

    <section id="pool-tls">
      <div class="docs-section-title"><span>06</span><div><small>CONNECTIONS & TLS</small><h2>连接池与TLS不要用错误的捷径处理</h2></div></div>
      <div class="docs-boundary-grid">
        <div class="is-supported">${icon("link")}<span><strong>复用稳定连接</strong><small>同一目标和SESSION可减少握手；监控空闲连接被关闭后的重建。</small></span></div>
        <div>${icon("refresh-cw")}<span><strong>需要换路由时重建连接</strong><small>更改地区、SESSION或轮转参数后关闭旧HTTP隧道。</small></span></div>
        <div class="is-supported">${icon("shield-check")}<span><strong>保留证书校验</strong><small>修复CA、系统时间、SNI或客户端协议，不默认verify=false。</small></span></div>
        <div>${icon("file-warning")}<span><strong>区分代理错误与目标证书错误</strong><small>记录失败阶段、目标域名和客户端错误类型。</small></span></div>
      </div>
    </section>

    <section id="logging">
      <div class="docs-section-title"><span>07</span><div><small>SAFE LOGGING</small><h2>记录足够排查但不泄露凭证</h2></div></div>
      <div class="docs-format-table">
        <div><code>request_id</code><span>跨worker关联一次任务及其重试</span></div>
        <div><code>target_host</code><span>定位单一目标站点的错误率与限速</span></div>
        <div><code>proxy_product</code><span>记录产品和套餐标识，不记录代理密码</span></div>
        <div><code>session_id</code><span>可脱敏记录SESSION，排查粘性路由</span></div>
        <div><code>status / error_type</code><span>区分HTTP状态与客户端异常</span></div>
        <div><code>attempt / duration_ms</code><span>观察重试次数与每次耗时</span></div>
      </div>
    </section>

    <section id="faq">
      <div class="docs-section-title"><span>08</span><div><small>FAQ</small><h2>常见问题</h2></div></div>
      ${faqMarkup(page, icon)}
    </section>

    <nav class="docs-next">
      <span>下一篇工程指南</span>
      <a href="/developers/guides/proxy-product-selection/"><div><small>架构决策</small><strong>代理产品选型边界</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#layers", "故障分层"],
    ["#diagnose", "最小诊断"],
    ["#status", "状态码处理"],
    ["#timeouts", "超时预算"],
    ["#retry", "重试与退避"],
    ["#pool-tls", "连接池与TLS"],
    ["#logging", "安全日志"],
    ["#faq", "常见问题"]
  ]);
}

function selectionGuide(page, helpers) {
  const { icon, articleLayout } = helpers;
  const content = `
    ${guideHeader(
      page,
      icon,
      [["产品", "6 类能力"], ["决策维度", "身份 / 地区 / 容量"], ["购买", "先选计费模型"], ["提取", "再设路由"]],
      "代理选型不从“哪个产品更高级”开始，而从出口身份、地区粒度、连续性、数据量、并发与固定IP要求开始。先确定不能妥协的边界，再比较套餐。",
      "/pricing.html",
      "打开价格与套餐",
      "https://console.123proxy.cn/app/#purchase?product=tunnel",
      "在控制台购买"
    )}

    <section id="questions">
      <div class="docs-section-title"><span>01</span><div><small>REQUIREMENTS</small><h2>先回答六个工程问题</h2></div></div>
      <ol class="docs-number-list">
        <li><span>1</span><div><strong>目标是否要求住宅网络身份？</strong><p>普通公开网页可能不需要；地区内容、住宅身份验证或特定业务流程可能需要。</p></div></li>
        <li><span>2</span><div><strong>地区要全球随机、粗粒度还是具体国家？</strong><p>不同产品的定位粒度不同，购买套餐时不会锁定地区。</p></div></li>
        <li><span>3</span><div><strong>出口需要按请求轮转、短期粘性还是长期固定？</strong><p>SESSION、端口固定周期和静态IP是三种不同能力。</p></div></li>
        <li><span>4</span><div><strong>任务主要消耗流量还是并发？</strong><p>文本页面、浏览器资源和大文件下载的成本结构差异很大。</p></div></li>
        <li><span>5</span><div><strong>是否需要稳定来源IP登记？</strong><p>合作方API白名单和长期系统集成通常需要静态出口。</p></div></li>
        <li><span>6</span><div><strong>单项目是否需要10Gbps+下载能力？</strong><p>AI视频、图片、代码归档和公开文档大规模下载应单独评估高带宽方案。</p></div></li>
      </ol>
    </section>

    <section id="matrix">
      <div class="docs-section-title"><span>02</span><div><small>PRODUCT MATRIX</small><h2>六类代理能力对比</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>产品</span><span>核心边界</span><span>适合任务</span></div>
        <div><strong><a href="/scraping-rotating-proxy.html">隧道代理</a></strong><span>混合池或纯住宅池；默认全球随机；粗粒度地区；流量或并发</span><span>通用网页、列表详情、高频HTTP爬虫</span></div>
        <div><strong><a href="/residential-proxy.html">隧道住宅代理</a></strong><span>8000万+住宅IP；190+国家地区；SESSION；仅按流量</span><span>国家定向、地区内容、多步骤住宅流程</span></div>
        <div><strong><a href="/unlimited-residential-proxy.html">不限量动态住宅</a></strong><span>每端口不限流量与并发；套餐级地区；3-30分钟轮转</span><span>持续浏览器自动化、大流量住宅任务</span></div>
        <div><strong><a href="/static-datacenter-proxy.html">长效静态代理</a></strong><span>固定数据中心IP；不限流量；账密直连；无SESSION</span><span>来源IP登记、长期API连接、固定环境</span></div>
        <div><strong><a href="/static-residential-proxy.html">长效静态住宅</a></strong><span>固定住宅ISP IP；不限流量；账密直连；无SESSION</span><span>长期住宅身份、固定地区会话</span></div>
        <div><strong><a href="/high-bandwidth-proxy.html">高带宽代理IP</a></strong><span>10Gbps+单项目能力、不限流量、定制代理池</span><span>AI训练数据、大对象与多集群下载</span></div>
      </div>
    </section>

    <section id="workloads">
      <div class="docs-section-title"><span>03</span><div><small>WORKLOAD MAPPING</small><h2>从真实任务映射到产品</h2></div></div>
      <div class="docs-decision-grid">
        <a href="/developers/products/scraping-rotating-proxy/"><strong>公开文本与商品目录</strong><span>隧道代理</span><small>混合池通常更快，按并发或流量选择</small></a>
        <a href="/developers/products/residential-rotating-proxy/"><strong>多国家公开内容</strong><span>隧道住宅代理</span><small>国家定位与SESSION，仅按流量</small></a>
        <a href="/developers/products/unlimited-residential-proxy/"><strong>持续浏览器任务</strong><span>不限量动态住宅</span><small>端口不限并发，不按累计流量收费</small></a>
        <a href="/developers/products/static-datacenter-proxy/"><strong>合作方API来源白名单</strong><span>长效静态代理</span><small>固定数据中心出口，长期保持</small></a>
        <a href="/developers/products/static-residential-proxy/"><strong>固定住宅ISP身份</strong><span>长效静态住宅</span><small>住宅出口固定，不自动轮转</small></a>
        <a href="/high-bandwidth-proxy.html"><strong>视频、图片与代码归档下载</strong><span>高带宽代理IP</span><small>10Gbps+单项目与定制代理池</small></a>
      </div>
    </section>

    <section id="browser">
      <div class="docs-section-title"><span>04</span><div><small>BROWSER AUTOMATION</small><h2>浏览器任务同时考虑流量与子请求</h2></div></div>
      <p>浏览器会加载HTML、JavaScript、CSS、图片、字体和接口，一个页面通常消耗多条并发请求。选型时不要只按“浏览器数量”估算代理容量。</p>
      <div class="docs-fact-list">
        <div><strong>短期国家定向</strong><p>页面数量有限且需要具体国家时，可从隧道住宅流量套餐开始。</p></div>
        <div><strong>持续大流量</strong><p>worker长期运行、资源请求多时，可评估不限量动态住宅端口与带宽。</p></div>
        <div><strong>固定住宅身份</strong><p>任务需要长期同一住宅ISP出口时，应选择长效静态住宅。</p></div>
      </div>
      <a class="docs-inline-action" href="/developers/guides/concurrency-qps-performance/#browser">计算浏览器并发消耗${icon("arrow-right")}</a>
    </section>

    <section id="purchase">
      <div class="docs-section-title"><span>05</span><div><small>PURCHASE PATH</small><h2>购买与提取分开决策</h2></div></div>
      <div class="docs-allocation-flow">
        <article><span>01</span>${icon("scale")}<div><strong>确认任务边界</strong><p>选择身份、地区粒度、轮转方式与容量模型。</p></div></article>
        <article><span>02</span>${icon("tag")}<div><strong>比较对应套餐</strong><p>只比较满足硬性边界的产品，确认流量、并发、端口或IP数量。</p></div></article>
        <article><span>03</span>${icon("terminal")}<div><strong>控制台购买并提取</strong><p>购买时不选择地区；提取时按产品能力完成路由配置。</p></div></article>
      </div>
      <a class="btn btn-primary" href="/pricing.html">${icon("tag")}比较五类标准代理价格</a>
    </section>

    <section id="faq">
      <div class="docs-section-title"><span>06</span><div><small>FAQ</small><h2>常见问题</h2></div></div>
      ${faqMarkup(page, icon)}
    </section>

    <nav class="docs-next">
      <span>开始接入</span>
      <a href="/developers/getting-started/"><div><small>5分钟快速开始</small><strong>生成代理并完成第一个请求</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#questions", "需求问题"],
    ["#matrix", "产品能力矩阵"],
    ["#workloads", "任务映射"],
    ["#browser", "浏览器任务"],
    ["#purchase", "购买路径"],
    ["#faq", "常见问题"]
  ]);
}

export function renderDeveloperGuide(page, helpers) {
  const renderers = {
    concurrency: concurrencyGuide,
    session: sessionGuide,
    errors: errorsGuide,
    selection: selectionGuide
  };
  const renderer = renderers[page.guideKey];
  if (!renderer) throw new Error(`Unknown developer guide: ${page.guideKey}`);
  return renderer(page, helpers);
}
