import type { WordStateEntity } from '@kotodama/core/repositories'

// The load-bearing domain type of the foundation: the FE analogue of the
// backend's `collapseWordState`. The backend emits `WordStateEntity` as a bare
// `anyOf` through `OpenApi.fromApi` (no JSON-Schema discriminator), so the
// generated type is a plain union with a `status` literal on each branch. We
// narrow on that literal into a tagged, ergonomic model the render layer can
// switch on without re-touching the wire shape. Pure — no React, no transport,
// no DOM. Mirrors the backend's `word-state-collapse.ts`; the server loader in
// apps/web calls it after fetching the wire state.

/** The full wire status union (`pending | running | succeeded | failed`). The poll
 *  island reads this off the raw `/state` response to decide when to stop. */
export type WordBuildStatus = WordStateEntity['status']

/** The two arms of the generated union, recovered by their `status` literal. */
type SucceededState = Extract<WordStateEntity, { status: 'succeeded' }>
type UnreadyState = Exclude<WordStateEntity, { status: 'succeeded' }>

/** The full word content, present only once building has succeeded. */
export type ReadyWord = SucceededState['word']
/** A non-terminal (or failed) build: identity + status + per-stage progress. */
export type UnreadyStages = UnreadyState['stages']

export type WordState =
  | { readonly kind: 'ready'; readonly word: ReadyWord }
  | {
      readonly kind: 'unready'
      readonly status: UnreadyState['status']
      readonly stages: UnreadyStages
    }

/**
 * Narrow a raw `WordStateEntity` into a tagged {@link WordState}. `succeeded`
 * yields the `word` branch; every other status (`pending` | `running` |
 * `failed`) yields the `stages` branch.
 *
 * The union is closed, so the two arms are exhaustive: if the backend ever adds
 * a status, `state` in the `else` stops being assignable to `UnreadyState` and
 * this stops compiling — a build error, never a silent relabel (the backend
 * `collapseWordState` invariant).
 */
export function narrowWordState(state: WordStateEntity): WordState {
  if (state.status === 'succeeded') {
    return { kind: 'ready', word: state.word }
  }
  return { kind: 'unready', status: state.status, stages: state.stages }
}
