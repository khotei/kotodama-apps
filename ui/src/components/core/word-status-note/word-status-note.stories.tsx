import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WordStatusNote } from './word-status-note'

const meta: Meta<typeof WordStatusNote> = {
  title: 'Core/WordStatusNote',
  component: WordStatusNote,
  decorators: [
    (Story) => (
      <span className="font-mono text-xs uppercase tracking-widest">
        <Story />
      </span>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WordStatusNote>

export const Arriving: Story = { args: { note: 'Spanish · arriving', status: 'running' } }
export const Queued: Story = { args: { note: 'Spanish · queued', status: 'pending' } }
export const Failed: Story = { args: { note: 'Spanish · didn’t settle', status: 'failed' } }
export const SingleSegment: Story = { args: { note: 'arriving', status: 'running' } }
