import type { operations } from '@kotodama/platform/api-client'

// ui reads the generated WIRE CONTRACT (type-only), never the store domain model
// (`narrowWordState`/`WordStateModel`) — the design system stays independent of
// the app's domain. Both derive from the same `operations` root, so the app's
// model is structurally assignable here with no runtime mapper; the day ui
// projects a different view, `tsc` demands one at the app boundary.

type BuildWordOk = operations['words.buildWord']['responses'][200]['content']['application/json']
type UnreadyState = Exclude<BuildWordOk, { status: 'succeeded' }>

/** The full ready-entry content — the `succeeded` arm's `word`, tracking schema
 *  regen without a hand-copy. */
export type WordEntryContent = Extract<BuildWordOk, { status: 'succeeded' }>['word']
/** Per-stage build progress on a non-terminal / failed build. */
export type WordBuildStages = UnreadyState['stages']

/** What the word route renders — ui's own tagged mirror of the build state. */
export type WordScreenView =
  | { readonly kind: 'ready'; readonly word: WordEntryContent }
  | {
      readonly kind: 'unready'
      readonly status: UnreadyState['status']
      readonly stages: WordBuildStages
    }
