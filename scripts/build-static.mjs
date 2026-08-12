import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { contactZh, renderContactMain } from "./contact-content.mjs";
import { enterpriseEn, enterpriseOrder, enterpriseZh, renderEnterpriseMain } from "./enterprise-content.mjs";
import { developerOrder, developerPages, renderDeveloperDocument } from "./developer-content.mjs";
import { networkEn, networkZh, renderNetworkMain } from "./network-content.mjs";
import { pricingEn, pricingZh, renderPricingMain } from "./pricing-content.mjs";
import { englishProducts, englishProductOrder } from "./product-content.en.mjs";
import { renderSolutionMain, solutionOrder, solutionsEn, solutionsZh } from "./solution-content.mjs";
import { lastModifiedForRoute, productSeoFactForPath, seoOrganization, siteUrl } from "./seo-entities.mjs";
import { renderStatusDocument, statusZh } from "./status-content.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const assetVersion = "20260731-01";
const pricingAssetVersion = "20260731-01";
const refinementAssetVersion = "20260731-01";
const conversionAssetVersion = "20260813-01";
const googleTagId = "GT-WF3B5LNX";
const googleAdsId = "AW-11399174770";

function googleAdsConversionLabel(environmentName) {
  const value = String(process.env[environmentName] || "").trim();
  if (value && !/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error(`${environmentName} contains an invalid Google Ads conversion label.`);
  }
  return value;
}

const googleAdsConversionConfig = {
  adsId: googleAdsId,
  labels: {
    registration: googleAdsConversionLabel("GOOGLE_ADS_REGISTRATION_LABEL") || "jcW6CPnl2OAcEPK0xrsq",
    trial: googleAdsConversionLabel("GOOGLE_ADS_TRIAL_LABEL") || "hua4CP7U1uAcEPK0xrsq",
    consultation: googleAdsConversionLabel("GOOGLE_ADS_CONSULTATION_LABEL") || "oIxHCIT4yOAcEPK0xrsq",
    // Reuse the 123Proxy "buy button" action found in the original React site,
    // but fire it only after the backend confirms a paid order.
    purchase: googleAdsConversionLabel("GOOGLE_ADS_PURCHASE_LABEL") || "SuudCJ3Tyv4YEPK0xrsq",
    recharge: googleAdsConversionLabel("GOOGLE_ADS_RECHARGE_LABEL")
  }
};

const chineseProducts = [
  ["tunnel", "scraping-rotating-proxy.html"],
  ["residential", "residential-proxy.html"],
  ["unlimitedResidential", "unlimited-residential-proxy.html"],
  ["staticDatacenter", "static-datacenter-proxy.html"],
  ["staticResidential", "static-residential-proxy.html"]
];

const solutionFiles = solutionOrder.map((key) => solutionsZh[key].file);
const enterpriseFiles = enterpriseOrder.map((key) => enterpriseZh[key].file);
const networkFiles = [networkZh.file];
const pricingFiles = [pricingZh.file];
const statusFiles = [statusZh.file];
const contactFiles = [contactZh.file];
const developerFiles = developerOrder.map((key) => developerPages[key].output);
const developerRoutes = developerOrder.map((key) => developerPages[key].route);

const endpointByKey = {
  highBandwidth: "proxy.123proxy.cn:9000",
  tunnel: "proxy.123proxy.cn:36923",
  residential: "residential.123proxy.cn:33000",
  unlimitedResidential: "unlimit.residential.123proxy.cn:10253",
  staticDatacenter: "38.91.24.27:8080",
  staticResidential: "73.18.42.114:8080"
};

const usernameByKey = {
  highBandwidth: "project-customer",
  tunnel: "customer-session-demo",
  residential: "customer_US_SESSIONID",
  unlimitedResidential: "customer-port-08",
  staticDatacenter: "customer-static",
  staticResidential: "customer-static-isp"
};

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;

function brandMarkup(assetPrefix = "../") {
  return `
    <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
      <rect x="12" y="0" width="20" height="20" rx="4" fill="#1116ef"></rect>
      <rect x="0" y="24" width="20" height="20" rx="4" fill="#2f80ed"></rect>
      <rect x="24" y="24" width="20" height="20" rx="4" fill="#4cc9ed"></rect>
      <text x="22" y="15.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">1</text>
      <text x="10" y="39.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">2</text>
      <text x="34" y="39.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">3</text>
    </svg>
    <span class="brand-wordmark"><img class="wordmark-proxy-original" src="${assetPrefix}assets/123proxy-proxy-original.svg" alt="Proxy"></span>`;
}

function englishProductLinks() {
  return englishProductOrder.map((key) => {
    const product = englishProducts[key];
    const productIcon = {
      highBandwidth: "gauge",
      tunnel: "route",
      residential: "wifi",
      unlimitedResidential: "infinity",
      staticDatacenter: "server",
      staticResidential: "map-pinned"
    }[key];
    return [product.file, product.name, product.eyebrow, productIcon];
  });
}

function englishPricingLinks() {
  return [
    ["pricing.html?product=tunnel", "Scraping rotating proxy", "¥45 / thread", "or ¥3 / GB", "route"],
    ["pricing.html?product=residential", "Residential rotating proxy", "From ¥3 / GB", "Traffic billing", "house"],
    ["pricing.html?product=unlimited", "Unlimited residential", "From ¥600", "Per port and period", "refresh-cw"],
    ["pricing.html?product=static-datacenter", "Static datacenter proxy", "From ¥20 / IP", "Per IP and period", "server"],
    ["pricing.html?product=static-residential", "Static residential proxy", "From ¥40 / IP", "Per residential IP", "radio-tower"],
    ["../contact.html#solutions", "High-bandwidth and custom", "Project quote", "Bandwidth and scale", "gauge"]
  ];
}

