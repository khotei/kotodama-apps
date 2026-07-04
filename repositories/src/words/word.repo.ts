import type { operations } from '@kotodama/api-client'
import { type ApiClient, unwrap } from '@kotodama/api-client'
import type { Language, WordEntity, WordSearchResultEntity, WordStateEntity } from './word.entity'

// The data-access tier: bare `fetchX` functions over the transport client — the
// ONLY code that speaks path-strings + query params. Returns plain Promises of
// the generated contract types (the type system is the test). Platform-agnostic;
// `store` builds queryOptions on top of these.

export function fetchWord(
  client: ApiClient,
  language: Language,
  word: string,
): Promise<WordEntity> {
  return client
    .GET('/api/words/{language}/{word}', { params: { path: { language, word } } })
    .then(unwrap)
}

export function fetchWordState(
  client: ApiClient,
  language: Language,
  word: string,
): Promise<WordStateEntity | null> {
  return client
    .GET('/api/words/{language}/{word}/state', { params: { path: { language, word } } })
    .then(unwrap)
}

// `q` + `status` are the contract's query params verbatim; only `page`/`limit`
// diverge — the wire wants strings, a typed caller passes `number` (searchWords
// stringifies). So derive from the generated query and override just those two.
export interface SearchWordsParams
  extends Omit<operations['words.search']['parameters']['query'], 'page' | 'limit'> {
  /** 1-based page index; the backend rejects an out-of-range limit at decode. */
  page: number
  limit: number
}

export function searchWords(
  client: ApiClient,
  language: Language,
  params: SearchWordsParams,
): Promise<WordSearchResultEntity> {
  return client
    .GET('/api/words/{language}/search', {
      params: {
        path: { language },
        // `page`/`limit` are required on the wire from a typed caller (the
        // backend's decode-default only fills an OMITTING caller) and travel as
        // strings — see apps/api pagination contract.
        query: {
          q: params.q,
          status: params.status,
          page: String(params.page),
          limit: String(params.limit),
        },
      },
    })
    .then(unwrap)
}
