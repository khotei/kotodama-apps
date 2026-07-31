import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Timestamp } from './timestamp'

const meta: Meta<typeof Timestamp> = {
  title: 'Atoms/Timestamp',
  component: Timestamp,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof Timestamp>

export const Default: Story = { args: { children: '2 min ago' } }

export const JustNow: Story = { args: { children: 'just now' } }
