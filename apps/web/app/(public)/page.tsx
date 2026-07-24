import { LibraryHero, ReadingRoom, WordOfTheDay } from '@kotodama/use-cases'
import { LIBRARY_VIEW_MOCK } from '@kotodama/use-cases/fixtures'
import type { Metadata } from 'next'
import { requestWordBuild } from '@/src/server/words/word.actions'

export const metadata: Metadata = {
  title: 'Library',
  description:
    'A modern dictionary for readers who refuse the three-line definition — four depths of meaning, etymology, and literary voices.',
}

export default function LibraryPage() {
  const library = LIBRARY_VIEW_MOCK
  return (
    <>
      <LibraryHero stats={library.stats} tryWords={library.tryWords} searchPath="/search" />
      <WordOfTheDay wotds={library.wordsOfTheDay} />
      <ReadingRoom
        mostLookedUp={library.mostLookedUp}
        recentlyAdded={library.recentlyAdded}
        retryAction={requestWordBuild}
      />
    </>
  )
}
