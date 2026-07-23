import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModeMenu } from './mode-menu.client'

const meta: Meta<typeof ModeMenu> = {
  title: 'Molecules/ModeMenu',
  component: ModeMenu,
}

export default meta
type Story = StoryObj<typeof ModeMenu>

export const Default: Story = {}

export const CurrentChecked: Story = {
  args: { mode: 'light' },
}
