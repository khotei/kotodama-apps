import 'server-only'
import { fetchWordsOfTheDay } from '@kotodama/core/repositories'
import type { Language, ReadyListWord } from '@kotodama/core/words'
import { cache } from 'react'
import { createServerApiClient } from '@/src/server/server-api-client'

const WOTD_LIMIT = 4

export const loadWordsOfTheDay = cache(
  async (language: Language): Promise<readonly ReadyListWord[]> => {
    const client = createServerApiClient()
    const { items } = await fetchWordsOfTheDay(client, language, { page: 1, limit: WOTD_LIMIT })
    return items
  },
)
