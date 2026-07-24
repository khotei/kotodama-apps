import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListenButton } from './listen-button.client'

const meta: Meta<typeof ListenButton> = {
  title: 'Atoms/ListenButton',
  component: ListenButton,
}

export default meta
type Story = StoryObj<typeof ListenButton>

export const Default: Story = { args: { text: 'mariposa', lang: 'es-ES' } }
