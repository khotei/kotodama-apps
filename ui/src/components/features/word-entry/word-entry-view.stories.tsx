import type { Meta, StoryObj } from '@storybook/react-vite'
import { READY_WORD_FIXTURE } from '../../../fixtures/word.fixture'
import { SiteContainer } from '../../atoms/site-container'
import { WordEntryView } from './word-entry-view'

const meta: Meta<typeof WordEntryView> = {
  title: 'Features/WordEntryView',
  component: WordEntryView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <SiteContainer>
        <Story />
      </SiteContainer>
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
