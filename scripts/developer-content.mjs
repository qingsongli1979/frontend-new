import {
  developerExampleOrder,
  developerExamplePages,
  developerExampleSearch,
  developerExampleFaq,
  renderDeveloperExample
} from "./developer-examples.mjs";
import {
  developerGuideOrder,
  developerGuidePages,
  developerGuideSearch,
  renderDeveloperGuide
} from "./developer-guides.mjs";
import {
  lastModifiedForRoute,
  productSeoFacts,
  seoOrganization
} from "./seo-entities.mjs";

const productLinks = [
  {
    name: "高带宽代理 IP",
    description: "项目制网关、定制代理池与 10Gbps+ 聚合容量",
    href: "/high-bandwidth-proxy.html",
    icon: "gauge",
    meta: "项目接入"
  },
  {
    name: "隧道代理",
    description: "混合池与纯住宅池，流量或并发线程套餐",
    href: "/developers/products/scraping-rotating-proxy/",
    icon: "route",
    meta: "完整手册",
    featured: true
  },
  {
    name: "隧道住宅代理",
    description: "国家定位、SESSION 与 8000 万+住宅 IP",
    href: "/developers/products/residential-rotating-proxy/",
    icon: "globe-2",
    meta: "完整手册"
  },
  {
    name: "不限量动态住宅",
    description: "连续端口、套餐级地区与 3-30 分钟轮转",
    href: "/developers/products/unlimited-residential-proxy/",
    icon: "refresh-cw",
    meta: "完整手册"
  },
  {
    name: "长效静态代理",
    description: "固定数据中心 IP 的分配与账密接入",
    href: "/developers/products/static-datacenter-proxy/",
    icon: "server",
    meta: "完整手册"
  },
  {
    name: "长效静态住宅",
    description: "固定住宅 ISP IP 的分配与长期使用",
    href: "/developers/products/static-residential-proxy/",
    icon: "house-plug",
    meta: "完整手册"
  }
];

export const developerPages = {
  home: {
    key: "home",
    output: "developers/index.html",
    route: "/developers/",
    title: "开发者中心 | 123Proxy",
    description: "123Proxy 开发者中心：快速接入代理网关，了解认证、地区、SESSION、轮转、提取 API 与代码示例。",
    heading: "从一条 cURL 开始，接入全球代理网络"
  },
  gettingStarted: {
    key: "getting-started",
    output: "developers/getting-started/index.html",
    route: "/developers/getting-started/",
    title: "5 分钟快速开始 | 123Proxy 开发者中心",
    description: "通过 123Proxy 控制台生成代理，使用 cURL 验证 HTTP(S) 或 SOCKS5，并接入 Python 采集程序。",
    heading: "5 分钟完成第一个代理请求"
  },
  tunnel: {
    key: "tunnel",
    output: "developers/products/scraping-rotating-proxy/index.html",
    route: "/developers/products/scraping-rotating-proxy/",
    title: "隧道代理接入手册 | 123Proxy 开发者中心",
    description: "123Proxy 隧道代理接入手册：双代理池、全球随机、粗粒度地区、账密与白名单认证、SESSION 和代码示例。",
    heading: "隧道代理接入手册"
  },
  residential: {
    key: "residential",
    output: "developers/products/residential-rotating-proxy/index.html",
    route: "/developers/products/residential-rotating-proxy/",
    title: "隧道住宅代理接入手册 | 123Proxy 开发者中心",
    description: "123Proxy 隧道住宅代理接入手册：8000 万+住宅 IP、190+国家和地区、国家码、SESSION、账密与白名单认证。",
    heading: "隧道住宅代理接入手册"
  },
  unlimited: {
    key: "unlimited",
    output: "developers/products/unlimited-residential-proxy/index.html",
    route: "/developers/products/unlimited-residential-proxy/",
    title: "不限量动态住宅接入手册 | 123Proxy 开发者中心",
    description: "123Proxy 不限量动态住宅接入手册：套餐连续端口、每端口不限流量与并发、套餐级地区和 3-30 分钟轮转。",
    heading: "不限量动态住宅接入手册"
  },
  staticDatacenter: {
    key: "static-datacenter",
    output: "developers/products/static-datacenter-proxy/index.html",
    route: "/developers/products/static-datacenter-proxy/",
    title: "长效静态代理接入手册 | 123Proxy 开发者中心",
    description: "123Proxy 长效静态代理接入手册：生成固定数据中心 IP 分配链接、解析返回代理并通过账密认证接入。",
    heading: "长效静态代理接入手册"
  },
  staticResidential: {
    key: "static-residential",
    output: "developers/products/static-residential-proxy/index.html",
    route: "/developers/products/static-residential-proxy/",
    title: "长效静态住宅接入手册 | 123Proxy 开发者中心",
    description: "123Proxy 长效静态住宅接入手册：生成住宅 ISP IP 分配链接、解析返回代理并通过账密认证接入。",
    heading: "长效静态住宅接入手册"
  },
  ...developerGuidePages,
  ...developerExamplePages
};

export const developerOrder = [
  "home",
  "gettingStarted",
  "tunnel",
  "residential",
  "unlimited",
  "staticDatacenter",
  "staticResidential",
  ...developerGuideOrder,
  ...developerExampleOrder
];

const searchIndex = [
  {
    title: "开发者中心",
    section: "开始使用",
    href: "/developers/",
    keywords: "开发文档 文档首页 产品选择 代码示例"
  },
  {
    title: "5 分钟快速开始",
    section: "开始使用",
    href: "/developers/getting-started/",
    keywords: "curl python http socks 认证 控制台 生成代理"
  },
  {
    title: "隧道代理接入手册",
    section: "产品接入",
    href: "/developers/products/scraping-rotating-proxy/",
    keywords: "Scraping rotating proxy 混合池 纯住宅池 session 白名单 地区 并发 流量"
  },
  {
    title: "隧道住宅代理接入手册",
    section: "产品接入",
    href: "/developers/products/residential-rotating-proxy/",
    keywords: "Residential rotating proxy 8000万 190 国家码 +us session 住宅IP 按流量"
  },
  {
    title: "不限量动态住宅接入手册",
    section: "产品接入",
    href: "/developers/products/unlimited-residential-proxy/",
    keywords: "不限流量 不限并发 连续端口 端口范围 3-30分钟 套餐级地区"
  },
  {
    title: "长效静态代理接入手册",
    section: "产品接入",
    href: "/developers/products/static-datacenter-proxy/",
    keywords: "固定数据中心IP 分配链接 提取API 账密认证 无白名单 不轮转"
  },
  {
    title: "长效静态住宅接入手册",
    section: "产品接入",
    href: "/developers/products/static-residential-proxy/",
    keywords: "固定住宅ISP IP 分配链接 提取API 账密认证 无白名单 长效"
  },
  ...developerGuideSearch,
  ...developerExampleSearch,
  {
    title: "代理认证",
    section: "核心概念",
    href: "/developers/getting-started/#authentication",
    keywords: "用户名 密码 账密 whitelist allowlist IP白名单 407"
  },
  {
    title: "HTTP(S) 与 SOCKS5",
    section: "核心概念",
    href: "/developers/getting-started/#protocols",
    keywords: "http https socks5 proxy curl"
  },
  {
    title: "SESSION 与出口轮转",
    section: "核心概念",
    href: "/developers/products/residential-rotating-proxy/#session",
    keywords: "sticky session 粘性会话 ttl 国家码 轮换 换ip"
  },
  {
    title: "连续端口与套餐级轮转",
    section: "核心概念",
    href: "/developers/products/unlimited-residential-proxy/#ports",
    keywords: "port range 端口范围 worker 3-30分钟 不限并发"
  },
  {
    title: "静态 IP 分配链接",
    section: "核心概念",
    href: "/developers/products/static-datacenter-proxy/#allocation",
    keywords: "allocation extract api 分配链接 固定IP 返回格式"
  },
  {
    title: "代理可用性测试",
    section: "错误排查",
    href: "/developers/getting-started/#verify",
    keywords: "测试 出口ip 超时 407 curl check"
  }
];

