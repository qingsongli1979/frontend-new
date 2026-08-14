export const contactZh = {
  file: "contact.html",
  route: "/contact.html",
  title: "联系 123Proxy | 技术咨询、免费测试与客户服务",
  description: "联系 123Proxy 技术与企业方案专家或客户服务专员，获取代理产品选型、定制咨询、免费测试、账户订单与开票支持。"
};

export function renderContactMain({ icon }) {
  return `
    <main class="contact-main">
      <section class="contact-hero">
        <div class="container">
          <div class="contact-breadcrumb"><a href="index.html">首页</a><span>/</span><strong>联系我们</strong></div>
          <div class="contact-hero-grid">
            <div class="contact-hero-copy">
              <div class="contact-eyebrow">CONTACT 123PROXY</div>
              <h1>找到正确的人，<br>让问题更快进入处理</h1>
              <p>技术方案、企业项目与基础客户服务由不同团队负责。按你的需求选择联系入口，可以减少转接和重复说明。</p>
              <nav class="contact-hero-actions" aria-label="联系渠道">
                <a class="btn btn-primary" href="#solutions">${icon("messages-square")}技术与企业方案</a>
                <a class="btn" href="#service">${icon("headset")}客户服务</a>
              </nav>
            </div>
            <aside class="contact-router" aria-label="联系分流">
              <div class="contact-router-head"><span>CONTACT ROUTING</span><em>123PROXY</em></div>
              <a href="#solutions">
                <span>01</span>
                <div><strong>技术与企业方案</strong><small>技术支持 · 专家咨询 · 定制项目</small></div>
                ${icon("arrow-down-right")}
              </a>
              <a href="#service">
                <span>02</span>
                <div><strong>客户服务</strong><small>免费测试 · 账户订单 · 充值开票</small></div>
                ${icon("arrow-down-right")}
              </a>
              <div class="contact-router-foot"><span>正式商务往来</span><a href="#email">sales@123proxy.cn${icon("arrow-right")}</a></div>
            </aside>
          </div>
        </div>
      </section>

      <nav class="contact-route-strip" aria-label="快速选择">
        <div class="container">
          <a href="#solutions">
            <span class="contact-route-index">01</span>
            <span class="contact-route-icon">${icon("waypoints")}</span>
            <span><strong>需要技术判断或企业方案</strong><small>代理选型、爬虫架构、定制代理池与大客户技术支持</small></span>
            ${icon("arrow-right")}
          </a>
          <a href="#service">
            <span class="contact-route-index">02</span>
            <span class="contact-route-icon">${icon("badge-help")}</span>
            <span><strong>需要办理测试或账户服务</strong><small>免费测试、套餐订单、充值、发票与账户基础问题</small></span>
            ${icon("arrow-right")}
          </a>
        </div>
      </nav>

      <section class="contact-channel contact-channel-solutions" id="solutions">
        <div class="container contact-channel-grid">
          <div class="contact-channel-copy">
            <div class="contact-section-label"><span>01</span> TECHNICAL &amp; ENTERPRISE</div>
            <h2>技术与企业方案</h2>
            <p class="contact-channel-lead">适合需要技术判断、资源规划或项目协同的咨询，由技术专家与企业项目团队承接。</p>
            <div class="contact-topic-grid">
              <div>${icon("network")}<span><strong>代理产品选型</strong><small>地区、并发、带宽、SESSION 与计费方式</small></span></div>
              <div>${icon("gauge")}<span><strong>高带宽与 AI 数据任务</strong><small>大规模视频、图片、代码和文本爬取</small></span></div>
              <div>${icon("git-branch")}<span><strong>定制代理池与企业项目</strong><small>目标站点、资源池、PoC 与交付边界</small></span></div>
              <div>${icon("life-buoy")}<span><strong>大客户技术支持</strong><small>已签约企业项目的技术问题与服务升级</small></span></div>
            </div>
            <div class="contact-prepare">
              <span>联系前建议准备</span>
              <p>目标网站或数据类型、使用地区、预计并发或数据规模、当前技术栈，以及可复现的错误信息。请勿发送密码、Token 或完整代理凭据。</p>
            </div>
          </div>
          <aside class="contact-qr-panel">
            <div class="contact-channel-mark">${icon("message-circle-more")}<span>微信</span><em>专家直联</em></div>
            <a class="contact-qr-image" href="assets/contact-solutions-wechat.png" target="_blank" rel="noreferrer" aria-label="查看技术与企业方案微信二维码原图" data-google-ads-conversion="consultation" data-google-ads-channel="solutions_wechat">
              <img src="assets/contact-solutions-wechat.png" alt="123Proxy 技术与企业方案微信二维码" width="182" height="157">
            </a>
            <h3>添加技术与企业方案微信</h3>
            <p>扫码添加后，请备注“公司或项目名称 + 咨询方向”。</p>
            <small>电脑端可扫码，手机端可点击二维码后长按识别。</small>
          </aside>
        </div>
      </section>

      <section class="contact-channel contact-channel-service" id="service">
        <div class="container contact-channel-grid is-reversed">
          <div class="contact-channel-copy">
            <div class="contact-section-label"><span>02</span> CUSTOMER SERVICE</div>
            <h2>客户服务</h2>
            <p class="contact-channel-lead">适合明确的账户与业务办理事项，由 123Proxy 客服专员协助处理。</p>
            <div class="contact-topic-grid">
              <div>${icon("flask-conical")}<span><strong>领取免费测试</strong><small>确认测试产品、领取方式与基础接入信息</small></span></div>
              <div>${icon("user-round-cog")}<span><strong>账户与登录</strong><small>注册、账户识别及无法自行完成的基础操作</small></span></div>
              <div>${icon("receipt-text")}<span><strong>订单与套餐</strong><small>购买记录、套餐状态与标准业务咨询</small></span></div>
              <div>${icon("file-check-2")}<span><strong>充值与开票</strong><small>对公付款、充值记录、发票申请与进度</small></span></div>
            </div>
            <div class="contact-prepare">
              <span>联系前建议准备</span>
              <p>注册手机号或账户名、订单号或充值单号，以及需要办理的具体事项。开票问题可同时准备发票抬头和相关订单信息。</p>
            </div>
          </div>
          <aside class="contact-qr-panel">
            <div class="contact-channel-mark">${icon("badge-check")}<span>企业微信</span><em>客服专员</em></div>
            <a class="contact-qr-image" href="assets/contact-service-wecom.png" target="_blank" rel="noreferrer" aria-label="查看 123Proxy 客服企业微信二维码原图" data-google-ads-conversion="trial" data-google-ads-requires-intent="trial" data-google-ads-channel="trial_wecom">
              <img src="assets/contact-service-wecom.png" alt="123Proxy 客服企业微信二维码" width="205" height="184">
            </a>
            <h3>添加客服企业微信</h3>
            <p>扫码添加后，请备注“账户名或手机号 + 办理事项”。</p>
            <small>客服不会索要登录密码、API Token 或完整代理密码。</small>
          </aside>
        </div>
      </section>

      <section class="contact-email" id="email">
        <div class="container contact-email-inner">
          <div>
            <div class="contact-section-label"><span>03</span> FORMAL CORRESPONDENCE</div>
            <h2>正式商务往来使用邮箱</h2>
            <p>合同、采购流程、正式报价材料、盖章文件或较长附件，可发送至对外邮箱。需要即时沟通时，建议优先选择上方对应微信。</p>
          </div>
          <div class="contact-email-action">
            <span>PUBLIC EMAIL</span>
            <strong>sales@123proxy.cn</strong>
            <a class="btn btn-on-dark" href="mailto:sales@123proxy.cn" data-google-ads-conversion="consultation" data-google-ads-channel="sales_email">${icon("mail")}发送邮件</a>
          </div>
        </div>
      </section>

      <section class="contact-guidance">
        <div class="container">
          <div class="contact-guidance-head"><span>不确定该联系谁？</span><p>按当前最需要解决的问题选择即可，我们会在必要时协同内部团队。</p></div>
          <div class="contact-guidance-grid">
            <a href="#solutions"><span>产品是否适合我的任务？</span><strong>技术与企业方案${icon("arrow-right")}</strong></a>
            <a href="#solutions"><span>需要定制资源或企业项目评估</span><strong>技术与企业方案${icon("arrow-right")}</strong></a>
            <a href="#service"><span>需要领取测试、查询订单或开票</span><strong>客户服务${icon("arrow-right")}</strong></a>
            <a href="#email"><span>需要发送合同、采购或正式材料</span><strong>对外邮箱${icon("arrow-right")}</strong></a>
          </div>
        </div>
      </section>
    </main>`;
}
