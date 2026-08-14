const toast = document.querySelector(".toast");
const breadcrumbCurrent = document.querySelector(".breadcrumb strong");
let toastTimer;

const productCatalog = {
  tunnel: {
    eyebrow: "SCRAPING ROTATING PROXY",
    name: "隧道代理",
    icon: "shuffle",
    description: "固定隧道入口连接全球随机出口，按采集任务选择爬虫混合池或纯住宅池。",
    facts: [
      ["出口范围", "默认全球随机"],
      ["计费方式", "流量 / 并发线程"],
      ["代理池", "混合池 / 纯住宅池"]
    ],
    status: "尚未购买",
    statusClass: "",
    resource: null,
    plans: [
      ["免费测试 1GB", "验证真实目标站点、成功率与接入代码", "申请测试", true, "https://www.123proxy.cn/contact.html?intent=trial#service"],
      ["按流量套餐", "按实际代理传输流量扣减", "选择套餐", false],
      ["按并发线程套餐", "不限流量，按同时在途请求数计费", "选择套餐", false]
    ],
    capabilities: [
      ["network", "双代理池", "爬虫混合池约 95% 住宅 IP；纯住宅池仅包含住宅 IP"],
      ["earth", "全球随机出口", "不指定国家或地区，可选择欧美、北美、欧洲、亚洲、美国、日韩"],
      ["timer-reset", "SESSION", "纯住宅池支持 SESSION 保持出口"],
      ["braces", "协议接入", "支持 HTTP(S)、SOCKS，适合代码直接调用"]
    ]
  },
  residential: {
    eyebrow: "RESIDENTIAL ROTATING PROXY",
    name: "隧道住宅代理",
    icon: "globe-2",
    description: "面向地区定向采集的住宅代理池，支持国家或地区定位与 SESSION。",
    facts: [
      ["住宅 IP 池", "8000 万+"],
      ["覆盖范围", "190+ 国家/地区"],
      ["计费方式", "仅按流量"]
    ],
    status: "正在读取",
    statusClass: "",
    resource: null,
    plans: [
      ["免费测试 1GB", "验证地区、SESSION 与目标站点成功率", "申请测试", true, "https://www.123proxy.cn/contact.html?intent=trial#service"],
      ["标准流量套餐", "从实时套餐中选择所需流量", "购买流量", false],
      ["补充流量包", "不改变当前套餐有效期", "补充流量", false]
    ],
    capabilities: [
      ["map-pinned", "国家与地区定位", "代理使用或提取时选择，不在购买时锁定地区"],
      ["timer-reset", "SESSION", "通过 SESSION 参数在任务期间保持出口"],
      ["database", "住宅代理池", "8000 万+住宅 IP，覆盖 190+ 国家和地区"],
      ["code-2", "开发者接入", "支持主流爬虫框架、HTTP 客户端和浏览器自动化"]
    ]
  },
  unlimited: {
    eyebrow: "UNLIMITED RESIDENTIAL PROXY",
    name: "不限量动态住宅",
    icon: "refresh-cw",
    description: "按端口使用的不限流量动态住宅代理，每个端口不限并发。",
    facts: [
      ["计费单位", "代理端口"],
      ["流量与并发", "均不限制"],
      ["出口轮转", "3-30 分钟"]
    ],
    status: "正在读取",
    statusClass: "",
    resource: null,
    plans: [
      ["免费测试端口", "在真实任务中验证出口轮转与连接稳定性", "申请测试", true, "https://www.123proxy.cn/contact.html?intent=trial#service"],
      ["标准端口套餐", "选择端口数量、套餐等级与购买时长", "购买端口", false],
      ["端口续费", "延长已有端口的套餐有效期", "立即续费", false]
    ],
    capabilities: [
      ["infinity", "不限流量与并发", "每个已购端口不限制累计流量和同时请求数"],
      ["refresh-cw", "固定轮转周期", "每个端口在 3-30 分钟内固定出口后自动轮转"],
      ["map", "套餐级地区", "地区在提取时按套餐统一设置，不能为每个端口单独设置"],
      ["browser", "浏览器友好", "不按请求线程计费，适合页面资源较多的浏览器任务"]
    ]
  },
  staticDatacenter: {
    eyebrow: "STATIC DATACENTER PROXY",
    name: "长效静态代理",
    icon: "server",
    description: "独享固定数据中心 IP，适合需要长期稳定出口和固定身份的采集任务。",
    facts: [
      ["计费单位", "独享 IP"],
      ["出口类型", "数据中心"],
      ["免费测试", "不提供"]
    ],
    status: "正在读取",
    statusClass: "",
    resource: null,
    plans: [
      ["按 IP 购买", "选择 IP 数量与购买时长，地区在提取时决定", "选择套餐", true],
      ["套餐续费", "延长已购买静态 IP 的有效期", "立即续费", false]
    ],
    capabilities: [
      ["pin", "独享固定出口", "IP 分配后在套餐有效期内保持不变"],
      ["map-pinned", "多国家和地区", "购买不锁定地区，提取时根据实时库存选择"],
      ["key-round", "账密认证", "提取后获得固定代理地址与独立认证信息"],
      ["radio-tower", "稳定连接", "适合固定账号、长期会话与稳定出口任务"]
    ]
  },
  staticResidential: {
    eyebrow: "STATIC RESIDENTIAL PROXY",
    name: "长效静态住宅",
    icon: "house-plug",
    description: "独享住宅 ISP IP，在套餐有效期内保持固定住宅网络身份。",
    facts: [
      ["计费单位", "独享 IP"],
      ["出口类型", "住宅 ISP"],
      ["免费测试", "不提供"]
    ],
    status: "正在读取",
    statusClass: "",
    resource: null,
    plans: [
      ["按 IP 购买", "选择 IP 数量与购买时长，地区在提取时决定", "选择套餐", true],
      ["套餐续费", "延长已购买静态住宅 IP 的有效期", "立即续费", false]
    ],
    capabilities: [
      ["house", "住宅 ISP 属性", "出口由住宅网络运营商提供并保持固定"],
      ["pin", "长期固定身份", "适合需要固定住宅出口的账号与会话任务"],
      ["map-pinned", "多地区库存", "在代理提取时选择国家或地区"],
      ["key-round", "仅账密认证", "提取后使用独立代理用户名和密码接入"]
    ]
  },
  bandwidth: {
    eyebrow: "HIGH-BANDWIDTH PROXY",
    name: "高带宽代理 IP",
    icon: "gauge",
    description: "面向 AI 数据下载、视频、图片与代码采集任务的不限流量定制代理池。",
    facts: [
      ["单项目带宽", "10Gbps+"],
      ["计费方式", "项目制"],
      ["代理资源", "定制代理池"]
    ],
    status: "获取方案",
    statusClass: "",
    resource: null,
    cta: "获取带宽方案",
    plans: [
      ["定制代理项目", "根据目标站点、并发、区域和任务规模配置资源", "联系方案", true]
    ],
    capabilities: [
      ["gauge", "10Gbps+ 单项目带宽", "根据任务规模提供可扩展的项目级带宽"],
      ["infinity", "不限流量", "面向大文件与持续采集任务，不按累计流量限制"],
      ["network", "定制代理池", "根据目标站点与采集策略定制代理资源"],
      ["headphones", "企业技术支持", "提供接入评估、容量规划与 7x24 技术支持"]
    ]
  }
};

