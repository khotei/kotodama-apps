import { LibraryHero, LibraryScreen, ReadingRoom, WordOfTheDay } from '@kotodama/ui'
import type { Metadata } from 'next'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { libraryViewFromModel } from '@/src/library/library.mapper'
import { getLibrary } from '@/src/server/library/library.loader'
import { requestWordBuild } from '@/src/server/words/word.actions'

// ISR: the anonymous library re-renders at most once a minute — the loader's
// static (cookie-free) client is what keeps this route statically generable.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Library',
  description:
    'A modern dictionary for readers who refuse the three-line definition — four depths of meaning, etymology, and literary voices.',
}

export default async function LibraryPage() {
  const model = await getLibrary(DEFAULT_LANGUAGE)
  // Unreachable backend (including `next build` with none running) → the
  // honest degraded page, never mock data and never a build failure.
  if (!model) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="text-muted-foreground">
          The library shelves are being restocked — check back in a moment.
        </p>
      </main>
    )
  }
  const library = libraryViewFromModel(model, { language: DEFAULT_LANGUAGE, now: new Date() })
  return (
    <LibraryScreen
      hero={<LibraryHero stats={library.stats} tryWords={library.tryWords} searchPath="/search" />}
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
