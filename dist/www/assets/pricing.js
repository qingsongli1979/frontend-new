(function () {
  "use strict";

  const PRICE_API = "/ip/default/offers";
  const CONSOLE_ORIGIN = "https://console.123proxy.cn";
  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
  const isEnglish = document.documentElement.lang === "en";
  const TRIAL_CONTACT_URL = isEnglish ? "../contact.html#service" : "contact.html#service";
  const locale = isEnglish ? "en-US" : "zh-CN";
  const money = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });

  const labels = isEnglish
    ? {
        billing: "Billing model",
        billingHelp: "Choose the unit used by this workload.",
        capacity: "Free trial and plan capacity",
        capacityPaid: "Plan capacity",
        capacityHelp: "Paid prices are loaded live from the 123Proxy backend.",
        duration: "Service period",
        durationHelp: "Longer paid periods apply the current period factor.",
        region: "Exit location",
        regionHelp: "Choose the exit location when extracting proxies, not when purchasing the plan.",
        perMonth: "/ month",
        threads: "threads",
        traffic: "GB",
        ports: "ports",
        ips: "IPs",
        billingSummary: "Billing",
        capacitySummary: "Capacity",
        durationSummary: "Period",
        regionSummary: "Location",
        standardAmount: "Standard amount",
        periodSaving: "Period saving",
        offerSaving: "Offer saving",
        monthlyEquivalent: "Equivalent to ¥{value} / month",
        dailyEquivalent: "One-day package",
        weeklyEquivalent: "One-week package",
        noSaving: "No discount",
        copied: "Configuration link copied",
        copyFailed: "Copy failed. Copy the URL from the browser.",
        reset: "Configuration reset",
        liveReady: "Live prices updated",
        liveError: "Live prices unavailable",
        liveLoading: "Loading live pricing",
        paidUnavailable: "Paid plans could not be loaded. Retry or continue to the console.",
        paidPending: "Loading paid plan",
        freeTrial: "Free trial",
        trialCondition: "Trial condition",
        applyTrial: "Request free trial",
        continuePurchase: "Continue in console",
        trialConsoleNote: "Contact customer service on WeCom to confirm eligibility and activation."
      }
    : {
        billing: "计费方式",
        billingHelp: "按任务实际消耗代理资源的方式选择。",
        capacity: "免费测试与套餐规格",
        capacityPaid: "套餐规格",
        capacityHelp: "付费价格由 123Proxy 后台实时获取。",
        duration: "购买时长",
        durationHelp: "付费套餐会根据购买时长应用当前周期系数。",
        region: "出口地区",
        regionHelp: "购买套餐时无需选择地区，提取代理时再选择出口地区。",
        perMonth: "/ 月",
        threads: "并发线程",
        traffic: "GB",
        ports: "端口",
        ips: "个 IP",
        billingSummary: "计费",
        capacitySummary: "规格",
        durationSummary: "时长",
        regionSummary: "地区",
        standardAmount: "标准金额",
        periodSaving: "时长优惠",
        offerSaving: "套餐优惠",
        monthlyEquivalent: "折合 ¥{value} / 月",
        dailyEquivalent: "1 天短期套餐",
        weeklyEquivalent: "1 周短期套餐",
        noSaving: "无优惠",
        copied: "配置链接已复制",
        copyFailed: "复制失败，请从浏览器地址栏复制",
        reset: "配置已重置",
        liveReady: "实时价格已更新",
        liveError: "实时价格获取失败",
        liveLoading: "正在获取实时价格",
        paidUnavailable: "付费套餐暂时无法加载，请重新获取或前往控制台查看。",
        paidPending: "正在加载付费套餐",
        freeTrial: "免费测试",
        trialCondition: "试用条件",
        applyTrial: "申请免费测试",
        continuePurchase: "前往控制台购买",
        trialConsoleNote: "请联系客户服务企业微信确认测试资格与开通方式。"
      };

  const durations = {
    d: { zh: "1 天", en: "1 day", baseRatio: 1.5 / 30, discount: 1, months: 0 },
    w: { zh: "1 周", en: "1 week", baseRatio: 1.25 / 4, discount: 1, months: 0 },
    m: { zh: "1 个月", en: "1 month", baseRatio: 1, discount: 1, months: 1 },
    "3m": { zh: "3 个月", en: "3 months", baseRatio: 3, discount: 0.9, months: 3 },
    "6m": { zh: "6 个月", en: "6 months", baseRatio: 6, discount: 0.8, months: 6 },
    "12m": { zh: "12 个月", en: "12 months", baseRatio: 12, discount: 0.8, months: 12 }
  };

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

  const products = {
    tunnel: {
      plist: 1,
      icon: "route",
      eyebrow: { zh: "隧道代理", en: "SCRAPING ROTATING PROXY" },
      name: { zh: "隧道代理", en: "Scraping rotating proxy" },
      description: {
        zh: "固定隧道入口，默认全球随机轮转；提取代理时也可选择粗粒度地区，支持按并发线程或按流量购买。",
        en: "Use a fixed tunnel gateway with globally random rotation by default, or choose a broad region when extracting proxies. Purchase by concurrent threads or traffic."
      },
      points: {
        zh: ["默认全球随机", "并发或流量计费", "HTTP(S) / SOCKS"],
        en: ["Global random by default", "Threads or traffic", "HTTP(S) / SOCKS"]
      },
      notice: {
        zh: "默认从全球资源中随机分配出口；提取代理时也可选择欧美、北美、欧洲、亚洲、美国或日韩。爬虫混合池约含 5% 数据中心 IP；纯住宅池支持 SESSION。",
        en: "Exits are globally random by default. When extracting proxies, you may instead choose Europe and America, North America, Europe, Asia, United States, or Japan and Korea. The crawler mixed pool contains about 5% datacenter IPs; the pure residential pool supports SESSION."
      },
      extractionLocation: {
        summary: { zh: "默认全球随机", en: "Global random by default" },
        detail: { zh: "提取时可选：欧美 / 北美 / 欧洲 / 亚洲 / 美国 / 日韩", en: "Optional at extraction: Europe & America / North America / Europe / Asia / US / Japan & Korea" }
      },
      billings: [
        {
          key: "concurrency",
          chargeType: "tunnelIp",
          cindex: 0,
          name: { zh: "按并发线程", en: "Concurrent threads" },
          note: { zh: "不限累计流量", en: "Unlimited accumulated traffic" },
          unit: "threads",
          trial: {
            title: { zh: "5 并发线程", en: "5 concurrent threads" },
            period: { zh: "4 小时", en: "4 hours" },
            note: { zh: "不限流量", en: "Unlimited traffic" }
          },
          tiers: [],
          durations: ["d", "w", "m", "3m", "6m"]
        },
        {
          key: "traffic",
          chargeType: "trafficIp",
          cindex: 1,
          name: { zh: "按流量", en: "Traffic" },
          note: { zh: "按实际代理传输流量扣减", en: "Metered by transferred proxy traffic" },
          unit: "traffic",
          trial: {
            title: { zh: "800MB 流量", en: "800MB traffic" },
            period: { zh: "免费测试额度", en: "Free test allowance" },
            note: { zh: "不限请求数量", en: "Unlimited request count" }
          },
          tiers: [],
          durations: ["m", "3m", "6m"]
        }
      ],
      defaultDuration: "m",
      guide: "/developers/products/scraping-rotating-proxy/"
    },
    residential: {
      plist: 2,
      icon: "wifi",
      eyebrow: "RESIDENTIAL ROTATING PROXY",
      name: { zh: "隧道住宅代理", en: "Residential rotating proxy" },
      description: {
        zh: "8000 万+住宅 IP，覆盖 190+ 国家和地区，支持地区定位与 SESSION，仅按流量购买。",
        en: "80M+ residential IPs across 190+ countries and regions with geo targeting and SESSION, purchased by traffic only."
      },
      points: {
        zh: ["8000 万+住宅 IP", "190+ 国家/地区", "支持 SESSION"],
        en: ["80M+ residential IPs", "190+ locations", "SESSION support"]
      },
      notice: {
        zh: "按实际代理传输流量计费。购买套餐时不选择地区；提取代理时指定国家或地区与 SESSION。",
        en: "Metered by transferred proxy traffic. Do not choose a location at purchase; specify country or region and SESSION when extracting proxies."
      },
      extractionLocation: {
        summary: { zh: "提取时选择国家或地区", en: "Choose country or region at extraction" },
        detail: { zh: "覆盖 190+ 国家和地区，购买套餐时不锁定地区", en: "190+ countries and regions; purchase does not lock a location" }
      },
      billings: [{
        key: "traffic",
        chargeType: "residentialDynamicIp",
        cindex: 0,
        name: { zh: "按流量", en: "Traffic" },
        note: { zh: "仅按实际代理传输流量扣减", en: "Metered by transferred proxy traffic only" },
        unit: "traffic",
        trial: {
          title: { zh: "200MB 流量", en: "200MB traffic" },
          period: { zh: "免费测试额度", en: "Free test allowance" },
          note: { zh: "不限请求数量", en: "Unlimited request count" }
        },
        tiers: [],
        durations: ["m", "3m", "6m", "12m"]
      }],
      defaultDuration: "m",
      guide: "/developers/products/residential-rotating-proxy/"
    },
    unlimited: {
      plist: 4,
      icon: "infinity",
      eyebrow: "UNLIMITED ROTATING RESIDENTIAL",
      name: { zh: "不限量动态住宅", en: "Unlimited rotating residential" },
      description: {
        zh: "按端口和时长购买，每个端口不限并发、不按流量收费，出口 IP 固定 3–30 分钟。",
        en: "Purchase by port and period with unlimited concurrency, no traffic metering, and 3–30 minute exit retention."
      },
      points: {
        zh: ["每端口不限并发", "不限流量", "3–30 分钟轮转"],
        en: ["Unlimited per-port concurrency", "Unlimited traffic", "3–30 minute rotation"]
      },
      notice: {
        zh: "购买套餐时不选择地区；提取代理时为整个套餐选择出口地区，不能为每个端口单独指定。每个端口在设定周期内固定同一出口 IP。",
        en: "Do not choose a location at purchase. Choose one package-wide location when extracting proxies; it cannot be set per port. Each port retains one exit IP for the selected period."
      },
      extractionLocation: {
        summary: { zh: "提取时设置套餐地区", en: "Set the package region at extraction" },
        detail: { zh: "同一套餐的全部端口共享地区，不能逐端口设置", en: "All ports in one package share the same region" }
      },
      billings: [{
        key: "ports",
        chargeType: "durationIp",
        cindex: 0,
        name: { zh: "按端口与时长", en: "Ports and period" },
        note: { zh: "套餐内不按流量计费", en: "No traffic metering within the package" },
        unit: "ports",
        trial: {
          title: { zh: "5 个端口", en: "5 ports" },
          period: { zh: "2 小时", en: "2 hours" },
          note: { zh: "不限流量、不限并发", en: "Unlimited traffic and concurrency" }
        },
        tiers: [],
        durations: ["w", "m", "3m", "6m"]
      }],
      defaultDuration: "m",
      guide: "/developers/products/unlimited-residential-proxy/"
    },
    "static-datacenter": {
      plist: 0,
      icon: "server",
      eyebrow: "STATIC DATACENTER PROXY",
      name: { zh: "长效静态代理", en: "Static datacenter proxy" },
      description: {
        zh: "在有效期内保持固定数据中心出口 IP，适合白名单、自动化与需要稳定来源地址的任务。",
        en: "Keep a fixed datacenter exit throughout the service period for allowlists, automation, and stable source addresses."
      },
      points: {
        zh: ["固定数据中心 IP", "不限流量", "不提供免费测试"],
        en: ["Fixed datacenter IP", "Unlimited traffic", "No free trial"]
      },
      notice: {
        zh: "不提供免费测试。IP 在套餐有效期内保持不变；购买套餐时无需选择地区，提取代理时从支持清单中选择。",
        en: "No free trial is available. The IP remains fixed for the service period; choose a supported location when extracting proxies, not when purchasing."
      },
      extractionLocation: {
        summary: { zh: "提取时选择支持地区", en: "Choose a supported location at extraction" },
        detail: { zh: "购买套餐时无需选择地区", en: "No location selection at purchase" },
        codes: staticDatacenterRegions
      },
      billings: [{
        key: "ips",
        chargeType: "fixedIp",
        cindex: 0,
        name: { zh: "按固定 IP", en: "Fixed IPs" },
        note: { zh: "有效期内保持同一出口", en: "Same exit throughout the period" },
        unit: "ips",
        trial: null,
        tiers: [],
        durations: ["m", "3m", "6m", "12m"]
      }],
      defaultDuration: "m",
      guide: "/developers/products/static-datacenter-proxy/"
    },
    "static-residential": {
      plist: 3,
      icon: "map-pinned",
      eyebrow: "STATIC RESIDENTIAL PROXY",
      name: { zh: "长效静态住宅", en: "Static residential proxy" },
      description: {
        zh: "在有效期内保持固定住宅 ISP 身份，适合长期会话、地区身份验证与稳定住宅出口。",
        en: "Retain a fixed residential ISP identity for persistent sessions, regional verification, and stable residential exits."
      },
      points: {
        zh: ["固定住宅 ISP", "不限流量", "不提供免费测试"],
        en: ["Fixed residential ISP", "Unlimited traffic", "No free trial"]
      },
      notice: {
        zh: "不提供免费测试。固定住宅 IP 在套餐有效期内保持不变；购买套餐时无需选择地区，提取代理时从支持清单中选择。",
        en: "No free trial is available. The residential IP remains fixed for the service period; choose a supported location when extracting proxies, not when purchasing."
      },
      extractionLocation: {
        summary: { zh: "提取时选择支持地区", en: "Choose a supported location at extraction" },
        detail: { zh: "购买套餐时无需选择地区", en: "No location selection at purchase" },
        codes: staticResidentialRegions
      },
      billings: [{
        key: "ips",
        chargeType: "residentialStaticIp",
        cindex: 0,
        name: { zh: "按固定住宅 IP", en: "Fixed residential IPs" },
        note: { zh: "有效期内保持同一住宅身份", en: "Same residential identity throughout the period" },
        unit: "ips",
        trial: null,
        tiers: [],
        durations: ["m", "3m", "6m", "12m"]
      }],
      defaultDuration: "m",
      guide: "/developers/products/static-residential-proxy/"
    }
  };

  const productOrder = ["tunnel", "residential", "unlimited", "static-datacenter", "static-residential"];
  const legacyProducts = { "1": "tunnel", "2": "residential", "4": "unlimited", "0": "static-datacenter", "3": "static-residential" };
  const consoleProducts = {
    tunnel: "tunnel",
    residential: "residential",
    unlimited: "unlimited",
    "static-datacenter": "staticDatacenter",
    "static-residential": "staticResidential"
  };

  function consolePurchaseUrl(productKey) {
    const encodedProduct = encodeURIComponent(productKey || "tunnel");
    const appUrl = LOCAL_HOSTS.has(window.location.hostname)
      ? `${window.location.origin}/console/app/`
      : `${CONSOLE_ORIGIN}/app/`;
    return `${appUrl}#purchase?product=${encodedProduct}`;
  }
  const els = {
    tabs: document.getElementById("pricingProductTabs"),
    eyebrow: document.getElementById("pricingProductEyebrow"),
    name: document.getElementById("pricingProductName"),
    description: document.getElementById("pricingProductDescription"),
    points: document.getElementById("pricingProductPoints"),
    notice: document.getElementById("pricingProductNotice"),
    fields: document.getElementById("pricingConfigFields"),
    summaryProduct: document.getElementById("pricingSummaryProduct"),
    summaryDetails: document.getElementById("pricingSummaryDetails"),
    total: document.getElementById("pricingTotal"),
    originalTotal: document.getElementById("pricingOriginalTotal"),
    monthly: document.getElementById("pricingMonthlyEquivalent"),
    purchase: document.getElementById("pricingPurchaseButton"),
    reset: document.getElementById("pricingReset"),
    copy: document.getElementById("pricingCopyLink"),
    toast: document.getElementById("pricingToast"),
    dataStatus: document.getElementById("pricingDataStatus"),
    dataStatusText: document.getElementById("pricingDataStatusText"),
    retry: document.getElementById("pricingRetry")
  };

  if (!els.tabs || !els.fields) return;

  let apiState = "loading";
  let toastTimer;

  function text(value) {
    return value[isEnglish ? "en" : "zh"];
  }

  function durationText(key) {
    return durations[key][isEnglish ? "en" : "zh"];
  }

  function unitText(unit) {
    return labels[unit];
  }

  function defaultState(productKey) {
    const product = products[productKey];
    return {
      product: productKey,
      billing: product.billings[0].key,
      tier: product.billings[0].trial ? "trial" : 0,
      duration: product.defaultDuration
    };
  }

  function parseState() {
    const params = new URLSearchParams(window.location.search);
    const requestedProduct = params.get("product") || legacyProducts[params.get("plist")] || "tunnel";
    const productKey = products[requestedProduct] ? requestedProduct : "tunnel";
    const next = defaultState(productKey);
    const product = products[productKey];
    const billing = product.billings.find((item) => item.key === params.get("billing"));
    if (billing) next.billing = billing.key;
    const active = product.billings.find((item) => item.key === next.billing);
    const requestedTier = params.get("tier");
    if (requestedTier === "trial" && active.trial) {
      next.tier = "trial";
    } else {
      const tier = Number.parseInt(requestedTier, 10);
      if (Number.isInteger(tier) && tier >= 0) next.tier = tier;
    }
    if (active.durations.includes(params.get("duration"))) next.duration = params.get("duration");
    return next;
  }

  let state = parseState();

  function activeProduct() {
    return products[state.product];
  }

  function activeBilling() {
    return activeProduct().billings.find((item) => item.key === state.billing) || activeProduct().billings[0];
  }

  function activePaidTier() {
    if (state.tier === "trial") return null;
    return activeBilling().tiers[state.tier] || null;
  }

  function ensureValidState() {
    const product = activeProduct();
    if (!product.billings.some((item) => item.key === state.billing)) state.billing = product.billings[0].key;
    const billing = activeBilling();
    if (state.tier === "trial" && !billing.trial) state.tier = 0;
    if (state.tier !== "trial" && apiState === "ready" && !billing.tiers[state.tier]) state.tier = billing.trial ? "trial" : 0;
    if (!billing.durations.includes(state.duration)) state.duration = product.defaultDuration;
  }

  function parseOfferPayload(raw, contentType) {
    if (contentType.includes("json")) {
      const payload = JSON.parse(raw);
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.offers)) return payload.offers;
      if (payload.offers) return [payload.offers];
    }

    try {
      const payload = JSON.parse(raw);
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.offers)) return payload.offers;
    } catch (error) {
      const doc = new DOMParser().parseFromString(raw, "application/xml");
      return [...doc.querySelectorAll("offers")].map((node) => {
        const value = (name) => node.querySelector(name)?.textContent?.trim() || "";
        return {
          id: value("id"),
          chargeType: value("chargeType"),
          amount: value("amount"),
          trafficInGB: value("trafficInGB"),
          price: value("price"),
          discount: value("discount"),
          forAccountIds: value("forAccountIds"),
          interval: value("interval"),
          en: value("en")
        };
      });
    }
    return [];
  }

  function installOffers(offers) {
    const normalized = offers
      .filter((item) => item && item.chargeType && String(item.en) !== "true")
      .filter((item) => !String(item.forAccountIds || "").trim())
      .map((item) => ({
        id: String(item.id || ""),
        chargeType: String(item.chargeType),
        amount: Number(item.amount),
        traffic: Number(item.trafficInGB),
        price: Number(item.price),
        discount: Number(item.discount) > 0.1 && Number(item.discount) < 1 ? Number(item.discount) : 1,
        interval: Number(item.interval)
      }))
      .filter((item) => Number.isFinite(item.amount) && item.amount > 0 && Number.isFinite(item.price));

    let populated = 0;
    productOrder.forEach((productKey) => {
      products[productKey].billings.forEach((billing) => {
        billing.tiers = normalized
          .filter((item) => item.chargeType === billing.chargeType)
          .sort((a, b) => a.price - b.price || a.amount - b.amount);
        if (billing.tiers.length) populated += 1;
      });
    });

    const expected = productOrder.reduce((count, productKey) => count + products[productKey].billings.length, 0);
    if (populated !== expected) throw new Error("Incomplete live price data");
  }

  function setApiStatus(nextState) {
    apiState = nextState;
    els.dataStatus.classList.remove("is-loading", "is-ready", "is-error");
    els.dataStatus.classList.add(`is-${nextState}`);
    els.dataStatusText.textContent = nextState === "ready"
      ? labels.liveReady
      : nextState === "error"
        ? labels.liveError
        : labels.liveLoading;
  }

  async function loadOffers() {
    setApiStatus("loading");
    renderFields();
    try {
      const response = await fetch(PRICE_API, {
        method: "GET",
        mode: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Price API ${response.status}`);
      const raw = await response.text();
      const offers = parseOfferPayload(raw, response.headers.get("content-type") || "");
      installOffers(offers);
      setApiStatus("ready");
      ensureValidState();
      refresh();
    } catch (error) {
      setApiStatus("error");
      state.tier = activeBilling().trial ? "trial" : 0;
      refresh();
    }
  }

  function optionButton(value, title, subtitle, active, action, extraClass) {
    return `<button class="pricing-option${active ? " is-active" : ""}${extraClass ? ` ${extraClass}` : ""}" type="button" data-action="${action}" data-value="${value}" role="radio" aria-checked="${active}">
      <strong>${title}</strong>${subtitle ? `<span>${subtitle}</span>` : ""}
    </button>`;
  }

  function renderTabs() {
    els.tabs.innerHTML = productOrder.map((key) => {
      const product = products[key];
      return `<button class="pricing-product-tab${state.product === key ? " is-active" : ""}" type="button" role="tab" aria-selected="${state.product === key}" data-product="${key}">
        <i data-lucide="${product.icon}" aria-hidden="true"></i><strong>${text(product.name)}</strong>
      </button>`;
    }).join("");
  }

  function renderProductIntro() {
    const product = activeProduct();
    els.eyebrow.textContent = text(product.eyebrow);
    els.name.textContent = text(product.name);
    els.description.textContent = text(product.description);
    els.points.innerHTML = product.points[isEnglish ? "en" : "zh"]
      .map((point) => `<span><i data-lucide="circle-check" aria-hidden="true"></i>${point}</span>`)
      .join("");
    const notice = els.notice.querySelector("p");
    notice.textContent = text(product.notice);
    if (!isEnglish && product.guide) {
      const guideLink = document.createElement("a");
      guideLink.className = "pricing-notice-guide";
      guideLink.href = product.guide;
      guideLink.textContent = "查看接入手册";
      notice.append(" ", guideLink);
    }
  }

  function renderBilling(product) {
    if (product.billings.length === 1) {
      const billing = product.billings[0];
      return `<div class="pricing-single-value"><i data-lucide="badge-check" aria-hidden="true"></i><div><strong>${text(billing.name)}</strong><span>${text(billing.note)}</span></div></div>`;
    }
    return `<div class="pricing-option-grid is-two" role="radiogroup">${product.billings.map((billing) =>
      optionButton(billing.key, text(billing.name), text(billing.note), state.billing === billing.key, "billing")
    ).join("")}</div>`;
  }

  function tierName(tier, unit) {
    return `${money.format(tier.amount)} ${unitText(unit)}`;
  }

  function renderTiers(billing) {
    const trial = billing.trial;
    const trialActive = Boolean(trial) && state.tier === "trial";
    const trialMarkup = trial
      ? `<button class="pricing-option pricing-trial-option${trialActive ? " is-active" : ""}" type="button" data-action="tier" data-value="trial" role="radio" aria-checked="${trialActive}">
          <em>${labels.freeTrial}</em><strong>${text(trial.title)}</strong><span>${text(trial.period)} · ${text(trial.note)}</span>
        </button>`
      : "";
    let paidMarkup = "";
    if (apiState === "loading") {
      paidMarkup = `<div class="pricing-tier-skeleton"></div><div class="pricing-tier-skeleton"></div><div class="pricing-tier-skeleton"></div>`;
    } else if (apiState === "error") {
      paidMarkup = `<div class="pricing-tier-error">${labels.paidUnavailable}</div>`;
    } else {
      paidMarkup = billing.tiers.map((tier, tierIndex) =>
        optionButton(String(tierIndex), tierName(tier, billing.unit), `¥${money.format(tier.price)} ${labels.perMonth}`, state.tier === tierIndex, "tier")
      ).join("");
    }

    return `<div class="pricing-field">
      <div class="pricing-field-label"><h3>${trial ? labels.capacity : labels.capacityPaid}</h3><p>${labels.capacityHelp}</p></div>
      <div class="pricing-tier-grid" role="radiogroup">
        ${trialMarkup}
        ${paidMarkup}
      </div>
    </div>`;
  }

  function renderDurations(billing) {
    if (state.tier === "trial" && billing.trial) {
      return `<div class="pricing-field">
        <div class="pricing-field-label"><h3>${labels.duration}</h3><p>${labels.trialConsoleNote}</p></div>
        <div class="pricing-single-value is-trial"><i data-lucide="flask-conical" aria-hidden="true"></i><div><strong>${text(billing.trial.period)}</strong><span>${text(billing.trial.note)}</span></div></div>
      </div>`;
    }
    return `<div class="pricing-field">
      <div class="pricing-field-label"><h3>${labels.duration}</h3><p>${labels.durationHelp}</p></div>
      <div class="pricing-duration-grid" role="radiogroup">${billing.durations.map((key) => {
        const item = durations[key];
        const badge = item.discount < 1 ? `${Math.round(item.discount * 10)} ${isEnglish ? "/ 10" : "折"}` : "";
        return optionButton(key, durationText(key), badge, state.duration === key, "duration");
      }).join("")}</div>
    </div>`;
  }

  function renderRegion(product) {
    const location = product.extractionLocation;
    const codes = location.codes
      ? `<details class="pricing-region-codes"><summary>${isEnglish ? `View ${location.codes.length} supported countries and regions` : `查看 ${location.codes.length} 个支持国家和地区`}<i data-lucide="chevron-down" aria-hidden="true"></i></summary><div>${location.codes.map((code) => `<span>${locationNames[code][isEnglish ? 1 : 0]}</span>`).join("")}</div></details>`
      : "";
    return `<div class="pricing-field">
      <div class="pricing-field-label"><h3>${labels.region}</h3><p>${labels.regionHelp}</p></div>
      <div class="pricing-single-value"><i data-lucide="map-pinned" aria-hidden="true"></i><div><strong>${text(location.summary)}</strong><span>${text(location.detail)}</span></div></div>
      ${codes}
    </div>`;
  }

  function renderFields() {
    const product = activeProduct();
    const billing = activeBilling();
    els.fields.innerHTML = `
      <div class="pricing-field is-billing-field">
        <div class="pricing-field-label"><h3>${labels.billing}</h3><p>${labels.billingHelp}</p></div>
        ${renderBilling(product)}
      </div>
      ${renderTiers(billing)}
      ${renderDurations(billing)}
      ${renderRegion(product)}`;
    if (window.lucide) window.lucide.createIcons();
  }

  function calculate(tier) {
    const billing = activeBilling();
    const duration = durations[state.duration];
    const standard = tier.price * duration.baseRatio;
    const afterPeriod = standard * duration.discount;
    const total = Math.round(afterPeriod * tier.discount);
    return {
      standard: Math.round(standard),
      periodSaving: Math.round(standard - afterPeriod),
      offerSaving: Math.round(afterPeriod - afterPeriod * tier.discount),
      total,
      monthly: duration.months ? Math.round(total / duration.months) : null
    };
  }

  function summaryRow(term, detail, className) {
    return `<div${className ? ` class="${className}"` : ""}><dt>${term}</dt><dd>${detail}</dd></div>`;
  }

  function renderSummary() {
    const product = activeProduct();
    const billing = activeBilling();
    const tier = activePaidTier();
    const isTrial = state.tier === "trial" && Boolean(billing.trial);
    const capacity = isTrial ? text(billing.trial.title) : tier ? tierName(tier, billing.unit) : labels.paidPending;
    const period = isTrial ? text(billing.trial.period) : durationText(state.duration);
    const rows = [
      summaryRow(labels.billingSummary, text(billing.name)),
      summaryRow(labels.capacitySummary, capacity),
      summaryRow(labels.durationSummary, period),
      summaryRow(labels.regionSummary, text(product.extractionLocation.summary))
    ];

    if (isTrial) {
      rows.push(`<div class="pricing-summary-divider"></div>`);
      rows.push(summaryRow(labels.trialCondition, text(billing.trial.note), "is-saving"));
      els.total.textContent = "0";
      els.originalTotal.textContent = "";
      els.monthly.textContent = labels.trialConsoleNote;
      els.purchase.querySelector("span").textContent = labels.applyTrial;
    } else if (tier) {
      const result = calculate(tier);
      rows.push(`<div class="pricing-summary-divider"></div>`);
      rows.push(summaryRow(labels.standardAmount, `¥${money.format(result.standard)}`, "is-price"));
      rows.push(summaryRow(labels.periodSaving, result.periodSaving ? `−¥${money.format(result.periodSaving)}` : labels.noSaving, "is-saving"));
      rows.push(summaryRow(labels.offerSaving, result.offerSaving ? `−¥${money.format(result.offerSaving)}` : labels.noSaving, "is-saving"));
      els.total.textContent = money.format(result.total);
      els.originalTotal.textContent = result.standard > result.total ? `¥${money.format(result.standard)}` : "";
      if (result.monthly !== null) {
        els.monthly.textContent = labels.monthlyEquivalent.replace("{value}", money.format(result.monthly));
      } else {
        els.monthly.textContent = state.duration === "d" ? labels.dailyEquivalent : labels.weeklyEquivalent;
      }
      els.purchase.querySelector("span").textContent = labels.continuePurchase;
    } else {
      els.total.textContent = "—";
      els.originalTotal.textContent = "";
      els.monthly.textContent = apiState === "error" ? labels.paidUnavailable : labels.liveLoading;
      els.purchase.querySelector("span").textContent = labels.continuePurchase;
    }

    els.summaryProduct.textContent = text(product.name);
    els.summaryDetails.innerHTML = rows.join("");

    const consoleProduct = consoleProducts[state.product] || "tunnel";
    els.purchase.href = isTrial ? TRIAL_CONTACT_URL : consolePurchaseUrl(consoleProduct);
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("product", state.product);
    params.set("billing", state.billing);
    params.set("tier", String(state.tier));
    if (state.tier !== "trial") params.set("duration", state.duration);
    history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }

  function refresh(options) {
    ensureValidState();
    renderTabs();
    renderProductIntro();
    renderFields();
    renderSummary();
    if (!options || options.updateUrl !== false) updateUrl();
    if (window.lucide) window.lucide.createIcons();
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
  }

  els.tabs.addEventListener("click", function (event) {
    const button = event.target.closest("[data-product]");
    if (!button) return;
    state = defaultState(button.dataset.product);
    refresh();
  });

  els.fields.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const value = button.dataset.value;
    if (action === "billing") {
      state.billing = value;
      state.tier = activeBilling().trial ? "trial" : 0;
      state.duration = activeProduct().defaultDuration;
    } else if (action === "tier") {
      state.tier = value === "trial" ? "trial" : Number.parseInt(value, 10);
    } else if (action === "duration") {
      state.duration = value;
    }
    refresh();
  });

  els.reset.addEventListener("click", function () {
    state = defaultState(state.product);
    refresh();
    showToast(labels.reset);
  });

  els.copy.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(labels.copied);
    } catch (error) {
      const input = document.createElement("textarea");
      input.value = window.location.href;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      showToast(copied ? labels.copied : labels.copyFailed);
    }
  });

  els.retry.addEventListener("click", loadOffers);

  window.addEventListener("popstate", function () {
    state = parseState();
    refresh({ updateUrl: false });
  });

  refresh();
  loadOffers();
})();