function renderIcons() {
  if (!window.lucide) return;
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 1.75
    }
  });
}

function showToast(message) {
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function markActiveNav(activeItem) {
  document.querySelectorAll(".side-nav .nav-item").forEach((item) => {
    item.classList.toggle("is-active", item === activeItem);
    item.removeAttribute("aria-current");
  });
  if (activeItem) activeItem.setAttribute("aria-current", "page");
}

function showPanel(panelName, label) {
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    const isActive = panel.dataset.viewPanel === panelName;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = label;
  document.body.classList.remove("is-menu-open");
  window.scrollTo({ top: 0, behavior: "auto" });
}

function resourceMarkup(product) {
  if (!product.resource) {
    return `
      <div class="empty-product-resource">
        <span><i data-lucide="${product.icon}" aria-hidden="true"></i></span>
        <h3>当前账户尚无可用${product.name}套餐</h3>
        <p>${product.cta ? "提交任务需求后由客户经理配置资源" : "选择免费测试或标准套餐后即可开始配置代理"}</p>
      </div>`;
  }

  return `
    <div class="current-resource-card">
      <div><small>套餐</small><strong>${product.resource.package}</strong></div>
      <div><small>可用资源</small><strong>${product.resource.available}</strong></div>
      <div><small>有效期</small><strong>${product.resource.expiry}</strong></div>
      <button class="button-mini is-primary" type="button" data-toast="进入${product.name}使用与配置">${product.resource.action}</button>
    </div>`;
}

function renderProduct(productKey) {
  if (window.ConsoleProducts?.open) {
    window.ConsoleProducts.open(productKey);
    showPanel("product", productCatalog[productKey]?.name || "代理产品");
    return;
  }

  const product = productCatalog[productKey];
  if (!product) return;

  document.querySelector("#productTitle").textContent = product.name;
  document.querySelector("#productDescription").textContent = product.description;

  product.facts.forEach((fact, index) => {
    const number = ["One", "Two", "Three"][index];
    document.querySelector(`#productFact${number}Label`).textContent = fact[0];
    document.querySelector(`#productFact${number}`).textContent = fact[1];
  });

  document.querySelector("#currentProductResource").innerHTML = `
    <div class="product-state">
      <span class="loading-spinner" aria-hidden="true"></span>
      <strong>正在加载${product.name}套餐</strong>
      <small>读取真实套餐余量和有效期</small>
    </div>`;
  document.querySelector("#productResourceDescription").textContent = "正在读取当前账户的有效套餐";
  document.querySelector("#purchasePanelTitle").textContent = product.cta || `购买${product.name}`;

  const primaryAction = document.querySelector("#productPrimaryAction");
  const primaryLabel = product.cta || "购买套餐";
  primaryAction.innerHTML = `<i data-lucide="${product.cta ? "messages-square" : "shopping-cart"}" aria-hidden="true"></i>${primaryLabel}`;
  primaryAction.dataset.toast = `${primaryLabel}：${product.name}`;

  document.querySelector("#purchaseOptionList").innerHTML = product.plans.map((plan) => `
    <div class="purchase-option${plan[3] ? " is-primary" : ""}${product.cta ? " is-enterprise" : ""}">
      <div><strong>${plan[0]}</strong><small>${plan[1]}</small></div>
      ${plan[4]
        ? `<a href="${plan[4]}" target="_blank" rel="noreferrer">${plan[2]}<i data-lucide="arrow-right" aria-hidden="true"></i></a>`
        : `<button type="button" data-toast="${plan[2]}：${product.name}">${plan[2]}<i data-lucide="arrow-right" aria-hidden="true"></i></button>`}
    </div>`).join("");

  showPanel("product", product.name);
  renderIcons();
}

document.addEventListener("click", async (event) => {
  const toastControl = event.target.closest("[data-toast]");
  if (toastControl) showToast(toastControl.dataset.toast);

  const copyControl = event.target.closest("[data-copy]");
  if (copyControl) {
    try {
      await navigator.clipboard.writeText(copyControl.dataset.copy);
      showToast("代理连接已复制");
    } catch {
      showToast("请手动复制代理连接");
    }
  }
});

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });

    const filter = button.dataset.filter;
    document.querySelectorAll(".package-row[data-status]").forEach((row) => {
      row.classList.toggle("is-hidden", filter !== "all" && row.dataset.status !== filter);
    });
  });
});

