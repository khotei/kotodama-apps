import type { WordCountsEntity, WordSearchResultEntity } from '@kotodama/core/repositories'

// The library read aggregate — the ONE type both sides of the seam name. The
// server loader (ui-free: src/server bans @kotodama/ui) returns Library; the
// render tier maps it into ui's LibraryView. Same discipline as word-state.ts:
// narrow on the wire `status` literal so a backend union change is a compile
// error, never a silent relabel.

type WordSearchItem = WordSearchResultEntity['items'][number]
type ReadySearchItem = Extract<WordSearchItem, { status: 'succeeded' }>
type UnreadySearchItem = Exclude<WordSearchItem, { status: 'succeeded' }>

/** The full inline word content of a ready list row (the search-side analogue
 *  of `ReadyWord` — kept a separate derivation so the two wire projections can
 *  drift independently). */
export type ReadyListWord = ReadySearchItem

export type WordListItem =
  | { readonly kind: 'ready'; readonly word: ReadyListWord }
  | {
      readonly kind: 'unready'
      readonly status: UnreadySearchItem['status']
      readonly word: UnreadySearchItem['word']
      readonly language: UnreadySearchItem['language']
      readonly createdAt: UnreadySearchItem['createdAt']
      readonly stages: UnreadySearchItem['stages']
    }

/**
 * Narrow one raw search item into a tagged {@link WordListItem}: `succeeded`
 * carries the full inline word; anything else carries identity + status + the
 * stage trail. Exhaustive over the closed union — a new backend status stops
 * this compiling.
 */
export function narrowSearchItem(item: WordSearchItem): WordListItem {
  if (item.status === 'succeeded') {
    return { kind: 'ready', word: item }
  }
  return {
    kind: 'unready',
    status: item.status,
    word: item.word,
    language: item.language,
    createdAt: item.createdAt,
    stages: item.stages,
  }
}

export type Library = {
  readonly counts: WordCountsEntity
  readonly recent: readonly WordListItem[]
  readonly mostLooked: readonly WordListItem[]
  readonly wotd: readonly ReadyListWord[]
}

/**
 * Assemble the library aggregate from the raw wire reads in one call: counts
 * pass through, `recent`/`mostLooked` narrow per item, and `wotd` keeps only
 * ready items — the word-of-the-day rail renders inline word content, so an
 * unready row has nothing to show (deliberately no `getWord` fan-out to fill it).
 */
export function narrowLibrary(input: {
  counts: WordCountsEntity
  recent: WordSearchResultEntity
  mostLooked: WordSearchResultEntity
  wotd: WordSearchResultEntity
}): Library {
  return {
    counts: input.counts,
    recent: input.recent.items.map(narrowSearchItem),
    mostLooked: input.mostLooked.items.map(narrowSearchItem),
    wotd: input.wotd.items.filter((item) => item.status === 'succeeded'),
  }
}
