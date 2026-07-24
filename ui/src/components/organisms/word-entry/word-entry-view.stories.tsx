import type { Meta, StoryObj } from '@storybook/react-vite'
import { READY_WORD_FIXTURE } from '../../../fixtures/word.fixture'
import { WordEntryView } from './word-entry-view'

const meta: Meta<typeof WordEntryView> = {
  title: 'Organisms/WordEntryView',
  component: WordEntryView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1160px] px-5 md:px-10">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WordEntryView>

export const Ready: Story = {
  args: {
    word: READY_WORD_FIXTURE,
    language: 'es',
    libraryHref: '/',
    searchHref: '/search',
  },
}
