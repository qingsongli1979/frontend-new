export const englishProducts = {
  highBandwidth: {
    key: "highBandwidth",
    file: "high-bandwidth-proxy.html",
    zhFile: "high-bandwidth-proxy.html",
    name: "High-Bandwidth Proxy IP",
    eyebrow: "AI data collection infrastructure",
    titleLines: ["High-bandwidth proxy IP", "for AI-scale data collection"],
    description: "123Proxy high-bandwidth proxy infrastructure for large-scale AI video, image, code, audio, and public web data collection.",
    lead: "Project-based proxy infrastructure for high-volume video, image, audio, code, and public web data acquisition. Combine unmetered traffic, dedicated capacity, and target-specific proxy pools.",
    points: ["10Gbps+ per-project capacity", "Unmetered traffic", "Custom proxy pools", "24/7 technical support"],
    primaryUrl: "../contact.html#solutions",
    primaryLabel: "Request a capacity plan",
    hero: {
      label: "PROJECT CAPACITY",
      heading: "10Gbps+ aggregate project bandwidth",
      subheading: "Designed around real datasets and completion windows",
      facts: [["TRAFFIC", "Unmetered"], ["PROXY POOL", "Target-specific"], ["PROTOCOL", "HTTP(S) / SOCKS"], ["DELIVERY", "Project-based"]]
    },
    strip: [["10Gbps+", "Per-project capacity"], ["Unmetered", "No per-GB billing"], ["Custom pools", "Built around target sites"], ["24/7", "Enterprise support"]],
    overviewTitle: ["Treat bandwidth, routing, and cost", "as one production system"],
    overviewText: "High-bandwidth proxy projects are designed from actual object sizes, concurrency, target behavior, daily runtime, and delivery deadlines rather than a generic traffic package.",
    capabilities: [
      ["gauge", "Project-scale throughput", "Aggregate capacity can scale beyond 10Gbps for qualified production workloads."],
      ["infinity", "Unmetered traffic", "Avoid per-GB billing for sustained media and large-object downloads."],
      ["network", "Target-specific proxy pools", "Route requests through resources selected for the target sites and data types."],
      ["video", "Multimodal data", "Support video, image, audio, code, document, and public web datasets."],
      ["chart-no-axes-combined", "Capacity planning", "Size workers, connections, retries, and bandwidth against a measurable completion window."],
      ["life-buoy", "Enterprise operations", "Production onboarding, troubleshooting, monitoring guidance, and ongoing support."]
    ],
    purchase: {
      kicker: "02 / Project design",
      title: ["Capacity is scoped from", "the real data workload"],
      text: "Share target sites, data types, expected scale, object sizes, runtime, and delivery deadline. The resulting plan defines proxy pools, aggregate bandwidth, access controls, and rollout stages.",
      label: "PROJECT-BASED DELIVERY",
      heading: "Custom capacity instead of a standard package",
      body: "High-bandwidth proxy IP is not sold from a fixed public package table. It is assessed and delivered as a production data infrastructure project.",
      unit: "10Gbps+",
      unitText: "Aggregate project capacity",
      button: "Request an assessment",
      facts: [["Capacity model", "Aggregate bandwidth"], ["Traffic", "Unmetered"], ["Routing", "Target-specific pools"], ["Commercial model", "Project-based"]],
      guidanceIcon: "calculator",
      guidanceTitle: "Measure useful throughput, not only link speed",
      guidanceText: "Target response time, retry rate, object size, connection reuse, and worker efficiency all affect completed data volume. A capacity test should report successful objects per hour and usable bytes delivered."
    },
    workloadsTitle: ["Built for large objects", "and sustained acquisition"],
    workloadsText: "Use high-bandwidth proxy infrastructure when completion time and sustained transfer volume matter more than rotating through a standard proxy package.",
    workloads: [
      ["01", "Video and audio datasets", "Sustained media downloads for multimodal training, evaluation, and retrieval systems.", "Primary metric: completed media per hour"],
      ["02", "Image and document corpora", "Parallel acquisition of image assets, documents, metadata, and related public resources.", "Primary metric: successful objects and bytes"],
      ["03", "Code and public web archives", "Large repository, documentation, and public web acquisition jobs with controlled routing.", "Primary metric: coverage and completion window"]
    ],
    workflow: {
      title: "Turn a data requirement into measurable proxy capacity",
      text: "Start with a representative workload, validate target behavior, then scale workers and aggregate bandwidth in controlled stages.",
      steps: [
        ["01", "Define the workload", "Provide target sites, data types, expected volume, geography, and delivery deadline."],
        ["02", "Run a representative test", "Measure object size, success rate, response time, retries, and usable throughput."],
        ["03", "Design pools and capacity", "Select routing resources, authentication, worker limits, and aggregate bandwidth."],
        ["04", "Scale with telemetry", "Increase capacity while monitoring useful throughput and target-specific behavior."]
      ],
      stats: [["Commercial model", "Project-based"], ["Traffic", "Unmetered"], ["Capacity", "10Gbps+"]]
    },
    specs: [
      ["Service type", "Enterprise high-bandwidth proxy infrastructure"],
      ["Traffic model", "Unmetered within the agreed project capacity"],
      ["Capacity", "10Gbps+ aggregate bandwidth for qualified projects"],
      ["Proxy resources", "Target-specific pools and routing strategy"],
      ["Protocols", "HTTP(S) / SOCKS, subject to the final design"],
      ["Support", "24/7 enterprise technical support"]
    ],
    developerTitle: "Integrate with standard proxy clients and data workers",
    developerText: "Keep the application on standard proxy protocols while the network plan handles routing, capacity, and proxy resources. Production guidance includes timeouts, retries, connection reuse, and worker scaling.",
    faqs: [
      ["Is high-bandwidth proxy IP a standard package?", "No. It is a project-based service assessed from the target sites, data types, expected scale, and completion window."],
      ["Is traffic metered by GB?", "The project uses an unmetered traffic model within the agreed capacity and service scope."],
      ["What data types are supported?", "Typical workloads include video, audio, images, code, documents, metadata, and other public web data."],
      ["Does 10Gbps+ guarantee that speed from every target?", "No. Effective throughput also depends on target response time, connection behavior, retries, object size, and worker efficiency."],
      ["How should a production test be evaluated?", "Measure successful objects, usable bytes, response time, retry rate, and completed data per hour on representative targets."]
    ],
    ctaTitle: "Plan proxy capacity around the dataset",
    ctaText: "Send the target sites, data types, scale, and delivery window for a production capacity assessment."
  },
  tunnel: {
    key: "tunnel",
    file: "scraping-rotating-proxy.html",
    zhFile: "scraping-rotating-proxy.html",
    name: "Scraping Rotating Proxy",
    eyebrow: "Global rotating proxy",
    titleLines: ["Two proxy pools for", "speed and residential identity"],
    description: "123Proxy scraping rotating proxy with a crawler pool of about 95% residential and 5% datacenter IPs, plus a pure residential pool with SESSION support.",
    lead: "Connect through one fixed gateway and choose between a faster crawler pool or a pure residential pool. Exits are globally random by default; broad region presets are optional when extracting proxies.",
    points: ["Crawler pool: about 95% residential + 5% DC", "100% residential pool", "SESSION on the pure residential pool", "Traffic or concurrency plans"],
    pricingUrl: "pricing.html?product=tunnel",
    hero: {
      label: "TWO GLOBAL POOLS",
      heading: "Crawler pool + pure residential pool",
      subheading: "One gateway, two routing profiles",
      facts: [["CRAWLER", "~95% RES + ~5% DC"], ["PURE RES", "100% residential"], ["LOCATION", "Global random"], ["SESSION", "Pure pool only"]]
    },
    strip: [["2 pools", "Crawler / pure residential"], ["~5% DC", "Faster crawler mix"], ["SESSION", "Pure pool support"], ["Traffic / threads", "Two capacity models"]],
    overviewTitle: ["Choose the proxy pool first,", "then size the request model"],
    overviewText: "The crawler pool usually provides faster public web collection by mixing a small share of datacenter IPs into a residential-majority pool. The pure residential pool keeps residential network identity and supports SESSION.",
    capabilities: [
      ["route", "Crawler mixed pool", "About 95% residential and 5% datacenter IPs for faster general scraping."],
      ["wifi", "Pure residential pool", "A pool containing only residential IP exits."],
      ["timer", "SESSION support", "Use SESSION on the pure residential pool to keep an exit for multi-step requests."],
      ["shuffle", "Global random by default", "Use global random exits directly, or choose Europe and America, North America, Europe, Asia, United States, or Japan and Korea when extracting proxies."],
      ["database", "Traffic plans", "Pay for transferred data when workloads are elastic or project-accounted."],
      ["git-branch", "Concurrency plans", "Pay for in-flight request capacity with unmetered traffic in the plan."]
    ],
    purchase: {
      kicker: "02 / Plans & billing",
      title: ["Pay by transferred traffic", "or concurrent requests"],
      text: "Traffic plans fit variable workloads and measured data budgets. Concurrency plans fit sustained code-driven requests and do not meter transferred GB within the selected thread capacity.",
      label: "STANDARD PACKAGES",
      heading: "Traffic or concurrency",
      body: "Test real response sizes and latency before choosing. Browser pages can consume many concurrent requests for HTML, images, CSS, JavaScript, fonts, and APIs.",
      unit: "2 MODELS",
      unitText: "Traffic GB or concurrent threads",
      button: "View proxy pricing",
      facts: [["Pool choices", "Crawler / pure residential"], ["Exit region", "Global random by default"], ["Traffic option", "Metered by GB"], ["Thread option", "Unmetered traffic"]],
      guidanceIcon: "git-branch",
      guidanceTitle: "One browser page is not one concurrent request",
      guidanceText: "A browser can open 10–20 or more in-flight requests while loading a page. Concurrency packages are usually easier to model for requests, Scrapy, and direct HTTP clients."
    },
    workloadsTitle: ["Best for global random", "code-driven scraping"],
    workloadsText: "Choose this product for globally random exits or broad regional routing through a standard rotating gateway.",
    workloads: [
      ["01", "Public page crawling", "High-frequency list, detail, and search result requests across public sites.", "Start with: crawler mixed pool"],
      ["02", "Residential multi-step requests", "Pagination and short workflows that need a residential exit and SESSION.", "Start with: pure residential pool"],
      ["03", "Sustained request queues", "Long-running code workers using a predictable concurrent request allowance.", "Consider: concurrency plan"]
    ],
    workflow: {
      title: "Connect once and let the gateway rotate exits",
      text: "Select a pool, configure authentication, choose a billing model, and send requests through the fixed gateway.",
      steps: [
        ["01", "Select a proxy pool", "Use the crawler pool for speed or the pure residential pool for residential identity and SESSION."],
        ["02", "Choose billing capacity", "Select traffic GB or concurrent request threads."],
        ["03", "Configure authentication", "Use the assigned gateway, port, username, password, or IP allowlist."],
        ["04", "Monitor requests", "Track response time, success rate, retries, and in-flight requests."]
      ],
      stats: [["Pools", "Mixed / pure residential"], ["Location", "Global random"], ["Billing", "Traffic / threads"]]
    },
    specs: [
      ["Proxy pools", "Crawler mixed pool and pure residential pool"],
      ["Crawler pool", "About 95% residential IPs and 5% datacenter IPs"],
      ["Pure residential pool", "Residential-only exits with SESSION support"],
      ["Exit location", "Global random by default; optional broad presets at extraction"],
      ["Billing", "Traffic packages or concurrent thread packages"],
      ["Protocols", "HTTP(S) / SOCKS"]
    ],
    developerTitle: "Use one fixed gateway instead of maintaining IP lists",
    developerText: "Configure the assigned proxy endpoint in requests, Scrapy, cURL, or another standard HTTP client. The network handles pool selection, health checks, and exit rotation.",
    faqs: [
      ["What is the difference between the two pools?", "The crawler pool mixes about 5% datacenter IPs into a residential-majority pool and is usually faster. The pure residential pool contains only residential IPs and supports SESSION."],
      ["Which locations can I select?", "Exits are globally random by default. When extracting proxies, you may choose Europe and America, North America, Europe, Asia, United States, or Japan and Korea. Country-level and city-level targeting are not supported."],
      ["Which pool supports SESSION?", "SESSION is available on the pure residential pool."],
      ["How do traffic and concurrency plans differ?", "Traffic plans meter transferred GB. Concurrency plans meter in-flight requests and provide unmetered traffic within the selected thread capacity."],
      ["Do I need to maintain a local proxy list?", "No. Applications connect to a fixed gateway while the proxy network selects and rotates exits."]
    ],
    ctaTitle: "Test both pools with representative requests",
    ctaText: "Compare success rate, response time, response size, and concurrency before selecting a production package."
  },
  residential: {
    key: "residential",
    file: "residential-proxy.html",
    zhFile: "residential-proxy.html",
    name: "Residential Rotating Proxy",
    eyebrow: "Geo-targeted residential proxy",
    titleLines: ["80M+ residential IPs", "with country and region targeting"],
    description: "123Proxy residential rotating proxy with 80M+ residential IPs across 190+ countries and regions, country or region targeting, and specified SESSION support.",
    lead: "Route requests through an 80M+ residential IP pool covering 190+ countries and regions. Purchase does not lock a location; choose a country or region and SESSION when extracting proxies. This product is available only on traffic-based packages.",
    points: ["80M+ residential proxy IPs", "190+ countries and regions", "Country / region + SESSION", "Traffic packages only"],
    pricingUrl: "pricing.html?product=residential",
    hero: {
      label: "GEO + SESSION ROUTING",
      heading: "Residential exits matched to each task",
      subheading: "Location and SESSION travel with authentication",
      facts: [["POOL", "80M+ residential IPs"], ["COVERAGE", "190+ locations"], ["TARGETING", "Country / region"], ["BILLING", "Traffic only"]]
    },
    strip: [["80M+", "Residential proxy IPs"], ["190+", "Countries and regions"], ["SESSION", "Sticky residential routing"], ["Traffic", "Only purchase model"]],
    overviewTitle: ["Make location and session", "explicit routing parameters"],
    overviewText: "Use this product when public data tasks require residential network identity and a defined country or region. The residential gateway matches an exit from the requested location and maintains it according to SESSION.",
    capabilities: [
      ["database", "80M+ residential IPs", "A large global residential pool for continuous multi-region data work."],
      ["globe-2", "190+ countries and regions", "Organize collection jobs around the target markets and available locations."],
      ["map-pinned", "Country or region targeting", "Choose the target location when extracting proxies."],
      ["timer", "Specified SESSION", "Keep the same residential exit for pagination and multi-step requests."],
      ["wifi", "Residential network identity", "Requests leave through residential network resources."],
      ["receipt", "Traffic-only purchase", "No concurrency-thread or unlimited-thread package is offered for this product."]
    ],
    purchase: {
      kicker: "02 / Traffic billing",
      title: ["Purchase residential routing", "only by transferred traffic"],
      text: "Choose country, region, and SESSION when extracting proxies. These routing options do not change billing, and all transferred proxy data is counted against the traffic package.",
      label: "TRAFFIC PACKAGE ONLY",
      heading: "Pay by transferred GB",
      body: "There is no concurrency package, unlimited-thread package, or port-based purchase model for this product.",
      unit: "GB",
      unitText: "The only capacity unit",
      button: "View residential pricing",
      facts: [["Purchase model", "Transferred traffic"], ["Location", "Country / region"], ["Session", "Specified SESSION"], ["Resources", "80M+ / 190+ locations"]],
      guidanceIcon: "gauge",
      guidanceTitle: "Estimate packages from real response size",
      guidanceText: "Measure representative successful responses, then combine average bytes, request count, and retry rate. Avoid loading large assets that the data task does not need."
    },
    workloadsTitle: ["For tasks that need", "location-aware residential identity"],
    workloadsText: "The core value is controlled residential geography and session continuity, not globally random rotation.",
    workloads: [
      ["01", "Regional public data research", "Compare public search, trend, and localized content across countries or regions.", "Routing: country / region"],
      ["02", "Ecommerce market collection", "Collect public product, price, stock, and review data with SESSION for pagination.", "Routing: region + SESSION"],
      ["03", "Geographic diversity for AI data", "Organize public data acquisition across multiple markets and languages.", "Routing: multi-region queues"]
    ],
    workflow: {
      title: "Put location and SESSION into proxy authentication",
      text: "The application keeps a standard proxy configuration while the gateway handles residential matching and session routing.",
      steps: [
        ["01", "Choose a location at extraction", "Purchase does not lock a location; select the country or region required by the task."],
        ["02", "Assign a SESSION", "Use a stable identifier for pagination or multi-step workflows."],
        ["03", "Connect to the gateway", "Send requests through the assigned residential endpoint."],
        ["04", "Monitor traffic and results", "Track success rate, response size, retries, and package consumption by location."]
      ],
      stats: [["Pool", "80M+"], ["Coverage", "190+ locations"], ["Billing", "Traffic only"]]
    },
    specs: [
      ["Proxy type", "Dynamic residential proxy"],
      ["Pool size", "80M+ global residential proxy IPs"],
      ["Coverage", "190+ countries and regions"],
      ["Location", "Country or region selected when extracting proxies"],
      ["Session", "Specified SESSION support"],
      ["Billing", "Transferred traffic only"],
      ["Protocols", "HTTP(S) / SOCKS"]
    ],
    developerTitle: "Keep geo and SESSION close to the job definition",
    developerText: "Use standard proxy configuration and encode the target country or region and SESSION in the assigned authentication format. Record traffic, retries, and result quality by location.",
    faqs: [
      ["Which purchase models are available?", "Only traffic-based packages are available. There is no concurrent-thread or port-based unlimited plan."],
      ["Can I target a country or region?", "Yes. Submit the supported location parameter in proxy authentication."],
      ["What does SESSION do?", "SESSION attempts to keep the same residential exit for consecutive requests until the session expires or the exit becomes unavailable."],
      ["Can I target a city or state?", "This page commits only to country or region targeting. Use the locations currently available in the console."],
      ["How is this different from Scraping Rotating Proxy?", "Scraping Rotating Proxy uses mixed or pure-residential pools with broad region presets. Residential Rotating Proxy supports country or region targeting and SESSION, but is purchased only by traffic."]
    ],
    ctaTitle: "Validate the target locations with real URLs",
    ctaText: "Test residential matching, success rate, response size, and SESSION behavior before production rollout."
  },
  unlimitedResidential: {
    key: "unlimitedResidential",
    file: "unlimited-residential-proxy.html",
    zhFile: "unlimited-residential-proxy.html",
    name: "Unlimited Rotating Residential Proxy",
    eyebrow: "Unlimited residential ports",
    titleLines: ["Unlimited traffic and concurrency", "on every residential port"],
    description: "123Proxy unlimited rotating residential proxy with unmetered traffic and unlimited concurrency per port, fixed 3–30 minute rotation, and a package region selected when extracting proxies.",
    lead: "Each port includes unmetered traffic and no concurrent-thread limit. Residential exits rotate on a fixed 3–30 minute cycle. Region selection applies to the package and cannot be configured separately for every port.",
    points: ["Unmetered traffic per port", "Unlimited concurrency per port", "Fixed 3–30 minute rotation", "Region set at package level"],
    pricingUrl: "pricing.html?product=unlimited",
    hero: {
      label: "PORT-BASED RESIDENTIAL",
      heading: "Persistent residential capacity by port",
      subheading: "Package policy controls location and rotation",
      facts: [["PORT", "Unmetered traffic"], ["CONCURRENCY", "Unlimited per port"], ["ROTATION", "Fixed 3–30 min"], ["REGION", "Package-level"]]
    },
    strip: [["Unmetered", "No per-GB billing"], ["Unlimited", "Concurrency per port"], ["3–30 min", "Fixed exit rotation"], ["Package-level", "Shared region setting"]],
    overviewTitle: ["Port-level unlimited use,", "package-level routing policy"],
    overviewText: "Each port carries a workload without GB or thread metering. Bandwidth remains the throughput boundary, while all ports in the package share the selected region and fixed rotation cycle.",
    capabilities: [
      ["infinity", "Unmetered traffic", "Transferred GB is not accumulated within the active port package."],
      ["git-branch", "Unlimited concurrency per port", "The service does not cap in-flight request threads on each port."],
      ["gauge", "5–100Mbps options", "Choose sustained bandwidth according to workers and completion targets."],
      ["refresh-cw", "Fixed 3–30 minute rotation", "Every port rotates its residential exit on the selected fixed cycle."],
      ["map", "Region selected at extraction", "All ports share the package location selected when extracting proxies."],
      ["ethernet-port", "Port-based workload isolation", "Assign ports to projects or worker nodes while keeping package policy consistent."]
    ],
    purchase: {
      kicker: "02 / Plans & capacity",
      title: ["Allocate ports by worker,", "then select sustained bandwidth"],
      text: "Standard packages are purchased by port and period. Count simultaneously active workers, then measure real peak throughput to choose port quantity and bandwidth.",
      label: "PORT-BASED PACKAGE",
      heading: "Purchase by port and period",
      body: "Traffic GB and in-flight threads are not metered. Region and rotation cycle remain package-level controls.",
      unit: "PORT",
      unitText: "Unmetered traffic and unlimited concurrency",
      button: "View port pricing",
      facts: [["Purchase unit", "Ports / service period"], ["Bandwidth", "5–100Mbps"], ["Rotation", "Fixed 3–30 minutes"], ["Region control", "Package-level"]],
      guidanceIcon: "gauge",
      guidanceTitle: "Unlimited use does not mean unlimited throughput",
      guidanceText: "Port bandwidth, target response time, retries, client performance, and page resource volume still determine completed work."
    },
    workloadsTitle: ["For always-on residential", "and bandwidth-heavy tasks"],
    workloadsText: "Port packages are easier to budget when workers stay online, response bodies are large, or browser sessions generate sustained traffic.",
    workloads: [
      ["01", "Browser automation workers", "Assign a residential port to each long-running browser worker.", "Capacity: workers / ports"],
      ["02", "Long-term regional monitoring", "Collect public regional pages without accounting for every transferred GB.", "Capacity: sustained bandwidth"],
      ["03", "Large-response public data", "Use predictable port costs for pages and assets with larger response bodies.", "Capacity: measured throughput"]
    ],
    workflow: {
      title: "Ports carry tasks while residential exits rotate",
      text: "Purchase the package without selecting a region. Choose one package region and a fixed rotation cycle when extracting proxies, then assign ports to workers.",
      steps: [
        ["01", "Set region at extraction", "Choose one supported region for all ports in the package when extracting proxies."],
        ["02", "Choose a rotation cycle", "Select a fixed value between 3 and 30 minutes."],
        ["03", "Assign task ports", "Map ports to projects or workers; each port has unlimited concurrency."],
        ["04", "Monitor bandwidth", "Add ports or bandwidth when sustained utilization approaches the package limit."]
      ],
      stats: [["Per port", "Unmetered / unlimited threads"], ["Rotation", "Fixed 3–30 min"], ["Region", "Package-level"]]
    },
    specs: [
      ["Proxy type", "Rotating residential proxy ports"],
      ["Billing", "Port and service period; unmetered traffic"],
      ["Concurrency", "Unlimited concurrent threads per port"],
      ["Bandwidth", "5–100Mbps package options"],
      ["Region", "Package-level; not configurable separately per port"],
      ["Rotation", "Fixed 3–30 minute exit rotation"],
      ["Protocols", "HTTP(S) / SOCKS"]
    ],
    developerTitle: "Bind each worker to a clearly owned proxy port",
    developerText: "Use standard HTTP(S) or SOCKS proxy configuration. Track the assigned port, package region, rotation cycle, and bandwidth utilization for every production worker.",
    faqs: [
      ["Does unmetered traffic also mean unlimited bandwidth?", "No. Traffic is not billed by GB, but every port has a selected bandwidth specification."],
      ["How often does the IP rotate?", "Each port rotates on the fixed package cycle selected between 3 and 30 minutes."],
      ["Is concurrency limited per port?", "No. Each port has unlimited concurrent threads, although bandwidth and target response still limit throughput."],
      ["Can every port use a different region?", "No. Purchase does not lock a region. The region selected when extracting proxies is shared by all ports in that package."],
      ["Is it suitable for browser automation?", "Yes. Unlimited concurrency per port fits browsers that load HTML, images, CSS, JavaScript, fonts, and APIs in parallel."]
    ],
    ctaTitle: "Turn long-running residential traffic into predictable port cost",
    ctaText: "Estimate active workers, target region, rotation cycle, peak bandwidth, and service period before purchasing."
  },
  staticDatacenter: {
    key: "staticDatacenter",
    file: "static-datacenter-proxy.html",
    zhFile: "static-datacenter-proxy.html",
    name: "Dedicated Static Datacenter Proxy",
    eyebrow: "Dedicated datacenter proxy",
    titleLines: ["A fixed dedicated exit", "for stable long-running systems"],
    description: "123Proxy dedicated static datacenter proxy with fixed exclusive IPs, unmetered traffic, stable 5–10Mbps bandwidth, and HTTP(S) or SOCKS access.",
    lead: "Use a dedicated fixed datacenter IP with unmetered traffic and stable bandwidth for target-system source-IP allowlists, long-running automation, and predictable enterprise system connectivity.",
    points: ["Dedicated fixed IP", "Unmetered traffic", "5–10Mbps", "HTTP(S) / SOCKS"],
    pricingUrl: "pricing.html?product=static-datacenter",
    hero: {
      label: "DEDICATED FIXED ENDPOINT",
      heading: "One exclusive datacenter IP",
      subheading: "Stable for the active service period",
      facts: [["IDENTITY", "Dedicated IP"], ["BANDWIDTH", "5–10Mbps"], ["TRAFFIC", "Unmetered"], ["ROTATION", "None"]]
    },
    strip: [["Dedicated", "Fixed datacenter IP"], ["Unmetered", "No per-GB billing"], ["5–10Mbps", "Stable bandwidth"], ["24/7", "Continuous availability"]],
    overviewTitle: ["Fixed, exclusive, and", "predictable by design"],
    overviewText: "A static datacenter endpoint gives one business system a stable source IP. It is designed for target-system allowlists, environment isolation, long sessions, and consistent network routing rather than frequent IP rotation.",
    capabilities: [
      ["pin", "Fixed dedicated IP", "Keep the same datacenter exit throughout the active service period."],
      ["infinity", "Unmetered traffic", "Do not accumulate transferred GB for long-running tasks."],
      ["gauge", "Stable bandwidth", "Use clear 5–10Mbps endpoint specifications."],
      ["server", "Datacenter performance", "Prioritize predictable connectivity and cost."],
      ["key-round", "Credential authentication", "Connect with the assigned proxy username and password."],
      ["monitor-check", "24/7 operation", "Support production systems and continuous automation."]
    ],
    purchase: {
      kicker: "02 / Purchase model",
      title: ["Configure fixed exits by", "IP quantity and period"],
      text: "Standard packages are purchased by dedicated IP and service period. Purchase does not lock a location; choose from 69 supported locations when extracting proxies.",
      label: "DEDICATED ENDPOINT",
      heading: "Purchase by IP and period",
      body: "Each endpoint maps to one fixed datacenter IP with unmetered traffic during the active package period.",
      unit: "IP",
      unitText: "One dedicated fixed endpoint",
      button: "View static proxy pricing",
      facts: [["Purchase unit", "IP / service period"], ["Bandwidth", "5–10Mbps"], ["Traffic", "Unmetered"], ["Exit policy", "Fixed, no rotation"]],
      guidanceIcon: "calendar-clock",
      guidanceTitle: "Fixed means stable during an active service period",
      guidanceText: "Track endpoint ownership, credentials, purpose, health, and renewal. A fixed endpoint should still have failure handling and renewal controls."
    },
    workloadsTitle: ["For systems that need", "target allowlists and fixed identity"],
    workloadsText: "Choose static datacenter IPs when a stable, auditable source address matters more than residential network identity.",
    workloads: [
      ["01", "Target-system allowlists", "Register a predictable source IP with partner APIs and enterprise services.", "Identity: fixed"],
      ["02", "Long-running automation", "Reduce route changes for persistent browsers and scheduled systems.", "Session: long-lived"],
      ["03", "System-to-system connectivity", "Use an exclusive endpoint for recurring integrations and public service access.", "Operation: 24/7"]
    ],
    workflow: {
      title: "Assign a fixed endpoint to each business system",
      text: "Choose IP quantity and period, then select a supported location when extracting the dedicated endpoint. Connect with the assigned proxy credentials, register the exit IP with target systems when needed, and monitor health and renewal.",
      steps: [
        ["01", "Purchase IP quantity and period", "No location is selected during purchase."],
        ["02", "Receive a dedicated IP", "Get the fixed address, port, and authentication details."],
        ["03", "Register target allowlists", "When required, register the fixed exit IP with partner systems. Proxy access still uses the assigned credentials."],
        ["04", "Monitor and renew", "Track connectivity, latency, endpoint ownership, and service period."]
      ],
      stats: [["Identity", "Fixed dedicated"], ["Traffic", "Unmetered"], ["Bandwidth", "5–10Mbps"]]
    },
    specs: [
      ["Proxy type", "Dedicated static datacenter proxy"],
      ["IP lifecycle", "Fixed during the active service period"],
      ["Billing", "Per IP and service period"],
      ["Traffic", "Unmetered within the package"],
      ["Bandwidth", "5–10Mbps, subject to available package inventory"],
      ["Protocols", "HTTP(S) / SOCKS"],
      ["Authentication", "Assigned proxy username and password"]
    ],
    developerTitle: "Manage fixed endpoints as infrastructure assets",
    developerText: "Store proxy credentials in system configuration, register the source IP where required, and monitor connectivity and renewal. No rotation logic is needed in application code.",
    faqs: [
      ["Does the IP rotate automatically?", "No. The IP remains fixed during the active purchase and renewal period."],
      ["Does unmetered traffic have a bandwidth limit?", "Yes. Unmetered means no per-GB billing; each endpoint still has a bandwidth specification such as 5–10Mbps."],
      ["How is this different from static residential proxy?", "Datacenter proxies prioritize performance, stability, and cost. Static residential proxies also provide residential ISP network identity."],
      ["Can I register the exit IP in a target-system allowlist?", "Yes. The exit remains fixed and can be registered with the target system. Access to the proxy itself still uses the assigned username and password."],
      ["Is it designed for frequent IP changes?", "No. Use a rotating proxy product when the workload requires a large changing IP pool."]
    ],
    ctaTitle: "Give every long-running system a trusted fixed exit",
    ctaText: "Select IP quantity and service period, then choose a supported location when extracting proxies. Free trials are not available."
  },
  staticResidential: {
    key: "staticResidential",
    file: "static-residential-proxy.html",
    zhFile: "static-residential-proxy.html",
    name: "Dedicated Static Residential Proxy",
    eyebrow: "Static ISP residential proxy",
    titleLines: ["Keep one residential ISP identity", "for long-running regional sessions"],
    description: "123Proxy dedicated static residential proxy with exclusive fixed ISP residential IPs, unmetered traffic, long sessions, and 69 supported countries and regions.",
    lead: "Use an exclusive fixed residential ISP IP when a task requires both residential network identity and long-term exit stability. Packages are purchased by IP and service period with unmetered traffic.",
    points: ["Real residential ISP", "Dedicated fixed IP", "Unmetered traffic", "69 supported locations"],
    pricingUrl: "pricing.html?product=static-residential",
    hero: {
      label: "STATIC RESIDENTIAL IDENTITY",
      heading: "One dedicated residential ISP endpoint",
      subheading: "Location identity and IP remain stable",
      facts: [["NETWORK", "Residential ISP"], ["COVERAGE", "Nearly 20 locations"], ["LIFECYCLE", "Fixed by period"], ["TRAFFIC", "Unmetered"]]
    },
    strip: [["Residential ISP", "Real network identity"], ["Long-lived", "No automatic rotation"], ["Unmetered", "Per-IP package"], ["69", "Supported locations"]],
    overviewTitle: ["Residential network identity", "with a fixed dedicated exit"],
    overviewText: "Static residential proxy is not a larger rotating pool. It assigns one residential ISP IP to a business workflow that requires stable location, network type, and long session continuity.",
    capabilities: [
      ["wifi", "Residential ISP network", "Use an exit associated with residential internet service."],
      ["pin", "Long-lived fixed IP", "Keep the same exit throughout the active service period."],
      ["user-check", "Dedicated use", "Assign an exclusive endpoint to a project or worker."],
      ["infinity", "Unmetered traffic", "Do not accumulate transferred GB within the package."],
      ["map-pinned", "69 supported locations", "Choose a supported location when extracting proxies, not when purchasing."],
      ["key-round", "Credential authentication", "Connect with the assigned proxy username and password."]
    ],
    purchase: {
      kicker: "02 / Resource selection",
      title: ["Confirm location and inventory", "before selecting an ISP endpoint"],
      text: "Standard packages are purchased by dedicated residential IP and service period. Purchase does not lock a location; choose from 69 supported locations when extracting proxies.",
      label: "STATIC ISP ENDPOINT",
      heading: "Purchase by residential IP and period",
      body: "Each endpoint is an exclusive residential ISP IP that remains fixed during the active service period with unmetered traffic.",
      unit: "ISP IP",
      unitText: "One dedicated residential endpoint",
      button: "View static residential pricing",
      facts: [["Purchase unit", "ISP IP / service period"], ["Coverage", "Nearly 20 locations"], ["Traffic", "Unmetered"], ["Availability", "Region and ISP inventory"]],
      guidanceIcon: "warehouse",
      guidanceTitle: "Coverage does not guarantee permanent inventory",
      guidanceText: "Choose the location when extracting proxies. ISP and available quantity depend on current resources. Free trials are not available."
    },
    workloadsTitle: ["For stable regional identity", "and continuous residential sessions"],
    workloadsText: "Use static residential endpoints when neither a datacenter identity nor periodic IP rotation is acceptable.",
    workloads: [
      ["01", "Long-term regional research", "Keep public data collection on the same location and residential network environment.", "Identity: residential + fixed"],
      ["02", "Multi-step browser workflows", "Maintain one IP across pagination, filters, and long-running sessions.", "Session: long-lived"],
      ["03", "Dedicated residential access", "Assign an exclusive residential endpoint to a critical project or worker.", "Resource: dedicated IP"]
    ],
    workflow: {
      title: "Bind one residential endpoint to one workflow",
      text: "Confirm location and inventory, receive a dedicated residential IP, assign it to a project, and monitor health and renewal.",
      steps: [
        ["01", "Purchase IP quantity and period", "No location is selected during purchase."],
        ["02", "Receive a dedicated ISP IP", "Get the fixed endpoint, port, and authentication details."],
        ["03", "Bind it to a workflow", "Assign the endpoint to a project, browser, or worker."],
        ["04", "Monitor and renew", "Track connectivity, identity, ownership, and service period."]
      ],
      stats: [["Network", "Residential ISP"], ["Exit", "Long-lived fixed"], ["Resource", "Dedicated IP"]]
    },
    specs: [
      ["Proxy type", "Dedicated long-lived static residential proxy"],
      ["Coverage", "69 supported countries and regions, selected at extraction"],
      ["IP lifecycle", "Fixed during the active service period"],
      ["Billing", "Per residential IP and service period"],
      ["Traffic", "Unmetered within the package"],
      ["Bandwidth", "Typically 5–10Mbps, subject to resource specifications"],
      ["Protocols", "HTTP(S) / SOCKS"]
    ],
    developerTitle: "Treat one fixed ISP endpoint as one persistent identity",
    developerText: "Assign every endpoint to a clear project or worker. Application code does not need SESSION or rotation parameters because the residential IP remains fixed during the service period.",
    faqs: [
      ["How is static residential different from rotating residential?", "Static residential IPs remain fixed during the service period. Rotating residential products change exits and fit broader discovery or elastic collection."],
      ["Can I select a specific ISP?", "Availability depends on the target location and current inventory. Confirm the preferred location and provider on the package page."],
      ["Is every IP dedicated?", "Yes. Static residential endpoints are assigned for exclusive use."],
      ["Will the IP remain after renewal?", "It can usually continue when renewed on time and the resource remains healthy, but production systems should still prepare for endpoint failure or inventory changes."],
      ["Is it suitable for frequent IP changes?", "No. Choose Unlimited Rotating Residential Proxy for fixed-cycle rotation or Residential Rotating Proxy for geo and SESSION routing."]
    ],
    ctaTitle: "Keep a residential identity stable for the whole workflow",
    ctaText: "Check current country, ISP, IP quantity, bandwidth, and service-period inventory before purchasing."
  }
};

export const englishProductOrder = [
  "highBandwidth",
  "tunnel",
  "residential",
  "unlimitedResidential",
  "staticDatacenter",
  "staticResidential"
];
