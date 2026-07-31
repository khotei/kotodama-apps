import type { ReactNode } from 'react'
import type { RankedWordView } from '../../../views/library.view'
import { SectionRule } from '../../atoms/section-rule'
import { WordRankList } from '../../core/word-rank-list'
import { WordRecentList, type WordRecentListProps } from '../../core/word-recent-list'

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
  onRetry?: WordRecentListProps['onRetry']
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
          <WordRankList words={mostLookedUp} />
        </Column>
        <Column
          title={
            <>
              Recently <em className="font-normal text-seal">added</em>
            </>
          }
          sub="The newest entries Kotodama has written into your library."
        >
          <WordRecentList words={recentlyAdded} onRetry={onRetry} />
        </Column>
      </div>
    </section>
  )
}
