import type { WordStateView } from '@kotodama/api-client'

// The load-bearing view-model of the foundation: the FE analogue of the
// backend's `collapseWordState`. The backend emits `WordStateView` as a bare
// `anyOf` through `OpenApi.fromApi` (no JSON-Schema discriminator), so the
// generated type is a plain union with a `status` literal on each branch. We
// narrow on that literal into a tagged, ergonomic shape the render layer can
// switch on without re-touching the wire shape. Pure — no React, no transport,
// no DOM.

/** The two arms of the generated union, recovered by their `status` literal. */
type SucceededState = Extract<WordStateView, { status: 'succeeded' }>
type UnreadyState = Exclude<WordStateView, { status: 'succeeded' }>

/** The full word content, present only once building has succeeded. */
export type ReadyWord = SucceededState['word']
/** A non-terminal (or failed) build: identity + status + per-stage progress. */
export type UnreadyStages = UnreadyState['stages']

export type NarrowedWordState =
  | { readonly kind: 'ready'; readonly word: ReadyWord }
  | {
      readonly kind: 'unready'
      readonly status: UnreadyState['status']
      readonly stages: UnreadyStages
    }

/**
 * Narrow a raw `WordStateView` into a tagged union. `succeeded` yields the
 * `word` branch; every other status (`pending` | `running` | `failed`) yields
 * the `stages` branch.
 *
 * The union is closed, so the two arms are exhaustive: if the backend ever adds
 * a status, `state` in the `else` stops being assignable to `UnreadyState` and
 * this stops compiling — a build error, never a silent relabel (the backend
 * `collapseWordState` invariant).
 */
export function narrowWordState(state: WordStateView): NarrowedWordState {
  if (state.status === 'succeeded') {
    return { kind: 'ready', word: state.word }
  }
  return { kind: 'unready', status: state.status, stages: state.stages }
}
