# Deploying cueframe

## Local, for one person

Install Bun, then `bun install` and `bun run local`. Open `http://127.0.0.1:3000`.
Connect Claude Code from `/connect`.

## Docker, for one person

`docker build -t cueframe .`
`docker run -p 127.0.0.1:3000:3000 -v cueframe-data:/data cueframe`

## One private server

Put HTTPS in front of the container, then set both variables:

`docker run -p 127.0.0.1:3000:3000 -v cueframe-data:/data -e CUEFRAME_PUBLIC_URL=https://studio.example.com -e CUEFRAME_PASSWORD=<long random password> cueframe`

With both set, cueframe answers only that host and requires the password. Each instance serves one customer. Give each paying customer their own container and volume.

## Role demo

Set `CUEFRAME_PUBLIC_URL` and `CUEFRAME_USERS`, a JSON list of `{ "email", "password", "role" }`. Roles: `admin` changes everything, `creator` edits projects but not settings, `viewer` is read-only. Sign in at `/login`. `/pricing` shows the planned model; payments are not connected.
