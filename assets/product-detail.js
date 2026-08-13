const staticDatacenterRegions = ["ZA", "VN", "VE", "UZ", "US", "UA", "TW", "TR", "TH", "SK", "SG", "SE", "SA", "RS", "RO", "PT", "PL", "PK", "PH", "PE", "NZ", "NO", "NL", "NG", "MY", "MX", "MT", "MA", "LV", "LT", "LK", "KZ", "KR", "KH", "KE", "JP", "IT", "IN", "IL", "IE", "ID", "HU", "HR", "HK", "GR", "GE", "GB", "FR", "FI", "ES", "EG", "EE", "DZ", "DK", "DE", "CZ", "CY", "CO", "CL", "CH", "CA", "BR", "BG", "BE", "BD", "AU", "AT", "AR", "AE"];
const staticResidentialRegions = ["AE", "AR", "AT", "AU", "BD", "BE", "BG", "BR", "CA", "CH", "CL", "CO", "CY", "CZ", "DE", "DK", "DZ", "EE", "EG", "ES", "FI", "FR", "GB", "GE", "GR", "HK", "HN", "HR", "HU", "ID", "IE", "IL", "IN", "IT", "JP", "KE", "KH", "KR", "KZ", "LK", "LT", "LV", "MA", "MT", "MX", "MY", "NG", "NL", "NO", "NZ", "PE", "PH", "PK", "PL", "PT", "RO", "RS", "SA", "SE", "SG", "SK", "TH", "TR", "TW", "UA", "US", "VE", "VN", "ZA"];
const locationNames = {
  AE: ["阿联酋", "United Arab Emirates"], AR: ["阿根廷", "Argentina"], AT: ["奥地利", "Austria"], AU: ["澳大利亚", "Australia"],
  BD: ["孟加拉国", "Bangladesh"], BE: ["比利时", "Belgium"], BG: ["保加利亚", "Bulgaria"], BR: ["巴西", "Brazil"],
  CA: ["加拿大", "Canada"], CH: ["瑞士", "Switzerland"], CL: ["智利", "Chile"],
  CO: ["哥伦比亚", "Colombia"], CY: ["塞浦路斯", "Cyprus"], CZ: ["捷克", "Czechia"], DE: ["德国", "Germany"],
  DK: ["丹麦", "Denmark"], DZ: ["阿尔及利亚", "Algeria"], EE: ["爱沙尼亚", "Estonia"], EG: ["埃及", "Egypt"],
  ES: ["西班牙", "Spain"], FI: ["芬兰", "Finland"], FR: ["法国", "France"], GB: ["英国", "United Kingdom"],
  GE: ["格鲁吉亚", "Georgia"], GR: ["希腊", "Greece"], HK: ["中国香港", "Hong Kong"], HN: ["洪都拉斯", "Honduras"],
  HR: ["克罗地亚", "Croatia"], HU: ["匈牙利", "Hungary"], ID: ["印度尼西亚", "Indonesia"], IE: ["爱尔兰", "Ireland"],
  IL: ["以色列", "Israel"], IN: ["印度", "India"], IT: ["意大利", "Italy"], JP: ["日本", "Japan"],
  KE: ["肯尼亚", "Kenya"], KH: ["柬埔寨", "Cambodia"], KR: ["韩国", "South Korea"], KZ: ["哈萨克斯坦", "Kazakhstan"],
  LK: ["斯里兰卡", "Sri Lanka"], LT: ["立陶宛", "Lithuania"], LV: ["拉脱维亚", "Latvia"], MA: ["摩洛哥", "Morocco"],
  MT: ["马耳他", "Malta"], MX: ["墨西哥", "Mexico"], MY: ["马来西亚", "Malaysia"], NG: ["尼日利亚", "Nigeria"],
  NL: ["荷兰", "Netherlands"], NO: ["挪威", "Norway"], NZ: ["新西兰", "New Zealand"], PE: ["秘鲁", "Peru"],
  PH: ["菲律宾", "Philippines"], PK: ["巴基斯坦", "Pakistan"], PL: ["波兰", "Poland"], PT: ["葡萄牙", "Portugal"],
  RO: ["罗马尼亚", "Romania"], RS: ["塞尔维亚", "Serbia"], SA: ["沙特阿拉伯", "Saudi Arabia"], SE: ["瑞典", "Sweden"],
  SG: ["新加坡", "Singapore"], SK: ["斯洛伐克", "Slovakia"], TH: ["泰国", "Thailand"], TR: ["土耳其", "Turkey"],
  TW: ["中国台湾", "Taiwan"], UA: ["乌克兰", "Ukraine"], US: ["美国", "United States"], UZ: ["乌兹别克斯坦", "Uzbekistan"],
  VE: ["委内瑞拉", "Venezuela"], VN: ["越南", "Vietnam"], ZA: ["南非", "South Africa"]
};