function englishHeader(page) {
  const pricingUrl = "pricing.html";
  const zhPath = `../${page.zhFile || "index.html"}`;
  const products = englishProductLinks();
  const pricing = englishPricingLinks();
  return `
    <div class="utility-bar">
      <div class="container utility-inner">
        <div class="utility-left">
          <span class="utility-status"><span class="status-dot"></span>Global proxy network operational</span>
          <span>Infrastructure for scraping engineers and AI data teams</span>
        </div>
        <div class="utility-right">
          <a class="utility-link" href="/status/">Service status</a>
          <a class="utility-link" href="/developers/">Documentation</a>
          <a class="utility-link" href="../contact.html">Contact</a>
          <a class="utility-link language-link" href="${zhPath}" lang="zh-CN" hreflang="zh-CN">中文</a>
        </div>
      </div>
    </div>
    <header class="header">
      <nav class="container nav" aria-label="Primary navigation">
        <a class="brand" href="index.html" aria-label="123Proxy home">${brandMarkup()}</a>
        <div class="nav-links">
          <div class="nav-item">
            <button class="nav-trigger is-active" type="button" aria-expanded="false">Proxy products${icon("chevron-down")}</button>
            <div class="mega-menu">
              <div class="mega-layout">
                <div class="mega-intro">
                  <span class="mega-label">Proxy products</span>
                  <strong>Select by workload</strong>
                  <p>Compare bandwidth, residential identity, rotation, location, session, and fixed exits.</p>
                  <a href="index.html#products">View all products${icon("arrow-right")}</a>
                </div>
                <div class="mega-links">
                  ${products.map(([href, name, desc, itemIcon], index) => `
                    <a class="mega-link${index === 0 ? " is-featured" : ""}" href="${href}"${href === page.file ? ' aria-current="page"' : ""}>
                      <span class="mega-link-icon">${icon(itemIcon)}</span>
                      <span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(desc)}</small></span>
                    </a>`).join("")}
                </div>
              </div>
            </div>
          </div>
          <a href="high-bandwidth-proxy.html">AI data infrastructure</a>
          <a href="global-network.html">Global network</a>
          <a href="/developers/">Developers</a>
          <a href="enterprise.html">Enterprise</a>
          <div class="nav-item">
            <button class="nav-trigger" type="button" aria-expanded="false">Pricing${icon("chevron-down")}</button>
            <div class="mega-menu is-pricing">
              <div class="mega-layout">
                <div class="mega-intro">
                  <span class="mega-label">Pricing</span>
                  <strong>Plans and billing models</strong>
                  <p>Compare traffic, threads, ports, and fixed-IP plans.</p>
                  <a href="${pricingUrl}">View all prices and free trials${icon("arrow-right")}</a>
                </div>
                <div class="mega-links">
                  ${pricing.map(([href, name, price, note, itemIcon], index) => `<a class="mega-link${index === 0 ? " is-featured" : ""}" href="${href}">
                      <span class="mega-link-icon">${icon(itemIcon)}</span>
                      <span><strong>${escapeHtml(name)}</strong><small class="mega-price"><b>${escapeHtml(price)}</b><em>${escapeHtml(note)}</em></small></span>
                    </a>`).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-actions">
          <a class="btn btn-ghost" href="https://console.123proxy.cn/" target="_blank" rel="noreferrer">Log in</a>
          <a class="btn btn-primary" href="https://console.123proxy.cn/register.html" target="_blank" rel="noreferrer">Free 1GB trial</a>
          <button class="btn icon-btn mobile-menu-btn" id="menuToggle" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="Open navigation">${icon("menu")}</button>
        </div>
      </nav>
      <div class="mobile-menu" id="mobileMenu">
        <details>
          <summary>Proxy products${icon("chevron-down")}</summary>
          <div class="mobile-submenu">${products.map(([href, name]) => `<a href="${href}">${escapeHtml(name)}</a>`).join("")}</div>
        </details>
        <a href="high-bandwidth-proxy.html">AI data infrastructure${icon("chevron-right")}</a>
        <a href="global-network.html">Global network${icon("chevron-right")}</a>
        <a href="/developers/">Developers${icon("chevron-right")}</a>
        <details>
          <summary>Pricing${icon("chevron-down")}</summary>
          <div class="mobile-submenu">${pricing.slice(0, 5).map(([href, name, price]) => `<a href="${href}">${escapeHtml(name)}<span>${escapeHtml(price)}</span></a>`).join("")}</div>
        </details>
        <a href="${zhPath}" lang="zh-CN" hreflang="zh-CN">中文${icon("chevron-right")}</a>
      </div>
    </header>`;
}

function englishFooter() {
  const products = englishProductLinks();
  return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
            <a class="brand" href="index.html">${brandMarkup()}</a>
            <p>Global proxy and data collection infrastructure for scraping engineers and AI data teams.</p>
          </div>
          <div class="footer-col">
            <h3>Proxy products</h3>
            ${products.slice(1).map(([href, name]) => `<a href="${href}">${escapeHtml(name)}</a>`).join("")}
          </div>
          <div class="footer-col">
            <h3>AI data</h3>
            <a href="ai-data.html">AI data overview</a>
            <a href="ai-video-proxy.html">Video and multimodal data</a>
            <a href="ai-image-proxy.html">Large-scale image data</a>
            <a href="ai-youtube-api.html">YouTube Data API</a>
          </div>
          <div class="footer-col">
            <h3>Developers</h3>
            <a href="/developers/getting-started/">Quick start</a>
            <a href="/developers/#products">Product access</a>
            <a href="/developers/examples/">Code examples</a>
          </div>
          <div class="footer-col">
            <h3>Company and support</h3>
            <a href="enterprise.html">Enterprise services</a>
            <a href="custom-proxy-pool.html">Custom proxy pools</a>
            <a href="data-scraping-service.html">Managed data scraping</a>
            <a href="../contact.html#solutions">Contact sales</a>
            <a href="global-network.html">Global network</a>
            <a href="../index.html" lang="zh-CN" hreflang="zh-CN">Chinese website</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 123Proxy. All rights reserved.</span>
          <span>Guangzhou, China · ICP 2023058453-1</span>
        </div>
      </div>
    </footer>`;
}

function englishHeroVisual(page) {
  const visualClass = page.key === "staticResidential" ? "is-static-residential" : "is-static-dc";
  return `
    <div class="hero-visual focus-hero-visual ${visualClass}" aria-label="${escapeHtml(page.name)} product summary">
      <div class="visual-topline"><span>${escapeHtml(page.eyebrow)}</span><span class="visual-live">ready</span></div>
      <div class="focus-console">
        <div class="focus-console-head"><span>${icon(page.key === "staticResidential" ? "wifi" : "network")} ${escapeHtml(page.hero.label)}</span><small>123PROXY NETWORK</small></div>
        <div class="focus-console-body">
          <div class="identity-primary${page.key === "staticResidential" ? " is-residential" : ""}">
            <span class="identity-primary-icon">${icon(page.key === "staticResidential" ? "house" : "waypoints")}</span>
            <div><span>PRODUCT PROFILE</span><strong>${escapeHtml(page.hero.heading)}</strong><small>${escapeHtml(page.hero.subheading)}</small></div>
            <em>READY</em>
          </div>
          <div class="identity-fact-grid">
            ${page.hero.facts.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
          </div>
          <div class="fixed-route-line${page.key === "staticResidential" ? " is-residential" : ""}">
            <span>${icon("code-2")}Client</span><i>${icon("arrow-right")}</i><span class="is-fixed">${icon("network")}123Proxy</span><i>${icon("arrow-right")}</i><span>${icon("globe-2")}Target</span>
          </div>
        </div>
      </div>
    </div>`;
}

function renderServiceSchema({ page, canonical, locale, faqs, isHome = false }) {
  const routePath = new URL(canonical).pathname;
  const dateModified = lastModifiedForRoute(routePath);
  const productFact = productSeoFactForPath(routePath);
  const organization = { ...seoOrganization };
  const graph = [organization];

  if (isHome) {
    graph.push({
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: canonical,
      name: "123Proxy",
      description: page.description,
      inLanguage: locale,
      dateModified,
      publisher: { "@id": `${siteUrl}/#organization` }
    });
  } else {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: page.name,
      description: productFact?.description || page.description,
      serviceType: productFact?.serviceType || page.name,
      category: productFact?.category,
      url: canonical,
      provider: { "@id": `${siteUrl}/#organization` },
      audience: productFact ? {
        "@type": "Audience",
        audienceType: productFact.audience
      } : undefined,
      areaServed: "Worldwide",
      dateModified,
      additionalProperty: productFact?.properties?.map(([name, value]) => ({
        "@type": "PropertyValue",
        name,
        value
      }))
    });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: locale === "en" ? "Home" : "首页", item: locale === "en" ? `${siteUrl}/en/` : `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: page.name, item: canonical }
      ]
    });
  }

  if (faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

function englishHead(page, { isHome = false } = {}) {
  const canonical = isHome ? `${siteUrl}/en/` : `${siteUrl}/en/${page.file}`;
  const zhCanonical = isHome ? `${siteUrl}/` : `${siteUrl}/${page.zhFile}`;
  const title = isHome ? "123Proxy | Proxy Infrastructure for Web Scraping and AI Data Collection" : `${page.name} | 123Proxy`;
  const description = isHome
    ? "123Proxy provides rotating residential proxies, static proxy IPs, and high-bandwidth proxy infrastructure for web scraping and AI data collection."
    : page.description;
  const schema = renderServiceSchema({ page, canonical, locale: "en", faqs: page.faqs, isHome });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="zh-CN" href="${zhCanonical}">
  <link rel="alternate" hreflang="en" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${zhCanonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="123Proxy">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="stylesheet" href="../assets/product-detail.css?v=${assetVersion}">
  <script type="application/ld+json">${schema}</script>`;
}

