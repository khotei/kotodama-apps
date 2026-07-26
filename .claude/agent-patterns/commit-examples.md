# Commit message examples (on-demand)

Worked example for `.claude/rules/commits.md`, which owns the **format spec + gitmoji table + a
`feat` example** always-loaded. The **format source of truth is the rule** — read this only when a
non-trivial commit needs a model of the project-specific `Decision:` + `Refs:` trailer in use.

## fix (with Decision)

```
:bug: fix(ui): Stop LibraryScreen re-fetching on theme toggle

The word grid re-ran its loader whenever next-themes flipped the html
class, because the theme provider sat above the RSC boundary. Move the
provider into a client island so the server tree stays static.

Decision: Kept the theme a client island rather than reading a theme
cookie in the loader — a cookie read makes the public route dynamic and
silently kills SSG (nextjs.md). The island re-renders; the prerender
stays.

Refs: https://www.notion.so/<sub-task-url>
```

A purely mechanical refactor may omit `Decision:` (the rule marks it optional); a `chore` scopes as
`F-AREA-NNN/T0N`. Both shapes live in `commits.md`.
