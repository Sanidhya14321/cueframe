# Third-party notices

Step 2 adds original local-storage, settings and session-protection code. No component source code or new direct packages were imported in this step; existing dependencies remain subject to their bundled licenses. The transitive dependency patch below addresses audit findings.

New imports are restricted to MIT, Apache-2.0, ISC, BSD, CC0, MIT-0 or Unlicense. A listing or repository name is not a license grant: review each actual upstream component license and exact revision before copying. The delivered sources and retained license texts are recorded below. Effects whose licenses do not qualify are implemented independently.

## fast-uri 3.1.9

- Source: <https://github.com/fastify/fast-uri>, npm release `3.1.9` (exact version pinned in the Bun lockfile and package override).
- License: BSD-3-Clause; full text retained in `licenses/fast-uri-bsd-3-clause.txt`.
- Used transitively by the existing MCP SDK and Remotion bundler. Updated from 3.1.8 to fix four URI-normalization audit findings. No upstream source modifications or vendored component files.

## Web Motion collection (25 clips)

Upstream licenses were read before adaptation. Every animation uses Remotion frames instead of timers, hover, scroll, unseeded randomness or live animation loops. Component layouts and behaviors were adapted into `src/compositions/scenes/imported/{text-effects,surfaces,cards}.tsx`, with one registered scene and typed schema per clip. No Motion, GSAP or additional UI runtime was imported. Existing bundled Inter and Instrument Serif fonts are reused.

