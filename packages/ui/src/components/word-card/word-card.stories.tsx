import type { Meta, StoryObj } from '@storybook/react-vite'
import { WordCard } from './word-card'

const meta: Meta<typeof WordCard> = {
  title: 'Skeleton/WordCard',
  component: WordCard,
}

export default meta

type Story = StoryObj<typeof WordCard>

// The ready state — the walking-skeleton component with full content.
export const Ready: Story = {
  args: {
    word: 'lumen',
    language: 'en',
    status: 'ready',
    coreDefinition: 'The SI unit of luminous flux, measuring perceived light.',
    className: 'max-w-lg',
  },
}

// A still-building word: no definition yet, a status badge instead.
export const Building: Story = {
  args: {
    word: 'lumen',
    language: 'en',
    status: 'generating',
    className: 'max-w-lg',
  },
}
