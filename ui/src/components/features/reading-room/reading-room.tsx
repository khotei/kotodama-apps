import { BookmarkIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { pad2 } from '../../../lib/pad2'
import type { RankedWordView } from '../../../views/library.view'
import { AccentedWordMark, accentedWordText } from '../../atoms/accented-word'
import { PosPill } from '../../atoms/pos-pill'
import { RetryButton } from '../../atoms/retry-button'
import { RetryLink } from '../../atoms/retry-link'
import { SectionRule } from '../../atoms/section-rule'
import { RankRow, type RankRowProps } from '../../core/rank-row'
import { StatusBadge, StatusDot, type WordStatus } from '../../core/status-badge'
import { StatusNote } from '../../core/status-note'

type RetryHandler = (word: string) => void | Promise<void>

function rowMeta(row: RankedWordView, onRetry?: RetryHandler) {
  const when = (
    <span className="font-mono text-xs text-faint-foreground tracking-wide">{row.when}</span>
  )
  if (row.status === 'failed') {
    return (
      <>
        {onRetry != null ? (
          <RetryButton word={accentedWordText(row.word)} onRetry={onRetry} />
        ) : (
          <RetryLink>Retry</RetryLink>
        )}
        {when}
      </>
    )
  }
  if (row.status !== 'succeeded') {
    return (
      <>
        <StatusBadge status={row.status} />
        {when}
      </>
    )
  }
  return (
    <>
      {row.saved ? (
        <BookmarkIcon className="size-4 fill-seal text-seal" />
      ) : row.pos != null ? (
        <PosPill>{row.pos}</PosPill>
      ) : null}
      {when}
    </>
  )
}

function RankedList({
  rows,
  numbered,
  onRetry,
}: {
  rows: readonly RankedWordView[]
  numbered: boolean
  onRetry?: RetryHandler
}) {
  return (
    <ol>
      {rows.map((row, index) => (
        <li key={row.href} className="border-border-subtle border-t last:border-b">
          <RankRow
            href={row.href}
            index={numbered ? pad2(index + 1) : undefined}
            marker={numbered ? undefined : <StatusDot status={row.status} className="ml-2xs" />}
            word={<AccentedWordMark word={row.word} />}
            wordTone={WORD_TONE[row.status]}
            gloss={row.status === 'succeeded' ? row.gloss : undefined}
            note={
              row.status !== 'succeeded' && row.statusNote != null ? (
                <StatusNote note={row.statusNote} status={row.status} />
              ) : undefined
            }
            meta={rowMeta(row, onRetry)}
          />
        </li>
      ))}
    </ol>
  )
}

const WORD_TONE = {
  succeeded: 'default',
  running: 'shimmer',
  pending: 'muted',
  failed: 'muted',
} satisfies Record<WordStatus, RankRowProps['wordTone']>

function Column({ title, sub, children }: { title: ReactNode; sub: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <h2 className="font-serif text-2xl font-medium leading-snug tracking-tighter">{title}</h2>
        <p className="text-sm text-muted-foreground leading-normal">{sub}</p>
      </div>
      {children}
    </div>
  )
}

export type ReadingRoomProps = {
  mostLookedUp: readonly RankedWordView[]
  recentlyAdded: readonly RankedWordView[]
  /** Injected re-queue for failed rows' Retry — a `requestWordBuild` bound to
   *  the study language. Omitted (Storybook) ⇒ a static, inert Retry link. */
  onRetry?: RetryHandler
}

export function ReadingRoom({ mostLookedUp, recentlyAdded, onRetry }: ReadingRoomProps) {
  return (
    <section className="flex flex-col gap-xl">
      <SectionRule label="The reading room" meta="Recent activity · updates hourly" />
      <div className="grid grid-cols-1 gap-x-3xl gap-y-2xl lg:grid-cols-2">
        <Column
          title={
            <>
              Most looked up <em className="font-normal text-seal">this week</em>
            </>
          }
          sub="A small chronicle of what learners are puzzling through. Updated hourly."
        >
          <RankedList rows={mostLookedUp} numbered onRetry={onRetry} />
        </Column>
        <Column
          title={
            <>
              Recently <em className="font-normal text-seal">added</em>
            </>
          }
          sub="The newest entries Kotodama has written into your library."
        >
          <RankedList rows={recentlyAdded} numbered={false} onRetry={onRetry} />
        </Column>
      </div>
    </section>
  )
}
