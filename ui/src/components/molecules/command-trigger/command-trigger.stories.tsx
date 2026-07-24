import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandTrigger } from './command-trigger.client'

const meta: Meta<typeof CommandTrigger> = {
  title: 'Molecules/CommandTrigger',
  component: CommandTrigger,
  args: { label: 'Search or jump…', shortcut: 'k' },
}

export default meta
type Story = StoryObj<typeof CommandTrigger>

export const Default: Story = {}
