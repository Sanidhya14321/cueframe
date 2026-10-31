# ClipKit on cliplibrary: Build Prompt for Codex

A complete prompt for turning the cliplibrary repository (Next.js, Remotion, Bun) into ClipKit: a local-first video editor that coding agents (Claude Code and Codex through MCP, or any model through the user's own base URL and key) can drive in real time while the user watches and edits. Give this whole document to Codex, opened in the cloned repository.

## 0. What we are building and the ground rules

ClipKit turns this clip library into a local video studio that AI agents operate live. The user runs one app on their own machine, connects an agent, asks for a video, and watches the agent build it in the browser. When the agent stops, the user edits anything by hand, pins comments for the agent, and exports.

The four selling points the result must show:

1. A live, editable layer between coding agents and export: no black-box MP4.
2. Whisper flow: drop a talking clip, get a tight cut with word-synced captions.
3. Fish Audio voiceover on generated videos.
4. Web motion as video: the existing Remotion clips plus imported free React animation components, chosen per segment and timed to the beat.

Ground rules:

1. Read AGENTS.md, README.md, package.json and the folders src/project, src/schemas, src/compositions, src/core and src/app first. Before changing anything, write docs/CLIPKIT\_PLAN.md (under 60 lines): how projects, layers and clips relate today, whether a project can hold several clips over time, what auth, database or backend code exists, and which files each step below will touch.
2. Extend, do not rewrite. Keep the gallery, editor, properties panels, undo and export working. Follow the repository's conventions in AGENTS.md; if its verify gate blocks progress during the hackathon, run the fast parts (typecheck, tests) and note what was skipped.
3. Every step ends with something visible working in the browser. Time-box each step; if it runs over, take the simplest route and note it in docs/CLIPKIT\_PLAN.md.
4. Local only: no accounts, no database, no cloud backend. Data lives in files on the user's machine.
5. Licenses: import third-party code only under MIT, Apache-2.0, ISC, BSD, CC0, MIT-0 or Unlicense, keep the license text, and list it in NOTICE.md. Anything else is reimplemented from the idea, not copied.

## 1. Make it local-only

- Remove Clerk (or any other login), role-based access, user and organization models, database clients and schemas, and any cloud API routes that only exist for accounts. Remove their environment variables, middleware, providers and UI (sign-in pages, user menus, gated routes). The app opens straight into the gallery and editor.
- Keep any AI provider code (for example an OpenRouter client) but change it so the base URL, key and model come from local settings (section 4), not from a server or account.
- Local data folder: by default \~/ClipKit (configurable). Inside: projects/NAME/project.json, projects/NAME/media/, projects/NAME/out/, and settings.json. Keys are stored only in settings.json on this machine, never sent anywhere except the provider the user chose, and never logged.
- The local server binds to 127.0.0.1 only. Write routes require a session token that the app generates at start and gives to the browser and to the MCP server, and they check the Origin header, so other websites cannot change projects.

## 2. Run it as one app

The user should not need to know Next.js or Bun.

- Use Next.js standalone output so the built app runs as a plain server.
- Add a launcher command, clipkit, that: checks ffmpeg and prints how to install it if missing; picks a free port; starts the server; creates the data folder; opens the browser; and prints the two lines needed to connect Claude Code and Codex (section 3).
- Package the launcher as a single executable with bun build --compile for macOS, Windows and Linux, shipped alongside the standalone build in one folder or archive. Also support bunx clipkit for developers. Electron or Tauri are out of scope for now.
- First run shows a short Connect your agent screen: Claude Code, Codex, or your own API (section 4), with copy buttons for the commands and a live indicator that turns green when an agent connects.

## 3. Live project and agent tools

### 3.1 One source of truth

- API routes in the Next.js app: GET and PUT a project, POST an action, and GET an event stream (server-sent events) per project.
- Every change, from the browser or an agent, is one of the editor's existing reducer actions from src/project, sent to the server, applied with the same reducer, saved to project.json atomically, given a revision number, and broadcast to every open browser. The browser applies the same action, so both always agree and undo and redo cover agent edits too.
- If the project model cannot hold several clips over time, add a sequence track whose items are { clipId, props, start, duration, transitionIn } and render them in order in the preview and export. Reuse existing clips.

### 3.2 Tools (defined once, used by every agent path)

| Tool | What it does |
| --- | --- |
| list\_projects, open\_project, new\_project | Manage projects (aspect and length set the canvas) |
| search\_clips(query, category?, limit=5) | One line per clip from the catalog (section 5.3) |
| get\_project | One line per item: id, start, duration, clip, main text |
| get\_item(id) | Full props of one item |
| add\_item, update\_props, move\_item, delete\_item | Edits as reducer actions |
| build\_from\_beatsheet | Builds a whole video from a short beat sheet (section 6) |
| set\_agent\_status(working or idle, label, itemIds) | Shows the banner and locks those items |
| wait\_for\_comments(timeout) | Returns new user comments with their item and time |
| resolve\_comment(id, note) | Marks a comment done |
| transcribe\_video, add\_voiceover, render | Sections 6 and 7 |

Outputs are short. The agent never receives clip source code or the whole project unless it asks for one item.

### 3.3 Three ways to connect

- Claude Code: the app serves an MCP endpoint over HTTP (official MCP TypeScript SDK). The connect screen shows the one command to add it to Claude Code. Verify the exact command and transport in the current Claude Code docs.
- Codex: the same server. If Codex needs a local command instead of a URL, ship a small stdio bridge (clipkit mcp) that forwards to the app. Verify the current Codex MCP configuration format and show the snippet on the connect screen. Add a section to AGENTS.md telling Codex how to use the tools.
- Your own API: a chat panel inside the app. Settings take a provider type (Anthropic or OpenAI-compatible), base URL, key and model. A small loop on the server sends the user's message with the same tool list, runs the tool calls, and streams the reply. Reuse any existing OpenRouter code for the OpenAI-compatible path.

Never add Sign in with Claude or ChatGPT. Subscriptions are used only through the user's own Claude Code or Codex.

### 3.4 Skill for agents

Add a short skill file (under 60 lines) for Claude Code and the same text in AGENTS.md: open or create a project, set status to working with a label, prefer build\_from\_beatsheet for new videos, keep edits small, set status to idle when done, then call wait\_for\_comments and handle each comment by changing only its item.

## 4. The real-time experience in the editor

- Agent bar at the top of the editor: which agent is connected (Claude Code, Codex, or the in-app model), its status and its current label (for example: adding the hook).
- While the agent works, the items it is changing get a colored outline and a small lock icon; edits to them are refused by the server with a short toast; everything else stays editable.
- Each incoming action animates briefly in the timeline and inspector so the user sees exactly what changed; the preview updates within a fraction of a second.
- Activity feed: one line per agent action, clickable to select that item; an Undo agent turn button reverts everything from the last run in one step.
- Comments: add a comment at the playhead or on an item, press Send to agent; the comment shows open, in progress and done with the agent's note.
- Settings page: data folder, provider type, base URL, key (masked), model, Fish Audio key, connection test buttons. Saved to settings.json locally.
- Fallbacks: if the event stream drops, show Reconnecting and resync from the latest revision; if an agent disconnects mid-run, clear its locks after 60 seconds and say so; if a clip fails to render, show a placeholder for that item only.

## 5. Imported assets: free web components as video clips

### 5.1 Sources

Read each source's LICENSE first. Import only permissive ones and record source, commit and license in NOTICE.md. For each, copy only the component files needed, into src/compositions/scenes/imported/SOURCE/ with the license file alongside.

| Source | What to take | License note |
| --- | --- | --- |
| React Bits (github.com/DavidHDev/react-bits) | Text animations and backgrounds | Copies show different licenses; if the original LICENSE adds a Commons Clause or other restriction, do not copy: write original versions of the effects instead |
| Magic UI (github.com/magicuidesign/magicui) | Text effects, number ticker, device frames, marquee, shine borders | MIT expected |
| Motion Primitives, Animata, Cult UI | Text and card effects | Verify each |
| gl-transitions (github.com/gl-transitions/gl-transitions) | Transition shaders | Per transition |
| Paper shaders (github.com/paper-design/shaders) | Mesh gradients, noise | Verify |
| Lucide, Tabler icons | Icons for callouts | Permissive |
| Google Fonts | Fonts used by looks | Per font (mostly OFL) |
| Sound effects (crafter-station/elements, Kenney audio packs) | Whoosh, hit, riser, click | CC0 expected |

### 5.2 Converting each component into a clip

Follow the repository's Adding a clip steps in AGENTS.md: a Zod schema under src/schemas/clips/imported/ and a scene under src/compositions/scenes/imported/, registered in the category index. For each component:

- Remove hover, scroll and mouse behavior; drive all motion from Remotion's current frame (interpolate, spring, or a paused GSAP or Motion timeline seeked to the frame time). No timers, no unseeded randomness.
- Expose text, colors, fonts and timing as schema fields so the existing properties panel can edit them.
- Check: the same frame renders the same twice; long and short text both fit.
- Render its gallery preview with the existing render script and give it a category, short description and source and license badge in the gallery.

Aim for 20 to 30 strong imported clips in the time available, prioritizing hook text, kinetic words, number counters, device mockups, backgrounds and transitions. Quality over count.

### 5.3 Catalog

A script builds catalog.json from the clip registry: id, category, one-line description, energy (1 to 5), text slots with maximum length, typical duration, aspect support, source and license. search\_clips reads this file only.

## 6. Generation, Whisper and voice

### 6.1 build\_from\_beatsheet (fast-paced by default)

Input from the agent: aspect, target length, optional music file, and 12 to 16 segments, each with role (hook, point, proof, turn, cta), 1 to 4 words of text, energy, and an optional voice line.

Code does the rest, no further model calls: tempo from the music (or 128 BPM with a generated beat bed), 2 to 4 beats per segment, hook in the first beat, a drop at about two thirds, clip chosen from the catalog by role and energy without repeats in a row, a transition on each downbeat, a whoosh before each cut and a hit on each landing, text filled into the clip's slots, one consistent palette and font pair. Items are added one action at a time so the browser shows the build live.

### 6.2 transcribe\_video (Whisper flow)

Add a video to the project, transcribe it locally with Remotion's whisper.cpp package to get word timestamps, remove filler words and pauses longer than 0.4 seconds by splitting the video item, add a captions item with word timing and active-word highlight, and add 110 to 120 percent zoom punch-ins on words the agent marks as emphasis. The original file is never modified.

### 6.3 add\_voiceover (Fish Audio)

Uses the Fish Audio key from settings to generate speech for the voice lines, caches files by text hash in the project's media folder, adds them as audio items aligned to their segments, and lowers the music under them. If no key is set, skip with a clear message. Verify the current Fish Audio API before coding.

### 6.4 Export

Keep the existing in-browser export. Add render, which uses the repository's existing Remotion server render scripts for full fidelity (the browser export skips some CSS effects), shows progress, and writes to the project's out folder.

## 7. Build order, checks and kickoff

### 7.1 Order (each step shown working in the browser before the next)

| Step | Work | Proof |
| --- | --- | --- |
| 1 | Read the repo, write docs/CLIPKIT\_PLAN.md | Plan reviewed |
| 2 | Remove auth, roles, database and cloud routes; local data folder and settings | App opens straight to the gallery; no login anywhere |
| 3 | Disk-backed projects, action route, event stream; sequence track if needed | A curl action changes the open editor live; reload keeps edits |
| 4 | Tools plus MCP endpoint; connect screen; Claude Code connection | Claude Code adds an item and the browser shows it live |
| 5 | Agent bar, locks, activity feed, undo agent turn | Locked items refuse edits while the agent works |
| 6 | Catalog and build\_from\_beatsheet | A prompt in Claude Code builds a 25 to 30 second video live |
| 7 | Comments and wait\_for\_comments | A pinned comment changes only its item |
| 8 | Whisper flow | A talking clip is cut and captioned |
| 9 | Fish Audio voiceover | Generated video has a voiceover with music ducked |
| 10 | Imported assets (section 5) | 20 or more new clips in the gallery with license badges |
| 11 | In-app chat with base URL and key; Codex bridge and AGENTS.md section | Same build works from the in-app chat and from Codex |
| 12 | Launcher and single executable; README | Double-click or one command starts everything |

Cut line if time runs short: steps 12, 11 and 10 shrink first (fewer imported clips, Codex via MCP only, run with bun run dev). Never cut steps 2 to 7.

### 7.2 Checks

- Playwright: the existing suite still passes; add one test where a tool call changes the project and the editor shows it, and one where a locked item refuses a user edit.
- No secrets in the repository or logs; the server only listens on 127.0.0.1; write routes require the session token.
- Every imported file has its license recorded in NOTICE.md.
- The demo flow works three times in a row from a fresh data folder.

### 7.3 Kickoff message for Codex

```text
Read this whole document (save it as docs/CLIPKIT_PROMPT.md in the repo first). Then do step 1: read AGENTS.md and the listed folders and write docs/CLIPKIT_PLAN.md; stop and show it to me. After I approve, go through steps 2 to 12 in order. After each step, tell me what to click or run to see it working, and wait for my go-ahead before the next. Keep the existing gallery, editor and export working. Import third-party code only under permissive licenses and record it in NOTICE.md.
```
