# 123Proxy 服务监控

这套监控由两个进程组成：

- **Uptime Kuma**：监控编排、历史图表、维护窗口和企业微信告警。
- **status-service**：通过代理账号发起真实代理请求，聚合产品与区域状态，并向官网提供 `GET /v1/summary`。

不建议只对代理节点做 Ping 或 TCP 端口检查。端口可连接不代表代理认证、
上游路由和出口访问可用；`status-service` 会经过代理读取测试 URL 的真实响应。

## 监控模型

底层共有 9 个真实代理探针：

| 产品 | 节点数 | 公开组件 |
| --- | ---: | --- |
| 隧道代理 | 3 | `proxy-tunnel` |
| 隧道住宅代理 | 3 | `proxy-residential` |
| 不限量动态住宅 | 3 | `proxy-unlimited` |

同一批探针还按节点所在区域聚合为：

| 区域 | 公开组件 |
| --- | --- |
| 美国网关 | `gateway-us` |
| 欧洲网关 | `gateway-eu` |
| 亚洲网关 | `gateway-asia` |

另外独立检查官网、控制台和 API，对应 `website`、`console`、`api`。公开接口不会返回
代理账号、密码、节点 IP、Uptime Kuma Push Token 或内部错误详情。

聚合规则：

| 通过比例 | 公开状态 |
| --- | --- |
| 全部通过 | `operational` |
| 至少三分之二通过 | `degraded` |
| 少于三分之二但仍有节点通过 | `partial_outage` |
| 所有已检查节点失败 | `major_outage` |
| 测试目标或监控配置不可用 | `unknown` |

Kuma 的 Push Monitor 是二态的：`operational` 和 `maintenance` 推送为 UP，其他状态
推送为 DOWN。更细的状态仍由官网状态页展示。

## 1. 轮换凭证

部署前先轮换曾出现在聊天和旧脚本中的：

1. 代理监控账号密码。
2. 企业微信机器人 Webhook Key。

建议创建仅用于监控、权限和并发受限的独立代理用户。不要把 `.env` 提交到 Git。

## 2. 启动服务

```bash
cd deploy/monitoring
cp .env.example .env
chmod 600 .env
```

编辑 `.env`：

- 填写轮换后的 `PROXY_USERNAME`、`PROXY_PASSWORD`。
- 控制台使用公开的 `https://console.123proxy.cn/healthz` 检查进程与路由可用性，
  不依赖登录 Token。官网和控制台的健康接口都必须返回纯文本 `ok`，普通 HTML
  回退页面不会被误判为健康。
- 将 IP API Token 写入 `API_HEALTH_TOKEN`，用于
  `https://console.123proxy.cn/ip/mytraffic`。API 监控会同时验证鉴权、HTTP 状态和
  JSON 响应。
- `PROBE_TARGET_URLS` 暂时沿用旧脚本的 `http://myip.ipip.net`。生产环境建议提供
  123Proxy 自己控制的轻量 HTTP 回显地址，避免第三方故障导致所有代理探针失去判断依据。

启动：

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f status-service
```

Kuma 管理端默认只监听服务器本机的 `127.0.0.1:3001`。可通过 SSH 隧道访问：

```bash
ssh -L 3001:127.0.0.1:3001 monitor-server
```

然后打开 `http://127.0.0.1:3001` 完成管理员初始化。不要把 Kuma 管理端口直接暴露到公网。

## 3. 创建 Kuma Push Monitors

在 Uptime Kuma 中创建 9 个 **Push** 类型监控：

| Kuma 名称 | `.env` Token 变量 |
| --- | --- |
| 代理产品 / 隧道代理 | `KUMA_TOKEN_PROXY_TUNNEL` |
| 代理产品 / 隧道住宅代理 | `KUMA_TOKEN_PROXY_RESIDENTIAL` |
| 代理产品 / 不限量动态住宅 | `KUMA_TOKEN_PROXY_UNLIMITED` |
| 区域网关 / 美国 | `KUMA_TOKEN_GATEWAY_US` |
| 区域网关 / 欧洲 | `KUMA_TOKEN_GATEWAY_EU` |
| 区域网关 / 亚洲 | `KUMA_TOKEN_GATEWAY_ASIA` |
| 平台服务 / 官网 | `KUMA_TOKEN_WEBSITE` |
| 平台服务 / 控制台 | `KUMA_TOKEN_CONSOLE` |
| 平台服务 / API | `KUMA_TOKEN_API` |

