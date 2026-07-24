import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandFab } from './command-fab.client'

// Mobile-only (hidden at md+) — the story opens in a phone viewport so it shows.
const meta: Meta<typeof CommandFab> = {
  title: 'Molecules/CommandFab',
  component: CommandFab,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'iphonex' } },
}

export default meta
type Story = StoryObj<typeof CommandFab>

export const Default: Story = {}
