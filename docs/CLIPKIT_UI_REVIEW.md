# ClipKit UI addendum progress

The user requested one addendum stage at a time, with a demonstration and go-ahead before the next. Main steps 1-5 are already implemented: local-only settings/stores, revisioned projects/actions/SSE, MCP tools/Connect, presence/locks/activity and selective turn undo. Their existing unit and browser checks remain part of validation.

## A: design system and shared shell

Scope: PRODUCT.md, DESIGN.md, semantic CSS/Tailwind/shadcn tokens, persistent top bar, navigable Library route, live connection pill, keyboard command palette and a working New video action. The existing gallery remains at `/` until the home page changes in C. `/library` exposes the same gallery now. New video creates a blank disk-backed timeline; the brief and builder flow belong to D.

Impeccable: official Codex skill installed project-locally at `.agents/skills/impeccable`, upstream commit `df3a4abe7d0840d5f60324812c432e00b66a4e75`. Loaded setup, init, new-work, craft-floor, critique and audit guidance. Product, audience, stack and visual constraints came from the user's approved documents; no additional product claims were invented. The context launcher initially failed due to its downloaded executable bit, so direct project context was used as the skill instructs; executable permission was restored afterward.

### Direction contract

THESIS: The shared shell gets creators to real video work immediately and keeps agent state visible; preview artwork supplies the visual variety.

OWN-WORLD: Green-tinted graphite, warm off-white text, acid-green primary actions, cyan user selection and amber agent work. Inter UI, existing bundled Instrument Serif for display. Restrained border-based hierarchy with no gradient branding.

STORY: Recognize the studio, start a video or resume a project, find clips, connect an agent and configure local providers without losing editor access.

FIRST VIEWPORT: A 56 px solid top bar; logo and New video on the left, Projects/Library when space allows, keyboard/menu access and connection/settings tools on the right. Existing gallery/editor content begins directly underneath.

FORM: Operate-mode local app shell, code-first from the explicitly specified addendum. No free-form visual concept round or image-generation assets were required.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

### Try it

1. Run `bun run dev`, open `http://127.0.0.1:3000/library`.
2. Press Cmd/Ctrl+K. Type Settings and press Enter. Open it again, search for an unknown action, then Escape; keyboard focus returns to the trigger.
3. Click New video. A blank project opens with Saved locally; edit or use Build from beats as before. The guided brief is not part of stage A.
4. Open the navigation menu to reach Websites, Connect and Settings. Click the connection pill to open Connect. Search “appearance” in the palette to switch light/dark mode.
5. At narrow widths use the menu and icon controls; the same actions remain available.

### Validation and review status

- The complete verification gate passed 711 tests, with lint, strict TypeScript, knip and repository checks.
- Production build passed. All 35 Playwright checks passed, including the original gallery/editor/export flows and six new shell tests. After enlarging the theme control, all six shell tests passed again, including explicit 44 px target checks. Nine screenshots (shell and palette at four widths, plus light mode) are saved under `docs/screenshots/step-a/`.
- In-app browser automation is disabled in Work settings. Visual and interaction evidence therefore uses local Playwright Chromium, not a physical device.
- The user approved two independent reviewers. Both completed the Impeccable assessment; the baseline was 30/40 usability and 16/20 audit, with no P0/P1 issues. All six scoped findings were fixed. The persisted review is `.impeccable/critique/2026-10-31T01-39-50Z__src-components-studio-shell-tsx.md`; its scores remain explicitly pre-fix.
- Step A is complete; step B delivery is recorded below. C-I have not begun.

### Technical audit evidence

The shell was measured in rendered Chromium in both themes. Dark foreground/background contrast is 16.51:1, muted text 7.74:1, muted-on-card 7.28:1 and primary action 14.14:1. Light-mode equivalents are 19.80:1, 4.74:1, 4.54:1 and 17.18:1. Selection text and agent color also pass. All visible shell links/buttons are at least 44 px after enlarging the inherited theme toggle.

