---
paths:
  - "readme.md"
  - "docs/**"
---

# Human-facing docs (`readme.md` + `docs/**`)

Extends `claude-md.md`'s why-not-what test to the developer-facing surface. Read it first; this file
adds only the human-doc guards.

- **Hand-write only explanation + how-to; link or generate everything reference-shaped.** Per
  Diátaxis, reference drifts fastest (mirrors machinery), explanation slowest. Each doc declares its
  mode and stays in it.
- **Commands come from `package.json` — a doc names the script, never its substeps.** Write
  `bun run --filter '@kotodama/infra' local:up` and explain *why*; a new run path is a new script
  (`local:smoke`), not a new doc paragraph.
- **Link, don't restate.** A fact lives in exactly one place; cross-reference the authoritative home
  (`.claude/rules/*`, a per-layer `CLAUDE.md`, the Tech spec, a `*.ts` source).
- **Link integrity is enforced** — CI runs lychee over `readme.md` + `docs/**` (`.github/workflows/
  ci.yml`). Don't disable it; fix the link.

## Diátaxis mode per doc

| Doc | Mode | Must NOT contain |
|---|---|---|
| `readme.md` | Orientation + how-to map | file tree · command substeps · restated rules |
| `docs/running.md` | How-to | hand-listed command steps (name the script) |
| `docs/architecture.md` | Explanation (link-hub) | restated dependency rules — link `dependency-hierarchy.md` |
| `docs/contributing.md` | How-to | restated commit/PR/tooling rules — link each source |
| *reference* | — | none is hand-written — it's the code + types + per-layer `CLAUDE.md` |

**Deliberately not done (don't re-litigate):** no typedoc/generated docs-site, no markdown doctests
(`local:smoke` is the runnable proof), no semantic doc-linter, no docs-changed CI gate / stamps /
CODEOWNERS.
