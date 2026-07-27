import 'server-only'
import {
  fetchMostLookedUp,
  fetchWordCounts,
  fetchWordsOfTheDay,
  searchWords,
} from '@kotodama/core/repositories'
import { type Language, type Library, narrowLibrary } from '@kotodama/core/words'
import { cache } from 'react'
import { createServerApiClient } from './server-api-client'

// Rail sizes mirror the library composition (6-row ranked rails, a 4-card
// word-of-the-day run) — the render tier trims from these, never fetches more.
const RANKED_LIMIT = 6
const WOTD_LIMIT = 4

/**
 * The library page's ONE read (page + `generateMetadata` share it via
 * `React.cache`): four anonymous reads fanned out in parallel, narrowed into one
 * {@link Library}. NEVER throws — an unreachable backend resolves `null`, so the
 * page renders degraded and `next build` passes without a live backend. The
 * client stays anonymous (no headers injected) — the public tree must remain
 * statically generable.
 *
 * `recent` deliberately reads UNfiltered search (building words surface as
 * unready rows); the succeeded-only rails go through their intent wrappers.
 */
export const getLibrary = cache(async (language: Language): Promise<Library | null> => {
  const client = createServerApiClient()
  try {
    const [counts, recent, mostLooked, wotd] = await Promise.all([
      fetchWordCounts(client, language),
      searchWords(client, language, { page: 1, limit: RANKED_LIMIT }),
      fetchMostLookedUp(client, language, { page: 1, limit: RANKED_LIMIT }),
      fetchWordsOfTheDay(client, language, { page: 1, limit: WOTD_LIMIT }),
    ])
    return narrowLibrary({ counts, recent, mostLooked, wotd })
  } catch {
    return null
  }
})
