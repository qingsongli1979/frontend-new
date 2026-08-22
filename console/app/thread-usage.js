import { isHighBandwidthPackage } from "./package-classification.js?v=20260818-01";
import { consoleTimestamp } from "./date-time.js?v=20260818-03";

const DEFAULT_RANGE_HOURS = 12;
const DEFAULT_INTERVAL_MS = 60 * 1000;
const HIGH_BANDWIDTH_THRESHOLD = 2000;

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function unwrap(payload) {
  if (!payload || typeof payload !== "object") return payload;
  return payload.res ?? payload.data ?? payload;
}

function timestamp(value) {
  const numeric = numberOrNull(value);
  if (numeric !== null) {
    return numeric > 0 && numeric < 100000000000 ? numeric * 1000 : numeric;
  }
  return consoleTimestamp(value);
}

function normalizeRealtimeThreads(payload) {
  const source = unwrap(payload);
  const value = typeof source === "object" && source !== null
    ? source.current ?? source.conns ?? source.threads ?? source.value
    : source;
  const parsed = numberOrNull(value);
  return parsed === null ? null : Math.max(0, Math.round(parsed));
}

function normalizeThreadHistory(payload, options = {}) {
  const source = unwrap(payload) || {};
  const rangeHours = Math.max(1, numberOrNull(options.rangeHours) || DEFAULT_RANGE_HOURS);
  const observedAt = timestamp(source.observedAt) || numberOrNull(options.now) || Date.now();
  const startTime = timestamp(source.startTime) || observedAt - rangeHours * 60 * 60 * 1000;
  const intervalMs = Math.max(
    1000,
    (numberOrNull(source.intervalSeconds) || DEFAULT_INTERVAL_MS / 1000) * 1000
  );
  const rawSamples = Array.isArray(source.samples)
    ? source.samples
    : Array.isArray(source.points) ? source.points : [];
  const byBucket = new Map();

  rawSamples.forEach((sample) => {
    const sampledAt = timestamp(sample?.timestamp ?? sample?.sampledAt ?? sample?.time);
    const conns = numberOrNull(sample?.conns ?? sample?.threads ?? sample?.value);
    if (sampledAt === null || conns === null || sampledAt < startTime || sampledAt > observedAt + intervalMs) return;
    const bucket = Math.floor(sampledAt / intervalMs) * intervalMs;
    byBucket.set(bucket, Math.max(0, Math.round(conns)));
  });

  const firstBucket = Math.ceil(startTime / intervalMs) * intervalMs;
  const lastBucket = Math.floor(observedAt / intervalMs) * intervalMs;
  const samples = [];
  for (let cursor = firstBucket; cursor <= lastBucket; cursor += intervalMs) {
    samples.push({ timestamp: cursor, conns: byBucket.has(cursor) ? byBucket.get(cursor) : null });
  }
  const values = samples.map((sample) => sample.conns).filter((value) => value !== null);
  const current = normalizeRealtimeThreads(source);
  return {
    current,
    observedAt,
    startTime,
    intervalMs,
    samples,
    peak: values.length ? Math.max(...values) : null,
    average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
    sampleCount: values.length
  };
}

function isExpired(order, now = Date.now()) {
  if ([true, "true", 1, "1"].includes(order?.overTime)) return true;
  const expiration = consoleTimestamp(
    order?.expirationTime ?? order?.expiration ?? order?.expirationTimestamp ?? order?.expirationStr
  );
  return expiration !== null && expiration < now;
}

function standardConcurrencyCapacity(orders, now = Date.now()) {
  return (Array.isArray(orders) ? orders : [])
    .filter((order) => order?.chargeType === "tunnelIp")
    .filter((order) => !isExpired(order, now))
    .filter((order) => !isHighBandwidthPackage(order))
    .map((order) => Math.max(0, numberOrNull(order?.total) || 0))
    .filter((total) => total > 0 && total < HIGH_BANDWIDTH_THRESHOLD)
    .reduce((sum, total) => sum + total, 0);
}

function formatTime(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(value));
}

function drawThreadUsageChart(canvas, model, capacity) {
  if (!canvas || !model) return;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width || canvas.clientWidth || 720));
  const height = Math.max(180, Math.round(rect.height || canvas.clientHeight || 220));
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const padding = { top: 16, right: 14, bottom: 28, left: 42 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const values = model.samples.map((sample) => sample.conns).filter((value) => value !== null);
  const maxValue = Math.max(1, capacity || 0, model.current || 0, ...values);
  const yMax = Math.ceil(maxValue * 1.12);

  context.lineWidth = 1;
  context.font = "11px ui-monospace, SFMono-Regular, Consolas, monospace";
  context.fillStyle = "#7c8ca1";
  context.strokeStyle = "#e4eaf1";
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (let index = 0; index <= 3; index += 1) {
    const y = padding.top + plotHeight * index / 3;
    const label = Math.round(yMax * (1 - index / 3));
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.fillText(String(label), padding.left - 8, y);
  }

  if (capacity > 0) {
    const y = padding.top + plotHeight * (1 - Math.min(1, capacity / yMax));
    context.save();
    context.setLineDash([5, 5]);
    context.strokeStyle = "#91a4bb";
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.restore();
  }

  const points = model.samples;
  const xFor = (index) => padding.left + (points.length <= 1 ? 0 : plotWidth * index / (points.length - 1));
  const yFor = (value) => padding.top + plotHeight * (1 - Math.min(1, value / yMax));
  context.lineWidth = 2;
  context.strokeStyle = "#245af4";
  context.beginPath();
  let drawing = false;
  points.forEach((point, index) => {
    if (point.conns === null) {
      drawing = false;
      return;
    }
    const x = xFor(index);
    const y = yFor(point.conns);
    if (!drawing) context.moveTo(x, y);
    else context.lineTo(x, y);
    drawing = true;
  });
  context.stroke();

  if (points.length) {
    context.fillStyle = "#7c8ca1";
    context.textBaseline = "bottom";
    const labels = [
      { index: 0, align: "left" },
      { index: Math.floor((points.length - 1) / 2), align: "center" },
      { index: points.length - 1, align: "right" }
    ];
    labels.forEach(({ index, align }) => {
      context.textAlign = align;
      context.fillText(formatTime(points[index].timestamp), xFor(index), height - 3);
    });
  }
}

export {
  drawThreadUsageChart,
  normalizeRealtimeThreads,
  normalizeThreadHistory,
  standardConcurrencyCapacity
};
