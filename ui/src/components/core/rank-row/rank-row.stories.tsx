import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookmarkIcon } from 'lucide-react'
import { StatusBadge } from '../../core/status-badge'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { RankRow } from './rank-row'

const meta: Meta<typeof RankRow> = {
  title: 'Core/RankRow',
  component: RankRow,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof RankRow>

export const ReadingRoom: Story = {
  render: () => (
    <div className="max-w-xl border-border border-t">
      <RankRow
        href="#"
        index="01"
        word="mariposa"
        gloss="butterfly"
        meta={
          <>
            <Badge variant="outline" className="font-mono text-2xs">
              noun
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">2h ago</span>
          </>
        }
      />
      <RankRow
        href="#"
        index="02"
        word="resquemor"
        meta={<StatusBadge status="running">Spanish · arriving</StatusBadge>}
      />
      <RankRow href="#" index="03" word="duende" meta={<StatusBadge status="pending" />} />
      <RankRow
        href="#"
        index="04"
        word="alfombrilla"
        meta={
          <Button variant="outline" size="sm">
            Retry
          </Button>
        }
      />
      <RankRow
        href="#"
        index="05"
        word="sobremesa"
        gloss="the lingering after a meal"
        meta={<BookmarkIcon className="size-4 fill-primary text-primary" />}
      />
    </div>
  ),
}