| Source | Exact upstream commit | Full license retained |
| --- | --- | --- |
| [magicuidesign/magicui](https://github.com/magicuidesign/magicui/tree/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c) | `efe76fc5755eca1142dd4f74c1d6f0ace2887e3c` | `src/compositions/scenes/imported/magic-ui/LICENSE.txt` (MIT) |
| [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives/tree/120f64f6ca60348e251f929e9c81f11ccbe45eda) | `120f64f6ca60348e251f929e9c81f11ccbe45eda` | `src/compositions/scenes/imported/motion-primitives/LICENSE.txt` (MIT) |
| [serafimcloud/21st](https://github.com/serafimcloud/21st/tree/b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf) | `b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf` | `src/compositions/scenes/imported/21st-dev/LICENSE.txt` (MIT) |

The 21st.dev adaptations below come from its MIT-licensed platform repository; no blanket license grant is assumed for community registry components.

| Clip | Upstream component or origin | Changes |
| --- | --- | --- |
| `gradient-flow` | [magicuidesign/magicui/animated-gradient-text](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/animated-gradient-text.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `blur-stagger` | [ibelick/motion-primitives/text-effect](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/text-effect.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `letter-cascade` | [ibelick/motion-primitives/text-effect](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/text-effect.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `scramble-title` | [magicuidesign/magicui/hyper-text](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/hyper-text.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `word-flip` | [ibelick/motion-primitives/text-loop](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/text-loop.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `type-scan` | [magicuidesign/magicui/typing-animation](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/typing-animation.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `shimmer-title` | [ibelick/motion-primitives/text-shimmer](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/text-shimmer.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `count-up` | [magicuidesign/magicui/number-ticker](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/number-ticker.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `rolling-digits` | [ibelick/motion-primitives/sliding-number](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/sliding-number.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `spotlight-card` | [ibelick/motion-primitives/spotlight](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/spotlight.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `border-orbit` | [magicuidesign/magicui/border-beam](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/border-beam.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `marquee-loop` | [magicuidesign/magicui/marquee](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/marquee.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `ripple-field` | [magicuidesign/magicui/ripple](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/ripple.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `dot-wave` | [magicuidesign/magicui/dot-pattern](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/dot-pattern.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `grid-flight` | Original implementation; no third-party component code copied | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `meteor-shower` | [magicuidesign/magicui/meteors](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/meteors.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `orbit-marks` | [magicuidesign/magicui/orbiting-circles](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/orbiting-circles.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `spring-cards` | [magicuidesign/magicui/animated-list](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/animated-list.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `reveal-wipe` | [magicuidesign/magicui/blur-fade](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/blur-fade.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `browser-frame` | [magicuidesign/magicui/safari](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/safari.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `phone-stack` | [magicuidesign/magicui/iphone](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/iphone.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `shine-callout` | [serafimcloud/21st/shimmer-button](https://github.com/serafimcloud/21st/blob/b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf/apps/web/components/ui/shimmer-button.tsx) | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `aurora-ribbons` | Original implementation; no third-party component code copied | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `particle-vortex` | Original implementation; no third-party component code copied | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |
| `prism-bars` | Original implementation; no third-party component code copied | Typed editable content, palette, font and timing; frame-driven motion and browser-safe layout. |

React Bits was reviewed at its current `LICENSE.md`: MIT plus Commons Clause restrictions fall outside this project's allowlist. No React Bits implementation, studio tool or sound was copied. The grid, aurora, particle and prism backgrounds are original implementations of general visual ideas.

## Local transcription tools

- whisper.cpp: MIT, release `v1.9.5`, exact source commit `d1be6fde11ac6e0407606b4e42fe72d34add8037`. Source: <https://github.com/ggml-org/whisper.cpp/tree/d1be6fde11ac6e0407606b4e42fe72d34add8037>. Full text: `licenses/whisper-cpp-mit.txt`. The local installer checks the revision and license before building. Its source tree and licenses remain in the user's data folder; no upstream engine source is vendored in this repository.
- Whisper tiny.en model: MIT metadata from <https://huggingface.co/ggerganov/whisper.cpp/tree/5359861c739e955e79d9a303bcbc70fb988958b1>; converted OpenAI weights pinned to that repository revision. OpenAI's MIT text is retained in `licenses/whisper-model-mit.txt`. Downloaded to the local tools folder, never committed.
- Optional CMake bootstrap: PyPI `cmake==4.4.4`, downloaded from the official release metadata with SHA-256 verification. Wrapper license Apache-2.0 (`licenses/cmake-python-apache-2.txt`); CMake license BSD-3-Clause (`licenses/cmake-bsd-3-clause.txt`). This is a local build prerequisite, with its full upstream notices retained in its installation, rather than application source copied into the repository.
- The transcription adapter is original code calling the MIT engine directly. This avoids adding another Remotion package outside the explicit permissive-license allowlist. The existing Remotion dependencies retain their existing license terms.

## Audio and service integration

Beat beds, whooshes and hits are synthesized by original deterministic code in `src/local/audio.ts`; no third-party sound pack was copied. Fish Audio uses the documented HTTPS TTS API, with the user's locally stored key. No Fish Speech model weights or code were imported.

## Impeccable 4.8.0 (design tooling)

- Source: <https://github.com/pbakaus/impeccable> at commit `df3a4abe7d0840d5f60324812c432e00b66a4e75`.
- Apache-2.0; full license in `licenses/impeccable-apache-2.txt`, upstream attribution notice in `licenses/impeccable-upstream-notice.md`.
- Installed the official `.agents/skills/impeccable` skill, references and launcher into the same project-local path. Upstream wording is unchanged; trailing newlines were normalized to satisfy repository hygiene. The launcher executable bit was restored after download. This is development tooling, not a browser dependency. PRODUCT.md, DESIGN.md and cueframe UI code are project-specific work.
- Impeccable's native-platform reference notes derive from ehmo/platform-design-skills (MIT); the upstream notice is retained above and the full MIT text is in `licenses/impeccable-platform-design-mit.txt`. These references are tooling only; cueframe uses the web guidance.

## OpenCut editor integration

- Requested repository cloned for review: <https://github.com/opencut-app/opencut> at `e668010778568641babef2cc40be4703ae6916d6`, MIT. This revision is a Rust-core rewrite; its README directs users to the working classic editor.
- Adapted source: <https://github.com/opencut-app/opencut-classic/blob/cf5e79e919144200294fb9fed22a222592a0aeea/apps/web/src/commands/timeline/element/split-elements.ts> (MIT).
- Adapted into `src/project/opencut/split-video.ts`: frame-based split bounds, left/right duration calculation and source-offset preservation. Replaced OpenCut singleton commands, WASM MediaTime, retiming and scene model with cueframe's pure Project model, IDs and existing persistence/undo; restricted to normal-speed video. Punch-in regions are partitioned. This adapter uses no OpenCut brand assets or services; native runtime dependencies are documented below.
- Full original classic license is retained alongside the adapter at `src/project/opencut/LICENSE.txt` (line endings normalized only).

### OpenCut classic timeline UI replacement

- Same MIT source revision `cf5e79e919144200294fb9fed22a222592a0aeea`.
- `apps/web/src/timeline/ruler-utils.ts` is ported into `src/components/opencut-timeline/ruler-utils.ts`; removed comments and WASM/FrameRate imports, kept upstream interval selection, label divisibility and timestamp formatting, and adapted zoom to cueframe pixels per frame.
- Adapted classic `components/timeline-ruler.tsx`, `timeline-tick.tsx`, `timeline-playhead.tsx`, `timeline-track.tsx`, `timeline-element.tsx`, `timeline-toolbar.tsx` and `layout.ts` into the new ruler, canvas, clip, track and toolbar modules under `src/components/opencut-timeline/`. Full MIT license is retained in that directory.
- Replaced EditorCore subscriptions, WASM time, scene managers and command history with typed cueframe Project/FrameStore callbacks. Added pointer/touch capture, cancellation, keyboard seeking/selection, visible-range tick rendering, semantic design tokens and accessible track menus. cueframe's canonical reducers, local persistence, agent locks, undo and Remotion rendering remain responsible for project behavior. This compatibility timeline does not use OpenCut storage/authentication or its native renderer; the separate native workspace below does.
- The old timeline canvas, track and block renderers were removed from the active implementation. The old public timeline imports are compatibility entry points into the new adapter. Existing export controls are reused by the replacement toolbar.

### OpenCut classic native editor runtime

- Source: <https://github.com/opencut-app/opencut-classic/tree/cf5e79e919144200294fb9fed22a222592a0aeea/apps/web/src>, MIT. Full source snapshot is `integrations/opencut/source.tgz`, integrity metadata in `source.json`, license in `integrations/opencut/LICENSE.txt`.
- Bundled the actual EditorCore, timeline commands/UI, preview/compositor, media/text/effects/settings/inspector panels and export UI into `public/opencut`. cueframe's host is a same-origin static runtime in the existing Next app. No OpenCut accounts, database, cloud endpoints, Pro icons or brand artwork are used.
- `integrations/opencut/build.ts` applies the patches and `overrides/` contains cueframe-authored disk storage, browser media, muxing, layout, theme/font bridge, navigation/save handshake and accessibility adaptations. Disabled unsupported pitch preservation; removed IndexedDB project migrations; propagated save failures and retained dirty state. Replaced the effect preview photo with an existing cueframe still.
- Mediabunny and SoundTouch are not installed or bundled. Browser APIs/WebCodecs plus MIT mp4-muxer 5.2.2 and webm-muxer 5.1.4 replace them. mp4-muxer/webm-muxer are Copyright (c) Vanilagy; full notices are in `licenses/opencut-runtime`.
- `licenses/opencut-runtime/inventory.json` lists all 93 bundled npm packages, versions and retained license files. The build rejects unreviewed/non-permissive runtime package licenses. Runtime SPDX identifiers are MIT, Apache-2.0, ISC and 0BSD. The existing Tailwind/PostCSS build toolchain is reused; this runtime audit is not a relicensing of the repository's pre-existing development dependencies.
- For npm packages that omit their license file, the same upstream project's MIT notice is retained: Radix primitives from radix-ui/LICENSE; Hugeicons free icons from Hugeicons' MIT LICENSE.md (no Pro license/icons); opencut-wasm from OpenCut's MIT license; react-remove-scroll-bar from its upstream MIT LICENSE. Existing notices are preserved with LF line endings only.
- Native documents and source layer projections save through the shared cueframe action/history model. Remotion schema layers retain individual cached previews; local native exports use the OpenCut renderer. See `docs/CUEFRAME_OPENCUT.md` for rendering boundaries.

- cueframe-authored shared bridge files under `integrations/opencut/overrides/` adapt source layers, selection/playhead context, lock checks, disk revisions, SSE updates and native rendering. Source schema metadata and source offsets are retained. The native scene switcher is hidden to match cueframe's single shared timeline.
- Local preview/render workers use Playwright 1.64.0 (Apache-2.0). Its complete LICENSE and NOTICE are retained in `licenses/playwright-apache-2.txt` and `licenses/playwright-notice.txt`. Playwright controls the local Chromium renderer and is not part of the browser editor bundle. Its installed Chromium distribution retains its upstream notices in the browser cache.

## Website template fonts

Bodoni Moda, EB Garamond, Jost, Fredoka, Nunito, Fraunces, Caveat, Poiret One and Gochi Hand are bundled from Fontsource packages under the SIL Open Font License 1.1.

## Hugging Face Transformers.js

`@huggingface/transformers` (Apache-2.0) runs the local clip embedding model. The Xenova/all-MiniLM-L6-v2 model (Apache-2.0) downloads on first search.