Keyboard checks cover opening/searching commands, arrow selection, Enter activation, empty search, Escape and focus restoration. Reduced-motion emulation reports palette animation `none`, opacity `1`; the change is scoped to app chrome rather than disabling Remotion scene animation. New-video creation is disk-backed. Navigation preserves Websites and settings access. No additional frontend runtime was added.

Fixed during verification: restored the downloaded tool launcher's permission; normalized upstream trailing newlines with attribution; scoped reduced-motion handling; enlarged the theme target; waited for entrance animations to finish before screenshots; isolated the build/data directory from the user's running server. The first production build hit a transient existing Google Font loader failure in a website template; the retry and final build passed without changing that template.

The deterministic scoped Impeccable scan completed with zero findings/advisories. A separate headless browser overlay reported 62 page-wide patterns; the Inter flag conflicts with the approved typography, while existing gallery provenance badges are outside step A. No user-visible overlay is claimed. Browser screenshots are emulated Chromium evidence; touch gestures and physical-device behavior remain untested. Later addendum stages will audit their own screens.

### Independent review closure

Assessment A: `/root/shell_design_review`; assessment B: `/root/shell_evidence_review`. Each used its own browser context. A finished before B findings entered the parent synthesis. Both agreed the shell is coherent and restrained; they independently caught the stale palette query and narrow status ambiguity. B additionally found the split keyboard model and shortcut focus return; A found the unmarked current menu route and 667x375 clipping.

Fixed: one palette opening/reset path; captured invoking focus; input-owned keyboard navigation; visible compact status, distinct icons and polite announcements; selected mobile route; viewport-constrained dialog. Motion timing now uses the shared panel token. Compact status still links directly to Connect. The original settings persistence browser test was scoped to main content because the new header status announcement made its old global status locator ambiguous.

Final proof: full `bun run verify` passed 711 tests; production build passed; all 38 Playwright checks passed from a fresh local data folder, preserving browser MP4 export, poster editing, website saving, live MCP edits/locks and comments. Nine final screenshots were refreshed at 375/768/1280/1920 px plus light mode. The three new regression cases cover stale-query/focus/Tab behavior, changing agent states and announcements, and short-landscape bounds/current navigation. No post-fix heuristic rescore is claimed.

The evidence reviewer withdrew an initial overflow attribution: it was an immediate reading after a desktop-to-phone resize without a layout-settling wait; the responsible element was not established. The shell and settled document-width regression checks pass. Do not treat that transient reading as a confirmed filter-row defect.

Run bookkeeping: target slug `src-components-studio-shell-tsx`; no critique ignore file; scoped detector successful; mutable headless injection successful but no native/user-visible overlay; owned detector server stopped with `--keep-inject`; browser contexts closed; critique snapshot written and temporary body removed; trend read succeeded and contains this first baseline only. Root's test server is stopped after verification; the user's original dev server is retained. Physical devices, virtual keyboards, assistive technology and performance profiling remain untested.

## B: event queue, authored actions and initial OpenCut adapter

The user approved step B and selected a full OpenCut classic timeline replacement. B implements durable UI-to-agent delivery; the full timeline migration is a separate, already-authorized next work item before C. See `CLIPKIT_OPENCUT.md`. The current split adaptation is not described as a full replacement.

### What is implemented

The existing video editor exposes **Agent requests & video tools**. Queue a new job, timeline comment, voice-text request or brief update at the playhead, optionally tied to the selected item. Requests persist in the project's JSON and stream back through the existing SSE synchronization. A brief update also saves the current brief. This stage queues work; automatic provider-backed execution and the guided new-video flow belong to later stages.

Shared tools now include `wait_for_events(projectId, timeout)` and `resolve_event(projectId, id, note, confirmed:true)`. Delivery atomically claims one event. The same agent receives an unfinished event again after reconnect; another agent may reclaim it after a 60-second lease. Delivery is at least once, not exactly once. A failed external client cannot silently lose an accepted request. The existing wait_for_comments/resolve_comment path remains supported; legacy comments can be received and resolved through the new event tool. Pinned events enforce item scope on agent changes; human edits remain available subject to existing locks.

