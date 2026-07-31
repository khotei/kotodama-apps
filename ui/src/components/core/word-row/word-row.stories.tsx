import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookmarkIcon } from 'lucide-react'
import { PosPill } from '../../atoms/pos-pill'
import { RetryLink } from '../../atoms/retry-link'
import { Timestamp } from '../../atoms/timestamp'
import { StatusBadge, StatusDot } from '../status-badge'
import { StatusNote } from '../status-note'
import { WordRow } from './word-row'

const meta: Meta<typeof WordRow> = {
  title: 'Core/WordRow',
  component: WordRow,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>],
}

export default meta

type Story = StoryObj<typeof WordRow>

/** Ordinal lead · ready word · gloss · pos + time — the "most looked up" row. */
export const Ranked: Story = {
  render: () => (
    <WordRow>
      <WordRow.Lead>01</WordRow.Lead>
      <WordRow.Main>
        <WordRow.Word href="#">sobremesa</WordRow.Word>
        <WordRow.Gloss>the lingering talk after a meal</WordRow.Gloss>
      </WordRow.Main>
      <WordRow.Meta>
        <PosPill>n. f.</PosPill>
        <Timestamp>2 min ago</Timestamp>
      </WordRow.Meta>
    </WordRow>
  ),
}

/** Status-dot lead · ready + saved — a bookmarked "recently added" row. */
export const RecentSaved: Story = {
  render: () => (
    <WordRow>
      <WordRow.Lead>
        <StatusDot status="succeeded" className="ml-2xs" />
      </WordRow.Lead>
      <WordRow.Main>
        <WordRow.Word href="#">madrugar</WordRow.Word>
        <WordRow.Gloss>to get up very early</WordRow.Gloss>
      </WordRow.Main>
      <WordRow.Meta>
        <BookmarkIcon className="size-4 fill-seal text-seal" />
        <Timestamp>3 days ago</Timestamp>
      </WordRow.Meta>
    </WordRow>
  ),
}

/** Arriving: shimmer word tone · lang·status note · running badge. */
export const Arriving: Story = {
  render: () => (
    <WordRow>
      <WordRow.Lead>
        <StatusDot status="running" className="ml-2xs" />
      </WordRow.Lead>
      <WordRow.Main>
        <WordRow.Word href="#" tone="shimmer">
          empalagar
        </WordRow.Word>
        <WordRow.Note>
          <StatusNote note="Spanish · arriving" status="running" />
        </WordRow.Note>
      </WordRow.Main>
      <WordRow.Meta>
        <StatusBadge status="running" />
        <Timestamp>just now</Timestamp>
      </WordRow.Meta>
    </WordRow>
  ),
}

/** Failed: muted word tone · note · Retry affordance. */
export const Failed: Story = {
  render: () => (
    <WordRow>
      <WordRow.Lead>
        <StatusDot status="failed" className="ml-2xs" />
      </WordRow.Lead>
      <WordRow.Main>
        <WordRow.Word href="#" tone="muted">
          merendar
        </WordRow.Word>
        <WordRow.Note>
          <StatusNote note="Spanish · didn’t settle" status="failed" />
        </WordRow.Note>
      </WordRow.Main>
      <WordRow.Meta>
        <RetryLink>Retry</RetryLink>
        <Timestamp>1 hour ago</Timestamp>
      </WordRow.Meta>
    </WordRow>
  ),
}

/** Bare: only a `Main` + `Word` — no lead, no sub-line, no meta. */
export const WordOnly: Story = {
  render: () => (
    <WordRow>
      <WordRow.Main>
        <WordRow.Word href="#">duende</WordRow.Word>
      </WordRow.Main>
    </WordRow>
  ),
}
