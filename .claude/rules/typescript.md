# TypeScript conventions

**Always-loaded rule.** Two repo-wide idioms Biome can't enforce (no `consistent-type-definitions`
rule; `noInferrableTypes` skips return positions), so they live here.

## `type`, never `interface`

Declare every object / prop / option shape as a `type` alias. Compose with `&` (not `extends`);
derive off the owner with `Pick`/`Omit`/indexed access `T['k']` rather than restating a shape.

- **Why one form:** `type` also expresses the unions, intersections, mapped and conditional shapes
  `interface` can't, so switching forms per shape buys nothing. The single thing `interface` uniquely
  enables — declaration merging — is a footgun here (an accidental second declaration silently
  widens a type), and nothing in this repo relies on it.
- **Naming is unchanged:** a component's props type is still `<Component>Props` (`naming.md`).
- **Exception — `*.gen.ts`:** `openapi-typescript` emits `interface` (`paths`/`components`/
  `operations`). Generated, never hand-edited — the generator owns its output; don't convert it.

## Drop inferable return types

Don't annotate a return type `tsc` already infers identically — let the value speak (`fetchWord`,
the `createApiClient` factories). A restated return type is a second thing to keep in sync and can
orphan the imports it names. **Test:** delete the annotation; if `tsc` still passes and no downstream
type widened, it was redundant — leave it deleted.

Keep a return annotation **only** when it does work the body can't assert on its own:

- a **generic assertion** `tsc` cannot infer — `unwrap<T>(): T` (`data` is `T | undefined`);
- a **contract check that must fail the build** — `narrowWordState(): WordStateModel` forces the
  `else`-arm assignability check that turns a new backend status into a compile error;
- a **framework / external contract validated nowhere else** — Next `robots`/`sitemap`/
  `generateMetadata`, or a test fake typed `: typeof fetch`.

Inferable ≠ load-bearing: strip the first, keep the second.
