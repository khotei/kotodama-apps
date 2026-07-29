import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import { AppControls } from './app-controls'

// Organisms/AppControls · the standard `controls` filling for the header bar.
// The <Show> gates decide which pieces render: desktop = trigger + full
// language menu, mobile = magnifier link + compact badge.
const meta: Meta<typeof AppControls> = {
  title: 'Organisms/AppControls',
  component: AppControls,
  args: {
    search: { label: 'Search or jump…', shortcut: 'k', onTrigger: () => {}, mobileHref: '/search' },
    language: { current: CURRENT_LANGUAGE_MOCK, list: LANGUAGE_OPTIONS_MOCK },
  },
}

export default meta
type Story = StoryObj<typeof AppControls>

export const Default: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'iphonex' } },
}
