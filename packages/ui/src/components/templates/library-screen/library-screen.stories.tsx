import { LibraryHero, ReadingRoom, WordOfTheDay } from '@kotodama/ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { LibraryScreen } from './library-screen'

// A Page story = the slot template filled with mock-fed organisms, exactly as
// apps/web fills the same slots with data containers. The composition — which
// organisms, in what order — reads identically here and in the Next route.
const meta: Meta<typeof LibraryScreen> = {
  title: 'Pages/Library',
  component: LibraryScreen,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof LibraryScreen>

export const Populated: Story = {
  render: () => (
    <div className="mx-auto max-w-[1160px] px-5 md:px-10">
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
    </div>
  ),
}
