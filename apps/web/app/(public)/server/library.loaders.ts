import 'server-only'
import {
  fetchMostLookedUp,
  fetchWordCounts,
  fetchWordsOfTheDay,
  searchWords,
  type WordCountsEntity,
} from '@kotodama/core/repositories'
import type { Language, ReadyListWord, WordListItem } from '@kotodama/core/words'
import { cache } from 'react'
import { createServerApiClient } from '@/src/server/server-api-client'

// Rail sizes mirror the library composition (6-row ranked rails, a 4-card
// word-of-the-day run) — the render tier trims from these, never fetches more.
const RANKED_LIMIT = 6
const WOTD_LIMIT = 4

/** The library read aggregate — the ONE type both sides of the seam name: this
 *  loader (ui-free) returns it, the render tier maps it into ui's LibraryView. */
export type LibraryAggregation = {
  readonly counts: WordCountsEntity
  readonly recent: readonly WordListItem[]
  readonly mostLooked: readonly WordListItem[]
  readonly wotd: readonly ReadyListWord[]
}

/**
 * The library page's ONE read (page + `generateMetadata` share it via
 * `React.cache`): four anonymous reads fanned out in parallel, assembled into one
 * {@link LibraryAggregation}. NEVER throws — an unreachable backend resolves `null`, so the
 * page renders degraded and `next build` passes without a live backend. The
 * client stays anonymous (no headers injected) — the public tree must remain
 * statically generable.
 *
 * `recent` deliberately reads UNfiltered search (building words surface as
 * unready rows); the succeeded-only rails go through their intent wrappers.
 */
export const loadLibraryAggregation = cache(
  async (language: Language): Promise<LibraryAggregation | null> => {
    const client = createServerApiClient()
    try {
      const [counts, recent, mostLooked, wotd] = await Promise.all([
        fetchWordCounts(client, language),
        searchWords(client, language, { page: 1, limit: RANKED_LIMIT }),
        fetchMostLookedUp(client, language, { page: 1, limit: RANKED_LIMIT }),
        fetchWordsOfTheDay(client, language, { page: 1, limit: WOTD_LIMIT }),
      ])
      return {
        counts,
        recent: recent.items,
        mostLooked: mostLooked.items,
        // The wotd rail renders inline word content, so an unready row has
        // nothing to show — deliberately no `getWord` fan-out to fill it.
        wotd: wotd.items.filter((item) => item.status === 'succeeded'),
      }
    } catch {
      return null
    }
  },
)