const codeSamples = {
  quickCurl: `export PROXY_USER="YOUR_PROXY_USER"
export PROXY_PASS="YOUR_PROXY_PASSWORD"

curl --fail-with-body --silent --show-error \\
  --proxy "http://proxy.123proxy.cn:36923" \\
  --proxy-user "\${PROXY_USER}:\${PROXY_PASS}" \\
  --connect-timeout 15 \\
  --max-time 30 \\
  "https://api.ipify.org?format=json"`,
  quickPython: `import os
import requests

host = "proxy.123proxy.cn"
port = 36923
username = os.environ["PROXY_USER"]
password = os.environ["PROXY_PASS"]

proxy_url = f"http://{username}:{password}@{host}:{port}"
proxies = {"http": proxy_url, "https": proxy_url}

response = requests.get(
    "https://api.ipify.org?format=json",
    proxies=proxies,
    timeout=(15, 30),
)
response.raise_for_status()
print(response.json())`,
  quickScrapy: `# settings.py
HTTPPROXY_ENABLED = True
DOWNLOAD_TIMEOUT = 30
RETRY_TIMES = 3

# spider.py
import os
import scrapy
from urllib.parse import quote

user = quote(os.environ["PROXY_USER"], safe="")
password = quote(os.environ["PROXY_PASS"], safe="")
host = "proxy.123proxy.cn"
port = 36923

proxy = f"http://{user}:{password}@{host}:{port}"
yield scrapy.Request(
    "https://api.ipify.org?format=json",
    meta={"proxy": proxy},
)`,
  quickNode: `// npm install axios
const axios = require("axios");

const response = await axios.get(
  "https://api.ipify.org?format=json",
  {
    proxy: {
      protocol: "http",
      host: "proxy.123proxy.cn",
      port: 36923,
      auth: {
        username: process.env.PROXY_USER,
        password: process.env.PROXY_PASS,
      },
    },
    timeout: 30000,
  },
);

console.log(response.data);`,
  quickGo: `package main

import (
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
    "time"
)

func main() {
    proxyURL := &url.URL{
        Scheme: "http",
        Host: "proxy.123proxy.cn:36923",
        User: url.UserPassword(os.Getenv("PROXY_USER"), os.Getenv("PROXY_PASS")),
    }
    client := &http.Client{
        Transport: &http.Transport{Proxy: http.ProxyURL(proxyURL)},
        Timeout: 30 * time.Second,
    }
    response, err := client.Get("https://api.ipify.org?format=json")
    if err != nil { panic(err) }
    defer response.Body.Close()
    if response.StatusCode >= 400 { panic(response.Status) }
    body, err := io.ReadAll(response.Body)
    if err != nil { panic(err) }
    fmt.Println(string(body))
}`,
  quickJava: `import java.net.Authenticator;
import java.net.InetSocketAddress;
import java.net.PasswordAuthentication;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ProxyCheck {
    public static void main(String[] args) throws Exception {
        System.setProperty("jdk.http.auth.tunneling.disabledSchemes", "");
        String host = "proxy.123proxy.cn";
        int port = 36923;
        String user = System.getenv("PROXY_USER");
        char[] password = System.getenv("PROXY_PASS").toCharArray();

        HttpClient client = HttpClient.newBuilder()
            .proxy(ProxySelector.of(new InetSocketAddress(host, port)))
            .authenticator(new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(user, password);
                }
            })
            .connectTimeout(Duration.ofSeconds(15))
            .build();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.ipify.org?format=json"))
            .timeout(Duration.ofSeconds(30))
            .GET()
            .build();
        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );
        if (response.statusCode() >= 400) throw new RuntimeException(response.body());
        System.out.println(response.body());
    }
}`,
  quickPhp: `<?php
$host = "proxy.123proxy.cn";
$port = 36923;
$user = getenv("PROXY_USER");
$password = getenv("PROXY_PASS");

$curl = curl_init("https://api.ipify.org?format=json");
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_PROXY => $host,
    CURLOPT_PROXYPORT => (int) $port,
    CURLOPT_PROXYUSERPWD => $user . ":" . $password,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT => 30,
]);
$body = curl_exec($curl);
if ($body === false) {
    throw new RuntimeException(curl_error($curl));
}
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);
if ($status >= 400) throw new RuntimeException($body);
echo $body . PHP_EOL;`,
  quickPlaywright: `# python -m pip install playwright
# playwright install chromium
import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            proxy={
                "server": "http://proxy.123proxy.cn:36923",
                "username": os.environ["PROXY_USER"],
                "password": os.environ["PROXY_PASS"],
            }
        )
        page = await browser.new_page()
        await page.goto(
            "https://api.ipify.org?format=json",
            wait_until="domcontentloaded",
            timeout=30000,
        )
        print(await page.text_content("body"))
        await browser.close()

asyncio.run(main())`,
  unlimitedWorkersPython: `import os
from concurrent.futures import ThreadPoolExecutor
import requests

host = "unlimit.residential.123proxy.cn"
port = 10253
worker_count = 8
username = os.environ["PROXY_USER"]
password = os.environ["PROXY_PASS"]
target = "https://api.ipify.org?format=json"

def run_worker(worker_id):
    proxy = f"http://{username}:{password}@{host}:{port}"
    response = requests.get(
        target,
        proxies={"http": proxy, "https": proxy},
        timeout=(15, 30),
    )
    response.raise_for_status()
    return worker_id, port, response.json()

with ThreadPoolExecutor(max_workers=worker_count) as pool:
    for worker_id, port, result in pool.map(run_worker, range(worker_count)):
        print(worker_id, port, result)`,
  unlimitedWorkersNode: `// npm install axios
const axios = require("axios");

const host = "unlimit.residential.123proxy.cn";
const port = 10253;
const workerCount = 8;
const username = process.env.PROXY_USER;
const password = process.env.PROXY_PASS;

async function runWorker(workerId) {
  const response = await axios.get(
    "https://api.ipify.org?format=json",
    {
      proxy: {
        protocol: "http",
        host,
        port,
        auth: { username, password },
      },
      timeout: 30000,
    },
  );
  console.log({ workerId, port, data: response.data });
}

Promise.all(
  Array.from({ length: workerCount }, (_, workerId) => runWorker(workerId)),
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`,
  unlimitedWorkersGo: `package main

import (
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
    "sync"
    "time"
)

func main() {
    const workerCount = 8
    var wait sync.WaitGroup

    for workerID := 0; workerID < workerCount; workerID++ {
        wait.Add(1)
        go func(id int) {
            defer wait.Done()
            proxyURL := &url.URL{
                Scheme: "http",
                Host: "unlimit.residential.123proxy.cn:10253",
                User: url.UserPassword(os.Getenv("PROXY_USER"), os.Getenv("PROXY_PASS")),
            }
            client := &http.Client{
                Transport: &http.Transport{Proxy: http.ProxyURL(proxyURL)},
                Timeout: 30 * time.Second,
            }
            response, err := client.Get("https://api.ipify.org?format=json")
            if err != nil { panic(err) }
            defer response.Body.Close()
            body, err := io.ReadAll(response.Body)
            if err != nil { panic(err) }
            if response.StatusCode >= 400 { panic(response.Status) }
            fmt.Printf("worker=%d gateway=unlimit.residential.123proxy.cn:10253 %s\\n", id, body)
        }(workerID)
    }
    wait.Wait()
}`,
  staticExtractCurl: `export STATIC_EXTRACT_URL="YOUR_GENERATED_ALLOCATION_URL"

# 该链接用于分配固定 IP，不是代理地址。
# 调用会消耗套餐可提数量，响应最长可能等待约 5 分钟。
curl --fail-with-body --silent --show-error \\
  --max-time 330 \\
  "$STATIC_EXTRACT_URL"`,
  staticExtractPython: `import os
import requests

# 调用会从套餐中分配固定 IP，不要把此 URL 配置为代理地址。
response = requests.get(
    os.environ["STATIC_EXTRACT_URL"],
    timeout=330,
)
response.raise_for_status()

proxies = []
for raw_line in response.text.splitlines():
    line = raw_line.strip()
    if not line:
        continue
    host, port, username, password = line.split(":", 3)
    proxies.append({
        "host": host,
        "port": int(port),
        "username": username,
        "password": password,
    })

print(proxies)`,
  staticExtractNode: `// Node.js 18+
async function main() {
  // 调用会从套餐中分配固定 IP，不要把此 URL 配置为代理地址。
  const response = await fetch(process.env.STATIC_EXTRACT_URL, {
    signal: AbortSignal.timeout(330000),
  });
  if (!response.ok) {
    throw new Error("HTTP " + response.status + ": " + await response.text());
  }

  const proxies = (await response.text())
    .split(/\\r?\\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [host, port, username, ...passwordParts] = line.split(":");
      return {
        host,
        port: Number(port),
        username,
        password: passwordParts.join(":"),
      };
    });

  console.log(proxies);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`,
  staticExtractGo: `package main

import (
    "bufio"
    "fmt"
    "net/http"
    "os"
    "strconv"
    "strings"
    "time"
)

func main() {
    client := &http.Client{Timeout: 330 * time.Second}
    response, err := client.Get(os.Getenv("STATIC_EXTRACT_URL"))
    if err != nil { panic(err) }
    defer response.Body.Close()
    if response.StatusCode >= 400 { panic(response.Status) }

    scanner := bufio.NewScanner(response.Body)
    for scanner.Scan() {
        parts := strings.SplitN(strings.TrimSpace(scanner.Text()), ":", 4)
        if len(parts) != 4 { panic("无法识别提取结果") }
        port, err := strconv.Atoi(parts[1])
        if err != nil { panic(err) }
        fmt.Printf("host=%s port=%d user=%s password=%s\\n",
            parts[0], port, parts[2], parts[3])
    }
    if err := scanner.Err(); err != nil { panic(err) }
}`,
  staticExtractJava: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class AllocateStaticProxy {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(System.getenv("STATIC_EXTRACT_URL")))
            .timeout(Duration.ofSeconds(330))
            .GET()
            .build();
        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );
        if (response.statusCode() >= 400) {
            throw new RuntimeException(response.body());
        }
        for (String rawLine : response.body().split("\\\\R")) {
            String line = rawLine.trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split(":", 4);
            if (parts.length != 4) {
                throw new IllegalArgumentException("无法识别提取结果");
            }
            System.out.printf(
                "host=%s port=%s user=%s password=%s%n",
                parts[0], parts[1], parts[2], parts[3]
            );
        }
    }
}`,
  staticExtractPhp: `<?php
// 调用会从套餐中分配固定 IP，不要把此 URL 配置为代理地址。
$curl = curl_init(getenv("STATIC_EXTRACT_URL"));
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_TIMEOUT => 330,
    CURLOPT_FAILONERROR => true,
]);
$body = curl_exec($curl);
if ($body === false) {
    throw new RuntimeException(curl_error($curl));
}
curl_close($curl);

$proxies = [];
foreach (preg_split('/\\R/', trim($body)) as $line) {
    if ($line === '') continue;
    $parts = explode(':', $line, 4);
    if (count($parts) !== 4) {
        throw new RuntimeException('无法识别提取结果');
    }
    [$host, $port, $username, $password] = $parts;
    $proxies[] = compact('host', 'port', 'username', 'password');
}
print_r($proxies);`,
  tunnelCurl: `curl --fail-with-body --silent --show-error \\
  --proxy "http://proxy.123proxy.cn:36923" \\
  --proxy-user "YOUR_PROXY_USER:YOUR_PROXY_PASSWORD" \\
  --connect-timeout 15 \\
  --max-time 30 \\
  "https://api.ipify.org?format=json"`,
  tunnelPython: `import os
import requests

proxy_url = (
    f"http://{os.environ['PROXY_USER']}:"
    f"{os.environ['PROXY_PASS']}@"
    "proxy.123proxy.cn:36923"
)

response = requests.get(
    "https://api.ipify.org?format=json",
    proxies={"http": proxy_url, "https": proxy_url},
    timeout=(15, 30),
)
response.raise_for_status()
print(response.json())`,
  tunnelSocks: `python -m pip install "requests[socks]"

export PROXY_URL="socks5h://YOUR_PROXY_USER:YOUR_PROXY_PASSWORD@proxy.123proxy.cn:36923"

python - <<'PY'
import os
import requests

proxy = os.environ["PROXY_URL"]
response = requests.get(
    "https://api.ipify.org?format=json",
    proxies={"http": proxy, "https": proxy},
    timeout=(15, 30),
)
response.raise_for_status()
print(response.json())
PY`
};

const staticDatacenterCountries = [
  "南非", "越南", "委内瑞拉", "乌兹别克斯坦", "美国", "乌克兰", "中国台湾", "土耳其", "泰国",
  "斯洛伐克", "新加坡", "瑞典", "沙特阿拉伯", "塞尔维亚", "罗马尼亚", "葡萄牙", "波兰",
  "巴基斯坦", "菲律宾", "秘鲁", "新西兰", "挪威", "荷兰", "尼日利亚", "马来西亚", "墨西哥",
  "马耳他", "摩洛哥", "拉脱维亚", "立陶宛", "斯里兰卡", "哈萨克斯坦", "韩国", "柬埔寨",
  "肯尼亚", "日本", "意大利", "印度", "以色列", "爱尔兰", "印度尼西亚", "匈牙利",
  "克罗地亚", "中国香港", "希腊", "格鲁吉亚", "英国", "法国", "芬兰", "西班牙", "埃及",
  "爱沙尼亚", "阿尔及利亚", "丹麦", "德国", "捷克", "塞浦路斯", "哥伦比亚", "智利",
  "瑞士", "加拿大", "巴西", "保加利亚", "比利时", "孟加拉国", "澳大利亚", "奥地利",
  "阿根廷", "阿联酋"
];

const staticResidentialCountries = [
  "阿联酋", "阿根廷", "奥地利", "澳大利亚", "孟加拉国", "比利时", "保加利亚", "巴西",
  "加拿大", "瑞士", "智利", "哥伦比亚", "塞浦路斯", "捷克", "德国", "丹麦", "阿尔及利亚",
  "爱沙尼亚", "埃及", "西班牙", "芬兰", "法国", "英国", "格鲁吉亚", "希腊", "中国香港",
  "洪都拉斯", "克罗地亚", "匈牙利", "印度尼西亚", "爱尔兰", "以色列", "印度", "意大利",
  "日本", "肯尼亚", "柬埔寨", "韩国", "哈萨克斯坦", "斯里兰卡", "立陶宛", "拉脱维亚",
  "摩洛哥", "马耳他", "墨西哥", "马来西亚", "尼日利亚", "荷兰", "挪威", "新西兰",
  "秘鲁", "菲律宾", "巴基斯坦", "波兰", "葡萄牙", "罗马尼亚", "塞尔维亚",
  "沙特阿拉伯", "瑞典", "新加坡", "斯洛伐克", "泰国", "土耳其", "中国台湾", "乌克兰",
  "美国", "委内瑞拉", "越南", "南非"
];

function standardProxySamples(host = "proxy.123proxy.cn", port = 36923) {
  const withGateway = (code) => code
    .replaceAll("proxy.123proxy.cn", host)
    .replaceAll("36923", String(port));
  return {
    curl: { label: "cURL", code: withGateway(codeSamples.quickCurl) },
    python: { label: "Python", code: withGateway(codeSamples.quickPython) },
    node: { label: "Node.js", code: withGateway(codeSamples.quickNode) },
    go: { label: "Go", code: withGateway(codeSamples.quickGo) },
    java: { label: "Java", code: withGateway(codeSamples.quickJava) },
    php: { label: "PHP", code: withGateway(codeSamples.quickPhp) }
  };
}

function staticProxySamples() {
  return {
    curl: {
      label: "cURL",
      code: `export STATIC_PROXY_HOST="控制台返回的固定代理IP"
export STATIC_PROXY_PORT="控制台返回的代理端口"
export PROXY_USER="控制台返回的代理用户名"
export PROXY_PASS="控制台返回的代理密码"

