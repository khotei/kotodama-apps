import type { Language, WordListItem } from '@kotodama/core/words'
import { formatRelative } from '@kotodama/platform/dates'
import { type RankedWordView, ReadingRoom } from '@kotodama/ui'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { requestWordBuild } from '@/src/words/server/word.requests'
import { wordHref } from '@/src/words/words-hrefs'
import { unreadyStatusNote } from '@/src/words/words-status.mapper'
import { loadReadingRoom } from './reading-room.loaders'

function rankedRow(item: WordListItem, language: Language, now: Date): RankedWordView {
  if (item.status === 'succeeded') {
    return {
      href: wordHref(language, item.word),
      word: { pre: item.word },
      gloss: item.coreDefinition,
      pos: item.lexical.partOfSpeech,
      when: formatRelative(item.createdAt, now, DEFAULT_LANGUAGE),
      status: item.status,
      saved: false,
    }
  }
  return {
    href: wordHref(item.language, item.word),
    word: { pre: item.word },
    when: formatRelative(item.createdAt, now, DEFAULT_LANGUAGE),
    status: item.status,
    saved: false,
    statusNote: unreadyStatusNote(item),
  }
}

export async function ReadingRoomContainer() {
  const { mostLooked, recent } = await loadReadingRoom(DEFAULT_LANGUAGE)
  const now = new Date()

  return (
    <ReadingRoom
      mostLookedUp={mostLooked.map((i) => rankedRow(i, DEFAULT_LANGUAGE, now))}
      recentlyAdded={recent.map((i) => rankedRow(i, DEFAULT_LANGUAGE, now))}
      onRetry={requestWordBuild.bind(null, DEFAULT_LANGUAGE)}
    />
  )
}
