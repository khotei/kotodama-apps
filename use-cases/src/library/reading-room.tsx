import type { Language } from '@kotodama/store'
import { RankRow, SectionRule, StatusBadge } from '@kotodama/ui'
import { BookmarkIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { RetryLink } from '../words/retry-link'
import { RetryWordButton } from '../words/retry-word-button.client'
import { StatusNote } from '../words/status-note'
import { AccentedWordMark } from './accented-word'
import { accentedWordText, type RankedWordView } from './library.view'

type RetryAction = (language: Language, word: string) => Promise<void>

function rowMeta(row: RankedWordView, retryAction?: RetryAction) {
  const when = (
    <span className="font-mono text-[12px] text-faint-foreground tracking-[0.04em]">
      {row.when}
    </span>
  )
  if (row.status === 'failed') {
    return (
      <>
        {retryAction != null && row.language != null ? (
          <RetryWordButton
            language={row.language}
            word={accentedWordText(row.word)}
            retryAction={retryAction}
          />
        ) : (
          <RetryLink>Retry</RetryLink>
        )}
        {when}
      </>
    )
  }
  if (row.status !== 'ready') {
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
  retryAction,
}: {
  rows: readonly RankedWordView[]
  numbered: boolean
  retryAction?: RetryAction
}) {
  return (
    <ol className="mt-5">
      {rows.map((row, index) => (
        <li key={accentedKey(row)} className="border-border-subtle border-t last:border-b">
          <RankRow
            href={row.href}
            index={numbered ? String(index + 1).padStart(2, '0') : undefined}
            marker={numbered ? undefined : <StatusDot status={row.status} />}
            word={<AccentedWordMark word={row.word} />}
            wordTone={WORD_TONE[row.status]}
            gloss={row.status === 'ready' ? row.gloss : undefined}
            note={
              row.status !== 'ready' && row.statusNote != null ? (
                <StatusNote note={row.statusNote} status={row.status} />
              ) : undefined
            }
            meta={rowMeta(row, retryAction)}
          />
        </li>
      ))}
    </ol>
  )
}

function accentedKey(row: RankedWordView) {
  return `${row.word.pre}${row.word.stress ?? ''}${row.word.post ?? ''}`
}

function PosPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-grid h-6 min-w-9 place-items-center rounded-[5px] border bg-secondary px-[9px] font-mono text-[11px] text-muted-foreground tracking-[0.04em]">
      {children}
    </span>
  )
}

const DOT_BY_STATUS: Record<string, string> = {
  ready: 'bg-border-strong',
  generating: 'bg-seal',
  pending: 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--border-strong)]',
  failed: 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--destructive)]',
}

function StatusDot({ status }: { status: RankedWordView['status'] }) {
  return <span className={`ml-1 size-[7px] shrink-0 rounded-full ${DOT_BY_STATUS[status]}`} />
}

const WORD_TONE = {
  ready: 'default',
  generating: 'shimmer',
  pending: 'muted',
  failed: 'muted',
} as const

function Column({ title, sub, children }: { title: ReactNode; sub: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium leading-snug tracking-[-0.02em]">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-[1.5]">{sub}</p>
      {children}
    </div>
  )
}

export type ReadingRoomProps = {
  mostLookedUp: readonly RankedWordView[]
  recentlyAdded: readonly RankedWordView[]
  /** Injected Server Action for failed rows' Retry — `requestWordBuild`. */
  retryAction?: RetryAction
}

export function ReadingRoom({ mostLookedUp, recentlyAdded, retryAction }: ReadingRoomProps) {
  return (
    <section className="mt-16 pb-20">
      <SectionRule label="The reading room" meta="Recent activity · updates hourly" />
      <div className="mt-7 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
        <Column
          title={
            <>
              Most looked up <em className="font-normal text-seal">this week</em>
            </>
          }
          sub="A small chronicle of what learners are puzzling through. Updated hourly."
        >
          <RankedList rows={mostLookedUp} numbered />
        </Column>
        <Column
          title={
            <>
              Recently <em className="font-normal text-seal">added</em>
            </>
          }
          sub="The newest entries Kotodama has written into your library."
        >
          <RankedList rows={recentlyAdded} numbered={false} retryAction={retryAction} />
        </Column>
      </div>
    </section>
  )
}
