import type { Meta, StoryObj } from '@storybook/react-vite'
import { Seal } from './seal'

const meta: Meta<typeof Seal> = {
  title: 'Atoms/Seal',
  component: Seal,
}

export default meta

type Story = StoryObj<typeof Seal>

export const Default: Story = {}

export const Small: Story = {
  args: { size: 'sm' },
}
