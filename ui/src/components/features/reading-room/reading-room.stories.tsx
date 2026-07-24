import type { Meta, StoryObj } from '@storybook/react-vite'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { ReadingRoom } from './reading-room'

const meta: Meta<typeof ReadingRoom> = {
  title: 'Features/ReadingRoom',
  component: ReadingRoom,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ReadingRoom>

export const Default: Story = {
  args: {
    mostLookedUp: LIBRARY_VIEW_MOCK.mostLookedUp,
    recentlyAdded: LIBRARY_VIEW_MOCK.recentlyAdded,
  },
}
