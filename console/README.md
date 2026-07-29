# 123Proxy Console

This directory owns all source files for `https://console.123proxy.cn`.

## Source layout

```text
console/
├── login.html
├── register.html
├── forgot-password.html
├── aggrement.html
├── agency-login.html
├── agency-manager.html
├── assets/       # Authentication, agency and shared console brand assets
├── app/          # Authenticated console application
└── previews/     # Design review screenshots; never part of the runtime package
```

## Deployment mapping

The current deploy package publishes the authentication surface as the console
host root:

```text
console/login.html            -> https://console.123proxy.cn/login.html
console/register.html         -> https://console.123proxy.cn/register.html
console/forgot-password.html  -> https://console.123proxy.cn/forgot-password.html
console/agency-login.html     -> https://console.123proxy.cn/agency-login.html
console/agency-manager.html   -> https://console.123proxy.cn/agency-manager.html
console/assets/*              -> https://console.123proxy.cn/assets/*
console/app/*                 -> https://console.123proxy.cn/app/*
```

`console/app/` is kept inside the console project so the authenticated
application is no longer maintained in a separate design tree. The overview,
proxy product and resource-management pages use the existing account, package,
usage and proxy-user APIs. Resource management includes all package history,
real-time package balances, cumulative proxy-user usage, and confirmed
create/update/delete operations for proxy authentication users.

The agency partner surface preserves the legacy backend contract while using
the new console shell. Legacy `/apiv1/managements/login-page` and
`/apiv1/agencyconsole/agency-manager` routes are redirected to these static
pages by the production Nginx configuration.

For authenticated local verification, run:

```text
npm run serve:console
```

This opt-in development server proxies only `/ssosrv/`, `/accsrv/` and `/ip/`
to `console.123proxy.cn`. It does not log credentials or access tokens.

Do not publish it below `/console/` on the production host. Authentication API
calls intentionally stay on `console.123proxy.cn`; the public website only
navigates users to this origin.

The canonical user agreement remains on the public website:
`https://www.123proxy.cn/agreement.html`.
