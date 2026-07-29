function usableToken(value) {
  const token = String(value || "").trim();
  if (!token || token === "replace-me" || token.startsWith("replace-with-")) return "";
  return token;
}

function pushStatus(component) {
  return component.status === "operational" || component.status === "maintenance"
    ? "up"
    : "down";
}

export async function pushComponentToKuma(component, {
  env = process.env,
  baseUrl = env.KUMA_PUSH_BASE_URL || "http://uptime-kuma:3001/api/push",
  timeoutMs = 5000,
  fetchImpl = fetch
} = {}) {
  const token = usableToken(env[component._pushTokenEnv]);
  if (!token) {
    return { id: component.id, pushed: false, reason: "token is not configured" };
  }

  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${encodeURIComponent(token)}`);
  url.searchParams.set("status", pushStatus(component));
  url.searchParams.set("msg", component._internalMessage || component.message || component.status);
  if (Number.isFinite(component.latencyMs)) {
    url.searchParams.set("ping", String(component.latencyMs));
  }

  const response = await fetchImpl(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!response.ok) throw new Error(`Kuma returned HTTP ${response.status}`);
  return { id: component.id, pushed: true, reason: "" };
}

export async function pushComponentsToKuma(components, options = {}) {
  const results = await Promise.allSettled(
    components.map((component) => pushComponentToKuma(component, options))
  );
  return results.map((result, index) => (
    result.status === "fulfilled"
      ? result.value
      : {
          id: components[index].id,
          pushed: false,
          reason: result.reason?.message || "Kuma push failed"
        }
  ));
}

