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

const RANKED_LIMIT = 6
const WOTD_LIMIT = 4

export type LibraryAggregation = {
  readonly counts: WordCountsEntity
  readonly recent: readonly WordListItem[]
  readonly mostLooked: readonly WordListItem[]
  readonly wotd: readonly ReadyListWord[]
}

// @todo: add tryWords call, return type should ready words
export const loadLibraryAggregation = cache(
  async (language: Language): Promise<LibraryAggregation> => {
    const client = createServerApiClient()
    const [counts, recent, mostLooked, wotd] = await Promise.all([
      fetchWordCounts(client, language),
      // @todo: wrap into own fn
      searchWords(client, language, { page: 1, limit: RANKED_LIMIT }),
      // @todo: force to return ready word
      fetchMostLookedUp(client, language, { page: 1, limit: RANKED_LIMIT }),
      // @todo: force to return ready word
      fetchWordsOfTheDay(client, language, { page: 1, limit: WOTD_LIMIT }),
    ])
    return {
      counts,
      recent: recent.items,
      mostLooked: mostLooked.items,
      wotd: wotd.items.filter((item) => item.status === 'succeeded'),
    }
  },
)