推荐设置：

```text
Heartbeat Interval: 180 秒
Retry Interval:      60 秒
Maximum Retries:     2
Resend Notification: 30 个心跳（按告警策略调整）
```

探针每 60 秒主动推送一次，180 秒心跳窗口可以避免单轮探测稍慢造成误报；如果
`status-service` 自身停止，Kuma 会在心跳超时后报警。

保存每个 Monitor 后，从 Kuma 生成的 Push URL 中取出 `/api/push/` 后、
`?status=` 前的 Token，填入 `.env`。只填 Token，不填整个 URL。随后重启：

```bash
docker compose up -d --force-recreate status-service
```

## 4. 企业微信告警

在 Kuma 的 **Settings -> Notifications** 中新增 **WeCom**：

1. 使用轮换后的企业微信 Bot Key。
2. 点击测试，确认群内收到测试消息。
3. 将该通知绑定到上述 9 个 Push Monitor。
4. 为维护窗口使用 Kuma Maintenance，避免计划内操作触发告警。

推荐告警策略是连续 3 个检查周期异常后通知，大约 2 至 3 分钟；恢复后立即通知。
底层探针自身已经在每个周期内重试，Kuma 的重试用于抑制跨周期抖动。

## 5. 接入官网状态页

监控服务器与官网服务器可以完全独立，不需要加入同一个 Docker 网络。
官网 Nginx 直接通过内网读取状态摘要：

```text
浏览器
  -> https://www.123proxy.cn/status-api/v1/summary
  -> 官网 Nginx
  -> http://192.168.85.105:8080/v1/summary
```

官网容器设置：

```text
STATUS_API_UPSTREAM=http://192.168.85.105:8080
```

部署官网前，先从官网服务器验证内网连通性：

```bash
curl -fsS http://192.168.85.105:8080/v1/summary
```

再重新创建官网容器并验证同源代理：

```bash
curl -fsS https://www.123proxy.cn/status-api/v1/summary
```

官网状态页继续请求 `/status-api/v1/summary`，前端代码不需要修改，也不需要
配置 CORS。监控服务器只需允许官网服务器访问 TCP `8080`，不应向整个公网
开放该端口。

## 6. 状态服务接口

```text
GET  /healthz       进程存活
GET  /readyz        是否完成至少一轮检查
GET  /v1/summary    官网公开状态数据
GET  /metrics       Prometheus 文本指标，不包含节点 IP
POST /v1/run        手动触发检查，需 Bearer INTERNAL_API_TOKEN
```

90 天历史保存在 Docker Volume `status-service-data`。Kuma 数据保存在
`uptime-kuma-data`；两者都必须放在支持 POSIX 文件锁的本地磁盘，不要使用 NFS。

## 7. 事件与维护信息

官网公开事件可写入 `public-events.json`：

```json
{
  "incidents": [
    {
      "title": "欧洲区域请求成功率下降",
      "startedAt": "2026-07-29T09:00:00+08:00",
      "message": "技术团队正在处理。",
      "affectedComponents": ["欧洲网关"]
    }
  ],
  "maintenance": [],
  "componentOverrides": {
    "gateway-eu": {
      "status": "maintenance",
      "message": "计划维护进行中"
    }
  }
}
```

结束事件或维护后删除对应条目和 override。Kuma 中也应建立相同维护窗口，用于暂停告警。

## 8. 本地验证

不需要真实代理凭证即可运行单元测试：

```bash
node --test status-service/test/*.test.mjs
```

测试会启动本地假代理，验证代理认证头、真实响应读取、四级聚合、90 天历史和
`/v1/summary` 契约。
