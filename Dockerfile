FROM oven/bun:1.4.4
WORKDIR /app
COPY package.json bun.lock ./
COPY . .
RUN bun install --frozen-lockfile
RUN bunx playwright install --with-deps chromium
RUN bun run build
ENV CUEFRAME_HOME=/data
VOLUME /data
EXPOSE 3000
CMD ["bunx", "next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
