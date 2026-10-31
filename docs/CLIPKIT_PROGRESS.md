# ClipKit steps 3-10

The latest request approved steps 3-10 as one batch. Steps 11 (shared in-app project chat and Codex bridge) and 12 (launcher/package) are pending. The original prompt remains in `CLIPKIT_PROMPT.md`.

## Run and try each step

Run `bun install` if needed, then `bun run dev`. Open <http://127.0.0.1:3000>. Existing gallery, poster and website editing remain available. All project data stays under the folder selected in Settings, initially `~/ClipKit`.

| Step | What to click or run | Expected result |
| --- | --- | --- |
| 3: live projects | Open a gallery clip, change its text, then open Projects and reopen it. Reload the editor. Open the same project in two tabs and edit one. | Changes persist on disk and appear in both tabs. The sync indicator reports Saved locally or Reconnecting. Media imported through Media & render persists after reload. |
| 4: MCP | Open Connect, click Copy Claude Code command, paste it into a terminal, then open Claude Code and run `/mcp`. Ask it to list projects, open one and add a clip. | The connection indicator shows the client; item edits stream into the open editor. The command includes the current session token, so copy it again after restarting the server. |
| 5: presence | Ask the connected agent to call set_agent_status with working, a label and an existing item ID, then update_props on that item and set idle. | The agent bar names the task, the item gets an outline/lock and its inspector is disabled. Other items remain editable. Activity selects changed items; Undo agent turn reverts that turn while retaining unrelated edits. Locks expire after 60 seconds without activity. |
| 6: beat sheet | Projects → New project → Build from beats → Build 30-second video. Close the menu and press Play. Alternatively ask Claude Code to build a 30-second video using 12-16 short segments. | Sixteen editable clips arrive progressively, with generated beat music, cut whooshes, landing hits and a drop. MCP supports optional project music and aspect/length choices. |
| 7: comments | Select an item, position the playhead, open Comments, enter a note and click Send to agent. Ask the agent to wait_for_comments, edit the returned item and resolve_comment. | The comment progresses from open to in progress to done and displays the resolution note. While handling a pinned comment, the agent cannot change unrelated items. Clicking a comment selects/seeks its item/time. |
| 8: Whisper | Media & render → Set up local Whisper. Import a talking MP4, select its timeline item, optionally enter emphasis words, then Cut and caption selected video. Terminal setup: `bun run whisper:setup`. | Local job progress leads to split video items with source offsets, filler/pause removal, word-timed highlight captions and 115% emphasis punch-ins. The original file stays intact. |
| 9: voice/export | Save a Fish Audio key in Settings. In Media & render enter a Fish Audio voice ID and selected-item voice text, then Generate voiceover. Beat-sheet voiceLine values can also supply the text through MCP. Click Render full-fidelity MP4 and then Download rendered MP4. | Speech is cached in project media, aligned to items and ducks music underneath. Without a key the task reports a clear skip. Render progress ends with an MP4 in the project's out folder. The existing Export button still renders in the browser. |
| 10: web motion | Return to the gallery and search `Web Motion`, `Magic UI`, `Motion Primitives` or `21st.dev`. Open a clip; edit its text, colors, fonts and timing. | Twenty-five new deterministic clips have committed previews and source/license badges. The catalog now lists 113 clips. |

## Implementation and proof

- One typed action dispatcher wraps the existing project mutations and validation. Browser gestures, API/MCP edits and undo write atomic, revisioned project JSON. Cross-worker disk locks serialize writers; stale revisions return a conflict and trigger resynchronization. SSE polls disk changes every 250 ms, including writes from other route workers.
- Media uploads are bounded at 256 MB and served through authenticated project routes with byte-range support. Server rendering embeds private media into a temporary worker input and deletes that input afterward.
- Playwright covers an external API action changing an open editor and surviving reload, real HTTP MCP update_props, server-side locked-item rejection (423), grouped agent undo, pinned comment delivery/resolution, and the progressive sixteen-clip build. Unit tests also check stale revisions, selective undo, comment scope and lock enforcement on reset/undo/bulk changes.
- Native local Whisper setup and transcription ran successfully on this macOS machine using a generated speech MP4: eight word timestamps, video cuts and highlighted captions. A local full-fidelity job rendered that project to a 468,145-byte MP4. The transcription adapter invokes MIT whisper.cpp directly to keep the new dependency within the requested license allowlist.
- Fish request headers/body, WAV decoding, text-hash caching, timeline alignment and duck regions are tested using a synthesized WAV response. No paid Fish request was made. A real key and voice ID are still needed to verify provider-generated speech quality.
- The actual Claude Code model was not launched or configured automatically. The official HTTP setup command was checked, and the MCP transport/tool-to-editor flow was exercised directly. External Claude execution remains a user-run acceptance check.
- All 25 new preview videos/stills were rendered and reviewed. Each also rendered short and long headline samples. An identical-frame SHA-256 comparison passed independently for all 25 clips. Source URLs, exact commits, adaptation details and complete license texts are recorded in `../NOTICE.md` and adjacent license files.

## Choices and limits

- The existing layered model already handles sequential clips, so no separate sequence track was necessary. Generated sound effects and beat music are original deterministic WAV synthesis.
- Twenty-five clips include MIT adaptations from Magic UI, Motion Primitives and the 21st.dev platform, plus original effects. React Bits currently adds a Commons Clause; none of its source was copied. Community components on 21st.dev were not treated as blanket MIT permission. Existing bundled fonts were reused.
- Whisper defaults to the small English tiny.en model. First setup downloads about 75 MB plus source/build tools, requires Git and a C++ compiler, and may take several minutes. Automatic CMake download is available on macOS/Linux; Windows needs local build tools. Native validation was on macOS only.
- Beat-sheet lengths must fit 2-4 beats per segment at the chosen tempo; invalid combinations produce an explanatory error. Voice lines longer than twice their segment capacity are rejected rather than silently truncated. Small effects/export differences still depend on the existing browser renderer's CSS support.
- Full-fidelity render needs the source checkout, Bun and Remotion's local browser tooling for now. Distributable standalone assets and the launcher belong to step 12.

## Validation commands

```sh
bun run verify
bun run build
bun run test:e2e
bun run catalog:build
bun run scripts/check-web-motion.ts
```

The full verify gate passed 711 tests across 65 files, including lint, comment/path/size hygiene, knip and strict TypeScript. The production build passed. All 29 Playwright checks passed against a fresh data folder, including actual browser MP4 export, poster editing and the AI stream replay. Two additional fresh-folder runs repeated all four live-project workflows. `bun audit` reported no vulnerabilities across 667 packages. `git diff --check` passed.