function renderEnglishProduct(page) {
  const primaryUrl = page.primaryUrl || page.pricingUrl;
  const primaryLabel = page.primaryLabel || page.purchase.button;
  const endpoint = endpointByKey[page.key];
  const username = usernameByKey[page.key];
  const proxyUrl = `http://${username}:YOUR_PASSWORD@${endpoint}`;
  return `<!doctype html>
<html lang="en">
<head>${englishHead(page)}</head>
<body class="locale-en" data-product="${page.key}">
  <div class="page">
    ${englishHeader(page)}
    <main>
      <section class="hero">
        <div class="container hero-inner">
          <div class="hero-copy">
            <div class="hero-breadcrumb"><a href="index.html">Home</a><span>/</span><a href="index.html#products">Proxy products</a><span>/</span><strong>${escapeHtml(page.name)}</strong></div>
            <div class="eyebrow">${escapeHtml(page.eyebrow)}</div>
            <h1>${page.titleLines.map((line) => `<span class="hero-title-line">${escapeHtml(line)}</span>`).join(" ")}</h1>
            <p class="hero-lead">${escapeHtml(page.lead)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${primaryUrl}"${primaryUrl.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${icon(page.key === "highBandwidth" ? "gauge" : "tag")}${escapeHtml(primaryLabel)}</a>
              <a class="btn btn-on-dark" href="#developers">${icon("code-2")}Developer access</a>
            </div>
            <div class="hero-points">${page.points.map((point) => `<span class="hero-point">${icon("circle-check")}${escapeHtml(point)}</span>`).join("")}</div>
          </div>
          ${englishHeroVisual(page)}
        </div>
      </section>
      <section class="metric-strip"><div class="container metric-strip-inner">${page.strip.map(([value, label]) => `<div class="strip-item"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}</div></section>
      <div class="product-subnav">
        <div class="container subnav-inner">
          <span class="subnav-name">${escapeHtml(page.name)}</span>
          <div class="subnav-links">
            <a href="#overview">Capabilities</a><a href="#billing">Plans</a><a href="#workloads">Workloads</a><a href="#specs">Specifications</a><a href="#developers">Developers</a><a href="#faq">FAQ</a>
            <a href="${primaryUrl}"${primaryUrl.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${page.key === "highBandwidth" ? "Assessment" : "Pricing"}</a>
          </div>
        </div>
      </div>

      <section class="section" id="overview">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">01 / Product capability</div><h2>${page.overviewTitle.map((line) => `<span class="section-title-line">${escapeHtml(line)}</span>`).join(" ")}</h2></div><p>${escapeHtml(page.overviewText)}</p></div>
          <div class="capability-grid">${page.capabilities.map(([itemIcon, title, text]) => `<article class="capability-item"><div class="capability-icon">${icon(itemIcon)}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div>
        </div>
      </section>

      <section class="section section-soft" id="billing">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">${escapeHtml(page.purchase.kicker)}</div><h2>${page.purchase.title.map((line) => `<span class="section-title-line">${escapeHtml(line)}</span>`).join(" ")}</h2></div><p>${escapeHtml(page.purchase.text)}</p></div>
          <div class="purchase-model-grid is-${page.key}">
            <article class="purchase-model-primary">
              <span class="purchase-model-label">${escapeHtml(page.purchase.label)}</span>
              <h3>${escapeHtml(page.purchase.heading)}</h3><p>${escapeHtml(page.purchase.body)}</p>
              <div class="purchase-model-unit"><strong>${escapeHtml(page.purchase.unit)}</strong><span>${escapeHtml(page.purchase.unitText)}</span></div>
              <a class="btn btn-primary" href="${primaryUrl}"${primaryUrl.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${icon(page.key === "highBandwidth" ? "gauge" : "tag")}${escapeHtml(page.purchase.button)}</a>
            </article>
            <dl class="purchase-model-facts">${page.purchase.facts.map(([term, detail]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd></div>`).join("")}</dl>
          </div>
          <div class="purchase-guidance"><div class="purchase-guidance-icon">${icon(page.purchase.guidanceIcon)}</div><div><span class="section-kicker">Planning note</span><h3>${escapeHtml(page.purchase.guidanceTitle)}</h3><p>${escapeHtml(page.purchase.guidanceText)}</p></div></div>
        </div>
      </section>

      <section class="section" id="workloads">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">03 / Workloads</div><h2>${page.workloadsTitle.map((line) => `<span class="section-title-line">${escapeHtml(line)}</span>`).join(" ")}</h2></div><p>${escapeHtml(page.workloadsText)}</p></div>
          <div class="workload-grid">${page.workloads.map(([index, title, text, meta]) => `<article class="workload-card"><span class="workload-index">${escapeHtml(index)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><div class="workload-meta">${escapeHtml(meta)}</div></article>`).join("")}</div>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container workflow-layout">
          <div class="workflow-copy"><div class="section-kicker">04 / How it works</div><h2>${escapeHtml(page.workflow.title)}</h2><p>${escapeHtml(page.workflow.text)}</p><div class="workflow-list">${page.workflow.steps.map(([index, title, text]) => `<div class="workflow-step"><span>${escapeHtml(index)}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div></div>`).join("")}</div></div>
          <div class="architecture">
            <div class="architecture-head"><span>Proxy service architecture</span><span>123Proxy network</span></div>
            <div class="architecture-flow">
              <div class="arch-node">${icon("code-2")}<div><strong>Application</strong><small>CLIENT</small></div></div>
              <div class="arch-node">${icon("key-round")}<div><strong>Authentication</strong><small>AUTH</small></div></div>
              <div class="arch-node">${icon("network")}<div><strong>123Proxy</strong><small>ROUTE</small></div></div>
              <div class="arch-node">${icon("globe-2")}<div><strong>Public target</strong><small>RESPONSE</small></div></div>
            </div>
            <div class="architecture-foot">${page.workflow.stats.map(([label, value]) => `<div class="arch-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
          </div>
        </div>
      </section>

      <section class="section" id="specs"><div class="container"><div class="section-head"><div><div class="section-kicker">05 / Specifications</div><h2>Product boundaries and technical facts</h2></div><p>Available locations, inventory, bandwidth, and package options are subject to the current console and pricing page.</p></div><dl class="spec-table">${page.specs.map(([term, detail]) => `<div class="spec-row"><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd></div>`).join("")}</dl></div></section>

      <section class="section section-dark" id="developers">
        <div class="container developer-layout">
          <div class="developer-copy"><div class="section-kicker">06 / Developer access</div><h2>${escapeHtml(page.developerTitle)}</h2><p>${escapeHtml(page.developerText)}</p><div class="developer-points"><span class="developer-point">${icon("check")}Standard HTTP proxy configuration</span><span class="developer-point">${icon("check")}Explicit timeout and retry policy</span><span class="developer-point">${icon("check")}Production monitoring by workload</span></div></div>
          <div class="code-window"><div class="code-head"><div class="code-tabs"><span class="code-tab" aria-selected="true">Python</span></div></div><pre><code><span class="syntax-key">import</span> requests

proxy = <span class="syntax-string">"${escapeHtml(proxyUrl)}"</span>
proxies = {<span class="syntax-string">"http"</span>: proxy, <span class="syntax-string">"https"</span>: proxy}

response = requests.get(
    <span class="syntax-string">"https://target.example/data"</span>,
    proxies=proxies,
    timeout=20,
)

print(response.status_code)</code></pre></div>
        </div>
      </section>

      <section class="section section-soft" id="faq"><div class="container faq-layout"><div class="faq-intro"><div class="section-kicker">07 / FAQ</div><h2>Questions to answer before production</h2><p>Validate the product boundary, package model, target behavior, and capacity with representative requests.</p></div><div class="faq-list">${page.faqs.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></div></section>

      <section class="cta-band"><div class="container cta-inner"><div><h2>${escapeHtml(page.ctaTitle)}</h2><p>${escapeHtml(page.ctaText)}</p></div><div class="cta-actions"><a class="btn btn-primary" href="${primaryUrl}"${primaryUrl.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${icon(page.key === "highBandwidth" ? "gauge" : "tag")}${escapeHtml(primaryLabel)}</a><a class="btn btn-on-dark" href="../contact.html#solutions">${icon("messages-square")}Contact sales</a></div></div></section>
    </main>
    ${englishFooter()}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="../assets/product-static.js?v=${assetVersion}"></script>
</body>
</html>`;
}

function renderEnglishHome() {
  const page = {
    file: "index.html",
    zhFile: "index.html",
    name: "123Proxy",
    description: "123Proxy proxy infrastructure for web scraping and AI data collection.",
    faqs: []
  };
  const productCards = englishProductOrder.map((key) => englishProducts[key]);
  return `<!doctype html>
<html lang="en">
<head>${englishHead(page, { isHome: true })}</head>
<body class="locale-en" data-product="home">
  <div class="page">
    ${englishHeader(page)}
    <main>
      <section class="hero">
        <div class="container hero-inner">
          <div class="hero-copy">
            <div class="eyebrow">Enterprise proxy and AI data infrastructure</div>
            <h1><span class="hero-title-line">Proxy infrastructure for scraping</span> <span class="hero-title-line">and AI data collection</span></h1>
            <p class="hero-lead">Global rotating residential proxies, dedicated static IPs, and project-scale bandwidth for engineers collecting public web data.</p>
            <div class="hero-actions"><a class="btn btn-primary" href="#products">${icon("network")}Explore proxy products</a><a class="btn btn-on-dark" href="high-bandwidth-proxy.html">${icon("gauge")}AI data infrastructure</a></div>
            <div class="hero-points"><span class="hero-point">${icon("circle-check")}80M+ residential proxy IPs</span><span class="hero-point">${icon("circle-check")}190+ countries and regions</span><span class="hero-point">${icon("circle-check")}Standard proxy protocols</span><span class="hero-point">${icon("circle-check")}24/7 technical support</span></div>
          </div>
          ${englishHeroVisual({
            key: "home",
            name: "123Proxy network",
            eyebrow: "Global proxy network",
            hero: {
              label: "PROXY INFRASTRUCTURE",
              heading: "Routing profiles for every workload",
              subheading: "Rotating, residential, static, and high-bandwidth",
              facts: [["RESIDENTIAL", "80M+ IPs"], ["COVERAGE", "190+ locations"], ["CAPACITY", "10Gbps+ per project"], ["SUPPORT", "24/7"]]
            }
          })}
        </div>
      </section>
      <section class="metric-strip"><div class="container metric-strip-inner"><div class="strip-item"><strong>80M+</strong><span>Residential proxy IPs</span></div><div class="strip-item"><strong>190+</strong><span>Countries and regions</span></div><div class="strip-item"><strong>99.99%</strong><span>Availability target</span></div><div class="strip-item"><strong>24/7</strong><span>Enterprise support</span></div></div></section>
      <section class="section" id="products">
        <div class="container">
          <div class="section-head"><div><div class="section-kicker">01 / Products</div><h2><span class="section-title-line">Choose proxy infrastructure</span> <span class="section-title-line">from the workload backward</span></h2></div><p>Compare bandwidth, residential identity, geo targeting, rotation, fixed exits, session behavior, and billing before selecting a package.</p></div>
          <div class="capability-grid">${productCards.map((product) => `<a class="capability-item" href="${product.file}"><div class="capability-icon">${icon(product.key === "highBandwidth" ? "gauge" : product.key.includes("static") ? "pin" : "network")}</div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></a>`).join("")}</div>
        </div>
      </section>
      <section class="section section-soft" id="network"><div class="container workflow-layout"><div class="workflow-copy"><div class="section-kicker">02 / Global network</div><h2>Residential reach and project-scale capacity</h2><p>Use 80M+ residential proxy IPs across 190+ countries and regions, or design dedicated high-bandwidth infrastructure for large AI datasets.</p><div class="workflow-list"><div class="workflow-step"><span>01</span><div><strong>Define location and identity</strong><p>Choose global random, geo-targeted residential, or fixed ISP and datacenter exits.</p></div></div><div class="workflow-step"><span>02</span><div><strong>Select the billing model</strong><p>Compare traffic, concurrency, port-based, per-IP, and project-based capacity.</p></div></div><div class="workflow-step"><span>03</span><div><strong>Validate with real requests</strong><p>Measure success, response time, bytes, retries, and useful throughput.</p></div></div></div></div><div class="architecture"><div class="architecture-head"><span>Workload-driven selection</span><span>123Proxy</span></div><div class="architecture-flow"><div class="arch-node">${icon("code-2")}<div><strong>Application</strong><small>CLIENT</small></div></div><div class="arch-node">${icon("waypoints")}<div><strong>Gateway</strong><small>AUTH</small></div></div><div class="arch-node">${icon("network")}<div><strong>Proxy resource</strong><small>ROUTE</small></div></div><div class="arch-node">${icon("database")}<div><strong>Public data</strong><small>OUTPUT</small></div></div></div><div class="architecture-foot"><div class="arch-stat"><span>Residential pool</span><strong>80M+</strong></div><div class="arch-stat"><span>Coverage</span><strong>190+</strong></div><div class="arch-stat"><span>Project capacity</span><strong>10Gbps+</strong></div></div></div></div></section>
      <section class="cta-band"><div class="container cta-inner"><div><h2>Start with a representative workload</h2><p>Use real target URLs and completion requirements to validate the right proxy product and capacity model.</p></div><div class="cta-actions"><a class="btn btn-primary" href="https://console.123proxy.cn/register.html" target="_blank" rel="noreferrer">${icon("flask-conical")}Free 1GB trial</a><a class="btn btn-on-dark" href="../contact.html#solutions">${icon("messages-square")}Contact a solutions engineer</a></div></div></section>
    </main>
    ${englishFooter()}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="../assets/product-static.js?v=${assetVersion}"></script>
</body>
</html>`;
}

function seoBlock({ title, description, canonicalPath, alternatePath, locale, page, faqs = [], isHome = false }) {
  const canonical = `${siteUrl}${canonicalPath}`;
  const alternate = `${siteUrl}${alternatePath}`;
  const defaultCanonical = locale === "zh-CN" ? canonical : alternate;
  const schema = renderServiceSchema({ page, canonical, locale, faqs, isHome });
  return `<!-- SEO_META_START -->
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="zh-CN" href="${locale === "zh-CN" ? canonical : alternate}">
  <link rel="alternate" hreflang="en" href="${locale === "en" ? canonical : alternate}">
  <link rel="alternate" hreflang="x-default" href="${defaultCanonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="123Proxy">
  <meta property="og:locale" content="${locale === "zh-CN" ? "zh_CN" : "en_US"}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  <script type="application/ld+json">${schema}</script>
  <!-- SEO_META_END -->`;
}

function upsertSeo(html, block) {
  const pattern = /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/;
  if (pattern.test(html)) return html.replace(pattern, block);
  return html.replace("</head>", `${block}\n</head>`);
}

function googleTagBlock() {
  return `<!-- GOOGLE_TAG_START -->
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${googleTagId}');
    gtag('config', '${googleAdsId}');
    window.ProxyGoogleAdsConfig = ${JSON.stringify(googleAdsConversionConfig)};
  </script>
  <script defer src="/assets/google-ads.js?v=${conversionAssetVersion}"></script>
  <!-- GOOGLE_TAG_END -->`;
}

function upsertGoogleTag(html) {
  const block = googleTagBlock();
  const pattern = /<!-- GOOGLE_TAG_START -->[\s\S]*?<!-- GOOGLE_TAG_END -->/;
  if (pattern.test(html)) return html.replace(pattern, block);
  return html.replace("</head>", `${block}\n</head>`);
}

function upsertFavicon(html, href) {
  const favicon = `<link rel="icon" type="image/svg+xml" href="${href}">`;
  const pattern = /<link rel="icon"[^>]*>/;
  if (pattern.test(html)) return html.replace(pattern, favicon);
  return html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n  ${favicon}`);
}

function applyChineseRefinement(html) {
  const stylesheet = `<link rel="stylesheet" href="assets/visual-refinement.css?v=${refinementAssetVersion}">`;
  if (html.includes("assets/visual-refinement.css")) {
    html = html.replace(
      /assets\/visual-refinement\.css\?v=[^"]+/,
      `assets/visual-refinement.css?v=${refinementAssetVersion}`
    );
  } else {
    html = html.replace("</head>", `  ${stylesheet}\n</head>`);
  }
  return html.replace(/<body([^>]*)>/, (match, attributes) => {
    const classMatch = attributes.match(/\sclass="([^"]*)"/);
    if (classMatch) {
      const classes = new Set(classMatch[1].split(/\s+/).filter(Boolean));
      classes.add("site-refined");
      return `<body${attributes.replace(classMatch[0], ` class="${[...classes].join(" ")}"`)}>`;
    }
    return `<body class="site-refined"${attributes}>`;
  });
}

function readMeta(html, name) {
  const expression = name === "title"
    ? /<title>([\s\S]*?)<\/title>/
    : /<meta name="description" content="([^"]*)">/;
  return html.match(expression)?.[1]?.trim() || "";
}

async function renderChineseProductPages() {
  const source = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");

  for (const [key, file] of chineseProducts) {
    const context = {
      console,
      document: { body: { dataset: { product: key } } },
      encodeURIComponent,
      globalThis: null,
      __STATIC_RENDER__: true
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(`${source}\n;globalThis.__STATIC_PAGE__ = \`<div class="page">\${headerMarkup()}\${mainMarkup()}\${footerMarkup()}</div>\`; globalThis.__PAGE_DATA__ = pageData;`, context);

    const filePath = path.join(rootDir, file);
    let html = await readFile(filePath, "utf8");
    const staticBlock = `<!-- PRODUCT_APP_START -->\n  <div id="app">${context.__STATIC_PAGE__}</div>\n  <!-- PRODUCT_APP_END -->`;
    html = html.replace(/<!-- PRODUCT_APP_START -->[\s\S]*?<!-- PRODUCT_APP_END -->/, staticBlock);
    html = html
      .replace(/assets\/product-detail\.css\?v=[^"']+/, `assets/product-detail.css?v=${assetVersion}`)
      .replace(/assets\/product-detail\.js\?v=[^"']+/, `assets/product-detail.js?v=${assetVersion}`);

    const title = readMeta(html, "title");
    const description = readMeta(html, "description");
    const page = {
      name: context.__PAGE_DATA__.name,
      description,
      zhFile: file,
      file
    };
    const block = seoBlock({
      title,
      description,
      canonicalPath: `/${file}`,
      alternatePath: `/en/${file}`,
      locale: "zh-CN",
      page,
      faqs: context.__PAGE_DATA__.faqs
    });
    html = upsertSeo(html, block);
    html = upsertFavicon(html, "assets/favicon.svg");
    html = applyChineseRefinement(html);
    await writeFile(filePath, html, "utf8");
  }
}

function clearProductMenuCurrent(header) {
  return header.replace(
    /(<a class="mega-link(?: is-featured)?" href="[^"]+") aria-current="page"/g,
    "$1"
  );
}

function markMegaLinkCurrent(header, href) {
  for (const className of ["mega-link is-featured", "mega-link"]) {
    const anchor = `<a class="${className}" href="${href}">`;
    if (header.includes(anchor)) {
      return header.replace(
        anchor,
        `<a class="${className}" href="${href}" aria-current="page">`
      );
    }
  }

  return header;
}

function activateSolutionNavigation(header) {
  return clearProductMenuCurrent(header)
    .replace(
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">代理产品',
      '<button class="nav-trigger" type="button" aria-expanded="false">代理产品'
    )
    .replace(
      '<button class="nav-trigger" type="button" aria-expanded="false">AI 数据方案',
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">AI 数据方案'
    );
}

function renderSolutionHead(page, locale) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const canonicalPath = isEnglish ? `/en/${page.file}` : `/${page.file}`;
  const alternatePath = isEnglish ? `/${page.zhFile}` : `/en/${page.file}`;
  const block = seoBlock({
    title: page.title,
    description: page.description,
    canonicalPath,
    alternatePath,
    locale: isEnglish ? "en" : "zh-CN",
    page,
    faqs: page.faqs
  });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}assets/favicon.svg">
  <meta name="description" content="${escapeHtml(page.description)}">
  <title>${escapeHtml(page.title)}</title>
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="stylesheet" href="${assetPrefix}assets/product-detail.css?v=${assetVersion}">
  <link rel="stylesheet" href="${assetPrefix}assets/solution-detail.css?v=${assetVersion}">
  ${isEnglish ? "" : `<link rel="stylesheet" href="assets/visual-refinement.css?v=${refinementAssetVersion}">`}
  ${block}`;
}

function renderSolutionDocument(page, { header, footer, locale }) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const main = renderSolutionMain(page, { icon, escapeHtml, locale: isEnglish ? "en" : "zh-CN" });
  return `<!doctype html>
<html lang="${isEnglish ? "en" : "zh-CN"}">
<head>${renderSolutionHead(page, locale)}</head>
<body class="${isEnglish ? "locale-en" : "site-refined"}" data-solution="${escapeHtml(page.key)}">
  <div class="page">
    ${header}
    ${main}
    ${footer}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="${assetPrefix}assets/product-static.js?v=${assetVersion}"></script>
</body>
</html>`;
}

async function renderSolutionPages() {
  const productSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
  const shellContext = {
    console,
    document: { body: { dataset: { product: "tunnel" } } },
    encodeURIComponent,
    globalThis: null,
    __STATIC_RENDER__: true
  };
  shellContext.globalThis = shellContext;
  vm.createContext(shellContext);
  vm.runInContext(`${productSource}
;globalThis.__SOLUTION_HEADER__ = headerMarkup();
globalThis.__SOLUTION_FOOTER__ = footerMarkup();`, shellContext);

  const chineseHeader = activateSolutionNavigation(shellContext.__SOLUTION_HEADER__);
  const chineseFooter = shellContext.__SOLUTION_FOOTER__;
  const englishDir = path.join(rootDir, "en");
  await mkdir(englishDir, { recursive: true });

  for (const key of solutionOrder) {
    const chinesePage = solutionsZh[key];
    const englishPage = solutionsEn[key];
    const pageHeader = chinesePage.file === "ai-data.html"
      ? chineseHeader
      : markMegaLinkCurrent(chineseHeader, chinesePage.file);
    const englishHeaderMarkup = englishHeader(englishPage)
      .replace('class="nav-trigger is-active"', 'class="nav-trigger"')
      .replace('<a href="high-bandwidth-proxy.html">AI data infrastructure</a>', '<a class="nav-direct is-active" href="ai-data.html">AI data infrastructure</a>');
    await writeFile(
      path.join(rootDir, chinesePage.file),
      renderSolutionDocument(chinesePage, { header: pageHeader, footer: chineseFooter, locale: "zh-CN" }),
      "utf8"
    );
    await writeFile(
      path.join(englishDir, englishPage.file),
      renderSolutionDocument(englishPage, { header: englishHeaderMarkup, footer: englishFooter(), locale: "en" }),
      "utf8"
    );
  }
}

function activateEnterpriseNavigation(header) {
  return clearProductMenuCurrent(header)
    .replace(
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">代理产品',
      '<button class="nav-trigger" type="button" aria-expanded="false">代理产品'
    )
    .replace(
      '<button class="nav-trigger" type="button" aria-expanded="false">企业服务',
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">企业服务'
    );
}

function renderEnterpriseHead(page, locale) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const canonicalPath = isEnglish ? `/en/${page.file}` : `/${page.file}`;
  const alternatePath = isEnglish ? `/${page.zhFile}` : `/en/${page.file}`;
  const block = seoBlock({
    title: page.title,
    description: page.description,
    canonicalPath,
    alternatePath,
    locale: isEnglish ? "en" : "zh-CN",
    page,
    faqs: page.faqs
  });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}assets/favicon.svg">
  <meta name="description" content="${escapeHtml(page.description)}">
  <title>${escapeHtml(page.title)}</title>
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="stylesheet" href="${assetPrefix}assets/product-detail.css?v=${assetVersion}">
  <link rel="stylesheet" href="${assetPrefix}assets/enterprise-detail.css?v=${assetVersion}">
  ${isEnglish ? "" : `<link rel="stylesheet" href="assets/visual-refinement.css?v=${refinementAssetVersion}">`}
  ${block}`;
}

function renderEnterpriseDocument(page, { header, footer, locale }) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const main = renderEnterpriseMain(page, { icon, escapeHtml, locale: isEnglish ? "en" : "zh-CN" });
  return `<!doctype html>
<html lang="${isEnglish ? "en" : "zh-CN"}">
<head>${renderEnterpriseHead(page, locale)}</head>
<body class="${isEnglish ? "locale-en" : "site-refined"}" data-enterprise="${escapeHtml(page.key)}">
  <div class="page">
    ${header}
    ${main}
    ${footer}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="${assetPrefix}assets/product-static.js?v=${assetVersion}"></script>
</body>
</html>`;
}

async function renderEnterprisePages() {
  const productSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
  const shellContext = {
    console,
    document: { body: { dataset: { product: "tunnel" } } },
    encodeURIComponent,
    globalThis: null,
    __STATIC_RENDER__: true
  };
  shellContext.globalThis = shellContext;
  vm.createContext(shellContext);
  vm.runInContext(`${productSource}
;globalThis.__ENTERPRISE_HEADER__ = headerMarkup();
globalThis.__ENTERPRISE_FOOTER__ = footerMarkup();`, shellContext);

  const chineseHeader = activateEnterpriseNavigation(shellContext.__ENTERPRISE_HEADER__);
  const chineseFooter = shellContext.__ENTERPRISE_FOOTER__;
  const englishDir = path.join(rootDir, "en");
  await mkdir(englishDir, { recursive: true });

  for (const key of enterpriseOrder) {
    const chinesePage = enterpriseZh[key];
    const englishPage = enterpriseEn[key];
    const pageHeader = chinesePage.file === "enterprise.html"
      ? chineseHeader
      : markMegaLinkCurrent(chineseHeader, chinesePage.file);
    const englishHeaderMarkup = englishHeader(englishPage)
      .replace('class="nav-trigger is-active"', 'class="nav-trigger"')
      .replace('<a href="enterprise.html">Enterprise</a>', '<a class="nav-direct is-active" href="enterprise.html">Enterprise</a>');
    await writeFile(
      path.join(rootDir, chinesePage.file),
      renderEnterpriseDocument(chinesePage, { header: pageHeader, footer: chineseFooter, locale: "zh-CN" }),
      "utf8"
    );
    await writeFile(
      path.join(englishDir, englishPage.file),
      renderEnterpriseDocument(englishPage, { header: englishHeaderMarkup, footer: englishFooter(), locale: "en" }),
      "utf8"
    );
  }
}

function activateNetworkNavigation(header) {
  return clearProductMenuCurrent(header)
    .replace(
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">代理产品',
      '<button class="nav-trigger" type="button" aria-expanded="false">代理产品'
    )
    .replace(
      '<a href="global-network.html">全球网络</a>',
      '<a class="nav-direct is-active" href="global-network.html" aria-current="page">全球网络</a>'
    );
}

function renderNetworkHead(page, locale) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const canonicalPath = isEnglish ? `/en/${page.file}` : `/${page.file}`;
  const alternatePath = isEnglish ? `/${page.zhFile}` : `/en/${page.file}`;
  const block = seoBlock({
    title: page.title,
    description: page.description,
    canonicalPath,
    alternatePath,
    locale: isEnglish ? "en" : "zh-CN",
    page,
    faqs: page.faqs
  });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}assets/favicon.svg">
  <meta name="description" content="${escapeHtml(page.description)}">
  <title>${escapeHtml(page.title)}</title>
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="preload" as="image" href="${assetPrefix}assets/global-network-map.png">
  <link rel="stylesheet" href="${assetPrefix}assets/product-detail.css?v=${assetVersion}">
  <link rel="stylesheet" href="${assetPrefix}assets/network-detail.css?v=${assetVersion}">
  ${isEnglish ? "" : `<link rel="stylesheet" href="assets/visual-refinement.css?v=${refinementAssetVersion}">`}
  ${block}`;
}

function renderNetworkDocument(page, { header, footer, locale }) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const main = renderNetworkMain(page, {
    icon,
    escapeHtml,
    locale: isEnglish ? "en" : "zh-CN",
    assetPrefix
  });
  return `<!doctype html>
