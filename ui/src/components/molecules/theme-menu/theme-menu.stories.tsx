import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ThemeMenu } from './theme-menu.client'

const meta: Meta<typeof ThemeMenu> = {
  title: 'Molecules/ThemeMenu',
  component: ThemeMenu,
}

export default meta
type Story = StoryObj<typeof ThemeMenu>

export const Default: Story = {}

export const CurrentChecked: Story = {
  args: { theme: 'light' },
}
