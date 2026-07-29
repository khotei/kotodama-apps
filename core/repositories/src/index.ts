// @kotodama/core/repositories — the data-access tier: bare fetchX access functions
// over the transport client. Platform-agnostic (no DOM). `core/words`
// derives the domain model on top.

export type {
  JobStatus,
  Language,
  WordCountsEntity,
  WordEntity,
  WordSearchEntity,
  WordSearchResultEntity,
  WordStateEntity,
} from './words/word.entity'
export type { SearchWordsParams, WordCountsParams } from './words/word.repo'
export {
  buildWord,
  fetchMostLookedUp,
  fetchRecentWords,
  fetchTryWords,
  fetchWord,
  fetchWordCounts,
  fetchWordState,
  fetchWordsOfTheDay,
  searchWords,
} from './words/word.repo'
