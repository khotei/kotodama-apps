import { Badge, Button, RankRow, SectionRule, StatusBadge } from '@kotodama/ui'
import { BookmarkIcon, RotateCcwIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { AccentedWordMark } from './accented-word'
import type { RankedWordView } from './library.view'

function rowMeta(row: RankedWordView) {
  const when = <span className="font-mono text-[11px] text-muted-foreground">{row.when}</span>
  if (row.status === 'failed') {
    return (
      <>
        <Button variant="outline" size="sm">
          <RotateCcwIcon /> Retry
        </Button>
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
        <BookmarkIcon className="size-4 fill-primary text-primary" />
      ) : row.pos != null ? (
        <Badge variant="outline" className="font-mono text-[10.5px]">
          {row.pos}
        </Badge>
      ) : null}
      {when}
    </>
  )
}

function RankedList({ rows, numbered }: { rows: readonly RankedWordView[]; numbered: boolean }) {
  return (
    <ol className="mt-4 border-border border-t">
      {rows.map((row, index) => (
        <li key={accentedKey(row)}>
          <RankRow
            href={row.href}
            index={numbered ? String(index + 1).padStart(2, '0') : undefined}
            word={<AccentedWordMark word={row.word} />}
            gloss={row.status === 'ready' ? row.gloss : undefined}
            note={row.status !== 'ready' ? row.statusNote : undefined}
            meta={rowMeta(row)}
          />
        </li>
      ))}
    </ol>
  )
}

function accentedKey(row: RankedWordView) {
  return `${row.word.pre}${row.word.stress ?? ''}${row.word.post ?? ''}`
}

function Column({ title, sub, children }: { title: ReactNode; sub: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-[26px] leading-snug">{title}</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>
      {children}
    </div>
  )
}

export type ReadingRoomProps = {
  mostLookedUp: readonly RankedWordView[]
  recentlyAdded: readonly RankedWordView[]
}

export function ReadingRoom({ mostLookedUp, recentlyAdded }: ReadingRoomProps) {
  return (
    <section className="mt-16 pb-20">
      <SectionRule label="The reading room" meta="Recent activity · updates hourly" />
      <div className="mt-7 grid gap-16 lg:grid-cols-2">
        <Column
          title={
            <>
              Most looked up <em className="text-primary">this week</em>
            </>
          }
          sub="A small chronicle of what learners are puzzling through. Updated hourly."
        >
          <RankedList rows={mostLookedUp} numbered />
        </Column>
        <Column
          title={
            <>
              Recently <em className="text-primary">added</em>
            </>
          }
          sub="The newest entries Kotodama has written into your library."
        >
          <RankedList rows={recentlyAdded} numbered={false} />
        </Column>
      </div>
    </section>
  )
}
