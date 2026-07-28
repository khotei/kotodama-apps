import { Toaster } from '@kotodama/ui'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RetryButton } from './retry-button.client'

const meta: Meta<typeof RetryButton> = {
  title: 'Atoms/RetryButton',
  component: RetryButton,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RetryButton>

export const Default: Story = {
  args: { word: 'merendar', onRetry: () => new Promise((resolve) => setTimeout(resolve, 800)) },
}
