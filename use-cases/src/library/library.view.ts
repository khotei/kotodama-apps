import type { Language } from '@kotodama/store'
import type { WordStatus, WordTier } from '@kotodama/ui'

/** A word with an optionally stressed syllable — `mari·po·sa` → pre/stress/post. */
export type AccentedWord = {
  pre: string
  stress?: string
  post?: string
}

export type LibraryStat = {
  value: string
  label: string
}

export type TryWordView = {
  word: string
  href: string
}

export type WotdGlanceView = {
  etymology: string
  firstAttested: string
  tiers: readonly WordTier[]
  tiersLabel: string
  languages: string
  frequency: string
}

export type WotdView = {
  dateTag: string
  word: AccentedWord
  pos: string
  ipa: string
  plural: string
  gloss: string
  definition: string
  entryHref: string
  saved: boolean
  /** BCP-47 tag for speech synthesis — `es-ES`. */
  speechLang: string
  glance: WotdGlanceView
  frequencySeries: readonly number[]
  axisStart: string
  axisEnd: string
}

export type RankedWordView = {
  href: string
  /** Needed only where a row action fires (failed → Retry) — `es`. */
  language?: Language
  word: AccentedWord
  gloss?: string
  pos?: string
  when: string
  status: WordStatus
  saved: boolean
  /** Mono line replacing the gloss on a non-ready row — `Spanish · arriving`. */
  statusNote?: string
}

export type LibraryView = {
  stats: readonly LibraryStat[]
  tryWords: readonly TryWordView[]
  wordsOfTheDay: readonly WotdView[]
  mostLookedUp: readonly RankedWordView[]
  recentlyAdded: readonly RankedWordView[]
}

export function accentedWordText({ pre, stress = '', post = '' }: AccentedWord) {
  return `${pre}${stress}${post}`
}
