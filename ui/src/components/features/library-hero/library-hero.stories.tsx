import type { Meta, StoryObj } from '@storybook/react-vite'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { LibraryHero } from './library-hero'

const meta: Meta<typeof LibraryHero> = {
  title: 'Features/LibraryHero',
  component: LibraryHero,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof LibraryHero>

export const Default: Story = {
  args: {
    stats: LIBRARY_VIEW_MOCK.stats,
    tryWords: LIBRARY_VIEW_MOCK.tryWords,
    searchPath: '/search',
  },
}
