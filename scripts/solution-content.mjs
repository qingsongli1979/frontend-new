export const solutionOrder = ["overview", "video", "image", "code", "text", "youtubeApi"];

const highBandwidthUrl = "high-bandwidth-proxy.html";

const commonHighBandwidthFactsZh = [
  ["核心产品", "高带宽代理 IP", "不限流量、项目级带宽与定制代理池"],
  ["项目带宽", "10Gbps+ 聚合能力", "支持多节点并行下载"],
  ["接入方式", "HTTP(S) / SOCKS", "兼容现有采集程序与下载工具"]
];

const commonHighBandwidthPointsZh = [
  "不限流量，不按累计 GB 计费",
  "10Gbps+ 单项目带宽能力",
  "按目标站点定制代理池",
  "支持 HTTP(S) 与 SOCKS 接入"
];

const commonEvaluationNoteZh = "项目带宽以聚合容量提供；目标响应、对象大小、并发、工作节点和存储会影响实际吞吐。";

export const solutionsZh = {
  overview: {
    key: "overview",
    file: "ai-data.html",
    zhFile: "ai-data.html",
    name: "AI 数据方案",
    title: "AI 数据采集方案 - 高带宽代理基础设施 | 123Proxy",
    description: "123Proxy AI 数据方案面向视频、图片、代码、文本与文档采集，核心推荐不限流量、10Gbps+ 单项目带宽和定制代理池的高带宽代理 IP。",
    eyebrow: "AI DATA SCRAPING INFRASTRUCTURE",
    titleLines: ["AI 数据采集的", "不限流量高带宽代理"],
    lead: "为视频、图片、代码、文本与文档采集提供不限流量、10Gbps+ 单项目带宽和定制代理池。",
    primaryLabel: "获取高带宽方案",
    secondaryLabel: "查看采集场景",
    secondaryUrl: "#workloads",
    points: ["requests / Scrapy / Playwright", "yt-dlp / img2dataset", "不限流量", "10Gbps+ 单项目带宽"],
    visual: {
      label: "AI 数据任务管道",
      status: "带宽就绪",
      sources: [
        ["video", "视频与音频", "MULTIMODAL"],
        ["images", "图片数据集", "IMAGE CORPUS"],
        ["file-code-2", "公开代码", "CODE LLM"],
        ["files", "文本与文档", "WEB CORPUS"]
      ],
      route: [["database", "公开数据源", "SOURCE"], ["network", "123Proxy", "PROXY"], ["cpu", "采集集群", "WORKERS"]],
      metrics: [["项目带宽", "10Gbps+"], ["计费方式", "不限流量"], ["代理资源", "按目标定制"]]
    },
    strip: [["10Gbps+", "单项目带宽能力"], ["不限流量", "长期任务成本可控"], ["定制代理池", "按目标站点配置"], ["7x24", "企业技术支持"]],
    overviewTitle: ["视频、图片、代码与文本，", "对应不同下载负载"],
    overviewText: "高带宽代理承担大规模下载；内容依赖国家或地区时，补充隧道住宅代理。",
    capabilities: [
      ["video", "视频与多模态", "大文件、分片与字幕需要持续吞吐和可靠重试。"],
      ["images", "图片数据集", "海量小对象要求高并发、去重和失败补采。"],
      ["file-code-2", "公开代码数据", "仓库对象、归档与历史版本同时消耗连接和带宽。"],
      ["files", "文本与文档", "网页、PDF 与公开文档需要兼顾吞吐、地区和内容完整性。"]
    ],
    workloadsTitle: ["五类 AI 数据采集任务"],
    workloadsText: "选择数据类型，查看推荐代理、接入工具、下载链路和生产指标。",
    workloads: [
      ["01", "视频与多模态数据", "视频、音频、字幕和元数据的持续下载。", "进入视频方案", "ai-video-proxy.html"],
      ["02", "大规模图片数据", "面向训练集的高并发图片获取与补采。", "进入图片方案", "ai-image-proxy.html"],
      ["03", "公开代码数据", "代码仓库、归档和公开对象的长期同步。", "进入代码方案", "ai-github-proxy.html"],
      ["04", "全网文本与文档", "网页文本、PDF、论坛和公开文档采集。", "进入文本方案", "ai-text-proxy.html"],
      ["05", "YouTube 采集 API", "通过 API 获取公开视频元数据、字幕与评论任务结果。", "进入 API 页面", "ai-youtube-api.html"]
    ],
    workflow: {
      title: "公开数据源、代理网络、采集集群与客户存储",
      text: "采集程序通过标准代理接入，由任务队列管理下载、重试、校验和写入。",
      steps: [
        ["01", "定义数据边界", "明确公开数据源、数据类型、使用权限与目标规模。"],
        ["02", "建立代表性样本", "选择真实 URL，测量响应大小、成功率和重试。"],
        ["03", "设计代理与并发", "按目标站点配置代理池、带宽和工作节点。"],
        ["04", "按有效产出扩容", "监控写入存储的数据量，而不是只看请求峰值。"]
      ],
      flow: [["database", "公开数据", "SOURCE"], ["network", "代理网络", "ROUTE"], ["cpu", "采集集群", "WORKERS"], ["hard-drive", "客户存储", "OUTPUT"]],
      stats: [["单项目容量", "10Gbps+"], ["成本模型", "不限流量"], ["交付边界", "代理基础设施"]]
    },
    recommendation: {
      title: "AI 数据采集主链路：高带宽代理 IP",
      text: "大规模下载使用不限流量高带宽代理；需要国家或地区身份的页面发现任务补充隧道住宅代理。",
      points: commonHighBandwidthPointsZh,
      facts: [
        ...commonHighBandwidthFactsZh,
        ["地区补充", "隧道住宅代理", "需要指定国家或地区时按流量使用"]
      ]
    },
    evaluationTitle: "生产运行指标",
    evaluationText: "同时监控有效数据吞吐、成功率、重试、完整性和批次完成时间。",
    evaluationRows: [
      ["有效数据吞吐", "单位时间成功写入存储的数据量"],
      ["任务成功率", "成功对象数 / 计划对象数"],
      ["重试放大", "总请求量相对首次请求量的增幅"],
      ["内容完整性", "文件大小、校验值、字段与关联关系"],
      ["完成周期", "从任务开始到计划数据全部落盘"],
      ["代理效率", "有效数据量相对代理传输与工作节点成本"]
    ],
    evaluationNote: commonEvaluationNoteZh,
    developer: {
      title: "requests、Scrapy、Playwright 与下载器直接接入",
      text: "将项目代理网关配置到现有采集程序，继续使用原有任务队列、解析和存储流程。",
      label: "Python / streaming download",
      code: `import requests

proxy = "http://user:pass@proxy.123proxy.cn:9000"
proxies = {"http": proxy, "https": proxy}

with requests.get(
    "https://target.example/public-object",
    proxies=proxies,
    timeout=60,
    stream=True,
) as response:
    response.raise_for_status()
    with open("object.bin", "wb") as output:
        for chunk in response.iter_content(1024 * 1024):
            output.write(chunk)`,
      points: ["标准 HTTP(S) / SOCKS 接入", "显式设置超时、重试与断点策略", "按任务记录有效数据吞吐"]
    },
    faqs: [
      ["高带宽代理适合哪些 AI 数据任务？", "适合视频、音频、图片、代码归档、网页和公开文档等大规模下载任务，尤其适用于长期运行和传输量大的采集集群。"],
      ["为什么所有场景都优先推荐高带宽代理？", "视频、图片、代码归档和文档进入规模化下载后，带宽与按 GB 成本通常先成为瓶颈。高带宽代理用不限流量、项目级带宽与定制代理池解决这一层问题。"],
      ["10Gbps+ 是否代表单个请求可以达到该速度？", "不是。10Gbps+ 指单项目的聚合容量能力。单个请求速度受目标站点、对象大小、连接、地区、并发和客户端性能共同影响。"],
      ["是否提供数据采集与交付服务？", "可以按企业项目提供公开数据采集、解析、质量检查与交付。标准高带宽代理产品主要提供代理网络、代理池与项目带宽。"],
      ["什么时候需要住宅代理？", "当目标内容与国家或地区、住宅网络身份或本地化页面相关时，可补充隧道住宅代理。纯大规模下载仍应先评估高带宽代理。"],
      ["如何开始容量测试？", "准备代表性 URL、数据类型、平均对象大小、预计规模、完成周期、并发方式和现有工具，即可评估代理池与带宽。"],
      ["是否支持浏览器采集？", "支持标准代理协议，可用于 Playwright 等浏览器工具。浏览器会并行加载页面资源，应单独观察工作节点 CPU、内存、页面完成时间和带宽利用率。"],
      ["合规边界如何处理？", "仅应采集依法可访问且具有合理使用依据的公开数据，并遵守目标服务条款、知识产权、隐私和适用法律。"]
    ],
    cta: ["获取 AI 数据采集代理方案", "提交数据类型、来源、预计规模和完成周期，配置代理池与项目带宽。"]
  },
  video: {
    key: "video",
    file: "ai-video-proxy.html",
    zhFile: "ai-video-proxy.html",
    name: "视频与多模态数据方案",
    title: "视频与多模态数据采集代理方案 | 123Proxy",
    description: "123Proxy 视频与多模态数据方案以不限流量高带宽代理 IP 支撑视频、音频、字幕和元数据下载，提供 10Gbps+ 单项目带宽与定制代理池。",
    eyebrow: "VIDEO & MULTIMODAL DATA SCRAPING",
    titleLines: ["公开视频、音频与字幕", "批量下载代理"],
    lead: "为 yt-dlp、cURL、requests 与内部下载器提供不限流量、10Gbps+ 单项目带宽和定制代理池。",
    primaryLabel: "获取视频下载方案",
    secondaryLabel: "查看接入示例",
    secondaryUrl: "#developers",
    secondaryUrl: "#architecture",
    points: ["yt-dlp / curl / requests", "重试 / Sticky Session", "不限流量", "10Gbps+ 单项目带宽"],
    visual: {
      label: "多模态下载任务",
      status: "下载就绪",
      sources: [
        ["video", "视频对象", "MEDIA"],
        ["audio-lines", "音频轨道", "AUDIO"],
        ["captions", "字幕文件", "SUBTITLE"],
        ["braces", "公开元数据", "METADATA"]
      ],
      route: [["list-video", "任务清单", "MANIFEST"], ["network", "高带宽代理", "PROXY"], ["hard-drive-download", "下载节点", "WORKERS"]],
      metrics: [["项目带宽", "10Gbps+"], ["流量方式", "不限流量"], ["数据交付", "客户存储"]]
    },
    strip: [["10Gbps+", "单项目聚合能力"], ["不限流量", "适合大对象下载"], ["定制代理池", "按目标站点配置"], ["可恢复", "重试与断点策略"]],
    overviewTitle: ["大文件、分片与失败重传"],
    overviewText: "大对象、分片、字幕和元数据需要保持关联；失败重试还会放大流量和完成时间。",
    capabilities: [
      ["gauge", "持续吞吐", "用项目级带宽承载大对象和长时间下载。"],
      ["rotate-ccw", "失败重试", "为超时、连接中断和对象失效设计可恢复队列。"],
      ["link-2", "对象关联", "保持视频、音频、字幕与元数据的任务关系。"],
      ["badge-dollar-sign", "成本可预测", "不限流量减少数据规模增长带来的按 GB 压力。"]
    ],
    workloadsTitle: ["视频、音频、字幕与元数据"],
    workloadsText: "支持大文件持续下载、分片重试和媒体对象关联。",
    workloads: [
      ["01", "公开视频语料", "批量下载公开视频对象及其公开描述信息。", "重点：吞吐与完整性"],
      ["02", "字幕与音频语料", "同步获取字幕、音轨和时间信息，保持对象关联。", "重点：关联关系"],
      ["03", "短视频与片段", "高对象数量与较小文件并存，需要稳定并发和去重。", "重点：并发与去重"]
    ],
    workflow: {
      title: "任务清单、下载节点与对象存储",
      text: "代理网关连接下载节点，失败对象进入重试队列，完整媒体写入客户存储。",
      steps: [
        ["01", "生成公开对象清单", "记录来源、对象标识、媒体类型和期望文件。"],
        ["02", "按站点分配代理池", "结合目标响应、地区和限速策略配置资源。"],
        ["03", "并行下载与断点恢复", "下载节点执行超时、重试和分片恢复。"],
        ["04", "校验后写入存储", "核对大小、格式、字幕和元数据关联。"]
      ],
      flow: [["list-video", "任务清单", "MANIFEST"], ["network", "代理池", "ROUTE"], ["hard-drive-download", "下载节点", "WORKERS"], ["database", "对象存储", "OUTPUT"]],
      stats: [["主代理", "高带宽代理"], ["计费优势", "不限流量"], ["验收单位", "完整对象"]]
    },
    recommendation: {
      title: "视频下载主链路使用高带宽代理",
      text: "不限流量代理承载媒体下载和失败重传；公开视频列表存在地区差异时，使用住宅代理发现页面。",
      points: commonHighBandwidthPointsZh,
      facts: [
        ...commonHighBandwidthFactsZh,
        ["地区页面", "住宅代理补充", "用于需要国家或地区身份的公开列表发现"]
      ]
    },
    evaluationTitle: "视频下载运行指标",
    evaluationText: "监控完整对象数、有效吞吐、首轮成功率、重试流量和批次完成时间。",
    evaluationRows: [
      ["完整对象数", "视频、音频、字幕和元数据全部校验通过"],
      ["有效吞吐", "成功落盘字节 / 实际运行时间"],
      ["首轮成功率", "无需重试即可完成的对象比例"],
      ["重试流量", "失败重传产生的额外传输量"],
      ["对象关联", "媒体、字幕与元数据是否正确绑定"],
      ["批次完成时间", "计划任务全部完成所需时间"]
    ],
    evaluationNote: commonEvaluationNoteZh,
    developer: {
      title: "yt-dlp、cURL 与 requests 代理配置",
      text: "将高带宽代理配置到现有下载工具；需要出口连续性时使用项目 SESSION 参数。",
      label: "yt-dlp / public media",
      code: `yt-dlp \\
  --proxy "http://user:pass@proxy.123proxy.cn:9000" \\
  --write-info-json \\
  --write-subs \\
  --retries 8 \\
  --fragment-retries 20 \\
  "https://target.example/public-video"`,
      points: ["按任务分配 SESSION", "显式设置重试与分片重试", "保存对象元数据与校验结果"]
    },
    faqs: [
      ["yt-dlp 返回 429 或 403 怎么办？", "先检查目标响应与 Retry-After，降低单站点并发并设置退避和失败上限；再按任务分配不同 SESSION，避免所有下载集中在同一出口。代理不能替代平台授权或绕过访问控制。"],
      ["出现 ECONNRESET 或 fragment 下载中断怎么办？", "为 yt-dlp 设置 --retries 与 --fragment-retries，并在任务层记录失败对象后重跑。若目标支持 Range，可再验证断点续传；持续失败时应检查目标响应、客户端连接和代理链路。"],
      ["视频方案是否包含视频解析与下载程序？", "核心交付是代理基础设施与容量方案。客户可继续使用现有下载工具或内部程序；需要项目制开发和数据交付时需单独确认范围。"],
      ["为什么视频任务适合不限流量？", "视频对象体积大，失败重传也会放大传输量。不限流量模式更适合长期、大规模下载并提高预算可预测性。"],
      ["10Gbps+ 是单文件下载速度吗？", "不是。它指单项目聚合容量。单文件速度取决于目标服务、连接、地区、对象大小和客户端性能。"],
      ["可以下载任意平台内容吗？", "不可以。只能处理依法可访问并具有合理使用依据的公开内容，同时应遵守目标平台条款、知识产权和隐私要求。"],
      ["字幕、音频与元数据如何保持关联？", "应在任务清单中使用稳定对象标识，并在写入存储前校验媒体、字幕、音轨和元数据关系。代理层不替代该业务逻辑。"],
      ["什么时候需要住宅代理？", "当公开视频列表、搜索结果或页面内容存在国家或地区差异时，可用住宅代理完成发现；大对象下载主链路仍优先高带宽代理。"],
      ["下载过程中是否可以保持同一出口 IP？", "可按项目配置使用 Sticky Session，尽量让同一下载任务保持出口连续性。实际保持时长和连接恢复行为应结合目标服务、下载器及项目参数测试。"],
      ["如何做 PoC？", "选择一组代表性视频、字幕和音频对象，记录对象大小、成功率、重试量、有效吞吐与完成时间。"],
      ["是否支持断点续传？", "代理协议可以承载支持 Range 的请求，但是否可断点续传取决于目标服务和下载工具。应在 PoC 中验证。"]
    ],
    cta: ["获取视频数据下载代理方案", "提交视频来源、对象规模、下载工具和完成周期，配置代理池与项目带宽。"]
  },
  image: {
    key: "image",
    file: "ai-image-proxy.html",
    zhFile: "ai-image-proxy.html",
    name: "大规模图片数据方案",
    title: "大规模图片数据采集代理方案 | 123Proxy",
    description: "123Proxy 图片数据方案以不限流量高带宽代理支撑训练图片、图文对和公开视觉数据采集，提供 10Gbps+ 单项目能力与定制代理池。",
    eyebrow: "LARGE-SCALE IMAGE DATA SCRAPING",
    titleLines: ["大规模图片数据", "高并发下载与补采"],
    lead: "面向 img2dataset、gallery-dl、aria2、aiohttp 与内部下载服务，以不限流量和项目级带宽支撑高并发下载与失败补采。",
    primaryLabel: "获取图片下载方案",
    secondaryLabel: "查看接入示例",
    secondaryUrl: "#developers",
    secondaryUrl: "#architecture",
    points: ["img2dataset / gallery-dl", "aria2 / aiohttp", "不限流量", "10Gbps+ 单项目带宽"],
    visual: {
      label: "图片数据集任务",
      status: "节点就绪",
      sources: [
        ["image", "训练图片", "IMAGE"],
        ["scan-text", "图文描述", "CAPTION"],
        ["boxes", "公开标注", "ANNOTATION"],
        ["file-json-2", "对象清单", "MANIFEST"]
      ],
      route: [["list-checks", "URL 清单", "MANIFEST"], ["network", "高带宽代理", "PROXY"], ["images", "下载集群", "WORKERS"]],
      metrics: [["项目带宽", "10Gbps+"], ["对象处理", "高并发"], ["流量方式", "不限流量"]]
    },
    strip: [["高并发", "面向海量图片对象"], ["不限流量", "补采成本更可控"], ["定制代理池", "按图片来源配置"], ["可校验", "尺寸 / 格式 / 哈希"]],
    overviewTitle: ["海量小对象与失败补采"],
    overviewText: "海量小对象容易出现超时、空文件、格式异常和重复内容。采集系统应把下载与质量校验连接起来。",
    capabilities: [
      ["layers-3", "大规模任务队列", "按来源和批次拆分 URL 清单，稳定扩展工作节点。"],
      ["gauge", "高并发吞吐", "针对小对象连接开销配置代理池与聚合带宽。"],
      ["refresh-ccw", "失败补采", "保存失败原因并按来源、状态码和次数重新调度。"],
      ["badge-check", "文件校验", "核对格式、尺寸、哈希和图文关联后再入库。"]
    ],
    workloadsTitle: ["训练图片、图文对与公开标注"],
    workloadsText: "高并发下载图片对象，并按状态、格式和哈希执行失败补采。",
    workloads: [
      ["01", "训练图片语料", "从公开来源批量获取图片对象并完成格式校验。", "重点：对象成功率"],
      ["02", "图文对数据", "同步文本描述和图片文件，保持稳定对象标识。", "重点：图文关联"],
      ["03", "视觉评估集", "按主题、来源或时间持续增量采集和去重。", "重点：增量与去重"]
    ],
    workflow: {
      title: "URL 清单、下载集群与对象校验",
      text: "图片对象通过代理下载后校验状态、大小、格式和哈希，失败项进入补采队列。",
      steps: [
        ["01", "整理 URL 与元数据", "为每个对象分配稳定标识、来源和期望字段。"],
        ["02", "按来源配置代理池", "将不同站点拆分队列，控制连接与并发。"],
        ["03", "下载并立即校验", "检查状态码、内容类型、尺寸和文件完整性。"],
        ["04", "失败对象独立补采", "按失败原因和次数重新调度，不重复整批任务。"]
      ],
      flow: [["list-checks", "URL 清单", "MANIFEST"], ["network", "代理池", "ROUTE"], ["images", "下载集群", "WORKERS"], ["badge-check", "校验存储", "OUTPUT"]],
      stats: [["主代理", "高带宽代理"], ["任务模型", "URL 队列"], ["验收单位", "有效图片"]]
    },
    recommendation: {
      title: "图片下载与补采使用高带宽代理",
      text: "不限流量降低海量图片和失败补采的传输成本，定制代理池按图片来源分配资源。",
      points: commonHighBandwidthPointsZh,
      facts: commonHighBandwidthFactsZh
    },
    evaluationTitle: "图片下载运行指标",
    evaluationText: "监控有效对象率、成功落盘量、损坏文件、错误格式、重复对象和补采完成时间。",
    evaluationRows: [
      ["有效图片数", "通过格式、尺寸与完整性校验的对象数"],
      ["有效对象率", "有效图片数 / 已下载对象数"],
      ["下载吞吐", "单位时间成功写入的图片字节数"],
      ["失败补采率", "首次失败后成功恢复的对象比例"],
      ["重复率", "哈希或感知去重识别出的重复对象比例"],
      ["图文关联率", "图片与描述、标签或来源字段正确绑定"]
    ],
    evaluationNote: commonEvaluationNoteZh,
    developer: {
      title: "img2dataset、gallery-dl 与 aiohttp 接入",
      text: "通过标准 HTTP(S) 代理连接图片下载工具或内部下载服务。",
      label: "Shell / img2dataset",
      code: `export http_proxy="http://user:pass@proxy.123proxy.cn:9000"
export https_proxy="$http_proxy"

img2dataset \\
  --url_list urls.txt \\
  --input_format txt \\
  --output_format webdataset`,
      points: ["按任务或机器分配 SESSION", "校验状态码、类型与图片解码", "失败对象写入独立补采队列"]
    },
    faqs: [
      ["图片请求大量返回 403、429 或超时怎么办？", "先按来源拆分列表页与图片对象队列，读取响应和 Retry-After，降低单站点并发并设置退避；再用不同 SESSION 分摊合法公开任务。不要用代理绕过登录、验证码或访问控制。"],
      ["图片下载速度忽高忽低怎么办？", "分别检查目标响应、下载器并发、代理链路与存储写入。可将元数据请求和图片对象下载拆成不同队列，并以有效图片每小时而不是瞬时连接速度评估。"],
      ["图片方案是否包含去重和内容审核？", "核心方案提供代理基础设施。图片解码、去重、质量过滤、内容审核和标注应由客户数据管道完成，项目制服务需另行确认。"],
      ["为什么图片任务也需要高带宽？", "单张图片可能不大，但对象数量、高并发连接和失败补采会形成可观总流量。聚合带宽决定批次完成周期。"],
      ["不限流量是否意味着无限吞吐？", "不是。实际吞吐受项目带宽、目标响应、连接数、客户端和存储写入共同影响。"],
      ["如何避免空文件或错误图片进入数据集？", "应同时检查状态码、Content-Type、文件大小、图片解码结果和哈希，并将失败对象写入补采队列。"],
      ["支持哪些图片下载工具？", "img2dataset、gallery-dl、aria2、requests 与 aiohttp 等支持 HTTP(S) 代理的工具均可接入。并发、超时和重试参数应使用代表性来源测试。"],
      ["图片来源很多时如何配置代理池？", "建议按站点或来源拆分队列，分别测量响应和失败模式，再配置定制代理池与带宽。"],
      ["什么时候需要住宅代理？", "当图片列表或页面发现依赖国家、地区或住宅网络身份时可补充住宅代理；对象下载主链路通常仍优先高带宽代理。"],
      ["合规上需要注意什么？", "仅采集依法可访问并具有合理使用依据的公开图片，遵守知识产权、隐私、目标服务条款和适用法律。"]
    ],
    cta: ["获取图片数据下载代理方案", "提交图片来源、对象数量、平均大小、下载工具和完成周期。"]
  },
  code: {
    key: "code",
    file: "ai-github-proxy.html",
    zhFile: "ai-github-proxy.html",
    name: "公开代码数据方案",
    title: "公开代码与仓库数据采集代理方案 | 123Proxy",
    description: "123Proxy 公开代码数据方案以不限流量高带宽代理支撑公开仓库、归档、历史对象和 Code LLM 数据采集，提供 10Gbps+ 单项目能力。",
    eyebrow: "PUBLIC CODE DATA SCRAPING",
    titleLines: ["公开代码仓库与归档", "持续同步代理"],
    lead: "面向 git clone、源码归档、GitHub REST / GraphQL API 与增量同步，以不限流量和项目级带宽支撑长期代码数据任务。",
    primaryLabel: "获取代码同步方案",
    secondaryLabel: "查看接入示例",
    secondaryUrl: "#developers",
    secondaryUrl: "#architecture",
    points: ["git clone / 源码归档", "REST / GraphQL API", "不限流量", "10Gbps+ 单项目带宽"],
    visual: {
      label: "公开代码同步任务",
      status: "同步就绪",
      sources: [
        ["git-branch", "公开仓库", "REPOSITORY"],
        ["archive", "源码归档", "ARCHIVE"],
        ["history", "历史对象", "COMMITS"],
        ["file-code-2", "代码文件", "SOURCE"]
      ],
      route: [["list-tree", "仓库清单", "MANIFEST"], ["network", "高带宽代理", "PROXY"], ["git-fork", "同步节点", "WORKERS"]],
      metrics: [["项目带宽", "10Gbps+"], ["传输方式", "不限流量"], ["接入协议", "Git / HTTP"]]
    },
    strip: [["不限流量", "适合仓库长期同步"], ["10Gbps+", "单项目聚合能力"], ["定制代理池", "按代码来源配置"], ["可恢复", "归档与对象级重试"]],
    overviewTitle: ["仓库、归档、历史与大文件对象"],
    overviewText: "仓库发现、归档下载、历史对象和大文件具有不同传输特征，应拆分队列和验收口径。",
    capabilities: [
      ["git-branch", "仓库与分支", "按仓库、默认分支和更新时间组织公开项目清单。"],
      ["archive", "归档与历史", "区分源码归档、提交历史和大文件对象的下载策略。"],
      ["refresh-ccw", "增量同步", "根据更新时间或对象标识同步变化，避免重复全量下载。"],
      ["shield-check", "边界与许可", "记录来源、许可证和公开访问依据，支持后续数据治理。"]
    ],
    workloadsTitle: ["代码仓库批量下载与增量同步"],
    workloadsText: "支持公开仓库、源码归档、提交历史和大文件对象的持续传输。",
    workloads: [
      ["01", "公开仓库镜像", "批量同步公开仓库、默认分支和源码归档。", "重点：仓库成功率"],
      ["02", "历史对象研究", "获取提交、树和对象历史，保留时间与关联。", "重点：历史完整性"],
      ["03", "增量代码语料", "按更新时间发现变化，只同步新增或变更对象。", "重点：增量效率"]
    ],
    workflow: {
      title: "仓库清单、同步节点与代码存储",
      text: "同步节点通过代理下载归档或 Git 对象，失败任务按仓库或对象重试。",
      steps: [
        ["01", "建立公开仓库清单", "记录来源、仓库标识、分支、更新时间和许可信息。"],
        ["02", "选择归档或 Git 策略", "按是否需要历史、对象关系和大文件选择方式。"],
        ["03", "并行同步与对象重试", "按来源限制并发，失败时重跑仓库或对象。"],
        ["04", "解析、去重与许可处理", "网络下载完成后再进入代码清洗和数据治理。"]
      ],
      flow: [["list-tree", "仓库清单", "MANIFEST"], ["network", "代理池", "ROUTE"], ["git-fork", "同步节点", "WORKERS"], ["database", "代码存储", "OUTPUT"]],
      stats: [["主代理", "高带宽代理"], ["同步方式", "Git / HTTP"], ["验收单位", "仓库 / 对象"]]
    },
    recommendation: {
      title: "代码归档与历史对象使用高带宽代理",
      text: "不限流量适合长期仓库同步，定制代理池可按代码托管来源分配连接与带宽。",
      points: commonHighBandwidthPointsZh,
      facts: commonHighBandwidthFactsZh
    },
    evaluationTitle: "代码同步运行指标",
    evaluationText: "监控仓库完成率、引用与对象完整性、重试量、有效吞吐和增量延迟。",
    evaluationRows: [
      ["仓库成功率", "按计划完成同步的公开仓库比例"],
      ["对象完整性", "引用、树、提交和文件对象是否齐全"],
      ["有效传输", "成功落盘的归档与对象字节数"],
      ["增量效率", "新增或变化对象相对总传输量的比例"],
      ["失败恢复", "超时、限速或中断后恢复成功的任务比例"],
      ["许可记录率", "具有来源和许可证字段的仓库比例"]
    ],
    evaluationNote: commonEvaluationNoteZh,
    developer: {
      title: "Git、REST 与 GraphQL 代理配置",
      text: "源码归档和 API 请求使用 HTTP 代理，git clone 可通过 Git 代理配置接入。",
      label: "Git / public repository",
      code: `git \\
  -c http.proxy="http://user:pass@proxy.123proxy.cn:9000" \\
  clone \\
  --filter=blob:none \\
  "https://target.example/public/repository.git"`,
      points: ["按来源控制并发与重试", "归档和历史对象使用不同队列", "记录来源、时间与许可证"]
    },
    faqs: [
      ["git clone 出现 RPC failed、curl 56、EOF 或 SSL 错误怎么办？", "先记录仓库大小和失败阶段，使用 --filter=blob:none、浅克隆或归档下载降低单任务体积，并在仓库粒度设置超时与重试。持续失败时应分别检查目标服务、Git 客户端与代理链路。"],
      ["公开代码方案是否只支持 GitHub？", "不是。页面面向依法可访问的公开代码托管、仓库归档和 HTTP 对象。具体目标应通过代表性仓库验证协议、限速和对象完整性。"],
      ["可以采集私有仓库吗？", "本方案不提供绕过访问控制的能力。私有仓库必须由客户拥有合法授权并自行提供合规凭据。"],
      ["为什么代码任务需要不限流量？", "长期同步仓库、归档、历史对象和大文件会产生持续传输，失败重试也会增加总量。不限流量更便于控制预算。"],
      ["代理可以解决 GitHub API Token 限额吗？", "不能。代理可以为网络请求提供不同出口，但账号或 Token 的 API 配额仍由代码托管平台控制。开发者应读取响应头、控制并发并按平台规则处理限额。"],
      ["Git clone 和归档下载如何选择？", "只需要当前源码时归档通常更轻；需要提交历史、分支和对象关系时使用 Git。应按数据目标拆分任务。"],
      ["是否包含许可证识别和代码清洗？", "不包含在标准代理方案内。许可证识别、敏感信息处理、代码解析、去重和质量过滤由客户数据管道负责。"],
      ["10Gbps+ 是否适用于单个仓库？", "它是单项目聚合容量，不代表单个仓库或连接可以达到该速度。吞吐来自多个来源和工作节点的整体并行。"],
      ["如何进行增量同步？", "应保存仓库更新时间、引用或对象标识，根据变化只调度新增任务，避免重复全量传输。"],
      ["合规上需要保留哪些信息？", "建议记录来源 URL、抓取时间、公开状态、许可证和处理规则，并遵守知识产权、隐私、目标服务条款与适用法律。"]
    ],
    cta: ["获取公开代码同步代理方案", "提交代码来源、仓库规模、历史深度、同步工具和完成周期。"]
  },
  text: {
    key: "text",
    file: "ai-text-proxy.html",
    zhFile: "ai-text-proxy.html",
    name: "全网文本与文档方案",
    title: "公开文本与文档数据采集代理方案 | 123Proxy",
    description: "123Proxy 文本与文档方案面向公开网页、新闻、论坛、博客和 PDF 采集，以高带宽代理为主，并按地区需求补充住宅代理。",
    eyebrow: "WEB TEXT & DOCUMENT SCRAPING",
    titleLines: ["公开网页与文档", "持续采集代理"],
    lead: "面向 Scrapy、requests、Playwright、Selenium 与内部爬虫，以高带宽代理承载规模化采集，并按地区需求补充住宅代理。",
    primaryLabel: "获取文本采集方案",
    secondaryLabel: "查看接入示例",
    secondaryUrl: "#developers",
    secondaryUrl: "#recommendation",
    points: ["Scrapy / requests", "Playwright / Selenium", "高带宽主链路", "住宅地区补充"],
    visual: {
      label: "文本与文档采集任务",
      status: "采集就绪",
      sources: [
        ["newspaper", "新闻与博客", "ARTICLE"],
        ["messages-square", "论坛与社区", "DISCUSSION"],
        ["file-text", "公开文档", "DOCUMENT"],
        ["file-type-2", "PDF 文件", "PDF"]
      ],
      route: [["list-filter", "URL 队列", "FRONTIER"], ["network", "代理策略", "PROXY"], ["braces", "解析节点", "WORKERS"]],
      metrics: [["主链路", "高带宽"], ["地区补充", "住宅代理"], ["数据结果", "结构化文本"]]
    },
    strip: [["高带宽", "大规模网页与文档"], ["190+", "住宅国家和地区"], ["SESSION", "连续地区会话"], ["标准协议", "Scrapy / 浏览器接入"]],
    overviewTitle: ["HTML、浏览器页面与 PDF 文档"],
    overviewText: "网页数量、文档体积、页面渲染和地区差异决定代理选择，不能只用单一请求成功率评价。",
    capabilities: [
      ["list-filter", "URL 发现与调度", "按站点、栏目和更新时间管理采集边界。"],
      ["file-text", "HTML 与文档下载", "区分轻量网页、PDF 和其他公开文档的传输方式。"],
      ["map-pinned", "地区与本地内容", "需要本地化结果时使用可指定国家或地区的住宅代理。"],
      ["braces", "解析与去重", "抽取正文、字段和文档关系，过滤重复与低质量内容。"]
    ],
    workloadsTitle: ["新闻、论坛、博客与公开文档"],
    workloadsText: "高带宽代理承载大规模网页和文档下载，住宅代理提供明确的国家或地区出口。",
    workloads: [
      ["01", "新闻与博客语料", "按站点和时间持续发现、抓取并抽取公开文章。", "重点：增量与去重"],
      ["02", "论坛与公开讨论", "保持主题、分页和回复关系，控制抓取节奏。", "重点：会话与结构"],
      ["03", "PDF 与公开文档", "下载文档并保存来源、版本、格式和文本解析结果。", "重点：文档完整性"]
    ],
    workflow: {
      title: "URL 队列、代理策略与解析节点",
      text: "轻量 HTML、浏览器页面和 PDF 文档使用独立队列与代理配置。",
      steps: [
        ["01", "建立站点与 URL 边界", "记录公开来源、栏目、更新时间和允许抓取范围。"],
        ["02", "按任务选择代理", "大规模下载使用高带宽代理，地区内容使用住宅代理。"],
        ["03", "分层抓取与解析", "HTML、浏览器页面和文档进入不同工作队列。"],
        ["04", "去重并保存来源", "输出正文、字段、时间、来源和质量状态。"]
      ],
      flow: [["list-filter", "URL 队列", "FRONTIER"], ["network", "代理策略", "ROUTE"], ["braces", "解析节点", "WORKERS"], ["database", "文本语料", "OUTPUT"]],
      stats: [["主链路", "高带宽代理"], ["地区补充", "住宅代理"], ["验收单位", "有效文档"]]
    },
    recommendation: {
      title: "高带宽代理下载，住宅代理定向",
      text: "网页和文档主链路使用高带宽代理；本地化搜索、新闻和地区内容使用隧道住宅代理。",
      points: ["高带宽代理不限流量", "10Gbps+ 单项目能力", "住宅代理覆盖 190+ 国家和地区", "住宅代理支持地区与 SESSION"],
      facts: [
        ["大规模下载", "高带宽代理 IP", "网页、PDF 与公开文档的主采集链路"],
        ["地区定向", "隧道住宅代理", "鉴权指定国家或地区与 SESSION"],
        ["成本口径", "项目制 + 按流量", "按任务拆分高带宽与住宅用量"],
        ["接入方式", "HTTP(S) / SOCKS", "兼容 Scrapy、requests 与浏览器工具"]
      ]
    },
    evaluationTitle: "文本与文档运行指标",
    evaluationText: "监控有效文档数、抓取与解析成功率、地区匹配率、重复率和来源字段完整性。",
    evaluationRows: [
      ["有效文档数", "通过正文长度、语言和质量规则的文档数"],
      ["抓取成功率", "成功获取 HTML 或文件的 URL 比例"],
      ["解析成功率", "成功抽取正文和必要字段的文档比例"],
      ["地区匹配率", "需要定向时出口与目标国家或地区一致的比例"],
      ["重复率", "URL、内容指纹或语义规则识别出的重复比例"],
      ["来源完整性", "保留 URL、时间、站点与版本信息的文档比例"]
    ],
    evaluationNote: commonEvaluationNoteZh,
    developer: {
      title: "Scrapy、requests 与 Playwright 代理配置",
      text: "按站点、HTML、浏览器页面和文档下载队列配置标准代理。",
      label: "Python / Scrapy request",
      code: `import scrapy

proxy = "http://user:pass@proxy.123proxy.cn:9000"
request = scrapy.Request(
    "https://target.example/public-document",
    meta={"proxy": proxy},
    cb_kwargs={"source": "public-web"},
)`,
      points: ["按站点队列配置代理", "保留来源 URL 与抓取时间", "将抓取成功与解析成功分开统计"]
    },
    faqs: [
      ["文本与文档任务为什么不只推荐住宅代理？", "大规模网页和文档下载的主要瓶颈通常是带宽与总传输成本，因此高带宽代理更适合作为主链路。只有明确依赖国家或地区身份时才补充住宅代理。"],
      ["住宅代理可以指定哪些位置？", "隧道住宅代理覆盖 190+ 国家和地区，可在鉴权中指定国家或地区与 SESSION。具体可选位置以控制台为准。"],
      ["遇到 403、429 或 503 应如何处理？", "先读取响应和重试提示，按站点设置并发、延迟、指数退避与失败上限，再用代表性任务评估代理池。代理不应被用来绕过登录、验证码或访问控制。"],
      ["页面需要 JavaScript 渲染怎么办？", "可使用 Playwright 等浏览器工具并配置标准代理。浏览器会并行加载多种资源，应单独评估节点性能、页面完成时间和带宽。"],
      ["PDF 和 HTML 应使用同一队列吗？", "不建议。PDF 体积、超时和校验方式与 HTML 不同，应拆分队列并使用不同并发、超时和重试参数。"],
      ["是否包含正文解析与去重？", "标准代理方案不包含业务解析。正文抽取、语言识别、去重和质量过滤由客户数据管道负责，项目制服务需单独确认。"],
      ["如何判断地区定向是否必要？", "使用不同地区进行小规模对比，观察页面内容、搜索结果、可见字段或返回状态是否变化，再决定是否使用住宅代理。"],
      ["分布式 Scrapy 集群如何配置代理？", "各爬虫节点可接入同一项目网关，并按站点或队列使用不同 SESSION。并发、延迟、超时和重试应在爬虫侧按域名控制，最终以有效文档吞吐评估单项目容量。"],
      ["如何控制抓取节奏？", "按站点配置并发、延迟、超时和重试，遵守 robots、服务条款和合理访问边界，不应以代理绕过访问控制。"],
      ["应如何保存数据来源？", "建议为每个文档保留原始 URL、站点、抓取时间、内容版本、地区策略和处理状态，便于审计与数据治理。"]
    ],
    cta: ["获取公开文本与文档采集方案", "提交来源类型、地区要求、文档规模、采集框架和完成周期。"]
  },
  youtubeApi: {
    key: "youtubeApi",
    file: "ai-youtube-api.html",
    zhFile: "ai-youtube-api.html",
    name: "YouTube 采集 API",
    title: "YouTube 采集 API - 视频元数据、字幕与评论接口 | 123Proxy",
    description: "123Proxy YouTube 采集 API 面向开发者提供公开视频元数据、字幕、评论、异步任务与对象存储交付接口，无需自行维护代理池。",
    eyebrow: "YOUTUBE DATA API",
    titleLines: ["通过 API 获取 YouTube", "元数据、字幕与评论"],
    lead: "提交视频 ID 或公开 URL，获取元数据、字幕与评论；长任务通过异步状态和 Webhook 交付，需要媒体文件时可按项目配置对象存储。",
    primaryLabel: "申请 API 测试",
    primaryUrl: "contact.html#service",
    primaryIcon: "key-round",
    secondaryLabel: "查看接入代码",
    secondaryUrl: "#developers",
    secondaryIcon: "braces",
    points: ["REST API / JSON", "异步任务 / Webhook", "字幕 / 评论 / 元数据", "S3 / OSS / GCS 交付"],
    nav: [["#overview", "接口能力"], ["#workloads", "适用任务"], ["#architecture", "任务流程"], ["#recommendation", "API 产品"], ["#evaluation", "运行指标"], ["#developers", "接入代码"], ["#faq", "常见问题"]],
    section: ["01 / 接口能力", "02 / 适用任务", "03 / 任务流程", "04 / API 产品", "05 / 运行指标", "06 / 接入代码", "07 / FAQ"],
    architectureLabel: "API job architecture",
    faqTitle: "YouTube 采集 API 常见问题",
    faqText: "字段、异步任务、Webhook、对象存储、配额与错误处理。",
    visual: {
      label: "YouTube 数据任务",
      status: "接口就绪",
      sources: [
        ["video", "视频元数据", "METADATA"],
        ["captions", "字幕与转录", "SUBTITLES"],
        ["messages-square", "评论与回复", "COMMENTS"],
        ["cloud-upload", "媒体文件", "OBJECT STORAGE"]
      ],
      route: [["braces", "API 请求", "REQUEST"], ["list-checks", "异步任务", "JOB"], ["send", "Webhook / 存储", "DELIVERY"]],
      metrics: [["接口方式", "REST / JSON"], ["任务模式", "同步 / 异步"], ["结果交付", "Webhook / Storage"]]
    },
    strip: [["REST API", "标准 JSON 接口"], ["ASYNC JOB", "批量异步任务"], ["WEBHOOK", "任务完成通知"], ["S3 / OSS / GCS", "对象存储交付"]],
    overviewTitle: ["REST API、异步任务与 Webhook"],
    overviewText: "提交视频 ID 或公开 URL，获取任务状态、JSON 结果和对象存储交付。",
    capabilities: [
      ["braces", "视频元数据", "按视频 ID 或公开 URL 请求标题、描述、标签及公开统计字段。"],
      ["captions", "字幕与转录", "请求可用字幕、语言与时间信息，具体字段以正式 API 文档为准。"],
      ["messages-square", "评论与回复", "按任务拉取公开评论与回复，保留层级、时间和可用公开字段。"],
      ["cloud-upload", "对象存储交付", "媒体文件可按项目直接交付至 S3、OSS 或 GCS，格式与分辨率需测试确认。"]
    ],
    workloadsTitle: ["视频知识库、多模态语料与评论数据"],
    workloadsText: "把长耗时任务放入异步队列，通过 job_id、状态和 Webhook 与现有数据管道衔接。",
    workloads: [
      ["01", "视频知识库与 RAG", "获取公开元数据、字幕和来源字段，形成可追踪的视频文档。", "重点：字段与来源"],
      ["02", "多模态数据任务", "把视频、音频、字幕与元数据交付到同一对象关系中。", "重点：对象关联"],
      ["03", "评论与社区研究", "按视频任务采集公开评论和回复，保留层级与时间字段。", "重点：结构完整性"]
    ],
    workflow: {
      title: "任务提交、异步处理与结果交付",
      text: "轻量字段可同步返回，批量评论和媒体任务通过 job_id、Webhook 或对象存储交付。",
      steps: [
        ["01", "定义任务与字段", "提交视频 ID、公开 URL、所需字段和交付方式。"],
        ["02", "使用 API Key 鉴权", "在请求头传递密钥，并使用幂等键避免重复创建任务。"],
        ["03", "轮询或接收 Webhook", "保存 job_id，依据状态处理运行、完成与失败。"],
        ["04", "校验 JSON 与存储对象", "核对字段、对象关系、错误信息和媒体交付结果。"]
      ],
      flow: [["braces", "API 客户端", "REQUEST"], ["list-checks", "任务队列", "JOB"], ["server-cog", "采集服务", "WORKERS"], ["send", "Webhook / 存储", "DELIVERY"]],
      stats: [["接口", "REST / JSON"], ["执行模式", "同步 / 异步"], ["结果交付", "Webhook / Storage"]]
    },
    recommendation: {
      title: "YouTube 采集 API",
      text: "通过统一接口提交任务、查询状态并接收结果，无需单独维护 YouTube 代理池和下载集群。",
      productName: "YouTube 采集 API",
      productUrl: "contact.html#service",
      productLabel: "申请 API Key",
      productIcon: "key-round",
      label: "API PRODUCT",
      points: ["视频 ID / 公开 URL 任务提交", "元数据、字幕与评论字段", "批量异步任务与 Webhook", "对象存储交付按项目确认"],
      facts: [
        ["鉴权", "API Key", "建议通过请求头传递并妥善保管"],
        ["任务模式", "同步 / 异步", "轻量查询与长耗时任务分离"],
        ["结果格式", "JSON / Webhook", "状态、结果与错误可追踪"],
        ["媒体交付", "S3 / OSS / GCS", "格式、分辨率与存储权限按项目确认"]
      ]
    },
    evaluationTitle: "API 运行指标",
    evaluationText: "监控任务创建率、完成率、处理时延、字段完整性、Webhook 投递和对象存储写入。",
    evaluationRows: [
      ["任务创建成功率", "通过鉴权和参数校验并返回 job_id 的任务比例"],
      ["任务完成率", "在约定时间窗内进入完成状态的任务比例"],
      ["处理时延", "按任务类型分别观察 P50、P95 与长尾完成时间"],
      ["字段完整性", "所需元数据、字幕、评论及关系字段的可用比例"],
      ["Webhook 投递", "回调成功、重试与重复事件的处理结果"],
      ["对象交付完整性", "目标存储中媒体对象、元数据与任务记录的一致性"]
    ],
    evaluationNote: "接口字段、任务配额、媒体格式、分辨率、响应时间及平台可用性以正式 API 文档和实际测试结果为准。",
    developer: {
      title: "Python 异步任务示例",
      text: "API Key 通过请求头传递，客户端持久化 job_id，并通过轮询或 Webhook 获取结果。",
      label: "Python / async task",
      code: `import requests

response = requests.post(
    "https://api.123proxy.cn/v1/youtube/video",
    headers={"X-API-Key": "YOUR_API_KEY"},
    json={
        "video_id": "VIDEO_ID",
        "features": ["metadata", "subtitles", "comments"],
        "delivery": {
            "webhook_url": "https://collector.example/webhooks/youtube",
            "upload_to": "s3://my-bucket/videos/"
        },
        "idempotency_key": "dataset-2026-0001"
    },
    timeout=30,
)
response.raise_for_status()
job = response.json()
print(job["job_id"], job["status"])`,
      points: ["API Key 通过请求头传递", "使用幂等键避免重复任务", "持久化 job_id、状态与错误"]
    },
    faqs: [
      ["API 可以返回哪些 YouTube 数据？", "原页面覆盖视频元数据、字幕或转录、公开评论与回复。正式可用字段、排序参数、语言和分页方式以开通后的 API 文档为准。"],
      ["哪些请求同步返回，哪些需要异步任务？", "轻量元数据请求可能直接返回；深度评论、批量视频和媒体文件交付通常更适合异步任务。具体阈值和状态字段以正式文档为准。"],
      ["支持将音视频直接传到 S3、OSS 或 GCS 吗？", "原页面包含对象存储直传能力。实际支持的存储类型、格式、分辨率、凭证方式和文件命名应在项目测试中确认。"],
      ["接入 API 后还需要自行购买和维护代理吗？", "不需要为该 API 单独维护代理池。123Proxy 封装数据访问和任务执行，客户系统仍需负责合法任务输入、结果校验、存储和数据治理。"],
      ["如何避免重复创建或重复处理任务？", "客户端应为业务任务提供幂等键，持久化 job_id，并把 Webhook 当作可能重试的事件处理；具体签名与重试规则以正式文档为准。"],
      ["如何申请 API Key 和测试额度？", "联系销售并提交数据类型、任务量、所需字段、媒体交付方式和完成周期，确认测试范围后开通 API Key 与配额。"],
      ["遇到限流或临时失败应该怎么处理？", "按返回状态和错误码执行指数退避，限制客户端并发并记录重试次数。正式配额、速率限制和错误码以 API 文档为准。"],
      ["使用范围和合规边界是什么？", "仅处理依法可访问且具有合理使用依据的公开内容，并遵守平台条款、知识产权、隐私和适用法律；API 不用于绕过登录、验证码或访问控制。"]
    ],
    cta: ["申请 YouTube 采集 API 测试", "提交视频样本、字段清单、日任务量、Webhook 或对象存储需求。"]
  }
};

