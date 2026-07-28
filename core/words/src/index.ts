// @kotodama/core/words — the words domain module (the FE mirror of the backend's
// core/words). Platform-agnostic (no DOM). Owns the domain names over the wire
// unions that the render layer switches on. The cross-app reuse unit: apps/web
// consumes these, and a future native app would too.
export type { Language } from '@kotodama/core/repositories'
export type { ReadyListWord, UnreadyListWord, WordListItem } from './word.model'
export type { ReadyWord, UnreadyStages, WordBuildStatus, WordState } from './word-state.model'
