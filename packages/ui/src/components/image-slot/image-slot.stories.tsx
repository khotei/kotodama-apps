import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageSlot } from './image-slot'

const meta: Meta<typeof ImageSlot> = {
  title: 'Atoms/ImageSlot',
  component: ImageSlot,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof ImageSlot>

export const Rect: Story = {
  args: { label: 'Drop an image · a monarch on a lilac branch', className: 'h-[260px]' },
}

export const Circle: Story = {
  render: () => <ImageSlot shape="circle" className="size-9" />,
}
