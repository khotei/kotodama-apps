import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from './kbd'

const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
}

export default meta

type Story = StoryObj<typeof Kbd>

export const Single: Story = { args: { children: 'K' } }

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}
