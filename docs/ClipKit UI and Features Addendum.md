# ClipKit: UI and Features Addendum (for the Codex Build Prompt)

An addendum to docs/CLIPKIT\_PROMPT.md. It makes every feature reachable from a professional, responsive interface: a home page with a hero, clear create, edit and generate entry points, settings for every key and provider, voice input, hover-select, a brief before building, and the missing pieces from the review. Save it as docs/CLIPKIT\_UI\_ADDENDUM.md.

## 1. Key decisions (from the brainstorm)

1. The app is the control center. Everything (creating, editing, connecting agents, keys, voice, export) works from the UI. The terminal is optional, never required.
2. Jobs started in the UI must reach whichever agent is connected. Generalize wait\_for\_comments into wait\_for\_events: it returns new jobs (generate this video, edit this upload), comments, voice requests and brief changes. If no MCP agent is connected, the in-app model (the user's base URL and key) runs the same job. The UI shows which one will run before the user presses Start.
3. Whisper is two features: Whisper captions (transcribe an uploaded video) and Voice input (speak to the editor, like a dictation app). Both use the same local whisper.cpp transcription on the server, with the browser speech API as a fallback.
4. Every agent action carries an author (agent name) and a turn id, so the activity feed, highlights and Undo agent turn work.
5. One design system for the whole app, set up with the Impeccable design skill, applied to every screen, and checked with its critique and audit commands before a screen is done.
6. Responsive by design: full editing on desktop and laptop; collapsible panels on tablets; on phones, a review mode (watch, comment, approve, export) rather than a cramped timeline. Say so in the UI instead of shipping a broken layout.
7. Reuse what exists: the repository's shadcn/ui setup and Tailwind for components, the existing editor, properties panels and gallery. New screens are compositions of these, not new UI kits.

## 2. Design system with Impeccable

- Install Impeccable (github.com/pbakaus/impeccable) for the agent you build with. Its README documents installs for several agents, including a Claude Code plugin and an npx installer with provider options; check the current README for Codex support, and if there is none, copy its skill and reference files into the repository and point AGENTS.md at them. Keep its license and attribution notice.
- Run its setup command first so it writes PRODUCT.md (what ClipKit is, who it is for: creators and developers who use coding agents) and DESIGN.md (the design system).
- Design direction to give it: a focused, dark, professional creative tool, closer to a modern video or design editor than a SaaS dashboard. One distinctive accent color, tinted neutral greys, an editorial display font for headings and a clean sans for UI, tabular numbers for timecodes, generous but consistent spacing, restrained motion (fast, purposeful, respects reduced motion). The agent's color is distinct from the user's selection color everywhere.
- Avoid generic AI-looking design: no default purple-blue gradients, no wall of identical cards, no emoji icons, no center-everything layouts, no fake testimonials.
- Tokens (color, type scale, spacing, radius, shadow, motion) live in one place (CSS variables used by Tailwind and the shadcn theme). No hard-coded colors in components.
- Before a screen counts as done, run Impeccable's critique and audit on it, fix what they flag that matters, and save a screenshot at 375, 768, 1280 and 1920 px widths.

## 3. App map and home page

### 3.1 Screens

| Route | Screen | Purpose |
| --- | --- | --- |
| / | Home | Hero, start creating, agent status, recent projects |
| /new | New video | Prompt, upload footage, or start from a clip; brief; choose who builds |
| /projects | Projects | All local projects with thumbnails, search, duplicate, delete, open folder |
| /p/ID | Editor | The live studio (section 5) |
| /library | Library | Existing clip gallery plus imported clips, with filters, license badges and Use in project |
| /connect | Connect | Claude Code, Codex and your own API, with copy buttons, tests and live status |
| /settings | Settings | Providers and keys, Fish Audio, Whisper, defaults, data folder, shortcuts, licenses |

A persistent top bar on every screen: logo (home), New video button, Projects, Library, agent status pill (click opens Connect), settings icon, and a command palette on Ctrl or Cmd plus K that can reach every action and screen.

### 3.2 Home page

- Hero: a clear one-line promise (for example: Your coding agent, now a video editor. Watch it build, then take over.), one supporting sentence, and a looping preview of a real ClipKit video (rendered by the app, not stock footage).
- Three primary actions as large tiles: Create from a prompt, Edit a video (upload), Start from a clip. Each goes to /new with that tab selected.
- Agent card: shows the connected agent or a short Connect an agent call to action with the three options.
- Recent projects strip with thumbnails and Resume.
- How it works in three steps (prompt, watch it build, edit and export) and a compact strip of what is included (1,000 plus motion clips, captions with Whisper, Fish Audio voices, works with Claude Code and Codex, runs locally).
- Footer: credits for the clip library and imported assets, license notes, version.
- First launch shows a short welcome over the home page: pick a data folder (default shown), connect an agent or add a key, optional Fish Audio key, then Create your first video.

## 4. New video: create, upload or start from a clip

One page, three tabs, then one short brief.

- From a prompt: a large prompt box with a mic button (voice input) and example prompts.
- Edit a video: drag and drop or browse; shows a thumbnail, duration and a Transcribe now status once uploaded; goal field (for example: 30 second reel with captions).
- Start from a clip: a compact picker from the library; the clip becomes the first item.

Brief (prefilled, every field optional, one screen):

| Field | Default |
| --- | --- |
| Length | 30 s (15, 30, 45, 60 chips) |
| Aspect | 9:16 (also 1:1, 16:9) |
| Pace | Fast |
| Look | One of the design looks, with small previews |
| Music | Pick from the bundled tracks with a play button, upload your own, or none |
| Voiceover | Off, or Fish Audio with a voice picker and a play sample button (disabled with a hint if no key) |
| Captions | On for uploads, style picker |
| Audience and goal | Free text, optional |

Who builds it: a selector showing the connected agent (Claude Code or Codex) or the in-app model, with its status. Press Start: the project is created, the job is queued for that agent, and the user lands in the editor watching it build. If no agent and no key are set, the Start button explains what to connect, with a link to /connect.

## 5. Editor additions

Keep the existing editor (preview, timeline, properties panels, undo, export) and add:

- Agent bar (top): agent name and status, current label, Stop (ends after the current action), Undo agent turn, and the activity feed in a drawer.
- Hover-select on the preview: hovering an element outlines it with its name; clicking selects its layer in the timeline and properties panel. A small Ask agent button next to the selection opens a prompt already tied to that layer and time. Implement by tagging rendered elements with data attributes for layer id and field, which the clip scenes and imported clips set.
- Right panel tabs: Properties (existing), Comments (pin at playhead or on the selected layer, Send to agent, status and the agent's note), Chat (the in-app model when no MCP agent is connected, or a message box that sends to the connected agent through wait\_for\_events), Brief (the project's brief, editable; changes are sent to the agent as an event), Captions (style picker, edit words, position band), Voice (voiceover lines, regenerate, voice picker, volume).
- Left panel tabs: Media (uploads, music, sounds), Library (insert clips by drag or click), Transcript (for uploads: words with times, click to seek, select and delete to cut).
- Voice input: a mic button in the agent bar, the chat box and the prompt box, plus a hold-to-talk shortcut. Speech is transcribed locally and placed in the box for review; with the Send immediately option it goes straight to the agent with the current selection and playhead attached.
- Captions safe band: captions sit in a reserved band; clip text and graphics are kept out of it; a toggle shows safe areas on the preview.
- Export dialog: presets (Reels and Shorts 9:16, YouTube 16:9, square), quality, in-browser or full-quality server render with progress, open file location, and a license and credits note.
- Turn-taking stays as in the build prompt: the agent's layers are outlined and locked while it works; everything else stays editable.

## 6. Connect and Settings

### 6.1 Connect (/connect)

Three cards, each with steps, copy buttons and a live status dot that turns green when connected:

- Claude Code: the one command to add ClipKit's MCP server, and the skill install. Test button that asks the agent bridge for a ping.
- Codex: the configuration snippet (or the stdio bridge command, whichever Codex needs), and a note that AGENTS.md already explains the tools.
- Your own API: provider type (Anthropic, OpenAI-compatible such as OpenRouter, or a local server), base URL, key, model (with a Fetch models button where the provider supports listing), Test connection.

### 6.2 Settings (/settings)

- Providers and keys: the same fields as Connect, plus a default builder (connected agent first, otherwise the in-app model).
- Voice: Fish Audio key, default voice with preview, test button; cloning off by default and, if added later, only from the user's own recording with consent.
- Whisper: model size (small default), download status with progress and size, test transcription on a short sample.
- Defaults: length, aspect, pace, look, captions style, music.
- Data: data folder path with Open folder, project storage size, clear caches.
- Shortcuts: list and remap.
- About: version, credits, licenses for the clip library, imported assets and the Remotion company-license note.

Keys are saved server-side in settings.json on this machine. After saving, the browser only ever sees a masked value. Keys are never logged or included in exports. Every key has a Remove button.

## 7. Responsive layout and states

| Width | Layout |
| --- | --- |
| 1280 px and up | Full editor: left panel, preview, right panel, timeline below; resizable panels |
| 768 to 1279 px | Side panels become collapsible drawers; timeline stays; top bar condenses into a menu |
| Under 768 px | Home, New video, Projects, Library, Connect and Settings fully usable in one column; the editor opens in Review mode: preview, play controls, comments, chat, voice input, approve draft and export; a note says full timeline editing needs a larger screen |

Rules: no horizontal page scrolling at any width; touch targets at least 44 px on touch screens; text never smaller than 12 px; panels scroll on their own; the preview keeps its aspect ratio.

Every screen has designed states, not blank areas:

- Empty: no projects yet (with the three create tiles), no agent connected, no keys set, empty timeline.
- Loading: skeletons for thumbnails and panels; progress for uploads, transcription, model downloads and renders.
- Errors: plain messages with the next step (for example: Fish Audio key rejected, check it in Settings), never raw stack traces.
- Offline agent: the editor still works by hand; jobs wait with a clear message.

## 8. Build order, checks and kickoff

### 8.1 How this fits the main prompt

Do steps 1 to 5 of docs/CLIPKIT\_PROMPT.md first (plan, local-only, live project, MCP tools, agent bar and locks). Then work through this addendum in this order, folding it into the remaining main steps:

| Step | Work |
| --- | --- |
| A | Impeccable setup, PRODUCT.md, DESIGN.md, tokens; app shell with top bar and command palette |
| B | wait\_for\_events with jobs, comments, voice and brief events; author and turn id on every action |
| C | Home page and first-launch welcome |
| D | New video page with tabs, brief and the who-builds selector; job reaches the agent |
| E | Editor additions: hover-select, right and left panel tabs, captions safe band, export dialog |
| F | Voice input (shared local transcription with the Whisper captions feature) |
| G | Connect and Settings with tests and masked keys |
| H | Responsive pass and Review mode on phones; designed empty, loading and error states |
| I | Impeccable critique and audit on every screen; fix; screenshots at four widths |

Then continue with the remaining main-prompt steps (beat-sheet generation, comments, Whisper captions, Fish Audio, imported assets, in-app chat, launcher), using these screens as their entry points.

Cut line, in order: Review mode polish on phones, shortcut remapping, the start-from-a-clip tab, music upload. Never cut: home page actions, the New video flow reaching the agent, hover-select, the agent bar, Connect and Settings with keys.

### 8.2 Checks

- Every feature in the main prompt can be reached from the UI without the terminal.
- A job started in the UI runs on Claude Code when connected, and on the in-app model when not.
- No horizontal scrolling at 375, 768, 1280 and 1920 px; Playwright screenshots stored for each screen.
- Keys never appear unmasked in the browser after saving, and never in logs.
- Impeccable critique and audit results recorded per screen with what was fixed.

### 8.3 Kickoff message

```
Read docs/CLIPKIT_PROMPT.md and docs/CLIPKIT_UI_ADDENDUM.md. If steps 1 to 5 of the main prompt are not done, finish them first. Then do steps A to I of the addendum in order, using the Impeccable design skill for every screen. After each step, tell me which page to open and what to try, and wait for my go-ahead. Keep existing features working; reuse the repository's shadcn components and Tailwind; every feature must be reachable from the UI.
```
