import type { Meta, StoryObj } from '@storybook/react-vite'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import { SiteShell } from '../../templates/site-shell'
import { SearchPage } from './search-page.client'

// Pages/Search · the client filter island over an injected word list, one story
// per reachable state (a real backend swaps the list for injected results).
const meta: Meta<typeof SearchPage> = {
  title: 'Pages/Search',
  component: SearchPage,
  parameters: { layout: 'fullscreen' },
  args: { generatePathPrefix: '/words/es/' },
  decorators: [
    (Story) => (
      <SiteShell active="search" paletteWords={SEARCH_WORDS_MOCK}>
        <Story />
      </SiteShell>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchPage>

export const Results: Story = {
  args: { words: SEARCH_WORDS_MOCK },
}

export const NoMatch: Story = {
  args: { words: SEARCH_WORDS_MOCK, initialQuery: 'alfombrilla' },
}

export const SavedEmpty: Story = {
  args: { words: SEARCH_WORDS_MOCK.filter((w) => !w.saved), initialSavedOnly: true },
}
