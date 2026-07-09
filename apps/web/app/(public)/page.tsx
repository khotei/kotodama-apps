import { LibraryHero, ReadingRoom, WordOfTheDay } from '@kotodama/use-cases'
import type { Metadata } from 'next'
import { LIBRARY_VIEW_MOCK } from '@/src/library/library.mock'

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
      <WordOfTheDay wotd={library.wordOfTheDay} position={library.wotdPosition} />
      <ReadingRoom mostLookedUp={library.mostLookedUp} recentlyAdded={library.recentlyAdded} />
    </>
  )
}
