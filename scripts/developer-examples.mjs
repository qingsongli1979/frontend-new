export const developerExamplePages = {
  examples: {
    key: "examples",
    kind: "example",
    exampleKey: "hub",
    output: "developers/examples/index.html",
    route: "/developers/examples/",
    title: "爬虫代理接入案例 | Scrapy、Playwright、Puppeteer、Colly | 123Proxy",
    description: "123Proxy 完整爬虫代理接入案例：Python Requests、Scrapy、Playwright、Node.js Puppeteer、Golang Colly、Java Jsoup 和 PHP cURL，使用真实网关域名并输出结构化数据。",
    heading: "可直接运行的爬虫代理案例"
  },
  exampleRequests: {
    key: "example-requests",
    kind: "example",
    exampleKey: "requests",
    output: "developers/examples/python-requests-proxy/index.html",
    route: "/developers/examples/python-requests-proxy/",
    title: "Python Requests 爬虫代理完整案例 | 123Proxy",
    description: "使用Python Requests、BeautifulSoup和123Proxy隧道代理网关爬取Quotes to Scrape分页数据，包含代理认证、重试、解析与JSONL输出。",
    heading: "Python Requests 爬虫代理",
    programmingLanguage: "Python",
    runtimePlatform: "Python 3.10+",
    framework: "Requests + BeautifulSoup",
    targetType: "静态分页网页"
  },
  exampleScrapy: {
    key: "example-scrapy",
    kind: "example",
    exampleKey: "scrapy",
    output: "developers/examples/scrapy-proxy/index.html",
    route: "/developers/examples/scrapy-proxy/",
    title: "Scrapy代理配置与完整爬虫案例 | 123Proxy",
    description: "Scrapy结合123Proxy隧道代理的完整可运行案例，爬取Books to Scrape列表与商品详情，支持分页、并发、重试和JSON Lines输出。",
    heading: "Scrapy代理接入与完整爬虫",
    programmingLanguage: "Python",
    runtimePlatform: "Python 3.10+ / Scrapy",
    framework: "Scrapy",
    targetType: "商品列表、详情与分页"
  },
  examplePlaywright: {
    key: "example-playwright",
    kind: "example",
    exampleKey: "playwright",
    output: "developers/examples/playwright-proxy/index.html",
    route: "/developers/examples/playwright-proxy/",
    title: "Python Playwright代理配置完整案例 | 123Proxy",
    description: "Python Playwright通过123Proxy代理网关爬取JavaScript渲染页面，包含代理账密、浏览器启动、翻页、等待策略和JSON输出。",
    heading: "Python Playwright 爬虫代理",
    programmingLanguage: "Python",
    runtimePlatform: "Python 3.10+ / Chromium",
    framework: "Playwright",
    targetType: "JavaScript渲染页面"
  },
  exampleSelenium: {
    key: "example-selenium",
    kind: "example",
    exampleKey: "selenium",
    output: "developers/examples/selenium-proxy/index.html",
    route: "/developers/examples/selenium-proxy/",
    title: "Python Selenium代理配置完整案例 | 123Proxy",
    description: "Python Selenium通过123Proxy不限量动态住宅网关爬取JavaScript渲染页面，包含Chrome Manifest V3代理认证扩展、显式等待、分页与JSON输出。",
    heading: "Python Selenium 爬虫代理",
    programmingLanguage: "Python",
    runtimePlatform: "Python 3.10+ / Chrome 108+",
    framework: "Selenium 4 + Chromium",
    targetType: "JavaScript渲染页面",
    productKey: "unlimitedResidential",
    consoleProduct: "unlimited"
  },
  examplePuppeteer: {
    key: "example-puppeteer",
    kind: "example",
    exampleKey: "puppeteer",
    output: "developers/examples/puppeteer-proxy/index.html",
    route: "/developers/examples/puppeteer-proxy/",
    title: "Node.js Puppeteer代理配置完整案例 | 123Proxy",
    description: "Node.js Puppeteer结合123Proxy代理网关爬取无限滚动页面，包含代理认证、滚动终止条件、去重与JSON文件输出。",
    heading: "Node.js Puppeteer 爬虫代理",
    programmingLanguage: "JavaScript",
    runtimePlatform: "Node.js 20+ / Chromium",
    framework: "Puppeteer",
    targetType: "无限滚动页面"
  },
  exampleAxios: {
    key: "example-axios",
    kind: "example",
    exampleKey: "axios",
    output: "developers/examples/nodejs-axios-proxy/index.html",
    route: "/developers/examples/nodejs-axios-proxy/",
    title: "Node.js Axios 爬虫代理完整案例 | 123Proxy",
    description: "Node.js Axios通过123Proxy隧道住宅代理网关爬取分页网页，包含原生proxy配置、连接复用、限时重试、Cheerio解析与JSON Lines输出。",
    heading: "Node.js Axios 爬虫代理",
    programmingLanguage: "JavaScript",
    runtimePlatform: "Node.js 20+",
    framework: "Axios + Cheerio",
    targetType: "静态分页网页",
    productKey: "residential",
    consoleProduct: "residential"
  },
  exampleColly: {
    key: "example-colly",
    kind: "example",
    exampleKey: "colly",
    output: "developers/examples/go-colly-proxy/index.html",
    route: "/developers/examples/go-colly-proxy/",
    title: "Golang Colly 爬虫代理完整案例 | 123Proxy",
    description: "Golang Colly通过123Proxy隧道代理抓取Quotes to Scrape分页内容，包含代理切换器、限速、错误处理和CSV输出。",
    heading: "Golang Colly 爬虫代理",
    programmingLanguage: "Go",
    runtimePlatform: "Go 1.22+",
    framework: "Colly v2",
    targetType: "并发分页网页"
  },
  exampleJsoup: {
    key: "example-jsoup",
    kind: "example",
    exampleKey: "jsoup",
    output: "developers/examples/java-jsoup-proxy/index.html",
    route: "/developers/examples/java-jsoup-proxy/",
    title: "Java Jsoup 爬虫代理完整案例 | 123Proxy",
    description: "Java Jsoup使用123Proxy代理认证爬取Books to Scrape商品列表，包含Maven依赖、代理Authenticator、分页与CSV输出。",
    heading: "Java Jsoup 爬虫代理",
    programmingLanguage: "Java",
    runtimePlatform: "Java 17+",
    framework: "Jsoup 1.21+",
    targetType: "HTML目录页面"
  },
  examplePhp: {
    key: "example-php",
    kind: "example",
    exampleKey: "php",
    output: "developers/examples/php-curl-proxy/index.html",
    route: "/developers/examples/php-curl-proxy/",
    title: "PHP cURL 爬虫代理完整案例 | 123Proxy",
    description: "PHP cURL、DOMDocument和XPath结合123Proxy代理网关爬取分页网页，包含代理账密、错误处理、解析与JSON输出。",
    heading: "PHP cURL 爬虫代理",
    programmingLanguage: "PHP",
    runtimePlatform: "PHP 8.1+",
    framework: "cURL + DOMXPath",
    targetType: "静态分页网页"
  }
};

export const developerExampleOrder = [
  "examples",
  "exampleRequests",
  "exampleScrapy",
  "examplePlaywright",
  "exampleSelenium",
  "examplePuppeteer",
  "exampleAxios",
  "exampleColly",
  "exampleJsoup",
  "examplePhp"
];

