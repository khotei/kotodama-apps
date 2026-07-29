---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/package.json"
---

# Naming & TypeScript conventions

- **Packages:** `@kotodama/<folder>`, nested folders dash-flatten. `core`/`platform` are single
  packages with subpath-exported layer folders; `ui` = `@kotodama/ui`; presets = `@kotodama/presets`
  (`infra/presets`); apps drop the plural (`apps/web` → `@kotodama/web`).
- **All source files are `kebab-case` whatever they export** (`status-badge.tsx` → `StatusBadge`), plus a
  dotted **role suffix** `<name>.<role>.ts` — the index into a tier:

| Suffix | Role | Layer |
|---|---|---|
| `.repo.ts` | bare `fetchX` functions (`fetchWord`) | `core/repositories` |
| `.entity.ts` | contract types as fetched (`WordEntity`) | `core/repositories` |
| `.factory.ts` | test-only faker `make*` builders | `core/factories` |
| `.model.ts` | domain model derived off the wire (`WordListItem`) | `core/words` |
| `.loaders.ts` | `load*` reads (`loadWordsOfTheDay`) | `apps/web` (`src/<domain>/server` · route `server/` · route `components/<section>/`) |
| `.requests.ts` | `'use server'` `request*` commands — the Server Actions | `apps/web/src/<domain>/server` |
| `.mapper.ts` | pure wire→View map (`wotdViewsFrom`) — split out only when non-trivial | `apps/web/src/<domain>` · route `components/<section>/` |
| `.view.ts` | React render shape | `ui` (`src/views/`) |
| `.fixture.ts` | curated design mocks for stories | `ui` (`src/fixtures/`) |
| `.client.tsx` | a `'use client'` island | `ui` · `apps/web` |
| `.stories.tsx` | Storybook story | `ui` |
| `*.gen.ts` | GENERATED, never hand-edited | `platform/api-client` |

  Server is the default → UNmarked; only the client island is marked `.client.tsx` (not to be
  confused with api-client's transport `client.ts`). Component files take **no** dotted role suffix;
  their kind rides the kebab **base name** → symbol: a smart data-fetching RSC =
  `<feature>-container.tsx` → `<Feature>Container` (loads + maps + renders a ui feature); a
  single-purpose CSS wrapper = `*Wrapper`; a page-level layout skeleton = `*Template`. Base
  names: in `core/words` the base name is the domain noun (`word-state.model.ts`, mirroring the
  backend's dotted roles) — likewise in a `server/` data folder (`word.loaders.ts`,
  `word.requests.ts`); elsewhere in `apps/web/src/<domain>/` the base name LEADS with the domain
  folder's name (`words-search.mapper.ts`, `words-hrefs.ts`) so a tab/grep hit names its module.
  Tests mirror the source name (suffix included) under the workspace's `test/` (per-domain
  subfolders where the layer has them).
- **Symbols:** props type `<Component>Props` (a `type`, never `interface`). The data tiers own
  reserved verb prefixes — `fetch*` wire call taking `client` first (`fetchWord`), `load*` read
  (`loadWordsOfTheDay`), `request*` `'use server'` command (`requestWordBuild`); any other
  verb is not a data function. Domain types are bare nouns (`WordState`, `ReadingRoomData`) —
  only the boundary tiers carry a postfix: wire `*Entity`, render `*View`. Value/enum types
  (`Language`, `JobStatus`) stay plain; **never suffix a type `<X>Schema`.**
- **Handler vs function:** a callback wired to an `on<X>` prop is a **handler** → `handle<X>`
  mirroring the prop (`onSearch` → `handleSearch`, `onQueryChange` → `handleQueryChange`); a
  function that does the work and is called by name stays a plain verb (`searchWords`,
  `languageLabel`) — never `handle`-prefix it, even when passed straight to an event
  (`onClick={remove}`). Extract a handler to a `const` ONLY when reused (an immediate call + a
  debounced one); a once-used handler inlines (`onOpen={() => setOpen(true)}`).
- **`function` for workers, arrow for callbacks** (mirrors the backend): a named worker you invoke
  by name is a `function` declaration (`function searchWords(q) {…}`), even when it's also handed
  to a utility (a debouncer); a callback stays an arrow — an inline `.then`/`.map`/`on*`/hook
  argument (`useMount(() => searchWords(''))`) or a named `handle*` (`const handleSearch = …`).
- **Props: destructure ≤3, namespace above.** A component with **more than three** own props takes
  a single `props` param and reads `props.x` (no signature destructuring, defaults land at the use
  site — `props.empty ?? 'No results.'`); three or fewer destructure in the signature. **Exception —
  rest-spread passthrough:** a frame forwarding `...rest` to a host element (`<Link {...props}>`, a
  DOM primitive) keeps destructuring at any count — peeling the rest off the named props is what
  makes it structural, not stylistic (`RankRow`, `Seal`, `Badge`). Inline callback destructures
  (`.map(({ href }) => …)`) are untouched — the rule governs the props parameter alone.

## TypeScript idioms (Biome can't enforce)

- **`type`, never `interface`.** Declare every object/prop/option shape as a `type` alias; compose
  with `&`, derive off the owner with `Pick`/`Omit`/`T['k']`. (Rationale: avoid `interface`
  declaration-merging silently widening a type.) **Exception:** `*.gen.ts` — `openapi-typescript`
  emits `interface`; generated, never converted.
- **Drop return types `tsc` already infers identically** (delete-test: strip it; if `tsc` passes and
  nothing widened, leave it deleted). **Keep** a return annotation only when it does work the body
  can't: a generic assertion `tsc` can't infer (`unwrap<T>(): T`); a contract check that must fail
  the build (`libraryViewFromModel(): LibraryView`); or a framework contract validated nowhere else
  (Next `robots`/`sitemap`/`generateMetadata`).
