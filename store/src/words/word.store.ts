import type { ApiClient, Language } from '@kotodama/api-client'
import { type NarrowedWordState, narrowWordState } from '@kotodama/core'
import { fetchWordState } from '@kotodama/repositories'
import { queryOptions } from '@tanstack/react-query'

// The store layer: `queryOptions` FACTORIES, not hooks (§7, FE arc v2). The hook
// form (openapi-react-query) collapses the fetchX/core/store seams and can't
// feed TanStack Router loaders, which want plain `queryOptions`. These factories
// are the real cross-platform reuse unit — a future apps/mobile calls the same
// ones. No React is rendered here; `queryOptions` is a pure data object.

// A word's content changes rarely once built; keep it fresh for five minutes so
// route loaders + components dedupe aggressively.
const WORD_STALE_TIME = 5 * 60 * 1000

/**
 * The query behind a public word page. Fetches the word's build state and,
 * via `select`, routes it through `core.narrowWordState` so consumers get
 * the tagged `{ kind: 'ready' | 'unready' }` shape — never the raw wire union.
 * `null` (the word does not exist) passes through as `null`.
 *
 * The `client` is passed in (not a singleton) so the SSR server, the browser,
 * and tests each bind their own.
 */
export function wordQueryOptions(client: ApiClient, language: Language, word: string) {
  return queryOptions({
    queryKey: ['words', language, word, 'state'] as const,
    queryFn: () => fetchWordState(client, language, word),
    staleTime: WORD_STALE_TIME,
    select: (state): NarrowedWordState | null => (state ? narrowWordState(state) : null),
  })
}