curl --fail-with-body --silent --show-error \\
  --proxy "http://\${STATIC_PROXY_HOST}:\${STATIC_PROXY_PORT}" \\
  --proxy-user "\${PROXY_USER}:\${PROXY_PASS}" \\
  --connect-timeout 15 \\
  --max-time 30 \\
  "https://api.ipify.org?format=json"`
    },
    python: {
      label: "Python",
      code: codeSamples.quickPython
        .replace('host = "proxy.123proxy.cn"', 'host = os.environ["STATIC_PROXY_HOST"]')
        .replace("port = 36923", 'port = int(os.environ["STATIC_PROXY_PORT"])')
    },
    node: {
      label: "Node.js",
      code: codeSamples.quickNode
        .replace('host: "proxy.123proxy.cn"', "host: process.env.STATIC_PROXY_HOST")
        .replace("port: 36923", "port: Number(process.env.STATIC_PROXY_PORT)")
    },
    go: {
      label: "Go",
      code: codeSamples.quickGo
        .replace('Host: "proxy.123proxy.cn:36923"', 'Host: os.Getenv("STATIC_PROXY_HOST") + ":" + os.Getenv("STATIC_PROXY_PORT")')
    },
    java: {
      label: "Java",
      code: codeSamples.quickJava
        .replace('String host = "proxy.123proxy.cn";', 'String host = System.getenv("STATIC_PROXY_HOST");')
        .replace("int port = 36923;", 'int port = Integer.parseInt(System.getenv("STATIC_PROXY_PORT"));')
    },
    php: {
      label: "PHP",
      code: codeSamples.quickPhp
        .replace('$host = "proxy.123proxy.cn";', '$host = getenv("STATIC_PROXY_HOST");')
        .replace("$port = 36923;", '$port = (int) getenv("STATIC_PROXY_PORT");')
    }
  };
}

function staticAllocationSamples() {
  return {
    curl: { label: "cURL", code: codeSamples.staticExtractCurl },
    python: { label: "Python", code: codeSamples.staticExtractPython },
    node: { label: "Node.js", code: codeSamples.staticExtractNode },
    go: { label: "Go", code: codeSamples.staticExtractGo },
    java: { label: "Java", code: codeSamples.staticExtractJava },
    php: { label: "PHP", code: codeSamples.staticExtractPhp }
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function brandMarkup() {
  return `
    <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
      <rect x="12" y="0" width="20" height="20" rx="4" fill="#1116ef"></rect>
      <rect x="0" y="24" width="20" height="20" rx="4" fill="#2f80ed"></rect>
      <rect x="24" y="24" width="20" height="20" rx="4" fill="#4cc9ed"></rect>
      <text x="22" y="15.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">1</text>
      <text x="10" y="39.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">2</text>
      <text x="34" y="39.2" fill="#fff" font-family="Montserrat, Arial, sans-serif" font-size="14.5" font-weight="600" text-anchor="middle">3</text>
    </svg>
    <span class="brand-wordmark"><img src="/assets/123proxy-proxy-original.svg" alt="Proxy"></span>`;
}

function searchMarkup(compact = false) {
  return `
    <div class="docs-search${compact ? " is-compact" : ""}" data-doc-search-root>
      ${icon("search")}
      <input type="search" data-doc-search autocomplete="off" placeholder="搜索产品、SESSION、错误码或代码..." aria-label="搜索开发文档" aria-expanded="false">
      <kbd>Ctrl K</kbd>
      <div class="docs-search-results" data-doc-search-results hidden></div>
    </div>`;
}

function headerMarkup() {
  return `
    <div class="docs-utility">
      <div class="docs-frame docs-utility-inner">
        <a class="docs-network-state" href="/status/"><i></i>全球代理网络运行正常</a>
        <div>
          <a href="/global-network.html">全球网络</a>
          <a href="/contact.html#solutions">技术支持</a>
        </div>
      </div>
    </div>
    <header class="docs-header">
      <div class="docs-frame docs-header-inner">
        <div class="docs-brand-group">
          <a class="brand docs-brand" href="/" aria-label="123Proxy 首页">${brandMarkup()}</a>
          <span class="docs-brand-divider" aria-hidden="true"></span>
          <a class="docs-product-name" href="/developers/">开发者中心</a>
        </div>
        ${searchMarkup(true)}
        <nav class="docs-topnav" aria-label="开发者导航">
          <a href="/developers/getting-started/">快速开始</a>
          <a href="/developers/#products">产品接入</a>
          <a href="/developers/examples/">代码案例</a>
          <a class="docs-console-link" href="https://console.123proxy.cn/app/">控制台${icon("arrow-up-right")}</a>
        </nav>
        <button class="docs-icon-button docs-mobile-toggle" type="button" data-docs-mobile-toggle aria-expanded="false" aria-controls="docsMobileNav" aria-label="打开开发者导航">${icon("menu")}</button>
      </div>
      <div class="docs-mobile-nav" id="docsMobileNav" data-docs-mobile-nav>
        <a href="/developers/">文档首页</a>
        <a href="/developers/getting-started/">快速开始</a>
        <a href="/developers/#products">产品接入</a>
        <a href="/developers/examples/">代码案例</a>
        <a href="/developers/getting-started/#troubleshooting">错误排查</a>
        <a href="https://console.123proxy.cn/app/">登录控制台</a>
      </div>
    </header>`;
}

function footerMarkup() {
  return `
    <footer class="docs-footer">
      <div class="docs-frame docs-footer-inner">
        <div>
          <a class="brand docs-footer-brand" href="/">${brandMarkup()}</a>
          <p>面向爬虫工程师和 AI 数据团队的全球代理与数据采集基础设施。</p>
        </div>
        <div class="docs-footer-links">
          <a href="/developers/getting-started/">快速开始</a>
          <a href="/developers/#products">产品接入</a>
          <a href="/pricing.html">价格</a>
          <a href="/contact.html#solutions">技术支持</a>
        </div>
      </div>
      <div class="docs-frame docs-footer-bottom">
        <span>© 2026 123Proxy. All rights reserved.</span>
        <span>文档内容以当前控制台可用能力为准</span>
      </div>
    </footer>`;
}

function codeTabs(group, samples, defaultKey) {
  const entries = Object.entries(samples);
  return `
    <div class="docs-code" data-code-group="${escapeHtml(group)}">
      <div class="docs-code-toolbar" role="tablist" aria-label="代码语言">
        <div>
          ${entries.map(([key, sample]) => `<button type="button" role="tab" data-code-tab="${key}" aria-selected="${key === defaultKey}" class="${key === defaultKey ? "is-active" : ""}">${escapeHtml(sample.label)}</button>`).join("")}
        </div>
        <button class="docs-copy-button" type="button" data-copy-code title="复制当前代码">${icon("copy")}<span>复制</span></button>
      </div>
      ${entries.map(([key, sample]) => `<pre role="tabpanel" data-code-panel="${key}"${key === defaultKey ? "" : " hidden"}><code>${escapeHtml(sample.code)}</code></pre>`).join("")}
    </div>`;
}

function productGrid() {
  return `
    <div class="docs-product-grid">
      ${productLinks.map((product) => `
        <a class="docs-product-item${product.featured ? " is-featured" : ""}" href="${product.href}">
          <span class="docs-product-icon">${icon(product.icon)}</span>
          <span>
            <small>${product.meta}</small>
            <strong>${product.name}</strong>
            <p>${product.description}</p>
          </span>
          ${icon("arrow-right")}
        </a>`).join("")}
    </div>`;
}

function sidebarMarkup(activeKey) {
  const item = (href, label, key, iconName = "") => `
    <a href="${href}"${key === activeKey ? ' class="is-active" aria-current="page"' : ""}>
      ${iconName ? icon(iconName) : ""}<span>${label}</span>
    </a>`;
  return `
    <aside class="docs-sidebar" data-docs-sidebar>
      <nav aria-label="文档目录">
        <div class="docs-sidebar-group">
          <span>开始使用</span>
          ${item("/developers/", "开发者中心", "home", "layout-grid")}
          ${item("/developers/getting-started/", "5 分钟快速开始", "getting-started", "rocket")}
        </div>
        <div class="docs-sidebar-group">
          <span>产品接入</span>
          ${item("/developers/products/scraping-rotating-proxy/", "隧道代理", "tunnel", "route")}
          ${item("/developers/products/residential-rotating-proxy/", "隧道住宅代理", "residential", "globe-2")}
          ${item("/developers/products/unlimited-residential-proxy/", "不限量动态住宅", "unlimited", "refresh-cw")}
          ${item("/developers/products/static-datacenter-proxy/", "长效静态代理", "static-datacenter", "server")}
          ${item("/developers/products/static-residential-proxy/", "长效静态住宅", "static-residential", "house-plug")}
          ${item("/high-bandwidth-proxy.html", "高带宽代理 IP", "", "gauge")}
        </div>
        <div class="docs-sidebar-group">
          <span>工程指南</span>
          ${item("/developers/guides/concurrency-qps-performance/", "并发、QPS 与响应时间", "guide-concurrency", "chart-no-axes-combined")}
          ${item("/developers/guides/session-geo-rotation/", "SESSION 与出口轮转", "guide-session", "shuffle")}
          ${item("/developers/guides/proxy-errors-retries/", "错误、超时与重试", "guide-errors", "circle-alert")}
          ${item("/developers/guides/proxy-product-selection/", "代理产品选型", "guide-selection", "git-compare-arrows")}
        </div>
        <div class="docs-sidebar-group">
          <span>框架案例</span>
          ${item("/developers/examples/", "完整代码案例", "examples", "code-2")}
          ${item("/developers/examples/python-requests-proxy/", "Python Requests", "example-requests")}
          ${item("/developers/examples/scrapy-proxy/", "Scrapy", "example-scrapy")}
          ${item("/developers/examples/playwright-proxy/", "Playwright", "example-playwright")}
          ${item("/developers/examples/selenium-proxy/", "Selenium", "example-selenium")}
          ${item("/developers/examples/puppeteer-proxy/", "Puppeteer", "example-puppeteer")}
          ${item("/developers/examples/nodejs-axios-proxy/", "Node.js Axios", "example-axios")}
          ${item("/developers/examples/go-colly-proxy/", "Go Colly", "example-colly")}
          ${item("/developers/examples/java-jsoup-proxy/", "Java Jsoup", "example-jsoup")}
          ${item("/developers/examples/php-curl-proxy/", "PHP cURL", "example-php")}
        </div>
        <div class="docs-sidebar-group">
          <span>验证与排查</span>
          ${item("/developers/getting-started/#verify", "可用性测试", "", "activity")}
          ${item("/developers/guides/proxy-errors-retries/", "常见错误", "", "circle-alert")}
        </div>
      </nav>
      <div class="docs-sidebar-support">
        <span>${icon("life-buoy")}</span>
        <strong>接入遇到问题？</strong>
        <p>附上请求时间、套餐类型和错误信息联系技术支持。</p>
        <a href="/contact.html#solutions">联系技术支持${icon("arrow-right")}</a>
      </div>
    </aside>`;
}

function tocMarkup(items) {
  return `
    <aside class="docs-toc">
      <strong>本页内容</strong>
      <nav>
        ${items.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
      </nav>
      <a class="docs-toc-console" href="https://console.123proxy.cn/app/">${icon("terminal")}打开控制台</a>
    </aside>`;
}

function articleLayout(page, content, toc) {
  return `
    <main class="docs-layout docs-frame">
      <button class="docs-sidebar-open" type="button" data-docs-sidebar-toggle>${icon("panel-left")}文档目录</button>
      ${sidebarMarkup(page.key)}
      <article class="docs-article">
        ${content}
      </article>
      ${tocMarkup(toc)}
    </main>`;
}

function homeMain() {
  const homeCode = codeTabs("home-quick", {
    curl: { label: "cURL", code: codeSamples.quickCurl },
    python: { label: "Python", code: codeSamples.quickPython },
    node: { label: "Node.js", code: codeSamples.quickNode }
  }, "curl");
  return `
    <main class="docs-home">
      <section class="docs-home-hero">
        <div class="docs-frame docs-home-hero-inner">
          <div class="docs-home-copy">
            <span class="docs-eyebrow">${icon("square-terminal")}DEVELOPER DOCUMENTATION</span>
            <h1>从一条 cURL 开始，<br>接入全球代理网络</h1>
            <p>选择代理产品，配置认证、地区与 SESSION，将可运行的代理请求接入爬虫和 AI 数据采集任务。</p>
            ${searchMarkup()}
            <div class="docs-home-actions">
              <a class="btn btn-primary" href="/developers/getting-started/">${icon("rocket")}5 分钟快速开始</a>
              <a class="btn docs-secondary-button" href="/developers/products/scraping-rotating-proxy/">${icon("route")}查看隧道代理接入</a>
            </div>
          </div>
          <div class="docs-home-code">
            <div class="docs-home-code-head">
              <span><i></i>FIRST REQUEST</span>
              <small>HTTP(S) · USER / PASS</small>
            </div>
            ${homeCode}
            <div class="docs-home-code-result">
              <span>EXPECTED OUTPUT</span>
              <code>&#123;"ip": "代理出口 IP"&#125;</code>
            </div>
          </div>
        </div>
      </section>

      <section class="docs-home-band">
        <div class="docs-frame docs-home-band-grid">
          <a href="/developers/getting-started/#authentication"><span>01</span><strong>认证方式</strong><small>账密 / 套餐白名单</small>${icon("arrow-right")}</a>
          <a href="/developers/products/scraping-rotating-proxy/#routing"><span>02</span><strong>地区与路由</strong><small>全球随机 / 地区选择</small>${icon("arrow-right")}</a>
          <a href="/developers/guides/session-geo-rotation/"><span>03</span><strong>SESSION</strong><small>轮转 / 固定出口</small>${icon("arrow-right")}</a>
          <a href="/developers/guides/proxy-errors-retries/"><span>04</span><strong>错误排查</strong><small>407 / 超时 / 目标错误</small>${icon("arrow-right")}</a>
        </div>
      </section>

      <section class="docs-home-section docs-frame" id="products">
        <div class="docs-section-heading">
          <div><span>PRODUCT ACCESS</span><h2>按代理产品查看接入方式</h2></div>
          <p>不同产品的地区、SESSION、端口和静态 IP 分配逻辑并不相同。先选择产品，再复制对应代码。</p>
        </div>
        ${productGrid()}
      </section>

      <section class="docs-home-section docs-home-workflow">
        <div class="docs-frame">
          <div class="docs-section-heading">
            <div><span>ENGINEERING PATH</span><h2>从测试请求到生产 worker</h2></div>
            <p>每一步都对应一个可验证结果，避免在未确认代理链路前直接放大并发。</p>
          </div>
          <div class="docs-workflow-grid">
            <article><span>01</span>${icon("package-check")}<h3>选择套餐</h3><p>根据流量、并发线程、端口或固定 IP 选择产品。</p></article>
            <article><span>02</span>${icon("key-round")}<h3>生成代理</h3><p>在控制台选择认证、协议、地区和 SESSION。</p></article>
            <article><span>03</span>${icon("terminal")}<h3>命令行验证</h3><p>先用 cURL 检查认证、出口和目标连接。</p></article>
            <article><span>04</span>${icon("blocks")}<h3>接入代码</h3><p>加入超时、重试、并发控制和任务监控。</p></article>
          </div>
        </div>
      </section>

      <section class="docs-home-section docs-frame" id="guides">
        <div class="docs-section-heading">
          <div><span>POPULAR GUIDES</span><h2>工程师常用文档</h2></div>
        </div>
        <div class="docs-guide-list">
          <a href="/developers/guides/concurrency-qps-performance/"><span>${icon("chart-no-axes-combined")}</span><div><strong>并发、QPS 与响应时间</strong><p>从任务耗时、在途请求和浏览器子资源计算容量。</p></div>${icon("arrow-right")}</a>
          <a href="/developers/guides/session-geo-rotation/"><span>${icon("link")}</span><div><strong>什么时候使用 SESSION</strong><p>理解按请求轮转、粘性会话和固定 IP 的区别。</p></div>${icon("arrow-right")}</a>
          <a href="/developers/examples/"><span>${icon("code-2")}</span><div><strong>9 个完整可运行案例</strong><p>覆盖 HTTP 客户端、爬虫框架与浏览器自动化。</p></div>${icon("arrow-right")}</a>
          <a href="/developers/guides/proxy-errors-retries/"><span>${icon("wrench")}</span><div><strong>407、超时与出口异常</strong><p>按认证、代理链路和目标站点分层排查。</p></div>${icon("arrow-right")}</a>
        </div>
      </section>
    </main>`;
}

function gettingStartedMain(page) {
  const code = codeTabs("quick-start", {
    curl: { label: "cURL", code: codeSamples.quickCurl },
    python: { label: "Python", code: codeSamples.quickPython },
    node: { label: "Node.js", code: codeSamples.quickNode },
    go: { label: "Go", code: codeSamples.quickGo },
    java: { label: "Java", code: codeSamples.quickJava },
    php: { label: "PHP", code: codeSamples.quickPhp },
    scrapy: { label: "Scrapy", code: codeSamples.quickScrapy },
    playwright: { label: "Playwright", code: codeSamples.quickPlaywright }
  }, "curl");
  const content = `
    <nav class="docs-breadcrumb" aria-label="面包屑"><a href="/developers/">开发者中心</a>${icon("chevron-right")}<span>5 分钟快速开始</span></nav>
    <header class="docs-article-header">
      <span class="docs-article-label">GETTING STARTED</span>
      <h1>5 分钟完成第一个代理请求</h1>
      <p>从控制台生成一组代理接入信息，先用 cURL 验证，再复制到 Python、Scrapy 或其他采集程序。</p>
      <div class="docs-article-meta"><span>${icon("clock-3")}约 5 分钟</span><span>${icon("code-2")}无需 SDK</span><span>${icon("shield-check")}HTTP(S) / SOCKS5</span></div>
    </header>

    <section class="docs-callout is-important">
      ${icon("server-cog")}
      <div><strong>抓取程序需要部署在海外网络环境</strong><p>123Proxy 提供代理 IP 服务，不提供 VPN 或翻墙功能。开始前请准备可访问目标站点的海外服务器或计算环境。</p></div>
    </section>

    <section class="docs-procedure" id="choose-product">
      <span class="docs-step-number">01</span>
      <div>
        <h2>选择代理产品和套餐</h2>
        <p>第一次测试可优先选择隧道代理或隧道住宅代理。需要先明确任务按流量、并发线程、端口还是固定 IP 计费。</p>
        <div class="docs-decision-grid">
          <a href="/developers/products/scraping-rotating-proxy/"><strong>通用网页采集</strong><span>隧道代理</span><small>混合池通常更快；纯住宅池支持 SESSION</small></a>
          <a href="/developers/products/residential-rotating-proxy/"><strong>国家定向住宅出口</strong><span>隧道住宅代理</span><small>仅按流量，支持国家和 SESSION</small></a>
          <a href="/developers/products/unlimited-residential-proxy/"><strong>持续大流量任务</strong><span>不限量动态住宅</span><small>按端口，不限流量与并发</small></a>
        </div>
        <a class="docs-inline-action" href="/pricing.html">比较全部标准套餐${icon("arrow-right")}</a>
      </div>
    </section>

    <section class="docs-procedure" id="generate">
      <span class="docs-step-number">02</span>
      <div>
        <h2>在控制台生成代理</h2>
        <p>购买或领取测试套餐后，进入对应代理产品，点击“提取代理”，再按产品选择认证、协议、地区与轮转方式。</p>
        <ol class="docs-number-list">
          <li><span>1</span><div><strong>选择可用套餐</strong><p>所有配置都会绑定当前套餐；白名单不是全账户共享。</p></div></li>
          <li><span>2</span><div><strong>选择认证方式</strong><p>本地调试推荐账密认证；固定出口服务器可以使用套餐 IP 白名单。</p></div></li>
          <li><span>3</span><div><strong>选择协议和路由</strong><p>根据程序选择 HTTP(S) 或 SOCKS5，再设置地区、SESSION 或端口轮转。</p></div></li>
          <li><span>4</span><div><strong>生成并复制代理账密</strong><p>代码示例已写入对应产品的固定网关，只需复制代理用户名和密码，不要使用网站登录密码。</p></div></li>
        </ol>
        <a class="btn btn-primary" href="https://console.123proxy.cn/app/#extract?product=tunnel">${icon("terminal")}打开隧道代理提取</a>
      </div>
    </section>

    <section class="docs-procedure" id="authentication">
      <span class="docs-step-number">03</span>
      <div>
        <h2>理解代理认证</h2>
        <p>代理认证凭证与 123Proxy 网站登录账号完全不同。账密认证由代理用户提供；IP 白名单则验证发起请求的服务器公网 IPv4。</p>
        <div class="docs-compare-table">
          <div class="docs-compare-head"><span>认证方式</span><span>适合场景</span><span>程序配置</span></div>
          <div><strong>代理用户名 / 密码</strong><span>开发机、多 worker、动态服务器</span><span>在代理 URL 或客户端认证参数中发送</span></div>
          <div><strong>套餐 IP 白名单</strong><span>公网 IP 固定的采集服务器</span><span>程序只配置 HOST:PORT</span></div>
        </div>
        <div class="docs-callout">
          ${icon("info")}
          <div><strong>产品边界</strong><p>静态类代理不支持白名单；隧道代理的纯住宅 SESSION 只支持账密认证。具体选项以对应产品提取页为准。</p></div>
        </div>
      </div>
    </section>

    <section class="docs-procedure" id="verify">
      <span class="docs-step-number">04</span>
      <div>
        <h2>先用 cURL 验证代理</h2>
        <p>代码已使用隧道代理固定网关 <code>proxy.123proxy.cn:36923</code>。只需将控制台生成的代理用户名和密码写入环境变量，成功后应返回代理出口 IP，而不是采集服务器自身 IP。</p>
        ${codeTabs("verify-curl", { curl: { label: "HTTP(S)", code: codeSamples.quickCurl }, socks: { label: "SOCKS5", code: codeSamples.tunnelSocks } }, "curl")}
        <div class="docs-result">
          <span>预期结果</span>
          <code>&#123;"ip": "代理出口 IP"&#125;</code>
          <p>测试地址由第三方提供，只用于验证出口。生产代码应替换为依法可访问的真实目标 URL。</p>
        </div>
      </div>
    </section>

    <section class="docs-procedure" id="code-examples">
      <span class="docs-step-number">05</span>
      <div>
        <h2>复制到采集代码</h2>
        <p>示例使用环境变量保存凭证，并分别设置连接与读取超时。生产任务还应加入退避重试、目标站点并发限制和响应校验。</p>
        ${code}
        <div class="docs-callout is-security">
          ${icon("shield-check")}
          <div><strong>不要提交真实凭证</strong><p>代理用户名和密码应保存在环境变量或密钥管理服务中，不要写入公开代码仓库、镜像或日志。</p></div>
        </div>
      </div>
    </section>

    <section class="docs-procedure" id="protocols">
      <span class="docs-step-number">06</span>
      <div>
        <h2>HTTP(S) 与 SOCKS5 怎么选</h2>
        <div class="docs-fact-list">
          <div><strong>HTTP(S)</strong><p>最常见的网页与 API 请求方式。HTTPS 目标通常通过 HTTP CONNECT 建立隧道。</p></div>
          <div><strong>SOCKS5</strong><p>适合支持 SOCKS 的客户端。建议使用远端 DNS 解析，例如 Python 中的 <code>socks5h://</code>。</p></div>
          <div><strong>先保持简单</strong><p>没有明确需求时先使用 HTTP(S)，确认代理链路后再调整协议和连接池。</p></div>
        </div>
      </div>
    </section>

    <section class="docs-procedure" id="troubleshooting">
      <span class="docs-step-number">07</span>
      <div>
        <h2>常见错误快速排查</h2>
        <div class="docs-troubleshooting">
          <details open><summary><code>407</code> Proxy Authentication Required${icon("chevron-down")}</summary><p>确认使用代理用户而不是网站登录账号；检查用户名中的 SESSION 与国家后缀顺序；白名单模式确认服务器公网 IPv4 已保存到当前套餐。</p></details>
          <details><summary>连接超时或无法连接代理主机${icon("chevron-down")}</summary><p>检查 HOST、PORT、协议和海外服务器网络；先用命令行测试，再检查防火墙、DNS 和客户端连接池。</p></details>
          <details><summary>代理可用，但目标站点返回 403 / 429${icon("chevron-down")}</summary><p>这通常是目标站点响应。降低单站点并发，读取 Retry-After，检查请求头、账号状态、访问授权和目标服务条款。</p></details>
          <details><summary>设置地区或 SESSION 后没有立即变化${icon("chevron-down")}</summary><p>部分住宅路由配置通常需要约 3-15 分钟同步。等待后重新建立连接，并通过出口查询或真实目标验证。</p></details>
        </div>
      </div>
    </section>

    <nav class="docs-next">
      <span>下一篇</span>
      <a href="/developers/products/scraping-rotating-proxy/"><div><small>产品接入</small><strong>隧道代理接入手册</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#choose-product", "选择产品"],
    ["#generate", "控制台生成代理"],
    ["#authentication", "代理认证"],
    ["#verify", "cURL 验证"],
    ["#code-examples", "代码示例"],
    ["#protocols", "协议选择"],
    ["#troubleshooting", "错误排查"]
  ]);
}