<html lang="${isEnglish ? "en" : "zh-CN"}">
<head>${renderNetworkHead(page, locale)}</head>
<body class="${isEnglish ? "locale-en" : "site-refined"}" data-network="${escapeHtml(page.key)}">
  <div class="page">
    ${header}
    ${main}
    ${footer}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="${assetPrefix}assets/product-static.js?v=${assetVersion}"></script>
</body>
</html>`;
}

async function renderNetworkPages() {
  const productSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
  const shellContext = {
    console,
    document: { body: { dataset: { product: "tunnel" } } },
    encodeURIComponent,
    globalThis: null,
    __STATIC_RENDER__: true
  };
  shellContext.globalThis = shellContext;
  vm.createContext(shellContext);
  vm.runInContext(`${productSource}
;globalThis.__NETWORK_HEADER__ = headerMarkup();
globalThis.__NETWORK_FOOTER__ = footerMarkup();`, shellContext);

  const chineseHeader = activateNetworkNavigation(shellContext.__NETWORK_HEADER__);
  const englishHeaderMarkup = englishHeader(networkEn)
    .replace('class="nav-trigger is-active"', 'class="nav-trigger"')
    .replace(
      '<a href="global-network.html">Global network</a>',
      '<a class="nav-direct is-active" href="global-network.html" aria-current="page">Global network</a>'
    );
  const englishDir = path.join(rootDir, "en");
  await mkdir(englishDir, { recursive: true });

  await writeFile(
    path.join(rootDir, networkZh.file),
    renderNetworkDocument(networkZh, {
      header: chineseHeader,
      footer: shellContext.__NETWORK_FOOTER__,
      locale: "zh-CN"
    }),
    "utf8"
  );
  await writeFile(
    path.join(englishDir, networkEn.file),
    renderNetworkDocument(networkEn, {
      header: englishHeaderMarkup,
      footer: englishFooter(),
      locale: "en"
    }),
    "utf8"
  );
}

function activatePricingNavigation(header) {
  return clearProductMenuCurrent(header)
    .replace(
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">代理产品',
      '<button class="nav-trigger" type="button" aria-expanded="false">代理产品'
    )
    .replace(
      '<button class="nav-trigger" type="button" aria-expanded="false">价格',
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">价格'
    );
}

function renderPricingHead(page, locale) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const canonicalPath = isEnglish ? `/en/${page.file}` : `/${page.file}`;
  const alternatePath = isEnglish ? `/${page.zhFile}` : `/en/${page.file}`;
  const block = seoBlock({
    title: page.title,
    description: page.description,
    canonicalPath,
    alternatePath,
    locale: isEnglish ? "en" : "zh-CN",
    page,
    faqs: page.faqs
  });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}assets/favicon.svg">
  <meta name="description" content="${escapeHtml(page.description)}">
  <title>${escapeHtml(page.title)}</title>
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="stylesheet" href="${assetPrefix}assets/product-detail.css?v=${pricingAssetVersion}">
  <link rel="stylesheet" href="${assetPrefix}assets/pricing-detail.css?v=${pricingAssetVersion}">
  ${isEnglish ? "" : `<link rel="stylesheet" href="assets/visual-refinement.css?v=${refinementAssetVersion}">`}
  ${block}`;
}

