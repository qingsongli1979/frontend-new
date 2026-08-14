export const enterpriseOrder = ["overview", "proxy", "data"];

const salesUrl = "contact.html#solutions";

function page(config) {
  return {
    primaryUrl: salesUrl,
    primaryIcon: "messages-square",
    secondaryIcon: "arrow-right",
    ...config
  };
}

export const enterpriseZh = {
  overview: page({
    key: "overview",
    file: "enterprise.html",
    zhFile: "enterprise.html",
    name: "企业服务",
    serviceType: "企业代理与爬虫服务",
    title: "企业代理与爬虫服务 | 123Proxy",
    description: "123Proxy 面向爬虫开发工程师和 AI 数据团队，提供定制代理池、公开数据爬虫服务与 7x24 企业支持。",
    eyebrow: "123PROXY ENTERPRISE",
    titleLines: ["企业代理资源与", "公开数据爬虫服务"],
    lead: "提供定制代理池、10Gbps+ 单项目带宽、公开爬虫项目交付和 7x24 企业服务受理。",
    primaryLabel: "提交项目需求",
    secondaryLabel: "查看定制代理池",
    secondaryUrl: "custom-proxy-pool.html",
    aside: {
      label: "服务范围",
      title: "标准代理、定制代理池与数据交付",
      rows: [
        ["代理资源", "标准产品或定制代理池"],
        ["爬虫系统", "由客户工程团队开发与运行"],
        ["数据交付", "按来源、字段、质量和周期实施"]
      ]
    },
    facts: [["10Gbps+", "企业单项目能力"], ["7x24", "企业服务受理"], ["PoC", "代表性任务验证"], ["公开数据", "明确合规边界"]],
    sectionTitle: "定制代理池、数据爬取与企业支持",
    sectionText: "标准套餐可直接购买；专属资源、项目交付和合同化支持由企业服务承接。",
    offerings: [
      ["network", "01", "定制代理池", "结合代理资源与高带宽能力，按目标、任务规模和完成周期规划配置。", "custom-proxy-pool.html"],
      ["database-zap", "02", "爬虫服务", "围绕依法可访问的公开数据，实施爬取、解析、质量检查与交付。", "data-scraping-service.html"],
      ["shield-check", "03", "支持与治理", "建立服务入口、事件升级、责任边界与合规使用原则。", "#governance"]
    ],
    process: {
      title: "企业项目交付流程",
      text: "从需求与样本开始，完成 PoC、资源配置、上线和生产支持。",
      steps: [
        ["01", "描述真实任务", "目标类型、地区、数据规模、现有技术栈和完成周期。"],
        ["02", "建立代表性 PoC", "用真实请求或样本验证有效吞吐、成功对象和重试成本。"],
        ["03", "冻结方案与边界", "明确资源、交付物、双方责任、支持渠道和上线计划。"],
        ["04", "进入生产与复盘", "按有效产出监控运行，并根据变化调整资源和策略。"]
      ]
    },
    scope: {
      title: "服务范围与客户系统",
      text: "123Proxy 提供约定的代理资源、项目实施和技术支持；客户提供合法任务输入与业务系统。",
      includedLabel: "123Proxy 负责",
      included: ["代理产品与项目资源选型", "代表性任务的 PoC 与容量建议", "约定范围内的项目实施或技术支持", "生产问题升级与资源调整建议"],
      inputLabel: "客户团队负责",
      inputs: ["依法可访问的目标与业务依据", "现有爬虫、下载器、解析和存储系统", "成功对象、质量规则与截止时间", "凭证安全、数据治理与内部审批"],
      facts: [["项目入口", "微信专家咨询"], ["技术协议", "HTTP(S) / SOCKS / API"], ["验收依据", "PoC 与合同"], ["服务时间", "7x24 受理"]]
    },
    matrix: {
      title: "企业项目运行指标",
      text: "按有效产出、完成周期、运行成本与服务响应记录项目结果。",
      headers: ["评估维度", "观察内容", "最终判断"],
      rows: [
        ["有效产出", "成功写入且通过质量规则的数据或对象", "是否达到业务规模"],
        ["完成周期", "计划任务在目标时间窗内的完成比例", "是否满足截止时间"],
        ["运行成本", "失败、超时、重试与额外传输", "是否可持续运行"],
        ["支持过程", "问题记录、升级、变更与复盘", "是否按约定执行"]
      ]
    },
    governance: {
      title: "7x24 服务受理与合规使用",
      text: "企业项目提供 7x24 服务受理；响应目标、支持渠道和升级路径以方案或合同为准。代理与爬虫服务仅用于公开或已授权数据，不得绕过登录、验证码、付费墙或其他访问控制。",
      points: ["7x24 服务受理", "响应目标按合同", "公开或已授权数据", "禁止绕过访问控制"]
    },
    faqs: [
      ["什么时候需要企业服务？", "需要定制资源、项目级带宽、数据交付、专属支持或合同化验收时，建议进入企业服务。标准规格明确的需求可以直接购买代理套餐。"],
      ["企业服务等于托管爬虫吗？", "不等于。代理基础设施、客户自有爬虫系统和爬虫服务是三个不同边界，是否包含程序开发、解析、存储和运维需要逐项确认。"],
      ["7x24 是否代表所有问题立即解决？", "7x24 指企业服务受理。首次响应、技术接手、更新频率与恢复目标由服务等级和合同约定。"],
      ["如何开始评估？", "发送目标类型、地区、规模、技术栈、代表性样本和完成周期，先判断使用标准产品、定制代理池还是爬虫服务。"]
    ],
    cta: ["联系 123Proxy 企业服务", "提交目标类型、规模、地区、技术栈和完成周期，获取代理资源或数据交付方案。"]
  }),

  proxy: page({
    key: "proxy",
    file: "custom-proxy-pool.html",
    zhFile: "custom-proxy-pool.html",
    name: "定制代理池",
    serviceType: "企业定制代理池",
    title: "定制代理池 - 企业代理资源与高带宽能力 | 123Proxy",
    description: "123Proxy 定制代理池整合专属代理资源、不限流量与 10Gbps+ 单项目能力，面向规模化爬虫与 AI 数据任务。",
    eyebrow: "CUSTOM PROXY POOLS",
    titleLines: ["为大规模爬虫任务，", "配置专属代理资源"],
    lead: "按数据来源、地区、出口类型和任务容量配置专属代理池，并提供不限流量与 10Gbps+ 单项目能力。",
    primaryLabel: "评估定制代理池",
    secondaryLabel: "查看高带宽产品",
    secondaryUrl: "high-bandwidth-proxy.html",
    aside: {
      label: "项目能力",
      title: "专属代理资源与高带宽项目能力",
      rows: [
        ["200Gbps+", "全球代理网络总带宽"],
        ["10Gbps+", "企业单项目聚合能力"],
        ["不限流量", "适合大规模持续爬虫任务"]
      ]
    },
    facts: [["定制代理池", "按目标与任务配置"], ["10Gbps+", "单项目聚合能力"], ["不限流量", "高带宽项目模型"], ["PoC", "按有效吞吐扩容"]],
    sectionTitle: "专属代理池、高带宽与生产支持",
    sectionText: "为不同数据来源隔离代理资源，并按持续吞吐配置项目带宽。",
    offerings: [
      ["network", "01", "定制代理池", "按目标类型、出口身份、地区、协议与任务容量配置项目资源。", null],
      ["gauge", "02", "高带宽能力", "面向视频、图片、代码归档和公开文档等高传输任务提供项目聚合能力。", null],
      ["life-buoy", "03", "生产支持", "围绕容量变化、路由调整、问题升级和运行复盘持续支持。", null]
    ],
    process: {
      title: "定制代理池配置流程",
      text: "从目标样本测试到代理池、连接数、工作节点和带宽配置。",
      steps: [
        ["01", "准备任务样本", "提供代表性 URL、对象大小、协议、地区和失败判定。"],
        ["02", "定位链路瓶颈", "分别测量目标、代理、下载节点与存储端的限制。"],
        ["03", "配置池与容量", "确定代理池、连接数、工作节点和项目运行窗口。"],
        ["04", "按产出扩展", "依据成功对象、有效字节和剩余时间调整资源。"]
      ]
    },
    scope: {
      title: "代理基础设施交付范围",
      text: "项目提供代理池、路由、带宽和技术支持；下载器、调度、解析与存储由客户系统运行。",
      includedLabel: "项目能力",
      included: ["按目标与任务配置代理池", "高带宽项目的不限流量模型", "10Gbps+ 单项目聚合能力评估", "PoC、容量建议与生产扩展支持"],
      inputLabel: "客户系统",
      inputs: ["任务队列、调度与重试控制", "下载、断点续传与完整性校验", "工作节点、出口连接与对象存储", "授权依据、数据用途与治理规则"],
      facts: [["网络总带宽", "200Gbps+"], ["企业单项目", "10Gbps+"], ["计费方式", "项目不限流量"], ["交付范围", "代理基础设施"]]
    },
    matrix: {
      title: "代理池与高带宽配置",
      text: "分别配置出口资源、任务隔离、聚合带宽和生产扩展方式。",
      headers: ["项目维度", "定制代理池", "高带宽能力"],
      rows: [
        ["主要目标", "出口资源与任务隔离", "大规模传输与完成周期"],
        ["配置依据", "目标、身份、地区与协议", "对象、并发、节点与存储"],
        ["核心指标", "有效请求与路由稳定性", "有效吞吐与完整对象"],
        ["扩展方式", "调整资源组合和池策略", "增加连接、节点与项目容量"]
      ]
    },
    governance: {
      title: "10Gbps+ 单项目聚合能力",
      text: "10Gbps+ 表示企业单项目聚合能力。实际吞吐由目标、连接、工作节点、对象大小和存储共同决定，并通过代表性任务确认最终配置。",
      points: ["不等于单文件速度", "不等于不限速", "以真实任务 PoC 为准", "生产变更需复盘"]
    },
    faqs: [
      ["200Gbps+ 与 10Gbps+ 有什么区别？", "200Gbps+ 是 123Proxy 全球代理网络总带宽；10Gbps+ 是企业高带宽单项目聚合能力，项目配置以真实任务测试结果为准。"],
      ["不限流量是否代表不限速度？", "不限流量表示项目不按累计 GB 计费；实际速度仍受目标、并发、工作节点、对象大小和存储影响。"],
      ["定制代理池是否包含下载器和数据清洗？", "默认不包含。定制代理池交付网络基础设施，下载器、解析和存储由客户系统负责；需要数据结果时应评估爬虫服务。"],
      ["如何测试定制代理池？", "提供代表性目标、对象大小、地区、技术栈、工作节点与完成周期，并以有效对象和任务完成时间进行验收。"]
    ],
    cta: ["获取定制代理池方案", "提供数据来源、对象规模、地区、工作节点和完成周期，配置代理资源与项目带宽。"]
  }),

  data: page({
    key: "data",
    file: "data-scraping-service.html",
    zhFile: "data-scraping-service.html",
    name: "爬虫服务",
    serviceType: "公开数据爬虫服务",
    title: "企业爬虫服务 - 公开数据项目交付 | 123Proxy",
    description: "123Proxy 面向公开网页、媒体、代码和文档任务，提供需求拆解、爬取实施、质量验收与项目交付。",
    eyebrow: "MANAGED DATA SCRAPING",
    titleLines: ["公开数据爬取、解析", "与结构化交付"],
    lead: "按来源、字段、规模和更新频率实施爬取，交付 JSON、CSV、文件对象或客户指定存储。",
    primaryLabel: "评估爬虫项目",
    secondaryLabel: "查看定制代理池",
    secondaryUrl: "custom-proxy-pool.html",
    aside: {
      label: "交付基础",
      title: "来源、Schema 与交付方式",
      rows: [
        ["来源", "依法可访问的公开数据"],
        ["结构", "字段、对象及其关系"],
        ["交付", "批次、增量或对象存储"]
      ]
    },
    facts: [["公开数据", "来源与用途明确"], ["Schema", "字段和对象定义"], ["质量规则", "完整性与可追溯"], ["交付周期", "批次或持续更新"]],
    sectionTitle: "公开数据爬取、解析与质量交付",
    sectionText: "项目可覆盖来源清单、爬虫程序、结构化解析、失败补采和约定格式交付。",
    offerings: [
      ["list-filter", "01", "需求与来源定义", "确认公开来源、字段、关系、规模、频率、截止时间和禁止范围。", null],
      ["braces", "02", "爬虫开发与解析实施", "围绕目标变化、失败重试、对象下载和结构化解析实施项目。", null],
      ["database", "03", "质量与数据交付", "按完整性、格式、来源记录和业务规则验收批次或增量数据。", null]
    ],
    process: {
      title: "数据项目交付流程",
      text: "确认来源与 Schema 后完成爬虫 PoC、质量基线和批次或增量交付。",
      steps: [
        ["01", "冻结来源与 Schema", "明确页面、对象、字段、关系、格式和更新方式。"],
        ["02", "建立爬虫 PoC", "用代表性样本验证访问、解析、媒体对象与失败场景。"],
        ["03", "确认质量基线", "定义完整性、唯一性、时效、来源追踪与异常规则。"],
        ["04", "批次或增量交付", "按约定周期交付数据，并记录变更、缺口与补采结果。"]
      ]
    },
    scope: {
      title: "交付范围与项目输入",
      text: "123Proxy 实施约定范围内的爬取与交付；客户提供合法用途、字段样本、质量规则和接收方式。",
      includedLabel: "项目可包含",
      included: ["公开来源清单与爬虫策略", "爬虫程序、解析规则与失败重试", "文件对象或结构化数据交付", "质量报告、来源记录与约定补采"],
      inputLabel: "客户需要提供",
      inputs: ["合法、明确的数据用途与来源范围", "字段、关系、样本和业务校验规则", "规模、频率、格式与完成周期", "接收方式、存储环境与内部治理要求"],
      facts: [["常见格式", "JSON / CSV / Files"], ["交付模式", "批次 / 增量"], ["质量依据", "样本与规则"], ["范围依据", "PoC 与合同"]]
    },
    matrix: {
      title: "数据质量与交付指标",
      text: "按完整性、准确性、来源追踪和交付时效记录项目结果。",
      headers: ["验收维度", "检查内容", "交付记录"],
      rows: [
        ["完整性", "字段、对象、关系与目标覆盖", "缺口和补采清单"],
        ["准确性", "类型、格式和业务规则", "异常样本与修正规则"],
        ["可追溯", "来源、爬取时间和任务批次", "来源与版本记录"],
        ["时效性", "批次完成时间或增量延迟", "交付时间与变更说明"]
      ]
    },
    governance: {
      title: "公开或已授权数据",
      text: "爬虫服务不得用于绕过登录、验证码、付费墙、技术访问控制或目标方明确禁止的访问。项目启动前需要确认来源、用途、必要字段和数据保留策略。",
      points: ["公开或已授权来源", "目的与范围限定", "最小必要字段", "不绕过访问控制"]
    },
    faqs: [
      ["爬虫服务与代理产品有什么区别？", "代理产品提供网络出口；爬虫服务围绕来源、字段、程序、质量和交付结果实施项目。客户已有成熟爬虫系统时，通常只需要标准代理产品或定制代理池。"],
      ["可以抓取哪些数据？", "仅限依法可访问的公开数据或客户已获授权的数据，具体来源和用途需在项目评估中确认。"],
      ["可以交付哪些格式？", "常见形式包括 JSON、CSV、文件对象或客户指定的存储路径，最终格式、Schema 和批次方式以项目范围为准。"],
      ["如何验收数据质量？", "通过代表性样本定义完整性、准确性、唯一性、时效性和来源追踪规则，并在 PoC 与正式方案中冻结。"]
    ],
    cta: ["获取数据爬取与交付方案", "提交公开来源、字段样本、规模、频率、格式和完成周期。"]
  })
};

