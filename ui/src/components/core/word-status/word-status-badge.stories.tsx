import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WordStatusBadge } from './word-status'

const meta: Meta<typeof WordStatusBadge> = {
  title: 'Core/WordStatusBadge',
  component: WordStatusBadge,
  argTypes: {
    status: { control: 'select', options: ['succeeded', 'running', 'pending', 'failed'] },
  },
}

export default meta

type Story = StoryObj<typeof WordStatusBadge>

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
      <WordStatusBadge status="succeeded" />
      <WordStatusBadge status="running" />
      <WordStatusBadge status="pending" />
      <WordStatusBadge status="failed" />
    </div>
  ),
}
