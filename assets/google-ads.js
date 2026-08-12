(function initializeGoogleAdsConversions(global) {
  "use strict";

  const DEFAULT_ADS_ID = "AW-11399174770";
  const EVENT_NAMES = Object.freeze({
    registration: "sign_up",
    trial: "generate_lead",
    consultation: "generate_lead",
    purchase: "purchase",
    recharge: "add_funds"
  });
  const STORAGE_PREFIX = "123proxy.google_ads.v1";
  const externalConfig = global.ProxyGoogleAdsConfig || {};
  const config = {
    adsId: String(externalConfig.adsId || DEFAULT_ADS_ID),
    labels: {
      registration: "",
      trial: "",
      consultation: "",
      purchase: "",
      recharge: "",
      ...(externalConfig.labels || {})
    }
  };

  global.dataLayer = global.dataLayer || [];
  global.gtag = global.gtag || function gtag() {
    global.dataLayer.push(arguments);
  };

  function storageFor(scope) {
    try {
      return scope === "session" ? global.sessionStorage : global.localStorage;
    } catch {
      return null;
    }
  }

  function storageKey(kind, type, dedupeKey) {
    return `${STORAGE_PREFIX}.${kind}.${type}.${dedupeKey}`;
  }

  function wasSent(kind, type, dedupeKey, scope) {
    if (!dedupeKey) return false;
    try {
      return storageFor(scope)?.getItem(storageKey(kind, type, dedupeKey)) === "1";
    } catch {
      return false;
    }
  }

  function markSent(kind, type, dedupeKey, scope) {
    if (!dedupeKey) return;
    try {
      storageFor(scope)?.setItem(storageKey(kind, type, dedupeKey), "1");
    } catch {
      // Conversion delivery must not interfere with the customer flow.
    }
  }

  function compactParameters(parameters) {
    return Object.fromEntries(Object.entries(parameters).filter(([, value]) => (
      value !== undefined && value !== null && value !== ""
    )));
  }

  function normalizedParameters(type, parameters) {
    const value = Number(parameters.value);
    const normalized = compactParameters({
      ...parameters,
      event_category: parameters.event_category || "google_ads",
      lead_type: parameters.lead_type || (type === "trial" ? "free_trial" : undefined),
      currency: Number.isFinite(value) && value >= 0 ? String(parameters.currency || "CNY") : undefined,
      value: Number.isFinite(value) && value >= 0 ? value : undefined
    });
    delete normalized.dedupe_key;
    delete normalized.dedupe_scope;
    return normalized;
  }

  function track(type, parameters = {}) {
    if (!Object.hasOwn(EVENT_NAMES, type)) return { eventSent: false, conversionSent: false };

    const dedupeKey = String(parameters.transaction_id || parameters.dedupe_key || "").trim();
    const dedupeScope = parameters.dedupe_scope === "session" ? "session" : "local";
    const eventParameters = normalizedParameters(type, parameters);
    let eventSent = false;
    let conversionSent = false;

    if (!wasSent("event", type, dedupeKey, dedupeScope)) {
      global.gtag("event", EVENT_NAMES[type], eventParameters);
      markSent("event", type, dedupeKey, dedupeScope);
      eventSent = true;
    }

    const label = String(config.labels[type] || "").trim();
    if (label && !wasSent(`conversion.${label}`, type, dedupeKey, dedupeScope)) {
      global.gtag("event", "conversion", {
        ...eventParameters,
        send_to: `${config.adsId}/${label}`,
        event_timeout: 2000,
        transport_type: "beacon"
      });
      markSent(`conversion.${label}`, type, dedupeKey, dedupeScope);
      conversionSent = true;
    }

    return { eventSent, conversionSent };
  }

  function conversionTypeForControl(control) {
    const requestedType = String(control.dataset.googleAdsConversion || "");
    const requiredIntent = String(control.dataset.googleAdsRequiresIntent || "");
    if (!requiredIntent) return requestedType;
    const currentIntent = new URL(global.location.href).searchParams.get("intent") || "";
    return currentIntent === requiredIntent ? requestedType : "";
  }

  function bindContactConversions() {
    global.document.addEventListener("click", (event) => {
      const control = event.target.closest?.("[data-google-ads-conversion]");
      if (!control) return;
      const type = conversionTypeForControl(control);
      if (!type) return;
      const channel = String(control.dataset.googleAdsChannel || "contact");
      track(type, {
        channel,
        source_page: global.location.pathname,
        dedupe_key: `${channel}:${global.location.pathname}`,
        dedupe_scope: "session"
      });
    });
  }

  global.ProxyGoogleAds = Object.freeze({
    config,
    track,
    registration: (parameters) => track("registration", parameters),
    trial: (parameters) => track("trial", parameters),
    consultation: (parameters) => track("consultation", parameters),
    purchase: (parameters) => track("purchase", parameters),
    recharge: (parameters) => track("recharge", parameters)
  });

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", bindContactConversions, { once: true });
  } else {
    bindContactConversions();
  }
})(window);