function renderPricingDocument(page, { header, footer, locale }) {
  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../" : "";
  const main = renderPricingMain(page, { icon, escapeHtml, locale: isEnglish ? "en" : "zh-CN" });
  return `<!doctype html>
<html lang="${isEnglish ? "en" : "zh-CN"}">
<head>${renderPricingHead(page, locale)}</head>
<body class="${isEnglish ? "locale-en" : "pricing-refined site-refined"}" data-pricing="${escapeHtml(page.key)}">
  <div class="page">
    ${header}
    ${main}
    ${footer}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="${assetPrefix}assets/product-static.js?v=${pricingAssetVersion}"></script>
  <script src="${assetPrefix}assets/pricing.js?v=${pricingAssetVersion}"></script>
</body>
</html>`;
}

async function renderPricingPages() {
  const productSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
  const shellContext = {
    console,
    document: { body: { dataset: { product: "tunnel" } } },
    encodeURIComponent,
    globalThis: null,
    __STATIC_RENDER__: true
  };
  shellContext.globalThis = shellContext;
  vm.createContext(shellContext);
  vm.runInContext(`${productSource}
;globalThis.__PRICING_HEADER__ = headerMarkup();
globalThis.__PRICING_FOOTER__ = footerMarkup();`, shellContext);

  const chineseHeader = activatePricingNavigation(shellContext.__PRICING_HEADER__);
  const englishHeaderMarkup = englishHeader(pricingEn)
    .replace('class="nav-trigger is-active"', 'class="nav-trigger"')
    .replace(
      '<button class="nav-trigger" type="button" aria-expanded="false">Pricing',
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">Pricing'
    );
  const englishDir = path.join(rootDir, "en");
  await mkdir(englishDir, { recursive: true });

  await writeFile(
    path.join(rootDir, pricingZh.file),
    renderPricingDocument(pricingZh, {
      header: chineseHeader,
      footer: shellContext.__PRICING_FOOTER__,
      locale: "zh-CN"
    }),
    "utf8"
  );
  await writeFile(
    path.join(englishDir, pricingEn.file),
    renderPricingDocument(pricingEn, {
      header: englishHeaderMarkup,
      footer: englishFooter(),
      locale: "en"
    }),
    "utf8"
  );
}

