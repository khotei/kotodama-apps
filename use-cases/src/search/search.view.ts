import type { WordStatus } from '@kotodama/ui'

export type SearchPos = 'noun' | 'verb' | 'adjective' | 'adverb'

export type SearchWordView = {
  href: string
  word: string
  /** Filter axis — `noun`; `posLabel` is what the badge shows (`n. f.`). */
  pos?: SearchPos
  posLabel?: string
  ipa?: string
  gloss?: string
  status: WordStatus
  saved: boolean
  statusNote?: string
  /** Sort key for `SORTED BY ADDED` — larger = newer. */
  addedRank: number
}
