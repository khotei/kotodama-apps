# Code comments

**Always-loaded rule.** Default: **no comment** — a stale comment an agent trusts is worse than
none. Comment the **WHY**; code states the WHAT.

- **Keep a comment ONLY for one of:** a non-obvious decision + the rejected alternative (stops an
  agent "fixing" it back); a gotcha / non-local coupling; an invariant the type can't express; a
  usage constraint on an exported symbol.
- **Never write:** line narration or step markers, a doc block re-saying the function name, a
  `@param` restating a type, or provenance tags (`(T0N)`, feature §refs) — traceability lives in the
  commit `Refs:` footer.
- **Form:** a survivor is a TSDoc `/** */` block on the symbol — one declarative sentence a caller
  can use it from without reading the body (+ an optional second paragraph for the gotcha). A `//`
  is for a pinpoint gotcha inside a body. Tags: `{@link}`, `@see`, `@example`; never `@since`/
  `@category`/docgen tags (Kotodama isn't a published library).
- **A wrong comment is deleted, never "updated"** — if a code change makes it wrong it was
  restating the code. Never touch comments on exploratory edits.
- **Never strip** `biome-ignore`, `@ts-expect-error`, `@ts-ignore`, `eslint-disable`, shebangs, or
  build pragmas — they are code, not prose.