const sharedEnPoints = [
  "Unmetered project traffic",
  "10Gbps+ per-project capacity",
  "Target-specific proxy pools",
  "HTTP(S) and SOCKS access"
];

function buildEnglishPage(config) {
  return {
    ...config,
    zhFile: config.file,
    primaryLabel: config.primaryLabel || "Assess high-bandwidth capacity",
    secondaryLabel: config.secondaryLabel || "View architecture",
    secondaryUrl: config.secondaryUrl || "#architecture",
    points: config.points || sharedEnPoints,
    strip: config.strip || [["10Gbps+", "Per-project capacity"], ["Unmetered", "Predictable transfer cost"], ["Custom pools", "Target-specific routing"], ["24/7", "Enterprise support"]],
    recommendation: config.recommendation || {
      title: "Use high-bandwidth proxy IP as the primary transfer layer",
      text: "Large AI datasets are constrained first by aggregate throughput and transfer cost. Residential proxies are added only when a workload needs explicit geographic identity.",
      points: sharedEnPoints,
      facts: [["Primary product", "High-bandwidth proxy IP", "Unmetered project capacity"], ["Capacity", "10Gbps+", "Validated with representative targets"], ["Access", "HTTP(S) / SOCKS", "Works with existing collectors"]]
    },
    evaluationNote: config.evaluationNote || "Validate all capacity assumptions with representative public targets, real response sizes, retry behavior, and the required completion window.",
    developer: config.developer || {
      title: config.developerTitle,
      text: config.developerText,
      label: config.developerLabel,
      code: config.developerCode,
      points: ["Standard proxy configuration", "Explicit timeout and retry policy", "Measure useful data throughput"]
    }
  };
}