function tunnelMain(page) {
  const tunnelCode = codeTabs("tunnel-code", {
    curl: { label: "cURL", code: codeSamples.tunnelCurl },
    python: { label: "Python", code: codeSamples.tunnelPython },
    node: { label: "Node.js", code: codeSamples.quickNode },
    go: { label: "Go", code: codeSamples.quickGo },
    java: { label: "Java", code: codeSamples.quickJava },
    php: { label: "PHP", code: codeSamples.quickPhp },
    socks: { label: "SOCKS5", code: codeSamples.tunnelSocks }
  }, "curl");
  const content = `
    <nav class="docs-breadcrumb" aria-label="面包屑"><a href="/developers/">开发者中心</a>${icon("chevron-right")}<span>产品接入</span>${icon("chevron-right")}<span>隧道代理</span></nav>
    <header class="docs-article-header docs-product-doc-header">
      <span class="docs-article-label">SCRAPING ROTATING PROXY</span>
      <h1>隧道代理接入手册</h1>
      <p>通过固定网关连接爬虫混合池或纯住宅池。默认全球随机，可按流量或并发线程使用，并在纯住宅池中配置 SESSION。</p>
      <div class="docs-product-facts">
        <span><small>代理池</small><strong>混合池 / 纯住宅池</strong></span>
        <span><small>地区</small><strong>默认全球随机</strong></span>
        <span><small>认证</small><strong>账密 / 套餐白名单</strong></span>
        <span><small>协议</small><strong>HTTP(S) / SOCKS5</strong></span>
      </div>
      <div class="docs-article-actions">
        <a class="btn btn-primary" href="https://console.123proxy.cn/app/#extract?product=tunnel">${icon("route")}打开提取代理</a>
        <a class="btn docs-secondary-button" href="/pricing.html?product=tunnel">${icon("tag")}查看套餐</a>
      </div>
    </header>

    <section id="quick-request">
      <div class="docs-section-title"><span>01</span><div><small>MINIMUM REQUEST</small><h2>最小可运行请求</h2></div></div>
      <p>示例已固定使用 <code>proxy.123proxy.cn:36923</code>。只需替换代理用户名和密码；出口 IP 由所选代理池自动分配。</p>
      ${tunnelCode}
      <div class="docs-callout">
        ${icon("circle-check")}
        <div><strong>无需维护本地代理池</strong><p>程序连接固定网关即可。代理健康检查、出口选择和轮转由 123Proxy 网络完成。</p></div>
      </div>
    </section>

    <section id="pools">
      <div class="docs-section-title"><span>02</span><div><small>PROXY POOLS</small><h2>先选择代理池</h2></div></div>
      <div class="docs-pool-comparison">
        <article class="is-recommended">
          <div><span>${icon("network")}爬虫混合池</span><small>通用采集推荐</small></div>
          <strong>约 95% 住宅 + 约 5% 数据中心</strong>
          <p>混入少量数据中心 IP，公开网页采集通常比纯住宅池更快。</p>
          <ul><li>适合列表页、详情页和高频公开请求</li><li>不支持 SESSION</li><li>默认全球随机</li></ul>
        </article>
        <article>
          <div><span>${icon("house-plug")}纯住宅池</span><small>住宅身份</small></div>
          <strong>100% 住宅 IP</strong>
          <p>只包含住宅出口，适合需要住宅网络属性或多步骤会话的任务。</p>
          <ul><li>支持按请求轮转</li><li>账密认证支持 SESSION</li><li>通常比混合池稍慢</li></ul>
        </article>
      </div>
    </section>

    <section id="billing">
      <div class="docs-section-title"><span>03</span><div><small>CAPACITY MODEL</small><h2>流量与并发线程</h2></div></div>
      <div class="docs-compare-table docs-billing-table">
        <div class="docs-compare-head"><span>计费方式</span><span>限制维度</span><span>适合任务</span></div>
        <div><strong>按流量</strong><span>累计传输 GB</span><span>流量可预测、短期或弹性任务</span></div>
        <div><strong>按并发线程</strong><span>同时在途请求数</span><span>持续运行的代码 worker，套餐内不限流量</span></div>
      </div>
      <div class="docs-callout is-warning">
        ${icon("triangle-alert")}
        <div><strong>浏览器会快速消耗并发</strong><p>一个页面会同时加载 HTML、图片、CSS、JavaScript、字体和接口请求，通常可能占用 10-20 个并发线程。浏览器自动化应按真实页面测量。</p></div>
      </div>
    </section>

    <section id="routing">
      <div class="docs-section-title"><span>04</span><div><small>ROUTING</small><h2>地区在提取代理时选择</h2></div></div>
      <p>隧道代理默认从全球代理池随机选择出口。它不提供国家级任意定位，只支持以下粗粒度地区预设。</p>
      <div class="docs-region-grid">
        <span><strong>全球随机</strong><small>默认</small></span>
        <span><strong>欧美</strong><small>EU + US</small></span>
        <span><strong>北美</strong><small>North America</small></span>
        <span><strong>欧洲</strong><small>Europe</small></span>
        <span><strong>亚洲</strong><small>Asia</small></span>
        <span><strong>美国</strong><small>United States</small></span>
        <span><strong>日韩</strong><small>Japan / Korea</small></span>
      </div>
      <div class="docs-callout">
        ${icon("map-pin")}
        <div><strong>需要指定国家时</strong><p>请选择隧道住宅代理。它支持在提取时指定国家或地区，并将国家码编码到认证用户名末尾。</p></div>
      </div>
    </section>

    <section id="authentication">
      <div class="docs-section-title"><span>05</span><div><small>AUTHENTICATION</small><h2>账密与套餐 IP 白名单</h2></div></div>
      <div class="docs-auth-flow">
        <article>${icon("key-round")}<div><strong>账密认证</strong><p>选择一个代理用户。程序发送代理用户名和密码，适合开发机、动态服务器和多 worker。</p><code>HOST:PORT:USER:PASSWORD</code></div></article>
        <article>${icon("shield-check")}<div><strong>套餐 IP 白名单</strong><p>每行填写一个采集服务器公网 IPv4，保存到当前套餐。程序只需使用 HOST:PORT。</p><code>HOST:PORT</code></div></article>
      </div>
      <p class="docs-quiet-note">${icon("info")}白名单以套餐为作用域，不是独立账户页面；纯住宅池的 SESSION 只支持账密认证，白名单模式不支持 SESSION。</p>
    </section>

    <section id="session">
      <div class="docs-section-title"><span>06</span><div><small>STICKY ROUTING</small><h2>纯住宅池的 SESSION</h2></div></div>
      <p>纯住宅池默认可按请求轮转。需要分页、短流程或多步骤请求尽量保持同一住宅出口时，在账密认证用户名中加入 SESSION。</p>
      <div class="docs-username-anatomy">
        <span class="docs-username-label">认证用户名结构</span>
        <code><b>proxy-user</b><em>-sess_</em><strong>a8F3kP9xQ2mL</strong><em>_</em><strong>15</strong></code>
        <div>
          <span><b>proxy-user</b><small>代理用户</small></span>
          <span><b>-sess_</b><small>SESSION 标识</small></span>
          <span><b>a8F3kP9xQ2mL</b><small>12 位 ID</small></span>
          <span><b>15</b><small>保持分钟数</small></span>
        </div>
      </div>
      <div class="docs-fact-list is-three">
        <div><strong>SESSION ID</strong><p>必须是 12 位英文字母或数字。复用相同 ID 才会命中同一粘性路由。</p></div>
        <div><strong>保持时长</strong><p>支持 1-120 分钟。到期或出口不可用时会重新分配。</p></div>
        <div><strong>改变出口</strong><p>使用新的 SESSION ID，或者回到每次请求轮转模式。</p></div>
      </div>
    </section>

    <section id="formats">
      <div class="docs-section-title"><span>07</span><div><small>OUTPUT FORMAT</small><h2>代理输出格式</h2></div></div>
      <p>选择与你的采集工具一致的格式。控制台 API 链接使用 <code>txt_type</code> 决定文本输出顺序。</p>
      <div class="docs-format-table">
        <div><code>txt_type=1</code><span>HOST:PORT:USER:PASSWORD</span></div>
        <div><code>txt_type=2</code><span>HOST:PORT@USER:PASSWORD</span></div>
        <div><code>txt_type=3</code><span>USER:PASSWORD:HOST:PORT</span></div>
        <div><code>txt_type=4</code><span>USER:PASSWORD@HOST:PORT</span></div>
      </div>
      <div class="docs-callout is-security">
        ${icon("shield-check")}
        <div><strong>优先从控制台生成</strong><p>提取链接包含套餐标识和路由参数。不要将完整链接或代理密码提交到公开代码仓库。</p></div>
      </div>
    </section>

    <section id="production">
      <div class="docs-section-title"><span>08</span><div><small>PRODUCTION</small><h2>生产使用建议</h2></div></div>
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>按目标站点限制并发</strong><small>套餐并发不是单站点应承受的请求频率。</small></span></div>
        <div>${icon("check")}<span><strong>设置连接与读取超时</strong><small>区分连接代理失败和目标响应过慢。</small></span></div>
        <div>${icon("check")}<span><strong>记录请求结果</strong><small>至少记录状态码、耗时、重试和 SESSION。</small></span></div>
        <div>${icon("check")}<span><strong>验证有效数据</strong><small>不要只用 HTTP 200 判断页面或对象有效。</small></span></div>
        <div>${icon("check")}<span><strong>保护代理凭证</strong><small>使用环境变量或密钥管理服务，避免日志泄露。</small></span></div>
      </div>
    </section>

    <section id="troubleshooting">
      <div class="docs-section-title"><span>09</span><div><small>TROUBLESHOOTING</small><h2>常见问题</h2></div></div>
      <div class="docs-troubleshooting">
        <details open><summary>为什么纯住宅池没有保持同一出口？${icon("chevron-down")}</summary><p>确认使用账密认证、SESSION ID 为 12 位字母或数字、分钟数在 1-120 之间，并且连续请求使用完全相同的认证用户名。</p></details>
        <details><summary>为什么选择地区后仍出现其他国家？${icon("chevron-down")}</summary><p>隧道代理只提供粗粒度地区，不是国家精确定位。需要指定国家时使用隧道住宅代理，并预留路由配置同步时间。</p></details>
        <details><summary>并发线程套餐是否限制传输流量？${icon("chevron-down")}</summary><p>不按累计 GB 计费，但限制同时在途请求数。目标响应、连接复用和浏览器子资源都会影响实际并发占用。</p></details>
        <details><summary>HOSTNAME 和 IP 接入怎么选？${icon("chevron-down")}</summary><p>优先使用 HOSTNAME，便于网关维护和故障切换。只有运行环境存在 DNS 限制或控制台明确建议时再使用固定 IP。</p></details>
      </div>
    </section>

    <nav class="docs-next">
      <span>运行完整案例</span>
      <a href="/developers/examples/python-requests-proxy/"><div><small>Python Requests</small><strong>使用隧道代理完成分页采集</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#quick-request", "最小请求"],
    ["#pools", "代理池"],
    ["#billing", "流量与并发"],
    ["#routing", "地区路由"],
    ["#authentication", "认证方式"],
    ["#session", "SESSION"],
    ["#formats", "输出格式"],
    ["#production", "生产建议"],
    ["#troubleshooting", "常见问题"]
  ]);
}

function residentialMain(page) {
  const connectionCode = codeTabs(
    "residential-code",
    standardProxySamples("residential.123proxy.cn", 33000),
    "curl"
  );
  const content = `
    <nav class="docs-breadcrumb" aria-label="面包屑"><a href="/developers/">开发者中心</a>${icon("chevron-right")}<span>产品接入</span>${icon("chevron-right")}<span>隧道住宅代理</span></nav>
    <header class="docs-article-header docs-product-doc-header">
      <span class="docs-article-label">RESIDENTIAL ROTATING PROXY</span>
      <h1>隧道住宅代理接入手册</h1>
      <p>通过固定住宅网关接入 8000 万+住宅 IP。默认全球随机，也可在提取时指定国家或地区，并用 SESSION 尽量保持同一出口。</p>
      <div class="docs-product-facts">
        <span><small>代理池</small><strong>8000 万+住宅 IP</strong></span>
        <span><small>覆盖</small><strong>190+国家和地区</strong></span>
        <span><small>计费</small><strong>仅按流量</strong></span>
        <span><small>路由</small><strong>国家 / SESSION</strong></span>
      </div>
      <div class="docs-article-actions">
        <a class="btn btn-primary" href="https://console.123proxy.cn/app/#extract?product=residential">${icon("route")}打开提取代理</a>
        <a class="btn docs-secondary-button" href="/pricing.html?product=residential">${icon("tag")}查看流量套餐</a>
      </div>
    </header>

    <section id="quick-request">
      <div class="docs-section-title"><span>01</span><div><small>MINIMUM REQUEST</small><h2>使用控制台生成的完整用户名</h2></div></div>
      <p>示例已固定使用住宅网关 <code>residential.123proxy.cn:33000</code>。在控制台完成国家、SESSION 和认证配置后，只需填写代理账密；<code>PROXY_USER</code> 必须使用完整路由用户名。</p>
      ${connectionCode}
      <div class="docs-callout">
        ${icon("circle-check")}
        <div><strong>固定网关不随国家和SESSION变化</strong><p>主机始终为 <code>residential.123proxy.cn</code>，端口始终为 <code>33000</code>。国家与 SESSION 由完整认证用户名控制。</p></div>
      </div>
    </section>

    <section id="routing">
      <div class="docs-section-title"><span>02</span><div><small>GEO ROUTING</small><h2>国家在提取代理时选择</h2></div></div>
      <p>购买流量套餐时不锁定地区。每次生成代理时决定全球随机、欧洲随机或具体国家；具体国家使用小写国家码，并始终放在认证用户名最后。</p>
      <div class="docs-fact-list">
        <div><strong>全球随机</strong><p>认证用户名不添加国家后缀，从全球住宅池随机选择出口。</p></div>
        <div><strong>地区或国家</strong><p>例如美国添加 <code>+us</code>，日本添加 <code>+jp</code>，国家码必须为小写。</p></div>
        <div><strong>变更生效</strong><p>首次生成或修改国家、SESSION 后，通常需要约 3–15 分钟同步。</p></div>
      </div>
      <div class="docs-callout is-important">
        ${icon("map-pin")}
        <div><strong>3–15 分钟不是 SESSION 时长</strong><p>前者是路由配置同步时间；SESSION 时长是你设置的 1–120 分钟粘性窗口，两者互不替代。</p></div>
      </div>
    </section>

    <section id="username">
      <div class="docs-section-title"><span>03</span><div><small>USERNAME ANATOMY</small><h2>认证用户名的固定拼接顺序</h2></div></div>
      <p>账密认证的顺序固定为：基础代理用户 → SESSION（可选）→ 国家码（可选且必须在最后）。</p>
      <div class="docs-username-anatomy is-residential">
        <span class="docs-username-label">美国 · 15 分钟 Sticky SESSION</span>
        <code><b>proxy-user</b><em>-sess_</em><strong>a8F3kP9xQ2mL_15</strong><em>+us</em></code>
        <div>
          <span><b>proxy-user</b><small>基础代理用户</small></span>
          <span><b>-sess_a8F3kP9xQ2mL_15</b><small>SESSION ID 与分钟数</small></span>
          <span><b>+us</b><small>小写国家码，始终在最后</small></span>
        </div>
      </div>
      <div class="docs-format-table">
        <div><code>全球随机轮转</code><span>proxy-user</span></div>
        <div><code>美国轮转</code><span>proxy-user+us</span></div>
        <div><code>美国 Sticky</code><span>proxy-user-sess_a8F3kP9xQ2mL_15+us</span></div>
        <div><code>全球 Sticky</code><span>proxy-user-sess_a8F3kP9xQ2mL_15</span></div>
      </div>
    </section>

    <section id="session">
      <div class="docs-section-title"><span>04</span><div><small>STICKY SESSION</small><h2>什么时候使用 SESSION</h2></div></div>
      <p>默认模式下，新请求会进入轮转逻辑。分页、短流程或多步骤请求需要尽量保持同一住宅出口时，再启用 Sticky SESSION。</p>
      <div class="docs-fact-list">
        <div><strong>12 位 SESSION ID</strong><p>只使用英文字母和数字。复用同一个 ID 才会复用同一条粘性路由。</p></div>
        <div><strong>1–120 分钟</strong><p>时长到期或出口不可用后，系统会重新分配住宅 IP。</p></div>
        <div><strong>主动换出口</strong><p>修改 SESSION ID，或切回每次请求轮转模式。</p></div>
      </div>
    </section>

    <section id="authentication">
      <div class="docs-section-title"><span>05</span><div><small>AUTHENTICATION</small><h2>账密认证与套餐 IP 白名单</h2></div></div>
      <div class="docs-auth-flow">
        <article>${icon("key-round")}<div><strong>账密认证</strong><p>程序发送完整路由用户名与代理密码，国家码和 SESSION 都能直接从用户名看出。</p><code>HOST:PORT:ROUTED_USER:PASSWORD</code></div></article>
        <article>${icon("shield-check")}<div><strong>套餐 IP 白名单</strong><p>白名单绑定当前套餐。程序只使用 HOST:PORT，国家和 SESSION 由控制台保存为套餐路由。</p><code>HOST:PORT</code></div></article>
      </div>
      <p class="docs-quiet-note">${icon("info")}白名单输入时每行一个公网 IPv4；保存到后端时会转为英文逗号分隔。更换采集服务器后需更新当前套餐白名单。</p>
    </section>

    <section id="billing">
      <div class="docs-section-title"><span>06</span><div><small>BILLING</small><h2>只按实际代理流量使用</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>维度</span><span>隧道住宅代理</span><span>不属于该产品</span></div>
        <div><strong>购买方式</strong><span>仅按传输流量 GB</span><span>不提供并发线程或端口不限量套餐</span></div>
        <div><strong>路由参数</strong><span>国家、地区与 SESSION</span><span>路由参数不会改变计费方式</span></div>
      </div>
    </section>

    <section id="formats">
      <div class="docs-section-title"><span>07</span><div><small>OUTPUT FORMAT</small><h2>代理输出格式</h2></div></div>
      <p>控制台可按工具需要输出四种文本顺序。使用账密认证时，用户名必须保留完整的 SESSION 和国家后缀。</p>
      <div class="docs-format-table">
        <div><code>txt_type=1</code><span>HOST:PORT:USER:PASSWORD</span></div>
        <div><code>txt_type=2</code><span>HOST:PORT@USER:PASSWORD</span></div>
        <div><code>txt_type=3</code><span>USER:PASSWORD:HOST:PORT</span></div>
        <div><code>txt_type=4</code><span>USER:PASSWORD@HOST:PORT</span></div>
      </div>
    </section>

    <section id="production">
      <div class="docs-section-title"><span>08</span><div><small>PRODUCTION</small><h2>生产使用建议</h2></div></div>
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>等待路由同步</strong><small>变更国家或 SESSION 后预留 3–15 分钟，再重新建立连接验证。</small></span></div>
        <div>${icon("check")}<span><strong>按任务生成 SESSION ID</strong><small>不要让无关任务长期共享同一个 SESSION。</small></span></div>
        <div>${icon("check")}<span><strong>统计实际流量</strong><small>响应体、图片和其他资源都会进入流量消耗。</small></span></div>
        <div>${icon("check")}<span><strong>验证国家与有效内容</strong><small>同时检查出口位置、状态码和响应内容，不只判断 HTTP 200。</small></span></div>
      </div>
    </section>

    <section id="troubleshooting">
      <div class="docs-section-title"><span>09</span><div><small>TROUBLESHOOTING</small><h2>常见问题</h2></div></div>
      <div class="docs-troubleshooting">
        <details open><summary>国家码应该放在哪里？${icon("chevron-down")}</summary><p>国家码必须为小写并放在完整认证用户名最后。例如美国为 <code>proxy-user+us</code>，带 SESSION 时为 <code>proxy-user-sess_12位ID_15+us</code>。</p></details>
        <details><summary>设置国家后为什么没有立即变化？${icon("chevron-down")}</summary><p>首次生成或修改国家、SESSION 后通常需要约 3–15 分钟同步。等待后重新建立连接，不要复用旧连接池验证。</p></details>
        <details><summary>白名单模式还需要发送国家码吗？${icon("chevron-down")}</summary><p>不需要在程序中发送用户名。国家与 SESSION 会由控制台保存到当前套餐路由，程序只连接生成的 HOST:PORT。</p></details>
        <details><summary>它是否支持并发线程不限流量？${icon("chevron-down")}</summary><p>不支持。隧道住宅代理仅按实际传输流量使用；需要并发线程套餐应选择隧道代理。</p></details>
      </div>
    </section>

    <nav class="docs-next">
      <span>运行完整案例</span>
      <a href="/developers/examples/nodejs-axios-proxy/"><div><small>Node.js Axios</small><strong>使用住宅网关采集分页数据</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#quick-request", "最小请求"],
    ["#routing", "国家定位"],
    ["#username", "用户名结构"],
    ["#session", "SESSION"],
    ["#authentication", "认证方式"],
    ["#billing", "流量计费"],
    ["#formats", "输出格式"],
    ["#production", "生产建议"],
    ["#troubleshooting", "常见问题"]
  ]);
}