document.querySelectorAll("[data-choice-group]").forEach((group) => {
  group.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });
});

document.querySelectorAll("[data-product]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    markActiveNav(item);
    renderProduct(item.dataset.product);
    window.history.replaceState(null, "", item.getAttribute("href"));
  });
});

document.querySelectorAll("[data-open-product]").forEach((item) => {
  item.addEventListener("click", () => {
    const navItem = document.querySelector(`[data-product="${item.dataset.openProduct}"]`);
    markActiveNav(navItem);
    renderProduct(item.dataset.openProduct);
    window.history.replaceState(null, "", navItem?.getAttribute("href") || "#overview");
  });
});

document.querySelectorAll("[data-view]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    markActiveNav(item);
    const view = item.dataset.view;

    const resourceLabels = {
      packages: "所有套餐",
      users: "代理用户"
    };
    if (resourceLabels[view]) {
      showPanel(view, resourceLabels[view]);
      window.ConsoleResources?.open(view);
      window.history.replaceState(null, "", `#${view}`);
      return;
    }

    const commerceLabels = {
      orders: "订单管理"
    };
    if (commerceLabels[view]) {
      showPanel(view, commerceLabels[view]);
      window.history.replaceState(null, "", `#${view}`);
      if (view === "orders") window.ConsoleCommerce?.openOrders();
      return;
    }

    const accountLabels = {
      usage: "用量明细",
      billing: "账单与发票",
      settings: "账户设置"
    };
    if (accountLabels[view]) {
      showPanel(view, accountLabels[view]);
      window.history.replaceState(null, "", `#${view}`);
      if (view === "usage") window.ConsoleAccount?.openUsage();
      if (view === "billing") window.ConsoleAccount?.openBilling();
      if (view === "settings") window.ConsoleAccount?.openSettings();
      return;
    }

    showPanel("overview", "概览");
    window.history.replaceState(null, "", item.getAttribute("href"));
  });
});

