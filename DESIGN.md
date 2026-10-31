# ClipKit design system

## Direction

A dark editing desk: quiet, slightly green-tinted graphite surfaces, warm off-white content, an acid-green primary action. Precise chrome surrounds the work; the video and gallery provide visual variety. No gradient branding, decorative glass, fake metrics or repeated dashboard cards.

## Scope and modes

The shared app shell is Operate: task access, project context and honest connection state. The gallery is Experience: previews lead. Keep clip artwork, posters, website templates and public previews independent of the app theme. Home, new-video and editor changes follow their own approved addendum stages.

## Tokens

`src/app/globals.css` is the single token source, exposed through Tailwind's inline theme and existing shadcn tokens. Dark is the first-run default; an existing light/system preference is respected.

- Primary: acid green, used for the main action and keyboard focus.
- User selection: cyan; agent activity and locks: amber. Neither relies on color alone.
- Surfaces: canvas, card, popover and inset backgrounds form a restrained elevation sequence.
- Typography: existing bundled Instrument Serif for editorial/display headings; Inter for labels, controls and body text; tabular numerals for time and measured values.
- Type scale: 12/14/16 px UI and 24/32/48 px headings, with fluid display sizing when needed.
- Spacing: 4/8/12/16/24/32/48/64 px. Tight related controls, generous section separation.
- Radius: 6 px controls, 12 px panels/dialogs. Pills reserved for compact statuses.
- Shadow: one offset, blurred elevation token for transient surfaces.
- Motion: 120 ms feedback, 180 ms menus, 240 ms panel changes, ease-out. Reduced motion removes animation and nonessential transitions; video playback remains user-controlled.

## Shared shell

56 px persistent top bar with home wordmark, New video, Projects, Library, connection status, Settings and searchable commands. Websites remains discoverable for compatibility. Small screens retain icon-sized actions with accessible labels and a real menu; larger screens expose navigation labels. Every shell touch target is at least 44 px.

The command palette uses the existing shadcn Dialog and Input. Cmd/Ctrl+K opens it; type filters; arrows move; Enter runs; Escape closes and restores the invoking focus. Every opening path resets the search. Option rows stay out of the Tab order so the combobox owns arrow navigation. Navigation works with keyboard and pointer. Unimplemented workflows must not masquerade as working actions.

## States and rules

A connection is waiting, connected or unavailable with both text and an icon. On phones it shows Checking, Offline, Online or Error; tablet/desktop space allows fuller text. Accessible copy names the agent and polite updates announce state changes. Loading does not assert an agent is connected. Errors include a recovery route. Theme surfaces, caret, focus, selection and scrollbars share tokens. Avoid raw colors in new app components. Use semantic HTML and accessible labels for icon-only actions.

## Current acceptance

Step A covers design records, tokens, shell, library access, a working blank-project entry and commands. It does not implement the home redesign, AI brief, job queue, expanded settings or phone review mode. Impeccable critique/audit evidence and screenshots live in `docs/CLIPKIT_UI_REVIEW.md` and `docs/screenshots/step-a/`.

Step B extends this system with a shadcn/Radix request Popover: 44 px triggers, Escape/outside dismissal, correct form labels, plain queue feedback, and a Connect recovery link. Queue/brief/voice-text context is visible; recording and automatic execution are not implied. Its four-width screenshots and independent review are in the same UI review record.


## OpenCut workspace

Saved video pages open the real classic editor core and native controls. The same-origin runtime inherits root semantic colors, theme preference and bundled font faces; the host reuses repository shadcn controls. Assets, preview, inspector and timeline retain familiar editor structure. Inspect remains available through a named tab on narrow screens. Native media insertion and timeline controls have visible labels/focus and 44 px actions. Status distinguishes saving, saved and failed; navigation checkpoints save before leaving. Source controls and native effects are distinguished when switching to the retained Remotion workspace. Compact screens collect shared project tools into one popover so the native preview remains usable. This does not advance addendum C-I.
