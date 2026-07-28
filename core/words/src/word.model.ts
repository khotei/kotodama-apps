import type { WordSearchEntity } from '@kotodama/core/repositories'

// The wire union IS the model: it already discriminates on its `status`
// literal, so consumers branch on `status === 'succeeded'` directly. A
// re-tagging narrow layer (kind: 'ready' | 'unready') was removed as pure
// renaming — do not reintroduce one; exhaustiveness canaries live at the
// consumers (`satisfies Record<…['status'], …>`).

export type WordListItem = WordSearchEntity
/** The full inline word content of a ready list row (the search-side analogue
 *  of `ReadyWord` — kept a separate derivation so the two wire projections can
 *  drift independently). */
export type ReadyListWord = Extract<WordSearchEntity, { status: 'succeeded' }>
export type UnreadyListWord = Exclude<WordSearchEntity, { status: 'succeeded' }>
