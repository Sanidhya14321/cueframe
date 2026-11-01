# Deploying cueframe

cueframe has two versions. Local is what people install themselves. Hosted is the private server we run for paying customers, which is the business model; see "One private server" below.

## Local, for one person

Install Bun, then `bun install` and `bun run local`. Open `http://127.0.0.1:3000`.
Connect Claude Code from `/connect`.

## Docker, for one person

`docker build -t cueframe .`
`docker run -p 127.0.0.1:3000:3000 -v cueframe-data:/data cueframe`

## One private server

Put HTTPS in front of the container, then set both variables:

`docker run -p 127.0.0.1:3000:3000 -v cueframe-data:/data -e CUEFRAME_PUBLIC_URL=https://studio.example.com -e CUEFRAME_PASSWORD=<long random password> cueframe`

Also set `CUEFRAME_SESSION_TOKEN` to a long random value (`openssl rand -hex 32`). It signs sessions and is the agent Bearer token; without it every restart signs everyone out and breaks agent connections. Rotate it to sign everyone out; one person can sign out from Settings. Passwords should be at least 12 characters. An invalid `CUEFRAME_USERS` stops the server at startup.

With both set, cueframe answers only that host and requires the password. Each instance serves one customer. Give each paying customer their own container and volume.

The container runs as the `bun` user. A volume created by an older root image needs `chown -R 1000:1000` once on its folder.

## Guardrails

`GET /api/health` needs no login and returns 200 while the data folder is writable, or 503. The container's health check uses it. Login allows 10 attempts per client every 15 minutes, and hosted AI requests are limited per client. These limits are saved in the data folder, so they survive restarts. They apply per server, so run one process per customer. Your HTTPS proxy must overwrite `X-Real-IP` with the client address, must allow 256 MB uploads and must not buffer event streams.

## Role demo

Set `CUEFRAME_PUBLIC_URL` and `CUEFRAME_USERS`, a JSON list of `{ "email", "password", "role" }`. Roles: `admin` changes everything, `creator` edits projects but not settings, `viewer` is read-only. Only admins can see the agent connection token. Sign in at `/login`. Set your own `CUEFRAME_USERS` and `CUEFRAME_SESSION_TOKEN` on any real deployment. `/pricing` shows the planned model; payments are not connected.
