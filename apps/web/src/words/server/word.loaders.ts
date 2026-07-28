'use server'

import { fetchWordState, type Language, searchWords } from '@kotodama/core/repositories'
import type { WordBuildStatus, WordListItem } from '@kotodama/core/words'
import { createServerApiClient } from '../../server/server-api-client'

// The word feature's client-callable reads. `'use server'` (not `server-only` +
// React.cache like an RSC loader) because a client island imports each export as
// a NETWORK REFERENCE — the only serializable way to hand the client "a function".
// Reads only; commands live in word.requests.ts.

/**
 * The word's current build status — the typed poll function the status island calls each
 * tick (passed in as a Server Action, so no URL string / no client-side JSON parsing).
 * `cache: 'no-store'` bypasses the route's Data Cache so each poll sees fresh state.
 * `null` when the word does not exist.
 */
export async function loadWordStatus(
  language: Language,
  word: string,
): Promise<WordBuildStatus | null> {
  try {
    const state = await fetchWordState(createServerApiClient(), language, word, {
      cache: 'no-store',
    })
    return state?.status ?? null
  } catch {
    // Unreachable backend must not reject in the poll island — null = keep waiting.
    return null
  }
}

/**
 * Live palette search — the typed read the ⌘K island calls after the debounce.
 * Returns DOMAIN items (this tier may not speak ui's view vocabulary); the
 * client-side mapper shapes them. An unreachable backend returns `[]` — the
 * palette simply keeps its current rows, never an error state mid-typing.
 */
export async function loadWordSearch(
  language: Language,
  q: string,
): Promise<readonly WordListItem[]> {
  try {
    const page = await searchWords(createServerApiClient(), language, { q, page: 1, limit: 8 })
    return page.items
  } catch {
    return []
  }
}
