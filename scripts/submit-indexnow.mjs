import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteUrl } from "./seo-entities.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const key = process.env.INDEXNOW_KEY?.trim();
const host = process.env.INDEXNOW_HOST || new URL(siteUrl).host;

function readUrlsFromSitemap(sitemap) {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

if (!key) {
  console.log("INDEXNOW_KEY is not set. Skipping IndexNow submission.");
  process.exit(0);
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  throw new Error("INDEXNOW_KEY must contain 8-128 letters, numbers, or dashes.");
}

const sitemap = await readFile(path.join(rootDir, "sitemap.xml"), "utf8");
const urls = [...new Set(process.argv.slice(2).length ? process.argv.slice(2) : readUrlsFromSitemap(sitemap))];

if (!urls.length) {
  console.log("No URLs found for IndexNow submission.");
  process.exit(0);
}

if (urls.length > 10000) {
  throw new Error("IndexNow accepts at most 10,000 URLs per request.");
}

for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.host !== host) {
    throw new Error(`IndexNow URL must use https://${host}: ${url}`);
  }
}

const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `${siteUrl}/${key}.txt`;
const keyLocationUrl = new URL(keyLocation);
if (keyLocationUrl.protocol !== "https:" || keyLocationUrl.host !== host) {
  throw new Error(`INDEXNOW_KEY_LOCATION must use https://${host}.`);
}

const keyResponse = await fetch(keyLocation, {
  headers: { Accept: "text/plain" }
});
if (!keyResponse.ok) {
  throw new Error(`IndexNow key verification is not live: ${keyResponse.status} ${keyLocation}`);
}
const liveKey = (await keyResponse.text()).trim();
if (liveKey !== key) {
  throw new Error("IndexNow key verification file does not match INDEXNOW_KEY.");
}

const payload = {
  host,
  key,
  keyLocation,
  urlList: urls
};

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed: ${response.status} ${body}`);
}

console.log(`Submitted ${urls.length} URL(s) to IndexNow.`);
