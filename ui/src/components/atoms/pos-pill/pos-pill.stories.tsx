import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PosPill } from './pos-pill'

const meta: Meta<typeof PosPill> = {
  title: 'Atoms/PosPill',
  component: PosPill,
}

export default meta

type Story = StoryObj<typeof PosPill>

export const Noun: Story = { args: { children: 'n.' } }
export const Verb: Story = { args: { children: 'v.' } }

export const Row: Story = {
  render: () => (
    <div className="flex items-center gap-xs">
      <PosPill>n.</PosPill>
      <PosPill>v.</PosPill>
      <PosPill>adj.</PosPill>
      <PosPill>adv.</PosPill>
    </div>
  ),
}