export const enterpriseEn = {
  overview: page({
    primaryUrl: "../contact.html#solutions",
    key: "overview",
    file: "enterprise.html",
    zhFile: "enterprise.html",
    name: "Enterprise Services",
    serviceType: "Enterprise proxy and data scraping services",
    title: "Enterprise Proxy and Data Scraping Services | 123Proxy",
    description: "Enterprise proxy projects, managed public data scraping, and 24/7 service intake for engineering and AI data teams.",
    eyebrow: "123PROXY ENTERPRISE",
    titleLines: ["Turn large data workloads", "into accountable projects"],
    lead: "Start with real targets, scale, and deadlines to decide whether a standard proxy product, custom proxy pool, or managed data service is appropriate.",
    primaryLabel: "Submit project requirements",
    secondaryLabel: "View proxy projects",
    secondaryUrl: "custom-proxy-pool.html",
    aside: {label: "Service choice", title: "Choose the right service for your team's current capabilities", rows: [["Proxy resources", "Product or enterprise project"], ["Collection system", "Built and operated by customer"], ["Data delivery", "Scoped by sources and quality"]]},
    facts: [["10Gbps+", "Per-project capability"], ["24/7", "Enterprise intake"], ["PoC", "Representative validation"], ["Public data", "Explicit use boundary"]],
    sectionTitle: "Three needs, three clear paths",
    sectionText: "Standard products stay standardized. Dedicated resources, implementation, and contracted acceptance enter enterprise services.",
    offerings: [["network", "01", "Custom proxy pools", "Dedicated proxy resources and high-bandwidth capacity planned around targets and deadlines.", "custom-proxy-pool.html"], ["database-zap", "02", "Managed data scraping", "Collection, parsing, quality, and delivery for lawfully accessible public data.", "data-scraping-service.html"], ["shield-check", "03", "Support and governance", "Intake, escalation, responsibility, and responsible-use boundaries.", "#governance"]],
    process: {title: "Plan from a representative workload", text: "Use real targets and deadlines to validate bottlenecks, ownership, and acceptance criteria.", steps: [["01", "Describe the workload", "Targets, locations, scale, stack, and deadline."], ["02", "Build a representative PoC", "Measure useful output, successful objects, and retry cost."], ["03", "Freeze scope and ownership", "Document resources, deliverables, channels, and launch plan."], ["04", "Operate and review", "Monitor useful output and adjust resources as work changes."]]},
    scope: {title: "Clear ownership helps projects launch smoothly", text: "After the PoC, document the resources and services supplied by 123Proxy and the engineering responsibilities retained by the customer.", includedLabel: "123Proxy owns", included: ["Product and resource selection", "PoC and capacity recommendations", "Contracted implementation or support", "Escalation and resource guidance"], inputLabel: "Customer owns", inputs: ["Lawful targets and business purpose", "Existing collector, parser, and storage", "Success rules and deadline", "Credentials and data governance"], facts: [["Contact", "sales@123proxy.cn"], ["Protocols", "HTTP(S) / SOCKS / API"], ["Acceptance", "PoC and contract"], ["Intake", "24/7"]]},
    matrix: {title: "Judge the project by business output", text: "Evaluate useful output, completion windows, operating cost, and support execution.", headers: ["Dimension", "Observe", "Decision"], rows: [["Useful output", "Valid stored data or objects", "Required scale"], ["Completion window", "Planned work completed on time", "Deadline fit"], ["Operating cost", "Failures, retries, and transfer", "Sustainable run"], ["Support process", "Incidents, changes, and reviews", "Contract execution"]]},
    governance: {title: "Clear boundaries for operations and data use", text: "Enterprise projects include 24/7 service intake, with response objectives defined by agreement. Services are for public or authorized data and must not bypass access controls.", points: ["24/7 intake", "Objectives by contract", "Public or authorized data", "No access-control bypass"]},
    faqs: [["When should a workload use enterprise services?", "Use enterprise services for dedicated resources, project capacity, managed delivery, contracted support, or formal acceptance."], ["Is enterprise service a managed crawler?", "Not automatically. Proxy infrastructure, customer collection systems, and managed data delivery are separate scopes."], ["Does 24/7 mean every issue is solved immediately?", "No. It describes intake; response and restoration objectives depend on the service agreement."], ["How do we start?", "Share targets, locations, scale, stack, samples, and deadline."]],
    cta: ["Let a solutions engineer review the real workload", "Share targets, scale, locations, stack, and deadline to identify the correct service path."]
  }),
  proxy: page({
    primaryUrl: "../contact.html#solutions",
    key: "proxy",
    file: "custom-proxy-pool.html",
    zhFile: "custom-proxy-pool.html",
    name: "Custom Proxy Pools",
    serviceType: "Enterprise custom proxy pools",
    title: "Custom Proxy Pools for Enterprise Data Workloads | 123Proxy",
    description: "Custom proxy pools, unmetered traffic, and 10Gbps+ per-project capacity for large scraping and AI data workloads.",
    eyebrow: "ENTERPRISE PROXY PROJECTS",
    titleLines: ["Allocate dedicated proxy resources", "for large data workloads"],
    lead: "Evaluate custom pools and high-bandwidth capacity in one project, planned around targets, identity, location, useful throughput, and deadline.",
    primaryLabel: "Assess a custom pool",
    secondaryLabel: "View high-bandwidth product",
    secondaryUrl: "high-bandwidth-proxy.html",
    aside: {label: "Project capability", title: "Capacity for sustained collection and large data transfer", rows: [["200Gbps+", "Global proxy network bandwidth"], ["10Gbps+", "Enterprise per-project capacity"], ["Unmetered", "Built for sustained data workloads"]]},
    facts: [["Custom pools", "By target and workload"], ["10Gbps+", "Aggregate per project"], ["Unmetered", "Project model"], ["PoC", "Scale by useful output"]],
    sectionTitle: "Combine two capabilities in one project",
    sectionText: "Custom pools address routing and isolation. High bandwidth addresses large objects and completion windows.",
    offerings: [["network", "01", "Custom proxy pools", "Allocate resources by target, identity, location, protocol, and workload.", null], ["gauge", "02", "High-bandwidth capacity", "Project capacity for media, images, code archives, and public documents.", null], ["life-buoy", "03", "Production support", "Capacity changes, routing adjustments, escalation, and review.", null]],
    process: {title: "Plan capacity from useful throughput", text: "Targets, connections, workers, object sizes, and storage all affect completion.", steps: [["01", "Prepare samples", "URLs, object sizes, protocol, location, and failure rules."], ["02", "Locate bottlenecks", "Measure target, proxy, worker, and storage limits."], ["03", "Allocate resources", "Define pools, connections, workers, and run window."], ["04", "Scale from output", "Use completed objects and remaining time to adjust."]]},
    scope: {title: "Proxy projects deliver network infrastructure", text: "Downloaders, scheduling, resume, checks, and storage are customer responsibilities unless managed data delivery is scoped.", includedLabel: "Project capability", included: ["Target-specific proxy pools", "Unmetered high-bandwidth model", "10Gbps+ project assessment", "PoC and production scaling support"], inputLabel: "Customer system", inputs: ["Queues, scheduling, and retries", "Download and integrity checks", "Workers and object storage", "Authorization and data governance"], facts: [["Network total", "200Gbps+"], ["Per project", "10Gbps+"], ["Billing", "Unmetered project"], ["Boundary", "Proxy infrastructure"]]},
    matrix: {title: "Custom proxy pool capability comparison", text: "Evaluate the solution across resources, cost model, and useful output.", headers: ["Dimension", "Custom pool", "High bandwidth"], rows: [["Primary goal", "Routing and isolation", "Transfer and deadline"], ["Configuration", "Target, identity, location", "Objects, workers, storage"], ["Core metric", "Useful requests", "Useful throughput"], ["Scale", "Resource and policy mix", "Connections and workers"]]},
    governance: {title: "Validate project capacity with representative work", text: "10Gbps+ is aggregate project capability. Actual throughput depends on targets, connections, workers, object sizes, and storage.", points: ["Aggregate project capacity", "Workload-driven configuration", "PoC required", "Review production changes"]},
    faqs: [["How do 200Gbps+ and 10Gbps+ differ?", "200Gbps+ is total network bandwidth; 10Gbps+ is an enterprise per-project capability."], ["Does unmetered mean unlimited speed?", "No. It means traffic is not billed by accumulated GB in the project model."], ["Are downloaders included?", "No by default. Proxy projects deliver network infrastructure."], ["How do we test?", "Use representative targets, objects, workers, storage, and deadline."]],
    cta: ["Plan a custom proxy pool from representative work", "Share targets, object scale, workers, and deadline to assess resources and capacity."]
  }),
  data: page({
    primaryUrl: "../contact.html#solutions",
    key: "data",
    file: "data-scraping-service.html",
    zhFile: "data-scraping-service.html",
    name: "Managed Data Scraping",
    serviceType: "Managed public data scraping",
    title: "Managed Public Data Scraping | 123Proxy",
    description: "Source definition, collection, parsing, quality acceptance, and delivery for lawfully accessible public data.",
    eyebrow: "MANAGED DATA SCRAPING",
    titleLines: ["From public data sources", "to accepted delivery"],
    lead: "Define sources, schema, scale, update model, quality, and deadline before deciding whether to build internally or use a managed project.",
    primaryLabel: "Assess a data project",
    secondaryLabel: "View proxy projects",
    secondaryUrl: "custom-proxy-pool.html",
    aside: {label: "Delivery foundation", title: "Define delivery from sources and quality rules", rows: [["Sources", "Lawfully accessible public data"], ["Schema", "Fields, objects, relationships"], ["Delivery", "Batch, incremental, or storage"]]},
    facts: [["Public data", "Explicit source and purpose"], ["Schema", "Fields and objects"], ["Quality", "Complete and traceable"], ["Delivery", "Batch or incremental"]],
    sectionTitle: "Deliver data, not only requests",
    sectionText: "Scope may include source definition, collection, parsing, validation, and agreed delivery.",
    offerings: [["list-filter", "01", "Requirements and sources", "Define public sources, schema, scale, cadence, deadline, and exclusions.", null], ["braces", "02", "Collection and parsing", "Implement collection, retries, object downloads, and structured parsing.", null], ["database", "03", "Quality and delivery", "Accept data by completeness, format, source records, and business rules.", null]],
    process: {title: "Run the project from deliverables", text: "Proxy success is not data success. Collection, parsing, quality, and storage share one acceptance model.", steps: [["01", "Freeze sources and schema", "Pages, objects, fields, relations, and update model."], ["02", "Build a collection PoC", "Validate access, parsing, media, and failures."], ["03", "Agree the quality baseline", "Completeness, validity, timeliness, and traceability."], ["04", "Deliver batches or increments", "Record changes, gaps, and recovery."]]},
    scope: {title: "Both teams define accepted delivery", text: "123Proxy implements the agreed scope; customers own purpose, business meaning, and final governance.", includedLabel: "Project may include", included: ["Public source inventory and strategy", "Collection, parsing, and retries", "Files or structured data delivery", "Quality reports and recovery"], inputLabel: "Customer provides", inputs: ["Lawful purpose and source scope", "Fields, samples, and rules", "Scale, cadence, format, deadline", "Destination and governance requirements"], facts: [["Formats", "JSON / CSV / Files"], ["Mode", "Batch / Incremental"], ["Quality", "Samples and rules"], ["Scope", "PoC and contract"]]},
    matrix: {title: "Data acceptance model", text: "Connect metrics to whether data is usable.", headers: ["Dimension", "Check", "Record"], rows: [["Completeness", "Fields, objects, relationships", "Gaps and recovery"], ["Validity", "Types, format, business rules", "Exceptions and fixes"], ["Traceability", "Source, time, and batch", "Origin and version"], ["Timeliness", "Batch completion or lag", "Delivery and changes"]]},
    governance: {title: "Public or authorized data only", text: "Managed scraping must not bypass authentication, CAPTCHAs, paywalls, or technical access controls. Confirm purpose, fields, and retention before launch.", points: ["Public or authorized", "Purpose limited", "Minimum necessary", "No access-control bypass"]},
    faqs: [["How is this different from proxy products?", "Proxy products provide network access; managed service implements collection, parsing, quality, and delivery."], ["What data can be collected?", "Only lawfully accessible public data or systems the customer is authorized to access."], ["What formats are available?", "Common outputs include JSON, CSV, files, or a customer storage destination."], ["How is quality accepted?", "Define completeness, validity, uniqueness, timeliness, and traceability with representative samples."]],
    cta: ["Define the project with sources and schema", "Share public sources, samples, scale, cadence, format, and deadline."]
  })
};

