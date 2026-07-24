import type { Meta, StoryObj } from '@storybook/react-vite'
import { TierChip } from './tier-chip'

const meta: Meta<typeof TierChip> = {
  title: 'Core/TierChip',
  component: TierChip,
  argTypes: {
    tier: { control: 'select', options: ['everyday', 'cultural', 'formal', 'rare'] },
  },
}

export default meta

type Story = StoryObj<typeof TierChip>

export const Everyday: Story = { args: { tier: 'everyday' } }
export const Cultural: Story = { args: { tier: 'cultural' } }
export const Formal: Story = { args: { tier: 'formal' } }
export const Rare: Story = { args: { tier: 'rare' } }

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <TierChip tier="everyday" />
      <TierChip tier="cultural" />
      <TierChip tier="formal" />
      <TierChip tier="rare" />
    </div>
  ),
}