const productPages = {
  tunnel: {
    file: "scraping-rotating-proxy.html",
    pricingUrl: "pricing.html?product=tunnel",
    name: "隧道代理",
    eyebrow: "Scraping rotating proxy",
    title: "双代理池，兼顾采集速度与住宅属性",
    titleLines: ["双代理池，", "兼顾速度与住宅属性"],
    lead: "固定隧道接入两类轮换代理池，默认全球随机出口；提取代理时也可选择粗粒度地区。混合池约 95% 住宅 IP + 5% 数据中心 IP，纯住宅池支持 SESSION。",
    points: ["爬虫混合池通常更快", "100% 纯住宅池", "纯住宅池支持 SESSION", "流量 / 线程两种方案"],
    visual: {
      caption: "Dual pool scheduler / live routing",
      id: "tunnel-gateway / pool-router",
      status: "dual pools ready",
      steps: ["CLIENT", "TUNNEL", "POOL", "TARGET"],
      primary: ["CRAWLER POOL", "95% RES + 5% DC", "FASTER CRAWLING"],
      secondary: ["PURE RES POOL", "100% 住宅 IP", "SESSION READY"],
      metrics: [["POOL OPTIONS", "2", "crawler / pure residential"], ["EXIT REGION", "默认全球随机", "broad region optional"], ["BILLING", "流量 / 线程", "unlimited by threads"]],
      log: ["10:42:18  crawler-pool assigned mixed-network exit", "10:42:19  pure-res pool / session route ready"]
    },
    strip: [["双池", "混合池 / 纯住宅池"], ["约 5%", "混合池含数据中心 IP"], ["SESSION", "纯住宅池支持"], ["流量 / 线程", "两种容量方式"]],
    overview: {
      kicker: "01 / Product capability",
      title: "爬虫混合池与纯住宅池",
      text: "混合池约含 5% 数据中心 IP，公开网页采集通常更快；纯住宅池仅含住宅 IP，并支持 SESSION。"
    },
    capabilities: [
      ["route", "爬虫混合池", "约 95% 住宅 IP + 5% 数据中心 IP，公开网页采集通常更快。"],
      ["wifi", "纯住宅 IP 池", "仅包含住宅 IP，适合更看重住宅网络属性的任务。"],
      ["timer", "纯住宅池支持 SESSION", "通过 SESSION 保持同一出口，适合分页与多步骤请求。"],
      ["database", "流量方案", "按实际流量使用，适合波动任务或按项目核算。"],
      ["infinity", "线程方案不限流量", "线程套餐不累计传输 GB，适合持续高频采集。"],
      ["shuffle", "默认全球随机", "无需地区要求时直接使用全球随机；提取代理时也可选欧美、北美、欧洲、亚洲、美国或日韩。"]
    ],
    workloads: [
      ["01", "公开网页持续抓取", "混合池适合列表页、详情页和搜索结果等大量短请求，采集通常更快。", "推荐：混合池 + 并发线程"],
      ["02", "分页与多步骤采集", "纯住宅池支持 SESSION，适合不依赖地区定向的分页和多步骤任务。", "推荐：纯住宅池"],
      ["03", "请求量波动明显的项目", "任务量或响应体波动较大时，可按实际传输流量核算。", "推荐：按流量"]
    ],
    workflow: {
      title: "固定网关接入，云端自动轮换出口",
      text: "通过同一类隧道连接混合池或纯住宅池，支持流量和并发线程两种套餐。",
      steps: [
        ["01", "选择代理池", "速度优先选混合池；住宅属性或短会话选纯住宅池。"],
        ["02", "配置容量与提取地区", "选择流量或线程方案；提取代理时选择粗粒度地区范围。"],
        ["03", "设置纯住宅 SESSION", "纯住宅池可用 SESSION 保持出口；混合池自动轮换。"],
        ["04", "按请求模型监控", "代码按在途请求计线程；浏览器还会加载图片、CSS 和 JS。"]
      ],
      flow: [["code-2", "采集应用", "REQUEST"], ["waypoints", "隧道网关", "AUTH"], ["git-branch", "双池调度", "SELECT"], ["globe-2", "目标站点", "RESPONSE"]],
      stats: [["代理池", "混合 / 纯住宅"], ["出口地区", "提取时选择"], ["容量模型", "流量 / 线程"]]
    },
    specs: [
      ["代理池", "爬虫混合池 / 纯住宅 IP 池"],
      ["爬虫混合池", "约 95% 住宅 IP + 约 5% 数据中心 IP；采集速度通常比隧道住宅代理更快"],
      ["纯住宅 IP 池", "池内仅包含住宅 IP，支持 SESSION 保持出口"],
      ["出口地区", "默认全球随机；提取代理时可选欧美、北美、欧洲、亚洲、美国或日韩"],
      ["计费方式", "按流量；或按并发线程使用，并发线程方案不限流量"],
      ["IP 切换", "云端自动轮换；纯住宅池可通过 SESSION 保持同一出口"],
      ["接入协议", "HTTP(S) / SOCKS"],
      ["并发计算", "每个同时在途的 HTTP 请求占用一个并发线程"]
    ],
    endpoint: "proxy.123proxy.cn:36923",
    username: "customer-session-demo",
    plans: {
      title: "流量套餐与并发线程套餐",
      text: "按流量套餐核算实际传输量；并发线程套餐限制同时在途请求数，方案内不限流量。",
      note: "并发线程代表同一时刻正在执行的请求数量。代码直接请求一个 URL 通常占用一个线程；浏览器打开一个页面还会并行请求图片、CSS、JS 等资源，通常需要约 10–20 个并发线程。",
      items: [
        ["Traffic", "按流量使用", "适合请求量波动、响应体较小或需要按项目核算流量的任务。", "按实际传输流量", ["动态出口自动轮换", "适配突发采集任务", "可从较小规模开始"], "查看流量方案"],
        ["Concurrency", "按并发线程使用", "适合长时间、高频短请求与稳定任务队列，方案内不限流量。", "按并发线程 / 不限流量", ["固定并发容量", "传输流量不累计计费", "支持持续扩展线程数"], "获取线程方案"]
      ]
    },
    faqs: [
      ["按流量和按并发线程有什么区别，应该怎么选？", "按流量方案根据实际传输的数据量计费，更适合任务规模尚不稳定、响应体较小或需要按项目核算 GB 的场景。并发线程方案根据同时在途的请求数配置容量，方案内不累计传输流量，更适合代码持续、高频请求。建议用真实目标站点测试平均响应时间、响应体大小和峰值并发后再决定。"],
      ["爬虫混合池和纯住宅 IP 池有什么区别？", "爬虫混合池由约 95% 住宅 IP 与约 5% 数据中心 IP 组成，少量数据中心出口使其在公开网页采集中的速度通常比隧道住宅代理更快。纯住宅池仅包含住宅 IP，并支持通过 SESSION 保持同一出口。两个池默认全球随机，也支持在提取代理时选择粗粒度地区范围。"],
      ["按并发线程使用为什么可以不限流量？", "线程方案以同一时刻正在执行的请求数量作为容量口径，不按传输 GB 累计计费，因此方案内不限流量。不限流量不等于无限速度，目标站点响应时间、线程数量、重试策略和网络状况仍会影响实际吞吐。"],
      ["一个并发线程如何计算？它与 QPS 有什么区别？", "一个仍在等待响应的 HTTP 请求占用一个并发线程。QPS 是每秒完成的请求数，近似受“线程数 ÷ 平均响应时间”影响。例如响应越快，相同线程数可以完成的 QPS 越高；超时和重试会降低有效吞吐。"],
      ["浏览器打开一个页面只占用一个线程吗？", "不是。浏览器会并行加载 HTML、图片、CSS、JavaScript、字体和接口请求，打开一个页面通常需要约 10–20 个并发线程。线程方案更适合 requests、Scrapy 等程序直接走 HTTP 协议；浏览器自动化应按真实页面资源量评估。"],
      ["隧道代理与隧道住宅代理的核心区别是什么？", "隧道代理提供爬虫混合池和纯住宅池，默认全球随机；提取时也可选择欧美、北美、欧洲、亚洲、美国或日韩。混合池含约 5% 数据中心 IP，采集通常更快；纯住宅池支持 SESSION。隧道住宅代理可进一步指定国家或地区。"],
      ["隧道代理默认如何分配地区？", "默认从全球资源中随机分配出口。提取代理时也可选择欧美、北美、欧洲、亚洲、美国或日韩，不提供城市级定向；需要更细的国家或地区定位时，应选择隧道住宅代理。"],
      ["哪些代理池支持 SESSION？", "SESSION 仅在隧道代理的纯住宅池提供，可在设定时间内尽量保持同一住宅出口，适合分页、多步骤请求或短期连续会话。SESSION 到期、出口不可用或策略触发后，系统会重新分配代理 IP。"],
      ["是否需要在本地维护代理 IP 列表？", "不需要。应用连接固定隧道网关，由云端完成代理池选择、出口分配、健康检查与切换；程序只需配置鉴权、超时、重试，以及纯住宅池所需的可选 SESSION。"]
    ],
    cta: ["免费测试隧道代理双池", "使用真实目标比较混合池与纯住宅池的响应速度、成功率和 SESSION。", "申请隧道代理测试"]
  },
  residential: {
    file: "residential-proxy.html",
    pricingUrl: "pricing.html?product=residential",
    name: "隧道住宅代理",
    eyebrow: "Geo-targeted residential proxy",
    title: "8000万+ 住宅 IP，定位国家与地区",
    titleLines: ["8000万+ 住宅 IP，", "定位国家与地区"],
    lead: "固定隧道接入 8000万+ 住宅 IP，覆盖 190+ 国家和地区；购买套餐时不选择地区，提取代理时指定国家或地区与 SESSION，仅按实际流量购买。",
    points: ["8000万+ 住宅代理 IP", "190+ 国家和地区", "国家 / 地区 + SESSION", "仅按流量购买"],
    visual: {
      caption: "Residential geo / session routing",
      id: "residential-gateway / global",
      status: "residential routes ready",
      steps: ["CLIENT", "GATEWAY", "RESIDENTIAL", "TARGET"],
      primary: ["GEO TARGET", "国家 / 地区", "190+ LOCATIONS"],
      secondary: ["SESSION", "Specified", "STICKY ROUTE"],
      metrics: [["RESIDENTIAL POOL", "8000万+", "global residential IPs"], ["BILLING", "按流量", "traffic only"], ["ROUTING", "地区 + SESSION", "parameters ready"]],
      log: ["geo target and session received", "residential exit matched"]
    },
    strip: [["8000万+", "全球住宅代理 IP"], ["190+", "国家和地区覆盖"], ["SESSION", "指定会话保持出口"], ["按流量", "唯一购买方式"]],
    overview: {
      kicker: "01 / Product capability",
      title: "地区定向与住宅 SESSION",
      text: "提取代理时选择国家或地区与 SESSION，网关从 8000万+ 住宅 IP 池中匹配出口。"
    },
    capabilities: [
      ["database", "8000万+ 住宅 IP 池", "全球住宅资源为跨地区持续任务提供出口。"],
      ["globe-2", "190+ 国家和地区", "指定国家或地区，获取对应市场的本地化公开数据。"],
      ["map-pinned", "国家 / 地区定位", "购买套餐时不锁定地区，提取代理时选择。"],
      ["timer", "指定 SESSION", "尽量保持同一出口，适合分页与多步骤请求。"],
      ["wifi", "住宅网络属性", "住宅网络出口适配重视网络类型与本地化结果的数据源。"],
      ["receipt", "仅按流量购买", "仅按实际流量使用，不提供线程或不限流量方案。"]
    ],
    workloads: [
      ["01", "跨地区公开数据研究", "从指定地区访问公开页面，比较搜索结果、趋势和本地化内容。", "路由策略：国家 / 地区"],
      ["02", "电商价格与商品采集", "采集当地商品、价格和评价，并用 SESSION 保持连续翻页。", "路由策略：地区 + SESSION"],
      ["03", "AI 数据地区多样性", "按不同地区组织任务，扩展训练或评估数据的地域来源。", "路由策略：多地区任务队列"]
    ],
    workflow: {
      title: "提取代理时指定地区与 SESSION",
      text: "购买套餐时无需选择地区；提取代理时生成带有地区与 SESSION 参数的代理信息。",
      steps: [
        ["01", "提取时选择国家或地区", "购买套餐不锁定地区，可用位置以提取页面为准。"],
        ["02", "指定 SESSION", "为分页或连续请求设置 SESSION，保持会话一致。"],
        ["03", "连接住宅网关", "程序通过固定隧道请求，网关匹配当地住宅出口。"],
        ["04", "监控流量与结果", "观察成功率、响应大小和数据完整度，管理套餐流量。"]
      ],
      flow: [["code-2", "采集任务", "REGION"], ["waypoints", "住宅网关", "SESSION"], ["wifi", "ISP 出口", "GEO"], ["globe-2", "本地内容", "RESPONSE"]],
      stats: [["代理池", "8000万+"], ["覆盖范围", "190+ 地区"], ["购买方式", "仅按流量"]]
    },
    specs: [
      ["代理类型", "动态住宅代理 / 住宅网络出口"],
      ["代理池规模", "8000万+ 全球住宅代理 IP"],
      ["覆盖范围", "190+ 国家和地区，具体可选位置以控制台为准"],
      ["地区定位", "购买套餐时不选择；提取代理时指定国家或地区"],
      ["会话策略", "支持指定 SESSION，尽量保持同一住宅出口"],
      ["购买方式", "仅按实际传输流量购买，不提供并发线程套餐"],
      ["接入与鉴权", "固定隧道；账号密码 / IP 白名单"],
      ["接入协议", "HTTP(S) / SOCKS"]
    ],
    endpoint: "residential.123proxy.cn:33000",
    username: "customer_US_SESSIONID",
    plans: {
      title: "按实际传输流量购买",
      text: "国家、地区和 SESSION 控制出口路由，所有代理传输计入流量套餐。",
      note: "正式扩容前，建议使用代表性目标 URL 运行小规模测试，记录成功请求的平均流量与失败重试产生的额外消耗。",
      items: [
        ["Traffic only", "按流量购买", "根据住宅代理实际传输的数据量使用套餐，适合需要国家或地区定位的弹性采集任务。", "实际传输流量", ["8000万+ 住宅 IP 池", "190+ 国家和地区", "支持指定 SESSION"], "申请流量测试"]
      ]
    },
    faqs: [
      ["隧道住宅代理支持哪些购买方式？", "只支持按实际传输流量购买，不提供按并发线程、按端口不限量或不限流量线程套餐。国家、地区和 SESSION 是路由参数，不会改变计费方式。"],
      ["如何指定代理出口的国家或地区？", "在住宅代理鉴权参数中提交目标国家或地区，网关会从对应位置的住宅资源中匹配出口。可选位置以控制台当前提供的国家和地区列表为准。"],
      ["SESSION 有什么作用？", "SESSION 用于让一组连续请求尽量保持同一住宅出口，适合分页、多步骤流程和短期连续会话。出口不可用或会话策略结束后，网关会重新分配住宅 IP。"],
      ["不指定 SESSION 时如何分配出口？", "未指定 SESSION 时，网关按照系统轮转策略从目标国家或地区的住宅资源中分配出口。具体轮转结果受资源可用性和请求状态影响。"],
      ["可以定位到城市或州省吗？", "当前页面仅承诺国家或地区级定位，不承诺城市或州省级定向。具体可选位置应以控制台实际提供的参数为准。"],
      ["8000万+ IP 和 190+ 国家地区如何理解？", "8000万+ 指全球住宅代理资源池规模，190+ 指可覆盖的国家和地区数量。不同位置的即时可用资源会随网络状态变化，应使用目标地区进行测试。"],
      ["它与隧道代理有什么区别？", "隧道代理提供混合池和纯住宅池，默认全球随机，提取时也可选择粗粒度地区；隧道住宅代理专注住宅出口，提取时可指定国家或地区和 SESSION，但只按流量购买。"],
      ["是否需要在本地维护住宅 IP 列表？", "不需要。程序连接固定住宅隧道，由网关完成地区匹配、出口分配、健康检查和切换；应用只需维护鉴权、SESSION、超时与重试策略。"]
    ],
    cta: ["免费测试地区住宅代理", "选择目标地区与 SESSION，验证住宅出口和实际流量消耗。", "申请住宅流量测试"]
  },
  unlimitedResidential: {
    file: "unlimited-residential-proxy.html",
    pricingUrl: "pricing.html?product=unlimited",
    name: "不限量动态住宅代理",
    eyebrow: "Unlimited residential ports",
    title: "每端口不限流量，也不限并发",
    titleLines: ["每端口不限流量，", "也不限并发"],
    lead: "真实 ISP 住宅出口按端口提供不限流量与不限并发。出口 IP 每 3–30 分钟固定轮转；购买时不选择地区，提取代理时按套餐统一设置，不能逐端口选择。",
    points: ["每端口不限流量", "每端口不限并发", "3–30 分钟固定轮转", "提取时设置套餐地区"],
    visual: {
      caption: "Port capacity / residential rotation",
      id: "unlimited-residential / port-08",
      status: "bandwidth stable",
      steps: ["WORKER", "PORT", "ROTATE", "TARGET"],
      primary: ["PORT STATUS", "08 / Active", "UNLIMITED TRAFFIC"],
      secondary: ["ROTATION CYCLE", "10 min", "PLAN-LEVEL FIXED"],
      metrics: [["PORT BANDWIDTH", "20 Mbps", "dedicated capacity"], ["CONCURRENCY", "Unlimited", "per port"], ["PACKAGE REGION", "US", "shared by all ports"]],
      log: ["10:42:18  port-08 residential exit confirmed", "10:42:19  rotation timer active / no GB metering"]
    },
    strip: [["不限流量", "每个端口不按 GB 计费"], ["不限并发", "每个端口不限制线程"], ["3–30 分钟", "固定周期轮转出口"], ["提取时", "统一设置套餐地区"]],
    overview: {
      kicker: "01 / Product capability",
      title: "每端口不限流量与并发",
      text: "提供 5–100Mbps 多档带宽；提取代理时统一设置套餐地区与 3–30 分钟固定轮转周期。"
    },
    capabilities: [
      ["infinity", "方案内不限流量", "不按传输 GB 计费，适合持续运行的长期任务。"],
      ["git-branch", "每端口不限并发", "不限制并发线程，实际吞吐由带宽和目标响应决定。"],
      ["gauge", "多档带宽", "提供 5–100Mbps 规格，可按任务吞吐扩容。"],
      ["refresh-cw", "3–30 分钟固定轮转", "套餐选择固定周期，端口按周期更换住宅出口。"],
      ["map", "提取时设置地区", "购买套餐时不选择地区；提取时按套餐设置，不能逐端口分别设置。"],
      ["ethernet-port", "端口隔离任务", "端口可分配给不同任务，但共享套餐地区配置。"]
    ],
    workloads: [
      ["01", "浏览器自动化节点", "为持续在线的浏览器工作节点分配独立端口和住宅出口。", "容量：按节点 / 端口"],
      ["02", "长期地区数据监测", "定期采集本地公开页面，不必为持续产生的流量单独核算 GB。", "容量：固定带宽"],
      ["03", "大响应体公开数据", "图片、页面资源等响应体较大时，不限流量模式使预算更可预测。", "容量：按吞吐评估"]
    ],
    workflow: {
      title: "端口连接与住宅出口轮转",
      text: "购买时不选择地区；提取代理时统一设置套餐地区与 3–30 分钟轮转周期。端口独立连接且不限并发。",
      steps: [
        ["01", "提取时设置套餐地区", "选择出口地区，应用于套餐内全部端口。"],
        ["02", "选择固定轮转周期", "在 3–30 分钟范围设置周期，端口按周期换 IP。"],
        ["03", "分配任务端口", "端口可绑定不同项目或节点，均不限并发。"],
        ["04", "观察带宽利用率", "按任务吞吐和峰值带宽增加端口或提升规格。"]
      ],
      flow: [["monitor-cog", "工作节点", "TASK"], ["ethernet-port", "专用端口", "CAPACITY"], ["refresh-cw", "住宅轮换", "ISP"], ["database", "数据结果", "OUTPUT"]],
      stats: [["每端口", "不限流量 / 并发"], ["轮转周期", "固定 3–30 分钟"], ["地区设置", "套餐级"]]
    },
    specs: [
      ["代理类型", "动态住宅代理 / 真实 ISP 网络出口"],
      ["计费方式", "按端口和使用周期，方案内不限流量"],
      ["并发限制", "每个端口不限并发线程"],
      ["带宽范围", "5–100Mbps，多档规格可选"],
      ["地区设置", "购买时不选择；提取代理时按套餐设置，不能逐端口指定"],
      ["IP 切换", "每个端口按套餐设定的固定周期轮转，可选 3–30 分钟"],
      ["接入协议", "HTTP(S) / SOCKS"]
    ],
    endpoint: "unlimit.residential.123proxy.cn:10253",
    username: "customer-port-08",
    plans: {
      title: "按端口数量与带宽购买",
      text: "每个端口不限流量与并发，提供 5–100Mbps 规格；地区和轮转周期由套餐统一设置。",
      note: "每个端口不限并发，但不限并发不等于无限吞吐；目标站点响应、端口带宽与任务重试仍会影响完成速度。地区和轮转周期按套餐统一设置。",
      items: [
        ["Standard", "标准持续任务", "适合少量长期在线节点、周期性采集与地区公开数据监测。", "5–20Mbps / 端口", ["每端口不限流量与并发", "3–30 分钟固定轮转", "套餐级地区设置"], "获取端口方案"],
        ["Scale", "多节点生产任务", "面向多个浏览器工作节点或更高吞吐的长期数据服务。", "20–100Mbps / 多端口", ["任务级端口隔离", "所有端口共享套餐地区", "按吞吐扩展容量"], "评估生产容量"]
      ]
    },
    faqs: [
      ["不限流量是否意味着带宽也不受限制？", "不限流量指不按累计传输 GB 计费。每个端口仍有对应带宽规格，实际吞吐也受目标站点与网络环境影响。"],
      ["IP 多久轮换一次？", "每个端口按照套餐设定的固定周期轮转出口 IP，可在 3–30 分钟范围内选择。"],
      ["一个端口限制并发线程吗？", "不限制。每个端口不限并发线程，但实际吞吐仍受端口带宽、目标响应速度与任务端性能影响。"],
      ["它适合浏览器自动化吗？", "适合。浏览器加载 HTML、图片、CSS、JavaScript 和接口时会产生多个并行请求，而该产品每个端口不限并发线程。仍应根据页面资源量、端口带宽和工作节点数量评估实际吞吐。"],
      ["它与按流量住宅代理怎么选？", "任务间歇运行、需要广泛全球地区时，按流量住宅更灵活；长期在线、流量较大且重点地区明确时，不限量端口更容易控制预算。"],
      ["可以给每个端口设置不同地区吗？", "不可以。购买套餐时不选择地区；提取代理时为套餐设置地区，同一套餐内全部端口共享该地区配置。需要不同地区时应使用不同套餐。"],
      ["可以给每个端口设置不同轮转周期吗？", "轮转周期随套餐配置，在 3–30 分钟范围内选择固定周期。套餐内端口按所选规则轮转，不用于逐次请求或逐端口临时切换。"],
      ["不限并发为什么不等于无限吞吐？", "不限并发表示端口不按在途线程数限制请求，但端口带宽、目标站点响应速度、客户端性能和重试率仍会共同决定最终吞吐。"]
    ],
    cta: ["选择不限量住宅端口套餐", "按节点数、目标地区、带宽和轮转周期配置端口。", "获取端口方案"]
  },
  staticDatacenter: {
    file: "static-datacenter-proxy.html",
    pricingUrl: "pricing.html?product=static-datacenter",
    name: "长效静态代理",
    eyebrow: "Dedicated datacenter proxy",
    title: "固定独享出口，保持长期任务稳定",
    titleLines: ["固定独享出口，", "保持长期任务稳定"],
    lead: "独享固定数据中心 IP，提供不限流量与稳定带宽，适合固定出口、长会话、目标系统来源 IP 白名单和企业系统连接。",
    points: ["独享固定 IP", "不限流量", "69 个支持地区", "不提供免费测试"],
    regionCodes: staticDatacenterRegions,
    visual: {
      caption: "Dedicated endpoint / uptime monitor",
      id: "static-dc / endpoint-027",
      status: "fixed route online",
      steps: ["CLIENT", "AUTH", "FIXED IP", "TARGET"],
      primary: ["DEDICATED IP", "38.91.*.27", "LEASE ACTIVE"],
      secondary: ["ROUTE UPTIME", "99.99%", "NO ROTATION"],
      metrics: [["PORT BANDWIDTH", "10 Mbps", "unlimited traffic"], ["LEASE PERIOD", "28 days", "auto renewal ready"], ["SESSION RTT", "34 ms", "stable route"]],
      log: ["10:42:18  endpoint-027 health check passed", "10:42:19  static route unchanged / status 200"]
    },
    strip: [["独享", "固定数据中心 IP"], ["不限流量", "按周期使用"], ["5–10Mbps", "稳定带宽规格"], ["7×24", "持续在线服务"]],
    overview: {
      kicker: "01 / Product capability",
      title: "独享固定数据中心 IP",
      text: "使用周期内保持同一出口，支持不限流量和 5–10Mbps 带宽。"
    },
    capabilities: [
      ["pin", "固定独享 IP", "使用周期内保持同一出口，便于在目标系统登记来源 IP。"],
      ["infinity", "不限流量", "不按累计 GB 计费，适合长期在线和持续同步。"],
      ["gauge", "稳定带宽", "提供 5–10Mbps 规格，性能与成本清晰。"],
      ["server", "高性能云端资源", "数据中心网络提供低延迟、可预测的连接。"],
      ["key-round", "账密认证", "使用提取后分配的代理用户名和密码接入。"],
      ["monitor-check", "7×24 可用性", "持续健康监控，适合生产系统和长期任务。"]
    ],
    workloads: [
      ["01", "合作方 IP 白名单", "固定出口便于接入需要预先登记来源 IP 的企业 API 与数据服务。", "网络身份：固定"],
      ["02", "长期浏览器任务", "在相同网络出口下运行持续会话，减少路由变化对任务状态的影响。", "会话：长期稳定"],
      ["03", "系统间数据同步", "为定时任务、Webhook 接收方或公开服务访问提供可预测的出口。", "运行：7×24"]
    ],
    workflow: {
      title: "固定代理端点接入",
      text: "按 IP 数量和周期购买套餐，提取代理时从支持清单选择地区。使用分配的代理账密接入，并可将固定出口登记到目标系统的来源 IP 白名单。",
      steps: [
        ["01", "购买 IP 数量与周期", "购买时无需选择地区，按需要选择 IP 数量和使用周期。"],
        ["02", "提取时选择地区", "从 69 个支持地区中选择，控制台生成固定地址、端口与鉴权。"],
        ["03", "登记目标系统白名单", "如业务需要，可在合作方或企业系统登记固定出口 IP。代理接入仍使用账密认证。"],
        ["04", "持续健康监控", "观察连通性、延迟和续费周期。"]
      ],
      flow: [["building-2", "企业系统", "SOURCE"], ["key-round", "代理鉴权", "AUTH"], ["server", "独享 IP", "FIXED"], ["network", "合作服务", "ALLOWLIST"]],
      stats: [["出口身份", "固定独享"], ["流量口径", "不限流量"], ["带宽规格", "5–10Mbps"]]
    },
    specs: [
      ["代理类型", "独享静态数据中心代理"],
      ["IP 生命周期", "使用周期内固定，不自动轮换"],
      ["计费方式", "按 IP 和使用周期，方案内不限流量"],
      ["带宽范围", "5–10Mbps，具体以可选地区和套餐为准"],
      ["支持地区", "69 个国家和地区；购买时无需选择，提取代理时指定"],
      ["免费测试", "不提供免费测试"],
      ["接入协议", "HTTP(S) / SOCKS"],
      ["鉴权方式", "分配的代理用户名和密码"]
    ],
    endpoint: "38.91.24.27:8080",
    username: "customer-static",
    plans: {
      title: "按 IP 数量和周期购买",
      text: "每个端点提供独享固定数据中心 IP、不限流量和对应带宽规格。",
      note: "固定 IP 适合明确的企业连接和长期任务。请为每个端点设置用途、负责人和续费提醒。",
      items: [
        ["Single endpoint", "单项目固定出口", "适合合作方白名单、单个自动化任务或企业系统稳定连接。", "1 个独享 IP", ["使用周期内固定", "不限流量", "标准协议接入"], "选择固定出口"],
        ["Endpoint pool", "多项目静态 IP 池", "为不同项目、环境或团队分配独立端点，降低相互影响。", "多个独享 IP", ["项目级网络隔离", "统一续费与权限管理", "企业技术支持"], "规划静态 IP 池"]
      ]
    },
    faqs: [
      ["静态代理的 IP 会自动更换吗？", "不会。IP 在购买和续费周期内保持固定。如需更换地区或端点，可联系支持评估可用资源。"],
      ["不限流量是否有带宽上限？", "有。不限流量指不按累计 GB 计费，每个代理端点仍对应 5–10Mbps 等带宽规格。"],
      ["静态数据中心与静态住宅如何选择？", "数据中心代理通常更强调性能、稳定和成本；静态住宅代理来自 ISP 住宅网络，更适合对网络类型和地区身份敏感的任务。"],
      ["可以用于目标系统的 IP 白名单吗？", "可以。固定出口适合加入合作方 API、数据库网关或企业服务的来源 IP 白名单；连接 123Proxy 代理本身仍使用分配的代理用户名和密码。"],
      ["长效静态代理是独享 IP 吗？", "是。每个端点分配独享数据中心 IP，适合按项目、环境或业务系统隔离固定出口。"],
      ["可以选择国家或地区吗？", "可以。购买套餐时无需选择地区，提取代理时从页面列出的 69 个支持国家和地区中选择。"],
      ["是否提供免费测试？", "不提供。长效静态代理需要直接购买付费套餐，再在提取代理时选择支持地区。"],
      ["如何避免续费后任务中断？", "建议开启续费提醒并为生产端点建立资产清单。多项目场景可预留备用端点并定期做连通性检查。"],
      ["适合大规模动态网页采集吗？", "如果任务需要频繁更换出口或大规模 IP 池，动态隧道代理通常更合适。长效静态代理的核心价值是固定、独享和稳定，而不是高频轮换。"]
    ],
    cta: ["选择独享固定代理 IP", "按 IP 数量和周期购买，提取代理时选择支持地区。", "查询静态资源"]
  },
  staticResidential: {
    file: "static-residential-proxy.html",
    pricingUrl: "pricing.html?product=static-residential",
    name: "长效静态住宅代理",
    eyebrow: "Static ISP residential proxy",
    title: "固定住宅 ISP，保持地区会话连续",
    titleLines: ["固定住宅 ISP，", "保持地区会话连续"],
    lead: "真实 ISP 网络的长效固定住宅 IP，兼顾住宅属性与静态出口稳定性，适合长期地区一致性、固定会话和关键业务访问。",
    points: ["真实住宅 ISP", "长效固定 IP", "69 个支持地区", "不提供免费测试"],
    regionCodes: staticResidentialRegions,
    visual: {
      caption: "Static ISP identity / session continuity",
      id: "static-residential / isp-114",
      status: "identity verified",
      steps: ["CLIENT", "AUTH", "ISP HOME", "TARGET"],
      primary: ["ISP IDENTITY", "US · Comcast", "RESIDENTIAL VERIFIED"],
      secondary: ["SESSION AGE", "16 days", "IP UNCHANGED"],
      metrics: [["DEDICATED IP", "73.18.*.114", "exclusive lease"], ["PORT BANDWIDTH", "10 Mbps", "unlimited traffic"], ["ROUTE HEALTH", "99.99%", "session stable"]],
      log: ["10:42:18  isp-114 network identity verified", "10:42:19  long-session route unchanged / status 200"]
    },
    strip: [["住宅 ISP", "真实网络属性"], ["长效固定", "使用周期内不轮换"], ["不限流量", "按 IP 周期使用"], ["69 个", "支持国家和地区"]],
    overview: {
      kicker: "01 / Product capability",
      title: "独享固定住宅 ISP IP",
      text: "使用周期内保持同一住宅出口，支持不限流量，可在提取代理时从 69 个国家和地区中选择。"
    },
    capabilities: [
      ["wifi", "真实住宅 ISP", "运营商住宅出口具备明确的地区与 ISP 属性。"],
      ["pin", "长效固定 IP", "周期内保持同一出口，适合持续会话和地区一致性。"],
      ["user-check", "独享使用", "端点专属分配，减少共享出口相互影响。"],
      ["infinity", "不限流量", "按 IP 与周期使用，不累计 GB，预算更可控。"],
      ["map-pinned", "69 个支持地区", "购买套餐时无需选择地区，提取代理时从支持清单中选择。"],
      ["key-round", "账密认证", "使用提取后分配的代理用户名和密码接入。"]
    ],
    workloads: [
      ["01", "长期地区内容研究", "持续从相同地区和 ISP 网络访问公开页面，保持样本环境一致。", "身份：住宅 + 固定"],
      ["02", "多步骤会话任务", "同一 IP 支撑翻页、筛选与连续请求，减少中途路由变化。", "会话：长效保持"],
      ["03", "关键业务固定访问", "为需要住宅网络属性和固定来源的企业任务提供独享端点。", "资源：独享 IP"]
    ],
    workflow: {
      title: "固定住宅端点接入",
      text: "按住宅 IP 数量和周期购买套餐，提取代理时选择支持地区并分配独享端点，IP 在使用周期内保持不变。",
      steps: [
        ["01", "购买住宅 IP 与周期", "购买时无需选择地区，按需要选择 IP 数量和使用周期。"],
        ["02", "提取时选择地区", "从 69 个支持地区中选择并获得固定端点、端口和鉴权。"],
        ["03", "绑定业务会话", "端点绑定项目或工作节点，保持环境一致。"],
        ["04", "监控健康与周期", "检查连通性、延迟和续费状态。"]
      ],
      flow: [["laptop", "业务应用", "CLIENT"], ["key-round", "安全鉴权", "AUTH"], ["wifi", "住宅 ISP", "STATIC"], ["globe-2", "地区内容", "RESPONSE"]],
      stats: [["网络类型", "住宅 ISP"], ["出口策略", "长效固定"], ["资源模式", "独享 IP"]]
    },
    specs: [
      ["代理类型", "独享长效静态住宅代理 / 真实 ISP 网络"],
      ["覆盖范围", "69 个国家和地区；购买时无需选择，提取代理时指定"],
      ["IP 生命周期", "使用周期内固定，不自动轮换"],
      ["计费方式", "按 IP 和使用周期，方案内不限流量"],
      ["带宽范围", "通常为 5–10Mbps，具体以资源规格为准"],
      ["免费测试", "不提供免费测试"],
      ["鉴权与协议", "代理用户名和密码；HTTP(S) / SOCKS"]
    ],
    endpoint: "73.18.42.114:8080",
    username: "customer-static-isp",
    plans: {
      title: "按住宅 IP 和周期购买",
      text: "每个端点独享固定住宅 ISP IP，具体国家、ISP、带宽和数量取决于当前库存。",
      note: "住宅 ISP 资源会随地区库存变化。页面展示的覆盖范围用于产品说明，实际可购资源以控制台和方案确认为准。",
      items: [
        ["Dedicated ISP", "单个固定住宅端点", "适合一个长期会话、地区研究任务或关键工作节点。", "1 个独享住宅 IP", ["使用周期内固定", "方案内不限流量", "真实住宅 ISP 属性"], "查询住宅库存"],
        ["ISP portfolio", "多地区住宅端点组", "为多个地区、项目或工作节点分别配置固定住宅身份。", "多个地区 / 多个 IP", ["项目级端点隔离", "地区与资源组合", "统一企业支持"], "规划端点组合"]
      ]
    },
    faqs: [
      ["静态住宅 IP 与动态住宅 IP 有什么区别？", "静态住宅 IP 在使用周期内保持不变，适合长会话和地区一致性；动态住宅代理会自动轮换，更适合大范围页面发现和弹性采集。"],
      ["能否指定具体 ISP？", "是否可指定取决于目标国家和当前库存。可先提交地区与 ISP 偏好，由方案人员确认可用资源。"],
      ["静态住宅为什么比数据中心代理更适合某些任务？", "它同时提供固定出口和住宅 ISP 网络属性，适合对网络类型、地区身份与会话连续性更敏感的公开数据源。"],
      ["长效静态住宅 IP 是独享的吗？", "是。固定住宅端点按 IP 独享分配，在使用周期内保持稳定，减少共享出口对长期会话的影响。"],
      ["IP 会在续费后保持不变吗？", "在及时续费且资源状态正常的情况下通常可持续使用原端点。生产任务仍建议设置续费提醒并准备连接异常处理。"],
      ["不限流量是否适合大规模下载？", "不限流量不按累计 GB 计费，但单个端点有带宽规格。大规模下载应根据完成周期评估所需 IP 数量与总带宽。"],
      ["地区和 ISP 是否始终有库存？", "不能保证。购买套餐时无需选择地区；提取代理时从 69 个支持地区中选择，具体 ISP 和即时可用资源以提取页面为准。"],
      ["是否提供免费测试？", "不提供。长效静态住宅需要直接购买付费套餐，再在提取代理时选择支持地区。"],
      ["它适合需要频繁换 IP 的任务吗？", "不适合。长效静态住宅代理用于保持固定住宅身份；需要周期轮转时应选择不限量动态住宅，需要按请求或 SESSION 调度时应选择隧道住宅代理。"]
    ],
    cta: ["选择固定住宅 ISP 端点", "按住宅 IP 数量和周期购买，提取代理时选择支持地区。", "查询住宅资源"]
  }
};

