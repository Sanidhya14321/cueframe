# neuclip

A single Next.js project for a library of Remotion animation clips, editable poster packs and
website templates, with a deep, schema-driven video editor, a canvas image editor and a website
editor in the browser.

## Layout

Everything lives in one package. Modules import each other through the `@/` alias
(`@/schemas`, `@/project`, `@/core`, `@/compositions`, `@/lib/...`).

- `src/app`, `src/components`, `src/lib` - Next.js App Router UI: clip gallery and per-clip
  editor (live `@remotion/player` preview, schema-driven properties panel, timeline, shared
  undo/redo and export). Video projects use `src/lib/use-live-project.ts`, revisioned disk JSON
  through `src/local/projects.ts`, action routes and SSE. Clip localStorage drafts import on first
  open; posters still use `use-saved-document.ts`. Picked video-project media persists under the
  project media folder; the sidebar's Reset restores the original.
- `src/og` - the share cards behind each route's `opengraph-image.tsx`, drawn with `next/og` and
  prerendered at build time from committed previews: a cinematic player for clips (the still in a
  frame over an ambient blur of its first frame), a fan of neighbouring pages for posters, a phone
  mockup with its publish link for website templates, and a wall of the newest clip stills for every
  other page. Each card takes its accent and swatches from the item's own colour roles. Fonts come
  from `@fontsource` woff files; Satori needs flex layout and plain `<img>` with data URLs.
- `src/render` - Bun render scripts (`@remotion/bundler` + `@remotion/renderer`) for the
  committed gallery previews. They run locally only. Full-fidelity project jobs use a separate Bun worker
  (`src/render/render-local.ts`) so React rendering does not inherit the server-only condition.
- Browser export remains in `src/lib/use-project-export.ts` (`renderMediaOnWeb`); the editor also
  offers a local full-fidelity MP4 job. Keep compositions within what `@remotion/web-renderer`
  can draw: no `z-index`, `OffthreadVideo` or `Html5Video`, and prefer linear gradients over
  radial ones, blend modes, backdrop filters and 3D perspective, which only render when Chrome's
  HTML-in-canvas capture is available (`HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN`).
- `src/schemas` - per-clip Zod schemas, typed defaults, inferred types, the `ClipId` union and clip
  registry metadata. Pure, no React, no Node.
- `src/compositions` - the Remotion scenes, motion kit, `Root`, and the `registerRoot` entry.
- `src/project` - the layered `Project` model and its pure reducers.
- `src/design` - the image editor's typed `Design` model (pages of text, shape, path, line, image
  and icon elements, gradients, filters), pure mutations, geometry, the font catalog and the
  curated lucide icon set. Pure, no React.
- `src/components/design-editor` - the Konva image editor: canvas workspace, panels, shortcuts,
  offscreen page rendering and PNG, JPG, PDF and JSON export. Edits autosave to `localStorage`.
- `src/posters` - poster packs. Each pack (`packs/<category>/<pack-id>/`) is one multi-page
  `Design` built with the authoring kit in `src/posters/kit` (elements, blocks, devices,
  templates and shared listing slides). `photos.ts` lists the bundled Unsplash photos in
  `public/design-assets/photos`.
- `src/sites` - website templates: per-template Zod content schemas, defaults, metadata and control
  layouts (`templates/<category>/<id>.ts`), slugs, event dates, `.ics` files and the published-site
  check and paths (`published-site.ts`). Pure.
- `src/local` - local JSON stores, atomic file writes, settings and runtime session protection. The default data folder is `~/ClipKit`; `CLIPKIT_HOME` chooses the initial folder. No accounts or database.
- `src/components/sites` - each template's React website (`templates/<id>/`), the shared canvas
  and the website editor (`editor/`).
- `src/core` - domain types, the clip project seed and the Zod-schema-to-control introspection.
- `tests` - `bun test` suites, mirroring `src` (`tests/schemas`, `tests/core`, ...); top-level
  files and `tests/components` cover the UI. `e2e` holds the Playwright suite.

## Toolchain

