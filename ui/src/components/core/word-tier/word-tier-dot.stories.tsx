import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WordTierDot } from './word-tier'

const meta: Meta<typeof WordTierDot> = {
  title: 'Core/WordTierDot',
  component: WordTierDot,
  argTypes: {
    tier: { control: 'select', options: ['everyday', 'cultural', 'formal', 'rare'] },
  },
}

export default meta

type Story = StoryObj<typeof WordTierDot>

export const Everyday: Story = { args: { tier: 'everyday' } }
export const Cultural: Story = { args: { tier: 'cultural' } }
export const Formal: Story = { args: { tier: 'formal' } }
export const Rare: Story = { args: { tier: 'rare' } }

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <WordTierDot tier="everyday" />
      <WordTierDot tier="cultural" />
      <WordTierDot tier="formal" />
      <WordTierDot tier="rare" />
    </div>
  ),
}
