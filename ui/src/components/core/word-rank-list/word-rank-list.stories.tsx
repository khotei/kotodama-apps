import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { WordRankList } from './word-rank-list'

const meta: Meta<typeof WordRankList> = {
  title: 'Core/WordRankList',
  component: WordRankList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>],
}

export default meta

type Story = StoryObj<typeof WordRankList>

export const Default: Story = { args: { words: LIBRARY_VIEW_MOCK.mostLookedUp } }
