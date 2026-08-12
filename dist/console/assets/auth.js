/* 123Proxy console authentication */
(function () {
  "use strict";

  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
  const IS_LOCAL_PREVIEW = LOCAL_HOSTS.has(window.location.hostname);
  const API_BASE = window.location.origin;
  const TOKEN_KEY = "token_key";
  const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/;
  const PHONE_PATTERN = /^1\d{10}$/;
  const page = document.body.dataset.authPage;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function setBusy(form, busy, label) {
    const submit = $(".auth-submit", form);
    if (!submit) return;
    submit.disabled = busy;
    submit.classList.toggle("is-loading", busy);
    document.body.classList.toggle("is-busy", busy);
    const text = $(".auth-submit-text", submit);
    if (text && label) text.textContent = label;
  }

  function setMessage(form, type, message) {
    const box = $(".auth-form-message", form);
    if (!box) return;
    box.className = `auth-form-message is-visible is-${type}`;
    box.innerHTML = `<i data-lucide="${type === "success" ? "circle-check" : "circle-alert"}" aria-hidden="true"></i><span>${escapeHtml(message)}</span>`;
    refreshIcons();
  }

  function clearMessage(form) {
    const box = $(".auth-form-message", form);
    if (!box) return;
    box.className = "auth-form-message";
    box.textContent = "";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setFieldError(input, message) {
    const field = input.closest(".auth-field");
    const help = $(".auth-help", field);
    field.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (help) {
      help.textContent = message || help.dataset.default || "";
      help.classList.toggle("is-error", Boolean(message));
    }
  }

  function parseResponseMessage(payload, fallback) {
    if (!payload) return fallback;
    return payload.message
      || payload.error_description
      || payload.error?.message
      || payload.error
      || fallback;
  }

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Accept-Language": "zh-CN,zh;q=0.5",
        ...(options.headers || {})
      }
    });
    const contentType = response.headers.get("content-type") || "";
    const raw = await response.text();
    let payload = raw;
    if (contentType.includes("json") || raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
      try {
        payload = JSON.parse(raw);
      } catch (error) {
        payload = raw;
      }
    }
    if (!response.ok) {
      const apiError = new Error(parseResponseMessage(payload, "请求未完成，请稍后重试。"));
      apiError.status = response.status;
      apiError.payload = payload;
      throw apiError;
    }
    return payload;
  }

  function storedAccessToken() {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return "";
    try {
      const token = JSON.parse(raw);
      return token?.access_token || token?.token || "";
    } catch (error) {
      return raw;
    }
  }

  function consoleDestination() {
    const requestedNext = new URLSearchParams(location.search).get("next");
    if (requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")) {
      return `${API_BASE}${requestedNext}`;
    }
    return `${API_BASE}${IS_LOCAL_PREVIEW ? "/console/app/" : "/app/"}`;
  }

  function enterConsole() {
    location.replace(consoleDestination());
  }

  function initPasswordToggles() {
    $$(".auth-password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        button.setAttribute("aria-label", reveal ? "隐藏密码" : "显示密码");
        button.innerHTML = `<i data-lucide="${reveal ? "eye-off" : "eye"}" aria-hidden="true"></i>`;
        refreshIcons();
      });
    });
  }

  function validatePhone(input) {
    const valid = PHONE_PATTERN.test(input.value.trim());
    setFieldError(input, valid ? "" : "请输入 11 位中国大陆手机号码。");
    return valid;
  }

  function validatePassword(input) {
    const valid = PASSWORD_PATTERN.test(input.value);
    setFieldError(input, valid ? "" : "密码需为 8-20 个字符，并至少包含大写字母、小写字母和数字。");
    return valid;
  }

  function validateRequired(input, message) {
    const valid = Boolean(input.value.trim());
    setFieldError(input, valid ? "" : message);
    return valid;
  }

  function startCountdown(button, seconds = 60) {
    let remaining = seconds;
    button.disabled = true;
    button.textContent = `${remaining}s 后重发`;
    const timer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(timer);
        button.disabled = false;
        button.textContent = "重新发送";
        return;
      }
      button.textContent = `${remaining}s 后重发`;
    }, 1000);
  }

  async function initLogin() {
    const form = $("#loginForm");
    if (!form) return;
    const account = $("#loginAccount");
    const password = $("#loginPassword");
    const primaryStep = $("#loginPrimaryStep");
    const mfaStep = $("#loginMfaStep");
    const mfaForm = $("#mfaForm");
    const mfaCode = $("#mfaCode");
    const resend = $("#mfaResend");

    async function restoreExistingSession() {
      const token = storedAccessToken();
      if (!token) return false;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      setBusy(form, true, "正在检查登录状态");
      try {
        await request("/accsrv/information", {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` }
        });
        enterConsole();
        return true;
      } catch (error) {
        if ([401, 403].includes(error.status)) {
          localStorage.removeItem(TOKEN_KEY);
        }
        return false;
      } finally {
        window.clearTimeout(timeout);
        setBusy(form, false, "登录控制台");
      }
    }

    if (await restoreExistingSession()) return;

    async function sendMfa() {
      await request(`/accsrv/0xagency/multifactorauth/smsotp/${encodeURIComponent(account.value.trim())}`);
      startCountdown(resend);
    }

    async function submitLogin() {
      const body = new URLSearchParams({
        scope: "ui",
        username: account.value.trim(),
        password: password.value,
        grant_type: "password"
      });
      const token = await request("/ssosrv/oauth/token", {
        method: "POST",
        headers: {
          "Authorization": "Basic YnJvd3Nlcjo=",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      enterConsole();
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessage(form);
      const accountValid = validateRequired(account, "请输入用户名、手机号或邮箱。");
      const passwordValid = validateRequired(password, "请输入登录密码。");
      if (!(accountValid && passwordValid)) return;
      setBusy(form, true, "正在验证");
      try {
        await submitLogin();
      } catch (error) {
        const code = String(error.payload?.errorCode || "");
        if (code === "500108" || code === "500109") {
          primaryStep.classList.remove("is-active");
          mfaStep.classList.add("is-active");
          $("#mfaAccount").textContent = account.value.trim();
          try {
            await sendMfa();
          } catch (mfaError) {
            setMessage(mfaForm, "error", mfaError.message);
          }
        } else {
          setMessage(form, "error", error.message);
        }
      } finally {
        setBusy(form, false, "登录控制台");
      }
    });

    mfaForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessage(mfaForm);
      const code = mfaCode.value.replace(/\D/g, "");
      if (code.length !== 6) {
        setFieldError(mfaCode, "请输入 6 位短信验证码。");
        return;
      }
      setBusy(mfaForm, true, "正在验证");
      try {
        const result = await request(`/accsrv/multifactorauth/checkotp?otp=${encodeURIComponent(code)}&username=${encodeURIComponent(account.value.trim())}`);
        const passed = result === true || result?.data === true || result?.res?.data === true;
        if (!passed) throw new Error("验证码错误，请重新输入。");
        await submitLogin();
      } catch (error) {
        setMessage(mfaForm, "error", error.message);
      } finally {
        setBusy(mfaForm, false, "验证并登录");
      }
    });

    resend.addEventListener("click", async () => {
      if (resend.disabled) return;
      clearMessage(mfaForm);
      try {
        await sendMfa();
      } catch (error) {
        setMessage(mfaForm, "error", error.message);
      }
    });

    $("#mfaBack").addEventListener("click", () => {
      mfaStep.classList.remove("is-active");
      primaryStep.classList.add("is-active");
      mfaCode.value = "";
      clearMessage(mfaForm);
    });
  }

  function initRegister() {
    const form = $("#registerForm");
    if (!form) return;
    const phone = $("#registerPhone");
    const password = $("#registerPassword");
    const agreement = $("#registerAgreement");
    const success = $("#registerSuccess");

    phone.addEventListener("blur", () => validatePhone(phone));
    password.addEventListener("blur", () => validatePassword(password));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessage(form);
      const phoneValid = validatePhone(phone);
      const passwordValid = validatePassword(password);
      if (!agreement.checked) {
        setMessage(form, "error", "请先阅读并同意《123Proxy 用户服务协议》。");
        return;
      }
      if (!(phoneValid && passwordValid)) return;
      setBusy(form, true, "正在创建");
      const query = new URLSearchParams(location.search);
      const payload = {
        username: `u${phone.value.trim()}`,
        phone: phone.value.trim(),
        password: password.value,
        otp: "111111",
        source: query.get("source") || query.get("ht") || "",
        referer: query.get("referer") || query.get("hp") || "",
        agencyID: query.get("uuid") || query.get("agencyID") || query.get("h") || ""
      };
      try {
        await request("/accsrv/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        form.hidden = true;
        success.classList.add("is-visible");
        window.ProxyGoogleAds?.registration({
          method: "phone",
          source: payload.source || undefined,
          agency_id: payload.agencyID || undefined,
          dedupe_key: payload.phone,
          dedupe_scope: "local"
        });
      } catch (error) {
        setMessage(form, "error", error.message);
      } finally {
        setBusy(form, false, "创建账户");
      }
    });
  }

  function initForgotPassword() {
    const form = $("#forgotForm");
    if (!form) return;
    const phone = $("#forgotPhone");
    const otp = $("#forgotOtp");
    const password = $("#forgotPassword");
    const confirm = $("#forgotConfirm");
    const sendButton = $("#forgotSendOtp");
    const success = $("#forgotSuccess");

    phone.addEventListener("blur", () => validatePhone(phone));
    password.addEventListener("blur", () => validatePassword(password));
    confirm.addEventListener("blur", () => {
      setFieldError(confirm, confirm.value === password.value ? "" : "两次输入的密码不一致。");
    });

    sendButton.addEventListener("click", async () => {
      clearMessage(form);
      if (!validatePhone(phone)) return;
      sendButton.disabled = true;
      sendButton.textContent = "正在发送";
      try {
        await request(`/accsrv/sms-service/otp/${encodeURIComponent(phone.value.trim())}`);
        setMessage(form, "success", "验证码已发送，请查看手机短信。");
        startCountdown(sendButton);
      } catch (error) {
        sendButton.disabled = false;
        sendButton.textContent = "获取验证码";
        setMessage(form, "error", error.message);
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessage(form);
      const phoneValid = validatePhone(phone);
      const otpValid = /^\d{6}$/.test(otp.value.trim());
      setFieldError(otp, otpValid ? "" : "请输入 6 位短信验证码。");
      const passwordValid = validatePassword(password);
      const confirmValid = confirm.value === password.value && Boolean(confirm.value);
      setFieldError(confirm, confirmValid ? "" : "两次输入的密码不一致。");
      if (!(phoneValid && otpValid && passwordValid && confirmValid)) return;
      setBusy(form, true, "正在重置");
      try {
        await request("/accsrv/resetwithotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone.value.trim(),
            passwd: password.value,
            otp: otp.value.trim(),
            parent: ""
          })
        });
        form.hidden = true;
        success.classList.add("is-visible");
      } catch (error) {
        setMessage(form, "error", error.message);
      } finally {
        setBusy(form, false, "确认重置密码");
      }
    });
  }

  initPasswordToggles();
  if (page === "login") initLogin();
  if (page === "register") initRegister();
  if (page === "forgot-password") initForgotPassword();
  refreshIcons();
})();
