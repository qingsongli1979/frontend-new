# Deployment

The image serves two independent document roots selected by the request host:

```text
www.123proxy.cn      -> /var/www/website
console.123proxy.cn  -> /var/www/console
```

TLS certificates are intentionally not copied into the image. Terminate HTTPS
at the ingress, load balancer, Cloudflare origin, or host-level reverse proxy.

## Build static artifacts

```bash
npm run build:deploy
```

The command creates:

```text
dist/www/
dist/console/
```

## Build the local HTTP image

```bash
docker build -t 123proxy-web:local .
```

The console configuration keeps the new authentication pages local while
forwarding the existing React application and unmigrated routes to
`LEGACY_CONSOLE_UPSTREAM`.

Runtime upstream variables:

```text
ACCOUNT_SERVICE_UPSTREAM
AUTH_SERVICE_UPSTREAM
IP_SERVICE_UPSTREAM
STATUS_API_UPSTREAM
LEGACY_CONSOLE_UPSTREAM
WORDPRESS_UPSTREAM
```

The monitoring stack may run on a separate server reachable through the
private network. Set `STATUS_API_UPSTREAM` to its private HTTP origin, normally
`http://192.168.85.105:8080`. Website Nginx fetches `GET /v1/summary` from
that origin and publishes it to browsers as the same-origin endpoint
`https://www.123proxy.cn/status-api/v1/summary`.

The deployable Uptime Kuma and real-proxy probe stack lives in
`deploy/monitoring/`. It checks proxy authentication and egress traffic,
aggregates product and regional gateway health, pushes the results into Kuma,
and implements the `/v1/summary` contract used by the public status page.

## Registry build script

`build_web_cn.sh` builds once and can tag the same image for one or more
repositories:

```bash
IMAGE_REPOSITORIES=123proxy/123proxy-web,123proxy/123proxy-web-sz \
PUSH_IMAGE=true \
DOCKER_USER=... \
DOCKER_PASSWORD=... \
./build_web_cn.sh
```

Registry credentials must be supplied through the environment or CI secrets.

## Production images

Production keeps the two established registry names because the runtime
topology differs:

```text
123proxy/intelligroup-frontend
123proxy/intelligroup-frontend-sz
```

Build and push both immutable images with:

```bash
RELEASE_TAG=20260729-01 PUSH_IMAGE=true ./build_web_cn.sh
```

The primary image resolves account, auth, IP and WordPress services through
the shared Swarm overlay network. The Shenzhen image defaults those upstreams
to `47.254.19.92` and retains the legacy `/ip/` rate limit.

The full Swarm, Compose, TLS mount, verification and rollback procedure is in
`deploy/production/README.md`.

## Post-deploy indexing

IndexNow is optional and does not change page rendering. Supply a valid key
while building so the public verification file is included at the website
root:

```bash
INDEXNOW_KEY=your-public-indexnow-key ./build_web_cn.sh
```

After the new image is live at `www.123proxy.cn`, submit the current sitemap:

```bash
INDEXNOW_KEY=your-public-indexnow-key npm run indexnow
```

The submission command first verifies
`https://www.123proxy.cn/<key>.txt`. It stops without notifying search engines
when the deployed verification file is missing or does not match.
