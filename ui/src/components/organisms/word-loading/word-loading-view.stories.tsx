import type { Meta, StoryObj } from '@storybook/react-vite'
import { WordLoadingView } from './word-loading-view'

const meta: Meta<typeof WordLoadingView> = {
  title: 'Organisms/WordLoadingView',
  component: WordLoadingView,
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
type Story = StoryObj<typeof WordLoadingView>

export const Loading: Story = { args: { backHref: '/' } }
