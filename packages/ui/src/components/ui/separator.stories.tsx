import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
}

export default meta

type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-xs">
      <p className="text-sm">Meaning</p>
      <Separator className="my-3" />
      <p className="text-sm">Etymology</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>noun</span>
      <Separator orientation="vertical" />
      <span>feminine</span>
      <Separator orientation="vertical" />
      <span>countable</span>
    </div>
  ),
}
