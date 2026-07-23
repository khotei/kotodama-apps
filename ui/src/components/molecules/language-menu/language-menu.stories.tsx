import type { Meta, StoryObj } from '@storybook/react-vite'
import { LanguageMenu } from './language-menu.client'

const meta: Meta<typeof LanguageMenu> = {
  title: 'Molecules/LanguageMenu',
  component: LanguageMenu,
}

export default meta
type Story = StoryObj<typeof LanguageMenu>

export const Default: Story = {}

export const Compact: Story = {
  args: { compact: true },
}
