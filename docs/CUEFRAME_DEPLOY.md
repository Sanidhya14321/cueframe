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

Also set `CUEFRAME_SESSION_TOKEN` to a long random value (`openssl rand -hex 32`). It signs sessions and is the agent Bearer token; without it every restart signs everyone out and breaks agent connections. Rotate it to sign everyone out; one person can sign out from Settings. Passwords should be at least 12 characters. A single owner password protects the workspace; there are no user lists or roles.

With both set, cueframe answers only that host and requires the password. Each instance serves one customer. Give each paying customer their own container and volume.

The container runs as the `bun` user. A volume created by an older root image needs `chown -R 1000:1000` once on its folder.

## Guardrails

`GET /api/health` needs no login and returns 200 while the data folder is writable, or 503. The container's health check uses it. Login allows 10 attempts per client every 15 minutes, and hosted AI requests are limited per client. These limits are saved in the data folder, so they survive restarts. They apply per server, so run one process per customer. Your HTTPS proxy must append the client address as the last `X-Forwarded-For` entry, must allow 256 MB uploads and must not buffer event streams.

## Azure

Azure builds the image from the repository's `Dockerfile`, on Web App for Containers (App Service) or Container Apps. Azure terminates HTTPS and already sends `X-Forwarded-For`, so no extra proxy is needed. The image needs no build arguments except `CUEFRAME_PUBLIC_URL` for correct share links, and `HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN` if you use it.

Set these on the app as application settings or environment variables, keeping the password and token as secrets:

| Setting | Value |
| --- | --- |
| `CUEFRAME_PUBLIC_URL` | The exact public HTTPS URL, such as `https://<app>.azurewebsites.net`. Other hosts get 403. |
| `CUEFRAME_PASSWORD` | The owner password, at least 12 characters. |
| `CUEFRAME_SESSION_TOKEN` | Output of `openssl rand -hex 32`. |
| `WEBSITES_PORT` | `3000`, App Service only. On Container Apps set the ingress target port to `3000` instead. |
| `AGENT_BASE_URL`, `AGENT_MODEL`, `AGENT_API_KEY`, `FISH_AUDIO_API_KEY`, `YUGABYTE_DATABASE_URL` | Optional. Imported into `settings.json` at each start; they can also be entered in Settings. |

Three Azure settings decide whether the deployment works:

- Mount an Azure Files share at `/data`. Without it, every project, setting and login limit is lost when the container restarts.
- Run exactly one instance. Projects, live updates and limits are per process, so set App Service to one instance, or Container Apps to one minimum and one maximum replica, with one revision active.
- Point the platform health check at `/api/health`.

Choose at least 2 vCPUs and 4 GB of memory, because full-fidelity renders run Chromium in the container. App Service closes requests idle for 230 seconds; render and transcription run as background jobs, so they are unaffected. The first transcription compiles Whisper into `/data/tools`, which takes several minutes.

## Azure VM pipeline

`.github/workflows/deploy.yml` runs the Compose stack on one Azure VM. Each push to `main` runs CI, pushes `ghcr.io/<owner>/cueframe:<commit>`, then over SSH shuts the stack down and brings the new image up. Caddy (`deploy/azure/compose.azure.yaml`) serves HTTPS on ports 80 and 443 and gets its own certificate. If the app fails its health check, the pipeline brings the previous image back and the run fails. Volumes are never removed.

Expect a minute or more of downtime on every deploy, because the stack stops before the new one starts.

### Set up the VM once

Run these from Azure Cloud Shell or any machine with the Azure CLI. Yugabyte runs beside the app, so size the VM above the app's own minimum.

```sh
az group create --name cueframe --location eastus
az vm create --resource-group cueframe --name cueframe --image Ubuntu2404 \
  --size Standard_D4s_v5 --os-disk-size-gb 128 --public-ip-sku Standard \
  --public-ip-address-dns-name <label> --admin-username azureuser --generate-ssh-keys
az vm open-port --resource-group cueframe --name cueframe --port 80,443 --priority 900
```

The server's address is `<label>.eastus.cloudapp.azure.com`. Sign in to it with SSH, then install Docker and create the deploy folder:

```sh
curl -fsSL https://get.docker.com | sudo sh
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo install -d -o deploy -g deploy /opt/cueframe
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
```

Write `/opt/cueframe/.env`, owned by `deploy` with mode 600. Quote any value that contains `$`. Hex values need no quoting.

```sh
CUEFRAME_PUBLIC_URL=https://<label>.eastus.cloudapp.azure.com
CUEFRAME_PASSWORD=<openssl rand -hex 24>
CUEFRAME_SESSION_TOKEN=<openssl rand -hex 32>
```

The optional `AGENT_*` and `FISH_AUDIO_API_KEY` settings go in the same file. Secrets stay on the VM; GitHub never holds them.

### Connect GitHub

Create a key for the pipeline and add its public half to `/home/deploy/.ssh/authorized_keys` on the VM, with mode 600 and owned by `deploy`. Then create the `production` environment and its four secrets:

```sh
ssh-keygen -t ed25519 -N "" -f cueframe-deploy
gh api -X PUT repos/Sanidhya14321/cueframe/environments/production
gh secret set AZURE_VM_HOST --env production --body <label>.eastus.cloudapp.azure.com
gh secret set AZURE_VM_USER --env production --body deploy
gh secret set AZURE_VM_SSH_KEY --env production < cueframe-deploy
ssh-keyscan -t ed25519 <label>.eastus.cloudapp.azure.com | gh secret set AZURE_VM_KNOWN_HOSTS --env production
```

Delete the local private key once it is saved. Set the `HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN` repository variable if you use it.

Port 22 has to stay reachable from GitHub's runners, whose addresses change. Keep password sign-in off, which is the default for this VM.

### Run it by hand

Each action works from the Actions tab or the command line:

```sh
gh workflow run deploy.yml -f action=recompose
```

| Action | What it does |
| --- | --- |
| `deploy` | Runs CI, builds the current `main`, replaces the stack and rolls back on failure. |
| `recompose` | Shuts down and starts the deployed image again, with no build. |
| `restart` | Restarts the containers in place. |
| `down` | Shuts the stack down and keeps all data. |
| `up` | Starts the deployed image. |

A push to `main` brings the stack back up even after `down`, so hold merges during planned downtime.

Customer data lives only on this VM's disk, so turn on Azure Backup for it. The pipeline serves one VM, which is one customer. Each further customer needs their own VM and their own GitHub environment.
