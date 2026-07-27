---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript conventions

Two idioms Biome can't enforce.

- **`type`, never `interface`.** Declare every object/prop/option shape as a `type` alias; compose
  with `&`, derive off the owner with `Pick`/`Omit`/`T['k']`. (Rationale: avoid `interface`
  declaration-merging silently widening a type.) **Exception:** `*.gen.ts` — `openapi-typescript`
  emits `interface`; generated, never converted.
- **Drop return types `tsc` already infers identically** (delete-test: strip it; if `tsc` passes and
  nothing widened, leave it deleted). **Keep** a return annotation only when it does work the body
  can't: a generic assertion `tsc` can't infer (`unwrap<T>(): T`); a contract check that must fail
  the build (`narrowWordState(): WordState`); or a framework contract validated nowhere else
  (Next `robots`/`sitemap`/`generateMetadata`).
