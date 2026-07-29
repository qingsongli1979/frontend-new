import { readFile } from "node:fs/promises";

export const PUBLIC_COMPONENT_IDS = [
  "proxy-tunnel",
  "proxy-residential",
  "proxy-unlimited",
  "gateway-us",
  "gateway-eu",
  "gateway-asia",
  "website",
  "console",
  "api"
];

const PUBLIC_COMPONENT_ID_SET = new Set(PUBLIC_COMPONENT_IDS);

function requiredString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function uniqueBy(items, property, label) {
  const seen = new Set();
  for (const item of items) {
    const value = item[property];
    if (seen.has(value)) throw new Error(`${label} contains duplicate ${property}: ${value}`);
    seen.add(value);
  }
}

function validateHttpUrl(value, label, { proxyTarget = false } = {}) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} is not a valid URL`);
  }

  const protocols = proxyTarget ? ["http:"] : ["http:", "https:"];
  if (!protocols.includes(url.protocol)) {
    const supported = protocols.map((protocol) => protocol.replace(":", "")).join(" or ");
    throw new Error(`${label} must use ${supported}`);
  }
  return url.href;
}

function resolveProxyTargets(rawConfig, env) {
  const fromEnvironment = String(env.PROBE_TARGET_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const source = fromEnvironment.length
    ? fromEnvironment
    : (rawConfig.proxyTargets || []).map((target) => target.url);

  if (source.length === 0) {
    throw new Error("At least one proxy target URL is required");
  }

  return source.map((url, index) => (
    validateHttpUrl(url, `proxyTargets[${index}]`, { proxyTarget: true })
  ));
}

function resolveServiceChecks(rawChecks, env) {
  return rawChecks.map((check, index) => {
    const id = requiredString(check.id, `serviceChecks[${index}].id`);
    const name = requiredString(check.name, `serviceChecks[${index}].name`);
    const configured = check.urlEnv ? env[check.urlEnv] : "";
    const rawUrl = String(configured || check.defaultUrl || "").trim();
    const expectText = check.expectText === undefined
      ? ""
      : requiredString(check.expectText, `serviceChecks[${index}].expectText`);
    if (check.expectJson === true && expectText) {
      throw new Error(`serviceChecks[${index}] cannot use expectJson and expectText together`);
    }
    let auth = null;
    if (check.auth) {
      const type = requiredString(check.auth.type, `serviceChecks[${index}].auth.type`);
      if (type !== "bearer") {
        throw new Error(`serviceChecks[${index}].auth.type must be bearer`);
      }
      const tokenEnv = requiredString(
        check.auth.tokenEnv,
        `serviceChecks[${index}].auth.tokenEnv`
      );
      auth = {
        type,
        tokenEnv,
        token: String(env[tokenEnv] || "").trim()
      };
    }
    return {
      id,
      name,
      urlEnv: check.urlEnv || "",
      url: rawUrl ? validateHttpUrl(rawUrl, `serviceChecks[${index}].url`) : "",
      expectJson: check.expectJson === true,
      expectText,
      auth
    };
  });
}

function validateProxyChecks(rawChecks) {
  return rawChecks.map((check, index) => {
    const port = Number(check.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`proxyChecks[${index}].port must be between 1 and 65535`);
    }
    return {
      id: requiredString(check.id, `proxyChecks[${index}].id`),
      name: requiredString(check.name, `proxyChecks[${index}].name`),
      host: requiredString(check.host, `proxyChecks[${index}].host`),
      port,
      product: requiredString(check.product, `proxyChecks[${index}].product`),
      region: requiredString(check.region, `proxyChecks[${index}].region`)
    };
  });
}

function validateComponents(rawComponents, proxyChecks, serviceChecks) {
  const proxyValues = {
    product: new Set(proxyChecks.map((check) => check.product)),
    region: new Set(proxyChecks.map((check) => check.region))
  };
  const serviceIds = new Set(serviceChecks.map((check) => check.id));

  const components = rawComponents.map((component, index) => {
    const id = requiredString(component.id, `components[${index}].id`);
    if (!PUBLIC_COMPONENT_ID_SET.has(id)) {
      throw new Error(`components[${index}].id is not part of the public contract: ${id}`);
    }

    const base = {
      id,
      name: requiredString(component.name, `components[${index}].name`),
      kind: requiredString(component.kind, `components[${index}].kind`),
      pushTokenEnv: requiredString(component.pushTokenEnv, `components[${index}].pushTokenEnv`)
    };

    if (base.kind === "proxy-group") {
      const selector = requiredString(component.selector, `components[${index}].selector`);
      const value = requiredString(component.value, `components[${index}].value`);
      if (!Object.hasOwn(proxyValues, selector) || !proxyValues[selector].has(value)) {
        throw new Error(`components[${index}] does not match any proxy checks`);
      }
      return { ...base, selector, value };
    }

    if (base.kind === "service") {
      const serviceCheck = requiredString(
        component.serviceCheck,
        `components[${index}].serviceCheck`
      );
      if (!serviceIds.has(serviceCheck)) {
        throw new Error(`components[${index}] references an unknown service check`);
      }
      return { ...base, serviceCheck };
    }

    throw new Error(`components[${index}].kind must be proxy-group or service`);
  });

  uniqueBy(components, "id", "components");
  const missing = PUBLIC_COMPONENT_IDS.filter((id) => !components.some((item) => item.id === id));
  if (missing.length) throw new Error(`Missing public components: ${missing.join(", ")}`);
  return components;
}

export async function loadMonitorConfig(filePath, env = process.env) {
  const rawConfig = JSON.parse(await readFile(filePath, "utf8"));
  const proxyChecks = validateProxyChecks(rawConfig.proxyChecks || []);
  const serviceChecks = resolveServiceChecks(rawConfig.serviceChecks || [], env);
  uniqueBy(proxyChecks, "id", "proxyChecks");
  uniqueBy(serviceChecks, "id", "serviceChecks");

  if (proxyChecks.length === 0) throw new Error("At least one proxy check is required");
  if (serviceChecks.length === 0) throw new Error("At least one service check is required");

  return {
    proxyTargets: resolveProxyTargets(rawConfig, env),
    proxyChecks,
    serviceChecks,
    components: validateComponents(rawConfig.components || [], proxyChecks, serviceChecks)
  };
}
