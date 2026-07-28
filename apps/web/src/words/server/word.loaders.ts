'use server'

import { fetchWordState, type Language, searchWords } from '@kotodama/core/repositories'
import { createServerApiClient } from '../../server/server-api-client'

// The word feature's client-callable reads. `'use server'` (not `server-only` +
// React.cache like an RSC loader) because a client island imports each export as
// a NETWORK REFERENCE — the only serializable way to hand the client "a function".
// Reads only; commands live in word.requests.ts.

/**
 * The word's current build state — the typed poll read the status island calls each
 * tick (passed in as a Server Action, so no URL string / no client-side JSON parsing).
 * Returns the FULL state, not a status slice, so the one read serves the poller and
 * any richer consumer. `cache: 'no-store'` bypasses the route's Data Cache so each
 * poll sees fresh state. A missing word or unreachable backend REJECTS (`ApiError`) —
 * the calling island owns the retry/degrade policy.
 */
export async function loadWordState(language: Language, word: string) {
  return fetchWordState(createServerApiClient(), language, word, { cache: 'no-store' })
}

/**
 * Live palette search — the typed read the ⌘K island calls after the debounce.
 * Returns the FULL search page (DOMAIN vocabulary — this tier may not speak ui's
 * views), so pagination-aware consumers reuse it; the client-side mapper shapes
 * the items.
 */
export async function loadWordSearch(language: Language, q: string) {
  return searchWords(createServerApiClient(), language, { q, page: 1, limit: 8 })
}
