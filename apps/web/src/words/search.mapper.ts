import type { Language, WordListItem } from '@kotodama/core/words'
import type { SearchWordView } from '@kotodama/ui'
import { wordHref } from './hrefs'
import { unreadyStatusNote } from './status-note'

/**
 * Map one domain {@link WordListItem} to the palette/search row view —
 * wire vocabulary in, presentation out; `addedRank` is the createdAt instant.
 */
export function mapSearchWord(item: WordListItem, language: Language): SearchWordView {
  if (item.kind === 'ready') {
    return {
      href: wordHref(language, item.word.word),
      word: item.word.word,
      pos: item.word.lexical.partOfSpeech,
      posLabel: item.word.lexical.partOfSpeech,
      ipa: item.word.pronunciation.ipa,
      gloss: item.word.coreDefinition,
      status: 'succeeded',
      saved: false,
      addedRank: Date.parse(item.word.createdAt),
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