const menuButton = document.querySelector(".mobile-menu");
if (menuButton) {
  menuButton.addEventListener("click", () => document.body.classList.toggle("is-menu-open"));
}

const userMenuButton = document.querySelector("#userMenuButton");
const userAccountMenu = document.querySelector("#userAccountMenu");
const userMenuWrap = document.querySelector(".user-menu-wrap");

function setUserMenuOpen(open, returnFocus = false) {
  if (!userMenuButton || !userAccountMenu) return;
  userAccountMenu.hidden = !open;
  userMenuButton.classList.toggle("is-open", open);
  userMenuButton.setAttribute("aria-expanded", open ? "true" : "false");
  if (returnFocus) userMenuButton.focus();
}

userMenuButton?.addEventListener("click", () => {
  setUserMenuOpen(userAccountMenu?.hidden);
});

userAccountMenu?.addEventListener("click", (event) => {
  const logoutButton = event.target.closest("[data-user-menu-logout]");
  if (logoutButton) {
    event.preventDefault();
    window.localStorage.removeItem("token_key");
    const localPreview = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    window.location.href = localPreview ? "/console/login.html" : "/login.html";
    return;
  }
  if (event.target.closest('[role="menuitem"]')) setUserMenuOpen(false);
});

document.addEventListener("click", (event) => {
  if (!userMenuWrap?.contains(event.target)) setUserMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && userMenuButton?.getAttribute("aria-expanded") === "true") {
    setUserMenuOpen(false, true);
  }
});

let lastRoutedHash = "";
let lastRoutedModule = "";

function routeModuleOnce(moduleKey, handler) {
  if (typeof handler !== "function" || lastRoutedModule === moduleKey) return false;
  lastRoutedModule = moduleKey;
  handler();
  return true;
}

