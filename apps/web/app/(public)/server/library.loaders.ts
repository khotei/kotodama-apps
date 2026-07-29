import 'server-only'
import {
  fetchMostLookedUp,
  fetchRecentWords,
  fetchTryWords,
  fetchWordCounts,
  fetchWordsOfTheDay,
  type WordCountsEntity,
} from '@kotodama/core/repositories'
import type { Language, ReadyListWord, WordListItem } from '@kotodama/core/words'
import { cache } from 'react'
import { createServerApiClient } from '@/src/server/server-api-client'

const RANKED_LIMIT = 6
const WOTD_LIMIT = 4
const TRY_LIMIT = 6

export type LibraryAggregation = {
  readonly counts: WordCountsEntity
  readonly recent: readonly WordListItem[]
  readonly mostLooked: readonly ReadyListWord[]
  readonly wotd: readonly ReadyListWord[]
  readonly tryWords: readonly ReadyListWord[]
}

export const loadLibraryAggregation = cache(
  async (language: Language): Promise<LibraryAggregation> => {
    const client = createServerApiClient()
    const [counts, recent, mostLooked, wotd, tryWords] = await Promise.all([
      fetchWordCounts(client, language),
      fetchRecentWords(client, language, { page: 1, limit: RANKED_LIMIT }),
      fetchMostLookedUp(client, language, { page: 1, limit: RANKED_LIMIT }),
      fetchWordsOfTheDay(client, language, { page: 1, limit: WOTD_LIMIT }),
      fetchTryWords(client, language, { page: 1, limit: TRY_LIMIT }),
    ])
    return {
      counts,
      recent: recent.items,
      mostLooked: mostLooked.items,
      wotd: wotd.items,
      tryWords: tryWords.items,
    }
  },
)
