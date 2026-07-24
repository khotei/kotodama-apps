import type { operations } from '@kotodama/platform/api-client'
import { type ApiClient, unwrap } from '@kotodama/platform/api-client'
import type { Language } from './word.entity'

// The data-access tier: bare `fetchX` functions over the transport client — the
// ONLY code that speaks path-strings + query params. Returns plain Promises of
// the generated contract types (the type system is the test). Platform-agnostic;
// `store` builds queryOptions on top of these.

// `init` forwards fetch options (e.g. Next's `{ next: { tags, revalidate } }`) from
// the caller's edge to openapi-fetch. `body` is excluded — these are GET reads, and
// openapi-fetch types a GET's options as `{ body?: undefined }`. Kept framework-free
// (a bare `RequestInit`); the Next augmentation of the `next` field types at the call site.
type ReadInit = Omit<RequestInit, 'body'>

export function fetchWord(client: ApiClient, language: Language, word: string, init?: ReadInit) {
  return client
    .GET('/api/words/{language}/{word}', { params: { path: { language, word } }, ...init })
    .then(unwrap)
}

export function fetchWordState(
  client: ApiClient,
  language: Language,
  word: string,
  init?: ReadInit,
) {
  return client
    .GET('/api/words/{language}/{word}/state', { params: { path: { language, word } }, ...init })
    .then(unwrap)
}

// `q` + `status` are the contract's query params verbatim; only `page`/`limit`
// diverge — the wire wants strings, a typed caller passes `number` (searchWords
// stringifies). So derive from the generated query and override just those two.
export type SearchWordsParams = Omit<
  operations['words.search']['parameters']['query'],
  'page' | 'limit'
> & {
  /** 1-based page index; the backend rejects an out-of-range limit at decode. */
  page: number
  limit: number
}

export function searchWords(client: ApiClient, language: Language, params: SearchWordsParams) {
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

/** Queue (or re-queue) a build for the word — POST, no body; the state row is the reply. */
export function buildWord(client: ApiClient, language: Language, word: string) {
  return client
    .POST('/api/words/{language}/{word}/build', { params: { path: { language, word } } })
    .then(unwrap)
}
