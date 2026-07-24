// @kotodama/core/repositories — the data-access tier: bare fetchX access functions
// over the transport client. Platform-agnostic (no DOM). `store` builds
// queryOptions on top of these.

export type {
  JobStatus,
  Language,
  WordCountsEntity,
  WordEntity,
  WordSearchResultEntity,
  WordStateEntity,
} from './words/word.entity'
export type { SearchWordsParams } from './words/word.repo'
export { buildWord, fetchWord, fetchWordState, searchWords } from './words/word.repo'