async function renderStatusPages() {
  const productSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
  const shellContext = {
    console,
    document: { body: { dataset: { product: "tunnel" } } },
    encodeURIComponent,
    globalThis: null,
    __STATIC_RENDER__: true
  };
  shellContext.globalThis = shellContext;
  vm.createContext(shellContext);
  vm.runInContext(`${productSource}
;globalThis.__STATUS_HEADER__ = headerMarkup();
globalThis.__STATUS_FOOTER__ = footerMarkup();`, shellContext);

  const header = shellContext.__STATUS_HEADER__
    .replace('class="nav-trigger is-active"', 'class="nav-trigger"')
    .replace(
      '<a class="utility-link" href="/status/">服务状态</a>',
      '<a class="utility-link is-active" href="/status/" aria-current="page">服务状态</a>'
    );
  const outputPath = path.join(rootDir, statusZh.file);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    renderStatusDocument(statusZh, {
      header,
      footer: shellContext.__STATUS_FOOTER__,
      siteUrl,
      assetVersion
    }),
    "utf8"
  );
}

function activateContactNavigation(header) {
  return clearProductMenuCurrent(header)
    .replace(
      '<button class="nav-trigger is-active" type="button" aria-expanded="false">代理产品',
      '<button class="nav-trigger" type="button" aria-expanded="false">代理产品'
    )
    .replace(
      '<a class="utility-link" href="contact.html">联系我们</a>',
      '<a class="utility-link is-active" href="contact.html" aria-current="page">联系我们</a>'
    );
}

