# 123Proxy 自动 TLS 证书

这套流程使用 Let's Encrypt、acme.sh 和阿里云 DNS API，通过 DNS-01 为以下域名签发并自动续期：

```text
123proxy.cn
www.123proxy.cn
console.123proxy.cn
```

证书控制机保存阿里云 RAM 密钥和 ACME 账户。前端节点只接收证书文件，不保存 DNS 密钥。建议把控制机放在主生产环境的 Swarm 管理节点，并将每个可能承载前端容器的其他节点配置到 `CERT_REMOTE_TARGETS`。

## 1. 创建受限阿里云 RAM 用户

为证书签发创建独立 RAM 用户，不要使用阿里云主账号 AccessKey。自定义策略只允许操作 `123proxy.cn` 的 DNS 记录：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "alidns:DescribeDomainRecords",
        "alidns:AddDomainRecord",
        "alidns:DeleteDomainRecord"
      ],
      "Resource": "acs:alidns:*:<ALIYUN_ACCOUNT_ID>:domain/123proxy.cn"
    }
  ]
}
```

将 `<ALIYUN_ACCOUNT_ID>` 替换为阿里云账号 ID。acme.sh 的 `dns_ali`
插件只调用 `DescribeDomainRecords`、`AddDomainRecord` 和
`DeleteDomainRecord`，这三个 API 都支持按域名资源授权。

## 2. 安装 acme.sh

在证书控制机执行：

```bash
sudo apk add --no-cache bash curl git openssl openssh-client
# Ubuntu / Debian 使用：
# sudo apt-get update && sudo apt-get install -y bash curl git openssl openssh-client

git clone https://github.com/acmesh-official/acme.sh.git /tmp/acme.sh
cd /tmp/acme.sh
sudo ./acme.sh --install \
  --home /var/lib/acme-123proxy \
  --config-home /var/lib/acme-123proxy \
  --accountemail sales@123proxy.cn \
  --nocron
sudo chmod 700 /var/lib/acme-123proxy
```

这里禁用 acme.sh 自带 cron，由本项目的 systemd timer 统一调度，避免同一套证书存在两个续期任务。

## 3. 安装自动化脚本

在项目根目录执行：

```bash
sudo install -d -m 755 /opt/123proxy-certificates
sudo install -d -m 700 /var/lib/123proxy-certificates/staging
sudo install -d -m 700 /var/lib/123proxy-certificates/state
sudo install -d -m 700 /data/cert
sudo install -m 755 deploy/certificates/validate-certificates.sh /opt/123proxy-certificates/
sudo install -m 755 deploy/certificates/deploy-certificates.sh /opt/123proxy-certificates/
sudo install -m 755 deploy/certificates/renew-certificates.sh /opt/123proxy-certificates/

sudo install -d -m 700 /etc/123proxy
sudo install -m 600 deploy/certificates/certificates.env.example /etc/123proxy/certificates.env
sudo install -m 644 deploy/certificates/systemd/123proxy-certificates.service /etc/systemd/system/
sudo install -m 644 deploy/certificates/systemd/123proxy-certificates.timer /etc/systemd/system/
```

编辑 `/etc/123proxy/certificates.env`：

- `Ali_Key`、`Ali_Secret`：受限 RAM 用户的 AccessKey。
- `ACME_EMAIL`：接收证书账户通知的有效邮箱。
- `INSTALL_LOCAL=true`：控制机本身也是前端节点时保留。
- `CERT_REMOTE_TARGETS`：空格分隔的其他 Swarm 前端节点和深圳节点。
- `SSH_IDENTITY_FILE`：仅用于证书分发的 SSH 私钥。
- `SSH_KNOWN_HOSTS_FILE`：预先核验过指纹的目标主机列表。

不要把真实的 `certificates.env`、私钥或证书提交到 Git。

## 4. 配置节点分发

将分发公钥加入每个远端前端节点的 `authorized_keys`。在控制机固定目标主机指纹：

```bash
sudo ssh-keyscan -H swarm-node-2 shenzhen-frontend \
  | sudo tee /etc/123proxy/ssh_known_hosts >/dev/null
sudo chmod 600 /etc/123proxy/cert-deploy-key
sudo chmod 644 /etc/123proxy/ssh_known_hosts
```

远端 SSH 用户需要能够执行：

```text
sudo install
sudo bash
docker ps
docker kill --signal HUP
```

生产 Swarm 使用两个副本且每个节点最多一个副本，因此所有可调度节点都必须有 `/data/cert`。遗漏节点会导致任务调度到该节点后无法启动 HTTPS。

## 5. 首次签发

先执行一次前台任务并查看完整日志：

```bash
sudo systemctl daemon-reload
sudo systemctl start 123proxy-certificates.service
sudo journalctl -u 123proxy-certificates.service -n 200 --no-pager
```

成功后会生成并分发：

```text
/data/cert/123proxy.cn.pem
/data/cert/123proxy.cn.key
/data/cert/console.123proxy.cn.pem
/data/cert/console.123proxy.cn.key
```

`.pem` 是包含站点证书和中间证书的 fullchain。脚本会校验证书可解析、SAN 域名、剩余有效期、私钥配对和中间证书；任何一项失败都不会覆盖生产证书。

## 6. 启用自动续期

```bash
sudo systemctl enable --now 123proxy-certificates.timer
systemctl list-timers 123proxy-certificates.timer
```

timer 每天检查一次，并带最多两小时随机延迟。证书内容变化后才会分发；分发完成后向前端 Nginx 容器发送 `HUP`，不会停止容器。

手动强制执行完整分发：

```bash
sudo systemctl set-environment FORCE_CERT_DEPLOY=true
sudo systemctl start 123proxy-certificates.service
sudo systemctl unset-environment FORCE_CERT_DEPLOY
```

## 7. 验证线上证书

```bash
sudo /opt/123proxy-certificates/validate-certificates.sh /data/cert 14

echo | openssl s_client -connect www.123proxy.cn:443 -servername www.123proxy.cn 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

echo | openssl s_client -connect console.123proxy.cn:443 -servername console.123proxy.cn 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

同时在 Uptime Kuma 为 `https://www.123proxy.cn/healthz` 和 `https://console.123proxy.cn/healthz` 建立 HTTPS 监控并启用证书到期提醒。自动续期负责更新，外部监控负责发现 DNS、分发或 Nginx 重载链路的异常。
