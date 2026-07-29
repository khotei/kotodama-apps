import 'server-only'
import { fetchTryWords, fetchWordCounts, type WordCountsEntity } from '@kotodama/core/repositories'
import type { Language, ReadyListWord } from '@kotodama/core/words'
import { cache } from 'react'
import { createServerApiClient } from '@/src/server/server-api-client'

const TRY_LIMIT = 6

export type LibraryHeroData = {
  readonly counts: WordCountsEntity
  readonly tryWords: readonly ReadyListWord[]
}

export const loadLibraryHero = cache(async (language: Language): Promise<LibraryHeroData> => {
  const client = createServerApiClient()
  const [counts, tryWords] = await Promise.all([
    fetchWordCounts(client, language),
    fetchTryWords(client, language, { page: 1, limit: TRY_LIMIT }),
  ])
  return { counts, tryWords: tryWords.items }
})
