# Deploying ClipKit

## Local, for one person

Install Bun, then `bun install` and `bun run local`. Open `http://127.0.0.1:3000`.
Connect Claude Code from `/connect`.

## Docker, for one person

`docker build -t clipkit .`
`docker run -p 127.0.0.1:3000:3000 -v clipkit-data:/data clipkit`

## One private server

Put HTTPS in front of the container, then set both variables:

`docker run -p 127.0.0.1:3000:3000 -v clipkit-data:/data -e CLIPKIT_PUBLIC_URL=https://studio.example.com -e CLIPKIT_PASSWORD=<long random password> clipkit`

With both set, ClipKit answers only that host and requires the password. Each instance serves one customer. Give each paying customer their own container and volume.

## Role demo

Set `CLIPKIT_PUBLIC_URL` and `CLIPKIT_USERS`, a JSON list of `{ "email", "password", "role" }`. Roles: `admin` changes everything, `creator` edits projects but not settings, `viewer` is read-only. Sign in at `/login`. `/pricing` shows the planned model; payments are not connected.
