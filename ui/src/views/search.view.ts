import type { WordStatus } from '../components/core/word-status'

export type SearchWordView = {
  href: string
  word: string
  /** Filter axis — `noun`; `posLabel` is what the badge shows (`n. f.`). */
  pos?: string
  posLabel?: string
  ipa?: string
  gloss?: string
  status: WordStatus
  saved: boolean
  statusNote?: string
  /** Sort key for `SORTED BY ADDED` — larger = newer. */
  addedRank: number
}
