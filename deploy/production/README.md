# 123Proxy 双生产环境发布

新版本继续使用原有的两个镜像仓库，但必须以不可变版本标签部署：

```text
主环境 / Docker Swarm
registry.cn-hongkong.aliyuncs.com/123proxy/intelligroup-frontend:<release>

深圳环境 / Docker Compose
registry.cn-hongkong.aliyuncs.com/123proxy/intelligroup-frontend-sz:<release>
```

## 两个环境的实际差异

旧版 `nginx_cn.conf` 与 `nginx_sz.conf` 的差异已收敛为构建目标和运行时环境变量：

| 能力 | 主环境 `cn` | 深圳环境 `sz` |
| --- | --- | --- |
| 账户服务 | `account-service:6000` | `47.254.19.92:6000` |
| 登录认证 | `auth-service:5000` | `47.254.19.92:5000` |
| 代理业务 API | `c3-ip-app:6800` | `47.254.19.92:6800` |
| 博客 | `cloudam-wordpress:80` | `47.254.19.92:8000` |
| `/ip/` 限流 | 后端按账号与套餐控制 | 后端按账号与套餐控制 |
| 服务发现 | Swarm overlay 网络 | 固定跨区上游 |

旧主环境配置中的 `api.flashdata.dev` 和 `data.flashdata.dev` 不属于
123Proxy 官网与控制台，未继续塞进前端镜像。它们应由独立网关或独立
Nginx 服务承载，避免前端发布影响其他业务域名。

## 1. 构建静态发布包

需要 Node.js 18+ 与 npm：

```bash
BUILD_DOCKER_IMAGE=false bash build_web_cn.sh
```

完整构建会执行静态渲染、页面与控制台审计、部署打包和监控测试，并输出：

```text
dist/www/
dist/console/
dist/build-manifest.json
dist/release.env
```

## 2. 构建并推送两个镜像

先登录阿里云镜像仓库，或通过环境变量让脚本登录：

```bash
export RELEASE_TAG="20260729-01"
export DOCKER_USER="<registry-user>"
read -r -s DOCKER_PASSWORD
export DOCKER_PASSWORD

PUSH_IMAGE=true bash build_web_cn.sh

unset DOCKER_PASSWORD
```

只构建一个环境时使用 `TARGET=cn` 或 `TARGET=sz`。默认 `TARGET=all`。
脚本先推送版本化标签，再更新兼容用的 `latest`。生产清单只引用版本化标签。

## 3. 准备 TLS 证书

两个生产环境的每个承载节点都必须具有以下只读文件：

```text
/data/cert/123proxy.cn.pem
/data/cert/123proxy.cn.key
/data/cert/console.123proxy.cn.pem
/data/cert/console.123proxy.cn.key
```

建议权限：

```bash
sudo chown -R root:root /data/cert
sudo find /data/cert -type f -name '*.key' -exec chmod 600 {} \;
sudo find /data/cert -type f -name '*.pem' -exec chmod 644 {} \;
```

私钥不得提交到 Git、复制进构建目录或打进镜像。

### Nginx 日志

两个生产清单都会将宿主机 `/data/logs` 挂载到容器 `/var/log`。Nginx 写入：

```text
/var/log/nginx/access.log
/var/log/nginx/error.log
```

宿主机对应文件为：

```text
/data/logs/nginx/access.log
/data/logs/nginx/error.log
```

Nginx 访问日志和错误日志只写入上述文件，不复制到容器 stdout 或 stderr。
文件日志不受 Docker `json-file` 的 `max-size` 与 `max-file` 设置控制，生产服务器
需要使用宿主机 `logrotate` 单独轮转 `/data/logs/nginx/*.log`。

域名托管在阿里云 DNS 时，使用项目内的 DNS-01 自动签发、节点分发和
Nginx 热重载流程。首次安装、RAM 最小权限和续期验证步骤见
`deploy/certificates/README.md`。`deploy.sh` 会在发布前校验证书域名、
有效期、私钥配对和 fullchain，不合格的证书会直接中止发布。

## 4. 发布主 Swarm 环境

前端必须加入能解析 `account-service`、`auth-service`、`c3-ip-app` 和
`cloudam-wordpress` 的现有 overlay 网络：

```bash
docker network ls
docker stack ls
export BACKEND_NETWORK="<existing-overlay-network>"
export STACK_NAME="<current-frontend-stack-name>"
export RELEASE_TAG="20260729-01"

bash deploy/production/deploy.sh cn
```

第一次替换旧服务时，`STACK_NAME` 必须与现网 stack 名一致；默认值仅为
`frontend`。清单使用两个副本、
逐个停止后更新、失败自动回滚，并限制同一节点最多一个副本，因为使用了
host 模式的 80/443 端口。

## 5. 发布深圳 Compose 环境

```bash
docker ps --format '{{.Names}} {{.Label "com.docker.compose.project"}}'

export COMPOSE_PROJECT_NAME="<current-compose-project-name>"
export RELEASE_TAG="20260729-01"
bash deploy/production/deploy.sh sz
```

深圳清单会使用 `intelligroup-frontend-sz`，并把账户、认证、代理 API 与
博客请求转发到旧配置确认过的 `47.254.19.92` 上游。第一次替换旧容器时，
`COMPOSE_PROJECT_NAME` 必须沿用现网值，否则旧容器不会被更新并会继续占用
80/443 端口。

## 6. 上线验证

发布脚本会检查官网与控制台的 `/healthz`，并通过新 Nginx 访问账户、
认证、代理价格和状态 API。未登录请求返回 401 或不支持 GET 返回 405
都表示路由可达；502、503、504 会中止发布。随后人工检查：

```bash
curl -fsSI https://www.123proxy.cn/
curl -fsSI https://www.123proxy.cn/pricing.html
curl -fsS https://www.123proxy.cn/ip/default/offers
curl -fsSI https://www.123proxy.cn/developers/
curl -fsSI https://console.123proxy.cn/login.html
curl -fsSI https://console.123proxy.cn/app/
curl -fsSI https://console.123proxy.cn/agency-login.html
curl -fsS https://www.123proxy.cn/status-api/v1/summary
```

登录后还应完成一次套餐读取、价格读取和代理提取冒烟测试。

## 7. 回滚

Swarm 会在更新失败时自动回滚，也可以手动执行：

```bash
bash deploy/production/rollback.sh cn
```

深圳环境使用上一个不可变版本标签：

```bash
ROLLBACK_TAG="20260728-03" bash deploy/production/rollback.sh sz
```
