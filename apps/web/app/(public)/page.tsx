import { LibraryScreen } from '@kotodama/ui'
import type { Metadata } from 'next'
import { LibraryHeroContainer } from './components/library-hero/library-hero-container'
import { ReadingRoomContainer } from './components/reading-room/reading-room-container'
import { WordOfTheDayContainer } from './components/word-of-the-day/word-of-the-day-container'

// ISR: the anonymous library re-renders at most once a minute. Each section
// loads its own slice through a cookie-free client, so the route stays
// statically generable.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Library',
  description:
    'A modern dictionary for readers who refuse the three-line definition — four depths of meaning, etymology, and literary voices.',
}

export default function LibraryPage() {
  return (
    <LibraryScreen
      hero={<LibraryHeroContainer />}
      wordOfTheDay={<WordOfTheDayContainer />}
      readingRoom={<ReadingRoomContainer />}
    />
  )
}