export const developerExampleSearch = [
  {
    title: "爬虫代理接入案例",
    section: "框架案例",
    href: "/developers/examples/",
    keywords: "crawler examples 爬虫框架 完整代码 网关域名 可运行"
  },
  {
    title: "Python Requests 爬虫代理",
    section: "框架案例",
    href: "/developers/examples/python-requests-proxy/",
    keywords: "python requests beautifulsoup proxy quotes pagination jsonl"
  },
  {
    title: "Scrapy代理配置",
    section: "框架案例",
    href: "/developers/examples/scrapy-proxy/",
    keywords: "scrapy proxy middleware books pagination detail feed jsonlines"
  },
  {
    title: "Python Playwright代理",
    section: "框架案例",
    href: "/developers/examples/playwright-proxy/",
    keywords: "playwright python browser proxy javascript rendered quotes"
  },
  {
    title: "Python Selenium代理",
    section: "框架案例",
    href: "/developers/examples/selenium-proxy/",
    keywords: "selenium python chrome proxy authentication extension javascript residential unlimited"
  },
  {
    title: "Node.js Puppeteer代理",
    section: "框架案例",
    href: "/developers/examples/puppeteer-proxy/",
    keywords: "nodejs puppeteer proxy authenticate infinite scroll browser"
  },
  {
    title: "Node.js Axios代理",
    section: "框架案例",
    href: "/developers/examples/nodejs-axios-proxy/",
    keywords: "nodejs axios cheerio proxy keep alive retry residential pagination jsonl"
  },
  {
    title: "Golang Colly代理",
    section: "框架案例",
    href: "/developers/examples/go-colly-proxy/",
    keywords: "golang go colly proxy switcher pagination csv"
  },
  {
    title: "Java Jsoup代理",
    section: "框架案例",
    href: "/developers/examples/java-jsoup-proxy/",
    keywords: "java jsoup proxy authentication maven books csv"
  },
  {
    title: "PHP cURL代理",
    section: "框架案例",
    href: "/developers/examples/php-curl-proxy/",
    keywords: "php curl proxy domdocument xpath json"
  }
];