function unlimitedMain(page) {
  const connectionCode = codeTabs(
    "unlimited-code",
    standardProxySamples("unlimit.residential.123proxy.cn", 10253),
    "curl"
  );
  const workerCode = codeTabs("unlimited-workers", {
    python: { label: "Python", code: codeSamples.unlimitedWorkersPython },
    node: { label: "Node.js", code: codeSamples.unlimitedWorkersNode },
    go: { label: "Go", code: codeSamples.unlimitedWorkersGo }
  }, "python");
  const content = `
    <nav class="docs-breadcrumb" aria-label="面包屑"><a href="/developers/">开发者中心</a>${icon("chevron-right")}<span>产品接入</span>${icon("chevron-right")}<span>不限量动态住宅</span></nav>
    <header class="docs-article-header docs-product-doc-header">
      <span class="docs-article-label">UNLIMITED RESIDENTIAL PROXY</span>
      <h1>不限量动态住宅接入手册</h1>
      <p>套餐按端口配置不限流量住宅资源，程序统一连接固定网关 <code>unlimit.residential.123proxy.cn:10253</code>。地区和 3–30 分钟轮转周期仍按套餐统一设置。</p>
      <div class="docs-product-facts">
        <span><small>资源</small><strong>连续代理端口</strong></span>
        <span><small>每端口</small><strong>不限流量与并发</strong></span>
        <span><small>轮转</small><strong>3–30 分钟</strong></span>
        <span><small>地区</small><strong>套餐级统一设置</strong></span>
      </div>
      <div class="docs-article-actions">
        <a class="btn btn-primary" href="https://console.123proxy.cn/app/#extract?product=unlimited">${icon("route")}打开提取代理</a>
        <a class="btn docs-secondary-button" href="/pricing.html?product=unlimited">${icon("tag")}查看端口套餐</a>
      </div>
    </header>

    <section id="quick-request">
      <div class="docs-section-title"><span>01</span><div><small>MINIMUM REQUEST</small><h2>固定网关，只替换代理账密</h2></div></div>
      <p>示例中的主机固定为 <code>unlimit.residential.123proxy.cn</code>，端口固定为 <code>10253</code>。只需填写控制台生成的代理用户名和密码。</p>
      ${connectionCode}
      <div class="docs-callout is-important">
        ${icon("triangle-alert")}
        <div><strong>网关端口不是需要猜测的套餐参数</strong><p><code>10253</code> 是不限量动态住宅的固定接入端口。套餐资源、地区和轮转配置由控制台及代理网关识别。</p></div>
      </div>
    </section>

    <section id="ports">
      <div class="docs-section-title"><span>02</span><div><small>GATEWAY & PACKAGE</small><h2>固定网关与套餐端口资源分开理解</h2></div></div>
      <p>套餐仍按端口数量配置资源，但客户端不应自行拼接或遍历网关端口。代码始终连接固定域名和固定端口，套餐映射由控制台生成的代理凭证识别。</p>
      <div class="docs-port-map">
        <div><small>固定网关域名</small><strong>unlimit.residential.123proxy.cn</strong><span>代码中直接使用</span></div>
        <div><small>固定网关端口</small><strong>10253</strong><span>不是套餐起始端口</span></div>
        <div><small>需要替换</small><strong>USER / PASSWORD</strong><span>控制台代理账密</span></div>
      </div>
      <div class="docs-fact-list">
        <div><strong>套餐端口资源</strong><p>用于定义当前套餐容量，具体资源关系由控制台和网关管理。</p></div>
        <div><strong>不限流量</strong><p>套餐不按累计 GB 扣减，但仍应监控业务侧带宽与目标响应。</p></div>
        <div><strong>不限并发</strong><p>每端口不限制并发线程；目标站点承载能力仍需由程序控制。</p></div>
      </div>
    </section>

    <section id="routing">
      <div class="docs-section-title"><span>03</span><div><small>PACKAGE ROUTING</small><h2>地区和轮转周期对全部端口生效</h2></div></div>
      <div class="docs-compare-table">
        <div class="docs-compare-head"><span>设置</span><span>作用范围</span><span>生效逻辑</span></div>
        <div><strong>国家或地区</strong><span>当前套餐全部端口</span><span>不能为单个端口分别设置</span></div>
        <div><strong>轮转周期</strong><span>当前套餐全部端口</span><span>3–30 分钟内固定，周期结束自动更换</span></div>
        <div><strong>配置同步</strong><span>当前套餐全部端口</span><span>修改后通常需要约 3–15 分钟</span></div>
      </div>
      <div class="docs-callout">
        ${icon("refresh-cw")}
        <div><strong>不需要在用户名中设置 SESSION</strong><p>端口本身承担粘性路由。持续使用同一端口即可在所选周期内尽量保持同一住宅出口。</p></div>
      </div>
    </section>

    <section id="authentication">
      <div class="docs-section-title"><span>04</span><div><small>AUTHENTICATION</small><h2>账密或套餐 IP 白名单</h2></div></div>
      <div class="docs-auth-flow">
        <article>${icon("key-round")}<div><strong>账密认证</strong><p>所有端口使用所选代理用户与密码。适合开发机、弹性节点和多 worker。</p><code>HOST:PORT:USER:PASSWORD</code></div></article>
        <article>${icon("shield-check")}<div><strong>套餐 IP 白名单</strong><p>白名单绑定当前不限量套餐，并对套餐全部端口生效。程序仅发送 HOST:PORT。</p><code>HOST:PORT</code></div></article>
      </div>
    </section>

    <section id="workers">
      <div class="docs-section-title"><span>05</span><div><small>MULTI WORKER</small><h2>多个 worker 共用固定代理网关</h2></div></div>
      <p>下面示例启动多个 worker，但所有请求都连接 <code>unlimit.residential.123proxy.cn:10253</code>。代码无需生成端口范围，只需保护并复用控制台代理账密。</p>
      ${workerCode}
    </section>

    <section id="formats">
      <div class="docs-section-title"><span>06</span><div><small>OUTPUT FORMAT</small><h2>固定接入地址的文本格式</h2></div></div>
      <p>无论选择哪种文本顺序，HOST 和 PORT 都是固定网关；需要变化的部分是代理用户名与密码。</p>
      <div class="docs-format-table">
        <div><code>txt_type=1</code><span>HOST:PORT:USER:PASSWORD</span></div>
        <div><code>txt_type=2</code><span>HOST:PORT@USER:PASSWORD</span></div>
        <div><code>txt_type=3</code><span>USER:PASSWORD:HOST:PORT</span></div>
        <div><code>txt_type=4</code><span>USER:PASSWORD@HOST:PORT</span></div>
      </div>
      <p class="docs-quiet-note">${icon("info")}不要把套餐端口数量写成网关端口，也不要自行猜测其他接入域名。</p>
    </section>

    <section id="production">
      <div class="docs-section-title"><span>07</span><div><small>PRODUCTION</small><h2>生产使用建议</h2></div></div>
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>固定网关常量</strong><small>在代码中保留官方域名与 10253 端口，不使用主机占位符。</small></span></div>
        <div>${icon("check")}<span><strong>集中管理代理账密</strong><small>通过环境变量或密钥服务向多个 worker 提供凭证。</small></span></div>
        <div>${icon("check")}<span><strong>变更后重新建连</strong><small>地区或周期同步完成后，关闭旧连接池再验证出口。</small></span></div>
        <div>${icon("check")}<span><strong>限制单站点速率</strong><small>端口不限并发不代表目标站点允许无限并发。</small></span></div>
      </div>
    </section>

    <section id="troubleshooting">
      <div class="docs-section-title"><span>08</span><div><small>TROUBLESHOOTING</small><h2>常见问题</h2></div></div>
      <div class="docs-troubleshooting">
        <details open><summary>不限量动态住宅的程序接入地址是什么？${icon("chevron-down")}</summary><p>固定使用 <code>unlimit.residential.123proxy.cn:10253</code>。代码只替换控制台代理用户名与密码，不自行生成其他网关端口。</p></details>
        <details><summary>能否为每个端口设置不同国家？${icon("chevron-down")}</summary><p>不能。国家或地区与 3–30 分钟轮转周期均按套餐统一设置，对套餐全部端口生效。</p></details>
        <details><summary>如何让一个出口保持更久？${icon("chevron-down")}</summary><p>在控制台将套餐轮转周期设置为 3–30 分钟中的合适值，并持续使用同一网关与代理凭证。该产品不使用 SESSION 用户名。</p></details>
        <details><summary>修改地区后为什么旧连接仍是原出口？${icon("chevron-down")}</summary><p>配置同步通常需要约 3–15 分钟。等待后关闭旧连接池并重新建立代理连接。</p></details>
      </div>
    </section>

    <nav class="docs-next">
      <span>运行完整案例</span>
      <a href="/developers/examples/selenium-proxy/"><div><small>Python Selenium</small><strong>通过不限量住宅网关运行浏览器任务</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#quick-request", "最小请求"],
    ["#ports", "网关与套餐"],
    ["#routing", "套餐级路由"],
    ["#authentication", "认证方式"],
    ["#workers", "多 worker"],
    ["#formats", "输出格式"],
    ["#production", "生产建议"],
    ["#troubleshooting", "常见问题"]
  ]);
}

function countryListMarkup(countries, label) {
  return `
    <details class="docs-country-details">
      <summary><span>${icon("map")}查看${label}支持的国家和地区</span><strong>${countries.length} 个</strong>${icon("chevron-down")}</summary>
      <div class="docs-country-grid">
        ${countries.map((country) => `<span>${escapeHtml(country)}</span>`).join("")}
      </div>
    </details>`;
}

function staticMain(page, residential = false) {
  const productName = residential ? "长效静态住宅" : "长效静态代理";
  const englishName = residential ? "STATIC RESIDENTIAL ISP PROXY" : "STATIC DATACENTER PROXY";
  const consoleKey = residential ? "static-residential" : "static-datacenter";
  const consoleProductKey = residential ? "staticResidential" : "staticDatacenter";
  const countries = residential ? staticResidentialCountries : staticDatacenterCountries;
  const allocationCode = codeTabs(
    `${consoleKey}-allocation`,
    staticAllocationSamples(),
    "curl"
  );
  const proxyCode = codeTabs(
    `${consoleKey}-proxy`,
    staticProxySamples(),
    "curl"
  );
  const typeDescription = residential
    ? "固定住宅 ISP IP，在使用周期内保持同一住宅网络身份。"
    : "固定数据中心 IP，强调稳定连接、固定来源与长期任务。";
  const inventoryDescription = residential
    ? "国家范围按住宅 ISP 实时库存分配，最终可选项以控制台为准。"
    : "从支持清单选择国家或地区；长效静态代理不支持中国地区 IP。";
  const content = `
    <nav class="docs-breadcrumb" aria-label="面包屑"><a href="/developers/">开发者中心</a>${icon("chevron-right")}<span>产品接入</span>${icon("chevron-right")}<span>${productName}</span></nav>
    <header class="docs-article-header docs-product-doc-header">
      <span class="docs-article-label">${englishName}</span>
      <h1>${productName}接入手册</h1>
      <p>${typeDescription}先生成并调用固定 IP 分配链接，再使用返回的 HOST、PORT、代理用户名和密码接入程序。</p>
      <div class="docs-product-facts">
        <span><small>资源</small><strong>${residential ? "固定住宅 ISP IP" : "固定数据中心 IP"}</strong></span>
        <span><small>认证</small><strong>仅代理账密</strong></span>
        <span><small>流量</small><strong>不限流量</strong></span>
        <span><small>路由</small><strong>无 SESSION / 不轮转</strong></span>
      </div>
      <div class="docs-article-actions">
        <a class="btn btn-primary" href="https://console.123proxy.cn/app/#extract?product=${consoleProductKey}">${icon("server")}打开固定 IP 分配</a>
        <a class="btn docs-secondary-button" href="/pricing.html?product=${consoleKey}">${icon("tag")}查看付费套餐</a>
      </div>
    </header>

    <section id="overview">
      <div class="docs-section-title"><span>01</span><div><small>TWO-STAGE ACCESS</small><h2>分配固定 IP 与使用代理是两个请求</h2></div></div>
      <div class="docs-allocation-flow">
        <article><span>01</span>${icon("sliders-horizontal")}<div><strong>生成分配链接</strong><p>在控制台选择套餐、国家、协议和数量，只生成 URL，不立即占用资源。</p></div></article>
        <article><span>02</span>${icon("link-2")}<div><strong>调用分配链接</strong><p>调用后才会消耗套餐可提数量，并返回固定代理信息。</p></div></article>
        <article><span>03</span>${icon("terminal")}<div><strong>使用返回代理</strong><p>将返回的 HOST、PORT、USER、PASSWORD 配置到采集程序。</p></div></article>
      </div>
      <div class="docs-callout is-important">
        ${icon("triangle-alert")}
        <div><strong>分配链接不是代理地址</strong><p>不能把分配 URL 放进 Requests、Scrapy、浏览器或代理客户端。只有调用后返回的固定代理信息才能用于代理请求。</p></div>
      </div>
    </section>

    <section id="allocation">
      <div class="docs-section-title"><span>02</span><div><small>ALLOCATION API</small><h2>生成并调用固定 IP 分配链接</h2></div></div>
      <p>控制台会根据当前套餐生成带套餐标识的链接。链接本身不会分配资源；执行下面的请求后才开始分配，响应最长可能等待约 5 分钟。</p>
      ${allocationCode}
      <div class="docs-callout is-security">
        ${icon("shield-check")}
        <div><strong>不要自动重试未知结果的分配请求</strong><p>调用会消耗套餐剩余可提数量。遇到连接中断时，先刷新“已分配固定 IP”列表，确认结果后再决定是否重试。</p></div>
      </div>
    </section>

    <section id="response">
      <div class="docs-section-title"><span>03</span><div><small>ALLOCATION RESPONSE</small><h2>解析每行返回的固定代理</h2></div></div>
      <p>成功响应为纯文本，每行一个固定代理，顺序固定为 <code>HOST:PORT:USER:PASSWORD</code>。密码中如包含冒号，解析时最多只切分前三个冒号。</p>
      <div class="docs-result docs-static-result">
        <span>分配响应示例</span>
        <code>203.0.113.24:10001:proxy_user:proxy_password</code>
        <p>示例 IP 属于文档保留地址。真实返回结果会同时出现在控制台“已分配固定 IP”列表。</p>
      </div>
      <div class="docs-format-table">
        <div><code>HOST</code><span>已分配固定代理主机或 IP</span></div>
        <div><code>PORT</code><span>该固定代理的接入端口</span></div>
        <div><code>USER</code><span>固定代理认证用户名</span></div>
        <div><code>PASSWORD</code><span>固定代理认证密码</span></div>
      </div>
    </section>

    <section id="use-proxy">
      <div class="docs-section-title"><span>04</span><div><small>PROXY REQUEST</small><h2>使用已分配代理访问目标</h2></div></div>
      <p>把分配响应中的四个字段写入环境变量，再运行下面的标准代理代码。这个请求访问测试目标，不会再次调用分配 API。</p>
      ${proxyCode}
      <div class="docs-callout">
        ${icon("circle-check")}
        <div><strong>固定代理在使用周期内不轮转</strong><p>${residential ? "同一代理保持固定住宅 ISP 身份，适合长期账号、区域内容和稳定会话。" : "同一代理保持固定数据中心出口，适合来源 IP 登记、环境隔离和长期连接。"}</p></div>
      </div>
    </section>

    <section id="authentication">
      <div class="docs-section-title"><span>05</span><div><small>AUTHENTICATION BOUNDARY</small><h2>静态代理只支持账密认证</h2></div></div>
      <div class="docs-boundary-grid">
        <div class="is-supported">${icon("key-round")}<span><strong>支持：代理用户名与密码</strong><small>程序通过分配结果中的 USER 和 PASSWORD 连接代理。</small></span></div>
        <div>${icon("shield-x")}<span><strong>不支持：123Proxy 套餐 IP 白名单认证</strong><small>不能仅凭采集服务器公网 IP 连接静态代理。</small></span></div>
        <div>${icon("link")}<span><strong>不支持：SESSION</strong><small>出口本身固定，不需要在认证用户名中加入 SESSION。</small></span></div>
        <div>${icon("refresh-cw-off")}<span><strong>不支持：自动轮转</strong><small>需要周期换 IP 时请选择动态住宅或隧道代理。</small></span></div>
      </div>
      <div class="docs-callout">
        ${icon("building-2")}
        <div><strong>固定出口可以登记到目标系统白名单</strong><p>这表示将固定代理出口 IP 加到合作方 API 或企业系统的来源 IP 白名单；连接 123Proxy 代理本身仍必须使用代理账密。</p></div>
      </div>
    </section>

    <section id="countries">
      <div class="docs-section-title"><span>06</span><div><small>LOCATION INVENTORY</small><h2>地区在分配时按库存选择</h2></div></div>
      <p>${inventoryDescription}页面显示中文地区名称，实际分配前应以控制台当前可选库存为准。</p>
      ${countryListMarkup(countries, productName)}
      ${residential ? "" : `
        <div class="docs-callout is-warning">
          ${icon("map-pin-off")}
          <div><strong>不支持中国地区 IP</strong><p>长效静态代理的支持清单不包含中国。请勿通过手工参数构造不存在的地区。</p></div>
        </div>`}
    </section>

    <section id="lifecycle">
      <div class="docs-section-title"><span>07</span><div><small>RESOURCE LIFECYCLE</small><h2>管理已分配固定 IP</h2></div></div>
      <div class="docs-checklist">
        <div>${icon("check")}<span><strong>分配后保存凭证</strong><small>从控制台已分配列表读取，不依赖旧的分配请求响应。</small></span></div>
        <div>${icon("check")}<span><strong>按项目隔离固定出口</strong><small>记录套餐、业务、国家和固定代理之间的映射。</small></span></div>
        <div>${icon("check")}<span><strong>到期前处理续费</strong><small>固定身份任务应提前确认续费和资源状态。</small></span></div>
        <div>${icon("check")}<span><strong>健康异常及时替换</strong><small>记录连接错误、目标响应和固定出口健康状态。</small></span></div>
      </div>
    </section>

    <section id="troubleshooting">
      <div class="docs-section-title"><span>08</span><div><small>TROUBLESHOOTING</small><h2>常见问题</h2></div></div>
      <div class="docs-troubleshooting">
        <details open><summary>为什么分配链接不能配置到代理客户端？${icon("chevron-down")}</summary><p>分配链接是用于领取固定 IP 的 API 请求。必须先调用并解析返回的 HOST、PORT、USER、PASSWORD，再使用这些字段连接代理。</p></details>
        <details><summary>静态代理是否支持 IP 白名单认证？${icon("chevron-down")}</summary><p>不支持。两类静态代理连接 123Proxy 时都必须使用返回的代理用户名和密码。</p></details>
        <details><summary>重复调用分配链接会发生什么？${icon("chevron-down")}</summary><p>每次成功调用都可能继续消耗套餐可提数量。发生超时或断连时先检查已分配列表，不要直接循环重试。</p></details>
        <details><summary>${residential ? "固定住宅 IP 会自动轮转吗？" : "长效静态代理支持中国地区吗？"}${icon("chevron-down")}</summary><p>${residential ? "不会。固定住宅 ISP IP 在使用周期内保持稳定，不支持 SESSION 或自动轮转。" : "不支持。当前数据中心静态代理支持清单不包含中国，实际地区以控制台库存为准。"}</p></details>
        <details><summary>是否提供免费测试？${icon("chevron-down")}</summary><p>不提供。两类静态代理需要直接购买付费套餐，再在控制台按库存分配固定 IP。</p></details>
      </div>
    </section>

    <nav class="docs-next">
      <span>运行标准代理案例</span>
      <a href="/developers/examples/python-requests-proxy/"><div><small>Python Requests</small><strong>把固定代理分配结果代入客户端</strong></div>${icon("arrow-right")}</a>
    </nav>`;
  return articleLayout(page, content, [
    ["#overview", "两阶段接入"],
    ["#allocation", "调用分配链接"],
    ["#response", "解析返回"],
    ["#use-proxy", "使用固定代理"],
    ["#authentication", "认证边界"],
    ["#countries", "支持地区"],
    ["#lifecycle", "资源管理"],
    ["#troubleshooting", "常见问题"]
  ]);
}

const developerProductFacts = {
  tunnel: productSeoFacts.tunnel,
  residential: productSeoFacts.residential,
  unlimited: productSeoFacts.unlimitedResidential,
  "static-datacenter": productSeoFacts.staticDatacenter,
  "static-residential": productSeoFacts.staticResidential
};

const standardProductFacts = [
  productSeoFacts.tunnel,
  productSeoFacts.residential,
  productSeoFacts.unlimitedResidential,
  productSeoFacts.staticDatacenter,
  productSeoFacts.staticResidential
];

function serviceReference(fact, siteUrl) {
  return { "@id": `${siteUrl}${fact.path}#service` };
}

