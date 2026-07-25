import type { ReactNode } from 'react'

export type LibraryScreenProps = {
  hero: ReactNode
  wordOfTheDay?: ReactNode
  readingRoom: ReactNode
}

/**
 * The library page as a SLOT layout — not a single view-model. It owns only the
 * arrangement; each slot is filled independently: apps/web drops in a data
 * container per section, Storybook a mock-fed organism. Both compose the same
 * page from parts sourced on their own, so no god-prop and per-section data
 * boundaries (a container can Suspend without blocking its siblings).
 *
 * Owns the vertical rhythm too: the inter-section gap + the page's top/bottom
 * breathing room live here, so each section stays a policy-free frame reusable
 * at any spacing (never sets its own outer margin).
 */
export function LibraryScreen({ hero, wordOfTheDay, readingRoom }: LibraryScreenProps) {
  return (
    <div className="flex flex-col gap-16 pt-8 pb-24 md:pt-16">
      {hero}
      {wordOfTheDay}
      {readingRoom}
    </div>
  )
}