function renderContactHead(page) {
  const canonical = `${siteUrl}${page.route}`;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "123Proxy",
        url: `${siteUrl}/`,
        email: "sales@123proxy.cn",
        logo: `${siteUrl}/assets/original-123proxy-logo-final.jpg`,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "技术与企业方案",
            url: `${canonical}#solutions`,
            availableLanguage: ["zh-CN"]
          },
          {
            "@type": "ContactPoint",
            contactType: "客户服务",
            url: `${canonical}#service`,
            availableLanguage: ["zh-CN"]
          }
        ]
      },
      {
        "@type": "ContactPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: page.description,
        inLanguage: "zh-CN",
        about: { "@id": `${siteUrl}/#organization` }
      }
    ]
  });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <meta name="description" content="${escapeHtml(page.description)}">
  <title>${escapeHtml(page.title)}</title>
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="123Proxy">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="stylesheet" href="assets/product-detail.css?v=${assetVersion}">
  <link rel="stylesheet" href="assets/contact.css?v=${assetVersion}">
  <link rel="stylesheet" href="assets/visual-refinement.css?v=${refinementAssetVersion}">
  <script type="application/ld+json">${schema}</script>`;
}

function renderContactDocument(page, { header, footer }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>${renderContactHead(page)}</head>
<body class="site-refined" data-contact-page>
  <div class="page">
    ${header}
    ${renderContactMain({ icon })}
    ${footer}
  </div>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="assets/product-static.js?v=${assetVersion}"></script>
</body>
</html>`;
}

