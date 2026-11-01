# Step 2 backend verification

Audit date: 2026-10-31. Stack: Next.js, strict TypeScript, Bun, local JSON files.

## Critical findings

None identified in the reviewed local settings, file-store and request-protection paths. No database or account service remains. No provider keys are returned by the settings API or included in error messages.

## High findings

### LOCAL-001: Valid loopback requests rejected (resolved)

- Category: runtime request validation.
- Files: `src/local/security.ts`, `src/proxy.ts`, `src/app/mcp/route.ts`.
- Symptom: the browser received HTTP 403 when opening the local gallery.
- Root cause: NextURL rewrites loopback IPs to `localhost`, while the actual Host and Origin retain `127.0.0.1`.
- Fix: independently validate both hosts as loopback with matching ports, then compare Origin against the validated actual Host. Never trust forwarded headers. Preserve token requirements, constant-time token comparison, HttpOnly/SameSite cookies and rejection of cross-site requests.
- Verification: regression tests cover normalized URLs, foreign hosts, wrong ports, null/foreign origins, missing/incorrect tokens and authenticated browser/CLI requests. Browser acceptance is recorded in `CUEFRAME_PLAN.md`.

## Medium findings

### BUILD-001: Existing template font imports fail with Turbopack (resolved)

- The installed Next.js Turbopack build fails resolving its internal Google font module. The webpack production build compiles the existing templates successfully. Dev/build scripts select webpack; existing template fonts and layouts are retained. The app shell uses the already-installed Inter files.

### DEP-001: Existing fast-uri transitive vulnerabilities (resolved)

- `bun audit` identified four URI-normalization advisories in fast-uri 3.1.8, used by the existing MCP SDK and Remotion bundler.
- Pinned the compatible 3.1.9 patch through a package override; retained the BSD-3-Clause text and release provenance in `NOTICE.md`.
- `bun audit` reports zero vulnerabilities across 667 packages after installation.

### SSR-001: Saved website dialog reads window during server rendering (resolved)

- The website reload test initially recovered through client rendering, but the server log showed `ReferenceError: window is not defined` in the existing share dialog.
- Move origin discovery into a client effect; render local preview and edit links from that state. The browser test now also checks the reload response and rejects the server-rendering error text.

## Other checks

API schemas reject unknown settings fields and credential-bearing base URLs. Local data writes use serialized atomic replacement and private settings files. Tests cover corrupted-file preservation, concurrent updates, traversal IDs and symlinked project directories. Provider fetches refuse redirects; provider error bodies are not logged. Browser writes require a same-origin session and CLI calls require a runtime token. Dev and production scripts bind only to 127.0.0.1. Native packaging and persistent media uploads are deferred to their approved steps.

## Chat execution audit, 2026-11-01

Stack: Next.js, AI SDK, local JSON project actions and optional Yugabyte retrieval.

- High, fixed: `AgentPanel` submitted only to the event queue; no in-app consumer executed its messages. The chat endpoint now selects an active external listener or runs the saved model with project-scoped tools. Regression tests exercise persistent edits, undo history, replies, external routing and missing configuration.
- Medium, fixed: instrumentation destructured `NEXT_RUNTIME`, preventing Next from excluding Node-only security imports from its Edge bundle. A directly evaluated runtime guard keeps hosted startup checks in Node. The local dev server now serves pages and APIs successfully.
- Access change requested by the owner: removed admin/creator/viewer authorization in favor of a single password-protected owner session. A new session signature invalidates previous role sessions. Origin checks, constant-time comparisons, HTTP-only cookies, separate agent tokens and login rate limits remain in place.

The scoped chat tools revalidate input before invoking shared tools. A literal project ID prevents cross-project tool calls; existing project guards enforce pinned selections. Mutations remain atomic and undoable. Provider errors are reduced to safe messages, the turn has a timeout and heartbeat, and idle cleanup runs after success or failure. Docker provisioning imports credentials into private disk settings without printing their values.

Live paid-provider verification requires an actual model and key. The local browser proof uses a fixture instead. No critical issue was found in this scoped audit; it is not a full hosted production audit.