function routeCurrentHash() {
  setUserMenuOpen(false);
  const hash = window.location.hash || "#overview";
  if (hash !== lastRoutedHash) {
    lastRoutedHash = hash;
    lastRoutedModule = "";
  }
  const [route] = hash.slice(1).split("?");
  const params = new URLSearchParams(hash.includes("?") ? hash.split("?").slice(1).join("?") : "");

  if (route === "purchase") {
    markActiveNav(null);
    showPanel("purchase", "购买套餐");
    routeModuleOnce("commerce:purchase", window.ConsoleCommerce?.openPurchase
      ? () => window.ConsoleCommerce.openPurchase(params.get("product") || "tunnel")
      : null);
    return;
  }
  if (route === "order") {
    markActiveNav(document.querySelector('[data-view="orders"]'));
    showPanel("order", "确认订单");
    routeModuleOnce("commerce:order", window.ConsoleCommerce?.openOrder
      ? () => window.ConsoleCommerce.openOrder(params.get("tradeNo") || "")
      : null);
    return;
  }
  if (route === "payment-return") {
    markActiveNav(document.querySelector('[data-view="orders"]'));
    showPanel("order", "支付结果");
    routeModuleOnce("commerce:payment-return", window.ConsoleCommerce?.handlePaymentReturn
      ? () => window.ConsoleCommerce.handlePaymentReturn(params)
      : null);
    return;
  }
  if (route === "recharge-return") {
    markActiveNav(document.querySelector('[data-view="billing"]'));
    showPanel("billing", "充值结果");
    routeModuleOnce("account:recharge-return", window.ConsoleAccount?.handleRechargeReturn
      ? () => window.ConsoleAccount.handleRechargeReturn(params)
      : null);
    return;
  }
  if (route === "extract") {
    const productKey = params.get("product") || "tunnel";
    markActiveNav(document.querySelector(`[data-product="${productKey}"]`));
    showPanel("extract", "使用套餐");
    routeModuleOnce("extractor:extract", window.ConsoleExtractor?.open
      ? () => window.ConsoleExtractor.open(productKey, params.get("order") || "")
      : null);
    return;
  }
  if (route === "usage") {
    markActiveNav(document.querySelector('[data-view="usage"]'));
    showPanel("usage", "用量明细");
    routeModuleOnce("account:usage", window.ConsoleAccount?.openUsage
      ? () => window.ConsoleAccount.openUsage()
      : null);
    return;
  }
  if (route === "billing") {
    markActiveNav(document.querySelector('[data-view="billing"]'));
    showPanel("billing", "账单与发票");
    routeModuleOnce("account:billing", window.ConsoleAccount?.openBilling
      ? () => window.ConsoleAccount.openBilling(params.get("tab") || "")
      : null);
    return;
  }
  if (route === "settings") {
    markActiveNav(document.querySelector('[data-view="settings"]'));
    showPanel("settings", "账户设置");
    routeModuleOnce("account:settings", window.ConsoleAccount?.openSettings
      ? () => window.ConsoleAccount.openSettings(params.get("tab") || "")
      : null);
    return;
  }

  const productNav = Array.from(document.querySelectorAll("[data-product]"))
    .find((item) => item.getAttribute("href") === hash);
  if (productNav) {
    markActiveNav(productNav);
    renderProduct(productNav.dataset.product);
    return;
  }

  const view = hash.slice(1);
  const viewNav = document.querySelector(`[data-view="${view}"]`);
  if (viewNav) {
    markActiveNav(viewNav);
    const labels = {
      overview: "概览",
      packages: "所有套餐",
      usage: "用量明细",
      users: "代理用户",
      orders: "订单管理",
      billing: "账单与发票",
      settings: "账户设置"
    };
    showPanel(view === "overview" ? "overview" : view, labels[view] || "概览");
    if (["packages", "users"].includes(view)) {
      routeModuleOnce(`resources:${view}`, window.ConsoleResources?.open
        ? () => window.ConsoleResources.open(view)
        : null);
    }
    if (view === "orders") {
      routeModuleOnce("commerce:orders", window.ConsoleCommerce?.openOrders
        ? () => window.ConsoleCommerce.openOrders()
        : null);
    }
    return;
  }

  const overviewNav = document.querySelector('[data-view="overview"]');
  markActiveNav(overviewNav);
  showPanel("overview", "概览");
}

window.addEventListener("hashchange", routeCurrentHash);
window.addEventListener("console-commerce-ready", routeCurrentHash);
window.addEventListener("console-extractor-ready", routeCurrentHash);
window.addEventListener("console-account-ready", routeCurrentHash);
routeCurrentHash();
renderIcons();