async function renderContactPage() {
  const productSource = await readFile(path.join(rootDir, "assets", "product-detail.js"), "utf8");
  const shellContext = {
    console,
    document: { body: { dataset: { product: "tunnel" } } },
    encodeURIComponent,
    globalThis: null,
    __STATIC_RENDER__: true
  };
  shellContext.globalThis = shellContext;
  vm.createContext(shellContext);
  vm.runInContext(`${productSource}
;globalThis.__CONTACT_HEADER__ = headerMarkup();
globalThis.__CONTACT_FOOTER__ = footerMarkup();`, shellContext);

  await writeFile(
    path.join(rootDir, contactZh.file),
    renderContactDocument(contactZh, {
      header: activateContactNavigation(shellContext.__CONTACT_HEADER__),
      footer: shellContext.__CONTACT_FOOTER__
    }),
    "utf8"
  );
}

async function patchChineseStaticPage(file, { name, alternateFile, isHome = false }) {
  const filePath = path.join(rootDir, file);
  let html = await readFile(filePath, "utf8");
  const title = readMeta(html, "title");
  const description = readMeta(html, "description");
  const canonicalPath = isHome ? "/" : `/${file}`;
  const alternatePath = isHome ? "/en/" : `/en/${alternateFile}`;
  html = upsertSeo(html, seoBlock({
    title,
    description,
    canonicalPath,
    alternatePath,
    locale: "zh-CN",
    page: { name, description, file, zhFile: file },
    isHome
  }));
  html = upsertFavicon(html, "assets/favicon.svg");
  await writeFile(filePath, html, "utf8");
}

function publicRoutePairs() {
  return [
    ["/", "/en/"],
    ["/high-bandwidth-proxy.html", "/en/high-bandwidth-proxy.html"],
    ...chineseProducts.map(([, file]) => [`/${file}`, `/en/${file}`]),
    ...solutionFiles.map((file) => [`/${file}`, `/en/${file}`]),
    ...enterpriseFiles.map((file) => [`/${file}`, `/en/${file}`]),
    ...networkFiles.map((file) => [`/${file}`, `/en/${file}`]),
    ...pricingFiles.map((file) => [`/${file}`, `/en/${file}`])
  ];
}

function fileFromPublicRoute(route) {
  if (route === "/") return "index.html";
  if (route.endsWith("/")) return path.join(...route.slice(1, -1).split("/"), "index.html");
  return path.join(...route.slice(1).split("/"));
}

async function applyGoogleTagToPublicPages() {
  const routes = new Set([
    ...publicRoutePairs().flat(),
    statusZh.route,
    contactZh.route,
    ...developerRoutes
  ]);

  for (const route of routes) {
    const filePath = path.join(rootDir, fileFromPublicRoute(route));
    const html = await readFile(filePath, "utf8");
    await writeFile(filePath, upsertGoogleTag(html), "utf8");
  }
}

async function applyGoogleTagToConsolePages() {
  const consolePages = [
    "login.html",
    "register.html",
    "forgot-password.html",
    "agency-login.html",
    "agency-manager.html",
    path.join("app", "index.html")
  ];

  for (const file of consolePages) {
    const filePath = path.join(rootDir, "console", file);
    const html = await readFile(filePath, "utf8");
    await writeFile(filePath, upsertGoogleTag(html), "utf8");
  }
}

async function syncGoogleAdsConversionAsset() {
  await copyFile(
    path.join(rootDir, "assets", "google-ads.js"),
    path.join(rootDir, "console", "assets", "google-ads.js")
  );
}

function sitemapEntry(zhPath, enPath) {
  const zhLastmod = lastModifiedForRoute(zhPath);
  const enLastmod = lastModifiedForRoute(enPath);
  return `  <url>
    <loc>${siteUrl}${zhPath}</loc>
    <lastmod>${zhLastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${siteUrl}${zhPath}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${enPath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${zhPath}"/>
  </url>
  <url>
    <loc>${siteUrl}${enPath}</loc>
    <lastmod>${enLastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${siteUrl}${zhPath}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${enPath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${zhPath}"/>
  </url>`;
}

function sitemapSingleEntry(route) {
  return `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${lastModifiedForRoute(route)}</lastmod>
  </url>`;
}

async function renderDeveloperPages() {
  for (const key of developerOrder) {
    const page = developerPages[key];
    const outputPath = path.join(rootDir, page.output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(
      outputPath,
      renderDeveloperDocument(page, { siteUrl, assetVersion }),
      "utf8"
    );
  }
}

async function writeDiscoveryFiles() {
  const routePairs = publicRoutePairs();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routePairs.map(([zhPath, enPath]) => sitemapEntry(zhPath, enPath)).join("\n")}
${sitemapSingleEntry(statusZh.route)}
${sitemapSingleEntry(contactZh.route)}
${developerRoutes.map((route) => sitemapSingleEntry(route)).join("\n")}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  await writeFile(path.join(rootDir, "sitemap.xml"), sitemap, "utf8");
  await writeFile(path.join(rootDir, "robots.txt"), robots, "utf8");
}

async function build() {
  await renderChineseProductPages();
  await patchChineseStaticPage("index.html", { name: "123Proxy", alternateFile: "index.html", isHome: true });
  await patchChineseStaticPage("high-bandwidth-proxy.html", { name: "高带宽代理 IP", alternateFile: "high-bandwidth-proxy.html" });

  const englishDir = path.join(rootDir, "en");
  await mkdir(englishDir, { recursive: true });
  await writeFile(path.join(englishDir, "index.html"), renderEnglishHome(), "utf8");
  for (const key of englishProductOrder) {
    const product = englishProducts[key];
    await writeFile(path.join(englishDir, product.file), renderEnglishProduct(product), "utf8");
  }
  await renderSolutionPages();
  await renderEnterprisePages();
  await renderNetworkPages();
  await renderPricingPages();
  await renderStatusPages();
  await renderContactPage();
  await renderDeveloperPages();
  await syncGoogleAdsConversionAsset();
  await applyGoogleTagToPublicPages();
  await applyGoogleTagToConsolePages();
  await writeDiscoveryFiles();
}

await build();
const publicRouteCount = 2 + chineseProducts.length + solutionFiles.length + enterpriseFiles.length + networkFiles.length + pricingFiles.length;
console.log(`Static build complete: ${publicRouteCount} Chinese routes, ${publicRouteCount} English routes, ${statusFiles.length} status route, ${contactFiles.length} contact route, ${developerFiles.length} developer routes, sitemap.xml, robots.txt`);
