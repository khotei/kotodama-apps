// @kotodama/core/store — the domain-model tier. Platform-agnostic (no DOM). Owns the
// word-state model derivation (`narrowWordState`) that collapses the wire union into
// the tagged model the render layer switches on. The cross-app reuse unit: apps/web's
// server loader narrows here, and a future native app would narrow here too.
export type { Language } from '@kotodama/core/repositories'
export type {
  ReadyWord,
  UnreadyStages,
  WordBuildStatus,
  WordStateModel,
} from './words/word-state.model'
export { narrowWordState } from './words/word-state.model'
