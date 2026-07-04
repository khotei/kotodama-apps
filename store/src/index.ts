// @kotodama/store — TanStack Query queryOptions factories (mirrors a data/store
// tier). Platform-agnostic (no DOM): the cross-app reuse unit and the
// definition a route loader + a use-case hook share. Owns the word-state view
// derivation (`narrowWordState`), co-located with the query it shapes.
export type { Language } from '@kotodama/repositories'
export { wordQueryOptions } from './words/word.store'
export type { ReadyWord, UnreadyStages, WordStateModel } from './words/word-state.model'
