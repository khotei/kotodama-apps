import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusBadge } from './status-badge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Core/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: { control: 'select', options: ['succeeded', 'running', 'pending', 'failed'] },
  },
}

export default meta

type Story = StoryObj<typeof StatusBadge>

export const Ready: Story = { args: { status: 'succeeded' } }
export const Generating: Story = { args: { status: 'running' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Failed: Story = { args: { status: 'failed' } }

export const CustomLabel: Story = {
  args: { status: 'running', children: 'Spanish · arriving' },
}

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <StatusBadge status="succeeded" />
      <StatusBadge status="running" />
      <StatusBadge status="pending" />
      <StatusBadge status="failed" />
    </div>
  ),
}
