import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookmarkIcon } from 'lucide-react'
import { Chip } from './chip'

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
}

export default meta

type Story = StoryObj<typeof Chip>

export const Static: Story = {
  args: { children: 'Formal' },
}

export const Coloured: Story = {
  args: { className: 'text-tier-rare', children: 'Rare' },
}

export const Pressable: Story = {
  args: { pressable: true, leading: <BookmarkIcon />, children: 'Saved only' },
}

export const Pressed: Story = {
  args: { pressable: true, pressed: true, leading: <BookmarkIcon />, children: 'Saved only' },
}

export const Row: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-xs">
      <Chip className="text-tier-everyday">Everyday</Chip>
      <Chip className="text-tier-rare">Rare</Chip>
      <Chip pressable leading={<BookmarkIcon />}>
        Saved only
      </Chip>
      <Chip pressable pressed leading={<BookmarkIcon />}>
        Saved only
      </Chip>
    </div>
  ),
}
