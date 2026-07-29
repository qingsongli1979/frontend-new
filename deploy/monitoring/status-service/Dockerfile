FROM node:22-alpine

RUN addgroup -S status && adduser -S -G status status

WORKDIR /app

COPY package.json ./
COPY src ./src

RUN mkdir -p /config /data && chown -R status:status /app /config /data

USER status

ENV NODE_ENV=production \
    CONFIG_FILE=/config/monitors.json \
    PUBLIC_EVENTS_FILE=/config/public-events.json \
    STATE_FILE=/data/status-state.json \
    HTTP_LISTEN=0.0.0.0:8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "src/main.mjs"]

