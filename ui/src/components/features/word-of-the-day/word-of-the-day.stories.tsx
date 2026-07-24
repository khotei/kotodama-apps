import type { Meta, StoryObj } from '@storybook/react-vite'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { WordOfTheDay } from './word-of-the-day.client'

const meta: Meta<typeof WordOfTheDay> = {
  title: 'Features/WordOfTheDay',
  component: WordOfTheDay,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof WordOfTheDay>

export const Default: Story = {
  args: { wotds: LIBRARY_VIEW_MOCK.wordsOfTheDay },
}
