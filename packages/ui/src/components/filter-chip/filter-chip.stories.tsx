import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookmarkIcon } from 'lucide-react'
import { FilterChip } from './filter-chip'

const meta: Meta<typeof FilterChip> = {
  title: 'Atoms/FilterChip',
  component: FilterChip,
}

export default meta

type Story = StoryObj<typeof FilterChip>

export const Unpressed: Story = {
  args: { icon: <BookmarkIcon />, children: 'Saved only' },
}

export const Pressed: Story = {
  args: { icon: <BookmarkIcon />, children: 'Saved only', pressed: true },
}

export const SealTone: Story = {
  args: { children: 'Featured', pressed: true, tone: 'seal' },
}

export const Row: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip icon={<BookmarkIcon />}>Saved only</FilterChip>
      <FilterChip icon={<BookmarkIcon />} pressed>
        Saved only
      </FilterChip>
      <FilterChip pressed tone="seal">
        Featured
      </FilterChip>
    </div>
  ),
}
