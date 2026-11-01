FROM oven/bun:1.4.4
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN bunx playwright install --with-deps chromium
RUN bun run build
ENV CUEFRAME_HOME=/data
RUN mkdir -p /data && chown -R bun:bun /data /app /ms-playwright
USER bun
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD ["bun", "-e", "fetch('http://127.0.0.1:3000/api/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["bunx", "next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