export const developerExampleSnippets = {
  verifyCurl: `export PROXY_USER="替换为控制台代理用户名"
export PROXY_PASS="替换为控制台代理密码"

curl --fail-with-body --silent --show-error \\
  --proxy "http://proxy.123proxy.cn:36923" \\
  --proxy-user "\${PROXY_USER}:\${PROXY_PASS}" \\
  --connect-timeout 15 \\
  --max-time 30 \\
  "https://httpbin.org/ip"`,

  requests: `# requirements:
#   python -m pip install requests beautifulsoup4
import json
import os
import time
from urllib.parse import quote, urljoin

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

PROXY_HOST = "proxy.123proxy.cn"
PROXY_PORT = 36923
PROXY_USER = os.environ["PROXY_USER"]
PROXY_PASS = os.environ["PROXY_PASS"]
START_URL = "https://quotes.toscrape.com/"
MAX_PAGES = 3

proxy_user = quote(PROXY_USER, safe="")
proxy_pass = quote(PROXY_PASS, safe="")
proxy_url = (
    f"http://{proxy_user}:{proxy_pass}@{PROXY_HOST}:{PROXY_PORT}"
)
proxies = {"http": proxy_url, "https": proxy_url}

retry = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=("GET",),
)
session = requests.Session()
session.headers.update({
    "User-Agent": "123Proxy-Developer-Example/1.0",
    "Accept-Language": "en-US,en;q=0.8",
})
session.mount("https://", HTTPAdapter(max_retries=retry))

records = []
url = START_URL
for page_number in range(1, MAX_PAGES + 1):
    response = session.get(
        url,
        proxies=proxies,
        timeout=(15, 30),
    )
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    for quote_node in soup.select("div.quote"):
        records.append({
            "text": quote_node.select_one("span.text").get_text(strip=True),
            "author": quote_node.select_one("small.author").get_text(strip=True),
            "tags": [
                node.get_text(strip=True)
                for node in quote_node.select("a.tag")
            ],
            "source_url": url,
        })

    next_link = soup.select_one("li.next > a")
    if not next_link:
        break
    url = urljoin(url, next_link["href"])
    time.sleep(0.5)

with open("quotes.jsonl", "w", encoding="utf-8") as output:
    for record in records:
        output.write(json.dumps(record, ensure_ascii=False) + "\\n")

print(f"saved {len(records)} records to quotes.jsonl")`,

  scrapy: `# requirements:
#   python -m pip install scrapy
# run:
#   scrapy runspider books_spider.py
import os
from urllib.parse import quote

import scrapy
from scrapy.crawler import CrawlerProcess

PROXY_HOST = "proxy.123proxy.cn"
PROXY_PORT = 36923
PROXY_USER = os.environ["PROXY_USER"]
PROXY_PASS = os.environ["PROXY_PASS"]

proxy_url = "http://{}:{}@{}:{}".format(
    quote(PROXY_USER, safe=""),
    quote(PROXY_PASS, safe=""),
    PROXY_HOST,
    PROXY_PORT,
)


class BooksSpider(scrapy.Spider):
    name = "books_with_123proxy"
    allowed_domains = ["books.toscrape.com"]
    start_urls = [
        "https://books.toscrape.com/catalogue/page-1.html"
    ]
    custom_settings = {
        "CONCURRENT_REQUESTS": 8,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 4,
        "DOWNLOAD_DELAY": 0.25,
        "DOWNLOAD_TIMEOUT": 30,
        "RETRY_TIMES": 3,
        "RETRY_HTTP_CODES": [429, 500, 502, 503, 504],
        "ROBOTSTXT_OBEY": True,
        "USER_AGENT": "123Proxy-Developer-Example/1.0",
        "FEEDS": {
            "books.jsonl": {
                "format": "jsonlines",
                "encoding": "utf8",
                "overwrite": True,
            }
        },
        "LOG_LEVEL": "INFO",
    }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                callback=self.parse,
                meta={"proxy": proxy_url},
            )

    def parse(self, response):
        for book in response.css("article.product_pod"):
            detail_url = response.urljoin(
                book.css("h3 a::attr(href)").get()
            )
            yield scrapy.Request(
                detail_url,
                callback=self.parse_book,
                meta={
                    "proxy": proxy_url,
                    "list_price": book.css(
                        "p.price_color::text"
                    ).get(),
                },
            )

        next_href = response.css("li.next a::attr(href)").get()
        if next_href:
            yield scrapy.Request(
                response.urljoin(next_href),
                callback=self.parse,
                meta={"proxy": proxy_url},
            )

    def parse_book(self, response):
        table = {
            row.css("th::text").get(): row.css("td::text").get()
            for row in response.css("table.table tr")
        }
        yield {
            "title": response.css("div.product_main h1::text").get(),
            "price": response.meta["list_price"],
            "availability": response.css(
                "div.product_main p.availability::text"
            ).getall()[-1].strip(),
            "upc": table.get("UPC"),
            "product_type": table.get("Product Type"),
            "url": response.url,
        }


if __name__ == "__main__":
    process = CrawlerProcess()
    process.crawl(BooksSpider)
    process.start()`,

  playwright: `# requirements:
#   python -m pip install playwright
#   playwright install chromium
import asyncio
import json
import os
from urllib.parse import urljoin

from playwright.async_api import async_playwright

PROXY_HOST = "proxy.123proxy.cn"
PROXY_PORT = 36923
PROXY_USER = os.environ["PROXY_USER"]
PROXY_PASS = os.environ["PROXY_PASS"]
START_URL = "https://quotes.toscrape.com/js/"
MAX_PAGES = 3


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True,
            proxy={
                "server": f"http://{PROXY_HOST}:{PROXY_PORT}",
                "username": PROXY_USER,
                "password": PROXY_PASS,
            },
        )
        context = await browser.new_context(
            user_agent="123Proxy-Developer-Example/1.0",
            locale="en-US",
        )
        page = await context.new_page()
        page.set_default_navigation_timeout(45_000)

        records = []
        url = START_URL
        for _ in range(MAX_PAGES):
            await page.goto(url, wait_until="networkidle")
            await page.locator("div.quote").first.wait_for()

            records.extend(
                await page.locator("div.quote").evaluate_all(
                    """nodes => nodes.map(node => ({
                      text: node.querySelector("span.text")?.textContent.trim(),
                      author: node.querySelector("small.author")?.textContent.trim(),
                      tags: [...node.querySelectorAll("a.tag")]
                        .map(tag => tag.textContent.trim()),
                      source_url: location.href
                    }))"""
                )
            )

            next_link = page.locator("li.next > a")
            if await next_link.count() == 0:
                break
            href = await next_link.get_attribute("href")
            url = urljoin(page.url, href)

        with open("quotes-playwright.json", "w", encoding="utf-8") as output:
            json.dump(records, output, ensure_ascii=False, indent=2)

        print(
            f"saved {len(records)} records to quotes-playwright.json"
        )
        await context.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())`,

  selenium: `# requirements:
#   python -m pip install selenium
# run:
#   python selenium_proxy.py
import json
import os
import shutil
import tempfile
import time
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PROXY_HOST = "unlimit.residential.123proxy.cn"
PROXY_PORT = 10253
PROXY_USER = os.environ["PROXY_USER"]
PROXY_PASS = os.environ["PROXY_PASS"]
START_URL = "https://quotes.toscrape.com/js/"
MAX_PAGES = 3


def create_proxy_extension():
    extension_dir = Path(tempfile.mkdtemp(prefix="123proxy-selenium-"))
    manifest = {
        "manifest_version": 3,
        "name": "123Proxy Selenium Auth",
        "version": "1.0.0",
        "minimum_chrome_version": "108",
        "permissions": [
            "proxy",
            "webRequest",
            "webRequestAuthProvider",
        ],
        "host_permissions": ["<all_urls>"],
        "background": {"service_worker": "service_worker.js"},
    }
    worker = """
chrome.proxy.settings.set({
  value: {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: "http",
        host: "__HOST__",
        port: __PORT__
      },
      bypassList: ["localhost", "127.0.0.1"]
    }
  },
  scope: "regular"
});

chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    callback({
      authCredentials: {
        username: __USER__,
        password: __PASS__
      }
    });
  },
  {urls: ["<all_urls>"]},
  ["asyncBlocking"]
);
"""
    worker = (
        worker.replace("__HOST__", PROXY_HOST)
        .replace("__PORT__", str(PROXY_PORT))
        .replace("__USER__", json.dumps(PROXY_USER))
        .replace("__PASS__", json.dumps(PROXY_PASS))
    )
    (extension_dir / "manifest.json").write_text(
        json.dumps(manifest),
        encoding="utf-8",
    )
    (extension_dir / "service_worker.js").write_text(
        worker,
        encoding="utf-8",
    )
    return extension_dir


def text(node, selector):
    return node.find_element(By.CSS_SELECTOR, selector).text.strip()


def main():
    extension_dir = create_proxy_extension()
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1440,1000")
    options.add_argument("--lang=en-US")
    options.add_argument("--load-extension=" + str(extension_dir))
    if os.environ.get("HEADLESS") == "1":
        options.add_argument("--headless=new")

    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(45)
    wait = WebDriverWait(driver, 30)
    records = []

    try:
        time.sleep(1)
        url = START_URL
        for _ in range(MAX_PAGES):
            driver.get(url)
            wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.quote"))
            )

            for quote in driver.find_elements(By.CSS_SELECTOR, "div.quote"):
                records.append({
                    "text": text(quote, "span.text"),
                    "author": text(quote, "small.author"),
                    "tags": [
                        tag.text.strip()
                        for tag in quote.find_elements(By.CSS_SELECTOR, "a.tag")
                    ],
                    "source_url": driver.current_url,
                })

            next_links = driver.find_elements(By.CSS_SELECTOR, "li.next > a")
            if not next_links:
                break
            url = urljoin(driver.current_url, next_links[0].get_attribute("href"))

        Path("quotes-selenium.json").write_text(
            json.dumps(records, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(
            "saved "
            + str(len(records))
            + " records to quotes-selenium.json"
        )
    finally:
        driver.quit()
        shutil.rmtree(extension_dir, ignore_errors=True)


if __name__ == "__main__":
    main()`,

  puppeteer: `// requirements:
//   npm init -y
//   npm install puppeteer
// run:
//   node scrape-scroll.js
const fs = require("node:fs/promises");
const puppeteer = require("puppeteer");

const PROXY_HOST = "proxy.123proxy.cn";
const PROXY_PORT = 36923;
const PROXY_USER = process.env.PROXY_USER;
const PROXY_PASS = process.env.PROXY_PASS;
const TARGET_URL = "https://quotes.toscrape.com/scroll";

if (!PROXY_USER || !PROXY_PASS) {
  throw new Error("set PROXY_USER and PROXY_PASS first");
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--proxy-server=http://" + PROXY_HOST + ":" + PROXY_PORT,
    ],
  });
  const page = await browser.newPage();
  await page.authenticate({
    username: PROXY_USER,
    password: PROXY_PASS,
  });
  await page.setUserAgent("123Proxy-Developer-Example/1.0");
  page.setDefaultNavigationTimeout(45_000);

  await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
  await page.waitForSelector("div.quote");

  let previousCount = 0;
  let stableRounds = 0;
  for (let round = 0; round < 30 && stableRounds < 3; round += 1) {
    const count = await page.$$eval(
      "div.quote",
      (nodes) => nodes.length,
    );
    stableRounds = count === previousCount ? stableRounds + 1 : 0;
    previousCount = count;
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  const records = await page.$$eval("div.quote", (nodes) =>
    nodes.map((node) => ({
      text: node.querySelector("span.text")?.textContent.trim(),
      author: node.querySelector("small.author")?.textContent.trim(),
      tags: [...node.querySelectorAll("a.tag")]
        .map((tag) => tag.textContent.trim()),
      source_url: location.href,
    }))
  );

  const uniqueRecords = [
    ...new Map(
      records.map((record) => [
        record.author + "\\u0000" + record.text,
        record,
      ]),
    ).values(),
  ];
  await fs.writeFile(
    "quotes-puppeteer.json",
    JSON.stringify(uniqueRecords, null, 2),
    "utf8",
  );
  console.log(
    "saved " + uniqueRecords.length + " records to quotes-puppeteer.json",
  );
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`,

  axios: `// requirements:
//   npm init -y
//   npm install axios cheerio
// save as scrape-axios.mjs, then run:
//   node scrape-axios.mjs
import fs from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import axios from "axios";
import * as cheerio from "cheerio";

const PROXY_HOST = "residential.123proxy.cn";
const PROXY_PORT = 33000;
const PROXY_USER = process.env.PROXY_USER;
const PROXY_PASS = process.env.PROXY_PASS;
const START_URL = "https://quotes.toscrape.com/";
const MAX_PAGES = 3;

if (!PROXY_USER || !PROXY_PASS) {
  throw new Error("set PROXY_USER and PROXY_PASS first");
}

const client = axios.create({
  timeout: 30_000,
  proxy: {
    protocol: "http",
    host: PROXY_HOST,
    port: PROXY_PORT,
    auth: {
      username: PROXY_USER,
      password: PROXY_PASS,
    },
  },
  headers: {
    "User-Agent": "123Proxy-Developer-Example/1.0",
    "Accept-Language": "en-US,en;q=0.8",
  },
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 10 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 10 }),
});

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function getWithRetry(url, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await client.get(url);
    } catch (error) {
      const status = error.response?.status;
      const retryable =
        status === 429
        || (status >= 500 && status <= 599)
        || error.code === "ECONNRESET"
        || error.code === "ETIMEDOUT";
      if (!retryable || attempt === maxAttempts) throw error;

      const retryAfter = Number(error.response?.headers?.["retry-after"]);
      const waitMs = Number.isFinite(retryAfter)
        ? Math.min(retryAfter * 1000, 30_000)
        : 500 * (2 ** (attempt - 1));
      await delay(waitMs + Math.floor(Math.random() * 250));
    }
  }
  throw new Error("unreachable");
}

function parsePage(html, sourceUrl) {
  const $ = cheerio.load(html);
  const records = $("div.quote")
    .map((_, node) => ({
      text: $(node).find("span.text").text().trim(),
      author: $(node).find("small.author").text().trim(),
      tags: $(node).find("a.tag")
        .map((__, tag) => $(tag).text().trim())
        .get(),
      source_url: sourceUrl,
    }))
    .get();
  const nextHref = $("li.next > a").attr("href");
  return { records, nextHref };
}

async function main() {
  const records = [];
  let url = START_URL;

  for (let page = 0; page < MAX_PAGES && url; page += 1) {
    const response = await getWithRetry(url);
    const parsed = parsePage(response.data, url);
    records.push(...parsed.records);
    url = parsed.nextHref ? new URL(parsed.nextHref, url).href : null;
    await delay(500);
  }

  const jsonLines = records.map((record) => JSON.stringify(record)).join("\\n");
  await fs.writeFile("quotes-axios.jsonl", jsonLines + "\\n", "utf8");
  console.log(
    "saved " + records.length + " records to quotes-axios.jsonl",
  );
}

main().catch((error) => {
  console.error(error.response?.status || error.code, error.message);
  process.exitCode = 1;
});`,

  colly: `// initialize:
//   go mod init example.com/quotes-proxy
//   go get github.com/gocolly/colly/v2
// run:
//   go run .
package main

import (
    "encoding/csv"
    "fmt"
    "log"
    "net/url"
    "os"
    "strings"
    "time"

    "github.com/gocolly/colly/v2"
    collyproxy "github.com/gocolly/colly/v2/proxy"
)

func main() {
    host := "proxy.123proxy.cn"
    port := 36923
    username := os.Getenv("PROXY_USER")
    password := os.Getenv("PROXY_PASS")
    if username == "" || password == "" {
        log.Fatal("set PROXY_USER and PROXY_PASS first")
    }

    proxyURL := &url.URL{
        Scheme: "http",
        Host:   fmt.Sprintf("%s:%d", host, port),
        User:   url.UserPassword(username, password),
    }
    switcher, err := collyproxy.RoundRobinProxySwitcher(
        proxyURL.String(),
    )
    if err != nil {
        log.Fatal(err)
    }

    output, err := os.Create("quotes-colly.csv")
    if err != nil {
        log.Fatal(err)
    }
    defer output.Close()
    writer := csv.NewWriter(output)
    defer writer.Flush()
    _ = writer.Write([]string{"text", "author", "tags", "source_url"})

    collector := colly.NewCollector(
        colly.AllowedDomains("quotes.toscrape.com"),
        colly.UserAgent("123Proxy-Developer-Example/1.0"),
    )
    collector.SetProxyFunc(switcher)
    _ = collector.Limit(&colly.LimitRule{
        DomainGlob:  "*toscrape.com",
        Parallelism: 2,
        RandomDelay: 500 * time.Millisecond,
    })

    collector.OnHTML("div.quote", func(element *colly.HTMLElement) {
        tags := element.ChildTexts("a.tag")
        _ = writer.Write([]string{
            strings.TrimSpace(element.ChildText("span.text")),
            strings.TrimSpace(element.ChildText("small.author")),
            strings.Join(tags, "|"),
            element.Request.URL.String(),
        })
    })
    collector.OnHTML("li.next > a", func(element *colly.HTMLElement) {
        _ = element.Request.Visit(element.Attr("href"))
    })
    collector.OnError(func(response *colly.Response, requestErr error) {
        log.Printf(
            "request failed: url=%s status=%d error=%v",
            response.Request.URL,
            response.StatusCode,
            requestErr,
        )
    })

    if err := collector.Visit("https://quotes.toscrape.com/"); err != nil {
        log.Fatal(err)
    }
    fmt.Println("saved records to quotes-colly.csv")
}`,

  jsoup: `// pom.xml dependency:
// <dependency>
//   <groupId>org.jsoup</groupId>
//   <artifactId>jsoup</artifactId>
//   <version>1.21.2</version>
// </dependency>
import java.io.BufferedWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public final class BooksWithProxy {
    static {
        // Allow Basic proxy authentication for HTTPS CONNECT tunnels.
        System.setProperty(
            "jdk.http.auth.tunneling.disabledSchemes",
            ""
        );
    }

    private static final String PROXY_HOST = "proxy.123proxy.cn";
    private static final int PROXY_PORT = 36923;

    private static String csv(String value) {
        return "\\"" + value.replace("\\"", "\\"\\"") + "\\"";
    }

    public static void main(String[] args) throws Exception {
        String proxyUser = System.getenv("PROXY_USER");
        String proxyPass = System.getenv("PROXY_PASS");
        if (proxyUser == null || proxyPass == null) {
            throw new IllegalStateException(
                "set PROXY_USER and PROXY_PASS first"
            );
        }

        Connection session = Jsoup.newSession()
            .proxy(PROXY_HOST, PROXY_PORT)
            .auth(context -> {
                if (!context.isProxy()) {
                    return null;
                }
                return context.credentials(proxyUser, proxyPass);
            })
            .userAgent("123Proxy-Developer-Example/1.0")
            .timeout(30_000);

        try (BufferedWriter output = Files.newBufferedWriter(
            Path.of("books-jsoup.csv"),
            StandardCharsets.UTF_8
        )) {
            output.write("title,price,availability,url\\n");
            String pageUrl =
                "https://books.toscrape.com/catalogue/page-1.html";

            for (int pageNumber = 1; pageNumber <= 3; pageNumber++) {
                Document document = session
                    .newRequest(pageUrl)
                    .get();

                for (Element book : document.select("article.product_pod")) {
                    Element link = book.selectFirst("h3 a");
                    String title = link.attr("title");
                    String price = book.selectFirst("p.price_color").text();
                    String availability = book
                        .selectFirst("p.availability")
                        .text();
                    String detailUrl = link.absUrl("href");
                    output.write(
                        csv(title) + "," +
                        csv(price) + "," +
                        csv(availability) + "," +
                        csv(detailUrl) + "\\n"
                    );
                }

                Element next = document.selectFirst("li.next > a");
                if (next == null) {
                    break;
                }
                pageUrl = next.absUrl("href");
                Thread.sleep(500);
            }
        }
        System.out.println("saved records to books-jsoup.csv");
    }
}`,

  php: `<?php
// requirements: PHP 8+ with curl and dom extensions
$proxyHost = 'proxy.123proxy.cn';
$proxyPort = 36923;
$proxyUser = getenv('PROXY_USER');
$proxyPass = getenv('PROXY_PASS');

if (!$proxyUser || !$proxyPass) {
    throw new RuntimeException('set PROXY_USER and PROXY_PASS first');
}

function fetchHtml(
    string $url,
    string $proxyHost,
    int $proxyPort,
    string $proxyUser,
    string $proxyPass
): string {
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_PROXY => $proxyHost,
        CURLOPT_PROXYPORT => $proxyPort,
        CURLOPT_PROXYTYPE => CURLPROXY_HTTP,
        CURLOPT_PROXYUSERPWD => $proxyUser . ':' . $proxyPass,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_FAILONERROR => true,
        CURLOPT_USERAGENT => '123Proxy-Developer-Example/1.0',
    ]);
    $body = curl_exec($curl);
    if ($body === false) {
        $error = curl_error($curl);
        curl_close($curl);
        throw new RuntimeException($error);
    }
    curl_close($curl);
    return $body;
}

$records = [];
$url = 'https://quotes.toscrape.com/';
for ($pageNumber = 1; $pageNumber <= 3; $pageNumber++) {
    $html = fetchHtml(
        $url,
        $proxyHost,
        $proxyPort,
        $proxyUser,
        $proxyPass
    );
    $document = new DOMDocument();
    @$document->loadHTML($html, LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    foreach ($xpath->query('//div[contains(@class, "quote")]') as $quote) {
        $text = $xpath->query(
            './/span[contains(@class, "text")]',
            $quote
        )->item(0)?->textContent;
        $author = $xpath->query(
            './/small[contains(@class, "author")]',
            $quote
        )->item(0)?->textContent;
        $tags = [];
        foreach ($xpath->query(
            './/a[contains(@class, "tag")]',
            $quote
        ) as $tag) {
            $tags[] = trim($tag->textContent);
        }
        $records[] = [
            'text' => trim((string) $text),
            'author' => trim((string) $author),
            'tags' => $tags,
            'source_url' => $url,
        ];
    }

    $next = $xpath->query('//li[contains(@class, "next")]/a')
        ->item(0);
    if (!$next) {
        break;
    }
    $url = 'https://quotes.toscrape.com' .
        $next->getAttribute('href');
    usleep(500000);
}

file_put_contents(
    'quotes-php.json',
    json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);
echo 'saved ' . count($records) . " records to quotes-php.json\\n";`
};