Every new journal entry records author and turn ID. Actions performed while an event is claimed inherit that event's turn ID, so activity and turn undo share one identity. Existing files load with schema defaults.

OpenCut's requested MIT repository and its linked working classic repository were cloned into `/tmp/clipkit-opencut` and `/tmp/clipkit-opencut-classic`. The split command from classic was adapted into a pure frame-based video split, preserving source offsets, frame totals and punch-in regions. Import a video, select it, seek inside it, open the panel and click **Split video at playhead**. Both halves are one undoable disk action. Full upstream attribution/license is in NOTICE.md and alongside the adapter.

### Impeccable review

Method: independent design reviewer `/root/shell_design_review` and evidence reviewer `/root/shell_evidence_review`. A completed before B findings entered synthesis. Baseline design health was 27/40; technical audit 15/20. No P0/P1 defect was established. Scoped source detector returned zero findings. The bounded browser evidence pass did not inject a detector overlay; no visible overlay is claimed.

Fixed the scoped findings: a 44 px request trigger and agent-bar controls; an accessible Radix/shadcn-style Popover supporting Escape/outside dismissal and focus restoration; correct select/textarea label association; plain queue feedback and Connect recovery link; removal of raw selected UUIDs; accurate Timeline comment and Split video labels; wrapped editor tool controls on narrow widths. Timeline comments can be project-wide at the playhead when no item is selected, so the label no longer promises a selected-item scope. Existing dark semantic tokens and shadcn controls are reused. Voice is explicitly text here; microphone recording remains F.

Baseline heuristics (out of four each): status 3, familiar language 2, control 2, consistency 3, prevention 2, recognition 3, efficiency 3, visual clarity 3, recovery 3, help 3. Scores were not inflated after fixes. Cognitive load is low for type/text/queue; grouping queue and split is temporary until editor restructuring. First-time users benefit from plain completion guidance; keyboard users benefit from dismissal and correctly associated labels. Physical devices, screen readers and profiling remain untested.

### Try it

1. Run `bun run dev`, open Projects and a video project (or any gallery clip).
2. Open Agent requests & video tools, enter a new job and click Queue request. Reload and reopen the panel: the request remains queued.
3. In a connected MCP client call wait_for_events for this project, edit the returned item if pinned, and call resolve_event with the returned ID and a note. Watch the queue change to in-progress/done and the activity show the agent name.
4. Use Update brief to save and send a changed brief. Voice request (text) sends typed instructions with the current item/time; it does not record audio yet.
5. Import/select a video, seek inside it, click Split video at playhead, close the panel and Undo. The original file remains unchanged.

Verification: full verify passed 716 tests across 66 files; the production build passed; 40 browser tests passed, including UI-to-MCP event completion and persistent, undoable video splitting. Four screenshots are saved under `docs/screenshots/step-b/`. Legacy/new comment interoperability has a dedicated regression test. C-I have not started. Stop at the requested B checkpoint; the next implementation is the authorized OpenCut classic timeline migration.

Step B review snapshot: `.impeccable/critique/2026-10-31T04-38-48Z__src-components-clip-timeline-agent-requests-tsx.md`. Baseline scores remain pre-fix. Snapshot/trend writes succeeded; temporary review body removed. No browser overlay was attempted in this bounded stage. Test servers are stopped after verification; the original user dev server is retained.

Final B delivery: the latest production build passed; the complete verify gate passed all 716 tests. All 40 browser tests passed on the reviewed UI, including mobile header overlap checks. After the final legacy-comment compatibility change, the six event/live-editor cases were rerun against the final production build in another fresh data folder and all passed. `git diff --check` passed. Four final request-panel screenshots were inspected; test servers were stopped. Full OpenCut timeline replacement remains explicitly outstanding and authorized; do not mistake the initial split adapter for that migration.
