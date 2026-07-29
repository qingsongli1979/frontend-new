import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectFile(file) {
  const fileStat = await stat(path.join(rootDir, file));
  expect(fileStat.isFile(), `${file}: expected a file`);
}

const requiredFiles = [
  "dist/www/index.html",
  "dist/www/pricing.html",
  "dist/www/agreement.html",
  "dist/www/contact.html",
  "dist/www/status/index.html",
  "dist/www/assets/contact.css",
  "dist/www/assets/contact-solutions-wechat.png",
  "dist/www/assets/contact-service-wecom.png",
  "dist/www/assets/status-page.css",
  "dist/www/assets/status-page.js",
  "dist/www/developers/index.html",
  "dist/www/developers/getting-started/index.html",
  "dist/www/developers/products/scraping-rotating-proxy/index.html",
  "dist/www/developers/products/residential-rotating-proxy/index.html",
  "dist/www/developers/products/unlimited-residential-proxy/index.html",
  "dist/www/developers/products/static-datacenter-proxy/index.html",
  "dist/www/developers/products/static-residential-proxy/index.html",
  "dist/www/developers/guides/concurrency-qps-performance/index.html",
  "dist/www/developers/guides/session-geo-rotation/index.html",
  "dist/www/developers/guides/proxy-errors-retries/index.html",
  "dist/www/developers/guides/proxy-product-selection/index.html",
  "dist/www/developers/examples/index.html",
  "dist/www/developers/examples/python-requests-proxy/index.html",
  "dist/www/developers/examples/scrapy-proxy/index.html",
  "dist/www/developers/examples/playwright-proxy/index.html",
  "dist/www/developers/examples/selenium-proxy/index.html",
  "dist/www/developers/examples/puppeteer-proxy/index.html",
  "dist/www/developers/examples/nodejs-axios-proxy/index.html",
  "dist/www/developers/examples/go-colly-proxy/index.html",
  "dist/www/developers/examples/java-jsoup-proxy/index.html",
  "dist/www/developers/examples/php-curl-proxy/index.html",
  "dist/www/assets/developer-docs.css",
  "dist/www/assets/developer-docs.js",
  "dist/www/assets/favicon.svg",
  "dist/www/en/index.html",
  "dist/www/robots.txt",
  "dist/www/sitemap.xml",
  "dist/console/login.html",
  "dist/console/register.html",
  "dist/console/forgot-password.html",
  "dist/console/aggrement.html",
  "dist/console/agency-login.html",
  "dist/console/agency-manager.html",
  "dist/console/assets/auth.css",
  "dist/console/assets/auth.js",
  "dist/console/assets/agency.css",
  "dist/console/assets/agency.js",
  "dist/console/assets/favicon.svg",
  "dist/console/assets/contact-service-wecom.png",
  "dist/console/app/index.html",
  "dist/console/app/console.css",
  "dist/console/app/console.js",
  "dist/console/app/overview.js",
  "dist/console/app/products.js",
  "dist/console/app/resources.js",
  "dist/console/app/commerce.js",
  "dist/console/app/extractor.js",
  "dist/console/app/account.js",
  "dist/console/app/payment.js",
  "dist/console/app/vendor/qrcode.min.js",
  "dist/console/app/vendor/qrcode.LICENSE.txt",
  "dist/console/robots.txt",
  "dist/build-manifest.json",
  "Dockerfile",
  "Dockerfile.release",
  "build_web_cn.sh",
  "deploy/nginx/nginx.conf",
  "deploy/nginx/site.conf.template",
  "deploy/nginx/real-ip.conf.template",
  "deploy/nginx/api-cors.conf",
  "deploy/nginx/docker-entrypoint.d/15-prepare-123proxy.sh",
  "deploy/nginx/targets/cn/ip-rate-limit.conf",
  "deploy/nginx/targets/sz/ip-rate-limit.conf",
  "deploy/production/frontend-out.yml",
  "deploy/production/docker-compose.yml",
  "deploy/production/deploy.sh",
  "deploy/production/rollback.sh",
  "deploy/production/README.md",
  "deploy/certificates/validate-certificates.sh",
  "deploy/certificates/deploy-certificates.sh",
  "deploy/certificates/renew-certificates.sh",
  "deploy/certificates/certificates.env.example",
  "deploy/certificates/systemd/123proxy-certificates.service",
  "deploy/certificates/systemd/123proxy-certificates.timer",
  "deploy/certificates/README.md",
  "deploy/status-api-contract.md"
];

for (const file of requiredFiles) await expectFile(file);

for (const comparisonPage of ["index-lite.html", "index-refined.html", "pricing-refined.html"]) {
  let comparisonPresent = true;
  try {
    await stat(path.join(rootDir, "dist", "www", comparisonPage));
  } catch {
    comparisonPresent = false;
  }
  expect(!comparisonPresent, `dist/www/${comparisonPage}: comparison page must not be deployed`);
}