- Bun only. No npm, pnpm or yarn.
- Biome for lint and format. Strict TypeScript (`tsconfig.json`, every strictness flag on).
- Tests: `bun test` with happy-dom + Testing Library for unit and component, Playwright for e2e.
- lefthook runs Biome and the no-comments, em-dash and repository checks pre-commit; typecheck and
  lint pre-push.

## Commands

- `bun run dev` - Next.js dev server.
- `bun run build` - production Next.js build.
- `bun run verify` - Biome, no-comments, no em-dashes, repository hygiene (files at most 400 lines,
  kebab-case paths), knip, typecheck and tests. CI also runs coverage, build, e2e, audit and the
  Markdown, YAML and workflow linters.
- `bun run lint` / `bun run lint:fix` - Biome.
- `bun run typecheck` - `tsc --noEmit`.
- `bun run test` / `bun run test:e2e` - unit/component / Playwright.
- `bun run render [clipId...]` - gallery previews: a half-size mp4, a 48px first-frame jpg and an
  800px `<id>.still.jpg` of the clip's `posterFrame` per clip in `public/previews`. The previews are committed, so the deployed build never renders:
  the homepage is prerendered at build time with the first screen of cards server-rendered, then
  lays the cards out as a virtualized masonry grid (`@tanstack/react-virtual` lanes, each card at its
  clip or poster aspect ratio, only cards near the viewport stay mounted), lazily
  loads each card's first frame as a blurred background and plays the mp4 over it once the card
  nears the viewport. Every new clip,
  and every clip whose rendered output changes, must commit its re-rendered preview; `tests/render/gallery-previews.test.ts`
  fails when one is missing.
- The gallery lists the most recently updated clips first, from the per-clip ISO timestamps in
  `src/schemas/clip-updated-at.json`. `bun run render` stamps a clip there when it is named on
  the command line or has no entry yet, so a new or changed clip lands on top once its preview is
  re-rendered; a bare full re-render keeps existing timestamps.
  `tests/schemas/clip-updated-at.test.ts` fails when a clip has no timestamp.
- `bun run render --new` - same, but only clips whose preview files are missing from
  `public/previews` (`-new` also works).
  `bun run render --stills [clipId...]` renders only the stills.
- `bun run render:posters [packId...]` - renders poster previews (480px jpgs, one per page) into
  `public/poster-previews/<pack>/` with the editor's own renderer in headless Chromium, and stamps
  the pack in `src/posters/poster-updated-at.json` when it is named or has no entry yet, so the
  grid sorts posters and clips together by last update. `--pack-file <path> --out <dir> --width
  <px>` renders an unregistered pack to any folder for review. `tests/posters/posters.test.ts`
  fails when a pack has no preview, no timestamp, or uses a font, icon or photo outside the
  bundled sets.

## Rules

- No comments in code. Only functional directives (`biome-ignore`, `@ts-*`, `eslint-*`,
  `/// <reference`, `/*! license */`). Enforced by `scripts/strip-comments.ts --check`.
- Heavily typed. Zod schemas are the single source of truth for clip props; derive types with
  `z.infer`, never hand-duplicate them.

## Clip modules

Clips are pluggable, category-organized modules so that parallel authors rarely touch the same
file. Categories group clips by the type of animation and are defined once in
`src/schemas/taxonomy.ts` (`CLIP_CATEGORIES`): `kinetic-type`, `text-reveals`, `hand-drawn`,
`phone-reveals`, `phone-layouts`, `screen-demos`, `desk-scenes`, `overlays`, `list-pickers`, `brand`,
`ad-reveals`, `backgrounds`, `transitions`, `invitations`.
Each category also lists search `keywords` (synonyms the gallery search matches). Every
`ClipMeta` also carries `tags` (from `CLIP_TAGS`) and a `theme` (`light` or `dark`), which the
gallery search and filters read.