export const solutionsEn = {
  overview: buildEnglishPage({
    key: "overview",
    file: "ai-data.html",
    name: "AI Data Scraping Infrastructure",
    title: "AI Data Scraping Infrastructure | 123Proxy",
    description: "High-bandwidth proxy infrastructure for public video, image, code, text, and document datasets with unmetered traffic and 10Gbps+ per-project capacity.",
    eyebrow: "AI DATA SCRAPING INFRASTRUCTURE",
    titleLines: ["Infrastructure for", "production-scale AI datasets"],
    lead: "Move public video, image, code, text, and document data into your collection pipeline with unmetered traffic, 10Gbps+ per-project capacity, and target-specific proxy pools.",
    visual: {
      label: "AI dataset pipeline",
      status: "capacity ready",
      sources: [["video", "Video and audio", "MULTIMODAL"], ["images", "Image datasets", "IMAGE"], ["file-code-2", "Public code", "CODE"], ["files", "Text and documents", "CORPUS"]],
      route: [["database", "Public sources", "SOURCE"], ["network", "123Proxy", "PROXY"], ["cpu", "Collectors", "WORKERS"]],
      metrics: [["PROJECT CAPACITY", "10Gbps+"], ["BILLING", "Unmetered"], ["POOL", "Custom"]]
    },
    overviewTitle: ["Start with data shape,", "then plan network capacity"],
    overviewText: "Object size, request count, location requirements, and retry behavior determine the right proxy and bandwidth model.",
    capabilities: [["video", "Video and multimodal", "Sustained transfer for large media objects."], ["images", "Image datasets", "High concurrency and object-level recovery."], ["file-code-2", "Public code", "Repositories, archives, and historical objects."], ["files", "Text and documents", "Web pages, PDFs, and public documents."]],
    workloadsTitle: ["Choose by workload,", "not by proxy label"],
    workloadsText: "Each solution page explains architecture and validation while routing capacity decisions to high-bandwidth proxy IP.",
    workloads: [["01", "Video and multimodal", "Video, audio, captions, and public metadata.", "Open video solution", "ai-video-proxy.html"], ["02", "Large-scale images", "Concurrent image collection and recovery.", "Open image solution", "ai-image-proxy.html"], ["03", "Public code", "Repositories, archives, and historical objects.", "Open code solution", "ai-github-proxy.html"], ["04", "Web text and documents", "Pages, PDFs, forums, and public documents.", "Open text solution", "ai-text-proxy.html"], ["05", "YouTube Data API", "Submit public video metadata, caption, and comment jobs through an API.", "Open API product", "ai-youtube-api.html"]],
    workflow: {
      title: "Scale by useful data throughput",
      text: "Measure successfully stored data, retries, completeness, and completion time rather than request count alone.",
      steps: [["01", "Define the dataset", "Document public sources, object types, and expected scale."], ["02", "Build a representative sample", "Measure response sizes, success, and retry behavior."], ["03", "Plan pools and workers", "Allocate proxy capacity by target and collector."], ["04", "Scale by output", "Track useful bytes written to customer storage."]],
      flow: [["database", "Public data", "SOURCE"], ["network", "Proxy network", "ROUTE"], ["cpu", "Collectors", "WORKERS"], ["hard-drive", "Storage", "OUTPUT"]],
      stats: [["Capacity", "10Gbps+"], ["Cost model", "Unmetered"], ["Boundary", "Proxy infrastructure"]]
    },
    evaluationTitle: "Validate with reproducible production metrics",
    evaluationText: "Capacity tests should explain cost, completion time, and dataset quality.",
    evaluationRows: [["Useful throughput", "Successfully stored bytes per unit time"], ["Task success", "Completed objects relative to the manifest"], ["Retry amplification", "Extra requests caused by failures"], ["Completeness", "Files, fields, checksums, and relationships"], ["Completion window", "Time required to finish the planned batch"], ["Proxy efficiency", "Useful output relative to network and worker cost"]],
    developerTitle: "Keep data logic in your collection system",
    developerText: "Existing collectors continue to use standard proxy protocols. 123Proxy supplies routing and capacity; customers own parsing, storage, and business rules.",
    developerLabel: "Python / streaming download",
    developerCode: `import requests

proxy = "http://user:pass@proxy.123proxy.cn:9000"
with requests.get(
    "https://target.example/public-object",
    proxies={"http": proxy, "https": proxy},
    timeout=60,
    stream=True,
) as response:
    response.raise_for_status()`,
    faqs: [["Is this a proxy product or a managed dataset service?", "These pages describe proxy infrastructure for AI data workloads. Managed collection or dataset delivery requires a separately scoped enterprise project."], ["Why is high-bandwidth proxy the primary recommendation?", "Large media, images, archives, and documents are constrained first by aggregate throughput and transfer cost."], ["Does 10Gbps+ apply to one request?", "No. It is aggregate capacity for one project across targets, connections, and workers."], ["When are residential proxies needed?", "Add them when a public workload requires explicit country or regional identity."], ["Can you deliver training datasets directly?", "Dataset delivery is not included by default and must be separately scoped."], ["How should a PoC start?", "Use representative URLs, object sizes, retry behavior, and a target completion window."], ["Are browser collectors supported?", "Yes, through standard proxy protocols, but browser resource concurrency and worker capacity must be measured."], ["What are the compliance boundaries?", "Collect only lawfully accessible public data and follow applicable terms, intellectual-property, privacy, and legal requirements."]],
    cta: ["Assess proxy capacity with a real data workload", "Share representative targets, data types, expected scale, and the required completion window."]
  }),
  video: buildEnglishPage({
    key: "video",
    file: "ai-video-proxy.html",
    name: "Video and Multimodal Data",
    title: "Video and Multimodal Data Scraping Proxy | 123Proxy",
    description: "Unmetered high-bandwidth proxy infrastructure for public video, audio, captions, and metadata with 10Gbps+ per-project capacity.",
    eyebrow: "VIDEO & MULTIMODAL DATA SCRAPING",
    titleLines: ["Keep multimodal data moving", "through the collection pipeline"],
    lead: "Support public video, audio, caption, and metadata downloads with unmetered traffic, 10Gbps+ per-project capacity, and target-specific proxy pools.",
    visual: {label: "multimodal pipeline", status: "stream ready", sources: [["video", "Video objects", "MEDIA"], ["audio-lines", "Audio tracks", "AUDIO"], ["captions", "Captions", "SUBTITLE"], ["braces", "Public metadata", "METADATA"]], route: [["list-video", "Manifest", "QUEUE"], ["network", "High bandwidth", "PROXY"], ["hard-drive-download", "Downloaders", "WORKERS"]], metrics: [["CAPACITY", "10Gbps+"], ["TRAFFIC", "Unmetered"], ["OUTPUT", "Customer storage"]]},
    overviewTitle: ["Video bottlenecks are", "more than concurrency"],
    overviewText: "Large objects, segments, captions, and metadata require sustained transfer, recoverable queues, and relationship checks.",
    capabilities: [["gauge", "Sustained throughput", "Project capacity for large media objects."], ["rotate-ccw", "Recoverable retries", "Resume failed or interrupted downloads."], ["link-2", "Object relationships", "Keep media, captions, audio, and metadata linked."], ["badge-dollar-sign", "Predictable transfer cost", "Unmetered traffic for long-running jobs."]],
    workloadsTitle: ["Built for large objects", "and long download windows"],
    workloadsText: "Treat a complete media object and its related metadata as the unit of success.",
    workloads: [["01", "Public video corpora", "Download public media and descriptive metadata.", "Focus: throughput"], ["02", "Caption and audio corpora", "Keep tracks, captions, and timing aligned.", "Focus: relationships"], ["03", "Short-form media", "Handle high object counts with stable concurrency.", "Focus: concurrency"]],
    workflow: {title: "Manifest first, then a recoverable download queue", text: "Separate discovery, transfer, validation, and storage so one failed object does not block the batch.", steps: [["01", "Build the manifest", "Record source, object ID, and expected files."], ["02", "Allocate target pools", "Plan routing and bandwidth by source."], ["03", "Download with recovery", "Apply timeouts, retries, and range support where available."], ["04", "Validate before storage", "Check files and related metadata."]], flow: [["list-video", "Manifest", "QUEUE"], ["network", "Proxy pool", "ROUTE"], ["hard-drive-download", "Downloaders", "WORKERS"], ["database", "Object storage", "OUTPUT"]], stats: [["Primary proxy", "High bandwidth"], ["Billing", "Unmetered"], ["Success unit", "Complete object"]]},
    evaluationTitle: "Validate complete objects, not peak speed",
    evaluationText: "Measure useful throughput, first-pass success, retry transfer, and final batch completion.",
    evaluationRows: [["Complete objects", "Media and metadata validated together"], ["Useful throughput", "Successfully stored bytes per time"], ["First-pass success", "Objects completed without retry"], ["Retry transfer", "Extra bytes caused by recovery"], ["Relationship integrity", "Media, captions, and metadata remain linked"], ["Batch completion", "Time to finish the planned manifest"]],
    developerTitle: "Use standard proxy parameters in existing downloaders",
    developerText: "Configure yt-dlp, curl, requests, or internal downloaders while keeping manifests, retries, and validation in your task system.",
    developerLabel: "yt-dlp / public media",
    developerCode: `yt-dlp \\
  --proxy "http://user:pass@proxy.123proxy.cn:9000" \\
  --write-info-json \\
  --write-subs \\
  --retries 8 \\
  "https://target.example/public-video"`,
    faqs: [["Does the plan include a video downloader?", "The standard scope is proxy infrastructure. Existing tools or separately scoped engineering services handle download logic."], ["Why unmetered traffic?", "Large objects and retries create sustained transfer that is easier to budget without per-GB accumulation."], ["Is 10Gbps+ a single-file speed?", "No, it is aggregate capacity for one project."], ["Can any platform be downloaded?", "No. Only lawfully accessible public content with a valid use basis may be collected."], ["How are captions and metadata linked?", "Use stable object IDs in the manifest and validate relationships before storage."], ["When is a residential proxy useful?", "For region-specific public discovery pages, not as the default large-object transfer layer."], ["How should a PoC work?", "Test representative media, captions, sizes, retries, and completion time."], ["Is resume supported?", "Only when both the public target and the downloader support range or resume behavior."]],
    cta: ["Validate useful throughput with representative media", "Share object types, sizes, tools, and the required completion window."]
  }),
  image: buildEnglishPage({
    key: "image",
    file: "ai-image-proxy.html",
    name: "Large-Scale Image Data",
    title: "Large-Scale Image Data Scraping Proxy | 123Proxy",
    description: "High-concurrency, unmetered proxy infrastructure for public image datasets with 10Gbps+ per-project capacity.",
    eyebrow: "LARGE-SCALE IMAGE DATA SCRAPING",
    titleLines: ["Make image throughput", "and recovery production-ready"],
    lead: "Collect public training images and image-text pairs with unmetered traffic, 10Gbps+ per-project capacity, and source-specific proxy pools.",
    visual: {label: "image dataset pipeline", status: "workers ready", sources: [["image", "Training images", "IMAGE"], ["scan-text", "Captions", "CAPTION"], ["boxes", "Public labels", "ANNOTATION"], ["file-json-2", "Manifest", "QUEUE"]], route: [["list-checks", "URL list", "MANIFEST"], ["network", "High bandwidth", "PROXY"], ["images", "Downloaders", "WORKERS"]], metrics: [["CAPACITY", "10Gbps+"], ["OBJECTS", "Concurrent"], ["TRAFFIC", "Unmetered"]]},
    overviewTitle: ["At scale, failed objects", "matter more than peak concurrency"],
    overviewText: "Empty files, wrong formats, broken images, and duplicates must be connected to object-level retry and validation.",
    capabilities: [["layers-3", "Large task queues", "Partition manifests by source and batch."], ["gauge", "Concurrent transfer", "Plan connections and aggregate bandwidth."], ["refresh-ccw", "Object-level recovery", "Retry failures without repeating entire batches."], ["badge-check", "File validation", "Check type, dimensions, hashes, and relationships."]],
    workloadsTitle: ["For high object counts", "and continuous recovery"],
    workloadsText: "The proxy layer supplies connectivity while the data pipeline owns decoding, deduplication, and quality.",
    workloads: [["01", "Training image corpora", "Download and validate public image objects.", "Focus: valid objects"], ["02", "Image-text pairs", "Keep captions and images linked by stable IDs.", "Focus: relationships"], ["03", "Evaluation sets", "Incrementally collect and deduplicate themed samples.", "Focus: incremental"]],
    workflow: {title: "Drive downloads from manifests and recovery from validation", text: "Every object should retain source, status, size, type, and hash.", steps: [["01", "Prepare URLs and metadata", "Assign stable IDs and source fields."], ["02", "Allocate pools by source", "Separate queues and connection behavior."], ["03", "Download and validate", "Check status, type, size, and decoding."], ["04", "Retry failed objects", "Recover by reason without repeating the batch."]], flow: [["list-checks", "URL list", "MANIFEST"], ["network", "Proxy pool", "ROUTE"], ["images", "Downloaders", "WORKERS"], ["badge-check", "Validated store", "OUTPUT"]], stats: [["Primary proxy", "High bandwidth"], ["Task model", "URL queue"], ["Success unit", "Valid image"]]},
    evaluationTitle: "Validate the useful object rate",
    evaluationText: "Include broken files, wrong formats, and duplicates in the production metrics.",
    evaluationRows: [["Valid images", "Objects passing format and integrity checks"], ["Useful object rate", "Valid images relative to downloads"], ["Transfer throughput", "Successfully stored image bytes per time"], ["Recovery rate", "Failed objects recovered later"], ["Duplicate rate", "Objects removed by hash or perceptual rules"], ["Relationship rate", "Images correctly linked to captions or labels"]],
    developerTitle: "Connect the downloader; keep quality logic in the pipeline",
    developerText: "Requests, aiohttp, img2dataset, or internal services can use standard proxies while validation remains customer-owned.",
    developerLabel: "Python / image object",
    developerCode: `import requests

proxy = "http://user:pass@proxy.123proxy.cn:9000"
response = requests.get(
    "https://target.example/public-image.jpg",
    proxies={"https": proxy},
    timeout=30,
)
response.raise_for_status()
assert response.headers["content-type"].startswith("image/")`,
    faqs: [["Does the plan include deduplication or moderation?", "No. Standard delivery is proxy infrastructure; quality and content processing remain in the customer pipeline."], ["Why do images need high bandwidth?", "High object counts and recovery traffic create significant aggregate transfer."], ["Does unmetered mean unlimited speed?", "No. Throughput depends on project capacity, targets, workers, and storage."], ["How do we block empty or invalid files?", "Validate status, content type, size, decoding, and hashes."], ["Is img2dataset supported?", "It can be used when configured with supported HTTP(S) proxy settings."], ["How should multiple sources be handled?", "Partition queues by source and validate each source independently."], ["When are residential proxies useful?", "For region-specific discovery pages, not as the default transfer layer."], ["What are the compliance boundaries?", "Collect only lawfully accessible public images and respect intellectual-property, privacy, platform, and legal requirements."]],
    cta: ["Validate useful object rate with a real image list", "Share sources, object counts, average size, tooling, and completion requirements."]
  }),
  code: buildEnglishPage({
    key: "code",
    file: "ai-github-proxy.html",
    name: "Public Code Data",
    title: "Public Code and Repository Data Proxy | 123Proxy",
    description: "Unmetered high-bandwidth proxy infrastructure for public repositories, archives, historical objects, and Code LLM datasets.",
    eyebrow: "PUBLIC CODE DATA SCRAPING",
    titleLines: ["Move public repositories", "into Code LLM datasets reliably"],
    lead: "Synchronize public repositories, archives, history, and large objects with unmetered traffic, 10Gbps+ per-project capacity, and source-specific pools.",
    visual: {label: "public code pipeline", status: "sync ready", sources: [["git-branch", "Public repositories", "REPO"], ["archive", "Source archives", "ARCHIVE"], ["history", "History", "COMMITS"], ["file-code-2", "Source files", "CODE"]], route: [["list-tree", "Repository list", "MANIFEST"], ["network", "High bandwidth", "PROXY"], ["git-fork", "Sync workers", "WORKERS"]], metrics: [["CAPACITY", "10Gbps+"], ["TRANSFER", "Unmetered"], ["PROTOCOL", "Git / HTTP"]]},
    overviewTitle: ["Repository count and", "history depth drive transfer cost"],
    overviewText: "Discovery, archives, history, and large objects have different transfer patterns and should use separate queues.",
    capabilities: [["git-branch", "Repositories and branches", "Track public project identity and default branches."], ["archive", "Archives and history", "Choose current source or full object history."], ["refresh-ccw", "Incremental sync", "Transfer only new or changed objects."], ["shield-check", "Source and license records", "Preserve provenance and public access context."]],
    workloadsTitle: ["For large repository sets", "and continuous incremental sync"],
    workloadsText: "Separate network transfer from parsing, license processing, and deduplication.",
    workloads: [["01", "Public repository mirrors", "Synchronize repositories and source archives.", "Focus: repository success"], ["02", "Historical object research", "Preserve commits, trees, and relationships.", "Focus: completeness"], ["03", "Incremental code corpora", "Schedule only new or changed objects.", "Focus: efficiency"]],
    workflow: {title: "Separate repository discovery from object synchronization", text: "Build a manifest first, then run recoverable repository or object tasks through the proxy layer.", steps: [["01", "Build the public manifest", "Record source, repository, branch, time, and license."], ["02", "Choose archive or Git", "Match the protocol to history requirements."], ["03", "Synchronize with recovery", "Retry at repository or object granularity."], ["04", "Parse and govern", "Handle code cleaning and licensing downstream."]], flow: [["list-tree", "Repository list", "MANIFEST"], ["network", "Proxy pool", "ROUTE"], ["git-fork", "Sync workers", "WORKERS"], ["database", "Code store", "OUTPUT"]], stats: [["Primary proxy", "High bandwidth"], ["Protocols", "Git / HTTP"], ["Success unit", "Repository / object"]]},
    evaluationTitle: "Validate repositories and object completeness",
    evaluationText: "A successful clone alone does not prove references, objects, archives, or large files are complete.",
    evaluationRows: [["Repository success", "Planned public repositories completed"], ["Object completeness", "References, trees, commits, and files present"], ["Useful transfer", "Successfully stored archives and objects"], ["Incremental efficiency", "Changed objects relative to transfer"], ["Recovery success", "Interrupted tasks completed later"], ["License records", "Repositories with source and license metadata"]],
    developerTitle: "Use standard proxies with Git and HTTP clients",
    developerText: "Proxy routing does not replace repository discovery, license analysis, code parsing, or deduplication.",
    developerLabel: "Git / public repository",
    developerCode: `git \\
  -c http.proxy="http://user:pass@proxy.123proxy.cn:9000" \\
  clone \\
  --filter=blob:none \\
  "https://target.example/public/repository.git"`,
    faqs: [["Is this limited to GitHub?", "No. It applies to lawfully accessible public code hosts, archives, and HTTP objects."], ["Can private repositories be collected?", "Only with valid customer authorization and credentials; the service does not bypass access controls."], ["Why unmetered transfer?", "Repository history, archives, large files, and retries create sustained transfer."], ["Archive or Git clone?", "Use archives for current source and Git when history or object relationships are required."], ["Is license processing included?", "No. License analysis, code cleaning, and deduplication remain customer-owned."], ["Does 10Gbps+ apply to one repository?", "No, it is aggregate capacity for one project."], ["How should incremental sync work?", "Persist update times, references, or object IDs and schedule only changes."], ["What provenance should be retained?", "Store source URLs, timestamps, public state, licenses, and processing rules."]],
    cta: ["Validate synchronization with representative repositories", "Share code sources, repository count, history depth, tools, and completion requirements."]
  }),
  text: buildEnglishPage({
    key: "text",
    file: "ai-text-proxy.html",
    name: "Web Text and Documents",
    title: "Public Web Text and Document Scraping Proxy | 123Proxy",
    description: "Proxy infrastructure for public pages, news, forums, blogs, and PDFs using high-bandwidth capacity with residential geo targeting where needed.",
    eyebrow: "WEB TEXT & DOCUMENT SCRAPING",
    titleLines: ["Collect public text and documents", "with scale and geographic control"],
    lead: "Use high-bandwidth proxy infrastructure for public pages and documents, then add geo-targeted residential proxies only where location changes the content.",
    points: ["Pages, PDFs, and documents", "High-bandwidth primary layer", "Residential geo supplement", "Scrapy and browser support"],
    visual: {label: "web corpus pipeline", status: "crawl ready", sources: [["newspaper", "News and blogs", "ARTICLE"], ["messages-square", "Forums", "DISCUSSION"], ["file-text", "Documents", "DOCUMENT"], ["file-type-2", "PDF files", "PDF"]], route: [["list-filter", "URL frontier", "QUEUE"], ["network", "Proxy policy", "ROUTE"], ["braces", "Parsers", "WORKERS"]], metrics: [["PRIMARY", "High bandwidth"], ["GEO", "Residential"], ["OUTPUT", "Structured text"]]},
    strip: [["High bandwidth", "Pages and documents"], ["190+", "Residential locations"], ["SESSION", "Regional continuity"], ["Standard access", "Scrapy and browsers"]],
    overviewTitle: ["Text workloads combine", "discovery, transfer, and parsing"],
    overviewText: "Page count, document size, rendering, and regional differences determine the proxy strategy.",
    capabilities: [["list-filter", "URL scheduling", "Manage sites, sections, and update windows."], ["file-text", "HTML and documents", "Separate pages, PDFs, and public files."], ["map-pinned", "Regional content", "Use residential routing only when geography matters."], ["braces", "Parsing and deduplication", "Extract content and remove repeated documents downstream."]],
    workloadsTitle: ["For distributed sources", "and mixed formats"],
    workloadsText: "High-bandwidth proxies provide scale while residential proxies provide explicit regional identity.",
    workloads: [["01", "News and blog corpora", "Discover, fetch, and extract public articles incrementally.", "Focus: incremental"], ["02", "Forums and discussions", "Preserve topics, pages, and reply structure.", "Focus: relationships"], ["03", "PDFs and documents", "Download files with source and version metadata.", "Focus: completeness"]],
    workflow: {title: "Partition by source, then choose the proxy policy", text: "HTML, browser-rendered pages, and PDFs have different capacity and validation models.", steps: [["01", "Define site boundaries", "Record public sources and allowed collection scope."], ["02", "Select proxy by queue", "Use high bandwidth for scale and residential for geo."], ["03", "Fetch and parse separately", "Route HTML, browsers, and documents to different workers."], ["04", "Deduplicate with provenance", "Store content, source, time, and processing state."]], flow: [["list-filter", "URL frontier", "QUEUE"], ["network", "Proxy policy", "ROUTE"], ["braces", "Parsers", "WORKERS"], ["database", "Text corpus", "OUTPUT"]], stats: [["Primary", "High bandwidth"], ["Geo supplement", "Residential"], ["Success unit", "Valid document"]]},
    recommendation: {title: "Use high bandwidth for scale and residential proxies for explicit geography", text: "Public web and document transfer should start with high-bandwidth proxy IP. Add geo-targeted residential proxy only for location-dependent search or local content.", points: ["Unmetered high-bandwidth transfer", "10Gbps+ per-project capacity", "190+ residential countries and regions", "Residential region and SESSION parameters"], facts: [["Large-scale transfer", "High-bandwidth proxy IP", "Primary page and document pipeline"], ["Geo targeting", "Residential proxy", "Country or region in authentication"], ["Cost model", "Project + traffic", "Separate scale and geo queues"], ["Access", "HTTP(S) / SOCKS", "Scrapy, requests, and browsers"]]},
    evaluationTitle: "Validate useful documents and field completeness",
    evaluationText: "HTTP 200 does not prove useful text; include rendering, parsing, deduplication, and provenance.",
    evaluationRows: [["Useful documents", "Documents passing content and language rules"], ["Fetch success", "URLs returning usable pages or files"], ["Parse success", "Documents with required text and fields"], ["Geo match", "Regional exits matching the requested location"], ["Duplicate rate", "Documents removed by URL or content rules"], ["Provenance", "Documents retaining source, time, and version"]],
    developerTitle: "Use proxy policies by queue in the same collection framework",
    developerText: "Scrapy, requests, and Playwright can share a task system while using different proxy configurations by source and workload.",
    developerLabel: "Python / public document",
    developerCode: `import requests

proxy = "http://user:pass@proxy.123proxy.cn:9000"
response = requests.get(
    "https://target.example/public-document",
    proxies={"http": proxy, "https": proxy},
    timeout=30,
)
response.raise_for_status()`,
    faqs: [["Why not use residential proxies for every text request?", "Large-scale page and document transfer is usually constrained first by bandwidth and total transfer cost."], ["What locations are supported?", "Residential proxy coverage includes 190+ countries and regions, subject to current console availability."], ["What about JavaScript-rendered pages?", "Use browser automation through standard proxies and measure worker CPU, memory, and page completion."], ["Should PDFs and HTML share one queue?", "No. Their sizes, timeouts, and validation behavior differ."], ["Is content parsing included?", "Not in the standard proxy scope. Parsing and quality remain in the customer pipeline."], ["How do we know geo targeting is required?", "Run small regional comparisons and observe content, fields, results, or status differences."], ["How should crawl rate be controlled?", "Configure site-level concurrency, delay, timeout, and retry while respecting applicable terms and boundaries."], ["What provenance should be stored?", "Retain source URL, site, collection time, version, proxy policy, and processing status."]],
    cta: ["Validate the proxy mix with representative public sites", "Share source types, geographic requirements, document scale, framework, and completion needs."]
  }),
  youtubeApi: buildEnglishPage({
    key: "youtubeApi",
    file: "ai-youtube-api.html",
    name: "YouTube Data API",
    title: "YouTube Data API for Metadata, Captions, and Comments | 123Proxy",
    description: "A developer API for public YouTube metadata, captions, comments, asynchronous jobs, webhooks, and optional object-storage delivery.",
    eyebrow: "YOUTUBE DATA API",
    titleLines: ["YouTube data jobs", "through one API"],
    lead: "Submit a video ID or public URL, request metadata, captions, and comments, then receive long-running results through job status, webhooks, or project-scoped object storage.",
    primaryLabel: "Request API access",
    primaryUrl: "../contact.html#service",
    primaryIcon: "key-round",
    secondaryLabel: "View API example",
    secondaryUrl: "#developers",
    secondaryIcon: "braces",
    points: ["REST API and JSON", "Async jobs and webhooks", "Metadata, captions, comments", "S3, OSS, or GCS delivery"],
    nav: [["#overview", "API capability"], ["#workloads", "Workloads"], ["#architecture", "Job architecture"], ["#recommendation", "Product boundary"], ["#evaluation", "Validation"], ["#developers", "API integration"], ["#faq", "FAQ"]],
    section: ["01 / API capability", "02 / Workloads", "03 / Job architecture", "04 / Product boundary", "05 / Validation", "06 / API integration", "07 / FAQ"],
    architectureLabel: "API job architecture",
    faqTitle: "Questions to confirm before production access",
    faqText: "Validate fields, job state, webhooks, and object delivery with representative videos.",
    visual: {
      label: "youtube data job",
      status: "api ready",
      sources: [["video", "Video metadata", "METADATA"], ["captions", "Captions", "SUBTITLES"], ["messages-square", "Comments", "COMMENTS"], ["cloud-upload", "Media files", "OBJECT STORAGE"]],
      route: [["braces", "API request", "REQUEST"], ["list-checks", "Async job", "JOB"], ["send", "Webhook / storage", "DELIVERY"]],
      metrics: [["INTERFACE", "REST / JSON"], ["MODE", "Sync / async"], ["DELIVERY", "Webhook / Storage"]]
    },
    strip: [["REST API", "Structured JSON"], ["ASYNC JOB", "Batch processing"], ["WEBHOOK", "Completion events"], ["S3 / OSS / GCS", "Object delivery"]],
    overviewTitle: ["Manage data jobs,", "not proxy and download clusters"],
    overviewText: "The API wraps public data access, task state, and result delivery. Your application owns input manifests, validation, deduplication, and downstream governance.",
    capabilities: [
      ["braces", "Video metadata", "Request title, description, tags, and available public statistics by video ID or public URL."],
      ["captions", "Captions and transcripts", "Request available caption languages and timing fields, subject to the issued API schema."],
      ["messages-square", "Comments and replies", "Collect public comment threads while preserving available hierarchy and timestamps."],
      ["cloud-upload", "Object-storage delivery", "Deliver project-scoped media objects to S3, OSS, or GCS after format and resolution validation."]
    ],
    workloadsTitle: ["For video knowledge bases,", "multimodal corpora, and research"],
    workloadsText: "Long-running work enters an asynchronous queue that integrates with existing pipelines through job IDs, state, and webhooks.",
    workloads: [
      ["01", "Video knowledge and RAG", "Create traceable documents from public metadata, captions, and source fields.", "Focus: fields and provenance"],
      ["02", "Multimodal datasets", "Keep video, audio, captions, and metadata connected by stable identifiers.", "Focus: object relationships"],
      ["03", "Comment research", "Collect public comments and replies with hierarchy and available time fields.", "Focus: structure"]
    ],
    workflow: {
      title: "Integrate the API as a job state machine",
      text: "Lightweight fields may return quickly, while deeper comments, batches, and media delivery should run asynchronously without blocking application workers.",
      steps: [
        ["01", "Define the job", "Submit a video ID or public URL, requested fields, and delivery settings."],
        ["02", "Authenticate and deduplicate", "Pass the API key in a header and use an idempotency key."],
        ["03", "Poll or receive a webhook", "Persist the job ID and handle running, completed, and failed states."],
        ["04", "Validate the result", "Check fields, object relationships, errors, and storage delivery."]
      ],
      flow: [["braces", "API client", "REQUEST"], ["list-checks", "Job queue", "JOB"], ["server-cog", "Collection service", "WORKERS"], ["send", "Webhook / storage", "DELIVERY"]],
      stats: [["Interface", "REST / JSON"], ["Execution", "Sync / async"], ["Delivery", "Webhook / Storage"]]
    },
    recommendation: {
      title: "Use an API instead of operating YouTube proxy and download infrastructure",
      text: "For teams that need a product interface, the YouTube Data API handles task execution, status, and delivery while customer systems retain business fields and data governance.",
      productName: "YouTube Data API",
      productUrl: "../contact.html#service",
      productLabel: "Request an API key",
      productIcon: "key-round",
      label: "API PRODUCT",
      points: ["Video ID or public URL jobs", "Metadata, caption, and comment fields", "Batch jobs and webhooks", "Project-scoped object storage"],
      facts: [
        ["Authentication", "API key", "Pass through a request header"],
        ["Task mode", "Sync / async", "Separate light queries from long jobs"],
        ["Result format", "JSON / webhook", "Trace state, results, and errors"],
        ["Media delivery", "S3 / OSS / GCS", "Validate format and resolution per project"]
      ]
    },
    evaluationTitle: "Validate job state, field completeness, and delivery",
    evaluationText: "HTTP 200 alone is not enough. Production monitoring should cover job creation, completion, errors, webhook delivery, and storage writes.",
    evaluationRows: [
      ["Job creation", "Requests that pass authentication and return a job ID"],
      ["Job completion", "Tasks completed within the expected window"],
      ["Processing latency", "P50, P95, and tail time by task type"],
      ["Field completeness", "Required metadata, caption, comment, and relationship fields"],
      ["Webhook delivery", "Successful callbacks, retries, and duplicate-event handling"],
      ["Object delivery", "Consistency between media objects, metadata, and job records"]
    ],
    evaluationNote: "Available fields, quotas, media formats, resolutions, response times, and platform availability are subject to the issued API documentation and representative tests.",
    developer: {
      title: "Submit a job, then poll state or receive a webhook",
      text: "This example follows the endpoint shape from the previous 123Proxy page and moves the API key to a request header. Confirm the production path, schema, and callback signature in the issued documentation.",
      label: "Python / async task",
      code: `import requests

response = requests.post(
    "https://api.123proxy.cn/v1/youtube/video",
    headers={"X-API-Key": "YOUR_API_KEY"},
    json={
        "video_id": "VIDEO_ID",
        "features": ["metadata", "subtitles", "comments"],
        "delivery": {
            "webhook_url": "https://collector.example/webhooks/youtube",
            "upload_to": "s3://my-bucket/videos/"
        },
        "idempotency_key": "dataset-2026-0001"
    },
    timeout=30,
)
response.raise_for_status()
job = response.json()
print(job["job_id"], job["status"])`,
      points: ["Pass the API key in a header", "Use an idempotency key", "Persist job IDs, state, and errors"]
    },
    faqs: [
      ["What YouTube data can the API return?", "The previous page covered video metadata, captions or transcripts, and public comments and replies. Available fields, sorting, languages, and pagination are defined by the issued API documentation."],
      ["Which requests are synchronous or asynchronous?", "Light metadata requests may return directly. Deep comments, batches, and media delivery are better handled as asynchronous jobs, subject to the production API schema."],
      ["Can media be delivered to S3, OSS, or GCS?", "The previous page described direct object-storage delivery. Supported storage types, formats, resolutions, credentials, and naming must be validated for the project."],
      ["Do API customers need to operate their own proxies?", "No separate proxy pool is required for this API. 123Proxy wraps data access and task execution; customers still own lawful inputs, validation, storage, and governance."],
      ["How should duplicate jobs and callbacks be handled?", "Use an idempotency key, persist job IDs, and treat webhooks as retryable events. Confirm signing and retry behavior in the issued documentation."],
      ["How do we request an API key and test quota?", "Share the task types, requested fields, volume, delivery method, and completion window with sales to scope a test key and quota."],
      ["How should rate limits or temporary failures be handled?", "Apply exponential backoff based on returned status and errors, cap client concurrency, and log retries. Production quotas and error codes are documented with access."],
      ["What are the compliance boundaries?", "Process only lawfully accessible public content with a valid use basis and follow platform terms, intellectual-property, privacy, and applicable legal requirements."]
    ],
    cta: ["Validate the API with representative video jobs", "Share sample videos, requested fields, daily volume, and webhook or object-storage requirements to request test access."]
  })
};

