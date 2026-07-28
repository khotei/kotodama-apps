import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import { LanguageMenu } from './language-menu.client'

const meta: Meta<typeof LanguageMenu> = {
  title: 'Molecules/LanguageMenu',
  component: LanguageMenu,
  args: { current: CURRENT_LANGUAGE_MOCK, languages: LANGUAGE_OPTIONS_MOCK },
}

export default meta
type Story = StoryObj<typeof LanguageMenu>

export const Default: Story = {}

export const Compact: Story = {
  args: { compact: true },
}
