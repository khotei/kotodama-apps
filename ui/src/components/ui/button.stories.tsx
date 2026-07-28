import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: 'Look up' } }
export const Accent: Story = { args: { variant: 'accent', children: 'Generate' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Cancel' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Saved' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Skip' } }
export const Link: Story = { args: { variant: 'link', children: 'Learn more' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }
export const Disabled: Story = { args: { disabled: true, children: 'Look up' } }

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Next">
        <ArrowRightIcon />
      </Button>
    </div>
  ),
}