const labelsByLocale = {
  "zh-CN": {
    home: "首页",
    category: "AI 数据方案",
    primaryHref: highBandwidthUrl,
    secondaryHref: "contact.html#solutions",
    nav: [["#overview", "数据类型"], ["#workloads", "采集任务"], ["#architecture", "运行链路"], ["#recommendation", "推荐代理"], ["#evaluation", "运行指标"], ["#developers", "接入代码"], ["#faq", "常见问题"]],
    section: ["01 / 数据类型", "02 / 采集任务", "03 / 运行链路", "04 / 推荐代理", "05 / 运行指标", "06 / 接入代码", "07 / FAQ"],
    architectureLabel: "Data scraping architecture",
    recommendationLabel: "RECOMMENDED PRODUCT",
    viewProduct: "查看高带宽代理 IP",
    sales: "咨询方案",
    faqTitle: "技术与使用常见问题",
    faqText: "代理选择、工具接入、下载性能、失败重试与数据完整性。",
    code: "接入示例"
  },
  en: {
    home: "Home",
    category: "AI data solutions",
    primaryHref: highBandwidthUrl,
    secondaryHref: "../contact.html#solutions",
    nav: [["#overview", "Bottlenecks"], ["#workloads", "Workloads"], ["#architecture", "Architecture"], ["#recommendation", "Proxy strategy"], ["#evaluation", "Validation"], ["#developers", "Developers"], ["#faq", "FAQ"]],
    section: ["01 / Workload", "02 / Scenarios", "03 / Architecture", "04 / Proxy strategy", "05 / Validation", "06 / Developer access", "07 / FAQ"],
    architectureLabel: "Data scraping architecture",
    recommendationLabel: "RECOMMENDED PRODUCT",
    viewProduct: "View high-bandwidth proxy IP",
    sales: "Contact sales",
    faqTitle: "Questions to answer before production",
    faqText: "Validate workload boundaries, useful throughput, retry behavior, and dataset completeness with representative public targets.",
    code: "Integration example"
  }
};

