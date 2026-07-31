import { BookmarkIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { RankedWordView } from '../../../views/library.view'
import { AccentedWordMark, accentedWordText } from '../../atoms/accented-word'
import { List, ListItem } from '../../atoms/list'
import { PosPill } from '../../atoms/pos-pill'
import { RetryButton } from '../../atoms/retry-button'
import { Timestamp } from '../../atoms/timestamp'
import { StatusBadge, StatusDot, type WordStatus } from '../status-badge'
import { StatusNote } from '../status-note'
import { WordRow, type WordRowTone } from '../word-row'

export type RetryHandler = (word: string) => void | Promise<void>

const WORD_TONE = {
  succeeded: 'default',
  running: 'shimmer',
  pending: 'muted',
  failed: 'muted',
} satisfies Record<WordStatus, WordRowTone>

function recentSub(word: RankedWordView): ReactNode {
  if (word.status === 'succeeded') {
    return word.gloss != null ? <WordRow.Gloss>{word.gloss}</WordRow.Gloss> : null
  }
  return word.statusNote != null ? (
    <WordRow.Note>
      <StatusNote note={word.statusNote} status={word.status} />
    </WordRow.Note>
  ) : null
}

function recentMeta(word: RankedWordView, onRetry?: RetryHandler): ReactNode {
  if (word.status === 'failed' && onRetry != null) {
    return <RetryButton word={accentedWordText(word.word)} onRetry={onRetry} />
  }
  // No re-queue wired ⇒ the failed row degrades to a plain Failed badge, never a
  // dead Retry that looks clickable but does nothing.
  if (word.status !== 'succeeded') {
    return <StatusBadge status={word.status} />
  }
  if (word.saved) {
    return <BookmarkIcon className="size-4 fill-seal text-seal" />
  }
  return word.pos != null ? <PosPill>{word.pos}</PosPill> : null
}

export type WordRecentListProps = {
  words: readonly RankedWordView[]
  /** Injected re-queue for failed rows' Retry — a `requestWordBuild` bound to
   *  the study language. Omitted (Storybook) ⇒ a static, inert Retry link. */
  onRetry?: RetryHandler
}

/**
 * The reading room's "recently added" column: words in any build state, each a
 * status dot + lifecycle tone, with the pending/failed/ready meta (a status
 * badge, Retry, or bookmark). The status-aware sibling of {@link WordRankList}.
 */
export function WordRecentList({ words, onRetry }: WordRecentListProps) {
  return (
    <List divided>
      {words.map((word) => (
        <ListItem key={word.href}>
          <WordRow>
            <WordRow.Lead>
              <StatusDot status={word.status} className="ml-2xs" />
            </WordRow.Lead>
            <WordRow.Main>
              <WordRow.Word href={word.href} tone={WORD_TONE[word.status]}>
                <AccentedWordMark word={word.word} />
              </WordRow.Word>
              {recentSub(word)}
            </WordRow.Main>
            <WordRow.Meta>
              {recentMeta(word, onRetry)}
              <Timestamp>{word.when}</Timestamp>
            </WordRow.Meta>
          </WordRow>
        </ListItem>
      ))}
    </List>
  )
}
