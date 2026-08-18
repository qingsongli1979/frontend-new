function normalizedDate(value) {
  if (value instanceof Date) return value;
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" || /^\d+$/.test(String(value).trim())) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return new Date(numeric < 100000000000 ? numeric * 1000 : numeric);
    }
  }

  const normalized = String(value).trim().replace(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)/,
    "$1T$2"
  );
  return new Date(normalized);
}

function consoleTimestamp(value) {
  const date = normalizedDate(value);
  const timestamp = date?.getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "本地时间";
  } catch {
    return "本地时间";
  }
}

function formatConsoleDateTime(value, fallback = "--") {
  const timestamp = consoleTimestamp(value);
  if (timestamp === null) return fallback;
  const timeZone = browserTimeZone();
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    ...(timeZone === "本地时间" ? {} : { timeZone })
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(timestamp))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

export {
  browserTimeZone,
  consoleTimestamp,
  formatConsoleDateTime
};