function serviceNode(fact, siteUrl) {
  return {
    "@type": "Service",
    "@id": `${siteUrl}${fact.path}#service`,
    name: fact.name,
    url: `${siteUrl}${fact.path}`,
    description: fact.description,
    serviceType: fact.serviceType,
    category: fact.category,
    provider: { "@id": `${siteUrl}/#organization` },
    audience: {
      "@type": "Audience",
      audienceType: fact.audience
    },
    additionalProperty: fact.properties.map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value
    }))
  };
}

function structuredData(page, siteUrl) {
  const pageUrl = `${siteUrl}${page.route}`;
  const documentId = `${pageUrl}#document`;
  const collectionId = `${siteUrl}/developers/#document`;
  const dateModified = lastModifiedForRoute(page.route);
  const seoFactsByKey = new Map(
    Object.values(productSeoFacts).map((fact) => [fact.key, fact])
  );
  const exampleProductFact = page.kind === "example" && page.exampleKey !== "hub"
    ? seoFactsByKey.get(page.productKey || "tunnel")
    : null;
  const guideFacts = page.kind === "guide"
    ? page.productKeys.map((key) => seoFactsByKey.get(key)).filter(Boolean)
    : [];
  const productFact = developerProductFacts[page.key]
    || exampleProductFact;
  const relatedFacts = page.key === "home"
    ? Object.values(productSeoFacts)
    : page.kind === "guide"
      ? guideFacts
      : (page.key === "getting-started" || page.kind === "example" ? standardProductFacts : [productFact].filter(Boolean));
  const relatedServices = relatedFacts.map((fact) => serviceReference(fact, siteUrl));
  let documentNode;
  if (page.key === "home" || (page.kind === "example" && page.exampleKey === "hub")) {
    documentNode = {
        "@type": "CollectionPage",
        "@id": documentId,
        headline: page.heading,
        description: page.description,
        url: pageUrl,
        inLanguage: "zh-CN",
        publisher: { "@id": `${siteUrl}/#organization` },
        dateModified,
        about: relatedServices
      };
  } else if (page.key === "getting-started") {
    documentNode = {
          "@type": "HowTo",
          "@id": documentId,
          name: page.heading,
          headline: page.heading,
          description: page.description,
          url: pageUrl,
          inLanguage: "zh-CN",
          totalTime: "PT5M",
          publisher: { "@id": `${siteUrl}/#organization` },
          isPartOf: { "@id": collectionId },
          dateModified,
          about: relatedServices,
          step: [
            { "@type": "HowToStep", position: 1, name: "选择代理产品和套餐" },
            { "@type": "HowToStep", position: 2, name: "在控制台生成代理" },
            { "@type": "HowToStep", position: 3, name: "理解代理认证" },
            { "@type": "HowToStep", position: 4, name: "使用 cURL 验证代理" },
            { "@type": "HowToStep", position: 5, name: "复制到采集代码" }
          ]
        };
  } else if (page.kind === "example") {
    documentNode = {
      "@type": "TechArticle",
      "@id": documentId,
      headline: page.heading,
      description: page.description,
      url: pageUrl,
      inLanguage: "zh-CN",
      publisher: { "@id": `${siteUrl}/#organization` },
      isPartOf: { "@id": collectionId },
      dateModified,
      about: [
        serviceReference(productFact, siteUrl),
        { "@type": "Thing", name: page.framework },
        { "@type": "Thing", name: page.targetType },
        { "@type": "Thing", name: "网页数据采集" }
      ],
      mentions: standardProductFacts
        .filter((fact) => fact.key !== productFact.key)
        .map((fact) => serviceReference(fact, siteUrl)),
      hasPart: {
        "@type": "SoftwareSourceCode",
        "@id": `${pageUrl}#source-code`,
        name: page.heading,
        url: `${pageUrl}#code`,
        isPartOf: { "@id": documentId },
        codeSampleType: "完整可运行示例",
        programmingLanguage: page.programmingLanguage,
        runtimePlatform: page.runtimePlatform,
        targetProduct: {
          "@type": "SoftwareApplication",
          name: page.framework,
          applicationCategory: "DeveloperApplication"
        }
      }
    };
  } else {
    documentNode = {
          "@type": "TechArticle",
          "@id": documentId,
          headline: page.heading,
          description: page.description,
          url: pageUrl,
          inLanguage: "zh-CN",
          publisher: { "@id": `${siteUrl}/#organization` },
          isPartOf: { "@id": collectionId },
          dateModified,
          about: productFact ? serviceReference(productFact, siteUrl) : relatedServices
        };
  }
  const base = {
    "@context": "https://schema.org",
    "@graph": [
      { ...seoOrganization },
      documentNode,
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "开发者中心", item: `${siteUrl}/developers/` },
          ...(page.key === "home" ? [] : [{ "@type": "ListItem", position: 3, name: page.heading, item: `${siteUrl}${page.route}` }])
        ]
      },
      ...relatedFacts.map((fact) => serviceNode(fact, siteUrl))
    ]
  };
  const tunnelFaq = [
    {
      question: "为什么纯住宅池没有保持同一出口？",
      answer: "确认使用账密认证，SESSION ID 为 12 位字母或数字，保持时长为 1-120 分钟，并在连续请求中使用完全相同的认证用户名。"
    },
    {
      question: "为什么选择地区后仍出现其他国家？",
      answer: "隧道代理只支持粗粒度地区，不提供任意国家精确定位。需要指定国家时应使用隧道住宅代理。"
    },
    {
      question: "并发线程套餐是否限制传输流量？",
      answer: "并发线程套餐不按累计 GB 计费，但会限制同时在途请求数。"
    }
  ];
  const faqEntries = page.key === "tunnel"
    ? tunnelFaq
    : page.kind === "guide"
      ? page.faq
      : page.kind === "example" && page.exampleKey !== "hub"
        ? developerExampleFaq(page)
        : [];
  if (faqEntries.length) {
    base["@graph"].push({
      "@type": "FAQPage",
      "@id": `${siteUrl}${page.route}#faq`,
      inLanguage: "zh-CN",
      isPartOf: { "@id": documentId },
      mainEntity: faqEntries.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      }))
    });
  }
  return JSON.stringify(base);
}

