import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { worstDailyStatus } from "./aggregate.mjs";

function utcDay(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function cutoffDay(now, days) {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - (days - 1));
  return utcDay(date);
}

export class StatusStateStore {
  constructor(filePath, { historyDays = 90 } = {}) {
    this.filePath = filePath;
    this.historyDays = historyDays;
    this.state = { version: 1, days: {} };
  }

  async load() {
    try {
      const parsed = JSON.parse(await readFile(this.filePath, "utf8"));
      if (parsed?.version === 1 && parsed.days && typeof parsed.days === "object") {
        this.state = parsed;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  async record(components, generatedAt) {
    const dayKey = utcDay(generatedAt);
    const day = this.state.days[dayKey] || { components: {} };

    for (const component of components) {
      const previous = day.components[component.id] || {
        passed: 0,
        total: 0,
        samples: 0,
        status: "unknown"
      };
      previous.passed += component._availabilityPassed || 0;
      previous.total += component._availabilityTotal || 0;
      previous.samples += 1;
      previous.status = worstDailyStatus(previous.status, component.status);
      day.components[component.id] = previous;
    }

    this.state.days[dayKey] = day;
    const cutoff = cutoffDay(generatedAt, this.historyDays);
    for (const key of Object.keys(this.state.days)) {
      if (key < cutoff) delete this.state.days[key];
    }
    await this.save();
  }

  decorate(components) {
    const days = Object.keys(this.state.days).sort().slice(-this.historyDays);
    return components.map((component) => {
      let passed = 0;
      let total = 0;
      const history90d = [];

      for (const dayKey of days) {
        const entry = this.state.days[dayKey]?.components?.[component.id];
        if (!entry) continue;
        history90d.push(entry.status || "unknown");
        passed += Number(entry.passed) || 0;
        total += Number(entry.total) || 0;
      }

      return {
        ...component,
        uptime90d: total > 0 ? Number(((passed / total) * 100).toFixed(3)) : null,
        history90d
      };
    });
  }

  async save() {
    const directory = path.dirname(this.filePath);
    await mkdir(directory, { recursive: true });
    const temporary = `${this.filePath}.${process.pid}.tmp`;
    await writeFile(temporary, `${JSON.stringify(this.state)}\n`, {
      encoding: "utf8",
      mode: 0o600
    });
    await rename(temporary, this.filePath);
  }
}