const gatewayRows = [
  [
    "隧道代理",
    "proxy.123proxy.cn",
    "36923",
    "混合池 / 纯住宅池"
  ],
  [
    "隧道住宅代理",
    "residential.123proxy.cn",
    "33000",
    "国家地区与SESSION"
  ],
  [
    "不限量动态住宅",
    "unlimit.residential.123proxy.cn",
    "10253",
    "不限流量住宅任务"
  ],
  [
    "两类静态代理",
    "控制台分配的固定代理IP",
    "返回端口",
    "直连IP，无网关域名"
  ]
];

const guides = {
  requests: {
    label: "PYTHON HTTP CLIENT",
    title: "爬取静态分页页面并输出JSON Lines",
    lead: "使用Requests显式传入代理配置，BeautifulSoup解析Quotes to Scrape。代码处理连接超时、可重试状态码、分页、限速和UTF-8结构化输出。",
    language: "Python 3.10+",
    framework: "Requests + BeautifulSoup",
    target: "Quotes to Scrape",
    targetUrl: "https://quotes.toscrape.com/",
    output: "quotes.jsonl",
    codeLabel: "requests_spider.py",
    code: developerExampleSnippets.requests,
    docs: [
      ["Requests代理文档", "https://requests.readthedocs.io/en/stable/user/advanced/#proxies"],
      ["Beautiful Soup文档", "https://beautiful-soup-4.readthedocs.io/"],
      ["测试目标站点", "https://quotes.toscrape.com/"]
    ],
    checks: [
      "代理URL中的用户名和密码经过URL编码",
      "每次请求显式传入proxies，避免被系统代理覆盖",
      "只重试GET及429、5xx临时错误",
      "最多抓取3页并输出一行一个JSON对象"
    ],
    faq: [
      ["为什么没有只设置Session.proxies？", "Requests官方文档说明环境代理可能覆盖Session级配置。案例在每次请求中显式传入proxies，行为更可控。"],
      ["如何切换到隧道住宅代理？", "将代码中的固定接入地址改为residential.123proxy.cn:33000，并把控制台生成的完整地区或SESSION用户名放入PROXY_USER。"],
      ["如何扩大分页数量？", "先验证目标授权、robots规则和任务速率，再调整MAX_PAGES与请求间隔。"]
    ]
  },
  scrapy: {
    label: "PYTHON CRAWLING FRAMEWORK",
    title: "列表、详情、分页与Feed导出",
    lead: "一个文件即可启动Scrapy：从商品列表进入详情页，继续分页，并由Feed Export输出JSON Lines。所有请求都通过123Proxy固定网关。",
    language: "Python 3.10+",
    framework: "Scrapy",
    target: "Books to Scrape",
    targetUrl: "https://books.toscrape.com/",
    output: "books.jsonl",
    codeLabel: "books_spider.py",
    code: developerExampleSnippets.scrapy,
    docs: [
      ["Scrapy HttpProxyMiddleware", "https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpproxymiddleware"],
      ["Scrapy Feed Export", "https://docs.scrapy.org/en/latest/topics/feed-exports.html"],
      ["测试目标站点", "https://books.toscrape.com/"]
    ],
    checks: [
      "request.meta.proxy使用完整账密代理URL",
      "列表页、详情页和下一页请求都显式携带代理",
      "限制单域名并发并设置下载间隔",
      "详情页补充UPC、类型与库存字段"
    ],
    faq: [
      ["为什么每个Request都写meta.proxy？", "Scrapy的HttpProxyMiddleware读取Request.meta中的proxy值。显式传递能让列表、详情和分页请求保持一致代理策略。"],
      ["并发线程套餐应该怎么设置CONCURRENT_REQUESTS？", "该值代表Scrapy侧并发上限，不应高于套餐可用并发，并需同时观察目标域名限制和浏览器外的其他任务。"],
      ["SOCKS5可以直接使用这个案例吗？", "Scrapy内置HTTP11下载处理器的SOCKS支持有限。需要SOCKS时应使用支持SOCKS的下载处理器，或优先采用HTTP(S)代理。"]
    ]
  },
  playwright: {
    label: "PYTHON BROWSER AUTOMATION",
    title: "爬取JavaScript渲染页面并翻页",
    lead: "Playwright在浏览器启动时设置123Proxy网关和账密，等待页面网络稳定后读取渲染完成的DOM，连续抓取3页并写入JSON。",
    language: "Python 3.10+",
    framework: "Playwright",
    target: "Quotes to Scrape / JavaScript",
    targetUrl: "https://quotes.toscrape.com/js/",
    output: "quotes-playwright.json",
    codeLabel: "scrape_js.py",
    code: developerExampleSnippets.playwright,
    docs: [
      ["Playwright代理配置", "https://playwright.dev/python/docs/network#http-proxy"],
      ["Playwright Locator", "https://playwright.dev/python/docs/locators"],
      ["JavaScript测试目标", "https://quotes.toscrape.com/js/"]
    ],
    checks: [
      "代理在chromium.launch阶段设置，覆盖页面资源请求",
      "用户名与密码使用独立字段，不拼进server",
      "等待networkidle及目标元素，避免固定长时间sleep",
      "复用同一BrowserContext完成连续分页"
    ],
    faq: [
      ["为什么浏览器爬虫比Requests消耗更多并发？", "浏览器会同时加载HTML、JavaScript、CSS、字体、图片和接口，一个页面通常产生多条并发请求。"],
      ["什么时候适合使用不限量动态住宅？", "持续浏览器任务需要较多流量和并发时可考虑不限量动态住宅，并使用固定网关unlimit.residential.123proxy.cn:10253。"],
      ["SESSION应该如何保持？", "使用隧道住宅或隧道代理纯住宅池时，把控制台生成的完整SESSION用户名作为PROXY_USER，并复用同一BrowserContext。"]
    ]
  },
  selenium: {
    label: "PYTHON BROWSER AUTOMATION",
    title: "使用认证扩展爬取JavaScript渲染页面",
    lead: "Selenium启动Chrome时加载一个临时Manifest V3扩展，由扩展设置不限量动态住宅网关并响应代理认证。案例使用显式等待抓取3页内容，结束时自动清理浏览器和临时凭证文件。",
    language: "Python 3.10+ / Chrome 108+",
    framework: "Selenium 4 + Chromium",
    target: "Quotes to Scrape / JavaScript",
    targetUrl: "https://quotes.toscrape.com/js/",
    output: "quotes-selenium.json",
    codeLabel: "selenium_proxy.py",
    code: developerExampleSnippets.selenium,
    gateway: "unlimit.residential.123proxy.cn",
    port: 10253,
    productName: "不限量动态住宅",
    consoleProduct: "unlimited",
    productGuide: "/developers/products/unlimited-residential-proxy/",
    docs: [
      ["Selenium Chrome配置", "https://www.selenium.dev/documentation/webdriver/browsers/chrome/"],
      ["Selenium显式等待", "https://www.selenium.dev/documentation/webdriver/waits/"],
      ["Chrome WebRequest认证", "https://developer.chrome.com/docs/extensions/reference/api/webRequest"],
      ["JavaScript测试目标", "https://quotes.toscrape.com/js/"]
    ],
    checks: [
      "代理网关固定为unlimit.residential.123proxy.cn:10253",
      "Manifest V3使用webRequestAuthProvider响应代理认证",
      "凭证只写入临时扩展目录，程序结束后删除",
      "默认有界面运行，HEADLESS=1时使用新版Chrome无头模式",
      "显式等待目标元素并限制最大分页数量"
    ],
    faq: [
      ["为什么Selenium不能直接像Requests一样传入代理账密？", "Chrome启动参数可以指定代理服务器，但不会安全接收用户名与密码。案例使用临时Manifest V3扩展设置代理并处理认证挑战。"],
      ["为什么默认不是无头模式？", "带认证扩展的可见模式兼容性更容易验证。Chrome 108+可设置HEADLESS=1使用新版无头模式，部署前应在目标镜像中实际测试扩展加载。"],
      ["如何切换地区？", "不限量动态住宅的地区与3-30分钟轮转周期在控制台按套餐设置，不写入Selenium代码。修改后等待同步并重启浏览器连接。"],
      ["一个浏览器会占用多少并发？", "浏览器会并行加载HTML、脚本、样式、图片、字体和接口，一页通常会产生多条在途代理请求。应以网络面板与实际p95数据测量。"]
    ]
  },
  puppeteer: {
    label: "NODE.JS BROWSER AUTOMATION",
    title: "爬取无限滚动页面并按内容去重",
    lead: "Puppeteer通过--proxy-server指定123Proxy网关，再用page.authenticate发送代理账密。案例滚动到内容稳定，提取字段、去重并保存JSON。",
    language: "Node.js 20+",
    framework: "Puppeteer",
    target: "Quotes to Scrape / Infinite Scroll",
    targetUrl: "https://quotes.toscrape.com/scroll",
    output: "quotes-puppeteer.json",
    codeLabel: "scrape-scroll.js",
    code: developerExampleSnippets.puppeteer,
    docs: [
      ["Puppeteer Page.authenticate", "https://pptr.dev/api/puppeteer.page.authenticate"],
      ["Puppeteer Page", "https://pptr.dev/api/puppeteer.page"],
      ["无限滚动测试目标", "https://quotes.toscrape.com/scroll"]
    ],
    checks: [
      "Chromium启动参数只包含代理服务器，不暴露账密",
      "page.authenticate提供代理用户名和密码",
      "内容连续3轮不增长时结束滚动",
      "使用作者与正文组合键去重"
    ],
    faq: [
      ["page.authenticate会影响性能吗？", "Puppeteer官方文档说明该方法会启用请求拦截。生产任务应通过实际页面完成时间评估影响。"],
      ["为什么不一直滚动到底？", "无限页面可能没有明确结束标记。案例同时限制最大轮次和连续稳定轮次，避免任务永久运行。"],
      ["多个浏览器worker如何接入？", "所有worker连接unlimit.residential.123proxy.cn:10253，并使用控制台生成的代理账密；再由程序控制worker并发和目标站点速率。"]
    ]
  },
  axios: {
    label: "NODE.JS HTTP CLIENT",
    title: "使用原生代理配置爬取分页网页",
    lead: "Axios通过原生proxy选项连接隧道住宅网关，Cheerio解析分页HTML。案例复用HTTP连接，只对429、5xx与临时网络错误执行有限退避，并输出JSON Lines。",
    language: "Node.js 20+",
    framework: "Axios + Cheerio",
    target: "Quotes to Scrape",
    targetUrl: "https://quotes.toscrape.com/",
    output: "quotes-axios.jsonl",
    codeLabel: "scrape-axios.mjs",
    code: developerExampleSnippets.axios,
    gateway: "residential.123proxy.cn",
    port: 33000,
    productName: "隧道住宅代理",
    consoleProduct: "residential",
    productGuide: "/developers/products/residential-rotating-proxy/",
    docs: [
      ["Axios请求配置", "https://axios-http.com/docs/req_config"],
      ["Axios错误处理", "https://axios-http.com/docs/handling_errors"],
      ["Cheerio文档", "https://cheerio.js.org/docs/intro"],
      ["测试目标站点", "https://quotes.toscrape.com/"]
    ],
    checks: [
      "proxy对象分别设置协议、主机、端口和代理账密",
      "固定住宅网关为residential.123proxy.cn:33000",
      "HTTP与HTTPS Agent启用keepAlive并限制连接数",
      "仅重试429、5xx、连接重置与超时",
      "解析相对分页URL并输出一行一个JSON对象"
    ],
    faq: [
      ["PROXY_USER应该填写什么？", "填写控制台生成的完整代理用户名。需要国家或SESSION时，地区后缀与SESSION参数都属于完整用户名，不要在Axios代码中再次拼接。"],
      ["为什么没有设置HTTP_PROXY环境变量？", "案例使用Axios原生proxy配置，使代理行为与当前爬虫客户端绑定，避免进程环境代理影响其他请求。"],
      ["如何使用隧道代理？", "把固定地址改为proxy.123proxy.cn:36923，并使用隧道代理控制台生成的代理用户名与密码；其他爬虫逻辑保持不变。"],
      ["429是否应该立即重试？", "不应该。优先读取Retry-After，否则使用指数退避与随机抖动，并降低目标域名的并发和QPS。"]
    ]
  },
  colly: {
    label: "GO CRAWLING FRAMEWORK",
    title: "分页爬取、限速与CSV输出",
    lead: "Colly使用官方proxy switcher接入123Proxy网关，CSS回调解析Quotes to Scrape，自动访问下一页，并将结构化字段写入CSV。",
    language: "Go 1.22+",
    framework: "Colly v2",
    target: "Quotes to Scrape",
    targetUrl: "https://quotes.toscrape.com/",
    output: "quotes-colly.csv",
    codeLabel: "main.go",
    code: developerExampleSnippets.colly,
    docs: [
      ["Colly代理切换器", "https://go-colly.org/docs/examples/proxy_switcher/"],
      ["Colly配置", "https://go-colly.org/docs/introduction/configuration/"],
      ["测试目标站点", "https://quotes.toscrape.com/"]
    ],
    checks: [
      "net/url安全构造带账密的代理URL",
      "SetProxyFunc绑定到Collector",
      "AllowedDomains限制爬虫边界",
      "LimitRule控制并发和随机延迟"
    ],
    faq: [
      ["只有一个网关为什么使用RoundRobinProxySwitcher？", "它是Colly官方提供的代理接入函数，单个123Proxy网关同样可用；出口轮转由代理网络完成。"],
      ["如何接入不限量动态住宅？", "把代理地址固定为unlimit.residential.123proxy.cn:10253，并使用控制台生成的代理账密；无需在程序中猜测或生成网关端口。"],
      ["如何处理429？", "在OnError中记录状态码，按目标域名降低Parallelism并增加RandomDelay。不要无上限立即重试。"]
    ]
  },
  jsoup: {
    label: "JAVA HTML PARSER",
    title: "代理认证、CSS选择器与CSV输出",
    lead: "Jsoup 1.17.1+支持请求级代理认证。案例创建可复用Connection会话，爬取Books to Scrape三页商品并输出UTF-8 CSV。",
    language: "Java 17+",
    framework: "Jsoup 1.21+",
    target: "Books to Scrape",
    targetUrl: "https://books.toscrape.com/",
    output: "books-jsoup.csv",
    codeLabel: "BooksWithProxy.java",
    code: developerExampleSnippets.jsoup,
    docs: [
      ["Jsoup Connection.auth", "https://jsoup.org/apidocs/org/jsoup/Connection"],
      ["Jsoup请求会话", "https://jsoup.org/cookbook/web/request-session"],
      ["测试目标站点", "https://books.toscrape.com/"]
    ],
    checks: [
      "HTTPS CONNECT前解除JDK对Basic代理认证的默认禁用",
      "auth回调只在context.isProxy时返回凭证",
      "Connection会话复用代理、User-Agent和超时",
      "CSS选择器提取字段并对CSV双引号执行转义"
    ],
    faq: [
      ["为什么还要设置jdk.http.auth.tunneling.disabledSchemes？", "JDK默认可能禁止HTTPS CONNECT隧道使用Basic代理认证。该属性必须在第一次认证前设置为空，否则代理账密正确也可能返回407。"],
      ["为什么要求Jsoup 1.17.1以上？", "Jsoup从1.17.1加入请求级认证能力，可为代理认证安全返回用户名和密码。"],
      ["能否使用Java全局Authenticator？", "可以，但全局Authenticator容易影响同一JVM中的其他HTTP请求。案例优先使用Jsoup连接级auth回调。"],
      ["如何抓取详情页？", "从detailUrl继续调用session.newRequest(url).get()，并保持同一代理会话和限速策略。"]
    ]
  },
  php: {
    label: "PHP HTTP + DOM",
    title: "cURL代理请求、XPath解析与JSON输出",
    lead: "PHP cURL负责代理连接和错误处理，DOMDocument与DOMXPath解析Quotes to Scrape。案例连续抓取3页并输出UTF-8 JSON。",
    language: "PHP 8.1+",
    framework: "cURL + DOMXPath",
    target: "Quotes to Scrape",
    targetUrl: "https://quotes.toscrape.com/",
    output: "quotes-php.json",
    codeLabel: "scrape.php",
    code: developerExampleSnippets.php,
    docs: [
      ["PHP CURLOPT_PROXY", "https://www.php.net/manual/en/curl.constants.php"],
      ["PHP DOMXPath", "https://www.php.net/manual/en/class.domxpath.php"],
      ["测试目标站点", "https://quotes.toscrape.com/"]
    ],
    checks: [
      "代理主机、端口与CURLOPT_PROXYUSERPWD分别设置",
      "连接超时和总超时分开配置",
      "HTTP 4xx/5xx通过CURLOPT_FAILONERROR进入错误处理",
      "XPath相对当前quote节点提取字段"
    ],
    faq: [
      ["为什么不把账密直接拼到代理URL？", "CURLOPT_PROXYUSERPWD专门处理代理凭证，避免特殊字符破坏URL结构。"],
      ["PHP缺少DOMDocument怎么办？", "需要启用dom扩展；缺少cURL时也必须先启用curl扩展。"],
      ["如何改为SOCKS5？", "将CURLOPT_PROXYTYPE改为CURLPROXY_SOCKS5_HOSTNAME，并使用控制台生成的SOCKS接入信息。"]
    ]
  }
};