- Schema side: `src/schemas/clips/<category>/<id>.ts` exports `<name>Schema`,
  `<name>Defaults`, `<Name>Props` and `<name>Meta: ClipMeta` (metadata, including `category`, is
  co-located with the schema), with its editor layout in `<id>-controls.ts` beside it. Each
  category's `index.ts` exports a `ClipModule[]` (`{ id, schema, defaults, meta, controls }`), and
  `clips/index.ts` concatenates them into `CLIP_MODULES`, then derives `CLIP_REGISTRY`,
  `CLIP_SCHEMAS`, `CLIP_DEFAULTS`, `CLIP_IDS` and the `getClip*`/`isClipId` accessors.
- Composition side: `src/compositions/scenes/<category>/<id>.tsx` exports the scene
  component and a `<name>Scene: SceneModule` (`{ id, component, render }`). Each category's
  `index.ts` exports a `SceneModule[]`, and `scenes/index.ts` concatenates them into `CLIP_SCENES`,
  from which `CLIP_COMPONENTS` and `RemotionRoot` are built.

To add a clip:

1. Add the schema file under the chosen category (`<name>Schema`/`<name>Defaults`/`<Name>Props`/
   `<name>Meta`) and re-export it from `src/schemas/index.ts`.
2. Add its id and `Props` type to `ClipPropsMap` in `src/schemas/clip-props.ts` (this is
   the typed map of the built-in clips and the source of the `ClipId` union).
3. Add its control layout `clips/<category>/<id>-controls.ts` (`<name>Controls`, see Controls).
4. Register the module, with its `controls`, in that category's `clips/<category>/index.ts`.
5. Add the scene file under `scenes/<category>/` (component + `<name>Scene`).
6. Register the scene in `scenes/<category>/index.ts` (one line).
7. Run `bun run render <id>` and commit its preview files in `public/previews`.
8. Label it in `src/schemas/clip-labels.json` (`clipLabelSchema` in `src/schemas/clip-labels.ts`): what
   is on screen, timed beats, motion, mood, the roles it plays in a video, use cases, what people
   can edit, its palette and search keywords. Label from frames of the rendered preview, not from
   the title. `tests/schemas/clip-labels.test.ts` fails when a clip has no label.

## Controls

Every clip has a hand-written control layout that drives its editor panel, and a field tag on
the zod schema decides each control's widget.

- Layout: `clips/<category>/<id>-controls.ts` exports
  `<name>Controls = defineControls<<Name>Props>({ sections, hidden })`
  (`src/schemas/control-layout.ts`). Each section has a `title`, primary `fields` and optional
  `more` (behind "More options"). A field is a typed path, `{ path, label, hint, items }`, or
  `{ link: [paths], label, hint }`, one control that writes the same value to several paths of
  identical shape. `hidden` is only for shared sub-schema fields the scene never reads.
- `src/schemas/control-presets.ts` holds `LOOK`, `MOTION`, `PLACEMENT` and `STAGE` fields with
  standard labels; spread them to relabel for a specific clip.
- `src/core/clip-controls.ts` resolves layouts for the editor. `tests/core/clip-controls.test.ts`
  requires every schema path to appear exactly once as a single field or in `hidden` (a path
  inside a `link` still needs its own single entry), no unknown paths, unique section titles and
  every link to resolve.
- Layouts are personal to the clip: sections named after what the viewer sees, content first,
  2 to 6 primary fields per section, linked controls for values people change together, accurate
  plain-English labels and hints, and no hard-coded value a user would want to change.

Field tags are read back by `src/core/schema-introspect.ts`:

- `zColor()`, `zMultiline()`, `zSlider({ min, max, step })`, `zImage()` and `zVideo()` (a URL,
  data-URI or object URL string; empty is allowed and renders a placeholder), and
  `z.enum(EASING_IDS)` for an easing curve picker.
- `EASING_IDS`/`EasingId` live in `@/schemas` and are the single source consumed by the
  compositions motion kit (`kit/easing.ts`).

## Generated footage clips

Some clips play live-action footage generated from scratch with OpenRouter models, with editable
print or graphics tracked onto it (`elevator-newspaper`). Each footage is a spec in
`src/footage/<id>.ts`: the image model prompts for its stills (key frames and any photos the
graphics use), the video model shots with first and last frames, the plate segments (frame
ranges, reversed or sped up) and the tracking regions.

