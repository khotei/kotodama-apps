// @kotodama/repositories — the data-access tier: bare fetchX access functions
// over the transport client. Platform-agnostic (no DOM). `store` builds
// queryOptions on top of these.

export type { SearchWordsParams } from './words/word.repo'
export { ApiError, fetchWord, fetchWordState, searchWords } from './words/word.repo'
