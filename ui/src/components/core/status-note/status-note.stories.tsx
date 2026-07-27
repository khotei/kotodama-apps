import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusNote } from './status-note'

const meta: Meta<typeof StatusNote> = {
  title: 'Core/StatusNote',
  component: StatusNote,
  decorators: [
    (Story) => (
      <span className="font-mono text-xs uppercase tracking-widest">
        <Story />
      </span>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StatusNote>

export const Arriving: Story = { args: { note: 'Spanish · arriving', status: 'running' } }
export const Queued: Story = { args: { note: 'Spanish · queued', status: 'pending' } }
export const Failed: Story = { args: { note: 'Spanish · didn’t settle', status: 'failed' } }
export const SingleSegment: Story = { args: { note: 'arriving', status: 'running' } }