- `bun run footage <id>` generates missing stills and shots into the ignored `footage/<id>/`,
  publishes photos to `public/footage/<id>/` and assembles `public/footage/<id>/plate.mp4`
  (`--stills`, `--shots`, `--plate`, `--only <name>`, `--force`). It uses the API key and base URL saved in local Settings and calls paid models; stills use Gemini 3 Pro Image, and Kling v3.0 Pro held the doors and the
  paper still where Veo 3.1 kept moving them.
- `bun run footage:track <id>` reads the plate and writes `src/footage/<id>.track.json`: the door
  edges and the corners of each newspaper page on every frame, from robust line fits to the paper
  edges and the fold. Commit the plate, the photos and the track; re-run the tracker whenever the
  plate changes.
- The scene plays the plate with `<Video>` and draws the print as canvas textures on a
  homography-warped mesh in an orthographic `ThreeCanvas`, clipped to the door gap. Keep the
  plate's frame rate as the clip's `fps` so plate and track frames line up one to one.

## Projects and layering

A `Project` (in `@/project`) is `{ fps, width, height, durationInFrames, background,
tracks }`. Each `Track` holds ordered `Element`s (`text | image | video | shape | composition`),
and every element is independently selectable, movable, trimmable and animatable in the timeline
editor.

- Stacking order: the FIRST track in `tracks` is the TOP visual layer and the TOP row of the
  timeline. `ProjectComposition` renders tracks in reverse DOM order, never `z-index` (the browser
  renderer ignores it), so earlier tracks sit on top; within a track, later elements paint over
  earlier ones. Project videos use `<Video>` from `@remotion/media`, not `OffthreadVideo`. The
  timeline UI, `moveTrack` (up = toward the top layer) and the render stay consistent with this.
- Pure reducers in `src/project/mutations.ts`: `moveElementToTrack` (reassign an element's
  layer, optionally re-clamping `from`), `moveTrack` (restack a whole track up/down) and
  `trimElementStart` (left-edge trim: moves `from` while holding the right edge fixed, min one
  frame). Right-edge drag uses `resizeElement`. All are frame-snapped and clamped.
- `seedProjectForClip(id)` (in `@/core`) opens a clip as a one-track project holding it as a
  `composition` element. The homepage lists `CLIP_REGISTRY`, and `/clips/[clipId]` validates
  with `isClipId`.
- The `@/schemas` scenes are reusable building blocks: the timeline
  toolbar's "Animation" picker inserts one as a `composition` element (its `clipId` is a schema
  `ClipId`, rendered through `CLIP_COMPONENTS`), layerable alongside the primitive elements.

## Media agent

Every clip and poster page wraps its editor in `AgentWorkspace` (`src/components/media-agent`), which
docks an "AI editor" column beside the editor on tablets and up and opens it as a bottom sheet on
phones. It streams a chat with `useChat` from `@ai-sdk/react` and keeps each turn simple: a
collapsible "Thinking" row that opens while the model reasons and animates shut when it is done,
the reply, and one card per edit listing each changed control (`src/agent/describe-path.ts`) with
its new value. Rejected attempts the model fixes stay hidden; no model names, tokens or raw JSON.
New content fades in and the log sticks to the bottom with `use-stick-to-bottom`. The editor sends
its current document and the chat's name with each message to `POST /api/agent` (`src/app/api/agent/route.ts`), which runs `streamText` using the OpenAI-compatible base URL, API key and model saved in local `settings.json` (`src/agent/model.ts`). It never reads provider keys from environment variables. The browser session cookie and matching Origin protect this route.

- The model edits through one tool, `editMedia`, which takes RFC 6902 JSON Patch operations
  (`src/agent/edits.ts`, `fast-json-patch`). Each patch is validated with `checkMedia`
  (`src/agent/media.ts`): the `Project` or `Design` schema, every composition's clip schema,
  unique ids, bundled fonts and icons. A failed patch goes back to the model as an error to fix.