function gatewayTable() {
  return `
    <div class="docs-gateway-table">
      <div class="docs-gateway-head"><span>代理产品</span><span>网关域名</span><span>端口</span><span>适合任务</span></div>
      ${gatewayRows.map((row) => `<div>${row.map((cell, index) => index === 1 || index === 2 ? `<code>${cell}</code>` : `<span>${cell}</span>`).join("")}</div>`).join("")}
    </div>`;
}

function articleHeader(page, icon, guide = null) {
  const facts = guide
    ? [
        ["语言", guide.language],
        ["框架", guide.framework],
        ["测试目标", guide.target],
        ["输出", guide.output]
      ]
    : [
        ["框架", "9种完整案例"],
        ["网关", "123Proxy固定域名"],
        ["测试目标", "3类公开沙箱"],
        ["交付", "结构化文件"]
      ];
  return `
    <nav class="docs-breadcrumb" aria-label="面包屑">
      <a href="/developers/">开发者中心</a>${icon("chevron-right")}
      <a href="/developers/examples/">代码案例</a>
      ${guide ? `${icon("chevron-right")}<span>${guide.framework}</span>` : ""}
    </nav>
    <header class="docs-article-header">
      <span class="docs-eyebrow">${icon(guide ? "braces" : "blocks")}${guide?.label || "RUNNABLE CRAWLER EXAMPLES"}</span>
      <h1>${page.heading}</h1>
      <p>${guide?.lead || "围绕真实爬取流程提供完整代码：配置123Proxy网关、请求目标、解析字段、处理分页或滚动，并把结果写入JSON、JSON Lines或CSV。"}</p>
      <div class="docs-product-facts">
        ${facts.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("")}
      </div>
      <div class="docs-article-actions">
        <a class="btn btn-primary" href="${guide ? `https://console.123proxy.cn/app/#extract?product=${guide.consoleProduct || page.consoleProduct || "tunnel"}` : "https://console.123proxy.cn/app/"}">${icon("terminal")}${guide ? "打开对应产品提取" : "打开控制台获取账密"}</a>
        ${guide ? `<a class="btn docs-secondary-button" href="${guide.targetUrl}" target="_blank" rel="noreferrer">${icon("external-link")}查看测试目标</a>` : ""}
      </div>
    </header>`;
}

function exampleCards(icon) {
  const cards = [
    ["python-requests-proxy", "Python", "Requests + BeautifulSoup", "静态分页网页", "quotes.jsonl", "file-code-2"],
    ["scrapy-proxy", "Python", "Scrapy", "列表 + 详情 + 分页", "books.jsonl", "workflow"],
    ["playwright-proxy", "Python", "Playwright", "JavaScript渲染", "quotes-playwright.json", "panels-top-left"],
    ["selenium-proxy", "Python", "Selenium 4", "JavaScript渲染", "quotes-selenium.json", "monitor-dot"],
    ["puppeteer-proxy", "Node.js", "Puppeteer", "无限滚动页面", "quotes-puppeteer.json", "mouse-pointer-2"],
    ["nodejs-axios-proxy", "Node.js", "Axios + Cheerio", "静态分页网页", "quotes-axios.jsonl", "send"],
    ["go-colly-proxy", "Go", "Colly", "并发分页爬取", "quotes-colly.csv", "boxes"],
    ["java-jsoup-proxy", "Java", "Jsoup", "HTML目录页面", "books-jsoup.csv", "coffee"],
    ["php-curl-proxy", "PHP", "cURL + DOMXPath", "静态分页网页", "quotes-php.json", "braces"]
  ];
  return `
    <div class="docs-example-grid">
      ${cards.map(([slug, language, framework, target, output, itemIcon]) => `
        <a class="docs-example-card" href="/developers/examples/${slug}/">
          <span class="docs-example-icon">${icon(itemIcon)}</span>
          <small>${language}</small>
          <strong>${framework}</strong>
          <p>${target}</p>
          <code>${output}</code>
          ${icon("arrow-right")}
        </a>`).join("")}
    </div>`;
}

function renderHub(page, helpers) {
  const { icon, codeTabs, articleLayout } = helpers;
  const content = `
    ${articleHeader(page, icon)}
    <section id="choose">
      <div class="docs-section-title"><span>01</span><div><small>CHOOSE A FRAMEWORK</small><h2>按你的技术栈打开完整案例</h2></div></div>
      <p>每个案例都包含安装、启动、代理认证、爬虫循环、终止条件和结构化输出，不省略最关键的工程代码。</p>
      ${exampleCards(icon)}
    </section>

    <section id="gateways">
      <div class="docs-section-title"><span>02</span><div><small>123PROXY GATEWAYS</small><h2>代码中直接使用代理网关域名</h2></div></div>
      <p>默认案例使用隧道代理的爬虫混合池。复制后只需设置 <code>PROXY_USER</code> 与 <code>PROXY_PASS</code>。切换其他动态产品时使用下表网关；最终端口和完整路由用户名以控制台生成结果为准。</p>
      ${gatewayTable()}
      <div class="docs-callout is-important">
        ${icon("triangle-alert")}
        <div><strong>三个动态产品都使用123Proxy固定网关</strong><p>隧道代理、隧道住宅和不限量动态住宅分别使用上表中的固定域名与端口。两类静态代理没有网关域名，必须直连控制台分配的代理IP和返回端口。</p></div>
      </div>
    </section>

    <section id="verify">
      <div class="docs-section-title"><span>03</span><div><small>VERIFY FIRST</small><h2>先确认账密与代理出口</h2></div></div>
      <p>运行任何爬虫前，先用同一组网关和代理账密访问HTTP测试服务。成功返回出口IP后，再排查框架、解析器或目标页面。</p>
      ${codeTabs("examples-verify", {
        curl: { label: "cURL", code: developerExampleSnippets.verifyCurl }
      }, "curl")}
    </section>

    <section id="targets">
      <div class="docs-section-title"><span>04</span><div><small>SAFE TEST TARGETS</small><h2>案例使用公开爬虫测试站点</h2></div></div>
      <div class="docs-target-grid">
        <article>${icon("network")}<div><strong>httpbin</strong><p>验证出口IP、请求头、状态码与超时，不承担业务爬取。</p><code>https://httpbin.org/ip</code></div></article>
        <article>${icon("list-tree")}<div><strong>Quotes to Scrape</strong><p>覆盖静态分页、JavaScript渲染和无限滚动页面。</p><code>https://quotes.toscrape.com/</code></div></article>
        <article>${icon("library")}<div><strong>Books to Scrape</strong><p>覆盖商品列表、详情页、相对链接和多页目录。</p><code>https://books.toscrape.com/</code></div></article>
      </div>
      <p class="docs-quiet-note">${icon("shield-check")}这些站点专用于爬虫学习和技术验证。迁移到业务目标前，仍需确认访问授权、robots规则、服务条款、个人信息和数据使用边界。</p>
    </section>

    <section id="products">
      <div class="docs-section-title"><span>05</span><div><small>PRODUCT MAPPING</small><h2>按爬虫行为选择代理套餐</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>爬虫行为</span><span>推荐起点</span><span>代码调整</span></div>
        <div><strong>高频HTTP列表与详情</strong><span>隧道代理（爬虫混合池）</span><span>默认网关即可运行</span></div>
        <div><strong>明确国家与连续SESSION</strong><span>隧道住宅代理</span><span>替换网关并使用完整路由用户名</span></div>
        <div><strong>持续浏览器自动化</strong><span>不限量动态住宅</span><span>固定网关端口10253</span></div>
        <div><strong>目标系统要求固定出口</strong><span>长效静态代理</span><span>先分配IP，再把返回代理写入代码</span></div>
      </div>
    </section>`;
  return articleLayout(page, content, [
    ["#choose", "选择框架"],
    ["#gateways", "代理网关"],
    ["#verify", "出口验证"],
    ["#targets", "测试目标"],
    ["#products", "套餐映射"]
  ]);
}

function renderGuide(page, guide, helpers) {
  const { icon, codeTabs, articleLayout } = helpers;
  const gateway = guide.gateway || "proxy.123proxy.cn";
  const port = guide.port || 36923;
  const productName = guide.productName || "隧道代理";
  const productGuide = guide.productGuide || "/developers/products/scraping-rotating-proxy/";
  const envBash = `export PROXY_USER="替换为控制台代理用户名"
export PROXY_PASS="替换为控制台代理密码"
# ${productName}固定网关：${gateway}:${port}`;
  const envPowerShell = `$env:PROXY_USER="替换为控制台代理用户名"
$env:PROXY_PASS="替换为控制台代理密码"
# ${productName}固定网关：${gateway}:${port}`;
  const content = `
    ${articleHeader(page, icon, guide)}

    <section id="result">
      <div class="docs-section-title"><span>01</span><div><small>END-TO-END RESULT</small><h2>${guide.title}</h2></div></div>
      <div class="docs-run-summary">
        <span><small>测试目标</small><strong>${guide.target}</strong><code>${guide.targetUrl}</code></span>
        <span><small>运行时</small><strong>${guide.language}</strong><code>${guide.framework}</code></span>
        <span><small>输出文件</small><strong>结构化数据</strong><code>${guide.output}</code></span>
      </div>
      <p>代码直接连接${productName}固定网关 <code>${gateway}:${port}</code>。主机与端口无需替换，出口路由由当前产品配置决定；你只需设置控制台生成的完整代理用户名和密码。</p>
    </section>

    <section id="credentials">
      <div class="docs-section-title"><span>02</span><div><small>CREDENTIALS</small><h2>只把代理账密放进环境变量</h2></div></div>
      <p><code>PROXY_USER</code>必须是控制台中的代理用户名，不是网站登录手机号。地区和SESSION场景应复制控制台生成的完整路由用户名。</p>
      ${codeTabs(`${page.key}-env`, {
        bash: { label: "macOS / Linux", code: envBash },
        powershell: { label: "PowerShell", code: envPowerShell }
      }, "bash")}
      <p class="docs-quiet-note">${icon("lock-keyhole")}不要把真实代理密码提交到Git仓库、镜像、日志或前端代码中。</p>
    </section>

    <section id="code">
      <div class="docs-section-title"><span>03</span><div><small>COMPLETE PROGRAM</small><h2>${guide.codeLabel}</h2></div></div>
      <p>以下代码包含完整入口和输出逻辑。安装注释、运行命令与依赖声明保留在文件顶部，复制为对应文件后即可执行。</p>
      ${codeTabs(`${page.key}-complete`, {
        source: { label: guide.framework, code: guide.code }
      }, "source")}
    </section>

    <section id="checks">
      <div class="docs-section-title"><span>04</span><div><small>ENGINEERING CHECKS</small><h2>案例没有省略的关键逻辑</h2></div></div>
      <div class="docs-check-grid">
        ${guide.checks.map((item, index) => `<div><span>0${index + 1}</span>${icon("circle-check")}<strong>${item}</strong></div>`).join("")}
      </div>
    </section>

    <section id="switch-product">
      <div class="docs-section-title"><span>05</span><div><small>SWITCH PROXY PRODUCT</small><h2>替换网关，不改爬虫逻辑</h2></div></div>
      ${gatewayTable()}
      <div class="docs-callout">
        ${icon("route")}
        <div><strong>隧道住宅代理的国家与SESSION写在完整代理用户名中</strong><p>网关固定为 <code>residential.123proxy.cn:33000</code>。例如使用美国SESSION时，直接把控制台生成的完整用户名作为 <code>PROXY_USER</code>，代码无需解析或重组。</p></div>
      </div>
    </section>

    <section id="references">
      <div class="docs-section-title"><span>06</span><div><small>PRIMARY REFERENCES</small><h2>框架文档与测试目标</h2></div></div>
      <div class="docs-source-links">
        ${guide.docs.map(([label, href]) => `<a href="${href}" target="_blank" rel="noreferrer"><span>${icon("external-link")}</span><strong>${label}</strong><code>${href}</code></a>`).join("")}
      </div>
    </section>

    <section id="faq">
      <div class="docs-section-title"><span>07</span><div><small>TROUBLESHOOTING</small><h2>常见问题</h2></div></div>
      <div class="docs-troubleshooting">
        ${guide.faq.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${question}${icon("chevron-down")}</summary><p>${answer}</p></details>`).join("")}
      </div>
    </section>

    <nav class="docs-next">
      <span>对应产品手册</span>
      <a href="${productGuide}"><div><small>${productName}</small><strong>查看认证、地区与轮转规则</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#result", "案例结果"],
    ["#credentials", "设置账密"],
    ["#code", "完整代码"],
    ["#checks", "工程检查"],
    ["#switch-product", "切换产品"],
    ["#references", "参考文档"],
    ["#faq", "常见问题"]
  ]);
}

export function renderDeveloperExample(page, helpers) {
  if (page.exampleKey === "hub") return renderHub(page, helpers);
  const guide = guides[page.exampleKey];
  if (!guide) throw new Error(`Unknown developer example: ${page.exampleKey}`);
  return renderGuide(page, guide, helpers);
}

export function developerExampleFaq(page) {
  const guide = guides[page.exampleKey];
  if (!guide) return [];
  return guide.faq.map(([question, answer]) => ({ question, answer }));
}
