# OpenCut integration

## Active editor

Saved video pages at `/video/<id>` run the actual OpenCut classic `EditorCore`, timeline/commands, preview/compositor, media library, text/effects/settings panels, inspector and native export controls. This replaces the primary video editor, rather than renaming the old timeline.

ClipKit's revisioned Project remains shared with agents. Native saves run through canonical project actions, revision checks, locks and history. The complete native document and media manifest are retained alongside the canonical layer projection. Agent actions arrive through SSE and hydrate the native timeline; pending revisions are queued during local work. Locked layers are checked in both native track updates and the server's canonical/native validation.

Text, shapes, images, videos and audio map to native layers. Remotion compositions, captions and elements with baked motion, punch-ins or audio ducking use cached **individual** layer previews, retaining their original IDs, schemas and source properties. Selecting an animation exposes its existing Animation controls beside OpenCut; changes regenerate its preview. Source offsets and source provenance survive native splits and duplicates. Preview files are atomically published to the project media folder.

Native effects, masks, keyframes and other OpenCut-specific details remain in the complete native snapshot. Native browser export and local render jobs use OpenCut's actual rendering pipeline so these details are included. The original Remotion editor remains a source-control workspace at `?workspace=animation`, with a link back to OpenCut; it does not render every native effect. The shared model uses one main timeline with multiple tracks; the separate OpenCut scene switcher is intentionally not exposed.

## Local storage and recovery

Canonical `project.json` contains the editable layer projection and native snapshot; `opencut.json` retains the native version and media library cache. Unplaced imported media persists across reload. Project summaries and names update Projects without a second canonical revision for native timeline saves. Hashed media and output files stay inside the local project folder.

The existing loopback session and same-Origin rules protect every write. Stale native/canonical revisions are rejected. Document-only writes cannot bypass shared actions or locks. Cross-frame messages validate both origin and source window; only the native static entry permits same-origin framing.

While a shared revision hydrates (agent edits or animation previews regenerating) the native editor is inert and reports Applying project changes, so an edit cannot land on a timeline about to be replaced. Failed saves stay dirty and show Retry saving / Reload saved version. Navigation, New video and command actions checkpoint native edits before leaving. Browser close/reload retains the unsaved-change guard. Cmd/Ctrl+K inside the native editor opens the host command palette.

Selecting an animation opens the Frame panel beside the editor: a live preview plus the same controls as the Library. Project tools collects agent requests, Build from beats, comments and media tools. The Library tab's Suggest frames box matches a video description to clips with local embeddings and clip metadata.

When an animation has no full preview yet, the editor opens at once with its gallery video as a draft and swaps in full renders in the background. A layer that cannot render keeps its draft; use Local render for final output.

The Library tab lists catalog animations with search ranked from each clip's labels, so a phrase like "pricing for an app launch" finds matching clips. The `recommend_clips` MCP tool turns a brief into one clip per story role. Add inserts one at the playhead; dragging a card onto the timeline inserts it at the dropped time. Both flush native edits first, then use the same `add_item` action as MCP, so the animation stays an editable source layer. While a shared revision hydrates, the OpenCut status line names each layer being prepared, such as `Preparing typewriter (3 of 16)`.

The Captions tab imports SRT and ASS files as editable native text. The voice bar records through local whisper.cpp for review before sending. Dictation apps such as Handy and Wispr Flow can type into the same field. Upstream's stickers and sounds panels need cloud services, and its caption generation downloads a browser model, so they stay excluded.

## Reproducible source and licenses

- Requested repository reviewed: `opencut-app/opencut`, MIT, commit `e668010778568641babef2cc40be4703ae6916d6`. Its README directs web-editor users to classic during the rewrite.
- Working source: `opencut-app/opencut-classic`, MIT, commit `cf5e79e919144200294fb9fed22a222592a0aeea`.
- `integrations/opencut/source.tgz` contains that revision's `apps/web/src`. Its SHA-256 is checked against `source.json` before extraction. The full MIT license is retained alongside it.
- `bun run opencut:build` uses the isolated lockfile, extracts the pinned source, applies the reviewed adapter patches and produces `public/opencut`. The existing Tailwind/PostCSS toolchain is reused.
- Every bundled npm module is checked against a permissive-license allowlist. The 93-package runtime inventory and full notices are under `licenses/opencut-runtime`; NOTICE.md records source and modifications. Playwright's separate local-render runtime has its Apache-2.0 license and notice under `licenses/`.
- Mediabunny (MPL-2.0) and SoundTouch (LGPL) are not installed or bundled. Browser media APIs, WebCodecs and MIT mp4-muxer/webm-muxer replace them. No OpenCut accounts, database, cloud APIs, Pro icon packs or brand artwork are used.

The static runtime receives ClipKit's semantic colors, theme preference and bundled font faces. The host uses repository shadcn components. Native insertion and timeline controls have visible names/focus and 44 px actions. Inspect remains available on compact screens. GPU effects initialize before opening and are disabled with an explanation if unavailable. Speed changes pitch; pitch preservation is disabled.

## Try it

1. Run `bun run dev`, open ClipKit and choose New video or a saved project from Projects.
2. In Media choose Import. Use the visible Add-to-timeline button, select the clip, scrub, split, undo and edit through Inspect.
3. Reload to check persistence; choose Export for MP4/WebM.
4. Open Project tools on compact screens for requests, comments, media processing and local render. On desktop these tools remain beside the editor.
5. Connect Claude Code from `/connect`, keep `/video/<id>` open and ask it to edit that project. Its status shows above the editor and each edit appears in the timeline without a reload.
6. Open Library, search and choose Add, or drag a card onto the timeline.
7. Open a clip from the library, then choose OpenCut editor. Each animation stays a separate source layer. Select one and use Animation controls to edit its schema properties.

Native export requires the browser's matching WebCodecs encoder. Local layer previews and local rendering use Chromium, installed automatically on first use if missing. First animation preparation can take longer than later cached opens. Downloaded binaries and media remain local; no provider call is required for rendering.

Run `bun run verify`, `bun run opencut:typecheck`, `bun run build` and the Playwright suite for validation. Final evidence is in `CLIPKIT_UI_REVIEW.md`. Home start and New video exist; remaining addendum work is tracked in the PR.
