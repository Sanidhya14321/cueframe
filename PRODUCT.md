# cueframe

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Creators and developers who use coding agents to make videos and want to inspect, edit and export the result themselves.

## Product Purpose

A local video studio where an agent builds an editable timeline live. The browser remains the control center, and users can take over at any time.

## Positioning

The shared project is visible and editable between the coding agent and the exported video. Each action persists on the user's machine and updates open editors.

## Operating Context

A single Next.js, React, Remotion and Bun application on loopback. JSON projects, media and settings live locally. Claude Code and Codex use MCP; provider-backed features use the user's own credentials.

## Capabilities and Constraints

Preserve the existing gallery, clip timeline, properties, undo, browser export, poster editor and website editor. Reuse repository shadcn components and Tailwind. New third-party code requires a permissive license and NOTICE.md attribution. No accounts, database or cloud storage. Every new feature needs a UI entry point.

The UI addendum is staged A through I with user review after each stage. Durable UI requests now reach MCP agents through a local event queue. Automatic in-app job execution, the new-video brief and expanded editor panels remain later stages. Saved videos use the real OpenCut classic runtime, with native snapshots and source layers saved through shared revisioned Project actions. Remotion animations retain schema controls and individual cached layer previews. Native effects use the native rendering pipeline; the retained Remotion source workspace does not reproduce all native effects. The catalog currently has 113 clips; do not claim 1,000 clips.

## Brand Commitments

cueframe is the app name. The requested identity is a focused, dark professional creative tool with one distinctive accent, tinted neutrals, editorial headings, clear sans-serif UI and separate user-selection and agent colors. Clear, plain copy; no invented testimonials or provider-success claims.

## Evidence on Hand

Committed gallery previews, local Whisper transcription and full-fidelity render proof, revisioned action tests and HTTP MCP browser tests. Fish integration has mocked-response tests; real Fish speech and external Claude model execution remain unverified.

## Product Principles

- Keep the project editable and every change inspectable.
- Make local persistence and connection state clear.
- Preserve manual editing when an agent is unavailable.
- Keep keys masked after saving and out of logs and exports.

## Accessibility & Inclusion

Keyboard access, visible focus, reduced-motion support, no horizontal page scrolling at 375/768/1280/1920 px, minimum 12 px text and 44 px touch targets. Phone review mode is scheduled for addendum H.
