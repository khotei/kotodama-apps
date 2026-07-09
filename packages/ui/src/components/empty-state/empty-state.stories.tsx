import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon, SearchIcon, SparklesIcon, TriangleAlertIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof EmptyState>

export const NoResults: Story = {
  render: () => (
    <EmptyState
      icon={<SearchIcon />}
      title="No word matches “alfombrilla”."
      description="Your library doesn’t have it yet — Kotodama can write the entry now."
    >
      <Button size="lg">
        <SparklesIcon /> Generate “alfombrilla”
      </Button>
    </EmptyState>
  ),
}

export const NotFound: Story = {
  render: () => (
    <EmptyState
      icon={<BookOpenIcon />}
      eyebrow="Not in your library yet"
      title="resquemor"
      description="Look it up once and the full entry — depths, etymology, voices — is written for you."
      hint="Spanish · resquemor"
    >
      <Button size="lg">
        <SparklesIcon /> Create this entry
      </Button>
      <Button size="lg" variant="ghost">
        Search instead
      </Button>
    </EmptyState>
  ),
}

export const Failed: Story = {
  render: () => (
    <EmptyState
      icon={<TriangleAlertIcon />}
      tone="destructive"
      title="This entry didn’t finish"
      description="Something interrupted the writing. Your word is safe — try again whenever."
      hint="error: source_timeout · step 3 of 5"
    >
      <Button>Try again</Button>
      <Button variant="ghost">Back to library</Button>
    </EmptyState>
  ),
}