- Posters are edited through their theme controls (`src/agent/theme.ts`): a `replace` on
  `/controls/N/value` or `/controls/N/values/I` runs `setControlValue` or `setListItem`. Writes to a
  property a control owns, to a locked shape or to a control definition are rejected with the
  control to use, so edits keep `auditPosterControls` bindings intact.
- On clips, replacing the first path of a linked colour role recolours its other paths with
  `recolor` relative to the clip defaults, like the properties panel (`src/agent/roles.ts`).
- The browser applies each successful tool output with the same `applyEdits` as one undoable step,
  so the agent never owns state.
- `src/agent/assets.ts` swaps data and object URLs for `asset://N` before the document reaches the
  model and swaps them back in the returned operations.
- `src/agent/instructions.ts` builds the system prompt: the document, its JSON schema, each
  clip composition's control layout as a field guide and each poster's theme controls.
- Each clip and poster keeps its own chats in `localStorage` (`neuclip-agent-chats:<editor storage key>`,
  `chat-library.ts` and `use-chat-library.ts`). The header switches, renames and deletes chats and
  starts a new one. The model names an unnamed chat, or renames it on request, with the
  `renameChat` tool. Reloaded turns never re-apply their edits.
- `e2e/media-agent.spec.ts` replays recorded streams, so CI never calls the model.

## Poster packs and the image editor

The home grid lists clips and poster packs together. A pack card shows a carousel of its pages,
and clicking a page opens `/posters/<pack>?page=<n>` in the image editor.

To add a pack:

1. Create `src/posters/packs/<category>/<pack-id>/` (categories are `POSTER_CATEGORIES` in
   `src/schemas/taxonomy.ts`) with a `posts.ts` of `Template`s and an `index.ts` that exports
   `definePack({...})` with one page thunk per page.
2. Add it to that category's `index.ts`.
3. Run `bun run render:posters <pack-id>` and commit the previews and the timestamp.

Keep every template element inside the template's own bounds (use `poly` for diagonal bands), and
only use the bundled fonts, icons and photos.

### Standard poster controls

Every poster is built with `themed(width, height, spec, (t) => nodes)` from `src/posters/kit`
and opens on the editor's Theme panel, which shows that poster's own hand-written controls:

- `spec.colors`: 2 to 6 roles from `background`, `surface`, `primary`, `secondary`, `accent` and
  `text`, each with its default and a hint naming exactly what it paints. A role can paint the
  backdrop and the front text together. In the build, `t.color(role)` gives the role colour and
  `t.shade(role, exact)` gives a related shade or tint (the exact original colour, with alpha if
  any); recolouring the role shifts that shade by the same amount.
- `spec.fonts`: at most 3 font roles (`t.font(key)`), and every text uses one.
- `spec.copy`: named copy (`t.copy(key)`), or a list for repeated copy such as answers, reviews or
  events (`t.list(key)`). Every text shows one copy value unchanged (no slicing, casing or joining)
  and the same template must build the same number of elements for any copy.

`themed` builds the template twice, once with marker values, to bind every control to the exact
elements it drives (`Design.controls`, applied with `setControlValue` and `setListItem`). Shapes
are locked and ignore clicks on the canvas, so people edit through the controls; text and images
stay editable. Runs of three or more consecutive shapes with the same type, name and group
(checkerboards, dot grids, star fields) merge into one `<name> pattern` path per colour.
`auditPosterControls` (run by `tests/posters/posters.test.ts`) fails when a colour, text or font
in a poster is not driven by a control, a control drives nothing, two roles paint the same
property, or a poster has more than 12 copy controls. Defaults must render exactly as before:
re-render the pack with `bun run render:posters <pack> --out <dir>` and compare.

### Standard clip controls

Every clip layout has a `Colors` section as its first or second section (it opens by default)
whose `fields` are 2 to 5 role controls labelled `Primary color`, `Secondary color`,
`Accent color`, `Text color`, `Background color` or `Surface color`, each linking the colour
paths that role should drive (the front text can share Primary with a shape). Individual colour
paths go in `more`. At most 14 controls show at first glance across all sections.
`auditClipStandard` in `src/core/clip-controls.ts` enforces this.

