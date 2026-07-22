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
export function unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
  if (!result.response.ok) throw new ApiError(result.response.status, result.error)
  return result.data as T
}
