// @kotodama/core/words — the words domain module (the FE mirror of the backend's
// core/words). Platform-agnostic (no DOM). Owns the domain types recovered from the
// wire (`narrowWordState`) that the render layer switches on. The cross-app reuse
// unit: apps/web's server loader narrows here, and a future native app would too.
export type { Language } from '@kotodama/core/repositories'
export type { Library, ReadyListWord, WordListItem } from './library'
export { narrowLibrary, narrowSearchItem } from './library'
export type { ReadyWord, UnreadyStages, WordBuildStatus, WordState } from './word-state'
export { narrowWordState } from './word-state'
