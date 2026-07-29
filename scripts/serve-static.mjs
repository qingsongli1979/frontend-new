import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const consoleProxyEnabled = process.argv.includes("--console-proxy");
const consoleApiOrigin = "https://console.123proxy.cn";
const consoleApiPrefixes = ["/accsrv/", "/ip/", "/ssosrv/"];
const publicApiPaths = new Set(["/ip/default/offers"]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function proxyConsoleRequest(request, response) {
  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await readRequestBody(request);
  const headers = {};
  ["accept", "accept-language", "authorization", "content-type"].forEach((name) => {
    if (request.headers[name]) headers[name] = request.headers[name];
  });

  const upstream = await fetch(`${consoleApiOrigin}${request.url}`, {
    method: request.method,
    headers,
    body,
    redirect: "manual"
  });
  const responseBody = Buffer.from(await upstream.arrayBuffer());
  response.writeHead(upstream.status, {
    "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  response.end(responseBody);
}

createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
    const shouldProxyConsoleApi = consoleProxyEnabled
      && consoleApiPrefixes.some((prefix) => requestPath.startsWith(prefix));
    if (publicApiPaths.has(requestPath) || shouldProxyConsoleApi) {
      await proxyConsoleRequest(request, response);
      return;
    }

    const relativePath = requestPath.endsWith("/") ? `${requestPath}index.html` : requestPath;
    const filePath = path.resolve(rootDir, `.${relativePath}`);

    if (filePath !== rootDir && !filePath.startsWith(`${rootDir}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, host, () => {
  const mode = consoleProxyEnabled ? " with console API proxy" : "";
  console.log(`123Proxy static preview${mode}: http://${host}:${port}/`);
});
