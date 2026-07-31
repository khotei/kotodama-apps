import { Toaster } from '@kotodama/ui'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { LIBRARY_VIEW_MOCK } from '../../../fixtures/library.fixture'
import { WordRecentList } from './word-recent-list'

const meta: Meta<typeof WordRecentList> = {
  title: 'Core/WordRecentList',
  component: WordRecentList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>],
}

export default meta

type Story = StoryObj<typeof WordRecentList>

/** The full lifecycle: arriving · queued · didn't-settle · saved · ready. No
 *  `onRetry`, so the failed row degrades to a plain Failed status badge. */
export const Default: Story = { args: { words: LIBRARY_VIEW_MOCK.recentlyAdded } }

/** Injected `onRetry` turns the failed row's Retry live — clicking re-queues the word. */
export const WithRetry: Story = {
  args: { words: LIBRARY_VIEW_MOCK.recentlyAdded, onRetry: fn() },
  decorators: [
    (Story) => (
      <>
        {Story()}
        <Toaster />
      </>
    ),
  ],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledWith('merendar')
  },
}
