---
target: Step B agent requests and authored activity
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
target_identity: "file:/Users/sanidhyavats/Downloads/clipkit-web/src/components/clip-timeline/agent-requests.tsx"
target_fingerprint: "sha256:8992a0b3570b56fc0b6132f6824706a8b71469a741108efd546e83ad36a096fc"
target_path: /Users/sanidhyavats/Downloads/clipkit-web/src/components/clip-timeline/agent-requests.tsx
timestamp: 2026-10-31T04-38-48Z
slug: src-components-clip-timeline-agent-requests-tsx
---
Method: dual-agent (A: /root/shell_design_review; B: /root/shell_evidence_review)

# Step B agent requests and authored activity

Mode: Operate. Scope: the new request queue panel, authored activity, and initial video split entry. Full OpenCut classic timeline replacement is separately authorized and remains the next implementation after B's checkpoint, before C.

## Baseline design score

| Heuristic | Score |
| --- | --- |
| System status | 3/4 |
| Match with users' language | 2/4 |
| Control and freedom | 2/4 |
| Consistency | 3/4 |
| Error prevention | 2/4 |
| Recognition | 3/4 |
| Efficiency | 3/4 |
| Visual clarity | 3/4 |
| Error recovery | 3/4 |
| Help | 3/4 |
| Total | 27/40 |

Technical baseline: 15/20, five dimensions scored 3/4 each. Scoped source detector: zero findings. Scores are before fixes; no post-fix rescore is claimed.

## Verdict and strengths

The panel uses cueframe's approved dark semantic surfaces and editorial heading, with a short type/text/queue workflow. Native select, shadcn textarea and explicit voice-text wording keep expectations honest. Jobs persist locally; success clears the field and appears in the list. A mocked server failure retains the user's draft and provides recovery copy. The split explanation correctly promises an undoable edit rather than a complete editor replacement.

## Priorities and fixes

- P2: Disclosure, Activity and Undo agent turn targets were only 16 px high at desktop widths. Increased controls to 44 px minimum; tool row wraps on narrow screens. Suggested guidance: adapt.
- P2: Floating request details lacked Escape/outside dismissal. Replaced them with the existing Radix-based UI primitive pattern: Popover, supporting dismissal and focus restoration. Guidance: harden.
- P2: Request-type visible label targeted the textarea. Select and textarea now have their own IDs and correct labels. Guidance: harden.
- P2: Queue confirmation exposed a tool name; introduction described a future flow. Replaced with plain local-queue feedback and a Connect recovery link, without claiming automatic provider execution. Guidance: clarify.
- P2: Item comment label promised an item even with no selection. Renamed Timeline comment; selected item scopes the event when present, otherwise it is at the playhead. Guidance: clarify.
- P3: Internal selected UUID was shown to users. Replaced it with a readable item type/clip name. Guidance: polish.
- Screenshot verification caught mobile header crowding from the existing AI trigger. Kept its accessible name and used compact 44 px icon controls at phone width. Added explicit header overlap checks.

No P0/P1 defect was established. The source detector did not find these interaction/copy issues; independent browser/source review did.

## Cognitive load and personas

Composition load is low: choose a type, enter the request, queue. Queue and split controls temporarily share the same surface until later editor restructuring. Jordan needs plain feedback instead of API names; Sam needs correct labels, comfortable targets and predictable dismissal; Alex benefits from a readable selected target and draft-preserving retry. Those findings were addressed without changing the larger editor architecture.

## Evidence limits

A inspected a fresh isolated project at four widths. B used a separate headless Chromium context, created two test requests and verified failure/draft retention, panel bounds and control dimensions. A completed before B findings entered parent synthesis. No native browser/physical device, assistive-technology session or profiling was used. The bounded B pass did not inject a browser detector overlay; no overlay is claimed. Owned browser contexts were closed. Parent verification includes actual HTTP MCP claim/edit/resolve delivery, persistent metadata and video split/undo; final results and screenshots are in docs/CUEFRAME_UI_REVIEW.md.

Questions skipped: the user already chose full OpenCut classic timeline replacement. Pause at B as requested, then continue that authorized migration before C.
