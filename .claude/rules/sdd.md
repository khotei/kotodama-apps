---
paths:
  - ".claude/commands/**"
  - ".claude/agents/**"
  - ".claude/sdd/**"
---

# SDD command & agent toolkit — conventions

The `/sdd:*` commands + subagents are the **compiled form** of the
[SDD playbook](https://www.notion.so/36dfb28bd5f181238a86d26457bc24e7) (canonical source).
Loaded on-demand. Feature: F-PLAT-006.

> **The playbook stays canonical; commands are generated from it.** Any `/sdd:` change = edit the
> playbook §, then regenerate the command. Don't let a command drift from its source section.

Operational rules the loop enforces: contract first (ACs/tests before fill; `/sdd:implement` writes
the failing test first) · the heavy review lands once, on the plan · each slice ≤ ~400 LOC · verify
is evidence (a fresh `verifier` re-checks, output shown).

## Layout

- **Commands flat** in `.claude/commands/` with **literal-colon filenames** (`sdd:specify.md` →
  `/sdd:specify`). **Never nest** under `commands/<dir>/` — subdir namespacing is undocumented.
- **Shared bundle** in `.claude/sdd/` — a **non-command** folder so its files never register as
  commands: `feature-template.md`, `task-template.md`, `property-contract.md`, `data-sources.md`.
- Every generated file begins with the re-sync header pointing back at its playbook §:
  `<!-- Generated from SDD playbook §X — <link>. Re-sync on change. -->`
- **`@`-reference the bundle, never inline it** — the single shared file is the real drift defense.

## Tool boundaries

- A command's **`allowed-tools` GRANTS/pre-approves — it does NOT restrict** which tools are
  available. Never rely on it for a "refuses to X" guarantee. The only hard boundary is the subagent.
- **No-code agents (spec-author, planner, task-splitter, researcher, verifier) use `disallowedTools`
  (e.g. `Edit, Write, NotebookEdit`, +`Bash` for non-implementers), NOT an allowlist.** Reason: a
  denylist expresses "cannot touch code" AND lets the agent inherit the connected Notion MCP under
  whatever name it has — so no agent file hardcodes a per-connection server id. We deliberately do
  NOT commit a `.mcp.json`, so agents stay portable by never naming the Notion server.

## Fork map — interactive phases CANNOT fork

`AskUserQuestion` (and `Agent`/`ExitPlanMode`/…) is unavailable to subagents, and a fork runs to
completion — so any phase that must ask the user mid-run lives in the **main context** (it adopts
its agent's discipline by `@`-referencing the agent file, without the hard tool-lock).

| Command | Runs in | Agent | Restriction |
|---|---|---|---|
| `/sdd:research` | fork | `researcher` | denylist: no code |
| `/sdd:specify` | fork | `spec-author` | denylist: no code |
| `/sdd:clarify` | **main** | `spec-author` | grill-me `AskUserQuestion` loop |
| `/sdd:plan` | fork | `planner` | denylist: no code |
| `/sdd:tasks` | **main** | `task-splitter` | iterates to approval |
| `/sdd:implement` | **main** | `implementer` | full tools (writes code) |
| `/sdd:verify` | fork | `verifier` | denylist: no code; fresh ctx |

## Standing decisions

- **Artifacts are Notion-only** — no local `specs/F-NNN-slug/` mirror (divergence from playbook
  §1.4/§3). Recorded so a future reader doesn't "restore" the folder.
- **AC notation is EARS only** (*WHEN … THE SYSTEM SHALL …*) — never mix in Gherkin Given/When/Then.
- **Notion degradation:** if the MCP isn't connected, fall back to "paste the spec/task body" and
  run from the command's embedded recipe.
