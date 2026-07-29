import { readFile } from "node:fs/promises";
import { SUPPORTED_STATUSES } from "./aggregate.mjs";

const EMPTY_EVENTS = {
  incidents: [],
  maintenance: [],
  componentOverrides: {}
};

function safeEntries(value) {
  return Array.isArray(value) ? value : [];
}

function safeOverrides(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, override]) => {
      const status = typeof override === "string" ? override : override?.status;
      return SUPPORTED_STATUSES.has(status);
    })
  );
}

export async function readPublicEvents(filePath) {
  if (!filePath) return EMPTY_EVENTS;
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    return {
      incidents: safeEntries(parsed.incidents),
      maintenance: safeEntries(parsed.maintenance),
      componentOverrides: safeOverrides(parsed.componentOverrides)
    };
  } catch (error) {
    if (error.code === "ENOENT") return EMPTY_EVENTS;
    throw error;
  }
}

