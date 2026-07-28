import { LibraryHero, LibraryScreen, ReadingRoom, WordOfTheDay } from '@kotodama/ui'
import type { Metadata } from 'next'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { libraryViewFromModel } from '@/src/library/library.mapper'
import { requestWordBuild } from '@/src/words/server/word.requests'
import { loadLibraryAggregation } from './server/library.loaders'

// ISR: the anonymous library re-renders at most once a minute — the loader's
// static (cookie-free) client is what keeps this route statically generable.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Library',
  description:
    'A modern dictionary for readers who refuse the three-line definition — four depths of meaning, etymology, and literary voices.',
}

export default async function LibraryPage() {
  const model = await loadLibraryAggregation(DEFAULT_LANGUAGE)
  const library = libraryViewFromModel(model, { language: DEFAULT_LANGUAGE, now: new Date() })

  // @todo: think about: Library Scrren Container, or Template LibraryPageTemplate
  // @todo: childer instead slots?
  return (
    <LibraryScreen
      hero={
        <LibraryHero
          stats={library.stats}
          tryWords={library.tryWords}
          languageName={library.languageName}
          searchPath="/search"
        />
      }
      wordOfTheDay={<WordOfTheDay wotds={library.wordsOfTheDay} />}
      readingRoom={
        <ReadingRoom
          mostLookedUp={library.mostLookedUp}
          recentlyAdded={library.recentlyAdded}
          onRetry={requestWordBuild.bind(null, DEFAULT_LANGUAGE)}
        />
      }
    />
  )
}
