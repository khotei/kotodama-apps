import type {
  ApiClient,
  JobStatus,
  Language,
  Word,
  WordSearchResult,
  WordStateView,
} from '@kotodama/api-client'

// The data-access tier: bare `fetchX` functions over the transport client — the
// ONLY code that speaks path-strings + query params. Returns plain Promises of
// the generated contract types (the type system is the test). Platform-agnostic;
// `store` builds queryOptions on top of these.

/**
 * A non-2xx response. The FE has no typed error channel (no Effect), so
 * openapi-fetch's per-status error body is surfaced under `status` + `body`.
 */
export class ApiError extends Error {
  override readonly name = 'ApiError'
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`API request failed with status ${status}`)
  }
}

// Collapse an openapi-fetch result to its data, throwing an ApiError on a
// non-2xx. We branch on `response.ok` (not `error !== undefined`): openapi-fetch
// types `error` as `undefined` for an endpoint that declares NO error responses
// (getWordState / search), so a discriminant check on `error` would narrow the
// whole result — and thus `response` — to `never`. `response.ok` is a plain
// runtime check that never collapses the union; the single `data as T` is safe
// because a 2xx body is always the success shape.
function unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
  if (!result.response.ok) throw new ApiError(result.response.status, result.error)
  return result.data as T
}

export function fetchWord(client: ApiClient, language: Language, word: string): Promise<Word> {
  return client
    .GET('/api/words/{language}/{word}', { params: { path: { language, word } } })
    .then(unwrap<Word>)
}

export function fetchWordState(
  client: ApiClient,
  language: Language,
  word: string,
): Promise<WordStateView | null> {
  return client
    .GET('/api/words/{language}/{word}/state', { params: { path: { language, word } } })
    .then(unwrap<WordStateView | null>)
}

export interface SearchWordsParams {
  q?: string
  status?: JobStatus
  /** 1-based page index; the backend rejects an out-of-range limit at decode. */
  page: number
  limit: number
}

export function searchWords(
  client: ApiClient,
  language: Language,
  params: SearchWordsParams,
): Promise<WordSearchResult> {
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
    .then(unwrap<WordSearchResult>)
}
