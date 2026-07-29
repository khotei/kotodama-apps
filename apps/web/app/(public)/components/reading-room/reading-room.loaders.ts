import 'server-only'
import { fetchMostLookedUp, fetchRecentWords } from '@kotodama/core/repositories'
import type { Language, ReadyListWord, WordListItem } from '@kotodama/core/words'
import { cache } from 'react'
import { createServerApiClient } from '@/src/server/server-api-client'

const RANKED_LIMIT = 6

export type ReadingRoomData = {
  readonly mostLooked: readonly ReadyListWord[]
  readonly recent: readonly WordListItem[]
}

export const loadReadingRoom = cache(async (language: Language): Promise<ReadingRoomData> => {
  const client = createServerApiClient()
  const [mostLooked, recent] = await Promise.all([
    fetchMostLookedUp(client, language, { page: 1, limit: RANKED_LIMIT }),
    fetchRecentWords(client, language, { page: 1, limit: RANKED_LIMIT }),
  ])
  return { mostLooked: mostLooked.items, recent: recent.items }
})
