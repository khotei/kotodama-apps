import { WordOfTheDay } from '@kotodama/ui'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { loadWordsOfTheDay } from './word-of-the-day.loaders'
import { wotdViewsFrom } from './word-of-the-day.mapper'

export async function WordOfTheDayContainer() {
  const words = await loadWordsOfTheDay(DEFAULT_LANGUAGE)

  return <WordOfTheDay wotds={wotdViewsFrom(words, { language: DEFAULT_LANGUAGE })} />
}
