import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookmarkIcon } from 'lucide-react'
import { Toggle } from './toggle'

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
}

export default meta

type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: { 'aria-label': 'Save word', children: <BookmarkIcon /> },
}

export const Pressed: Story = {
  args: { 'aria-label': 'Save word', defaultPressed: true, children: <BookmarkIcon /> },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle aria-label="Save">
        <BookmarkIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Save">
        <BookmarkIcon />
      </Toggle>
      <Toggle size="sm" aria-label="Save">
        <BookmarkIcon />
      </Toggle>
      <Toggle size="lg" aria-label="Save">
        <BookmarkIcon />
      </Toggle>
    </div>
  ),
}