export function renderSolutionMain(page, { icon, escapeHtml, locale = "zh-CN" }) {
  const t = labelsByLocale[locale];
  const e = escapeHtml;
  const architectureId = "architecture";
  const primaryHref = page.primaryUrl || t.primaryHref;
  const primaryIcon = page.primaryIcon || "gauge";
  const secondaryIcon = page.secondaryIcon || "waypoints";
  const nav = page.nav || t.nav;
  const section = page.section || t.section;
  const architectureLabel = page.architectureLabel || t.architectureLabel;
  const recommendationLabel = page.recommendation.label || t.recommendationLabel;
  const recommendationName = page.recommendation.productName || (locale === "zh-CN" ? "高带宽代理 IP" : "High-bandwidth proxy IP");
  const recommendationUrl = page.recommendation.productUrl || t.primaryHref;
  const recommendationButton = page.recommendation.productLabel || t.viewProduct;
  const recommendationIcon = page.recommendation.productIcon || "gauge";
  const faqTitle = page.faqTitle || t.faqTitle;
  const faqText = page.faqText || t.faqText;
  return `
    <main>
      <section class="hero solution-hero">
        <div class="container hero-inner">
          <div class="hero-copy">
            <div class="hero-breadcrumb"><a href="index.html">${t.home}</a><span>/</span><a href="ai-data.html">${t.category}</a><span>/</span><strong>${e(page.name)}</strong></div>
            <div class="eyebrow">${e(page.eyebrow)}</div>
            <h1>${page.titleLines.map((line) => `<span class="hero-title-line">${e(line)}</span>`).join("")}</h1>
            <p class="hero-lead">${e(page.lead)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${e(primaryHref)}">${icon(primaryIcon)}${e(page.primaryLabel)}</a>
              <a class="btn btn-on-dark" href="${e(page.secondaryUrl)}">${icon(secondaryIcon)}${e(page.secondaryLabel)}</a>
            </div>
            <div class="hero-points">${page.points.map((point) => `<span class="hero-point">${icon("circle-check")}${e(point)}</span>`).join("")}</div>
          </div>
          <div class="hero-visual solution-hero-visual" aria-label="${e(page.visual.label)}">
            <div class="visual-topline"><span>${e(page.visual.label)}</span><span class="visual-live">${e(page.visual.status)}</span></div>
            <div class="solution-console">
              <div class="solution-console-head"><span>${icon("database-zap")}${e(page.name)}</span><small>123Proxy data network</small></div>
              <div class="solution-source-grid">
                ${page.visual.sources.map(([itemIcon, title, meta]) => `<div class="solution-source"><span class="solution-source-icon">${icon(itemIcon)}</span><div><strong>${e(title)}</strong><small>${e(meta)}</small></div></div>`).join("")}
              </div>
              <div class="solution-route">
                ${page.visual.route.map(([itemIcon, title, meta], index) => `${index ? `<span class="solution-route-arrow">${icon("arrow-right")}</span>` : ""}<div class="solution-route-node${index === 1 ? " is-active" : ""}">${icon(itemIcon)}<strong>${e(title)}</strong><small>${e(meta)}</small></div>`).join("")}
              </div>
              <div class="solution-console-metrics">${page.visual.metrics.map(([label, value]) => `<div><span>${e(label)}</span><strong>${e(value)}</strong></div>`).join("")}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="metric-strip"><div class="container metric-strip-inner">${page.strip.map(([value, label]) => `<div class="strip-item"><strong>${e(value)}</strong><span>${e(label)}</span></div>`).join("")}</div></section>

      <div class="product-subnav">
        <div class="container subnav-inner">
          <span class="subnav-name">${e(page.name)}</span>
          <div class="subnav-links">${nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}</div>
        </div>
      </div>

      <section class="section" id="overview">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">${section[0]}</div><h2>${page.overviewTitle.map((line) => `<span class="section-title-line">${e(line)}</span>`).join("")}</h2></div><p>${e(page.overviewText)}</p></div>
          <div class="capability-grid">${page.capabilities.map(([itemIcon, title, text]) => `<article class="capability-item"><div class="capability-icon">${icon(itemIcon)}</div><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join("")}</div>
        </div>
      </section>

      <section class="section section-soft" id="workloads">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">${section[1]}</div><h2>${page.workloadsTitle.map((line) => `<span class="section-title-line">${e(line)}</span>`).join("")}</h2></div><p>${e(page.workloadsText)}</p></div>
          <div class="workload-grid">${page.workloads.map(([index, title, text, meta, href]) => {
            const card = `<article class="workload-card"><span class="workload-index">${e(index)}</span><h3>${e(title)}</h3><p>${e(text)}</p><div class="workload-meta">${e(meta)}</div></article>`;
            return href ? `<a class="solution-card-link" href="${e(href)}">${card}</a>` : card;
          }).join("")}</div>
        </div>
      </section>

      <section class="section" id="${architectureId}">
        <div class="container workflow-layout">
          <div class="workflow-copy">
            <div class="section-kicker">${section[2]}</div>
            <h2>${e(page.workflow.title)}</h2>
            <p>${e(page.workflow.text)}</p>
            <div class="workflow-list">${page.workflow.steps.map(([index, title, text]) => `<div class="workflow-step"><span>${e(index)}</span><div><strong>${e(title)}</strong><p>${e(text)}</p></div></div>`).join("")}</div>
          </div>
          <div class="architecture">
            <div class="architecture-head"><span>${architectureLabel}</span><span>123Proxy network</span></div>
            <div class="architecture-flow">${page.workflow.flow.map(([itemIcon, title, meta]) => `<div class="arch-node">${icon(itemIcon)}<div><strong>${e(title)}</strong><small>${e(meta)}</small></div></div>`).join("")}</div>
            <div class="architecture-foot">${page.workflow.stats.map(([label, value]) => `<div class="arch-stat"><span>${e(label)}</span><strong>${e(value)}</strong></div>`).join("")}</div>
          </div>
        </div>
      </section>

      <section class="section section-soft" id="recommendation">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">${section[3]}</div><h2>${e(page.recommendation.title)}</h2></div><p>${e(page.recommendation.text)}</p></div>
          <div class="solution-product-layout">
            <article class="solution-product-primary">
              <span>${recommendationLabel}</span>
              <h3>${e(recommendationName)}</h3>
              <div class="solution-product-points">${page.recommendation.points.map((point) => `<span>${icon("circle-check")}${e(point)}</span>`).join("")}</div>
              <div class="hero-actions"><a class="btn btn-primary" href="${e(recommendationUrl)}">${icon(recommendationIcon)}${e(recommendationButton)}</a><a class="btn" href="${t.secondaryHref}">${icon("messages-square")}${t.sales}</a></div>
            </article>
            <div class="solution-product-secondary">${page.recommendation.facts.map(([label, value, note]) => `<div><span>${e(label)}</span><strong>${e(value)}</strong><small>${e(note)}</small></div>`).join("")}</div>
          </div>
        </div>
      </section>

      <section class="section" id="evaluation">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">${section[4]}</div><h2>${e(page.evaluationTitle)}</h2></div><p>${e(page.evaluationText)}</p></div>
          <dl class="spec-table">${page.evaluationRows.map(([term, detail]) => `<div class="spec-row"><dt>${e(term)}</dt><dd>${e(detail)}</dd></div>`).join("")}</dl>
          <p class="solution-evaluation-note">${e(page.evaluationNote)}</p>
        </div>
      </section>

      <section class="section section-dark" id="developers">
        <div class="container developer-layout">
          <div class="developer-copy">
            <div class="section-kicker">${section[5]}</div>
            <h2>${e(page.developer.title)}</h2>
            <p>${e(page.developer.text)}</p>
            <div class="developer-points">${page.developer.points.map((point) => `<span class="developer-point">${icon("check")}${e(point)}</span>`).join("")}</div>
          </div>
          <div class="code-window solution-code-window">
            <div class="code-head"><span>${e(page.developer.label)}</span><span>${t.code}</span></div>
            <pre><code>${e(page.developer.code)}</code></pre>
          </div>
        </div>
      </section>

      <section class="section section-soft" id="faq">
        <div class="container faq-layout">
          <div class="faq-intro"><div class="section-kicker">${section[6]}</div><h2>${faqTitle}</h2><p>${faqText}</p></div>
          <div class="faq-list">${page.faqs.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${e(question)}</summary><p>${e(answer)}</p></details>`).join("")}</div>
        </div>
      </section>

      <section class="cta-band">
        <div class="container cta-inner">
          <div><h2>${e(page.cta[0])}</h2><p>${e(page.cta[1])}</p></div>
          <div class="cta-actions"><a class="btn btn-primary" href="${e(primaryHref)}">${icon(primaryIcon)}${e(page.primaryLabel)}</a><a class="btn btn-on-dark" href="${t.secondaryHref}">${icon("messages-square")}${t.sales}</a></div>
        </div>
      </section>
    </main>`;
}
