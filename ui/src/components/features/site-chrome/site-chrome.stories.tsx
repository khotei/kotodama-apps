import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { toast } from 'sonner'
import {
  CHROME_COMMANDS_MOCK,
  CHROME_DESKTOP_NAV_MOCK,
  CHROME_MOBILE_NAV_MOCK,
} from '../../../fixtures/chrome.fixture'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import { Toaster } from '../../ui/sonner'
import { SiteChrome } from './site-chrome.client'

// Features/SiteChrome · the whole public chrome fed by data alone — the same
// nav/commands/words the app injects, here from fixtures (commands toast). The
// active nav link derives from the mocked pathname, never from a prop.
const meta: Meta<typeof SiteChrome> = {
  title: 'Features/SiteChrome',
  component: SiteChrome,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster position="bottom-right" />
      </>
    ),
  ],
  args: {
    nav: {
      homeHref: '/',
      searchHref: '/search',
      desktop: CHROME_DESKTOP_NAV_MOCK,
      mobile: CHROME_MOBILE_NAV_MOCK,
    },
    commands: CHROME_COMMANDS_MOCK,
    words: {
      list: SEARCH_WORDS_MOCK,
      onSearch: (query) => query && toast(`Would search “${query}”`),
      onSelect: (word) => toast(`Would navigate to ${word.href}`),
    },
    language: { current: CURRENT_LANGUAGE_MOCK, list: LANGUAGE_OPTIONS_MOCK },
  },
}

export default meta
type Story = StoryObj<typeof SiteChrome>

export const Default: Story = {}

export const OnSearch: Story = {
  parameters: { nextjs: { navigation: { pathname: '/search' } } },
}
