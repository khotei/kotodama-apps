import type { Meta, StoryObj } from '@storybook/react-vite'
import { WORD_STATE_MOCKS } from '../../../fixtures/word.fixture'
import { WordScreen } from './word-screen'

// Pages/Word · one story per lifecycle state — the same WordScreen the Next
// route renders, fed a mock model instead of the resolved loader value.
const meta: Meta<typeof WordScreen> = {
  title: 'Pages/Word',
  component: WordScreen,
  parameters: { layout: 'fullscreen' },
  args: { language: 'es', libraryHref: '/', searchHref: '/search' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1160px] px-5 md:px-10">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WordScreen>

export const Ready: Story = {
  args: { model: WORD_STATE_MOCKS.mariposa, word: 'mariposa' },
}

export const Generating: Story = {
  args: { model: WORD_STATE_MOCKS.empalagar, word: 'empalagar' },
}

export const Failed: Story = {
  args: { model: WORD_STATE_MOCKS.merendar, word: 'merendar' },
}

export const NotFound: Story = {
  args: { model: null, word: 'alfombrilla' },
}
