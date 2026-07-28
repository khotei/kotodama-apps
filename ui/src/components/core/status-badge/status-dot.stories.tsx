import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusDot } from './status-badge'

const meta: Meta<typeof StatusDot> = {
  title: 'Core/StatusDot',
  component: StatusDot,
}

export default meta

type Story = StoryObj<typeof StatusDot>

export const Ready: Story = { args: { status: 'succeeded' } }
export const Generating: Story = { args: { status: 'running' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Failed: Story = { args: { status: 'failed' } }

export const All: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <StatusDot status="succeeded" />
      <StatusDot status="running" />
      <StatusDot status="pending" />
      <StatusDot status="failed" />
    </div>
  ),
}
