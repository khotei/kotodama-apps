import type { WordStateEntity } from '@kotodama/core/repositories'

// The wire union IS the model: the backend emits `WordStateEntity` as a bare
// `anyOf` with a `status` literal per branch (no JSON-Schema discriminator),
// and consumers branch on `status === 'succeeded'` directly. A re-tagging
// narrow layer was removed as pure renaming — do not reintroduce one.

/** The full wire status union (`pending | running | succeeded | failed`). The poll
 *  island reads this off the raw `/state` response to decide when to stop. */
export type WordBuildStatus = WordStateEntity['status']

export type WordState = WordStateEntity

/** The full word content, present only once building has succeeded. */
export type ReadyWord = Extract<WordStateEntity, { status: 'succeeded' }>['word']
/** A non-terminal (or failed) build: identity + status + per-stage progress. */
export type UnreadyStages = Exclude<WordStateEntity, { status: 'succeeded' }>['stages']
