// @kotodama/fe-api-client — the transport + access package (the base of the
// platform-agnostic spine). Consumers import the client factory + fetchX
// functions + the generated types from here; the raw `schema.gen` surface and
// the openapi-fetch wiring stay internal.

export type { ApiClient, ApiClientOptions } from './client'
export { createApiClient } from './client'
export type {
  JobStatus,
  Language,
  SearchWordsParams,
  Word,
  WordCounts,
  WordSearchResult,
  WordStateView,
} from './repositories/word.repo'
export { ApiError, fetchWord, fetchWordState, searchWords } from './repositories/word.repo'
