# Maintaining `CLAUDE.md` and rules (context, not a code dump)

**Always-loaded rule.** A `CLAUDE.md`/rule caches only what the **code can't say** — the
*why* and non-local constraints. Every line is paid for each session.

## Before writing any line

Write it ONLY if a reader would get it wrong or waste real time without it, AND it isn't
already gettable from the code, the stack, or the surrounding style.

**Sharp signal:** if a rename/refactor forces a doc edit, the doc held *what*, not *why* —
**delete the line, don't update it.**

## Hard limits

- Package `CLAUDE.md` ≤ ~40 lines; rule file ≤ ~80. Over budget ⇒ cut, don't append.
- **Decision history lives in commit messages, never here.** No dates, no
  "supersedes/reversed" chains, no task/AC/feature numbers, no tombstones for moved code —
  a doc states only the *currently binding* constraint.
- **No behaviour narration:** never name a function and say what it does; no per-export
  signature/return listings; no test-file narration (keep run command + non-obvious reqs).
- **One author per fact** — if another doc states it, link by name; never restate.

## Belongs (keep)

Binding decisions + the rejected alternative · invariants types can't express + cross-file
coupling · non-obvious gotchas (footguns, ordering, version quirks) · boundaries (import
rules, ownership, single-source-of-X) · pointers (Notion, `agent-patterns/*`, the file).

## On-demand reference (`agent-patterns/*`)

Pointer-loaded, so it doesn't tax the always-on budget — but the why-not-what test applies
*harder*: a cheat-sheet for a **stable, well-known API** (standard shadcn/Tailwind, generic TS,
textbook design theory) teaches what the model already knows → cut it. Keep only a **fast-moving
target it gets wrong**, or **this repo's own decisions/components**. Every anchor must name a symbol
that exists in THIS repo — a dangling or wrong-repo anchor is worse than no file.

## Timing

Refresh only when a real change lands, as part of the commit — never on exploratory edits.
When in doubt, cut: a missing line costs one `Read`; a wrong line costs a confident mistake.
