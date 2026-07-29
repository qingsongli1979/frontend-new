# 123Proxy 新版网站信息架构

版本：V1.0  
日期：2026-07-26

## 1. 顶部主菜单

1. 代理产品
2. AI 数据方案
3. 全球网络
4. 开发者
5. 企业服务
6. 价格

导航右侧固定显示：

- 登录
- 免费测试 / 申请测试

顶部服务栏显示：

- 服务状态
- 开发文档
- `sales@123proxy.cn`

## 2. 代理产品

| 页面 | 建议正式路径 | 当前承接内容 |
|---|---|---|
| 代理产品总览 | `/products/` | 新版首页产品区与旧产品总览文档 |
| 高带宽代理 IP | `/products/high-bandwidth-proxy/` | 新版高带宽产品页 |
| 隧道代理 | `/products/scraping-rotating-proxy/` | 双池：约 95% 住宅 + 约 5% 数据中心的爬虫混合池；100% 住宅且支持 SESSION 的纯住宅池；全球随机 |
| 隧道住宅代理 | `/products/residential-proxy/` | 8000万+ 住宅 IP、190+ 国家和地区、指定国家或地区与 SESSION、仅按流量购买 |
| 不限量动态住宅代理 | `/products/unlimited-residential-proxy/` | 新确认口径：每端口不限流量并发、3–30 分钟轮转、套餐级地区 |
| 长效静态代理 | `/products/static-datacenter-proxy/` | 旧站 `agent-static.html` |
| 长效静态住宅代理 | `/products/static-residential-proxy/` | 旧站 `zhuzhai-static.html` |
| 产品对比与选型 | `/products/compare/` | 旧产品总览文档中的选型逻辑 |

## 3. AI 数据方案

| 页面 | 当前静态路径 | 后续目录化路径 | 核心推荐产品 |
|---|---|---|---|
| AI 数据方案总览 | `/ai-data.html` | `/solutions/ai-data/` | 高带宽代理 IP |
| 视频与多模态数据 | `/ai-video-proxy.html` | `/solutions/video-data/` | 高带宽代理 IP |
| 大规模图片数据 | `/ai-image-proxy.html` | `/solutions/image-data/` | 高带宽代理 IP |
| 公开代码数据 | `/ai-github-proxy.html` | `/solutions/code-data/` | 高带宽代理 IP |
| 全网文本与文档 | `/ai-text-proxy.html` | `/solutions/web-text-data/` | 高带宽代理 IP / 住宅代理 |
| YouTube 采集 API | `/ai-youtube-api.html` | `/products/youtube-data-api/` | 独立 API 产品：元数据、字幕、评论、异步任务与对象存储交付 |

AI 数据页面按任务场景组织，不重复创建同名代理产品。代理基础设施方案的主 CTA 汇聚到高带宽代理 IP 或企业方案评估；YouTube 采集 API 作为独立 API 产品，CTA 汇聚到 API Key 与测试配额申请。

## 4. 全球网络

| 页面 | 建议正式路径 |
|---|---|
| 全球代理网络 | `/network/` |
| 国家与地区覆盖 | `/network/locations/` |
| 服务状态 | `/status/` |

全球网络页面包含代理资源、国家覆盖、出口类型、协议、认证方式、可用性目标和技术支持。

## 5. 开发者

| 页面 | 建议正式路径 |
|---|---|
| 开发者中心 | `/developers/` |
| 5 分钟快速接入 | `/developers/quickstart/` |
| 网关、认证与白名单 | `/developers/authentication/` |
| IP 轮换与固定会话 | `/developers/sessions/` |
| API 与代理提取 | `/developers/api/` |
| 代码示例 | `/developers/examples/` |
| 各产品使用指南 | `/developers/guides/` |
| 错误码与故障排查 | `/developers/troubleshooting/` |

旧文档中的按流量、IP 池、动态住宅、静态住宅和静态 IP 套餐指南迁入各产品使用指南。

## 6. 企业服务

| 页面 | 当前静态路径 | 建议正式路径 |
|---|---|---|
| 企业服务总览 | `/enterprise.html` | `/enterprise/` |
| 定制代理池 | `/custom-proxy-pool.html` | `/enterprise/custom-proxy-pool/` |
| 数据采集服务 | `/data-scraping-service.html` | `/enterprise/data-scraping/` |

企业支持与 SLA、合规使用说明和联系销售合并到企业服务总览，不再建立独立页面。自动化页面不进入新版网站，旧站自动化和脚本定制内容不在主导航展示。

## 7. 价格

统一价格页路径为 `/pricing/`，包含：

- 五种标准代理产品对比
- 按流量、按并发线程、按端口、按 IP 的计费方式说明
- 高带宽代理项目制询价
- 标准产品进入控制台购买
- 测试流量、套餐升级与退款说明

## 8. 页脚

- 关于我们
- 博客与代理知识库
- 用户指南
- 合作伙伴
- 联系我们
- 隐私政策
- 服务条款
- 可接受使用政策
- 合规说明
- ICP 备案信息

## 9. 迁移原则

- 新页面完成前，菜单继续链接可用的旧页面或控制台
- 新页面上线后保持旧 URL 301 重定向到新路径
- 产品按技术类型组织，AI 数据按任务场景组织
- 自动化采集不作为新版 123Proxy 的核心产品方向
- 不创建无实际交付能力或无明确负责人维护的页面
