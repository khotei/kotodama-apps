import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandFab } from './command-fab.client'

// Mobile-only (hidden at md+); switch the viewport toolbar to a phone to see it.
const meta: Meta<typeof CommandFab> = {
  title: 'Molecules/CommandFab',
  component: CommandFab,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CommandFab>

export const Default: Story = {}
