import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = { args: { placeholder: 'Look up a word…' } }
export const WithValue: Story = { args: { defaultValue: 'mariposa' } }
export const Disabled: Story = { args: { placeholder: 'Look up a word…', disabled: true } }
export const Password: Story = { args: { type: 'password', defaultValue: 'secret' } }
