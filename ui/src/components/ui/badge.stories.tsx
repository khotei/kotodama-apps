import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'noun' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'saved' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'failed' } }
export const Outline: Story = { args: { variant: 'outline', children: 'rare' } }

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