const labels = {
  "zh-CN": {
    home: "首页",
    category: "企业服务",
    nav: [["enterprise.html", "企业服务总览"], ["custom-proxy-pool.html", "定制代理池"], ["data-scraping-service.html", "爬虫服务"]],
    section: ["服务内容", "交付流程", "服务范围", "运行指标", "支持与合规", "常见问题"],
    serviceLink: "查看详情",
    faqTitle: "企业服务常见问题",
    contact: "微信专家咨询"
  },
  en: {
    home: "Home",
    category: "Enterprise",
    nav: [["enterprise.html", "Overview"], ["custom-proxy-pool.html", "Custom proxy pools"], ["data-scraping-service.html", "Data scraping"]],
    section: ["Service choice", "Project method", "Responsibility", "Acceptance", "Support and governance", "FAQ"],
    serviceLink: "View details",
    faqTitle: "Confirm before starting",
    contact: "Contact page"
  }
};

export function renderEnterpriseMain(pageData, { icon, escapeHtml, locale = "zh-CN" }) {
  const t = labels[locale];
  const e = escapeHtml;
  const pageNav = t.nav.map(([href, label]) => `<a${href === pageData.file ? ' class="is-active" aria-current="page"' : ""} href="${href}">${e(label)}</a>`).join("");
  const offeringMarkup = pageData.offerings.map(([itemIcon, index, title, text, href]) => {
    const content = `<span class="enterprise-offering-icon">${icon(itemIcon)}</span><span class="enterprise-offering-index">${e(index)}</span><h3>${e(title)}</h3><p>${e(text)}</p>${href ? `<span class="enterprise-text-link">${t.serviceLink}${icon("arrow-right")}</span>` : ""}`;
    return href ? `<a class="enterprise-offering" href="${e(href)}">${content}</a>` : `<article class="enterprise-offering">${content}</article>`;
  }).join("");

  return `
    <main class="enterprise-main">
      <section class="enterprise-intro">
        <div class="container">
          <div class="enterprise-breadcrumb"><a href="index.html">${t.home}</a><span>/</span><a href="enterprise.html">${t.category}</a><span>/</span><strong>${e(pageData.name)}</strong></div>
          <div class="enterprise-hero-grid">
            <div class="enterprise-hero-copy">
              <div class="enterprise-eyebrow">${e(pageData.eyebrow)}</div>
              <h1>${pageData.titleLines.map((line) => `<span>${e(line)}</span>`).join("")}</h1>
              <p>${e(pageData.lead)}</p>
              <div class="enterprise-actions">
                <a class="btn btn-primary" href="${e(pageData.primaryUrl)}">${icon(pageData.primaryIcon)}${e(pageData.primaryLabel)}</a>
                <a class="enterprise-secondary-action" href="${e(pageData.secondaryUrl)}">${e(pageData.secondaryLabel)}${icon(pageData.secondaryIcon)}</a>
              </div>
            </div>
            <aside class="enterprise-hero-aside" aria-label="${e(pageData.aside.label)}">
              <span>${e(pageData.aside.label)}</span>
              <h2>${e(pageData.aside.title)}</h2>
              <dl>${pageData.aside.rows.map(([term, detail]) => `<div><dt>${e(term)}</dt><dd>${e(detail)}</dd></div>`).join("")}</dl>
            </aside>
          </div>
          <div class="enterprise-facts">${pageData.facts.map(([value, label]) => `<div><strong>${e(value)}</strong><span>${e(label)}</span></div>`).join("")}</div>
        </div>
        <nav class="enterprise-page-nav" aria-label="${t.category}">
          <div class="container">${pageNav}</div>
        </nav>
      </section>

      <section class="enterprise-section" id="services">
        <div class="container">
          <header class="enterprise-section-head">
            <span>${t.section[0]}</span>
            <div><h2>${e(pageData.sectionTitle)}</h2><p>${e(pageData.sectionText)}</p></div>
          </header>
          <div class="enterprise-offerings">${offeringMarkup}</div>
        </div>
      </section>

      <section class="enterprise-section enterprise-section-soft" id="process">
        <div class="container enterprise-process-layout">
          <header>
            <span>${t.section[1]}</span>
            <h2>${e(pageData.process.title)}</h2>
            <p>${e(pageData.process.text)}</p>
          </header>
          <ol class="enterprise-process-list">${pageData.process.steps.map(([index, title, text]) => `<li><span>${e(index)}</span><div><h3>${e(title)}</h3><p>${e(text)}</p></div></li>`).join("")}</ol>
        </div>
      </section>

      <section class="enterprise-section" id="scope">
        <div class="container">
          <header class="enterprise-section-head">
            <span>${t.section[2]}</span>
            <div><h2>${e(pageData.scope.title)}</h2><p>${e(pageData.scope.text)}</p></div>
          </header>
          <div class="enterprise-scope">
            <article><span>123PROXY</span><h3>${e(pageData.scope.includedLabel)}</h3><ul>${pageData.scope.included.map((item) => `<li>${icon("check")}${e(item)}</li>`).join("")}</ul></article>
            <article><span>CUSTOMER</span><h3>${e(pageData.scope.inputLabel)}</h3><ul>${pageData.scope.inputs.map((item) => `<li>${icon("arrow-right")}${e(item)}</li>`).join("")}</ul></article>
          </div>
          <div class="enterprise-scope-facts">${pageData.scope.facts.map(([label, value]) => `<div><span>${e(label)}</span><strong>${e(value)}</strong></div>`).join("")}</div>
        </div>
      </section>

      <section class="enterprise-section enterprise-section-soft" id="acceptance">
        <div class="container">
          <header class="enterprise-section-head">
            <span>${t.section[3]}</span>
            <div><h2>${e(pageData.matrix.title)}</h2><p>${e(pageData.matrix.text)}</p></div>
          </header>
          <div class="enterprise-table-wrap">
            <table class="enterprise-table">
              <thead><tr>${pageData.matrix.headers.map((header) => `<th>${e(header)}</th>`).join("")}</tr></thead>
              <tbody>${pageData.matrix.rows.map((row) => `<tr>${row.map((cell, index) => `<${index ? "td" : "th"}${index ? "" : ' scope="row"'}>${e(cell)}</${index ? "td" : "th"}>`).join("")}</tr>`).join("")}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="enterprise-governance" id="governance">
        <div class="container">
          <div class="enterprise-governance-copy"><span>${t.section[4]}</span><h2>${e(pageData.governance.title)}</h2><p>${e(pageData.governance.text)}</p></div>
          <div class="enterprise-governance-points">${pageData.governance.points.map((point) => `<span>${icon("check-circle-2")}${e(point)}</span>`).join("")}</div>
        </div>
      </section>

      <section class="enterprise-section enterprise-faq-section" id="faq">
        <div class="container enterprise-faq-layout">
          <header><span>${t.section[5]}</span><h2>${t.faqTitle}</h2></header>
          <div class="enterprise-faq-list">${pageData.faqs.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${e(question)}${icon("plus")}</summary><p>${e(answer)}</p></details>`).join("")}</div>
        </div>
      </section>

      <section class="enterprise-cta">
        <div class="container">
          <div><span>123PROXY ENTERPRISE</span><h2>${e(pageData.cta[0])}</h2><p>${e(pageData.cta[1])}</p></div>
          <div class="enterprise-cta-action"><a class="btn btn-primary" href="${e(pageData.primaryUrl)}">${icon(pageData.primaryIcon)}${e(pageData.primaryLabel)}</a><small>${t.contact}</small></div>
        </div>
      </section>
    </main>`;
}
