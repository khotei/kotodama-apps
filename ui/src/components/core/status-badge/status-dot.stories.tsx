import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusDot } from './status-badge'

const meta: Meta<typeof StatusDot> = {
  title: 'Core/StatusDot',
  component: StatusDot,
}

export default meta

type Story = StoryObj<typeof StatusDot>

export const Ready: Story = { args: { status: 'ready' } }
export const Generating: Story = { args: { status: 'generating' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Failed: Story = { args: { status: 'failed' } }

export const All: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusDot status="ready" />
      <StatusDot status="generating" />
      <StatusDot status="pending" />
      <StatusDot status="failed" />
    </div>
  ),
}
