import { LibraryHero, ReadingRoom, WordOfTheDay } from '@kotodama/ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import { SiteShell } from '../../templates/site-shell'
import { LibraryScreen } from './library-screen'

// A Page story = the slot template filled with mock-fed organisms, exactly as
// apps/web fills the same slots with data containers. The composition — which
// organisms, in what order — reads identically here and in the Next route.
const meta: Meta<typeof LibraryScreen> = {
  title: 'Pages/Library',
  component: LibraryScreen,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <SiteShell paletteWords={SEARCH_WORDS_MOCK}>
        <Story />
      </SiteShell>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LibraryScreen>

export const Populated: Story = {
  render: () => (
    <LibraryScreen
      hero={
        <LibraryHero
          stats={LIBRARY_VIEW_MOCK.stats}
          tryWords={LIBRARY_VIEW_MOCK.tryWords}
          searchPath="/search"
        />
      }
      wordOfTheDay={<WordOfTheDay wotds={LIBRARY_VIEW_MOCK.wordsOfTheDay} />}
      readingRoom={
        <ReadingRoom
          mostLookedUp={LIBRARY_VIEW_MOCK.mostLookedUp}
          recentlyAdded={LIBRARY_VIEW_MOCK.recentlyAdded}
        />
      }
    />
  ),
}