const productList = [
  ["high-bandwidth-proxy.html", "高带宽代理 IP", "不限流量，面向 AI 大规模数据下载", "gauge"],
  ["scraping-rotating-proxy.html", "隧道代理", "混合与纯住宅双池，默认全球随机", "route"],
  ["residential-proxy.html", "隧道住宅代理", "8000万+ 住宅 IP，国家/地区定向", "house"],
  ["unlimited-residential-proxy.html", "不限量动态住宅", "每端口不限流量与并发", "refresh-cw"],
  ["static-datacenter-proxy.html", "长效静态代理", "独享固定机房 IP，稳定长会话", "server"],
  ["static-residential-proxy.html", "长效静态住宅", "固定住宅出口，兼顾身份与稳定性", "radio-tower"]
];

const pricingList = [
  ["pricing.html?product=tunnel", "隧道代理", "¥45/线程", "或 ¥3/GB", "route"],
  ["pricing.html?product=residential", "隧道住宅代理", "¥3/GB 起", "按实际流量计费", "house"],
  ["pricing.html?product=unlimited", "不限量动态住宅", "¥600 起", "按端口与周期计费", "refresh-cw"],
  ["pricing.html?product=static-datacenter", "长效静态代理", "¥20/个 起", "按固定 IP 与周期计费", "server"],
  ["pricing.html?product=static-residential", "长效静态住宅", "¥40/个 起", "按住宅 IP 与周期计费", "radio-tower"],
  ["contact.html#solutions", "高带宽与定制方案", "项目报价", "按带宽、目标与规模配置", "gauge"]
];

