import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const skippedDirectories = new Set([".git", "deploy", "dist", "node_modules"]);
const checkedExtensions = new Set([".html", ".js", ".mjs", ".json", ".xml"]);
const ambiguousTerm = String.fromCodePoint(0x91c7, 0x96c6);

function listFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (skippedDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      listFiles(absolutePath, files);
    } else if (checkedExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }
  return files;
}

const violations = [];
for (const file of listFiles(root)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes(ambiguousTerm)) {
      violations.push(`${path.relative(root, file)}:${index + 1}`);
    }
  });
}

assert.equal(
  violations.length,
  0,
  `Ambiguous crawler terminology remains in:\n${violations.join("\n")}`,
);

console.log("Crawler terminology check passed.");
