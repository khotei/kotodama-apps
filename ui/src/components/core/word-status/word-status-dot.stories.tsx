import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WordStatusDot } from './word-status'

const meta: Meta<typeof WordStatusDot> = {
  title: 'Core/WordStatusDot',
  component: WordStatusDot,
}

export default meta

type Story = StoryObj<typeof WordStatusDot>

export const Ready: Story = { args: { status: 'succeeded' } }
export const Generating: Story = { args: { status: 'running' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Failed: Story = { args: { status: 'failed' } }

export const All: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <WordStatusDot status="succeeded" />
      <WordStatusDot status="running" />
      <WordStatusDot status="pending" />
      <WordStatusDot status="failed" />
    </div>
  ),
}