const currentKey = document.body.dataset.product;
const pageData = productPages[currentKey];

if (!pageData) {
  throw new Error(`Unknown product page: ${currentKey}`);
}

const icon = (name, className = "") => `<i data-lucide="${name}"${className ? ` class="${className}"` : ""} aria-hidden="true"></i>`;

const developerGuideRoutes = {
  tunnel: "/developers/products/scraping-rotating-proxy/",
  residential: "/developers/products/residential-rotating-proxy/",
  unlimitedResidential: "/developers/products/unlimited-residential-proxy/",
  staticDatacenter: "/developers/products/static-datacenter-proxy/",
  staticResidential: "/developers/products/static-residential-proxy/"
};

function developerGuideCta() {
  const href = developerGuideRoutes[currentKey];
  return href
    ? `<a class="btn btn-on-dark developer-guide-cta" href="${href}">${icon("book-open")}查看完整接入手册</a>`
    : "";
}

function brandMarkup() {
  return `
    <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
      <rect x="12" y="0" width="20" height="20" rx="4" fill="#1116ef"></rect>
      <rect x="0" y="24" width="20" height="20" rx="4" fill="#2f80ed"></rect>
      <rect x="24" y="24" width="20" height="20" rx="4" fill="#4cc9ed"></rect>
      <text x="22" y="15.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">1</text>
      <text x="10" y="39.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">2</text>
      <text x="34" y="39.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">3</text>
    </svg>
    <span class="brand-wordmark"><img class="wordmark-proxy-original" src="assets/123proxy-proxy-original.svg" alt="Proxy"></span>`;
}

function productMegaMenu() {
  return `
    <div class="mega-menu">
      <div class="mega-layout">
        <div class="mega-intro">
          <span class="mega-label">Proxy products</span>
                  <strong>六类代理产品</strong>
                  <p>覆盖全球轮换、地区住宅、不限量端口和固定出口。</p>
          <a href="index.html#products">查看全部代理产品${icon("arrow-right")}</a>
        </div>
        <div class="mega-links">
          ${productList.map(([href, name, desc, itemIcon], index) => `
            <a class="mega-link${index === 0 ? " is-featured" : ""}" href="${href}"${href === pageData.file ? ' aria-current="page"' : ""}>
              <span class="mega-link-icon">${icon(itemIcon)}</span>
              <span><strong>${name}</strong><small>${desc}</small></span>
            </a>`).join("")}
        </div>
      </div>
    </div>`;
}

function pricingMegaMenu() {
  return `<div class="mega-menu is-pricing">
      <div class="mega-layout">
        <div class="mega-intro">
          <span class="mega-label">Pricing</span>
          <strong>代理价格与计费方式</strong>
          <p>快速比较流量、线程、端口与固定 IP 方案。</p>
          <a href="pricing.html">查看全部价格与免费测试${icon("arrow-right")}</a>
        </div>
        <div class="mega-links">
          ${pricingList.map(([href, name, price, note, itemIcon], index) => `<a class="mega-link${index === 0 ? " is-featured" : ""}" href="${href}">
              <span class="mega-link-icon">${icon(itemIcon)}</span>
              <span><strong>${name}</strong><small class="mega-price"><b>${price}</b><em>${note}</em></small></span>
            </a>`).join("")}
        </div>
      </div>
    </div>`;
}

function headerMarkup() {
  return `
    <div class="utility-bar">
      <div class="container utility-inner">
        <div class="utility-left">
          <span class="utility-status"><span class="status-dot"></span>全球代理网络运行正常</span>
          <span>为爬虫工程师与 AI 数据团队提供服务</span>
        </div>
        <div class="utility-right">
          <a class="utility-link" href="/status/">服务状态</a>
          <a class="utility-link" href="/developers/">开发文档</a>
          <a class="utility-link" href="contact.html">联系我们</a>
        </div>
      </div>
    </div>
    <header class="header">
      <nav class="container nav" aria-label="主导航">
        <a class="brand" href="index.html" aria-label="123Proxy 首页">
          ${brandMarkup()}
        </a>
        <div class="nav-links">
          <div class="nav-item">
            <button class="nav-trigger is-active" type="button" aria-expanded="false">代理产品${icon("chevron-down")}</button>
            ${productMegaMenu()}
          </div>
          <div class="nav-item">
            <button class="nav-trigger" type="button" aria-expanded="false">AI 数据方案${icon("chevron-down")}</button>
            <div class="mega-menu">
              <div class="mega-layout">
                <div class="mega-intro">
                  <span class="mega-label">AI data workloads</span>
                  <strong>AI 数据采集代理</strong>
                  <p>面向视频、图片、代码和文本数据的持续下载与采集。</p>
                  <a href="ai-data.html">查看 AI 数据方案${icon("arrow-right")}</a>
                </div>
                <div class="mega-links">
                  <a class="mega-link is-featured" href="high-bandwidth-proxy.html"><span class="mega-link-icon">${icon("gauge")}</span><span><strong>高带宽代理 IP</strong><small>AI 数据任务的核心代理产品</small></span></a>
                  <a class="mega-link" href="ai-video-proxy.html"><span class="mega-link-icon">${icon("video")}</span><span><strong>视频与多模态数据</strong><small>视频、音频、字幕与元数据下载</small></span></a>
                  <a class="mega-link" href="ai-image-proxy.html"><span class="mega-link-icon">${icon("images")}</span><span><strong>大规模图片数据</strong><small>高并发图片数据集构建</small></span></a>
                  <a class="mega-link" href="ai-github-proxy.html"><span class="mega-link-icon">${icon("file-code-2")}</span><span><strong>公开代码数据</strong><small>代码仓库与 Code LLM 数据采集</small></span></a>
                  <a class="mega-link" href="ai-text-proxy.html"><span class="mega-link-icon">${icon("files")}</span><span><strong>全网文本与文档</strong><small>新闻、论坛、博客与公开文档</small></span></a>
                  <a class="mega-link" href="ai-youtube-api.html"><span class="mega-link-icon">${icon("braces")}</span><span><strong>YouTube 采集 API</strong><small>视频元数据、字幕与评论接口</small></span></a>
                </div>
              </div>
            </div>
          </div>
          <a href="global-network.html">全球网络</a>
          <div class="nav-item">
            <button class="nav-trigger" type="button" aria-expanded="false">开发者${icon("chevron-down")}</button>
            <div class="mega-menu is-compact">
              <div class="mega-layout">
                <div class="mega-intro">
                  <span class="mega-label">Developers</span>
                  <strong>从首次请求到生产采集</strong>
                  <p>产品手册、工程指南与 9 个可运行代码案例。</p>
                  <a href="/developers/">开发者中心${icon("arrow-right")}</a>
                </div>
                <div class="mega-links">
                  <a class="mega-link is-featured" href="/developers/getting-started/"><span class="mega-link-icon">${icon("rocket")}</span><span><strong>5 分钟快速开始</strong><small>生成代理、cURL 验证与代码接入</small></span></a>
                  <a class="mega-link" href="/developers/#products"><span class="mega-link-icon">${icon("book-open")}</span><span><strong>产品接入手册</strong><small>按产品查看认证、路由与提取方式</small></span></a>
                  <a class="mega-link" href="/developers/#guides"><span class="mega-link-icon">${icon("chart-no-axes-combined")}</span><span><strong>工程实践指南</strong><small>并发、SESSION、错误重试与产品选型</small></span></a>
                  <a class="mega-link" href="/developers/examples/"><span class="mega-link-icon">${icon("code-2")}</span><span><strong>9 个完整代码案例</strong><small>HTTP 客户端、爬虫框架与浏览器自动化</small></span></a>
                </div>
              </div>
            </div>
          </div>
          <div class="nav-item">
            <button class="nav-trigger" type="button" aria-expanded="false">企业服务${icon("chevron-down")}</button>
            <div class="mega-menu is-compact is-enterprise">
              <div class="mega-layout">
                <div class="mega-intro">
                  <span class="mega-label">Enterprise</span>
                  <strong>企业代理与数据服务</strong>
                  <p>定制代理池、高带宽项目和公开数据采集交付。</p>
                  <a href="enterprise.html">企业服务总览${icon("arrow-right")}</a>
                </div>
                <div class="mega-links">
                  <a class="mega-link is-featured" href="custom-proxy-pool.html"><span class="mega-link-icon">${icon("network")}</span><span><strong>定制代理池</strong><small>按目标、任务与带宽配置资源</small></span></a>
                  <a class="mega-link" href="data-scraping-service.html"><span class="mega-link-icon">${icon("database-zap")}</span><span><strong>数据采集服务</strong><small>公开数据项目实施与交付</small></span></a>
                </div>
              </div>
            </div>
          </div>
          <div class="nav-item">
            <button class="nav-trigger" type="button" aria-expanded="false">价格${icon("chevron-down")}</button>
            ${pricingMegaMenu()}
          </div>
        </div>
        <div class="nav-actions">
          <a class="btn btn-ghost" href="https://console.123proxy.cn/login.html">登录</a>
          <a class="btn btn-primary" href="https://console.123proxy.cn/register.html">免费测试 1GB</a>
          <button class="btn icon-btn mobile-menu-btn" id="menuToggle" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="打开导航">${icon("menu")}</button>
        </div>
      </nav>

      <div class="mobile-menu" id="mobileMenu">
        <details>
          <summary>代理产品${icon("chevron-down")}</summary>
          <div class="mobile-submenu">
            ${productList.map(([href, name]) => `<a href="${href}">${name}</a>`).join("")}
          </div>
        </details>
        <details>
          <summary>AI 数据方案${icon("chevron-down")}</summary>
          <div class="mobile-submenu">
            <a href="high-bandwidth-proxy.html">高带宽代理 IP</a>
            <a href="ai-data.html">方案总览</a>
            <a href="ai-video-proxy.html">视频数据</a>
            <a href="ai-image-proxy.html">图片数据</a>
            <a href="ai-github-proxy.html">代码数据</a>
            <a href="ai-text-proxy.html">文本与文档</a>
            <a href="ai-youtube-api.html">YouTube API</a>
          </div>
        </details>
        <a href="global-network.html">全球网络${icon("chevron-right")}</a>
        <details>
          <summary>开发者${icon("chevron-down")}</summary>
          <div class="mobile-submenu">
            <a href="/developers/">文档首页</a>
            <a href="/developers/getting-started/">快速开始</a>
            <a href="/developers/#products">产品接入</a>
            <a href="/developers/#guides">工程指南</a>
            <a href="/developers/examples/">代码案例</a>
          </div>
        </details>
        <details>
          <summary>企业服务${icon("chevron-down")}</summary>
          <div class="mobile-submenu">
            <a href="enterprise.html">企业服务总览</a>
            <a href="custom-proxy-pool.html">定制代理池</a>
            <a href="data-scraping-service.html">数据采集服务</a>
          </div>
        </details>
        <details>
          <summary>价格${icon("chevron-down")}</summary>
          <div class="mobile-submenu">
            ${pricingList.slice(0, 5).map(([href, name, price]) => `<a href="${href}">${name}<span>${price}</span></a>`).join("")}
          </div>
        </details>
        <a href="contact.html">联系我们${icon("chevron-right")}</a>
      </div>
    </header>`;
}

