import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Overline } from './overline'

const meta: Meta<typeof Overline> = {
  title: 'Atoms/Overline',
  component: Overline,
}

export default meta

type Story = StoryObj<typeof Overline>

export const Default: Story = { args: { children: 'Etymology' } }
export const WiderTracking: Story = {
  args: { children: 'At a glance', className: 'tracking-caps' },
}
