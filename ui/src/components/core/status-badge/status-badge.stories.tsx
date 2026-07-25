import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBadge } from './status-badge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Core/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: { control: 'select', options: ['ready', 'generating', 'pending', 'failed'] },
  },
}

export default meta

type Story = StoryObj<typeof StatusBadge>

export const Ready: Story = { args: { status: 'ready' } }
export const Generating: Story = { args: { status: 'generating' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Failed: Story = { args: { status: 'failed' } }

export const CustomLabel: Story = {
  args: { status: 'generating', children: 'Spanish · arriving' },
}

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <StatusBadge status="ready" />
      <StatusBadge status="generating" />
      <StatusBadge status="pending" />
      <StatusBadge status="failed" />
    </div>
  ),
}
