FROM oven/bun:1.4.4
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
RUN bunx playwright install --with-deps chromium \
  && apt-get install -y --no-install-recommends ca-certificates g++ git make \
  && rm -rf /var/lib/apt/lists/*
COPY . .
ARG HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN=
ARG CUEFRAME_PUBLIC_URL=
RUN bun run build
ENV NODE_ENV=production CUEFRAME_HOME=/data PORT=3000
RUN mkdir -p /data /app/.next/cache /app/node_modules/.cache /app/node_modules/.remotion /app/node_modules/@huggingface/transformers/.cache \
  && chown -R bun:bun /data /app/.next/cache /app/node_modules/.cache /app/node_modules/.remotion /app/node_modules/@huggingface/transformers/.cache
USER bun
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 CMD ["bun", "-e", "fetch(`http://127.0.0.1:${process.env.PORT}/api/health`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["sh", "-c", "bun run local:configure && exec bunx next start --hostname 0.0.0.0 --port \"$PORT\""]
