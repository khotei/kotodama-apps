import type { AccentedWord } from '../components/atoms/accented-word'
import type { WordStatus } from '../components/core/status-badge'
import type { WordTier } from '../components/core/tier-chip'

export type LibraryStat = {
  value: string
  label: string
}

export type TryWordView = {
  word: string
  href: string
}

/** One run of glance text; `accent` renders it as the cinnabar italic emphasis. */
export type GlanceSpan = { text: string; accent?: boolean }

/** A glance value — a plain string, or spans where some carry the accent. */
export type GlanceText = string | readonly GlanceSpan[]

export type WotdGlanceView = {
  etymology: GlanceText
  firstAttested: GlanceText
  tiers: readonly WordTier[]
  tiersLabel: string
  languages: GlanceText
  frequency: GlanceText
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
  /** Evenly-spaced sparkline axis ticks — `['1800','1900','2000','2024']`. */
  axisLabels: readonly string[]
}

export type RankedWordView = {
  href: string
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
