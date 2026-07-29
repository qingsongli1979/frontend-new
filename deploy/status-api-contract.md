# 123Proxy Status API Contract

The public status page reads:

```text
GET /v1/summary
```

Website Nginx reads it from the monitoring service over the private network
and exposes it at `/status-api/v1/summary`, so the browser keeps using a
same-origin request. The response must not contain monitor credentials, proxy
usernames, internal IP addresses, or private incident notes.

## Response

```json
{
  "generatedAt": "2026-07-29T02:10:00.000Z",
  "overallStatus": "operational",
  "components": [
    {
      "id": "proxy-tunnel",
      "status": "operational",
      "latencyMs": 86,
      "uptime90d": 99.995,
      "message": "最近检测正常",
      "history90d": ["operational"]
    }
  ],
  "incidents": [],
  "maintenance": []
}
```

Supported component IDs:

```text
proxy-tunnel
proxy-residential
proxy-unlimited
gateway-us
gateway-eu
gateway-asia
website
console
api
```

Supported status values:

```text
operational
degraded
partial_outage
major_outage
maintenance
unknown
```

`history90d` accepts up to 90 daily status values. Missing components and
missing history are rendered as `unknown`; the frontend never assumes that
an absent check is healthy.
