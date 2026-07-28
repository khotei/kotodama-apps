import type { Language, WordListItem } from '@kotodama/core/words'
import type { SearchWordView } from '@kotodama/ui'
import { wordHref } from './words-hrefs'
import { unreadyStatusNote } from './words-status.mapper'

/**
 * Map one domain {@link WordListItem} to the palette/search row view —
 * wire vocabulary in, presentation out; `addedRank` is the createdAt instant.
 */
export function mapSearchWord(item: WordListItem, language: Language): SearchWordView {
  if (item.status === 'succeeded') {
    return {
      href: wordHref(language, item.word),
      word: item.word,
      pos: item.lexical.partOfSpeech,
      posLabel: item.lexical.partOfSpeech,
      ipa: item.pronunciation.ipa,
      gloss: item.coreDefinition,
      status: item.status,
      saved: false,
      addedRank: Date.parse(item.createdAt),
    }
  }
  return {
    href: wordHref(item.language, item.word),
    word: item.word,
    status: item.status,
    saved: false,
    statusNote: unreadyStatusNote(item),
    addedRank: Date.parse(item.createdAt),
  }
}