const consoleLogin = await readFile(path.join(rootDir, "dist", "console", "login.html"), "utf8");
expect(consoleLogin.includes('assets/auth.js'), "dist/console/login.html: missing local auth script");
expect(consoleLogin.includes('data-auth-page="login"'), "dist/console/login.html: missing login marker");

const consoleScript = await readFile(path.join(rootDir, "dist", "console", "assets", "auth.js"), "utf8");
expect(
  consoleScript.includes('"/app/"'),
  "dist/console/assets/auth.js: login must redirect to the new console application"
);

const nginxTemplate = await readFile(path.join(rootDir, "deploy", "nginx", "site.conf.template"), "utf8");
for (const required of [
  "server_name www.123proxy.cn",
  "server_name console.123proxy.cn",
  "root /var/www/website",
  "root /var/www/console",
  "server_name _",
  "location = /healthz",
  "location ^~ /status-api/",
  "location = /ip/default/offers",
  "proxy_hide_header Access-Control-Allow-Origin",
  "STATUS_API_UPSTREAM",
  "location = /document/docs/intro/",
  "location ^~ /accsrv/",
  "location ^~ /ssosrv/",
  "location ^~ /app/",
  "location = /app/",
  "try_files /app/index.html =404",
  "/apiv1/managements/login-page",
  "/apiv1/console/orderDetail",
  "#payment-return?provider=alipay",
  "/apiv1/console/usercost",
  "#recharge-return?provider=alipay",
  "agencyconsole/agency-manager",
  "LEGACY_CONSOLE_UPSTREAM",
  "WEBSITE_LISTEN",
  "CONSOLE_LISTEN",
  "include /etc/nginx/tls/website.conf",
  "include /etc/nginx/tls/console.conf",
  "include /etc/nginx/target/ip-rate-limit.conf"
]) {
  expect(nginxTemplate.includes(required), `deploy/nginx/site.conf.template: missing ${required}`);
}
expect(
  (nginxTemplate.match(/include \/etc\/nginx\/api-cors\.conf;/g) || []).length === 5,
  "deploy/nginx/site.conf.template: all account, auth and IP API routes must use normalized CORS"
);
expect(!nginxTemplate.includes("ssl_certificate "), "Nginx image must not embed production certificates");

const corsConfig = await readFile(path.join(rootDir, "deploy", "nginx", "api-cors.conf"), "utf8");
for (const required of [
  "proxy_hide_header Access-Control-Allow-Origin",
  "add_header Access-Control-Allow-Origin $console_cors_origin always",
  "add_header Access-Control-Allow-Credentials $console_cors_credentials always",
  "Content-Disposition",
  "if ($request_method = OPTIONS)"
]) {
  expect(corsConfig.includes(required), `deploy/nginx/api-cors.conf: missing ${required}`);
}

const buildScript = await readFile(path.join(rootDir, "build_web_cn.sh"), "utf8");
expect(buildScript.includes("set -Eeuo pipefail"), "build_web_cn.sh: strict mode is required");
expect(buildScript.includes("--password-stdin"), "build_web_cn.sh: Docker login must use password-stdin");
expect(buildScript.includes("npm run build:deploy"), "build_web_cn.sh: release must run the full build and audit");
expect(buildScript.includes("Dockerfile.release"), "build_web_cn.sh: release image must use the prebuilt deploy package");
expect(buildScript.includes("123proxy/intelligroup-frontend"), "build_web_cn.sh: missing primary image repository");
expect(buildScript.includes("123proxy/intelligroup-frontend-sz"), "build_web_cn.sh: missing Shenzhen image repository");
expect(!buildScript.includes("Proxy123"), "build_web_cn.sh: hard-coded registry password detected");

const dockerfile = await readFile(path.join(rootDir, "Dockerfile"), "utf8");
expect(
  dockerfile.includes("STATUS_API_UPSTREAM=http://192.168.85.105:8080"),
  "Dockerfile: status API must default to the private monitoring endpoint"
);
expect(
  dockerfile.includes("COPY deploy/nginx/api-cors.conf /etc/nginx/api-cors.conf"),
  "Dockerfile: normalized API CORS policy must be included in the image"
);
expect(dockerfile.includes("ARG INDEXNOW_KEY"), "Dockerfile: missing optional IndexNow build argument");
expect(!dockerfile.includes("COPY ./react/cert"), "Dockerfile: production certificates must not be embedded");

const packageScript = await readFile(path.join(rootDir, "scripts", "package-deploy.mjs"), "utf8");
expect(packageScript.includes("indexNowVerification"), "package-deploy.mjs: missing IndexNow verification manifest state");
expect(packageScript.includes("INDEXNOW_KEY must contain 8-128"), "package-deploy.mjs: missing IndexNow key validation");

const indexNowScript = await readFile(path.join(rootDir, "scripts", "submit-indexnow.mjs"), "utf8");
expect(indexNowScript.includes("IndexNow key verification is not live"), "submit-indexnow.mjs: must verify the deployed key before submission");
expect(indexNowScript.includes("urls.length > 10000"), "submit-indexnow.mjs: missing IndexNow batch limit");

console.log("Deploy audit passed: package layout, Dockerfile, build script and Nginx host routing");
