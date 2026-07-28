import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RetryLink } from './retry-link'

const meta: Meta<typeof RetryLink> = {
  title: 'Atoms/RetryLink',
  component: RetryLink,
}

export default meta
type Story = StoryObj<typeof RetryLink>

export const Default: Story = { args: { children: 'Retry' } }
export const Disabled: Story = { args: { children: 'Retry', disabled: true } }