function heroVisualMarkup(v) {
  if (currentKey === "tunnel") {
    return `
      <div class="hero-visual tunnel-route-visual" aria-label="隧道代理双池路由示意">
        <div class="visual-topline"><span>Proxy pool routing</span><span class="visual-live">routing ready</span></div>
        <div class="tunnel-routing-panel">
          <div class="tunnel-routing-head">
            <span>${icon("terminal")} 固定隧道入口</span>
            <small>HTTP(S) / SOCKS</small>
          </div>
          <div class="tunnel-routing-body">
            <div class="tunnel-routing-path">
              <div class="tunnel-path-node">
                ${icon("code-2")}
                <span>REQUEST</span>
                <strong>采集程序</strong>
              </div>
              <span class="tunnel-path-arrow">${icon("arrow-right")}</span>
              <div class="tunnel-path-node is-gateway">
                ${icon("waypoints")}
                <span>FIXED ENTRY</span>
                <strong>隧道网关</strong>
              </div>
            </div>
            <div class="tunnel-pool-prompt"><span>选择出口代理池</span><small>根据任务选择出口池</small></div>
            <div class="tunnel-hero-pools">
              <div class="tunnel-hero-pool is-mixed">
                <span class="tunnel-pool-index">01</span>
                <div><strong>爬虫混合池</strong><small>约 95% 住宅 + 约 5% 数据中心 IP</small></div>
                <em>速度优先</em>
              </div>
              <div class="tunnel-hero-pool is-pure">
                <span class="tunnel-pool-index">02</span>
                <div><strong>纯住宅 IP 池</strong><small>100% 住宅 IP · 支持 SESSION</small></div>
                <em>住宅属性优先</em>
              </div>
            </div>
            <div class="tunnel-routing-egress">
              ${icon("globe-2")}
              <span><strong>默认全球随机出口</strong><small>提取时可选欧美 / 北美 / 欧洲 / 亚洲 / 美国 / 日韩</small></span>
            </div>
          </div>
        </div>
      </div>`;
  }

  if (currentKey === "residential") {
    return `
      <div class="hero-visual residential-route-visual" aria-label="隧道住宅代理地区与会话路由示意">
        <div class="visual-topline"><span>Residential geo / session routing</span><span class="visual-live">routes ready</span></div>
        <div class="residential-routing-panel">
          <div class="residential-routing-head">
            <span>${icon("terminal")} 固定住宅隧道</span>
            <small>TRAFFIC BILLING ONLY</small>
          </div>
          <div class="residential-routing-body">
            <div class="residential-config-label"><span>地区与会话参数</span><small>提取代理时选择</small></div>
            <div class="residential-route-params">
              <div class="residential-route-param">
                ${icon("map-pinned")}
                <span>出口位置</span>
                <strong>国家 / 地区</strong>
                <small>190+ 可选位置</small>
              </div>
              <div class="residential-route-param">
                ${icon("key-round")}
                <span>会话保持</span>
                <strong>指定会话</strong>
                <small>保持住宅出口</small>
              </div>
            </div>
            <div class="residential-route-join">${icon("arrow-down")}<span>住宅网关匹配出口</span></div>
            <div class="residential-pool-summary">
              <span class="residential-pool-icon">${icon("wifi")}</span>
              <div><span>全球住宅代理池</span><strong>8000万+ 住宅代理 IP</strong></div>
              <div class="residential-coverage"><strong>190+</strong><small>国家和地区</small></div>
            </div>
            <div class="residential-routing-result">
              ${icon("circle-check")}
              <span><strong>目标地区住宅出口已匹配</strong><small>按实际传输流量使用</small></span>
            </div>
          </div>
        </div>
      </div>`;
  }

  if (currentKey === "unlimitedResidential") {
    return `
      <div class="hero-visual focus-hero-visual is-unlimited" aria-label="不限量动态住宅代理套餐与端口示意">
        <div class="visual-topline"><span>Residential port control</span><span class="visual-live">ports ready</span></div>
        <div class="focus-console">
          <div class="focus-console-head">
            <span>${icon("settings-2")} 套餐控制面</span>
            <small>PLAN-LEVEL POLICY</small>
          </div>
          <div class="focus-console-body">
            <div class="focus-config-grid">
              <div class="focus-config-item">
                <span>套餐出口地区</span>
                <strong>US / 套餐统一</strong>
                <small>提取时设置 / 全部端口共享</small>
              </div>
              <div class="focus-config-item">
                <span>出口轮转周期</span>
                <strong>10 分钟</strong>
                <small>固定 3–30 分钟可选</small>
              </div>
            </div>
            <div class="focus-section-label"><span>套餐内可用端口</span><small>不限流量与并发</small></div>
            <div class="port-status-stack">
              <div class="port-status-row"><span class="port-status-index">P-01</span><strong>采集节点 A</strong><small>20 Mbps</small><em>运行中</em></div>
              <div class="port-status-row"><span class="port-status-index">P-02</span><strong>浏览器节点 B</strong><small>20 Mbps</small><em>运行中</em></div>
              <div class="port-status-row"><span class="port-status-index">P-03</span><strong>定时任务 C</strong><small>20 Mbps</small><em>运行中</em></div>
            </div>
            <div class="focus-result">
              ${icon("refresh-cw")}
              <span><strong>住宅出口按固定周期轮转</strong><small>每端口不限流量，也不限并发线程</small></span>
            </div>
          </div>
        </div>
      </div>`;
  }

  if (currentKey === "staticDatacenter") {
    return `
      <div class="hero-visual focus-hero-visual is-static-dc" aria-label="长效静态代理固定端点示意">
        <div class="visual-topline"><span>Dedicated endpoint identity</span><span class="visual-live">route online</span></div>
        <div class="focus-console">
          <div class="focus-console-head">
            <span>${icon("server")} 固定机房端点</span>
            <small>DEDICATED IP</small>
          </div>
          <div class="focus-console-body">
            <div class="identity-primary">
              <span class="identity-primary-icon">${icon("pin")}</span>
              <div><span>固定出口 IP</span><strong>38.91.24.27</strong><small>使用周期内不自动轮换</small></div>
              <em>独享</em>
            </div>
            <div class="identity-fact-grid">
              <div><span>支持地区</span><strong>69 个地区</strong><small>提取代理时选择</small></div>
              <div><span>端口带宽</span><strong>10 Mbps</strong><small>稳定规格</small></div>
              <div><span>流量方式</span><strong>不限流量</strong><small>不按 GB 计费</small></div>
              <div><span>认证方式</span><strong>代理账密</strong><small>HTTP(S) / SOCKS</small></div>
            </div>
            <div class="fixed-route-line">
              <span>${icon("building-2")}业务系统</span><i>${icon("arrow-right")}</i><span class="is-fixed">${icon("server")}固定 IP</span><i>${icon("arrow-right")}</i><span>${icon("network")}目标服务</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  if (currentKey === "staticResidential") {
    return `
      <div class="hero-visual focus-hero-visual is-static-residential" aria-label="长效静态住宅代理固定 ISP 身份示意">
        <div class="visual-topline"><span>Static residential identity</span><span class="visual-live">identity ready</span></div>
        <div class="focus-console">
          <div class="focus-console-head">
            <span>${icon("wifi")} 固定住宅身份</span>
            <small>ISP RESIDENTIAL</small>
          </div>
          <div class="focus-console-body">
            <div class="identity-primary is-residential">
              <span class="identity-primary-icon">${icon("house")}</span>
              <div><span>固定住宅 ISP 出口</span><strong>US · Residential ISP</strong><small>独享住宅 IP / 长效固定</small></div>
              <em>已验证</em>
            </div>
            <div class="identity-fact-grid">
              <div><span>网络类型</span><strong>住宅 ISP</strong><small>真实运营商网络</small></div>
              <div><span>支持地区</span><strong>69 个地区</strong><small>提取代理时选择</small></div>
              <div><span>出口周期</span><strong>周期内固定</strong><small>不自动轮换</small></div>
              <div><span>流量方式</span><strong>不限流量</strong><small>按 IP 与周期</small></div>
            </div>
            <div class="fixed-route-line is-residential">
              <span>${icon("laptop")}业务应用</span><i>${icon("arrow-right")}</i><span class="is-fixed">${icon("house")}住宅 ISP</span><i>${icon("arrow-right")}</i><span>${icon("globe-2")}地区内容</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  return `
    <div class="hero-visual" aria-label="${pageData.name}运行状态示意">
      <div class="visual-topline"><span>${v.caption}</span><span class="visual-live">capacity ready</span></div>
      <div class="console">
        <div class="console-bar">
          <span class="console-id">${icon("terminal")} ${v.id}</span>
          <span class="console-status"><span class="status-dot"></span>${v.status}</span>
        </div>
        <div class="console-grid">
          <div class="route-panel">
            <div class="visual-label">Request route</div>
            <div class="route-line">
              ${v.steps.map((step, index) => `<div class="route-step${index === 2 ? " is-warm" : ""}"><span class="route-node"></span>${step}</div>`).join("")}
            </div>
            <div class="session-box">
              <div class="session-cell"><span>${v.primary[0]}</span><strong>${v.primary[1]}</strong><small>${v.primary[2]}</small></div>
              <div class="session-cell"><span>${v.secondary[0]}</span><strong>${v.secondary[1]}</strong><small>${v.secondary[2]}</small></div>
            </div>
          </div>
          <div class="telemetry-panel">
            <div>
              <div class="visual-label">Live telemetry</div>
              <div class="metric-stack">
                ${v.metrics.map((metric) => `<div class="metric-card"><span>${metric[0]}</span><strong>${metric[1]}</strong><small>${metric[2]}</small></div>`).join("")}
              </div>
            </div>
            <div class="console-log">${v.log.join("<br>")}</div>
          </div>
        </div>
      </div>
    </div>`;
}

function heroMarkup() {
  const v = pageData.visual;
  const subnav = currentKey === "tunnel"
    ? [["#overview", "产品说明"], ["#billing", "计费方式"], ["#workloads", "适用任务"], ["#specs", "技术规格"], ["#developers", "开发接入"], ["#faq", "常见问题"], [pageData.pricingUrl, "价格与套餐"]]
    : currentKey === "residential"
      ? [["#overview", "产品能力"], ["#billing", "流量计费"], ["#workloads", "适用任务"], ["#specs", "技术规格"], ["#developers", "开发接入"], ["#faq", "常见问题"], [pageData.pricingUrl, "价格与套餐"]]
      : [["#overview", "产品能力"], ["#billing", currentKey === "unlimitedResidential" ? "套餐与容量" : "购买与配置"], ["#workloads", "适用任务"], ["#specs", "技术规格"], ["#developers", "开发接入"], ["#faq", "常见问题"], [pageData.pricingUrl, "价格与套餐"]];
  return `
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <div class="hero-breadcrumb"><a href="index.html">首页</a><span>/</span><a href="index.html#products">代理产品</a><span>/</span><strong>${pageData.name}</strong></div>
          <div class="eyebrow">${pageData.eyebrow}</div>
          <h1>${(pageData.titleLines || [pageData.title]).map((line) => `<span class="hero-title-line">${line}</span>`).join("")}</h1>
          <p class="hero-lead">${pageData.lead}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}查看套餐价格</a>
            <a class="btn btn-on-dark" href="#developers">${icon("code-2")}查看接入示例</a>
          </div>
          <div class="hero-points">
            ${pageData.points.map((point) => `<span class="hero-point">${icon("circle-check")} ${point}</span>`).join("")}
          </div>
        </div>
        ${heroVisualMarkup(v)}
      </div>
    </section>
    <section class="metric-strip">
      <div class="container metric-strip-inner">
        ${pageData.strip.map(([value, label]) => `<div class="strip-item"><strong>${value}</strong><span>${label}</span></div>`).join("")}
      </div>
    </section>
    <div class="product-subnav">
      <div class="container subnav-inner">
        <span class="subnav-name">${pageData.name}</span>
        <div class="subnav-links">
          ${subnav.map(([href, label]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`).join("")}
        </div>
      </div>
    </div>`;
}

function tunnelMainMarkup() {
  const o = pageData.overview;
  const w = pageData.workflow;
  const comparisonRows = [
    ["计费口径", "实际传输的数据量（GB）", "同时在途的 HTTP 请求数"],
    ["是否累计流量", "是，按套餐流量额度核算", "不累计传输流量，方案内不限流量"],
    ["容量主要受什么影响", "响应体大小与总请求量", "线程数与目标站点响应时间"],
    ["更适合", "任务规模波动、响应体较小、按项目核算", "高频短请求、持续运行、代码直连协议"],
    ["测试时重点观察", "单次响应大小与预计月流量", "平均响应时间、峰值在途请求与重试率"]
  ];

  return `
    <main>
      ${heroMarkup()}

      <section class="section" id="overview">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">${o.kicker}</div><h2><span class="section-title-line">爬虫混合池与</span><span class="section-title-line">纯住宅 IP 池</span></h2></div>
            <p>${o.text}</p>
          </div>
          <div class="pool-mode-grid">
            <article class="pool-mode is-crawler">
              <div class="pool-mode-head">
                <span class="pool-label">POOL 01 / CRAWLER</span>
                <span class="pool-badge">采集速度优先</span>
              </div>
              <div class="pool-mode-title">
                <span class="pool-icon">${icon("route")}</span>
                <div><h3>爬虫混合池</h3><p>约 95% 住宅 IP + 5% 数据中心 IP，公开网页采集通常更快。</p></div>
              </div>
              <div class="pool-composition" aria-label="约 95% 住宅 IP 与约 5% 数据中心 IP">
                <span class="pool-segment is-residential"></span>
                <span class="pool-segment is-datacenter"></span>
              </div>
              <div class="pool-legend">
                <span><i class="legend-dot is-residential"></i><strong>约 95%</strong> 住宅 IP</span>
                <span><i class="legend-dot is-datacenter"></i><strong>约 5%</strong> 数据中心 IP</span>
              </div>
              <dl class="pool-facts">
                <div><dt>核心优势</dt><dd>采集速度通常更快</dd></div>
                <div><dt>出口策略</dt><dd>提取时选地区 / 自动轮换</dd></div>
                <div><dt>适合任务</dt><dd>高频公开网页采集</dd></div>
              </dl>
            </article>
            <article class="pool-mode is-pure">
              <div class="pool-mode-head">
                <span class="pool-label">POOL 02 / PURE RESIDENTIAL</span>
                <span class="pool-badge">住宅属性优先</span>
              </div>
              <div class="pool-mode-title">
                <span class="pool-icon">${icon("wifi")}</span>
                <div><h3>纯住宅 IP 池</h3><p>仅包含住宅 IP，支持 SESSION 保持短期出口。</p></div>
              </div>
              <div class="pool-composition is-pure" aria-label="100% 住宅 IP">
                <span class="pool-segment is-residential"></span>
              </div>
              <div class="pool-legend">
                <span><i class="legend-dot is-residential"></i><strong>100%</strong> 住宅 IP</span>
                <span><i class="legend-dot is-session"></i><strong>SESSION</strong> 保持出口</span>
              </div>
              <dl class="pool-facts">
                <div><dt>核心优势</dt><dd>纯住宅网络属性</dd></div>
                <div><dt>出口策略</dt><dd>提取时选地区 / 支持 SESSION</dd></div>
                <div><dt>适合任务</dt><dd>分页与多步骤采集</dd></div>
              </dl>
            </article>
          </div>
          <div class="product-boundary">
            <div class="boundary-intro">
              <span class="section-kicker">Product fit</span>
              <h3>两个代理池默认全球随机出口</h3>
              <p>无需设置地区即可全球随机；提取代理时也可选择欧美、北美、欧洲、亚洲、美国或日韩。</p>
            </div>
            <div class="boundary-column is-fit">
              <span>适合任务</span>
              <strong>粗粒度地区即可</strong>
              <p>适合按大区组织的公开网页、高频列表和代码直连采集。</p>
            </div>
            <div class="boundary-column">
              <span>其他需求</span>
              <strong>需要国家或地区定位</strong>
              <p>精确地区定向选隧道住宅；固定出口选长效静态代理。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-soft" id="billing">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">02 / Billing model</div><h2><span class="section-title-line">流量套餐与</span><span class="section-title-line">并发线程套餐</span></h2></div>
            <p>流量套餐按实际传输量扣减；线程套餐按同时在途请求数配置，方案内不限流量。</p>
          </div>
          <div class="billing-choice-grid">
            <article class="billing-choice">
              <div class="billing-choice-head"><span>TRAFFIC</span><strong>按流量使用</strong></div>
              <p>按实际传输数据量核算，适合波动任务、较小响应体或项目成本归集。</p>
              <div class="billing-key"><span>核心口径</span><strong>传输 GB</strong></div>
              <ul>
                <li>${icon("check")}容易按项目核算用量</li>
                <li>${icon("check")}适合测试期和弹性任务</li>
                <li>${icon("check")}重点关注平均响应大小</li>
              </ul>
            </article>
            <article class="billing-choice is-recommended">
              <div class="billing-choice-head"><span>CONCURRENCY</span><strong>按并发线程使用</strong></div>
              <p>按同时在途请求数配置容量，套餐内不限流量，适合代码持续发起大量短请求。</p>
              <div class="billing-key"><span>核心口径</span><strong>在途请求 / 不限流量</strong></div>
              <ul>
                <li>${icon("check")}适合 requests、Scrapy 等代码接入</li>
                <li>${icon("check")}固定线程预算便于持续运行</li>
                <li>${icon("check")}重点关注响应时间与重试率</li>
              </ul>
            </article>
          </div>
          <div class="billing-matrix" role="table" aria-label="按流量与按并发线程方案对比">
            <div class="billing-row billing-row-head" role="row">
              <span role="columnheader">比较项目</span><strong role="columnheader">按流量</strong><strong role="columnheader">按并发线程</strong>
            </div>
            ${comparisonRows.map(([label, traffic, concurrency]) => `
              <div class="billing-row" role="row">
                <span role="rowheader">${label}</span><p role="cell">${traffic}</p><p role="cell">${concurrency}</p>
              </div>`).join("")}
          </div>
          <div class="thread-guidance">
            <div class="thread-guidance-icon">${icon("git-branch")}</div>
            <div>
              <span class="section-kicker">Thread accounting</span>
              <h3>一个在途 HTTP 请求占用一个线程，浏览器页面通常不止一个请求</h3>
              <p>代码请求一个 URL 通常占用一个线程；浏览器会并行加载 HTML、图片、CSS、JavaScript、字体和接口，一个页面通常需要约 10–20 个线程。QPS 近似受“线程数 ÷ 平均响应时间”影响，超时与重试会降低有效吞吐。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="workloads">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">03 / Workloads</div><h2><span class="section-title-line">高频网页抓取与</span><span class="section-title-line">短会话任务</span></h2></div>
            <p>混合池适合速度优先的短请求，纯住宅池适合需要住宅属性和 SESSION 的请求。</p>
          </div>
          <div class="workload-grid">
            ${pageData.workloads.map(([index, title, text, meta]) => `<article class="workload-card"><span class="workload-index">${index}</span><h3>${title}</h3><p>${text}</p><div class="workload-meta">${meta}</div></article>`).join("")}
          </div>
          <div class="alternative-grid">
            <a href="residential-proxy.html"><span>${icon("map-pinned")}需要地区定向</span><strong>选择隧道住宅代理</strong><small>可按国家或地区选择纯住宅 ISP 出口</small></a>
            <a href="high-bandwidth-proxy.html"><span>${icon("gauge")}视频与大文件下载</span><strong>选择高带宽代理 IP</strong><small>面向 AI 数据任务配置项目级带宽</small></a>
            <a href="static-datacenter-proxy.html"><span>${icon("pin")}需要固定出口</span><strong>选择长效静态代理</strong><small>固定独享 IP，适合目标系统来源白名单与长期会话</small></a>
          </div>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container workflow-layout">
          <div class="workflow-copy">
            <div class="section-kicker">04 / How it works</div>
            <h2>${w.title}</h2>
            <p>${w.text}</p>
            <div class="workflow-list">
              ${w.steps.map(([index, title, text]) => `<div class="workflow-step"><span>${index}</span><div><strong>${title}</strong><p>${text}</p></div></div>`).join("")}
            </div>
          </div>
          <div class="architecture">
            <div class="architecture-head"><span>Proxy request architecture</span><span>123Proxy network</span></div>
            <div class="architecture-flow">
              ${w.flow.map(([itemIcon, title, meta]) => `<div class="arch-node">${icon(itemIcon)}<div><strong>${title}</strong><small>${meta}</small></div></div>`).join("")}
            </div>
            <div class="architecture-foot">
              ${w.stats.map(([label, value]) => `<div class="arch-stat"><span>${label}</span><strong>${value}</strong></div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="specs">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">05 / Specifications</div><h2>隧道代理技术规格</h2></div>
            <p>地区在提取代理时选择；SESSION 仅用于纯住宅池。</p>
          </div>
          <dl class="spec-table">
            ${pageData.specs.map(([term, detail]) => `<div class="spec-row"><dt>${term}</dt><dd>${detail}</dd></div>`).join("")}
          </dl>
        </div>
      </section>

      <section class="section section-dark" id="developers">
        <div class="container developer-layout">
          <div class="developer-copy">
            <div class="section-kicker">06 / Developer access</div>
            <h2>固定隧道网关接入示例</h2>
            <p>兼容 requests、Scrapy、cURL 与标准 HTTP 客户端；实际网关和鉴权信息由控制台提供。</p>
            <div class="developer-points">
              <span class="developer-point">${icon("check")}兼容 requests、Scrapy 与常用 HTTP 客户端</span>
              <span class="developer-point">${icon("check")}代码无需下载或维护本地 IP 列表</span>
              <span class="developer-point">${icon("check")}建议显式配置超时、重试与并发上限</span>
            </div>
            ${developerGuideCta()}
          </div>
          <div class="code-window">
            <div class="code-head">
              <div class="code-tabs" role="tablist" aria-label="代码语言">
                <button class="code-tab" type="button" role="tab" aria-selected="true" data-code="python">Python</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="curl">cURL</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="scrapy">Scrapy</button>
              </div>
              <button class="icon-btn" id="copyCode" type="button" aria-label="复制代码" title="复制代码">${icon("copy")}</button>
            </div>
            <pre><code id="codeSample"></code></pre>
          </div>
        </div>
      </section>

      <section class="section section-soft" id="faq">
        <div class="container faq-layout">
          <div class="faq-intro">
            <div class="section-kicker">07 / FAQ</div>
            <h2>隧道代理常见问题</h2>
            <p>双池、默认全球随机、粗粒度地区、SESSION、流量与并发线程。</p>
          </div>
          <div class="faq-list">
            ${pageData.faqs.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${question}</summary><p>${answer}</p></details>`).join("")}
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div class="container cta-inner">
          <div><h2>${pageData.cta[0]}</h2><p>${pageData.cta[1]}</p></div>
          <div class="cta-actions">
            <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}查看套餐价格</a>
            <a class="btn btn-on-dark" href="contact.html#solutions">${icon("messages-square")}联系产品顾问</a>
          </div>
        </div>
      </section>
    </main>`;
}

function residentialMainMarkup() {
  const o = pageData.overview;
  const w = pageData.workflow;
  return `
    <main>
      ${heroMarkup()}

      <section class="section" id="overview">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">${o.kicker}</div><h2><span class="section-title-line">8000万+ 住宅 IP，</span><span class="section-title-line">国家与地区定向</span></h2></div>
            <p>${o.text}</p>
          </div>
          <div class="capability-grid">
            ${pageData.capabilities.map(([itemIcon, title, text]) => `
              <article class="capability-item">
                <div class="capability-icon">${icon(itemIcon)}</div>
                <h3>${title}</h3><p>${text}</p>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section section-soft" id="billing">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">02 / Traffic billing</div><h2><span class="section-title-line">只按流量购买，</span><span class="section-title-line">没有线程套餐</span></h2></div>
            <p>国家、地区和 SESSION 只控制路由；产品始终按实际传输流量计费。</p>
          </div>
          <div class="residential-billing-grid">
            <article class="residential-billing-primary">
              <span class="residential-billing-label">ONLY PURCHASE MODEL</span>
              <h3>按实际传输流量购买</h3>
              <p>不提供线程或端口套餐。任务可自由组织并发，但全部代理传输都计入流量。</p>
              <div class="residential-billing-unit"><strong>GB</strong><span>唯一容量口径</span></div>
              <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}查看流量套餐价格</a>
            </article>
            <dl class="residential-billing-facts">
              <div><dt>购买方式</dt><dd>仅按实际传输流量</dd></div>
              <div><dt>地区能力</dt><dd>指定国家或地区</dd></div>
              <div><dt>会话能力</dt><dd>支持指定 SESSION</dd></div>
              <div><dt>资源范围</dt><dd>8000万+ IP / 190+ 地区</dd></div>
            </dl>
          </div>
          <div class="traffic-guidance">
            <div class="traffic-guidance-icon">${icon("gauge")}</div>
            <div>
              <span class="section-kicker">Traffic planning</span>
              <h3>流量按代理实际传输量扣减</h3>
              <p>用代表性 URL 测量平均传输量，再结合请求数与重试率估算总流量；可按任务需要减少图片、视频等大体积资源加载。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="workloads">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">03 / Workloads</div><h2><span class="section-title-line">适合需要地区身份，</span><span class="section-title-line">以及连续住宅会话的任务</span></h2></div>
            <p>核心价值是将国家、地区与 SESSION 作为可控路由参数。</p>
          </div>
          <div class="workload-grid">
            ${pageData.workloads.map(([index, title, text, meta]) => `<article class="workload-card"><span class="workload-index">${index}</span><h3>${title}</h3><p>${text}</p><div class="workload-meta">${meta}</div></article>`).join("")}
          </div>
          <div class="alternative-grid">
            <a href="scraping-rotating-proxy.html"><span>${icon("shuffle")}默认全球随机</span><strong>选择隧道代理</strong><small>双池，提取时可选粗粒度地区，可按流量或并发线程使用</small></a>
            <a href="unlimited-residential-proxy.html"><span>${icon("infinity")}需要住宅不限流量</span><strong>选择不限量动态住宅</strong><small>按端口周期使用，地区在套餐级设置</small></a>
            <a href="static-residential-proxy.html"><span>${icon("pin")}需要长期固定住宅 IP</span><strong>选择长效静态住宅</strong><small>使用周期内保持固定住宅 ISP 出口</small></a>
          </div>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container workflow-layout">
          <div class="workflow-copy">
            <div class="section-kicker">04 / How it works</div>
            <h2>${w.title}</h2>
            <p>${w.text}</p>
            <div class="workflow-list">
              ${w.steps.map(([index, title, text]) => `<div class="workflow-step"><span>${index}</span><div><strong>${title}</strong><p>${text}</p></div></div>`).join("")}
            </div>
          </div>
          <div class="architecture">
            <div class="architecture-head"><span>Residential request routing</span><span>123Proxy network</span></div>
            <div class="architecture-flow">
              ${w.flow.map(([itemIcon, title, meta]) => `<div class="arch-node">${icon(itemIcon)}<div><strong>${title}</strong><small>${meta}</small></div></div>`).join("")}
            </div>
            <div class="architecture-foot">
              ${w.stats.map(([label, value]) => `<div class="arch-stat"><span>${label}</span><strong>${value}</strong></div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="specs">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">05 / Specifications</div><h2>隧道住宅代理技术规格</h2></div>
            <p>具体国家、地区与实时住宅资源以控制台为准。</p>
          </div>
          <dl class="spec-table">
            ${pageData.specs.map(([term, detail]) => `<div class="spec-row"><dt>${term}</dt><dd>${detail}</dd></div>`).join("")}
          </dl>
        </div>
      </section>

      <section class="section section-dark" id="developers">
        <div class="container developer-layout">
          <div class="developer-copy">
            <div class="section-kicker">06 / Developer access</div>
            <h2>把地区与 SESSION 写进代理鉴权</h2>
            <p>继续使用标准 HTTP 代理。地区与 SESSION 为鉴权参数，实际格式、网关和端口以控制台为准。</p>
            <div class="developer-points">
              <span class="developer-point">${icon("check")}兼容 requests、Scrapy 与常用 HTTP 客户端</span>
              <span class="developer-point">${icon("check")}鉴权参数指定国家或地区与 SESSION</span>
              <span class="developer-point">${icon("check")}建议记录响应大小、重试率与套餐流量</span>
            </div>
            ${developerGuideCta()}
          </div>
          <div class="code-window">
            <div class="code-head">
              <div class="code-tabs" role="tablist" aria-label="代码语言">
                <button class="code-tab" type="button" role="tab" aria-selected="true" data-code="python">Python</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="curl">cURL</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="scrapy">Scrapy</button>
              </div>
              <button class="icon-btn" id="copyCode" type="button" aria-label="复制代码" title="复制代码">${icon("copy")}</button>
            </div>
            <pre><code id="codeSample"></code></pre>
          </div>
        </div>
      </section>

      <section class="section section-soft" id="faq">
        <div class="container faq-layout">
          <div class="faq-intro">
            <div class="section-kicker">07 / FAQ</div>
            <h2>隧道住宅代理常见问题</h2>
            <p>地区定向、SESSION、流量计费与住宅出口。</p>
          </div>
          <div class="faq-list">
            ${pageData.faqs.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${question}</summary><p>${answer}</p></details>`).join("")}
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div class="container cta-inner">
          <div><h2>${pageData.cta[0]}</h2><p>${pageData.cta[1]}</p></div>
          <div class="cta-actions">
            <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}查看套餐价格</a>
            <a class="btn btn-on-dark" href="contact.html#solutions">${icon("messages-square")}联系产品顾问</a>
          </div>
        </div>
      </section>
    </main>`;
}

function focusedProductMainMarkup() {
  const configs = {
    unlimitedResidential: {
      overviewTitle: ["每端口不限流量，", "也不限并发"],
      boundary: {
        title: "端口能力与套餐设置",
        text: "每端口不限流量与并发；购买时不选择地区，提取代理时设置套餐地区和固定轮转周期。",
        columns: [
          ["PORT LEVEL", "不限流量 / 不限并发", "每端口不限 GB 与线程，实际吞吐由带宽、客户端和目标响应决定。", true],
          ["EXTRACTION LEVEL", "地区 / 固定轮转周期", "提取代理时为套餐设置地区与 3–30 分钟固定轮转周期，不能逐端口设置。", false]
        ]
      },
      purchase: {
        kicker: "02 / Plans & capacity",
        title: ["按端口数量与", "5–100Mbps 带宽购买"],
        text: "套餐按端口和周期计费，不累计 GB，也不限制每端口并发线程。",
        label: "PORT-BASED PLAN",
        heading: "按端口与周期购买",
        body: "套餐不累计 GB，也不按线程收费；购买时不选择地区，提取代理时统一配置。",
        unit: "PORT",
        unitText: "每端口不限流量与并发",
        button: "查看端口套餐价格",
        facts: [["购买口径", "端口数量 / 使用周期"], ["带宽规格", "5–100Mbps"], ["出口轮转", "固定 3–30 分钟"], ["地区控制", "提取时按套餐设置"]],
        guidanceIcon: "gauge",
        guidanceTitle: "端口吞吐由带宽和目标响应决定",
        guidanceText: "不限流量和并发不取消 5–100Mbps 带宽规格，页面完成时间仍受目标响应与客户端影响。"
      },
      workloads: {
        title: ["浏览器自动化与", "长期住宅采集任务"],
        text: "适合持续在线、响应体较大或需要每端口不限并发的住宅任务。",
        alternatives: [
          ["residential-proxy.html", "map-pinned", "需要每次指定国家或地区", "选择隧道住宅代理", "按流量购买，可在鉴权中指定地区与 SESSION"],
          ["scraping-rotating-proxy.html", "code-2", "代码直接发起大量短请求", "选择隧道代理", "双池默认全球随机，提取时可选粗粒度地区，可按流量或并发线程使用"],
          ["static-residential-proxy.html", "pin", "需要长期保持同一住宅 IP", "选择长效静态住宅", "固定独享住宅 ISP 出口，不按周期轮转"]
        ]
      },
      architectureLabel: "Residential port architecture",
      specsTitle: "不限量动态住宅技术规格",
      specsText: "地区、带宽档位、端口数与实时资源以价格页和控制台为准。",
      developer: {
        title: "按工作节点分配代理端口",
        text: "通过 HTTP(S) 或 SOCKS 接入，端口可分配给不同项目或浏览器节点。",
        points: ["端口可承载 requests、Scrapy 与浏览器自动化", "无需在代码中按请求计算并发线程额度", "地区与轮转周期在提取代理时按套餐统一设置"]
      },
      faqTitle: ["不限量动态住宅", "常见问题"],
      faqText: "端口、带宽、地区、轮转周期与并发。",
      salesSubject: "不限量动态住宅代理套餐咨询"
    },
    staticDatacenter: {
      overviewTitle: ["独享固定 IP，", "不限流量稳定连接"],
      boundary: {
        title: "固定出口与动态轮换的区别",
        text: "独享数据中心 IP 在使用周期内不轮换，适合目标系统来源白名单、环境隔离和长期连接。",
        columns: [
          ["BEST FIT", "需要固定来源 IP", "适合企业 API、数据库网关、目标系统白名单和长期自动化任务。", true],
          ["CONSIDER ANOTHER", "需要住宅属性或频繁轮转", "需要住宅属性选静态住宅；需要动态轮换选隧道代理。", false]
        ]
      },
      purchase: {
        kicker: "02 / Purchase model",
        title: ["按 IP 数量与", "使用周期购买"],
        text: "每个端点对应一个独享固定数据中心 IP，并提供 5–10Mbps 带宽。",
        label: "DEDICATED ENDPOINT",
        heading: "按独享 IP 与周期购买",
        body: "每个端点对应固定数据中心 IP，方案内不限流量；购买时不选择地区，提取代理时指定。",
        unit: "IP",
        unitText: "独享固定端点",
        button: "查看静态代理价格",
        facts: [["购买口径", "IP 数量 / 使用周期"], ["带宽规格", "5–10Mbps"], ["流量方式", "方案内不限流量"], ["出口策略", "周期内固定不轮换"]],
        guidanceIcon: "calendar-clock",
        guidanceTitle: "IP 在有效使用周期内保持固定",
        guidanceText: "及时续费可避免生产端点到期中断，具体库存和续费状态以控制台为准。"
      },
      workloads: {
        title: ["目标系统白名单、长期会话", "与系统固定出口"],
        text: "为需要长期复用同一来源 IP 的企业 API、自动化任务和系统连接提供端点。",
        alternatives: [
          ["static-residential-proxy.html", "house", "需要固定住宅网络身份", "选择长效静态住宅", "同时保留住宅 ISP 属性与固定出口"],
          ["scraping-rotating-proxy.html", "shuffle", "需要大规模动态出口", "选择隧道代理", "云端自动轮换，适合常规网页采集"],
          ["unlimited-residential-proxy.html", "infinity", "需要住宅出口且长期不限量", "选择不限量动态住宅", "按端口使用，住宅 IP 周期轮转"]
        ]
      },
      architectureLabel: "Dedicated endpoint architecture",
      specsTitle: "长效静态代理技术规格",
      specsText: "支持 69 个国家和地区；购买套餐时无需选择地区，提取代理时指定。",
      developer: {
        title: "固定代理端点接入示例",
        text: "使用分配的代理账密接入，并将固定出口登记到目标服务白名单，无需编写 IP 轮换逻辑。",
        points: ["适合服务端 HTTP 客户端、浏览器与企业系统", "固定出口可用于合作方来源 IP 白名单", "地区在提取代理时从支持清单中选择"]
      },
      faqTitle: ["长效静态代理", "常见问题"],
      faqText: "固定周期、带宽、地区库存、账密认证与目标系统白名单。",
      salesSubject: "长效静态代理套餐咨询"
    },
    staticResidential: {
      overviewTitle: ["固定住宅 ISP 身份，", "独享且不限流量"],
      boundary: {
        title: "固定住宅出口与动态住宅池的区别",
        text: "每个端点独享一个住宅 ISP IP，并在使用周期内保持不变。",
        columns: [
          ["BEST FIT", "住宅身份 + 长会话", "适合同时要求住宅网络身份、地区一致性和长期固定 IP 的任务。", true],
          ["LOWER-COST FIT", "只需要固定、稳定和来源白名单", "若不要求住宅 ISP 属性，静态数据中心代理通常更直接。", false]
        ]
      },
      purchase: {
        kicker: "02 / Resource selection",
        title: ["按住宅 IP 与", "使用周期购买"],
        text: "每个端点对应一个独享固定住宅 ISP IP；购买时不选择地区，提取代理时指定。",
        label: "STATIC ISP ENDPOINT",
        heading: "按住宅 IP 与周期购买",
        body: "每个端点对应独享住宅 ISP IP，周期内固定且方案内不限流量。",
        unit: "ISP IP",
        unitText: "独享固定住宅端点",
        button: "查看静态住宅价格",
        facts: [["购买口径", "住宅 IP / 使用周期"], ["覆盖范围", "69 个国家和地区"], ["流量方式", "方案内不限流量"], ["免费测试", "不提供"]],
        guidanceIcon: "warehouse",
        guidanceTitle: "提取代理时选择地区",
        guidanceText: "购买套餐时无需选择地区；提取代理时从 69 个支持地区中选择，具体 ISP 资源以实时可用情况为准。"
      },
      workloads: {
        title: ["长期地区一致性与", "固定住宅会话"],
        text: "适合同时需要住宅网络属性、明确地区和长期固定 IP 的任务。",
        alternatives: [
          ["static-datacenter-proxy.html", "server", "只需要固定 IP 与稳定性能", "选择长效静态代理", "独享机房 IP，通常更强调性能与成本"],
          ["residential-proxy.html", "map-pinned", "需要按任务指定地区与 SESSION", "选择隧道住宅代理", "8000万+ 住宅池，按流量动态匹配出口"],
          ["unlimited-residential-proxy.html", "refresh-cw", "接受周期轮转并需要不限量", "选择不限量动态住宅", "按端口购买，3–30 分钟固定轮转"]
        ]
      },
      architectureLabel: "Static ISP endpoint architecture",
      specsTitle: "长效静态住宅技术规格",
      specsText: "支持 69 个国家和地区；购买套餐时无需选择地区，提取代理时指定。",
      developer: {
        title: "固定住宅端点接入示例",
        text: "通过标准代理协议接入并绑定项目或节点，IP 周期内固定，无需设置 SESSION。",
        points: ["适合浏览器自动化、长期地区任务与固定会话", "每个住宅 IP 独享分配，便于环境隔离", "地区在提取代理时从支持清单中选择"]
      },
      faqTitle: ["长效静态住宅", "常见问题"],
      faqText: "住宅库存、固定周期、带宽与 ISP 选择。",
      salesSubject: "长效静态住宅代理套餐咨询"
    }
  };

  const cfg = configs[currentKey];
  const o = pageData.overview;
  const w = pageData.workflow;
  const purchase = cfg.purchase;

  return `
    <main>
      ${heroMarkup()}

      <section class="section" id="overview">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">${o.kicker}</div><h2>${cfg.overviewTitle.map((line) => `<span class="section-title-line">${line}</span>`).join("")}</h2></div>
            <p>${o.text}</p>
          </div>
          <div class="capability-grid">
            ${pageData.capabilities.map(([itemIcon, title, text]) => `
              <article class="capability-item">
                <div class="capability-icon">${icon(itemIcon)}</div>
                <h3>${title}</h3><p>${text}</p>
              </article>`).join("")}
          </div>
          <div class="product-boundary">
            <div class="boundary-intro">
              <span class="section-kicker">Product fit</span>
              <h3>${cfg.boundary.title}</h3>
              <p>${cfg.boundary.text}</p>
            </div>
            ${cfg.boundary.columns.map(([label, title, text, fit]) => `
              <div class="boundary-column${fit ? " is-fit" : ""}">
                <span>${label}</span><strong>${title}</strong><p>${text}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section section-soft" id="billing">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">${purchase.kicker}</div><h2>${purchase.title.map((line) => `<span class="section-title-line">${line}</span>`).join("")}</h2></div>
            <p>${purchase.text}</p>
          </div>
          <div class="purchase-model-grid is-${currentKey}">
            <article class="purchase-model-primary">
              <span class="purchase-model-label">${purchase.label}</span>
              <h3>${purchase.heading}</h3>
              <p>${purchase.body}</p>
              <div class="purchase-model-unit"><strong>${purchase.unit}</strong><span>${purchase.unitText}</span></div>
              <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}${purchase.button}</a>
            </article>
            <dl class="purchase-model-facts">
              ${purchase.facts.map(([term, detail]) => `<div><dt>${term}</dt><dd>${detail}</dd></div>`).join("")}
            </dl>
          </div>
          <div class="purchase-guidance">
            <div class="purchase-guidance-icon">${icon(purchase.guidanceIcon)}</div>
            <div><span class="section-kicker">Important</span><h3>${purchase.guidanceTitle}</h3><p>${purchase.guidanceText}</p></div>
          </div>
        </div>
      </section>

      <section class="section" id="workloads">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">03 / Workloads</div><h2>${cfg.workloads.title.map((line) => `<span class="section-title-line">${line}</span>`).join("")}</h2></div>
            <p>${cfg.workloads.text}</p>
          </div>
          <div class="workload-grid">
            ${pageData.workloads.map(([index, title, text, meta]) => `<article class="workload-card"><span class="workload-index">${index}</span><h3>${title}</h3><p>${text}</p><div class="workload-meta">${meta}</div></article>`).join("")}
          </div>
          <div class="alternative-grid">
            ${cfg.workloads.alternatives.map(([href, itemIcon, label, title, text]) => `<a href="${href}"><span>${icon(itemIcon)}${label}</span><strong>${title}</strong><small>${text}</small></a>`).join("")}
          </div>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container workflow-layout">
          <div class="workflow-copy">
            <div class="section-kicker">04 / How it works</div>
            <h2>${w.title}</h2>
            <p>${w.text}</p>
            <div class="workflow-list">
              ${w.steps.map(([index, title, text]) => `<div class="workflow-step"><span>${index}</span><div><strong>${title}</strong><p>${text}</p></div></div>`).join("")}
            </div>
          </div>
          <div class="architecture">
            <div class="architecture-head"><span>${cfg.architectureLabel}</span><span>123Proxy network</span></div>
            <div class="architecture-flow">
              ${w.flow.map(([itemIcon, title, meta]) => `<div class="arch-node">${icon(itemIcon)}<div><strong>${title}</strong><small>${meta}</small></div></div>`).join("")}
            </div>
            <div class="architecture-foot">
              ${w.stats.map(([label, value]) => `<div class="arch-stat"><span>${label}</span><strong>${value}</strong></div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="specs">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">05 / Specifications</div><h2>${cfg.specsTitle}</h2></div>
            <p>${cfg.specsText}</p>
          </div>
          <dl class="spec-table">
            ${pageData.specs.map(([term, detail]) => `<div class="spec-row"><dt>${term}</dt><dd>${detail}</dd></div>`).join("")}
          </dl>
          ${pageData.regionCodes ? `
            <div class="region-support">
              <div class="region-support-head">
                <div><span class="section-kicker">Extraction locations</span><h3>支持国家与地区</h3></div>
                <p>购买套餐时无需选择地区；提取代理时可选择以下国家和地区。</p>
              </div>
              <div class="region-code-grid">${pageData.regionCodes.map((code) => `<span>${locationNames[code][0]}</span>`).join("")}</div>
            </div>` : ""}
        </div>
      </section>

      <section class="section section-dark" id="developers">
        <div class="container developer-layout">
          <div class="developer-copy">
            <div class="section-kicker">06 / Developer access</div>
            <h2>${cfg.developer.title}</h2>
            <p>${cfg.developer.text}</p>
            <div class="developer-points">
              ${cfg.developer.points.map((point) => `<span class="developer-point">${icon("check")}${point}</span>`).join("")}
            </div>
            ${developerGuideCta()}
          </div>
          <div class="code-window">
            <div class="code-head">
              <div class="code-tabs" role="tablist" aria-label="代码语言">
                <button class="code-tab" type="button" role="tab" aria-selected="true" data-code="python">Python</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="curl">cURL</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="scrapy">Scrapy</button>
              </div>
              <button class="icon-btn" id="copyCode" type="button" aria-label="复制代码" title="复制代码">${icon("copy")}</button>
            </div>
            <pre><code id="codeSample"></code></pre>
          </div>
        </div>
      </section>

      <section class="section section-soft" id="faq">
        <div class="container faq-layout">
          <div class="faq-intro">
            <div class="section-kicker">07 / FAQ</div>
            <h2>${cfg.faqTitle.map((line) => `<span class="section-title-line">${line}</span>`).join("")}</h2>
            <p>${cfg.faqText}</p>
          </div>
          <div class="faq-list">
            ${pageData.faqs.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${question}</summary><p>${answer}</p></details>`).join("")}
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div class="container cta-inner">
          <div><h2>${pageData.cta[0]}</h2><p>${pageData.cta[1]}</p></div>
          <div class="cta-actions">
            <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}查看套餐价格</a>
            <a class="btn btn-on-dark" href="contact.html#solutions">${icon("messages-square")}联系产品顾问</a>
          </div>
        </div>
      </section>
    </main>`;
}

function mainMarkup() {
  if (currentKey === "tunnel") return tunnelMainMarkup();
  if (currentKey === "residential") return residentialMainMarkup();
  if (currentKey === "unlimitedResidential" || currentKey === "staticDatacenter" || currentKey === "staticResidential") return focusedProductMainMarkup();
  const o = pageData.overview;
  const w = pageData.workflow;
  const p = pageData.plans;
  return `
    <main>
      ${heroMarkup()}
      <section class="section" id="overview">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">${o.kicker}</div><h2>${o.title}</h2></div>
            <p>${o.text}</p>
          </div>
          <div class="capability-grid">
            ${pageData.capabilities.map(([itemIcon, title, text]) => `
              <article class="capability-item">
                <div class="capability-icon">${icon(itemIcon)}</div>
                <h3>${title}</h3><p>${text}</p>
              </article>`).join("")}
          </div>
        </div>
      </section>
      <section class="section section-soft" id="workloads">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">02 / Workloads</div><h2>适合它的，不只是“需要代理”的任务</h2></div>
            <p>产品选择应由目标网络属性、会话长度、数据规模与成本模型共同决定。以下场景用于帮助工程团队建立第一轮方案判断。</p>
          </div>
          <div class="workload-grid">
            ${pageData.workloads.map(([index, title, text, meta]) => `<article class="workload-card"><span class="workload-index">${index}</span><h3>${title}</h3><p>${text}</p><div class="workload-meta">${meta}</div></article>`).join("")}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container workflow-layout">
          <div class="workflow-copy">
            <div class="section-kicker">03 / How it works</div>
            <h2>${w.title}</h2>
            <p>${w.text}</p>
            <div class="workflow-list">
              ${w.steps.map(([index, title, text]) => `<div class="workflow-step"><span>${index}</span><div><strong>${title}</strong><p>${text}</p></div></div>`).join("")}
            </div>
          </div>
          <div class="architecture">
            <div class="architecture-head"><span>Proxy request architecture</span><span>123Proxy network</span></div>
            <div class="architecture-flow">
              ${w.flow.map(([itemIcon, title, meta]) => `<div class="arch-node">${icon(itemIcon)}<div><strong>${title}</strong><small>${meta}</small></div></div>`).join("")}
            </div>
            <div class="architecture-foot">
              ${w.stats.map(([label, value]) => `<div class="arch-stat"><span>${label}</span><strong>${value}</strong></div>`).join("")}
            </div>
          </div>
        </div>
      </section>
      <section class="section section-soft" id="specs">
        <div class="container">
          <div class="section-head">
            <div><div class="section-kicker">04 / Specifications</div><h2>把产品边界写清楚，再进入测试</h2></div>
            <p>以下参数用于方案预选。地区库存、带宽、会话与账户容量等动态资源，以控制台和最终方案确认为准。</p>
          </div>
          <dl class="spec-table">
            ${pageData.specs.map(([term, detail]) => `<div class="spec-row"><dt>${term}</dt><dd>${detail}</dd></div>`).join("")}
          </dl>
        </div>
      </section>
      <section class="section section-dark" id="developers">
        <div class="container developer-layout">
          <div class="developer-copy">
            <div class="section-kicker">05 / Developer access</div>
            <h2>只改代理配置，不改采集逻辑</h2>
            <p>使用标准 HTTP 代理配置接入。示例中的地址与账号为演示值，实际网关、端口和鉴权信息以控制台分配为准。</p>
            <div class="developer-points">
              <span class="developer-point">${icon("check")}兼容常用 HTTP 客户端与爬虫框架</span>
              <span class="developer-point">${icon("check")}支持超时、重试与任务队列策略</span>
              <span class="developer-point">${icon("check")}鉴权参数按所选产品能力配置</span>
            </div>
            ${developerGuideCta()}
          </div>
          <div class="code-window">
            <div class="code-head">
              <div class="code-tabs" role="tablist" aria-label="代码语言">
                <button class="code-tab" type="button" role="tab" aria-selected="true" data-code="python">Python</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="curl">cURL</button>
                <button class="code-tab" type="button" role="tab" aria-selected="false" data-code="scrapy">Scrapy</button>
              </div>
              <button class="icon-btn" id="copyCode" type="button" aria-label="复制代码" title="复制代码">${icon("copy")}</button>
            </div>
            <pre><code id="codeSample"></code></pre>
          </div>
        </div>
      </section>
      <section class="section" id="plans">
        <div class="container plan-layout">
          <div class="plan-intro">
            <div class="section-kicker">06 / Plans</div>
            <h2>${p.title}</h2>
            <p>${p.text}</p>
            <div class="plan-note">${p.note}</div>
          </div>
          <div class="plan-grid">
            ${p.items.map(([label, title, text, meta, items, cta], index) => `
              <article class="plan-item">
                <div class="plan-label">${label}</div>
                <h3>${title}</h3><p>${text}</p>
                <div class="plan-meta"><span>容量口径</span><strong>${meta}</strong></div>
                <ul class="plan-list">${items.map((item) => `<li>${icon("check")}<span>${item}</span></li>`).join("")}</ul>
                <a class="btn${index === 0 ? " btn-primary" : ""}" href="${pageData.pricingUrl}">${icon("tag")}查看套餐价格</a>
              </article>`).join("")}
          </div>
        </div>
      </section>
      <section class="section section-soft" id="faq">
        <div class="container faq-layout">
          <div class="faq-intro">
            <div class="section-kicker">07 / FAQ</div>
            <h2>测试前需要确认的问题</h2>
            <p>代理效果与目标站点、地区、响应体、会话和并发模型有关。先在真实任务上做小规模验证，再进入生产容量规划。</p>
          </div>
          <div class="faq-list">
            ${pageData.faqs.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${question}</summary><p>${answer}</p></details>`).join("")}
          </div>
        </div>
      </section>
      <section class="cta-band">
        <div class="container cta-inner">
          <div><h2>${pageData.cta[0]}</h2><p>${pageData.cta[1]}</p></div>
          <div class="cta-actions">
            <a class="btn btn-primary" href="${pageData.pricingUrl}">${icon("tag")}查看套餐价格</a>
            <a class="btn btn-on-dark" href="contact.html#solutions">${icon("messages-square")}联系产品顾问</a>
          </div>
        </div>
      </section>
    </main>`;
}

function footerMarkup() {
  return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
            <a class="brand" href="index.html">${brandMarkup()}</a>
            <p>面向爬虫工程师和 AI 数据团队的全球代理与数据采集基础设施。</p>
          </div>
          <div class="footer-col">
            <h3>代理产品</h3>
            <a href="scraping-rotating-proxy.html">隧道代理</a>
            <a href="residential-proxy.html">隧道住宅代理</a>
            <a href="unlimited-residential-proxy.html">不限量动态住宅</a>
            <a href="static-datacenter-proxy.html">长效静态代理</a>
            <a href="static-residential-proxy.html">长效静态住宅</a>
          </div>
          <div class="footer-col">
            <h3>AI 数据方案</h3>
            <a href="high-bandwidth-proxy.html">高带宽代理 IP</a>
            <a href="ai-video-proxy.html">视频数据采集</a>
            <a href="ai-image-proxy.html">图片数据采集</a>
            <a href="ai-github-proxy.html">公开代码数据</a>
            <a href="ai-text-proxy.html">文本与文档</a>
            <a href="ai-youtube-api.html">YouTube 采集 API</a>
          </div>
          <div class="footer-col">
            <h3>开发者</h3>
            <a href="/developers/getting-started/">快速入门</a>
            <a href="/developers/#products">产品接入</a>
            <a href="/developers/#guides">工程实践指南</a>
            <a href="/developers/examples/">9 个完整代码案例</a>
          </div>
          <div class="footer-col">
            <h3>公司与支持</h3>
            <a href="enterprise.html">企业服务</a>
            <a href="custom-proxy-pool.html">定制代理池</a>
            <a href="data-scraping-service.html">数据采集服务</a>
            <a href="contact.html">联系我们</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 123Proxy. All rights reserved.</span>
          <span>广州市天河区中山大道中38号916 · 粤ICP备2023058453号-1</span>
        </div>
      </div>
    </footer>`;
}

function renderPage() {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="page">${headerMarkup()}${mainMarkup()}${footerMarkup()}</div>`;
}

function buildCodeSamples() {
  const proxyUrl = `http://${pageData.username}:YOUR_PASSWORD@${pageData.endpoint}`;
  return {
    python: `<span class="syntax-key">import</span> requests

proxy = <span class="syntax-string">"${proxyUrl}"</span>
proxies = {<span class="syntax-string">"http"</span>: proxy, <span class="syntax-string">"https"</span>: proxy}

response = requests.get(
    <span class="syntax-string">"https://target.example/data"</span>,
    proxies=proxies,
    timeout=20,
)

print(response.status_code)`,
    curl: `<span class="syntax-comment"># 通过 ${pageData.name}访问目标页面</span>
curl --proxy http://${pageData.endpoint} \\
  --proxy-user <span class="syntax-string">"${pageData.username}:YOUR_PASSWORD"</span> \\
  --connect-timeout 20 \\
  https://target.example/data`,
    scrapy: `<span class="syntax-key">class</span> ProxyMiddleware:
    <span class="syntax-key">def</span> process_request(self, request, spider):
        request.meta[<span class="syntax-string">"proxy"</span>] = (
            <span class="syntax-string">"${proxyUrl}"</span>
        )

DOWNLOADER_MIDDLEWARES = {
    <span class="syntax-string">"crawler.middlewares.ProxyMiddleware"</span>: 350,
}`
  };
}

function initInteractions() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { width: 16, height: 16, "stroke-width": 2 } });
  }

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "打开导航" : "关闭导航");
    mobileMenu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
    menuToggle.innerHTML = isOpen ? icon("menu") : icon("x");
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16, "stroke-width": 2 } });
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "打开导航");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.innerHTML = icon("menu");
      if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16, "stroke-width": 2 } });
    });
  });

  const navItems = document.querySelectorAll(".nav-item");
  const megaMenuCloseTimers = new WeakMap();
  const hasPreciseHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  navItems.forEach((item) => {
    const trigger = item.querySelector(".nav-trigger");
    if (hasPreciseHover) {
      item.addEventListener("pointerenter", () => {
        window.clearTimeout(megaMenuCloseTimers.get(item));
        item.classList.add("is-hover-open");
      });
      item.addEventListener("pointerleave", () => {
        window.clearTimeout(megaMenuCloseTimers.get(item));
        const timer = window.setTimeout(() => item.classList.remove("is-hover-open"), 240);
        megaMenuCloseTimers.set(item, timer);
      });
    }
    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      navItems.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".nav-trigger").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-item")) {
      navItems.forEach((item) => {
        item.classList.remove("is-open", "is-hover-open");
        item.querySelector(".nav-trigger").setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navItems.forEach((item) => {
        item.classList.remove("is-open", "is-hover-open");
        item.querySelector(".nav-trigger").setAttribute("aria-expanded", "false");
      });
    }
  });

  const codeSamples = buildCodeSamples();
  const codeSample = document.getElementById("codeSample");
  const codeTabs = document.querySelectorAll(".code-tab");
  codeSample.innerHTML = codeSamples.python;

  codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      codeTabs.forEach((item) => item.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      codeSample.innerHTML = codeSamples[tab.dataset.code];
    });
  });

  const copyCode = document.getElementById("copyCode");
  copyCode.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(codeSample.textContent);
      copyCode.setAttribute("aria-label", "已复制");
      copyCode.innerHTML = icon("check");
    } catch (error) {
      copyCode.setAttribute("aria-label", "复制失败");
    }
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16, "stroke-width": 2 } });
    window.setTimeout(() => {
      copyCode.setAttribute("aria-label", "复制代码");
      copyCode.innerHTML = icon("copy");
      if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16, "stroke-width": 2 } });
    }, 1600);
  });
}

if (!globalThis.__STATIC_RENDER__) {
  const staticApp = document.getElementById("app");
  if (!staticApp.querySelector(":scope > .page")) {
    renderPage();
  }
  initInteractions();
}