## Website templates

The home grid also lists website templates (gallery type `site`, categories `SITE_CATEGORIES`).
A card opens `/sites/<templateId>`, an editor with a browser-style live preview (phone or desktop,
Tailwind container queries, a reload button that replays the intro), the shared properties panel
driven by the template's `defineControls` layout, and the AI editor (media kind `site`, document
`{ templateId, content }`, edits only under `/content`, `src/agent/site.ts`). Drafts autosave to
`localStorage`. `/preview/<templateId>` shows a template with its defaults.

Saved websites live in `websites.json` in the selected local data folder. The existing `/api/sites` routes validate content and save, draft, rename or delete local websites. `/websites` lists them; `/websites/<id>` edits one; `/s/<slug>` opens a local preview only while ClipKit runs. Template drafts still autosave in localStorage. All saves require the runtime session and matching browser Origin. No cloud publishing is available.

To add a template:

1. Add `src/sites/templates/<category>/<id>.ts` (`<name>Schema`, `<name>Defaults`, `<name>Meta`)
   and `<id>-controls.ts`, and register it with a `headline` in `src/sites/templates/index.ts`.
   `tests/sites/templates.test.ts` requires every content path in the layout exactly once.
2. Build the website in `src/components/sites/templates/<id>/` as a `SiteView` (`scope`, `Body`,
   `Intro`, `hasIntro`) and bind it in `src/components/sites/site-registry.tsx`.
3. Put bundled photos in `public/site-assets/<id>/`, run `bunx next dev --port 3201` and
   `bun run render:sites <id> --base http://localhost:3201`, then commit
   `public/site-previews/<id>.jpg` (`tests/sites/previews.test.ts` fails without it).

## Local runtime and storage

Clerk, approval roles, API keys, OAuth, Neon and Drizzle have been removed. `src/proxy.ts` permits only loopback hosts, refuses foreign Origins and boots the browser's HttpOnly SameSite runtime cookie. API writes require that cookie and the same Origin, or the app's runtime Bearer token for local CLI/MCP clients. `next.config.ts` generates the runtime token before server workers start. Do not expose or log it.

`src/local/settings.ts` reads settings from disk, with provider and Fish Audio keys confined to `settings.json` (mode 0600). The settings API returns only key-presence flags. Settings changes use serialized atomic writes; a location pointer contains only the chosen data-folder path. Never log provider error bodies or redirect credential-bearing provider requests.

`src/local/videos.ts` saves videos to `projects/<id>/project.json` and creates `media/` and `out/`. `src/local/sites.ts` saves websites to `websites.json`. IDs are twelve lowercase alphanumeric characters; reject traversal and symlinked project paths. Video projects use revisioned disk actions and SSE; poster drafts remain in localStorage. `src/local/projects.ts` owns project history, presence and comments; uploads and full-fidelity outputs stay within each project folder.

The existing `/mcp` SDK endpoint and video/site/catalog tools now use local stores with no owner argument. Live tools are defined once in `src/agent/project-tools.ts`, registered through `src/mcp/project-tools.ts` and use the same action dispatcher as the browser. `/connect` shows the Claude Code HTTP command. Agent instructions and the Codex bridge remain step 11. Preserve existing tool validation.

Tests use a temporary `CLIPKIT_HOME` initialized by `tests-preload.ts`; no test reads real user files or calls a database. `tests/local` covers storage, settings and request security. Playwright runs on loopback without sign-in or cloud credentials.

## UI design workflow

For every app screen use the project-local Impeccable skill at `.agents/skills/impeccable/SKILL.md`, reading its relevant references. Read `PRODUCT.md` and `DESIGN.md`; use the semantic tokens in `src/app/globals.css` and existing shadcn components. Record critique/audit evidence and screenshots per approved addendum stage in `docs/CLIPKIT_UI_REVIEW.md`. Work through `docs/CLIPKIT_UI_ADDENDUM.md` A-I in order and wait for user go-ahead after each stage. Keep existing artwork and editor behavior intact.
