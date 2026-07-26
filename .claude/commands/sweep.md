---
description: "On-demand design + platform sweep: shake written code and propose simpler, deeper, more native alternatives"
argument-hint: "[paths | diff range] (default: current branch diff vs main)"
---

Run an on-demand **sweep** — a creative but rigorously vetted second look at code that already
works. Act as two experts in one: a master of software design (deep modules, SOLID/GRASP,
composition, correct-by-construction types) and a top-tier frontend engineer fluent in the newest
capabilities of this stack (React 19, Next 16 App Router / RSC + Server Actions, Tailwind v4 +
shadcn/ui, Bun, modern TS). Aim to surprise with a genuinely better shape — but every recommendation
must be researched and weighed, never unvetted cleverness. **Findings only — write no application
code until the user picks what to apply.**

## Scope

`$ARGUMENTS` names paths, a diff range, **or a feature/plan (e.g. `F-PLAT-018` — fetch its Plan from
Notion and sweep the *planned* design before any code exists)**; empty ⇒ the current branch's diff
against `main` (fall back to the working-tree diff). Read the target plus enough of the existing code
to judge it, then state the **judging criteria for this code** before comparing anything: which axes
dominate here — leverage (framework/platform reuse, render/SSG behavior, correctness) vs structure
(type-safety & inference, reuse surface where change is actually coming, fewest moving parts).

## Leg A — platform sweep (don't reinvent)

For each subsystem the code touches, enumerate the advanced/native capabilities that could dissolve
hand-written code or improve rendering — not the CRUD basics. Consult in order: the repo catalog
**`.claude/agent-patterns/tailwind-shadcn.md`** (design-system primitives + the Kotodama fit); the
native capabilities of **React 19** (Actions, `use`, Suspense), **Next 16 App Router** (RSC, Server
Actions, `React.cache`, the cache/revalidation model — see `.claude/rules/{nextjs,frontend-state}.md`),
and **Tailwind v4**; then the **bundled version-matched docs** (`node_modules/next/dist/docs/`) as the
framework authority, then official docs on the web — verify a feature exists in the pinned version
before recommending it.

## Leg B — design shake (the structure the problem wants)

Work from **`.claude/agent-patterns/component-design.md`** — the policy-free-frames doctrine and its
worked bad→good refactors of real `@kotodama/ui` components. Scan the diff/plan for baked-in policy,
outer-spacing leaks, and domain hard-coding; for any non-trivial component or prop shape, **sketch two
genuinely different structures** (props/usage first, implementation second) and compare against the
judging criteria.

## The taste gate — both ways, load-bearing

Recommend a candidate (native or structural) only if it removes more complexity than it adds. Flag
reinvention in **both** directions: naive code reinventing a native feature, AND an abstraction added
where flat code is honest — deleting structure is as gifted a move as adding it. Type-safety &
inference are a hard default: any `any`, unchecked cast, or a component baking a caller's decision is a
cost to justify. For the winning shape, weigh second-order consequences: render/SSG impact, what the
next likely feature costs against it, reuse surface.

## Output — a ranked findings report

For each finding: the current shape → the proposed shape (name the native primitive AND the
abstraction that houses it) → what it removes vs what it adds → verdict. Include a section for
**declined ideas** — where you deliberately kept the plain code and why. Cite each factual claim
(docs URL, bundled-doc path, or catalog §). Then stop and let the user pick what to apply.
