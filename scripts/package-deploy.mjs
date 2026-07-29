import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const websiteDir = path.join(distDir, "www");
const consoleDir = path.join(distDir, "console");
const indexNowKey = process.env.INDEXNOW_KEY?.trim() || "";

if (indexNowKey && !/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) {
  throw new Error("INDEXNOW_KEY must contain 8-128 letters, numbers, or dashes.");
}

async function copy(source, destination) {
  await cp(path.join(rootDir, source), destination, {
    recursive: true,
    force: true
  });
}

async function countHtmlFiles(directory) {
  let count = 0;
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) count += await countHtmlFiles(entryPath);
    if (entry.isFile() && entry.name.endsWith(".html")) count += 1;
  }
  return count;
}

await rm(distDir, { recursive: true, force: true });
await mkdir(websiteDir, { recursive: true });
await mkdir(consoleDir, { recursive: true });

const rootEntries = await readdir(rootDir, { withFileTypes: true });
const websiteHtml = rootEntries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name)
  .filter((name) => !["index-lite.html", "index-refined.html", "pricing-refined.html"].includes(name));

for (const file of websiteHtml) {
  await copy(file, path.join(websiteDir, file));
}

for (const file of ["robots.txt", "sitemap.xml"]) {
  await copy(file, path.join(websiteDir, file));
}

if (indexNowKey) {
  await writeFile(
    path.join(websiteDir, `${indexNowKey}.txt`),
    `${indexNowKey}\n`,
    "utf8"
  );
}

await copy("assets", path.join(websiteDir, "assets"));
await copy("en", path.join(websiteDir, "en"));
await copy("developers", path.join(websiteDir, "developers"));
await copy("status", path.join(websiteDir, "status"));

const consoleSourceDir = path.join(rootDir, "console");
const consoleEntries = await readdir(consoleSourceDir, { withFileTypes: true });
for (const entry of consoleEntries) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    await cp(
      path.join(consoleSourceDir, entry.name),
      path.join(consoleDir, entry.name),
      { force: true }
    );
  }
}
await cp(path.join(consoleSourceDir, "assets"), path.join(consoleDir, "assets"), {
  recursive: true,
  force: true
});
await cp(path.join(consoleSourceDir, "app"), path.join(consoleDir, "app"), {
  recursive: true,
  force: true
});
await writeFile(
  path.join(consoleDir, "robots.txt"),
  "User-agent: *\nDisallow: /\n",
  "utf8"
);

const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
const consoleAppEntries = await readdir(path.join(consoleSourceDir, "app"), { withFileTypes: true });
const developerFileCount = await countHtmlFiles(path.join(rootDir, "developers"));
const statusFileCount = await countHtmlFiles(path.join(rootDir, "status"));
const manifest = {
  name: packageJson.name,
  builtAt: new Date().toISOString(),
  revision: process.env.BUILD_REVISION || "local",
  websiteFiles: websiteHtml.length + statusFileCount,
  developerFiles: developerFileCount,
  consoleFiles: consoleEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".html")).length,
  consoleAppFiles: consoleAppEntries.filter((entry) => entry.isFile()).length,
  indexNowVerification: Boolean(indexNowKey)
};
await writeFile(
  path.join(distDir, "build-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);

console.log(
  `Deploy package complete: ${manifest.websiteFiles} website HTML files, `
  + `${manifest.developerFiles} developer HTML files, ${manifest.consoleFiles} console HTML files, `
  + `${manifest.consoleAppFiles} console app files`
);