export function renderDeveloperDocument(page, { siteUrl, assetVersion }) {
  const renderers = {
    home: () => homeMain(),
    "getting-started": () => gettingStartedMain(page),
    tunnel: () => tunnelMain(page),
    residential: () => residentialMain(page),
    unlimited: () => unlimitedMain(page),
    "static-datacenter": () => staticMain(page, false),
    "static-residential": () => staticMain(page, true)
  };
  const main = page.kind === "example"
    ? renderDeveloperExample(page, { icon, codeTabs, articleLayout })
    : page.kind === "guide"
      ? renderDeveloperGuide(page, { icon, codeTabs, articleLayout })
      : (renderers[page.key] || renderers.home)();
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="${escapeHtml(page.description)}">
  <title>${escapeHtml(page.title)}</title>
  <link rel="canonical" href="${siteUrl}${page.route}">
  <meta property="og:type" content="${page.key === "home" || (page.kind === "example" && page.exampleKey === "hub") ? "website" : "article"}">
  <meta property="og:site_name" content="123Proxy">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${siteUrl}${page.route}">
  <meta property="og:image" content="${siteUrl}/assets/original-123proxy-logo-final.jpg">
  ${page.key === "home" || (page.kind === "example" && page.exampleKey === "hub") ? "" : `<meta property="article:modified_time" content="${lastModifiedForRoute(page.route)}">`}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/product-detail.css?v=${assetVersion}">
  <link rel="stylesheet" href="/assets/developer-docs.css?v=${assetVersion}">
  <script type="application/ld+json">${structuredData(page, siteUrl)}</script>
</head>
<body class="developer-docs" data-developer-page="${escapeHtml(page.key)}">
  <div class="page">
    ${headerMarkup()}
    ${main}
    ${footerMarkup()}
  </div>
  <script type="application/json" id="developerSearchIndex">${JSON.stringify(searchIndex).replaceAll("<", "\\u003c")}</script>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script src="/assets/developer-docs.js?v=${assetVersion}"></script>
</body>
</html>`;
}
