import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Sparkline } from './sparkline'

const meta: Meta<typeof Sparkline> = {
  title: 'Atoms/Sparkline',
  component: Sparkline,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof Sparkline>

export const Default: Story = {
  args: {
    values: [4, 5, 5, 6, 8, 9, 12, 14, 13, 16, 18, 22],
    startLabel: '1800',
    endLabel: '2024',
    className: 'max-w-[300px]',
  },
}

export const Flat: Story = {
  args: { values: [5, 5, 5, 5], className: 'max-w-[300px]' },
}
